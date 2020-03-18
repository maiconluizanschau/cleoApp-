import { Directive, ElementRef, EventEmitter, HostListener, Renderer, Input, Output } from '@angular/core';
export class TinderCardDirective {
    constructor(el, renderer) {
        this.orientation = 'xy';
        this.onLike = new EventEmitter();
        this.renderer = renderer;
        this.element = el.nativeElement;
    }
    set overlay(value) {
        this._overlay = value || {};
    }
    set callLike(value) {
        this._callLike = value || new EventEmitter();
        this.initCallLike();
    }
    onReleaseLikeCb(event) {
        this.like = event.like;
        let el = this.element;
        let x = (el.offsetWidth + el.clientWidth) * ((!!event.like ? 1 : -1) || 0);
        let rotate = (x * 20) / el.clientWidth;
        if (this._overlay) {
            let overlayElm = this.element.querySelector('.tinder-overlay');
            this.renderer.setElementStyle(overlayElm, "transition", "transform 0.6s ease");
            this.renderer.setElementStyle(overlayElm, "opacity", "0.5");
        }
    }
    onSwipeLikeCb(event) {
        if (this._overlay) {
            let overlayElm = this.element.querySelector('.tinder-overlay');
            this.renderer.setElementStyle(overlayElm, "transition", "opacity 0s ease");
            let opacity = (event.distance < 0 ? event.distance * -1 : event.distance) * 0.5 / this.element.offsetWidth;
            this.renderer.setElementStyle(overlayElm, "opacity", opacity.toString());
        }
    }
    destroy(delay = 0) {
        setTimeout(() => {
            this.element.remove();
        }, 200);
    }
    onSwipe(event) {
        let like = (this.orientation === "y" && event.deltaY < 0) ||
            (this.orientation !== "y" && event.deltaX > 0);
        let opacity = (event.distance < 0 ? event.distance * -1 : event.distance) * 0.5 / this.element.offsetWidth;
        if (!!this._overlay) {
            this.renderer.setElementStyle(this.overlayElement, "transition", "opacity 0s ease");
            this.renderer.setElementStyle(this.overlayElement, "opacity", opacity.toString());
            this.renderer.setElementStyle(this.overlayElement, "background-color", this._overlay[like ? "like" : "dislike"].backgroundColor);
        }
        this.translate({
            x: event.deltaX,
            y: event.deltaY,
            rotate: ((event.deltaX * 20) / this.element.clientWidth)
        });
    }
    onAbort(event) {
        if (!!this._overlay) {
            this.renderer.setElementStyle(this.overlayElement, "transition", "opacity 0.2s ease");
            this.renderer.setElementStyle(this.overlayElement, "opacity", "0");
        }
    }
    onRelease(event) {
        let like = (this.orientation === "y" && event.deltaY < 0) ||
            (this.orientation !== "y" && event.deltaX > 0);
        if (this._callLike) {
            this._callLike.emit({ like });
        }
        if (this.onLike) {
            this.onLike.emit({ like });
        }
    }
    translate(params) {
        if (!this.fixed) {
            this.renderer.setElementStyle(this.element, "transition", "transform " + (params.time || 0) + "s ease");
            this.renderer.setElementStyle(this.element, "webkitTransform", "translate3d(" +
                (params.x && (!this.orientation || this.orientation.indexOf("x") != -1) ? (params.x) : 0) +
                "px, " +
                (params.y && (!this.orientation || this.orientation.indexOf("y") != -1) ? (params.y) : 0) +
                "px, 0) rotate(" +
                params.rotate +
                "deg)");
        }
    }
    initOverlay() {
        if (!!this._overlay) {
            this.overlayElement = document.createElement("div");
            this.overlayElement.className += " card-overlay";
            this.element.appendChild(this.overlayElement);
            this.renderer.setElementStyle(this.overlayElement, "transform", "translateZ(0)");
            this.renderer.setElementStyle(this.overlayElement, "opacity", "0");
            this.renderer.setElementStyle(this.overlayElement, "border-radius", "2px");
            this.renderer.setElementStyle(this.overlayElement, "position", "absolute");
            this.renderer.setElementStyle(this.overlayElement, "width", "100%");
            this.renderer.setElementStyle(this.overlayElement, "height", "100%");
            this.renderer.setElementStyle(this.overlayElement, "top", "0");
            this.renderer.setElementStyle(this.overlayElement, "left", "0");
            this.renderer.setElementStyle(this.overlayElement, "display", "flex");
            this.renderer.setElementStyle(this.overlayElement, "align-items", "center");
            this.renderer.setElementStyle(this.overlayElement, "justify-content", "center");
            this.renderer.setElementStyle(this.overlayElement, "overflow", "hidden");
            this.renderer.setElementStyle(this.overlayElement, "color", "white");
        }
    }
    ngOnInit() {
        this.initOverlay();
        this._overlay = this._overlay || {};
        this.orientation = this.orientation || "xy";
        this._callLike = this._callLike || new EventEmitter();
        this.initCallLike();
    }
    initCallLike() {
        this._callLike.subscribe((params) => {
            let el = this.element;
            let x = (el.offsetWidth + el.clientWidth) * (params.like ? 1 : -1);
            let y = (el.offsetHeight + el.clientHeight) * (params.like ? -1 : 1);
            this.translate({
                x: x,
                y: y,
                rotate: (x * 20) / el.clientWidth,
                time: 0.8
            });
            this.renderer.setElementStyle(this.overlayElement, "transition", "opacity 0.4s ease");
            this.renderer.setElementStyle(this.overlayElement, "opacity", "0.5");
            this.renderer.setElementStyle(this.overlayElement, "background-color", this._overlay[params.like ? "like" : "dislike"].backgroundColor);
            this.destroy(200);
        });
    }
    ngOnChanges(changes) {
        if (changes.callLike) {
            this._callLike = changes.callLike.currentValue || changes.callLike.previousValue || new EventEmitter();
            this.initCallLike();
        }
        if (changes.overlay) {
            this._overlay = changes.overlay.currentValue || changes.overlay.previousValue || {};
        }
    }
    ngOnDestroy() {
        if (this._callLike) {
            this._callLike.unsubscribe();
        }
    }
}
TinderCardDirective.decorators = [
    { type: Directive, args: [{
                selector: '[tinder-card]',
                host: {
                    class: 'card-heap'
                }
            },] },
];
/** @nocollapse */
TinderCardDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer, },
];
TinderCardDirective.propDecorators = {
    'overlay': [{ type: Input, args: ['tinder-card',] },],
    'callLike': [{ type: Input, args: ['callLike',] },],
    'fixed': [{ type: Input },],
    'orientation': [{ type: Input },],
    'onLike': [{ type: Output },],
    'onSwipe': [{ type: HostListener, args: ['onSwipe', ['$event'],] },],
    'onAbort': [{ type: HostListener, args: ['onAbort', ['$event'],] },],
    'onRelease': [{ type: HostListener, args: ['onRelease', ['$event'],] },],
};
//# sourceMappingURL=tinder-card.js.map