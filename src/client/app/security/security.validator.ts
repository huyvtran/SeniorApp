import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SecurityValidationService } from './security.validation.service';

@Component({
  selector: 'security-error-messages',
  template: `<div *ngIf="errorMessage !== null" class="fontFamily form-control-feedback" style="">
  <span style="font-weight:bold;padding-right:3px;">X</span>
  {{ errorMessage }} </div>`,
  host: {'[style.min-width]': '"78%"', '[style.min-height]': '"16px"'}// tslint:disable-line
})
export class SecurityValidatorComponent {
  @Input() control: FormControl;
  @Input() htmlElem: any;
  constructor() {
  } // tslint:disable-line

  get errorMessage():any {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        let errorMsg = SecurityValidationService.getValidatorErrorMessage(propertyName,this.control.errors[propertyName]);
        this.htmlElem.style.borderBottomColor = '#FF0000 !important';
        return errorMsg?errorMsg:null;
      }else {
         this.htmlElem.style.borderBottomColor = '#777373 !important';
      }
    }
    return null;
  }
}
