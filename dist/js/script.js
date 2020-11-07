
function Constellation (canvas) {
  var _this = this,
      context = canvas.getContext('2d'),
      config = {
        star: {
          color: 'rgba(255, 255, 255, .0)',
          width: 3
        },
        line: {
          color: 'rgba(255, 255, 255, .2)',
          width: 0.2
        },
        position: {
          x: 0,
          y: 0
        },
        width: window.innerWidth,
        height: window.innerHeight,
        length: Math.sqrt( Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2) ) / 10,
        distance: 100,
        radius: 180,
        stars: []
      };

  function Star () {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * config.star.width;

    this.vx = (0.5 - Math.random())/5;
    this.vy = (0.5 - Math.random())/5;

    this.create = function() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      context.fill();
    };
  }

  this.animate = function() {
    var i;
    for (i = 0; i < config.length; i++) {

      var star = config.stars[i];

      if (star.y < 0 || star.y > canvas.height) {
        star.vy = - star.vy;
      } else if (star.x < 0 || star.x > canvas.width) {
        star.vx = - star.vx;
      }

      star.x += star.vx;
      star.y += star.vy;
    }
  };

  this.line = function() {
    var length = config.length,
        iStar,
        jStar,
        i,
        j;

    for (i = 0; i < length; i++) {
      for (j = 0; j < length; j++) {
        iStar = config.stars[i];
        jStar = config.stars[j];

        if (
          (iStar.x - jStar.x) < config.distance &&
          (iStar.y - jStar.y) < config.distance &&
          (iStar.x - jStar.x) > - config.distance &&
          (iStar.y - jStar.y) > - config.distance
        ) {
          if (
            (iStar.x - config.position.x) < config.radius &&
            (iStar.y - config.position.y) < config.radius &&
            (iStar.x - config.position.x) > - config.radius &&
            (iStar.y - config.position.y) > - config.radius
          ) {
            context.beginPath();
            context.moveTo(iStar.x, iStar.y);
            context.lineTo(jStar.x, jStar.y);
            context.stroke();
            context.closePath();
          }
        }
      }
    }
  };

  this.createStars = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < config.length; i++) {
      config.stars.push(new Star());
      config.stars[i].create();
    }

    _this.animate();
    _this.line();
  };

  this.setCanvas = function () {
    canvas.width = config.width;
    canvas.height = config.height;
  };

  this.setContext = function () {
    context.fillStyle = config.star.color;
    context.strokeStyle = config.line.color;
    context.lineWidth = config.line.width;
  };

  this.loop = function (callback) {
    callback();

    window.requestAnimationFrame(function () {
      _this.loop(callback);
    });
  };

  this.bind = function () {
    window.addEventListener("mousemove", function(e){
      config.position.x = e.pageX - canvas.offsetLeft;
      config.position.y = e.pageY - canvas.offsetTop;
    });
  };

  this.init = function () {
    this.setCanvas();
    this.setContext();
    this.loop(this.createStars);
    this.bind();
  };
}
document.addEventListener("DOMContentLoaded", function() {
  var c = new Constellation(document.getElementById('canvas'));
  c.init();
});


$(document).ready(function(){

        $(window).scroll(function(){
            var bo = $(this).scrollTop();
             var a = $(".back-top").css('opacity')
             $("#hid").html(bo);
            if ( bo <= 10 && a == 0) {$(".back-top").stop().animate({'opacity':'1'},100)};
        if ( bo > 10 && a == 1) {$(".back-top").stop().animate({'opacity':'0'},200)};
            })
})

//  dot nav

