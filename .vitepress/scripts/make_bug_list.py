"""Synchronize bug titles and statuses in ``public/bug_list.json``.

The public Mojira website exposes a small read-only API used by its own issue
browser.  This script queries that API for every Minecraft: Java Edition issue
in the JSON list, updates the ``title`` and ``status`` fields, and keeps fixed
issues at the end of the list.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import tempfile
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


API_URL = "https://bugs.mojang.com/api/jql-search-post"
DEFAULT_BUG_LIST = Path(__file__).resolve().parents[2] / "public" / "bug_list.json"
ISSUE_KEY_PATTERN = re.compile(r"^MC-\d+$", re.IGNORECASE)

STATUS_FIXED = "fixed"
STATUS_WONT_FIX = "wont_fix"
STATUS_INTENDED = "intended"
STATUS_INVALID = "invalid"
STATUS_CONFIRMED = "Confirmed"
STATUS_UNCONFIRMED = "Unconfirmed"

RESOLUTION_STATUSES = {
    "fixed": STATUS_FIXED,
    "wont fix": STATUS_WONT_FIX,
    "works as intended": STATUS_INTENDED,
}
CONFIRMED_VALUES = {"confirmed", "community consensus"}
CLOSED_WORKFLOW_STATUSES = {"resolved", "closed"}
TRANSIENT_HTTP_STATUSES = {429, 500, 502, 503, 504}


class BugListError(RuntimeError):
    """Raised when the input or Mojira response cannot be processed safely."""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Update Mojira titles and statuses in public/bug_list.json."
    )
    parser.add_argument(
        "path",
        nargs="?",
        type=Path,
        default=DEFAULT_BUG_LIST,
        help=f"JSON file to update (default: {DEFAULT_BUG_LIST})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Query and display changes without writing the JSON file.",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=30.0,
        help="Timeout for each HTTP request in seconds (default: 30).",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=3,
        help="Attempts for transient request failures (default: 3).",
    )
    args = parser.parse_args()

    if args.timeout <= 0:
        parser.error("--timeout must be greater than zero")
    if args.retries < 1:
        parser.error("--retries must be at least one")

    return args


def normalize_issue_key(raw_id: Any) -> str:
    """Convert a numeric ID or MC-prefixed ID to a validated issue key."""

    if isinstance(raw_id, bool) or not isinstance(raw_id, (str, int)):
        raise BugListError("id must be a string or integer")

    value = str(raw_id).strip().upper()
    issue_key = value if value.startswith("MC-") else f"MC-{value}"
    if not ISSUE_KEY_PATTERN.fullmatch(issue_key):
        raise BugListError(
            f"invalid Java Edition issue id {raw_id!r}; expected a number or MC-<number>"
        )

    return issue_key


def _option_name(value: Any) -> str | None:
    """Read a Jira option name from either an object or a plain string."""

    if isinstance(value, str):
        return value.strip() or None
    if isinstance(value, dict):
        for key in ("name", "value"):
            option = value.get(key)
            if isinstance(option, str) and option.strip():
                return option.strip()
    return None


def classify_status(fields: dict[str, Any]) -> str:
    """Map Mojira's resolution, workflow and confirmation fields to site status."""

    resolution_name = _option_name(fields.get("resolution"))
    if resolution_name:
        normalized_resolution = resolution_name.casefold().replace("’", "'")
        normalized_resolution = normalized_resolution.replace("'", "")

        mapped_status = RESOLUTION_STATUSES.get(normalized_resolution)
        if mapped_status:
            return mapped_status

        # Invalid, Duplicate, Awaiting Response, Cannot Reproduce, Done, and
        # every other non-fix resolution are all treated as invalid here.
        return STATUS_INVALID

    workflow_status = _option_name(fields.get("status"))
    status_category = fields.get("status", {})
    if isinstance(status_category, dict):
        status_category = status_category.get("statusCategory", {})
    if isinstance(status_category, dict):
        category_key = str(status_category.get("key", "")).casefold()
    else:
        category_key = ""

    if category_key == "done" or (
        workflow_status and workflow_status.casefold() in CLOSED_WORKFLOW_STATUSES
    ):
        return STATUS_INVALID

    confirmation_name = _option_name(fields.get("customfield_10054"))
    if confirmation_name and confirmation_name.casefold() in CONFIRMED_VALUES:
        return STATUS_CONFIRMED

    return STATUS_UNCONFIRMED


def _request_payload(issue_key: str) -> bytes:
    payload = {
        "advanced": True,
        "search": f"key = {issue_key}",
        "project": "MC",
        "isForge": False,
        "filter": "all",
        "page": 0,
        "maxResults": 1,
    }
    return json.dumps(payload, separators=(",", ":")).encode("utf-8")


