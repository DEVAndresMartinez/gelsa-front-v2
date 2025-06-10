import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  private dragging = false;
  private offset = { x: 0, y: 0 };
  private modal: HTMLElement | null = null;

  constructor(private el: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.modal = this.el.nativeElement.parentElement;
    if (!this.modal) return;

    this.dragging = true;
    const rect = this.modal.getBoundingClientRect();
    this.offset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    event.preventDefault();
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.dragging || !this.modal) return;
    this.modal.style.position = 'fixed';
    this.modal.style.left = (event.clientX - this.offset.x) + 'px';
    this.modal.style.top = (event.clientY - this.offset.y) + 'px';
    this.modal.style.margin = '0';
  };

  onMouseUp = () => {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
}