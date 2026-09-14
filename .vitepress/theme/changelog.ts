import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

// Open enclosing disclosures before VitePress scrolls to a hidden heading.
export function useChangelogNavigation() {
  const route = useRoute()
  const reveal = (hash = window.location.hash) => {
    if (!hash) return
    let id: string
    try { id = decodeURIComponent(hash.slice(1)) } catch { return }
    const target = document.getElementById(id)
    if (!target?.closest('.changelog-version')) return
    let parent: HTMLElement | null = target
    while (parent) {
      if (parent instanceof HTMLDetailsElement) parent.open = true
      parent = parent.parentElement
    }
    return target
  }
  const onHash = () => { reveal()?.scrollIntoView({ block: 'start' }) }
  const onClick = (event: MouseEvent) => {
    const button = (event.target as Element)?.closest<HTMLButtonElement>('.changelog-expand')
    if (button) {
      const version = button.closest<HTMLDetailsElement>('.changelog-version')
      if (!version) return
      // Avoid the enclosing summary toggling the version back shut.
      event.preventDefault()
      event.stopPropagation()
      version.open = true
      for (const item of version.querySelectorAll<HTMLDetailsElement>('.changelog-item')) {
        item.open = !item.parentElement?.closest('.changelog-item') || item.hasAttribute('data-default-open')
      }
      return
    }
    const link = (event.target as Element)?.closest('a[href]') as HTMLAnchorElement | null
    if (link && link.origin === location.origin && link.pathname === location.pathname) reveal(link.hash)
  }
  onMounted(() => {
    onHash()
    window.addEventListener('hashchange', onHash)
    document.addEventListener('click', onClick, true)
  })
  watch(() => route.path, async () => { await nextTick(); onHash() })
  onUnmounted(() => {
    window.removeEventListener('hashchange', onHash)
    document.removeEventListener('click', onClick, true)
  })
}