def fetch_issue(
    issue_key: str,
    *,
    timeout: float = 30.0,
    retries: int = 3,
) -> dict[str, Any]:
    """Fetch one public MC issue from Mojira, retrying transient failures."""

    request = Request(
        API_URL,
        data=_request_payload(issue_key),
        method="POST",
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "datapack-index-make-bug-list/1.0",
        },
    )

    for attempt in range(1, retries + 1):
        try:
            with urlopen(request, timeout=timeout) as response:
                response_data = json.load(response)
            break
        except HTTPError as error:
            if error.code not in TRANSIENT_HTTP_STATUSES or attempt == retries:
                details = error.read().decode("utf-8", errors="replace")
                raise BugListError(
                    f"Mojira returned HTTP {error.code} for {issue_key}: {details}"
                ) from error

            retry_after = error.headers.get("Retry-After")
            delay = float(retry_after) if retry_after and retry_after.isdigit() else 2 ** (attempt - 1)
            time.sleep(delay)
        except (URLError, TimeoutError, OSError) as error:
            if attempt == retries:
                raise BugListError(f"request for {issue_key} failed: {error}") from error
            time.sleep(2 ** (attempt - 1))
        except (json.JSONDecodeError, UnicodeDecodeError) as error:
            raise BugListError(f"Mojira returned invalid JSON for {issue_key}") from error

    if not isinstance(response_data, dict):
        raise BugListError(f"Mojira returned an invalid response object for {issue_key}")

    issues = response_data.get("issues")
    if not isinstance(issues, list) or not issues:
        raise BugListError(f"Mojira issue {issue_key} was not found or is not public")

    issue = issues[0]
    if not isinstance(issue, dict):
        raise BugListError(f"Mojira returned an invalid issue for {issue_key}")

    returned_key = issue.get("key")
    if not isinstance(returned_key, str) or returned_key.upper() != issue_key:
        raise BugListError(
            f"Mojira returned {returned_key!r} while querying {issue_key}"
        )

    return issue


def load_bug_list(path: Path) -> list[dict[str, Any]]:
    try:
        with path.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except FileNotFoundError as error:
        raise BugListError(f"bug list does not exist: {path}") from error
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        raise BugListError(f"bug list is not valid UTF-8 JSON: {path}") from error

    if not isinstance(data, list):
        raise BugListError("bug list JSON must contain an array at the top level")

    for index, entry in enumerate(data):
        if not isinstance(entry, dict):
            raise BugListError(f"item {index + 1} must be an object")
        if "id" not in entry:
            raise BugListError(f"item {index + 1} is missing the id field")

    return data


def update_bug_list(
    entries: list[dict[str, Any]],
    *,
    timeout: float,
    retries: int,
) -> None:
    issue_cache: dict[str, tuple[str, str]] = {}
    total = len(entries)

    for index, entry in enumerate(entries, start=1):
        try:
            issue_key = normalize_issue_key(entry["id"])
        except BugListError as error:
            raise BugListError(f"item {index}: {error}") from error

        if issue_key not in issue_cache:
            issue = fetch_issue(issue_key, timeout=timeout, retries=retries)
            fields = issue.get("fields")
            if not isinstance(fields, dict):
                raise BugListError(f"Mojira issue {issue_key} has no fields object")

            title = fields.get("summary")
            if not isinstance(title, str) or not title.strip():
                raise BugListError(f"Mojira issue {issue_key} has no summary")

            issue_cache[issue_key] = (title.strip(), classify_status(fields))

        title, status = issue_cache[issue_key]
        entry["title"] = title
        entry["status"] = status
        print(f"[{index}/{total}] {issue_key}: {status} — {title}")


def sort_bug_list(entries: list[dict[str, Any]]) -> None:
    """Stably move fixed issues after every issue that is not fixed."""

    entries.sort(
        key=lambda entry: str(entry.get("status", "")).strip().casefold()
        == STATUS_FIXED
    )


def write_bug_list(path: Path, entries: list[dict[str, Any]]) -> None:
    """Atomically replace the JSON file only after every item has succeeded."""

    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path: Path | None = None

    try:
        with tempfile.NamedTemporaryFile(
            "w",
            encoding="utf-8",
            newline="\n",
            dir=path.parent,
            prefix=f".{path.name}.",
            suffix=".tmp",
            delete=False,
        ) as file:
            json.dump(entries, file, ensure_ascii=False, indent=4)
            file.write("\n")
            temporary_path = Path(file.name)

        os.replace(temporary_path, path)
    except Exception:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)
        raise


def main() -> int:
    args = parse_args()
    path = args.path.resolve()

    try:
        entries = load_bug_list(path)
        update_bug_list(entries, timeout=args.timeout, retries=args.retries)
        sort_bug_list(entries)

        if args.dry_run:
            print(f"Dry run complete; {path} was not changed.")
        else:
            write_bug_list(path, entries)
            print(f"Updated {len(entries)} issue(s) in {path}.")
    except BugListError as error:
        print(f"error: {error}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
