"""Desktop manager for ``public/bug_list.json``.

The program intentionally uses only Python's standard library.  It can add and
delete Minecraft: Java Edition issues, and can run ``make_bug_list.py`` while
showing its output in the same window.
"""

from __future__ import annotations

import argparse
import ctypes
import re
import subprocess
import sys
from concurrent.futures import Future, ThreadPoolExecutor
from datetime import date
from pathlib import Path
from typing import Any, Callable

import tkinter as tk
import tkinter.font as tkfont
from tkinter import messagebox, ttk

from make_bug_list import (
    DEFAULT_BUG_LIST,
    BugListError,
    classify_status,
    fetch_issue,
    load_bug_list,
    normalize_issue_key,
    sort_bug_list,
    write_bug_list,
)


SCRIPT_PATH = Path(__file__).resolve().with_name("make_bug_list.py")

STATUS_LABELS = {
    "Unconfirmed": "未确认",
    "Confirmed": "已确认",
    "wont_fix": "不予修复",
    "intended": "有意为之",
    "invalid": "无效",
    "fixed": "已修复",
}


def _natural_version_key(name: str) -> tuple[tuple[int, int | str], ...]:
    """Return a case-insensitive natural key for Minecraft version names."""

    normalized = name.strip().casefold()
    if normalized.startswith("minecraft "):
        normalized = normalized.removeprefix("minecraft ")

    return tuple(
        (0, int(part)) if part.isdigit() else (1, part)
        for part in re.split(r"(\d+)", normalized)
        if part
    )


def oldest_affected_version(fields: dict[str, Any]) -> str:
    """Read the oldest named version from Mojira's ``fields.versions``."""

    raw_versions = fields.get("versions")
    if not isinstance(raw_versions, list):
        return ""

    candidates: list[tuple[str, date | None, int]] = []
    for index, version in enumerate(raw_versions):
        if not isinstance(version, dict):
            continue

        name = version.get("name")
        if not isinstance(name, str) or not name.strip():
            continue

        release_date: date | None = None
        raw_release_date = version.get("releaseDate")
        if isinstance(raw_release_date, str):
            try:
                release_date = date.fromisoformat(raw_release_date)
            except ValueError:
                pass

        candidates.append((name.strip(), release_date, index))

    if not candidates:
        return ""

    dated = [candidate for candidate in candidates if candidate[1] is not None]
    if not dated:
        return min(
            candidates,
            key=lambda candidate: (_natural_version_key(candidate[0]), candidate[2]),
        )[0]

    oldest_dated = min(
        dated,
        key=lambda candidate: (
            candidate[1] or date.max,
            _natural_version_key(candidate[0]),
            candidate[2],
        ),
    )

    # Some old Mojira versions do not have a releaseDate.  Only prefer such a
    # version when its Minecraft-style natural ordering places it before the
    # oldest dated candidate; otherwise the known release dates remain the
    # authoritative ordering.
    undated = [candidate for candidate in candidates if candidate[1] is None]
    if undated:
        oldest_undated = min(
            undated,
            key=lambda candidate: (_natural_version_key(candidate[0]), candidate[2]),
        )
        if _natural_version_key(oldest_undated[0]) < _natural_version_key(
            oldest_dated[0]
        ):
            return oldest_undated[0]

    return oldest_dated[0]


def enable_windows_dpi_awareness() -> None:
    """Prevent Windows from bitmap-scaling Tk and making the UI blurry."""

    if sys.platform != "win32":
        return

    try:
        user32 = ctypes.WinDLL("user32", use_last_error=True)
        set_context = user32.SetProcessDpiAwarenessContext
        set_context.argtypes = [ctypes.c_void_p]
        set_context.restype = ctypes.c_bool
        if set_context(ctypes.c_void_p(-4)):  # Per-Monitor DPI Aware V2
            return
    except (AttributeError, OSError):
        pass

    try:
        shcore = ctypes.WinDLL("shcore", use_last_error=True)
        set_awareness = shcore.SetProcessDpiAwareness
        set_awareness.argtypes = [ctypes.c_int]
        set_awareness.restype = ctypes.c_long
        if set_awareness(2) == 0:  # Per-Monitor DPI Aware
            return
    except (AttributeError, OSError):
        pass

    try:
        user32 = ctypes.WinDLL("user32", use_last_error=True)
        user32.SetProcessDPIAware()
    except (AttributeError, OSError):
        pass


