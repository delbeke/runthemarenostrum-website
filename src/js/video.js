var player = null
var playerReady = false
window.addEventListener('load', function () {
  var playButton1 = document.querySelector('.play-desktop')
  var playButton2 = document.querySelector('.play-mobile')
  var overlay = document.querySelector('.master-video-overlay')
  if (playButton1 && playButton2) {
    // insert Youtube API tag
    var tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    var loading = overlay.querySelector('.loading-screen')
    var onPlayClick = function () {
      if (player) {
        loading.style.opacity = 1
        loading.style.display = 'block'
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
    }
    playButton1.addEventListener('click', onPlayClick)
    playButton2.addEventListener('click', onPlayClick)
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
  var overlay = document.querySelector('.master-video-overlay')
  if (event.data === YT.PlayerState.PLAYING) {
    var loading = overlay.querySelector('.loading-screen')
    loading.style.opacity = 0
    setTimeout(function () {
      loading.style.display = 'none'
    }, 500)
  } else  if (event.data == YT.PlayerState.ENDED) {
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
    videoId: 'IJPOW9OUyk4',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  })
}
