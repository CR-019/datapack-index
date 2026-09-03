/** Resolve a bug query against the same filtered list used for pagination. */
export function findBugTarget(bugs, search, pageSize) {
  const rawId = new URLSearchParams(search).get('bug')?.trim().toUpperCase();
  if (!rawId || !/^(?:MC-)?\d+$/.test(rawId)) return null;

  const key = rawId.startsWith('MC-') ? rawId : `MC-${rawId}`;
  const index = bugs.findIndex((bug) => {
    const id = String(bug.id).trim().toUpperCase();
    return (id.startsWith('MC-') ? id : `MC-${id}`) === key;
  });
  if (index < 0) return null;

  return { key, index, page: Math.floor(index / pageSize) + 1 };
}
