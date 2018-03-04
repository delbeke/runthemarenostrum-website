window.addEventListener('load', function () {
  var mobile = window.document.body.offsetWidth < 768
  window.addEventListener('resize', function () {
    mobile = window.document.body.offsetWidth < 768
  })

  var $nav = document.querySelector('nav')
  window.addEventListener('scroll', function () {
    var st = window.scrollY
    console.log(st)

    if ((mobile && st > 0) || (st > 24)) {
      $nav.className = 'scrolled'
    } else {
      $nav.className = ''
    }
  })
})
