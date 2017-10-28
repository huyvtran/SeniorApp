import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';
export class EnrollmentsValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config: any = {
            'minlength': `Please enter at least ${validatorValue.requiredLength} characters`,
            'invalidFname': `Please enter First Name`,
            'invalidLname': `Please enter Last Name`,
            'acnEightChar': `Invalid ACN, ACN must be 8 characters`,
            'invalidACN': `Please enter a valid ACN`,
            'acnSpace': `Please enter an ACN`,
            'confirmNoEightChar': `Confirmation No must be 8 characters`,
            'confirmNoSpace': `Please enter a Confirmation No`,
            'invalidConfirmNo': `Please enter a valid Confirmation No`,
            'invalidTrackingId': `Please enter a valid Tracking ID`,
            'TrackingIdNoSpace': `Please enter a Tracking ID`,
            'invalidHICN': `Please enter a valid HICN`,
            'hicnNoSpace': `Please enter a HICN`,
            'noFromDates': `FROM Date or FROM Req Eff date is required`,
            'noToDates': `TO Date or TO Req Eff date is required`,
            'noToDate': `Please enter TO Date`,
            'noFromDate': `Please enter FROM Date`,
            'noFromReqEffDate': `Please enter FROM Req Eff Date`,
            'noToReqEffDate': `Please enter TO Req Eff Date`,
            'lessToDate': `TO Date is less than FROM Date`,
            'lessToReqEffDate': `TO Req Eff Date is less than FROM Req Eff date`,
            'dateRangeMore90Days': `Date range is more than 90 days`,
            'validDate': `Please enter a valid Date`,
        };
        return config[validatorName];
    }
    static fNameValidator(control: any) {
        try {
            if (!control.value.match(/^$|\s+/)) {
                return null;
            } else {
                return { 'invalidFname': true };
            }
        } catch (e) { return null; }
    }
    static lNameValidator(control: any) {
        try {
            if (!control.value.match(/^$|\s+/)) {
                return null;
            } else {
                return { 'invalidLname': true };
            }
        } catch (e) { return null; }
    }
    static acnValidator(control: any) {
        var lines = control.value.split(/\n/);
        var texts = [];
        for (var i=0; i < lines.length; i++) {
            // only push this line if it contains a non whitespace character.
            if (/\S/.test(lines[i])) {
                try {
                if (lines[i].trim().length === 0) {
                    return { 'acnSpace' : true};
                    }
                if (!lines[i].match(/^[0-9a-zA-Z]+$/)) {
                        return { 'invalidACN' : true };
                    }
                if (lines[i].length < 8  || lines[i].length > 8) {
                    return { 'acnEightChar' : true};
                    }
                }catch(e) {};// tslint:disable-line
            }
        }
        return null;
    }
    static confirmationNoValidator(control: any) {
        try {
            if (control.value.trim().length === 0) {
                return { 'confirmNoSpace': true };
            }
            if (!control.value.match(/^[0-9a-zA-Z]+$/)) {
                return { 'invalidConfirmNo': true };
            }
            if (control.value.length < 8 || control.value.length > 8) {
                return { 'confirmNoEightChar': true };
            }

        } catch (e) { };// tslint:disable-line
        return null;
    }
    static trackingIdValidator(control: any) {
        try {
            if (control.value.length === 0) {
                return { 'TrackingIdNoSpace': true };
            }
            if (!control.value.match(/^[0-9a-zA-Z]+$/)) {
                return { 'invalidTrackingId': true };
            }
        } catch (e) { };// tslint:disable-line
        return null;
    }
    static hicnValidator(control: any) {
        try {
            if (control.value.length === 0) {
                return { 'hicnNoSpace': true };
            }
            if (!control.value.match(/^[0-9a-zA-Z]+$/)) {
                return { 'invalidHICN': true };
            }
        } catch (e) { };// tslint:disable-line
        return null;
    }
    static dateValidator(actrl: AbstractControl) {
        try {
            let fromDate = actrl.get('fromDate').value;
            let toDate = actrl.get('toDate').value;
            let fromReqEffDate = actrl.get('fromReqEffDate').value;
            let toReqEffDate = actrl.get('toReqEffDate').value;
            if (!fromDate && !fromReqEffDate  && !actrl.get('fromDate').hasError('noFromDates')) {
                let error : any = {'noFromDates': true};
                error = !toDate ? error : { 'noFromDate': true };
                actrl.get('fromDate').setErrors( error );
                return error;
            }
            if (!fromDate && !toDate && !fromReqEffDate && !toReqEffDate &&
                 !actrl.get('toDate').hasError('noToDates')) {
                    actrl.get('toDate').setErrors( {'noToDates': true} );
                    return {'noToDates': true};
            } else {
                if (fromDate && ! moment(fromDate).isValid() &&  !actrl.get('fromDate').hasError('validDate')) {
                    actrl.get('fromDate').setErrors( {'validDate': true} );
                    return { 'validDate': true };
                }else if (fromDate  && moment(fromDate).isAfter(moment(), 'day')
                    &&  !actrl.get('fromDate').hasError('validDate') ) {
                    actrl.get('fromDate').setErrors( {'validDate': true} );
                    return { 'validDate': true };
                }else if (fromDate && !toDate && !actrl.get('toDate').hasError('noToDate')) {
                    actrl.get('toDate').setErrors( {'noToDate': true} );
                    return { 'noToDate': true };
                } else if (toDate && ! moment(toDate).isValid() &&  !actrl.get('toDate').hasError('validDate')) {
                    actrl.get('toDate').setErrors( {'validDate': true} );
                    return { 'validDate': true };
                }else if (toDate  && moment(toDate).isAfter(moment(), 'day')
                    &&  !actrl.get('toDate').hasError('validDate')) {
                    actrl.get('toDate').setErrors( {'validDate': true} );
                    return { 'validDate': true };
                }else if (!fromDate && toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                    actrl.get('fromDate').setErrors( {'noFromDate': true} );
                    if(!toReqEffDate) {
                        actrl.get('fromReqEffDate').setErrors( null );
                    }
                    if(!fromReqEffDate) {
                        actrl.get('toReqEffDate').setErrors( null );
                    }
                    return { 'noFromDate': true };
                } else if (fromDate && toDate && moment(fromDate).isAfter(toDate, 'day') &&
                    !actrl.get('fromDate').hasError('lessToDate') && !actrl.get('fromDate').hasError('validDate')) {
                    actrl.get('fromDate').setErrors( {'lessToDate': true} );
                    return { 'lessToDate': true };
                } else if (!fromReqEffDate && toReqEffDate &&
                    !actrl.get('fromReqEffDate').hasError('noFromReqEffDate')) {
                    actrl.get('fromReqEffDate').setErrors( {'noFromReqEffDate': true} );
                    if(actrl.get('fromDate').hasError('noFromDates'))
                        actrl.get('fromDate').setErrors( null );
                    if(actrl.get('toDate').hasError('noToDates'))
                        actrl.get('toDate').setErrors( null );
                    return { 'noFromReqEffDate': true };
                } else if (toReqEffDate && moment(toReqEffDate).isAfter(moment(), 'day')
                    &&  !actrl.get('toReqEffDate').hasError('validDate')) {
                    actrl.get('toReqEffDate').setErrors( {'validDate': true} );
                    return { 'validDate': true };
                }else if (fromReqEffDate && !toReqEffDate &&  !actrl.get('toReqEffDate').hasError('noToReqEffDate')) {
                    if(actrl.get('fromDate').hasError('noFromDates'))
                        actrl.get('fromDate').setErrors( null );
                    if(actrl.get('toDate').hasError('noToDates'))
                        actrl.get('toDate').setErrors( null );
                    actrl.get('toReqEffDate').setErrors( {'noToReqEffDate': true} );
                    return { 'noToReqEffDate': true };
                }else if (fromReqEffDate && moment(fromReqEffDate).isAfter(moment(), 'day')
                                &&  !actrl.get('fromReqEffDate').hasError('validDate')) {
                    actrl.get('fromReqEffDate').setErrors( {'validDate': true} );
                    return { 'validDate': true };
                }else if (fromReqEffDate && toReqEffDate && moment(fromReqEffDate).isAfter(toReqEffDate, 'day') &&
                            !actrl.get('fromReqEffDate').hasError('lessToReqEffDate')
                            && !actrl.get('fromReqEffDate').hasError('validDate')) {
                    actrl.get('fromReqEffDate').setErrors( {'lessToReqEffDate': true} );
                    return { 'lessToReqEffDate': true };
                } else {
                    if ( fromReqEffDate && toReqEffDate && !moment(fromReqEffDate).isAfter(toReqEffDate, 'day')) {
                        if(!actrl.get('fromReqEffDate').hasError('validDate'))
                            actrl.get('fromReqEffDate').setErrors( null );
                        if(!actrl.get('toReqEffDate').hasError('validDate'))
                            actrl.get('toReqEffDate').setErrors( null );
                        if(!toDate) {
                            actrl.get('fromDate').setErrors( null );
                        }
                        if(!fromDate) {
                            actrl.get('toDate').setErrors( null );
                        }
                    }
                    if ( fromDate && toDate && !moment(fromDate).isAfter(toDate, 'day') ) {
                        if(!moment(fromDate).isAfter(moment(), 'day'))
                            actrl.get('fromDate').setErrors( null );
                        if(!moment(toDate).isAfter(moment(), 'day'))
                            actrl.get('toDate').setErrors( null );
                        if(!toReqEffDate) {
                            actrl.get('fromReqEffDate').setErrors( null );
                        }
                        if(!fromReqEffDate) {
                            actrl.get('toReqEffDate').setErrors( null );
                        }
                    }
                    return null;
                }
    }
        }catch(e) { return null;}
    }

}
