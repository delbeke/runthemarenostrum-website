window.addEventListener('load', function () {
    var slideIndex = [];
    var xDown = null;                                                        
    var yDown = null;
    
    var sliders = document.querySelectorAll('.slideshow-master')
    for (let i = 0; i < sliders.length; i++) {
        slideIndex[i] = 0
    }

    let findIndex = function (arr, item) {
        for (let i = 0; i < arr.length; i++) {
            if(arr[i] === item) {
                return i
            }
        }
        return -1
    }
    
    // Next/previous controls
    window.plusSlides = function(n, sender) {
        let master = sender.closest('.slideshow-master')
        let idx = findIndex(sliders, master)
        slideIndex[idx] += n

        // validate new slideIndex
        var slides = master.getElementsByClassName("mySlides")
        if (slideIndex[idx] >= slides.length) {
            slideIndex[idx] = 0
        }
        if (slideIndex[idx] < 0) {
            slideIndex[idx] = slides.length - 1
        }

        // make change
        showSlides(master)
    }
    
    // Thumbnail image controls
    window.currentSlide = function(n, sender) {
        let master = sender.closest('.slideshow-master')
        let idx = findIndex(sliders, master)
        slideIndex[idx] = n

        // make change
        showSlides(master)
    }
    
    function showSlides(master) {
        var i;
        var slides = master.getElementsByClassName("mySlides")
        var dots = master.getElementsByClassName("dot")
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none"
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "")
        }

        let idx = findIndex(sliders, master)
        slides[slideIndex[idx]].style.display = "block"
        dots[slideIndex[idx]].className += " active"
    }
    
    function getTouches(evt) {
      return evt.touches ||             // browser API
             evt.originalEvent.touches  // jQuery
    }                                                     
    
    function handleTouchStart(evt) {
        var firstTouch = getTouches(evt)[0]                               
        xDown = firstTouch.clientX                               
        yDown = firstTouch.clientY                               
    };                                                
    
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return
        }
    
        var xUp = evt.touches[0].clientX                                 
        var yUp = evt.touches[0].clientY
    
        var xDiff = xDown - xUp
        var yDiff = yDown - yUp
    
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                plusSlides(1, evt.target)
            } else {
                plusSlides(-1, evt.target)
            }                       
        }
        
        /* reset values */
        xDown = null
        yDown = null                                          
    }
    
    if (sliders && sliders.length > 0) {
        for (let i = 0; i < sliders.length; i++) {
            const sliderContainer = sliders[i].querySelector('.slideshow-container')
            sliderContainer.addEventListener('touchstart', handleTouchStart, false)
            sliderContainer.addEventListener('touchmove', handleTouchMove, false)
            showSlides(sliders[i])
        }
    }
})