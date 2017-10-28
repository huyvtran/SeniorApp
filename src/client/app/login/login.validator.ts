import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginValidationService } from './login.validation.service';

@Component({
  selector: 'control-messages',
  template: `<div *ngIf="errorMessage !== null" class="fontFamily form-control-feedback" style="">
  {{ errorMessage }} </div>`
})
export class LoginValidatorComponent {
  @Input() control: FormControl;
  @Input() htmlElem: any;
  constructor() {} // tslint:disable-line

  get errorMessage():any {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        let errorMsg = LoginValidationService.getValidatorErrorMessage(propertyName,this.control.errors[propertyName]);
        this.htmlElem.style.borderBottomColor= '#fff';
        this.htmlElem.style.borderBottomColor = '#FF0000';
        return errorMsg;
      }
    }
    return null;
  }
}
