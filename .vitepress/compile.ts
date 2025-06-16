import {NBT} from "./NBTStructure";
import fs from "fs";
import path from "path";
import {compile} from "./MCFPPNBTParser";

async function sha256(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkCache(code: string): Promise<NBT | null> {
    const hashValue = await sha256(code);
    const cacheFilePath = `/nbt-json/cache/${hashValue}.json`;
    if (fs.existsSync(cacheFilePath)) {
        const jsonString = fs.readFileSync(cacheFilePath, 'utf-8');
        const nbt = await NBT.fromJSON(JSON.parse(jsonString));
        nbt.namespace = "";
        return nbt;
    }
    return null;
}

export async function compileFiles(){
    //读取resources\nbt下的所有mcfpp代码文件
    const files = fs.readdirSync('resources/nbt', {recursive: true, encoding: 'utf-8'});
    for (const file of files) {
        // 确保是字符串类型后再调用字符串方法
        if (typeof file === 'string' && file.endsWith(".mcfpp")) {
            console.log("Compiling " + file);

            // 使用 path.join 更安全地拼接路径
            const filePath = path.join('resources', 'nbt', file);
            const code = fs.readFileSync(filePath, 'utf-8');

            // 获取命名空间
            const index = file.lastIndexOf(path.sep);
            const namespace = index !== -1
                ? file.substring(0, index).replace(path.sep, ".")
                : '';

            compile(code, namespace).then(result => result.forEach((nbt) => {
                const jsonString = JSON.stringify(nbt.toJSON(), null , 4);
                const outputPath = path.join(
                    'resources','nbt-json',
                    nbt.namespace.replace(".", path.sep),
                    `${nbt.name}.json`
                );
                // 确保目录存在
                fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                console.log("Output: " + outputPath)
                fs.writeFileSync(outputPath, jsonString);
            }));
        }
    }
}


compileFiles()