window.addEventListener('load', function () {
  var $burger = document.querySelector('.hamburger')
  var $sideBar = document.querySelector('.side-bar')
  $burger.parentNode.addEventListener('click', function () {
    if ($burger.className === 'hamburger open') {
      $burger.className = 'hamburger'
      $sideBar.className = 'side-bar'
    } else {
      $burger.className = 'hamburger open'
      $sideBar.className = 'side-bar open'
    }
  })
})
