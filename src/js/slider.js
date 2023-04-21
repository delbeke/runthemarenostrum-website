window.addEventListener('load', function () {
    var slideIndex = 1;
    var xDown = null;                                                        
    var yDown = null;
    
    var slider = document.querySelector('.slideshow-container')
    
    // Next/previous controls
    window.plusSlides = function(n) {
        showSlides(slideIndex += n)
    }
    
    // Thumbnail image controls
    window.currentSlide = function(n) {
        showSlides(slideIndex = n)
    }
    
    function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides")
        var dots = document.getElementsByClassName("dot")
        if (n > slides.length) {
            slideIndex = 1
        }
        if (n < 1) {
            slideIndex = slides.length
        }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none"
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "")
        }
        slides[slideIndex - 1].style.display = "block"
        dots[slideIndex - 1].className += " active"
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
                plusSlides(1)
            } else {
                plusSlides(-1)
            }                       
        }
        
        /* reset values */
        xDown = null
        yDown = null                                          
    }
    
    if (slider) {
        slider.addEventListener('touchstart', handleTouchStart, false)
        slider.addEventListener('touchmove', handleTouchMove, false)
        showSlides(slideIndex)
    }
})