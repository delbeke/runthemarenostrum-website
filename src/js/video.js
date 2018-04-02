var player = null
var playerReady = false
window.addEventListener('load', function () {
  var playButton = document.querySelector('.play-desktop')
  var overlay = document.querySelector('.master-video-overlay')
  if (playButton) {
    // insert Youtube API tag
    var tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    playButton.parentNode.addEventListener('click', function () {
      if (player) {
        calculatePlayerContainerSize()
        overlay.style.display = 'block'
        window.__noscroll = true
        var delay = function (cb) {
          setTimeout(function () {
            if (!playerReady) {
              delay()
            } else {
              player.playVideo()
            }
          }, 500)
        }
        delay()
      }
    })
  }
  var closeButton = document.querySelector('.master-video-overlay .close')
  if (closeButton) {
    closeButton.addEventListener('click', function () {
       overlay.style.display = 'none'
       window.__noscroll = false
       if (player) {
         player.stopVideo()
       }
    })
  }
})

window.addEventListener('resize', function () {
  if (player) {
    calculatePlayerContainerSize()
  }
})

function calculatePlayerContainerSize () {
  var ww = window.innerWidth
  var wh = window.innerHeight - 120 // 60px for close button (symmetric)
  var vw = 0
  var vh = 0
  var r = 16 / 9
  if ((ww / r) > wh) {
    vh = wh
    vw = vh * r
  } else {
    vw = ww
    vh = vw / r
  }
  var container = document.querySelector('.master-video-overlay .container')
  container.style.width = vw + 'px'
  container.style.height = vh + 'px'
  container.style.left = ((ww - vw) / 2) + 'px'
  container.style.top = (((wh - vh) / 2) + 60) + 'px'
}

function onPlayerReady (event) {
  playerReady = true
}

function onPlayerStateChange (event) {
  if (event.data == YT.PlayerState.ENDED) {
    var overlay = document.querySelector('.master-video-overlay')
    overlay.style.display = 'none'
    window.__noscroll = false
  }
}

function onYouTubeIframeAPIReady() {
  var playerContainer = document.querySelector('.youtube-player')
  player = new YT.Player(playerContainer, {
    playerVars: {
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      playsinline: 1
    },
    videoId: 'TyudHh6EaUU',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  })
}
