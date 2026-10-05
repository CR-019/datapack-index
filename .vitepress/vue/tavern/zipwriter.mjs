/**
 * 客户端 zip 打包（酒馆投稿工作台用）
 * =============================================================================
 * 为什么自己写而不引库：设计里点名的是 fflate（约 8 KB）。但工作台是**静态资源**，
 * 一点构建步骤都不想要 —— 而平台自带的 `CompressionStream("deflate-raw")` 已经
 * 能产出标准 deflate 流（Chrome 80+ / Firefox 113+ / Safari 16.4+，Node 18+ 也有），
 * 于是"零依赖、零构建、直接静态部署"成为可能。压缩控制粒度确实不如 fflate，
 * 但投稿包的需求只有两条：
 *   · 图片 → **store**（JPEG/PNG/WebP 已经压过，再 deflate 白费 CPU）
 *   · 文本 → deflate
 * 这正是 fflate 那份方案里要说的事，用平台能力表达即可。
 *
 * ⚠️ 产出的包必须能被后端 `src/zip.mjs` 收下（它只接受 store / deflate，
 *    拒绝加密、分卷、超限）。所以 E2E 里有一条用例专门拿这个模块打的包去投稿。
 *
 * 只实现 zip 的最小子集：本地文件头 + 数据 + 中央目录 + EOCD，UTF-8 名字。
 */

const METHOD_STORED = 0;
const METHOD_DEFLATE = 8;
const FLAG_UTF8 = 0x0800;
const VERSION_20 = 20;

/* ───────────────────────── CRC32 ───────────────────────── */

const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let index = 0; index < 256; index += 1) {
		let value = index;
		for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
		table[index] = value >>> 0;
	}
	return table;
})();

export function crc32(bytes) {
	let crc = 0xffffffff;
	for (let index = 0; index < bytes.length; index += 1) {
		crc = CRC_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

/* ───────────────────────── 压缩 ───────────────────────── */

/** 纯文本才值得 deflate；图片等已压缩二进制直接 store。 */
export function shouldCompress(path, bytes) {
	if (/\.(png|jpe?g|gif|webp|avif|zip|gz|mp4|webm|woff2?)$/i.test(path)) return false;
	if (bytes.length < 256) return false;              // 太小，deflate 的头都不够省
	if (typeof CompressionStream !== "function") return false;
	// 二进制里出现 NUL 的比例高就不压（简单启发式，避免把图片误判成文本）
	let nul = 0;
	const sample = bytes.subarray(0, Math.min(bytes.length, 2048));
	for (const byte of sample) if (byte === 0) nul += 1;
	return nul / sample.length < 0.01;
}

async function deflateRaw(bytes) {
	const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"));
	return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * 后端的"压缩炸弹"闸门是**压缩比 > 100:1 就整包拒绝**（src/zip.mjs）。
 * 而一段重复的表格 / 重复占位行 / ASCII 图**很容易**压到 175:1、300:1 —— 那是正常正文，
 * 不是攻击。作者收到的却是"疑似压缩炸弹"，完全无从下手（实测：3.4 万字节的重复表格行
 * 就足以被判成炸弹）。所以这里自己先看一眼压缩比：太夸张就退回 store
 * （stored 条目的比值恒为 1，永远不会被那道闸门拦下），代价只是一点体积。
 */
const MAX_COMPRESSION_RATIO = 90;

/* ───────────────────────── 打包 ───────────────────────── */

function dosDateTime(date = new Date()) {
	const year = Math.max(1980, date.getFullYear());
	return {
		time: ((date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2)) & 0xffff,
		date: (((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()) & 0xffff,
	};
}

/** 把 File / {name, data} 列表打成一个 zip（Uint8Array）。 */
export async function zipFiles(entries, { date = new Date() } = {}) {
	const encoder = new TextEncoder();
	const stamp = dosDateTime(date);
	const prepared = [];

	for (const entry of entries) {
		const name = String(entry.name ?? entry.path ?? "").replace(/^\/+/, "");
		if (!name) throw new Error("zip 条目缺少 name");
		const raw = entry.data instanceof Uint8Array
			? entry.data
			: new Uint8Array(await (entry.data instanceof Blob ? entry.data.arrayBuffer() : new Response(entry.data).arrayBuffer()));
		const compress = entry.compressed ?? shouldCompress(name, raw);
		let data = compress ? await deflateRaw(raw) : raw;
		let method = compress ? METHOD_DEFLATE : METHOD_STORED;
		if (compress && raw.length / data.length > MAX_COMPRESSION_RATIO) {
			data = raw;
			method = METHOD_STORED;
		}
		prepared.push({
			nameBytes: encoder.encode(name),
			method,
			rawSize: raw.length,
			data,
			crc: crc32(raw),
		});
	}

	const localParts = [];
	const centralParts = [];
	let offset = 0;

	for (const item of prepared) {
		const header = new Uint8Array(30 + item.nameBytes.length);
		const view = new DataView(header.buffer);
		view.setUint32(0, 0x04034b50, true);            // 本地文件头签名
		view.setUint16(4, VERSION_20, true);
		view.setUint16(6, FLAG_UTF8, true);
		view.setUint16(8, item.method, true);
		view.setUint16(10, stamp.time, true);
		view.setUint16(12, stamp.date, true);
		view.setUint32(14, item.crc, true);
		view.setUint32(18, item.data.length, true);     // 压缩后大小（已知，所以不用数据描述符）
		view.setUint32(22, item.rawSize, true);
		view.setUint16(26, item.nameBytes.length, true);
		view.setUint16(28, 0, true);
		header.set(item.nameBytes, 30);
		localParts.push(header, item.data);

		const central = new Uint8Array(46 + item.nameBytes.length);
		const centralView = new DataView(central.buffer);
		centralView.setUint32(0, 0x02014b50, true);     // 中央目录签名
		centralView.setUint16(4, VERSION_20, true);
		centralView.setUint16(6, VERSION_20, true);
		centralView.setUint16(8, FLAG_UTF8, true);
		centralView.setUint16(10, item.method, true);
		centralView.setUint16(12, stamp.time, true);
		centralView.setUint16(14, stamp.date, true);
		centralView.setUint32(16, item.crc, true);
		centralView.setUint32(20, item.data.length, true);
		centralView.setUint32(24, item.rawSize, true);
		centralView.setUint16(28, item.nameBytes.length, true);
		centralView.setUint32(42, offset, true);        // 本地头偏移
		central.set(item.nameBytes, 46);
		centralParts.push(central);

		offset += header.length + item.data.length;
	}

	const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
	const end = new Uint8Array(22);
	const endView = new DataView(end.buffer);
	endView.setUint32(0, 0x06054b50, true);             // EOCD 签名
	endView.setUint16(8, prepared.length, true);
	endView.setUint16(10, prepared.length, true);
	endView.setUint32(12, centralSize, true);
	endView.setUint32(16, offset, true);

	const total = offset + centralSize + end.length;
	const output = new Uint8Array(total);
	let cursor = 0;
	for (const part of [...localParts, ...centralParts, end]) {
		output.set(part, cursor);
		cursor += part.length;
	}
	return output;
}