const dotNav = (elem, easing) => {
    function scrollIt(destination, duration = 200, easing = 'linear', callback) {
        const easings = {
            linear(t) { return t; },
            easeInQuad(t) { return t * t; },
            easeOutQuad(t) { return t * (2 - t); },
            easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
            easeInCubic(t) { return t * t * t; },
            easeOutCubic(t) { return (--t) * t * t + 1; },
            easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
            easeInQuart(t) { return t * t * t * t; },
            easeOutQuart(t) { return 1 - (--t) * t * t * t; },
            easeInOutQuart(t) { return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; },
            easeInQuint(t) { return t * t * t * t * t; },
            easeOutQuint(t) { return 1 + (--t) * t * t * t * t; },
            easeInOutQuint(t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; }
        };
        const start = window.pageYOffset;
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
        const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
        const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
        if ('requestAnimationFrame' in window === false) {
            window.scroll(0, destinationOffsetToScroll);
            if (callback) {
                callback();
            }
            return;
        }
        function scroll() {
            const now = 'now' in window.performance ? performance.now() : new Date().getTime();
            const time = Math.min(1, ((now - startTime) / duration));
            const timeFunction = easings[easing](time);
            window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
            if (window.pageYOffset === destinationOffsetToScroll) {
                if (callback) {
                    callback();
                }
                return;
            }
            requestAnimationFrame(scroll);
        }
        scroll();
    }

    //  in viewport

    const inViewport = (el) => {
        let allElements = document.getElementsByTagName(el);
        let windowHeight = window.innerHeight;
        const elems = () => {
            for (let i = 0; i < allElements.length; i++) {  //  loop through the sections
                let viewportOffset = allElements[i].getBoundingClientRect();  //  returns the size of an element and its position relative to the viewport
                let top = viewportOffset.top;  //  get the offset top
                if(top < windowHeight){  //  if the top offset is less than the window height
                    allElements[i].classList.add('in-viewport');  //  add the class
                } else{
                    allElements[i].classList.remove('in-viewport');  //  remove the class
                }
            }
        }
        elems();
        window.addEventListener('scroll', elems);
    }
    inViewport('section');

    //  dot nav

    const allSecs = document.getElementsByTagName(elem);
    const nav = document.getElementById('dot-nav');
    const scrollSpeed = '1000';
    let allVis = document.getElementsByClassName('in-viewport'),
        allDots;
    for (let i = 0; i < allSecs.length; i++) {
        allSecs[i].classList.add('section-' + i);
    }

    //  add the dots

    const buildNav = () => {
        for (let i = 0; i < allSecs.length; i++) {
            const dotCreate = document.createElement('a');
            dotCreate.id = 'dot-' + i;
            dotCreate.classList.add('dots');
            dotCreate.href = '#';
            dotCreate.setAttribute('data-sec', i);
            nav.appendChild(dotCreate);
        }
    }
    buildNav();

    //  nav position

    let navHeight = document.getElementById('dot-nav').clientHeight;
    let hNavHeight = navHeight / 2;
    document.getElementById('dot-nav').style.top = 'calc(50% - ' + hNavHeight + 'px)';

    //  onscroll

    const dotActive = () => {
        allVis = document.getElementsByClassName('in-viewport');
        allDots = document.getElementsByClassName('dots');
        visNum = allVis.length;
        let a = visNum - 1;
        for (let i = 0; i < allSecs.length; i++) {
            allDots[i].classList.remove('active');
        }
        document.getElementById('dot-' + a).classList.add('active');
    }
    dotActive();
    window.onscroll = function(){ dotActive(); };

    //  click stuff

    const scrollMe = (e) => {
        let anchor = e.currentTarget.dataset.sec;
        scrollIt(document.querySelector('.section-' + anchor), scrollSpeed, easing);
        e.preventDefault();
    }

    allDots = document.getElementsByClassName('dots');
    for (let i = 0; i < allDots.length; i++) {
        allDots[i].addEventListener('click', scrollMe);
    }

}

dotNav('section', 'easeInOutCubic');

$(".menu-icon").click(function() {
  $(".menu-burger").toggleClass("menu-burger_expanded");
});

$(".search-icon").click(function() {
  $(".input").toggleClass("input-active");
});

const menuBtn = document.querySelector('.menu-btn');
let menuOpen = false;
menuBtn.addEventListener('click', () => {
    if(!menuOpen) {
        menuBtn.classList.add('open');
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        menuOpen = false;
    }
});



$(document).ready(function(){
    $('.card-slider').slick({
        dots: true,
        swipe: true,
        touchMove: true
    });
});

$('.news-blocks').slick({
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  variableWidth: true,
  swipe: true,
    touchMove: true
});


$('.parthners-logo').slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  variableWidth: true,
    swipe: true,
    touchMove: true
});







