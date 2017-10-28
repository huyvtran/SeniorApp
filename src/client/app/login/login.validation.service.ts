export class LoginValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config :any = {
            'required': 'Required',
            'invalidPassword': 'Please enter Password',
            'minlength': `Minimum length ${validatorValue.requiredLength}`,
            'pattern': `Not a Matched Pattern`,
            'invalidUsername' : `Please enter User Name`
        };

        return config[validatorName];
    }
    static userNameValidator(control:any) {
        if( !control.value.match(/^$|\s+/) ) {
            return null;
        }else {
            return {'invalidUsername':true};
        }
    }
    static passwordValidator(control:any) {
        if (!control.value.match(/^$|\s+/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }
}
