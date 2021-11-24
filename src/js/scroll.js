window.addEventListener('load', function () {
  var $nav = document.querySelector('nav')

  if (this.window.document.body.getAttribute('nohero') === 'true') {
    $nav.className = 'scrolled'
    // disable scroll effect
    return;
  }

  var mobile = window.document.body.offsetWidth < 768
  window.addEventListener('resize', function () {
    mobile = window.document.body.offsetWidth < 768
  })

  window.addEventListener('scroll', function (ev) {
    var st = window.scrollY
    if ((mobile && st > 0) || (st > 24)) {
      $nav.className = 'scrolled'
    } else {
      $nav.className = ''
    }
    if (window.__noscroll) {
      ev.preventDefault()
      ev.returnValue = false
      return false
    }
  })
})
