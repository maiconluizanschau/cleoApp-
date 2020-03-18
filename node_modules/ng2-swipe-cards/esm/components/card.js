import { Component, ElementRef, EventEmitter, HostListener, Renderer, Input, Output } from '@angular/core';
export class CardComponent {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.fixed = false;
        this._orientation = 'xy';
        this.released = false;
        this.onRelease = new EventEmitter();
        this.onSwipe = new EventEmitter();
        this.onAbort = new EventEmitter();
        this.direction = { x: 0, y: 0 };
        this.element = el.nativeElement;
    }
    set orientation(value) {
        this._orientation = value || "xy";
    }
    set callDestroy(value) {
        this._callDestroy = value || new EventEmitter();
        this.initCallDestroy();
    }
    translate(params) {
        if (!this.fixed && !this.released) {
            this.renderer.setElementStyle(this.element, "transition", "transform " + (params.time || 0) + "s ease");
            this.renderer.setElementStyle(this.element, "webkitTransform", "translate3d(" +
                (params.x && (!this._orientation || this._orientation.indexOf("x") != -1) ? (params.x) : 0) +
                "px, " +
                (params.y && (!this._orientation || this._orientation.indexOf("y") != -1) ? (params.y) : 0) +
                "px, 0) rotate(" + (params.rotate || 0) + "deg)");
        }
    }
    onSwipeCb(event) {
        let rotate = ((event.deltaX * 20) / this.element.clientWidth);
        this.direction.x = event.deltaX > 0 ? 1 : -1;
        this.direction.y = event.deltaY > 0 ? 1 : -1;
        this.translate({
            x: event.deltaX,
            y: event.deltaY
        });
    }
    onAbortCb(event) {
        this.translate({
            x: 0,
            y: 0,
            rotate: 0,
            time: 0.2
        });
    }
    ngOnInit() {
        this._callDestroy = this._callDestroy || new EventEmitter();
        this.initCallDestroy();
    }
    initCallDestroy() {
        this._callDestroy.subscribe((delay) => {
            this.destroy(delay);
        });
    }
    destroy(delay = 0) {
        setTimeout(() => {
            this.element.remove();
        }, 200);
    }
    ngAfterViewChecked() {
        if (this.element.parentElement) {
            let height = this.element.parentElement.clientHeight;
            let width = this.element.parentElement.clientWidth;
            this.renderer.setElementStyle(this.element, "height", height + 'px');
            this.renderer.setElementStyle(this.element, "width", width + 'px');
            this.releaseRadius = {
                x: width / 4,
                y: height / 4
            };
        }
    }
    onPan(event) {
        if (!this.fixed && !this.released) {
            this.onSwipeCb(event);
            if (this.onSwipe) {
                this.onSwipe.emit(event);
            }
        }
    }
    onPanEnd(event) {
        if (!this.fixed && !this.released) {
            if ((this._orientation == "x" && (this.releaseRadius.x < event.deltaX || this.releaseRadius.x * -1 > event.deltaX)) ||
                (this._orientation == "y" && (this.releaseRadius.y < event.deltaY || this.releaseRadius.y * -1 > event.deltaY)) ||
                ((this.releaseRadius.x < event.deltaX || this.releaseRadius.x * -1 > event.deltaX) ||
                    (this.releaseRadius.y < event.deltaY || this.releaseRadius.y * -1 > event.deltaY))) {
                if (this.onRelease) {
                    this.released = true;
                    this.onRelease.emit(event);
                }
            }
            else {
                this.onAbortCb(event);
                if (this.onAbort) {
                    this.onAbort.emit(event);
                }
            }
        }
    }
    ngOnDestroy() {
        if (this._callDestroy) {
            this._callDestroy.unsubscribe();
        }
    }
}
CardComponent.decorators = [
    { type: Component, args: [{
                template: '<ng-content></ng-content>',
                selector: 'sc-card',
                styles: [`:host {
      transition: transform 1s ease;
      position: absolute;
      border-radius: 2px;
      border: 1px solid white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      transition: transform 0.2s ease;
      background-color: white;
      touch-action: none !important;
    }
    :host(.card-heap) {
      transition: transform 1s ease;
      display: block;
      position: absolute;
      background-color: white;
      box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
      transform: perspective(400px) translate3d(0, 30px, -30px);
      visibility: hidden;
    }

    :host(.card-heap):nth-child(1) {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      z-index:3;
      visibility: visible;
      transform: perspective(400px) translate3d(0, 0px, 0px);
    }
    :host(.card-heap):nth-child(2) {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      z-index:2;
      visibility: visible;
      transform: perspective(400px) translate3d(0, 30px, -30px);
    }
    :host(.card-heap):nth-child(3) {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      z-index:1;
      visibility: visible;
      transform: perspective(400px) translate3d(0, 60px, -60px);
    }

    :host .card-overlay {
      transform: translateZ(0);
      opacity: 0;
      border-radius: 2px;
      position: absolute;
      width: 100%;
      height: 10px;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: white;
    }
`]
            },] },
];
/** @nocollapse */
CardComponent.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer, },
];
CardComponent.propDecorators = {
    'fixed': [{ type: Input },],
    'orientation': [{ type: Input, args: ['orientation',] },],
    'callDestroy': [{ type: Input, args: ['callDestroy',] },],
    'onRelease': [{ type: Output },],
    'onSwipe': [{ type: Output },],
    'onAbort': [{ type: Output },],
    'onPan': [{ type: HostListener, args: ['pan', ['$event'],] },],
    'onPanEnd': [{ type: HostListener, args: ['panend', ['$event'],] },],
};
//# sourceMappingURL=card.js.map