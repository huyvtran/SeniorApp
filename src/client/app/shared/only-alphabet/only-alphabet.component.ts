import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyAlphabet]'
})
export class OnlyAlphabetDirective {

  @Input() OnlyAlphabet: boolean;
  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    let e = <KeyboardEvent>event;

    if (this.OnlyAlphabet) {
      if ([8, 9, 13, 16, 27, 32, 46, 222].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.keyCode < 65 || e.keyCode > 90) && (e.keyCode > 96 || e.keyCode < 105)) {
        e.preventDefault();
      }
    }
  }
}
