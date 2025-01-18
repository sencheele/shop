class DragAndDrop {
  selectors = {
    root: '[data-js-dnd]',
  };

  stateClasses = {
    isDragging: 'is-dragging',
    visuallyHidden: 'visually-hidden',
  };

  initialState = {
    offsetX: null,
    offsetY: null,
    isDragging: false,
    currentDraggingElement: null,
    initialCoordinatesBottom: null,
    initialCoordinatesLeft: null,
    lastPointerX: null,
    lastPointerY: null,
  };

  countProductsInBasket = 0;

  constructor() {
    this.state = { ...this.initialState};
    this.bindEvents();
  }

  showLink() {
    const link = document.querySelector('.banner__link');

    link.classList.remove(this.stateClasses.visuallyHidden);
  }

  resetState() {
    this.state = { ...this.initialState};
  }

  onPointerDown(event) {
    const { target, x, y } = event;

    const dragElement = target.closest(this.selectors.root);

    const isDraggable = dragElement && dragElement.matches(this.selectors.root);

    if (!isDraggable) {
      return;
    }

    dragElement.classList.add(this.stateClasses.isDragging);

    const { left, top, bottom } = dragElement.getBoundingClientRect();

    const banner = document.querySelector('.banner');
    const { left: bannerLeft, bottom: bannerBottom } = banner.getBoundingClientRect();

    this.state = {
      offsetX: x - left,
      offsetY: y - top,
      isDragging: true,
      currentDraggingElement: dragElement,
      initialCoordinatesBottom: bannerBottom - bottom,
      initialCoordinatesLeft: left - bannerLeft,
      lastPointerX: null,
      lastPointerY: null,
    }
  }

  onPointerMove(event) {
    if (!this.state.isDragging) {
      return;
    }

    const banner = document.querySelector('.banner');
    const { left, top, right, bottom } = banner.getBoundingClientRect();

    let x = event.pageX - this.state.offsetX - left;
    let y = event.pageY - this.state.offsetY - top;

    const { width, height } = this.state.currentDraggingElement.getBoundingClientRect();

    x = Math.max(0, Math.min(x, right - width - left));
    y = Math.max(0, Math.min(y, bottom - height - top));

    this.state.lastPointerX = x;
    this.state.lastPointerY = y;

    this.state.currentDraggingElement.style.bottom = `auto`;
    this.state.currentDraggingElement.style.left = `${x}px`;
    this.state.currentDraggingElement.style.top = `${y}px`;
  }

  onPointerUp() {
    if (!this.state.isDragging) {
      return;
    }

    const basket = document.querySelector('.basket');
    const { top } = basket.getBoundingClientRect();

    const banner = document.querySelector('.banner');
    const { top: bannerTop } = banner.getBoundingClientRect();

    this.state.currentDraggingElement.style.top = `auto`;

    if (this.state.lastPointerY < top - bannerTop + 20) {
      this.state.currentDraggingElement.style.bottom = `${this.state.initialCoordinatesBottom}px`;
      this.state.currentDraggingElement.style.left = `${this.state.initialCoordinatesLeft}px`;
    } else {
      this.countProductsInBasket += 1;

      const randomLeftPosition = Math.floor(Math.random() * (200 - 80 + 1)) + 80;

      this.state.currentDraggingElement.style.bottom = `${53}px`;
      this.state.currentDraggingElement.style.left = `${randomLeftPosition}px`;

      if (this.countProductsInBasket === 3) {
        this.showLink();
      }
    }

    this.state.currentDraggingElement.classList.remove(this.stateClasses.isDragging);
    this.resetState();
  }

  bindEvents() {
    document.addEventListener('dragstart', (event) => event.preventDefault());

    document.addEventListener('pointerdown', (event) => this.onPointerDown(event));
    document.addEventListener('pointermove', (event) => this.onPointerMove(event));
    document.addEventListener('pointerup', () => this.onPointerUp());
  }
}

function resetHeight() {
  const container = document.querySelector('.container');
  container.style.height = window.innerHeight + "px";
}

resetHeight();

new DragAndDrop();
