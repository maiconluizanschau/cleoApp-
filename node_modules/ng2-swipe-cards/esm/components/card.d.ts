import { ElementRef, EventEmitter, Renderer } from '@angular/core';
export declare class CardComponent {
    protected el: ElementRef;
    renderer: Renderer;
    fixed: Boolean;
    _orientation: string;
    orientation: string;
    _callDestroy: EventEmitter<any>;
    callDestroy: EventEmitter<any>;
    releaseRadius: any;
    released: Boolean;
    onRelease: EventEmitter<any>;
    onSwipe: EventEmitter<any>;
    onAbort: EventEmitter<any>;
    element: HTMLElement;
    direction: any;
    constructor(el: ElementRef, renderer: Renderer);
    translate(params: any): void;
    onSwipeCb(event: any): void;
    onAbortCb(event: any): void;
    ngOnInit(): void;
    initCallDestroy(): void;
    destroy(delay?: number): void;
    ngAfterViewChecked(): void;
    onPan(event: any): void;
    onPanEnd(event: any): void;
    ngOnDestroy(): void;
}