def configure_tk_dpi(root: tk.Tk) -> float:
    """Configure Tk point scaling and return the current monitor scale."""

    dpi = 96.0
    if sys.platform == "win32":
        try:
            user32 = ctypes.WinDLL("user32", use_last_error=True)
            get_dpi = user32.GetDpiForWindow
            get_dpi.argtypes = [ctypes.c_void_p]
            get_dpi.restype = ctypes.c_uint
            detected_dpi = get_dpi(root.winfo_id())
            if detected_dpi:
                dpi = float(detected_dpi)
        except (AttributeError, OSError, tk.TclError):
            pass
    else:
        try:
            dpi = float(root.winfo_fpixels("1i"))
        except (ValueError, tk.TclError):
            pass

    root.tk.call("tk", "scaling", dpi / 72.0)
    return max(1.0, dpi / 96.0)


def scaled_pixels(value: int, scale: float) -> int:
    return max(1, round(value * scale))


def set_scaled_geometry(
    window: tk.Tk | tk.Toplevel,
    width: int,
    height: int,
    scale: float,
) -> None:
    window.geometry(
        f"{scaled_pixels(width, scale)}x{scaled_pixels(height, scale)}"
    )


def center_window_on_parent(
    window: tk.Toplevel,
    parent: tk.Misc,
    width: int,
    height: int,
    scale: float,
) -> None:
    """Size a child window and center it over its current parent window."""

    window_width = scaled_pixels(width, scale)
    window_height = scaled_pixels(height, scale)

    # Resolve pending layout and window-manager updates before reading the
    # parent's position.  This is important after moving it between monitors.
    parent.update_idletasks()
    window.update_idletasks()

    parent_x = parent.winfo_rootx()
    parent_y = parent.winfo_rooty()
    parent_width = parent.winfo_width()
    parent_height = parent.winfo_height()
    x = parent_x + (parent_width - window_width) // 2
    y = parent_y + (parent_height - window_height) // 2

    window.geometry(f"{window_width}x{window_height}+{x}+{y}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Manage public/bug_list.json in a GUI.")
    parser.add_argument(
        "path",
        nargs="?",
        type=Path,
        default=DEFAULT_BUG_LIST,
        help=f"JSON file to manage (default: {DEFAULT_BUG_LIST})",
    )
    return parser.parse_args()


def display_issue_key(raw_id: Any) -> str:
    try:
        return normalize_issue_key(raw_id)
    except BugListError:
        return str(raw_id)


def status_label(status: Any) -> str:
    value = str(status or "")
    return STATUS_LABELS.get(value, value or "未知")


