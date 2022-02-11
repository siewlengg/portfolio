// ------------- VARIABLES ------------- //
var ticking = false;
var isFirefox = (/Firefox/i.test(navigator.userAgent));
var isIe = (/MSIE/i.test(navigator.userAgent)) || (/Trident.*rv\:11\./i.test(navigator.userAgent));
var scrollSensitivitySetting = 30; //Increase/decrease this number to change sensitivity to trackpad gestures (up = less sensitive; down = more sensitive) 
var slideDurationSetting = 600; //Amount of time for which slide is "locked"
var currentSlideNumber = 0;
var totalSlideNumber = $(".background").length;

// ------------- DETERMINE DELTA/SCROLL DIRECTION ------------- //
function parallaxScroll(evt) {
  if (isFirefox) {
    //Set delta for Firefox
    delta = evt.detail * (-120);
  } else if (isIe) {
    //Set delta for IE
    delta = -evt.deltaY;
  } else {
    //Set delta for all other browsers
    delta = evt.wheelDelta;
  }

  if (ticking != true) {
    if (delta <= -scrollSensitivitySetting) {
      //Down scroll
      ticking = true;
      if (currentSlideNumber !== totalSlideNumber - 1) {
        currentSlideNumber++;
        nextItem();
      }
      slideDurationTimeout(slideDurationSetting);
    }
    if (delta >= scrollSensitivitySetting) {
      //Up scroll
      ticking = true;
      if (currentSlideNumber !== 0) {
        currentSlideNumber--;
      }
      previousItem();
      slideDurationTimeout(slideDurationSetting);
    }
  }
}

// ------------- SET TIMEOUT TO TEMPORARILY "LOCK" SLIDES ------------- //
function slideDurationTimeout(slideDuration) {
  setTimeout(function() {
    ticking = false;
  }, slideDuration);
}

// ------------- ADD EVENT LISTENER ------------- //
var mousewheelEvent = isFirefox ? "DOMMouseScroll" : "wheel";
window.addEventListener(mousewheelEvent, _.throttle(parallaxScroll, 60), false);

// ------------- SLIDE MOTION ------------- //
function nextItem() {
  var $previousSlide = $(".background").eq(currentSlideNumber - 1);
  $previousSlide.removeClass("up-scroll").addClass("down-scroll");
}

function previousItem() {
  var $currentSlide = $(".background").eq(currentSlideNumber);
  $currentSlide.removeClass("down-scroll").addClass("up-scroll");
}

// Using Rellax JS for:
// - Horizontal Parallax Scrolling
// - Elements' Scroll Speed Control

// https://dixonandmoe.com/rellax/
// https://github.com/dixonandmoe/rellax

var rellax = new Rellax('.rellax', {
  wrapper:'.hero.carousel', //Set wrapper to custom element instead of the body
  horizontal: true, //Enable Horizontal
  vertical: false // Disable vertical 
});




// Using Waypoints JS (jQuery flavor) for:
// - Inview Detection
// - Horizontal Scroll Triggers

// http://imakewebthings.com/waypoints/
// https://github.com/imakewebthings/waypoints

function waypoints() {

	$('.js-waypoint').each( function(i) {

		var $el = $(this),
			animClassRight = $el.data('animateRight'),
			animClassLeft = $el.data('animateLeft'),
			thisId = $(this).attr('id'),
      heroCarouselNav = $('.carousel-nav');
    
    function updateCarouselNav() {
      // remove old slide number class
      $(heroCarouselNav).removeClass (function (index, css) {
        return (css.match (/(^|\s)slide\S+/g) || []).join(' ');
      });
      // add new current slide number class
      $(heroCarouselNav).addClass(thisId);
    }

		$el.waypoint(function (direction) {
      
      if (direction === 'left') {
        
        $el.siblings().removeClass('active');
        $el.addClass('active');
        updateCarouselNav();
        // console.log(thisId);
        
      } else {
        
        $el.siblings().removeClass('active');
        $el.addClass('active');
        updateCarouselNav();
        // console.log(thisId);
        
      }

		}, { 
			context: '.hero.carousel',
      continuous: true,
      enabled: true,
      horizontal: true,
      triggerOnce: false,
      offset: '48%' 
      // Note: This offset setting is not 
      // fully working especially in 
      // setting the .active slide when
      // while scrolling reverse direction,
      // and it has trouble with setting it
      // back to the first slide...
      // Needs some help debugging it
		});

	});

}
waypoints();




// Carousel nav (pagination clicks) and
// Next/Prev click target overlays on slides

$('.click-targets .previous, .click-targets .next, .carousel-nav a').click(function(e) {

  e.preventDefault();

  var heroCarousel = $('.hero.carousel'), 
      heroCarouselNav = $('.carousel-nav'), 
      $link = $(this).attr('href'), // get the href value
      slideNumber = String( $link ).replace( /#/, '' ); 

  // animate horizontal scroll of the carousel
  $(heroCarousel).stop().animate({ 
    scrollLeft: $(heroCarousel).scrollLeft() + $($link).offset().left
  }, 600,'easeOutCirc');

  // temporarily disable the snap-scroll style in CSS
  // scrollLeft doesn't pair well with it - too glitchy
  $(heroCarousel).addClass('no-snapscroll');
  setTimeout(function() {
    // re-add the snap-scrolling style after transition
    $(heroCarousel).removeClass('no-snapscroll');
  }, 601);
  
  
  // Note: debating if its best to handle updating this
  // pagination nav's active state here in the click
  // functions, or let Waypoints manage it... For now
  // maybe adding it in both spots since the clicks
  // are behaving better than the horizontal waypoints
  $(heroCarouselNav).removeClass (function (index, css) {
  return (css.match (/(^|\s)slide\S+/g) || []).join(' ');
});
  $(heroCarouselNav).addClass(slideNumber);

});