'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// 186: DYNAMICALLY CREATED COOKIE MESSAGE

const header = document.querySelector('.header');
const message = document.createElement('div');

message.classList.add('cookie-message');
message.textContent = 'We use cookies for improved functionality and analytics.';
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
header.append(message);

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
  // massage.parentElement.removeChild(message); // The Old Way ...
});


// 188: SMOOTH SCROLLING

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function(e) {
  const s1coords = section1.getBoundingClientRect();   // getBoundingClientRect() gives us the 'bounding rectangle' of the element
  window.scrollTo({
    left: s1coords.left + window.scrollX,
    top: s1coords.top + window.scrollY,
    behavior: 'smooth'
  })
});

// 192: SMOOTH SCROLLING WITH EVENT DELEGATION

document.querySelector('.nav__links').addEventListener('click', function(e) {
  if(e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    const scoords = document.querySelector(id).getBoundingClientRect(); 
    window.scrollTo({
      left: scoords.left + window.scrollX,
      top: scoords.top + window.scrollY,
      behavior: 'smooth'
    })
  }
});

// 194: TABBED COMPONENTS

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');
  if(!clicked) return; // if we click elsewhere and the above method returns 'null' then stop this function

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));

  document
  .querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active');
});

// 195: Menu Fade Animation

const nav = document.querySelector('.nav');

const handleHover = function(e) { // Handler function can only have one real parameter. 
  if(e.target.classList.contains('nav__link')) {
    // no child elements, so no closest
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); // cuz we would have to go up several levels
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// 197: Sticky Nav with IntersectionObserver API

const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function(entries) {
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);

// 198: REVEAL SECTIONS

const allSections = document.querySelectorAll('.section')

const revealSection = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return; 
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.25
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// 199: LAZY-LOADING IMAGES

// Selecting img elements with 'data-src' attribute
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img')) // Wait till new photo loads
  observer.unobserve(entry.target)
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})

imgTargets.forEach(img => imgObserver.observe(img));


////////////////////////////////////////////////////////////
// 200 - 201: SLIDER COMPONENT  ////////////////////////////

const slider = function() {

// VARIABLES
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');

// FUNCTIONS
const goToSlide = function(slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
}

const createDots = function() {
  slides.forEach(function(_, i) {
    dotContainer.insertAdjacentHTML('beforeend', 
      `<button class="dots__dot" data-slide="${i}"></button>`)
  })
}

const activateDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

const nextSlide = function() {
    if(curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}

const prevSlide = function() {
  if(curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}

const init = function() {
  goToSlide(curSlide);
  createDots();
  activateDot(curSlide);
}

// EVENT-HANDLERS
btnRight.addEventListener('click', nextSlide)
btnLeft.addEventListener('click', prevSlide)

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
  activateDot(curSlide);
});

dotContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset;
    curSlide = +e.target.dataset.slide; // NUMBERS
    goToSlide(slide);
    activateDot(slide);
  }
});

// INITIALIZATION
init();

}

slider();