class BugManagerApp:
    def __init__(self, root: tk.Tk, path: Path, ui_scale: float = 1.0) -> None:
        self.root = root
        self.path = path.resolve()
        self.ui_scale = ui_scale
        self.entries: list[dict[str, Any]] = []
        self.executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="bug-manager")
        self.sync_process: subprocess.Popen[str] | None = None

        self.root.title("Mojira 漏洞列表管理器")
        set_scaled_geometry(self.root, 1100, 720, self.ui_scale)
        self.root.minsize(
            scaled_pixels(820, self.ui_scale),
            scaled_pixels(520, self.ui_scale),
        )
        self.root.protocol("WM_DELETE_WINDOW", self.close)

        self._build_ui()
        self.reload_entries(show_error=True)

    def _build_ui(self) -> None:
        container = ttk.Frame(self.root, padding=12)
        container.pack(fill=tk.BOTH, expand=True)

        toolbar = ttk.Frame(container)
        toolbar.pack(fill=tk.X, pady=(0, 10))

        self.new_button = ttk.Button(toolbar, text="新建漏洞", command=self.open_new_bug)
        self.new_button.pack(side=tk.LEFT)

        self.delete_button = ttk.Button(
            toolbar,
            text="删除所选",
            command=self.delete_selected,
        )
        self.delete_button.pack(side=tk.LEFT, padx=(8, 0))

        self.sync_button = ttk.Button(
            toolbar,
            text="执行 make_bug_list.py",
            command=self.run_make_bug_list,
        )
        self.sync_button.pack(side=tk.LEFT, padx=(8, 0))

        ttk.Button(toolbar, text="重新载入", command=self.reload_entries).pack(
            side=tk.LEFT,
            padx=(8, 0),
        )

        self.path_label = ttk.Label(toolbar, text=str(self.path), anchor=tk.E)
        self.path_label.pack(side=tk.RIGHT, fill=tk.X, expand=True, padx=(16, 0))

        table_frame = ttk.Frame(container)
        table_frame.pack(fill=tk.BOTH, expand=True)
        table_frame.rowconfigure(0, weight=1)
        table_frame.columnconfigure(0, weight=1)

        default_font = tkfont.nametofont("TkDefaultFont", root=self.root)
        font_line_height = default_font.metrics("linespace")
        table_row_height = font_line_height + max(
            scaled_pixels(6, self.ui_scale),
            round(font_line_height * 0.35),
        )
        ttk.Style(self.root).configure(
            "BugList.Treeview",
            font=default_font,
            rowheight=table_row_height,
        )

        columns = ("id", "cn_title", "title", "status", "version")
        self.tree = ttk.Treeview(
            table_frame,
            columns=columns,
            show="headings",
            selectmode="extended",
            style="BugList.Treeview",
        )
        self.tree.heading("id", text="Mojira ID")
        self.tree.heading("cn_title", text="中文标题")
        self.tree.heading("title", text="英文标题")
        self.tree.heading("status", text="状态")
        self.tree.heading("version", text="影响版本")
        self.tree.column(
            "id",
            width=scaled_pixels(105, self.ui_scale),
            minwidth=scaled_pixels(90, self.ui_scale),
            stretch=False,
        )
        self.tree.column(
            "cn_title",
            width=scaled_pixels(280, self.ui_scale),
            minwidth=scaled_pixels(160, self.ui_scale),
        )
        self.tree.column(
            "title",
            width=scaled_pixels(390, self.ui_scale),
            minwidth=scaled_pixels(200, self.ui_scale),
        )
        self.tree.column(
            "status",
            width=scaled_pixels(95, self.ui_scale),
            minwidth=scaled_pixels(80, self.ui_scale),
            stretch=False,
        )
        self.tree.column(
            "version",
            width=scaled_pixels(105, self.ui_scale),
            minwidth=scaled_pixels(85, self.ui_scale),
            stretch=False,
        )

        vertical_scroll = ttk.Scrollbar(
            table_frame,
            orient=tk.VERTICAL,
            command=self.tree.yview,
        )
        horizontal_scroll = ttk.Scrollbar(
            table_frame,
            orient=tk.HORIZONTAL,
            command=self.tree.xview,
        )
        self.tree.configure(
            yscrollcommand=vertical_scroll.set,
            xscrollcommand=horizontal_scroll.set,
        )
        self.tree.bind("<Double-1>", self.edit_double_clicked)

        self.tree.grid(row=0, column=0, sticky="nsew")
        vertical_scroll.grid(row=0, column=1, sticky="ns")
        horizontal_scroll.grid(row=1, column=0, sticky="ew")

        log_group = ttk.LabelFrame(container, text="运行输出", padding=8)
        log_group.pack(fill=tk.BOTH, pady=(10, 0))
        self.log = tk.Text(log_group, height=9, wrap=tk.WORD, state=tk.DISABLED)
        log_scroll = ttk.Scrollbar(log_group, orient=tk.VERTICAL, command=self.log.yview)
        self.log.configure(yscrollcommand=log_scroll.set)
        self.log.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        log_scroll.pack(side=tk.RIGHT, fill=tk.Y)

        self.status_var = tk.StringVar(value="就绪")
        ttk.Label(container, textvariable=self.status_var, anchor=tk.W).pack(
            fill=tk.X,
            pady=(8, 0),
        )

    def set_busy(self, busy: bool) -> None:
        state = tk.DISABLED if busy else tk.NORMAL
        self.new_button.configure(state=state)
        self.delete_button.configure(state=state)
        self.sync_button.configure(state=state)

    def append_log(self, text: str) -> None:
        self.log.configure(state=tk.NORMAL)
        self.log.insert(tk.END, text)
        self.log.see(tk.END)
        self.log.configure(state=tk.DISABLED)

    def clear_log(self) -> None:
        self.log.configure(state=tk.NORMAL)
        self.log.delete("1.0", tk.END)
        self.log.configure(state=tk.DISABLED)

    def reload_entries(self, show_error: bool = True) -> None:
        try:
            self.entries = load_bug_list(self.path)
        except BugListError as error:
            self.entries = []
            if show_error:
                messagebox.showerror("无法读取漏洞列表", str(error), parent=self.root)

        for item in self.tree.get_children():
            self.tree.delete(item)

        for index, entry in enumerate(self.entries):
            self.tree.insert(
                "",
                tk.END,
                iid=str(index),
                values=(
                    display_issue_key(entry.get("id", "")),
                    entry.get("cn_title", ""),
                    entry.get("title", ""),
                    status_label(entry.get("status")),
                    entry.get("version", ""),
                ),
            )

        self.status_var.set(f"已载入 {len(self.entries)} 个漏洞")

    def open_new_bug(self) -> None:
        NewBugDialog(self)

    def edit_double_clicked(self, event: tk.Event) -> str | None:
        if self.sync_process is not None:
            return "break"
        if self.tree.identify_region(event.x, event.y) != "cell":
            return None

        item = self.tree.identify_row(event.y)
        if not item:
            return None

        try:
            entry = self.entries[int(item)]
        except (IndexError, ValueError):
            return "break"

        self.tree.selection_set(item)
        self.tree.focus(item)
        try:
            EditBugDialog(self, entry)
        except BugListError as error:
            messagebox.showerror("无法编辑漏洞", str(error), parent=self.root)
        return "break"

    def delete_selected(self) -> None:
        selected = self.tree.selection()
        if not selected:
            messagebox.showinfo("删除漏洞", "请先选择要删除的漏洞。", parent=self.root)
            return

        selected_indexes = sorted((int(item) for item in selected), reverse=True)
        selected_entries = [self.entries[index] for index in selected_indexes]
        labels = [
            f"{display_issue_key(entry.get('id', ''))}  {entry.get('cn_title', '')}"
            for entry in selected_entries
        ]
        preview = "\n".join(labels[:8])
        if len(labels) > 8:
            preview += f"\n……以及另外 {len(labels) - 8} 个"

        confirmed = messagebox.askyesno(
            "确认删除",
            f"确定从 bug_list.json 中删除以下漏洞吗？\n\n{preview}",
            parent=self.root,
        )
        if not confirmed:
            return

        try:
            latest_entries = load_bug_list(self.path)
            selected_keys = {
                normalize_issue_key(entry.get("id")) for entry in selected_entries
            }
            remaining = [
                entry
                for entry in latest_entries
                if normalize_issue_key(entry.get("id")) not in selected_keys
            ]
            removed_count = len(latest_entries) - len(remaining)
            write_bug_list(self.path, remaining)
        except (BugListError, OSError) as error:
            messagebox.showerror("删除失败", str(error), parent=self.root)
            return

        self.reload_entries(show_error=False)
        self.status_var.set(f"已删除 {removed_count} 个漏洞")

    def run_make_bug_list(self) -> None:
        if self.sync_process is not None:
            return

        self.clear_log()
        self.append_log(f"> {sys.executable} {SCRIPT_PATH} {self.path}\n\n")
        self.status_var.set("正在执行 make_bug_list.py……")
        self.set_busy(True)

        command = [sys.executable, "-u", str(SCRIPT_PATH), str(self.path)]
        creation_flags = subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0

        try:
            self.sync_process = subprocess.Popen(
                command,
                cwd=SCRIPT_PATH.parents[2],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                errors="replace",
                bufsize=1,
                creationflags=creation_flags,
            )
        except OSError as error:
            self.sync_process = None
            self.set_busy(False)
            messagebox.showerror("无法启动同步脚本", str(error), parent=self.root)
            return

        process = self.sync_process
        future = self.executor.submit(self._collect_process_output, process)
        self._poll_future(
            future,
            on_success=self._finish_sync,
            on_error=self._fail_sync,
        )

    @staticmethod
    def _collect_process_output(
        process: subprocess.Popen[str],
    ) -> tuple[int, list[str]]:
        lines: list[str] = []
        if process.stdout is not None:
            for line in process.stdout:
                lines.append(line)
        return process.wait(), lines

    def _finish_sync(self, result: tuple[int, list[str]]) -> None:
        exit_code, lines = result
        self.sync_process = None
        self.set_busy(False)
        self.append_log("".join(lines))

        if exit_code == 0:
            self.reload_entries(show_error=False)
            self.status_var.set("make_bug_list.py 执行完成")
            messagebox.showinfo(
                "同步完成",
                "漏洞标题和状态已更新，已修复漏洞已移动到列表末尾。",
                parent=self.root,
            )
        else:
            self.status_var.set(f"make_bug_list.py 执行失败（退出码 {exit_code}）")
            messagebox.showerror(
                "同步失败",
                "make_bug_list.py 执行失败，请查看窗口中的运行输出。",
                parent=self.root,
            )

    def _fail_sync(self, error: BaseException) -> None:
        self.sync_process = None
        self.set_busy(False)
        self.status_var.set("make_bug_list.py 执行失败")
        messagebox.showerror("同步失败", str(error), parent=self.root)

    def _poll_future(
        self,
        future: Future[Any],
        *,
        on_success: Callable[[Any], None],
        on_error: Callable[[BaseException], None],
    ) -> None:
        if not future.done():
            self.root.after(
                100,
                lambda: self._poll_future(
                    future,
                    on_success=on_success,
                    on_error=on_error,
                ),
            )
            return

        try:
            result = future.result()
        except BaseException as error:
            on_error(error)
        else:
            on_success(result)

    def close(self) -> None:
        if self.sync_process is not None and self.sync_process.poll() is None:
            should_close = messagebox.askyesno(
                "同步仍在运行",
                "make_bug_list.py 仍在运行。是否终止它并关闭窗口？",
                parent=self.root,
            )
            if not should_close:
                return
            self.sync_process.terminate()

        self.executor.shutdown(wait=False, cancel_futures=True)
        self.root.destroy()


