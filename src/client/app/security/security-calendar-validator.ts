import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SecurityValidationService } from './security.validation.service';

@Component({
  selector: 'security-calendar-error-messages',
  template: `<div *ngIf="errorMessage !== null" class="fontFamily form-control-feedback-calendar" style="width:80%;">
  <span style="font-weight:bold;padding-right:1px;">X</span>
  {{ errorMessage }} </div>`,
  host: {'[style.min-width]': '"78%"', '[style.min-height]': '"16px"'}// tslint:disable-line
})
export class SecurityCalendarValidatorComponent {
  @Input() control: FormControl;
  @Input() htmlElem: any;
  constructor() {
  } // tslint:disable-line

  get errorMessage():any {
    for (let propertyName in this.control.errors) {
      try {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
          let errorMsg = SecurityValidationService.getValidatorErrorMessage(propertyName,this.control.errors[propertyName]);
          try { this.htmlElem.style.borderBottomColor = '#FF0000 !important';}catch(e){    }// tslint:disable-line
          return errorMsg ? errorMsg : null;
        }
      }catch(e){    }// tslint:disable-line
    }
    return null;
  }
}
