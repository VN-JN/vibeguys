/* Keep home navigation inside the current document to avoid a full-page flash. */
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-view="home"]')
  if (!trigger) return
  event.preventDefault()
  event.stopImmediatePropagation()
  window.VibeGuysLanguage?.closeMenu()
  if (document.querySelector('.home-v3')) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  if (window.VibeGuysHome?.render) {
    window.VibeGuysHome.render()
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}, true)