class EditBugDialog:
    def __init__(self, app: BugManagerApp, entry: dict[str, Any]) -> None:
        self.app = app
        self.issue_key = normalize_issue_key(entry.get("id"))

        self.window = tk.Toplevel(app.root)
        self.window.withdraw()
        self.window.title(f"编辑漏洞 {self.issue_key}")
        self.window.minsize(
            scaled_pixels(560, app.ui_scale),
            scaled_pixels(360, app.ui_scale),
        )
        self.window.transient(app.root)

        content = ttk.Frame(self.window, padding=16)
        content.pack(fill=tk.BOTH, expand=True)

        ttk.Label(
            content,
            text=f"编辑 {self.issue_key}",
            font=("TkDefaultFont", 12, "bold"),
        ).pack(anchor=tk.W)
        ttk.Label(
            content,
            text=f"英文标题：{entry.get('title') or ''}",
            wraplength=scaled_pixels(600, app.ui_scale),
            justify=tk.LEFT,
        ).pack(anchor=tk.W, pady=(8, 2))
        ttk.Label(
            content,
            text=(
                "当前状态："
                f"{status_label(entry.get('status'))}（{entry.get('status', '')}）"
            ),
        ).pack(anchor=tk.W, pady=(0, 14))

        form = ttk.Frame(content)
        form.pack(fill=tk.BOTH, expand=True)
        form.columnconfigure(1, weight=1)
        form.rowconfigure(2, weight=1)

        ttk.Label(form, text="中文标题 *").grid(
            row=0,
            column=0,
            sticky="nw",
            padx=(0, 10),
            pady=5,
        )
        self.cn_title_var = tk.StringVar(value=str(entry.get("cn_title") or ""))
        cn_title_entry = ttk.Entry(form, textvariable=self.cn_title_var)
        cn_title_entry.grid(row=0, column=1, sticky="ew", pady=5)

        ttk.Label(form, text="影响版本 *").grid(
            row=1,
            column=0,
            sticky="nw",
            padx=(0, 10),
            pady=5,
        )
        self.version_var = tk.StringVar(value=str(entry.get("version") or ""))
        ttk.Entry(form, textvariable=self.version_var).grid(
            row=1,
            column=1,
            sticky="ew",
            pady=5,
        )

        ttk.Label(form, text="描述（可选）").grid(
            row=2,
            column=0,
            sticky="nw",
            padx=(0, 10),
            pady=5,
        )
        description_frame = ttk.Frame(form)
        description_frame.grid(row=2, column=1, sticky="nsew", pady=5)
        description_frame.rowconfigure(0, weight=1)
        description_frame.columnconfigure(0, weight=1)
        self.description_text = tk.Text(description_frame, height=8, wrap=tk.WORD)
        description_scroll = ttk.Scrollbar(
            description_frame,
            orient=tk.VERTICAL,
            command=self.description_text.yview,
        )
        self.description_text.configure(yscrollcommand=description_scroll.set)
        self.description_text.grid(row=0, column=0, sticky="nsew")
        description_scroll.grid(row=0, column=1, sticky="ns")
        self.description_text.insert("1.0", str(entry.get("description") or ""))

        ttk.Label(
            content,
            text="Mojira ID、英文标题和状态由 Mojira 数据维护，不在此处修改。",
            foreground="#666666",
        ).pack(anchor=tk.W, pady=(6, 0))

        buttons = ttk.Frame(content)
        buttons.pack(fill=tk.X, pady=(14, 0))
        ttk.Button(buttons, text="取消", command=self.window.destroy).pack(
            side=tk.RIGHT
        )
        ttk.Button(buttons, text="保存", command=self.save).pack(
            side=tk.RIGHT,
            padx=(0, 8),
        )

        center_window_on_parent(
            self.window,
            app.root,
            650,
            470,
            app.ui_scale,
        )
        self.window.deiconify()
        self.window.lift()
        self.window.grab_set()
        cn_title_entry.focus_set()
        cn_title_entry.selection_range(0, tk.END)

    def save(self) -> None:
        cn_title = self.cn_title_var.get().strip()
        version = self.version_var.get().strip()
        description = self.description_text.get("1.0", "end-1c").strip()

        if not cn_title:
            messagebox.showwarning(
                "缺少中文标题",
                "请输入漏洞的中文标题。",
                parent=self.window,
            )
            return
        if not version:
            messagebox.showwarning(
                "缺少影响版本",
                "请输入影响版本。",
                parent=self.window,
            )
            return

        try:
            entries = load_bug_list(self.app.path)
            matching_entries = [
                entry
                for entry in entries
                if normalize_issue_key(entry.get("id")) == self.issue_key
            ]
            if not matching_entries:
                raise BugListError(f"{self.issue_key} 已不在 bug_list.json 中")
            if len(matching_entries) > 1:
                raise BugListError(f"bug_list.json 中存在多个 {self.issue_key}")

            target = matching_entries[0]
            target["cn_title"] = cn_title
            target["version"] = version
            target["description"] = description
            sort_bug_list(entries)
            write_bug_list(self.app.path, entries)
        except (BugListError, OSError) as error:
            messagebox.showerror("保存失败", str(error), parent=self.window)
            return

        self.app.reload_entries(show_error=False)
        self.app.status_var.set(f"已更新 {self.issue_key}")
        self.window.destroy()


