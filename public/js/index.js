// Config
// =================================================

var $root          = $('html'),
    $nav_header    = $('.banner'),
    $navicon       = $('[data-navicon="button"]'),
    header_height  = $('.banner').height(),
    hero_height    = $('.hero').height(),
    offset_val     = hero_height - header_height,
    eventType      = ((document.ontouchstart !== null) ? 'click' : 'touchstart');


// Methods
// =================================================

function navSlide() {
  var scroll_top = $(window).scrollTop();

  if (scroll_top >= offset_val) {
    $nav_header.addClass('is-sticky');
  } else {
    $nav_header.removeClass('is-sticky');
  }
}

function menuToggle() {
  if($nav_header.hasClass('is-open')) {
    $root.removeClass('pinned');
    $nav_header.removeClass('is-open');
    $navicon.removeClass('is--closed');
  } else {
    $root.addClass('pinned');
    $nav_header.addClass('is-open');
    $navicon.addClass('is--closed')
  }
}

function openNav() {
  if ($nav_header.hasClass('is-open')) {
    $nav_header.removeClass('is-open');
    $root.removeClass('pinned');
    $navicon.removeClass('is--closed');
  }
}

function anchorScroll(event) {
  var id     = $(this).attr('href'),
      offset = header_height,
      target = $(id).offset().top - offset;

  $('html, body').animate({
    scrollTop: target
  }, 500);

  event.preventDefault();
}


// Handlers
// =================================================

$('.scrollto').on(eventType, function() {
  anchorScroll.call(this, event);
});

$navicon.on(eventType, menuToggle);

$('.banner a').on(eventType, openNav);

$(window).scroll(navSlide);