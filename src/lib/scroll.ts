export function scrollMainToTop(behavior: ScrollBehavior = 'smooth') {
  document.getElementById('main-scroll')?.scrollTo({ top: 0, behavior })
}