class NewBugDialog:
    def __init__(self, app: BugManagerApp) -> None:
        self.app = app
        self.issue_key = ""
        self.issue_title = ""
        self.issue_status = ""
        self.issue_version = ""

        self.window = tk.Toplevel(app.root)
        self.window.withdraw()
        self.window.title("新建漏洞")
        self.window.minsize(
            scaled_pixels(560, app.ui_scale),
            scaled_pixels(360, app.ui_scale),
        )
        self.window.transient(app.root)

        self.content = ttk.Frame(self.window, padding=16)
        self.content.pack(fill=tk.BOTH, expand=True)
        self.show_id_step()

        center_window_on_parent(
            self.window,
            app.root,
            650,
            470,
            app.ui_scale,
        )
        self.window.deiconify()
        self.window.lift()
        self.window.grab_set()

    def clear_content(self) -> None:
        for child in self.content.winfo_children():
            child.destroy()

    def show_id_step(self) -> None:
        self.clear_content()
        ttk.Label(
            self.content,
            text="输入 Minecraft: Java Edition 漏洞编号",
            font=("TkDefaultFont", 12, "bold"),
        ).pack(anchor=tk.W)
        ttk.Label(
            self.content,
            text="可以输入纯数字或 MC-<数字>，例如 307449 或 MC-307449。",
        ).pack(anchor=tk.W, pady=(6, 16))

        self.id_var = tk.StringVar()
        id_entry = ttk.Entry(self.content, textvariable=self.id_var, width=36)
        id_entry.pack(anchor=tk.W, fill=tk.X)
        id_entry.focus_set()
        id_entry.bind("<Return>", lambda _event: self.fetch_metadata())

        self.fetch_message = ttk.Label(self.content, text="")
        self.fetch_message.pack(anchor=tk.W, pady=(10, 0))

        buttons = ttk.Frame(self.content)
        buttons.pack(side=tk.BOTTOM, fill=tk.X, pady=(16, 0))
        ttk.Button(buttons, text="取消", command=self.window.destroy).pack(side=tk.RIGHT)
        self.continue_button = ttk.Button(
            buttons,
            text="继续",
            command=self.fetch_metadata,
        )
        self.continue_button.pack(side=tk.RIGHT, padx=(0, 8))

    def fetch_metadata(self) -> None:
        try:
            issue_key = normalize_issue_key(self.id_var.get())
        except BugListError as error:
            messagebox.showerror("编号无效", str(error), parent=self.window)
            return

        existing_keys: set[str] = set()
        try:
            for entry in load_bug_list(self.app.path):
                existing_keys.add(normalize_issue_key(entry.get("id")))
        except BugListError as error:
            messagebox.showerror("无法读取漏洞列表", str(error), parent=self.window)
            return

        if issue_key in existing_keys:
            messagebox.showwarning(
                "漏洞已存在",
                f"{issue_key} 已经在 bug_list.json 中。",
                parent=self.window,
            )
            return

        self.issue_key = issue_key
        self.continue_button.configure(state=tk.DISABLED)
        self.fetch_message.configure(text=f"正在从 Mojira 获取 {issue_key}……")

        future = self.app.executor.submit(fetch_issue, issue_key)
        self.app._poll_future(
            future,
            on_success=self.metadata_loaded,
            on_error=self.metadata_failed,
        )

    def metadata_loaded(self, issue: dict[str, Any]) -> None:
        if not self.window.winfo_exists():
            return

        fields = issue.get("fields")
        if not isinstance(fields, dict):
            self.metadata_failed(BugListError(f"Mojira issue {self.issue_key} has no fields object"))
            return

        title = fields.get("summary")
        if not isinstance(title, str) or not title.strip():
            self.metadata_failed(BugListError(f"Mojira issue {self.issue_key} has no summary"))
            return

        self.issue_title = title.strip()
        self.issue_status = classify_status(fields)
        self.issue_version = oldest_affected_version(fields)
        self.show_details_step()

    def metadata_failed(self, error: BaseException) -> None:
        if not self.window.winfo_exists():
            return
        self.continue_button.configure(state=tk.NORMAL)
        self.fetch_message.configure(text="获取失败，请检查网络或漏洞编号。")
        messagebox.showerror("无法获取漏洞", str(error), parent=self.window)

    def show_details_step(self) -> None:
        self.clear_content()

        ttk.Label(
            self.content,
            text=f"{self.issue_key} 已获取",
            font=("TkDefaultFont", 12, "bold"),
        ).pack(anchor=tk.W)
        ttk.Label(
            self.content,
            text=f"英文标题：{self.issue_title}",
            wraplength=scaled_pixels(600, self.app.ui_scale),
            justify=tk.LEFT,
        ).pack(anchor=tk.W, pady=(8, 2))
        ttk.Label(
            self.content,
            text=f"当前状态：{status_label(self.issue_status)}（{self.issue_status}）",
        ).pack(anchor=tk.W, pady=(0, 14))

        form = ttk.Frame(self.content)
        form.pack(fill=tk.BOTH, expand=True)
        form.columnconfigure(1, weight=1)
        form.rowconfigure(2, weight=1)

        ttk.Label(form, text="中文标题 *").grid(row=0, column=0, sticky="nw", padx=(0, 10), pady=5)
        self.cn_title_var = tk.StringVar()
        cn_title_entry = ttk.Entry(form, textvariable=self.cn_title_var)
        cn_title_entry.grid(row=0, column=1, sticky="ew", pady=5)

        ttk.Label(form, text="影响版本 *").grid(row=1, column=0, sticky="nw", padx=(0, 10), pady=5)
        self.version_var = tk.StringVar(value=self.issue_version)
        ttk.Entry(form, textvariable=self.version_var).grid(
            row=1,
            column=1,
            sticky="ew",
            pady=5,
        )

        ttk.Label(form, text="描述（可选）").grid(row=2, column=0, sticky="nw", padx=(0, 10), pady=5)
        description_frame = ttk.Frame(form)
        description_frame.grid(row=2, column=1, sticky="nsew", pady=5)
        description_frame.rowconfigure(0, weight=1)
        description_frame.columnconfigure(0, weight=1)
        self.description_text = tk.Text(description_frame, height=8, wrap=tk.WORD)
        description_scroll = ttk.Scrollbar(
            description_frame,
            orient=tk.VERTICAL,
            command=self.description_text.yview,
        )
        self.description_text.configure(yscrollcommand=description_scroll.set)
        self.description_text.grid(row=0, column=0, sticky="nsew")
        description_scroll.grid(row=0, column=1, sticky="ns")

        ttk.Label(
            self.content,
            text="影响版本是当前页面数据格式的必填字段，例如 1.21+ 或 26.1+。",
            foreground="#666666",
        ).pack(anchor=tk.W, pady=(6, 0))

        buttons = ttk.Frame(self.content)
        buttons.pack(fill=tk.X, pady=(14, 0))
        ttk.Button(buttons, text="取消", command=self.window.destroy).pack(side=tk.RIGHT)
        ttk.Button(buttons, text="保存", command=self.save).pack(side=tk.RIGHT, padx=(0, 8))

        cn_title_entry.focus_set()

    def save(self) -> None:
        cn_title = self.cn_title_var.get().strip()
        version = self.version_var.get().strip()
        description = self.description_text.get("1.0", "end-1c").strip()

        if not cn_title:
            messagebox.showwarning("缺少中文标题", "请输入漏洞的中文标题。", parent=self.window)
            return
        if not version:
            messagebox.showwarning("缺少影响版本", "请输入影响版本。", parent=self.window)
            return

        try:
            entries = load_bug_list(self.app.path)
            existing_keys = {
                normalize_issue_key(entry.get("id")) for entry in entries
            }
            if self.issue_key in existing_keys:
                raise BugListError(f"{self.issue_key} 已经在 bug_list.json 中")

            entries.append(
                {
                    "id": self.issue_key.removeprefix("MC-"),
                    "cn_title": cn_title,
                    "version": version,
                    "description": description,
                    "title": self.issue_title,
                    "status": self.issue_status,
                }
            )
            sort_bug_list(entries)
            write_bug_list(self.app.path, entries)
        except (BugListError, OSError) as error:
            messagebox.showerror("保存失败", str(error), parent=self.window)
            return

        self.app.reload_entries(show_error=False)
        self.app.status_var.set(f"已添加 {self.issue_key}")
        self.window.destroy()


def main() -> int:
    args = parse_args()
    enable_windows_dpi_awareness()
    try:
        root = tk.Tk()
    except tk.TclError as error:
        print(
            "error: unable to start the Tk GUI; install Python with Tcl/Tk support "
            f"or run this script in a desktop session: {error}",
            file=sys.stderr,
        )
        return 1

    ui_scale = configure_tk_dpi(root)
    BugManagerApp(root, args.path, ui_scale)
    root.mainloop()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
