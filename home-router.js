/* Prevent the legacy demo router from replacing the reference landing page. */
document.addEventListener('click', event => {
  if (!event.target.closest('[data-view="home"]')) return
  event.preventDefault()
  event.stopImmediatePropagation()
  window.location.assign('/')
}, true)
