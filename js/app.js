class FullPage {
  constructor(selector, options = {}) {
    this.selector = selector;
    this.options = {
      startFrom: 0,
      showDots: true,
      animationSpeed: 1000,
      sectionsColor: [],
      ...options,
    };
    this.sections = document.querySelectorAll(this.selector);
    this.paginationButtons = document.querySelectorAll('.pagination__item-btn');
    this.paginationParent = document.querySelector('.pagination__list');
    this.pagination = document.querySelector('.pagination');

    if (!this.options.showDots) {
      this.pagination.style.display = 'none';
    } else {
      this.pagination.style.display = '';
    }

    document.documentElement.style.setProperty(
      '--animation-speed',
      `${this.options.animationSpeed / 1000}s`
    );

    this.init();
    this.changeColorOfSlide();
    this.hideSlide();
    this.showSlide(this.options.startFrom);
  }

  changeColorOfSlide() {
    for (let i = 0; i < this.sections.length; i++) {
      this.sections[i].style.backgroundColor = this.options.sectionsColor[i];
    }
  }

  hideSlide() {
    this.sections.forEach((item) => {
      item.classList.remove('active');
    });

    this.paginationButtons.forEach((item) => {
      item.classList.remove('is-active');
    });
  }

  showSlide(index) {
    this.sections[index].classList.add('active');
    this.paginationButtons[index].classList.add('is-active');

    this.triggerStartSlideEvent(index);

    setTimeout(() => {
      this.triggerEndSlideEvent(index);
    }, this.options.animationSpeed);
  }

  init() {
    this.paginationParent.addEventListener('click', (event) => {
      const target = event.target;
      this.paginationButtons.forEach((item, index) => {
        if (target && target.classList.contains('pagination__item-btn')) {
          if (target == item) {
            this.hideSlide();
            this.showSlide(index);
          }
        }
      });
    });

    window.addEventListener('wheel', (event) => {
      if (
        event.deltaY > 0 &&
        this.options.startFrom < this.sections.length - 1
      ) {
        this.hideSlide();
        this.showSlide(++this.options.startFrom);
      } else if (event.deltaY < 0 && this.options.startFrom > 0) {
        this.hideSlide();
        this.showSlide(--this.options.startFrom);
      }
    });

    window.addEventListener('keydown', (e) => {
      if (
        e.key === 'ArrowDown' &&
        this.options.startFrom < this.sections.length - 1
      ) {
        this.hideSlide();
        this.showSlide(++this.options.startFrom);
      } else if (e.key === 'ArrowUp' && this.options.startFrom > 0) {
        this.hideSlide();
        this.showSlide(--this.options.startFrom);
      }
    });
  }

  goTo(index) {
    if (index >= 0 && index < this.sections.length) {
      this.hideSlide();
      this.showSlide(index);
      this.options.startFrom = index;
    }
  }

  reset() {
    this.hideSlide();
    this.showSlide(0);
    this.options.startFrom = 0;
  }

  on(eventName, callback) {
    if (eventName === 'onStartSlide') {
      this.onStartSlideCallback = callback;
    } else if (eventName === 'onEndSlide') {
      this.onEndSlideCallback = callback;
    }
  }

  triggerStartSlideEvent(index) {
    if (this.onStartSlideCallback) {
      this.onStartSlideCallback(index);
    }
  }

  triggerEndSlideEvent(index) {
    if (this.onEndSlideCallback) {
      this.onEndSlideCallback(index);
    }
  }
}

const fullPage = new FullPage('.section', {
  showDots: true,
  startFrom: 0,
  animationSpeed: 600,
  sectionsColor: ['lightcoral', 'lightseagreen', '#ADD8E6'],
});

fullPage.on('onStartSlide', (index) => {
  console.log(`Slide animation started for slide ${index}`);
});

fullPage.on('onEndSlide', (index) => {
  console.log(`Slide animation ended for slide ${index}`);
});

// сделать такую либу

// 1) через const fullPage = new FullPage() (Класс FullPage - это твоя самописаная мини-либа)
// 2) должна быть возможность передавать разные параметры

// const fullPage = new FullPage(“.section”, {
//    showDots: false,
//    startFrom: 3,
//    animationSpeed: 1000
//    // какие еще параметры можешь добавить - на твое усмотрение
// })

// 3) должны быть коллбэк функции к которым мы с сможем прицепится

// const fullPage = new FullPage(“.section”)

// fullPage.on(‘onStartSlide’ (someData) => {…})
// fullPage.on(‘onEndSlide’ (someData) => {…})
// fullPage.goTo(NUMBER)
// fullPage.reset(); // сбрасывает все настройки

// ну типо как у jqeury
// onStartSlide - запустится когда начнется анимация слайда
// onEndSlide - когда закончится анимация слайда

// можно еще добавить
// в миллисекундах
