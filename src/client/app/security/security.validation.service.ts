import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';
export class SecurityValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config :any = {
            'minlength': `Please enter at least ${validatorValue.requiredLength} characters`,
            'invalidFname' : `Please enter First Name`,
            'invalidLname' : `Please enter Last Name`,
            'invalidEmail' : `Please enter a valid Email address`,
            'validDate': `Please enter a valid Date`,
        };
        return config[validatorName];
    }
    static fNameValidator(control:any) {
        try {
            if( !control.value.match(/^$|\s+/) ) {
                return null;
            }else {
                return {'invalidFname':true};
            }
        }catch(e) { return null; }
    }
    static lNameValidator(control:any) {
        try {
            if( !control.value.match(/^$|\s+/) ) {
                return null;
            }else {
                return {'invalidLname':true};
            }
        }catch(e) { return null; }
    }
    static emailValidator(control:any) {
        try {
            if(control.value.length >0 && control.value.match(/^$|\s+/)) {
                return { 'invalidEmail': true };
            }else  if (control.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,19})+$/)) {
                return null;
            }else if(control.value.length <=0) {
                return null;
            } else {
                return { 'invalidEmail': true };
            }
        }catch(e) { return null; }
    }
    static dobValidator(actrl: AbstractControl) {
        try {
            let dob = actrl.get('dateOfBirth').value;
            //console.log('dob',dob);
            if (dob  && moment(dob).isAfter(moment(), 'day') &&  !actrl.get('dateOfBirth').hasError('validDate')) {
              //  console.log('a1');
                actrl.get('dateOfBirth').setErrors( {'validDate': true} );
                return { 'validDate': true };
            }else {
                //console.log('a2');
                //actrl.get('dateOfBirth').setErrors( null );
                return null;
            }
        }catch(e) { console.log(e);  return null;}
    }

}
