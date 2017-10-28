import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';
export class AnalyticsValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config: any = {
            'minlength': `Please enter at least ${validatorValue.requiredLength} characters`,
            'noToDate': `TO Date is required`,
            'noFromDate': `FROM Date is required`,
            'noToSubmitDate': `Please enter TO Submit Date`,
            'noFromSubmitDate': `Please enter FROM Submit Date`,
            'noToDOBDate': `Please enter TO DOB Date`,
            'noFromDOBDate': `Please enter FROM DOB Date`,
            'lessToDate': `TO Date is less than FROM Date`,
            'lessToSubmitDate': `TO Submit Date is less than FROM Submit Date`,
            'lessToDOBDate': `TO DOB date is less than FROM DOB date`,
            'validDate': `Please enter a valid Date`,
            'maximumDays': 'Date range is more than 90 days',
            'lessDOBDate' : `TO DOB Date is less than FROM Date`,
            'dateRangeMore90Days': `Date range is more than 90 days`,
            'toDateRequired': 'To Date is Required',
            'fromDateRequired': 'From Date is Required'
        };
        return config[validatorName];
    }
    static byPartnerDateValidator(actrl: AbstractControl) {
        try {
            let fromDate = actrl.get('fromDate').value;
            let toDate = actrl.get('toDate').value;
            if (!fromDate && !toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('fromDate').setErrors({ 'noFromDate': true });
                return { 'noFromDate': true };
            } else if (!fromDate && !toDate && actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('toDate').setErrors({ 'noToDate': true });
                return { 'noToDate': true };
            } else if (fromDate && !moment(fromDate).isValid() && !actrl.get('fromDate').hasError('validDate')) {
                actrl.get('fromDate').setErrors({ 'validDate': true });
                // console.log('a');
                return { 'validDate': true };
            } else if (fromDate && moment(fromDate).isAfter(moment(), 'day') && !actrl.get('fromDate').hasError('validDate')) {
                // console.log('a1');
                actrl.get('fromDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (fromDate && !toDate && !actrl.get('toDate').hasError('noToDate')) {
                // console.log(1);
                actrl.get('toDate').setErrors({ 'noToDate': true });
                return { 'noToDate': true };
            } else if (!fromDate && toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                // console.log(2);
                actrl.get('fromDate').setErrors({ 'noFromDate': true });
                return { 'noFromDate': true };
            } else if (toDate && !moment(toDate).isValid() && !actrl.get('toDate').hasError('validDate')) {
                actrl.get('toDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (toDate && moment(toDate).isAfter(moment(), 'day') && !actrl.get('toDate').hasError('validDate')) {
                // console.log(5);
                actrl.get('toDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (fromDate && toDate && moment(fromDate).isAfter(toDate, 'day') &&
                !actrl.get('fromDate').hasError('lessToDate') && !actrl.get('fromDate').hasError('validDate')) {
                // console.log(3);
                actrl.get('fromDate').setErrors({ 'lessToDate': true });
                return { 'lessToDate': true };
            } else {
                if (fromDate && toDate && !moment(fromDate).isAfter(toDate, 'day')) {
                    //actrl.get('fromDate').setErrors( null );
                    // console.log(6);
                    actrl.get('fromDate').setErrors(null);
                    actrl.get('toDate').setErrors(null);
                }
                return null;
            }
        } catch (e) { /* console.log(e); */ return null; }
    }

    static byProductTypeDateValidator(actrl: AbstractControl) {
        try {
            let fromDate = actrl.get('fromDate').value;
            let toDate = actrl.get('toDate').value;
            if (!fromDate && !toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('fromDate').setErrors({ 'noFromDate': true });
                return { 'noFromDate': true };
            } else if (!fromDate && !toDate && actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('toDate').setErrors({ 'noToDate': true });
                return { 'noToDate': true };
            } else if (fromDate && !moment(fromDate).isValid() && !actrl.get('fromDate').hasError('validDate')) {
                actrl.get('fromDate').setErrors({ 'validDate': true });
                // console.log('a');
                return { 'validDate': true };
            } else if (fromDate && moment(fromDate).isAfter(moment(), 'day') && !actrl.get('fromDate').hasError('validDate')) {
                // console.log('a1');
                actrl.get('fromDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (fromDate && !toDate && !actrl.get('toDate').hasError('noToDate')) {
                // console.log(1);
                actrl.get('toDate').setErrors({ 'noToDate': true });
                return { 'noToDate': true };
            } else if (!fromDate && toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                // console.log(2);
                actrl.get('fromDate').setErrors({ 'noFromDate': true });
                return { 'noFromDate': true };
            } else if (toDate && !moment(toDate).isValid() && !actrl.get('toDate').hasError('validDate')) {
                actrl.get('toDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (toDate && moment(toDate).isAfter(moment(), 'day') && !actrl.get('toDate').hasError('validDate')) {
                // console.log(5);
                actrl.get('toDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (fromDate && toDate && moment(toDate).diff(moment(fromDate), 'days') > 90 &&
                !actrl.get('fromDate').hasError('noFromDate') && !actrl.get('toDate').hasError('noToDate')) {
                // console.log(3);
                actrl.get('fromDate').setErrors({ 'maximumDays': true });
                return { 'maximumDays': true };
            } else if (fromDate && toDate && moment(fromDate).isAfter(toDate, 'day') &&
                !actrl.get('fromDate').hasError('lessToDate') && !actrl.get('fromDate').hasError('validDate')) {
                // console.log(3);
                actrl.get('fromDate').setErrors({ 'lessToDate': true });
                return { 'lessToDate': true };
            } else {
                if (fromDate && toDate && !moment(fromDate).isAfter(toDate, 'day')) {
                    //actrl.get('fromDate').setErrors( null );
                    // console.log(6);
                    actrl.get('fromDate').setErrors(null);
                    actrl.get('toDate').setErrors(null);
                }
                return null;
            }
        } catch (e) { /* console.log(e); */ return null; }
    }

    static latencyDateValidator(actrl: AbstractControl) {
        try {
            let fromDate = actrl.get('fromDate').value;
            let toDate = actrl.get('toDate').value;
            let fromSubmitDate = actrl.get('fromSubmitDate').value;
            let toSubmitDate = actrl.get('toSubmitDate').value;

            if (!fromDate && !toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('fromDate').setErrors({ 'noFromDate': true });
                // console.log('a');
                return { 'noFromDate': true };
            } else if (!fromDate && !toDate && actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('toDate').setErrors({ 'noToDate': true });
                // console.log('b');
                return { 'noToDate': true };
            } else if (fromDate && !moment(fromDate).isValid() && !actrl.get('fromDate').hasError('validDate')) {
                actrl.get('fromDate').setErrors({ 'validDate': true });
                // console.log('c');
                return { 'validDate': true };
            } else if (fromDate && moment(fromDate).isAfter(moment(), 'day') && !actrl.get('fromDate').hasError('validDate')) {
                // console.log('d');
                actrl.get('fromDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (fromDate && !toDate && !actrl.get('toDate').hasError('noToDate')) {
                // console.log('e');
                actrl.get('toDate').setErrors({ 'noToDate': true });
                return { 'noToDate': true };
            } else if (!fromDate && toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                // console.log('f');
                actrl.get('fromDate').setErrors({ 'noFromDate': true });
                return { 'noFromDate': true };
            } else if (toDate && !moment(toDate).isValid() && !actrl.get('toDate').hasError('validDate')) {
                actrl.get('toDate').setErrors({ 'validDate': true });
                // console.log('g');
                return { 'validDate': true };
            } else if (toDate && moment(toDate).isAfter(moment(), 'day') && !actrl.get('toDate').hasError('validDate')) {
                actrl.get('toDate').setErrors({ 'validDate': true });
                // console.log('h');
                return { 'validDate': true };
            } else if (fromDate && toDate && moment(fromDate).isAfter(toDate, 'day') &&
                !actrl.get('fromDate').hasError('lessToDate') && !actrl.get('fromDate').hasError('validDate')) {
                // console.log('i');
                actrl.get('fromDate').setErrors({ 'lessToDate': true });
                return { 'lessToDate': true };
            } else if (fromSubmitDate && !moment(fromSubmitDate).isValid() && !actrl.get('fromSubmitDate').hasError('validDate')) {
                actrl.get('fromSubmitDate').setErrors({ 'validDate': true });
                // console.log('j');
                return { 'validDate': true };
            } else if (fromSubmitDate && moment(fromSubmitDate).isAfter(moment(), 'day')
                && !actrl.get('fromSubmitDate').hasError('validDate')) {
                // console.log('k');
                actrl.get('fromSubmitDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (toSubmitDate && !moment(toSubmitDate).isValid() && !actrl.get('toSubmitDate').hasError('validDate')) {
                actrl.get('toSubmitDate').setErrors({ 'validDate': true });
                // console.log('l');
                return { 'validDate': true };
            } else if (toSubmitDate && moment(toSubmitDate).isAfter(moment(), 'day')
                && !actrl.get('toSubmitDate').hasError('validDate')) {
                // console.log('m');
                actrl.get('toSubmitDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (fromSubmitDate && toSubmitDate && moment(fromSubmitDate).isAfter(toSubmitDate, 'day') &&
                !actrl.get('fromSubmitDate').hasError('lessToSubmitDate') && !actrl.get('fromSubmitDate').hasError('validDate')) {
                actrl.get('fromSubmitDate').setErrors({ 'lessToSubmitDate': true });
                // console.log('n');
                return { 'lessToSubmitDate': true };
            } else {
                if (fromSubmitDate && toSubmitDate && !moment(fromSubmitDate).isAfter(toSubmitDate, 'day')) {
                    actrl.get('fromSubmitDate').setErrors(null);
                    actrl.get('toSubmitDate').setErrors(null);
                    // console.log('o');
                }
                if (fromDate && toDate && !moment(fromDate).isAfter(toDate, 'day')) {
                    actrl.get('fromDate').setErrors(null);
                    actrl.get('toDate').setErrors(null);
                    // console.log('p');
                }
                return null;
            }
        } catch (e) { /* // console.log(e); */ return null; }
    }

    static totalProfileDateValidator(actrl: AbstractControl) {
        try {
            let fromDate = actrl.get('fromDate').value;
            let toDate = actrl.get('toDate').value;
            let fromDOBDate = actrl.get('fromDOBDate').value;
            let toDOBDate = actrl.get('toDOBDate').value;

            if (!fromDate && !toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('fromDate').setErrors({ 'noFromDate': true });
                // console.log('a');
                return { 'noFromDate': true };
            } else if (!fromDate && !toDate && actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('toDate').setErrors({ 'noToDate': true });
                // console.log('b');
                return { 'noToDate': true };
            } else if (fromDate && !moment(fromDate).isValid() && !actrl.get('fromDate').hasError('validDate')) {
                actrl.get('fromDate').setErrors({ 'validDate': true });
                // console.log('c');
                return { 'validDate': true };
            } else if (fromDate && moment(fromDate).isAfter(moment(), 'day') && !actrl.get('fromDate').hasError('validDate')) {
                actrl.get('fromDate').setErrors({ 'validDate': true });
                // console.log('d');
                return { 'validDate': true };
            } else if (fromDate && !toDate && !actrl.get('toDate').hasError('noToDate')) {
                actrl.get('toDate').setErrors({ 'noToDate': true });
                // console.log('e');
                return { 'noToDate': true };
            } else if (!fromDate && toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('fromDate').setErrors({ 'noFromDate': true });
                // console.log('f');
                return { 'noFromDate': true };
            } else if (toDate && !moment(toDate).isValid() && !actrl.get('toDate').hasError('validDate')) {
                actrl.get('toDate').setErrors({ 'validDate': true });
                // console.log('g');
                return { 'validDate': true };
            } else if (toDate && moment(toDate).isAfter(moment(), 'day') && !actrl.get('toDate').hasError('validDate')) {
                actrl.get('toDate').setErrors({ 'validDate': true });
                // console.log('h');
                return { 'validDate': true };
            } else if (fromDate && toDate && moment(fromDate).isAfter(toDate, 'day') &&
                !actrl.get('fromDate').hasError('lessToDate') && !actrl.get('fromDate').hasError('validDate')) {
                actrl.get('fromDate').setErrors({ 'lessToDate': true });
                // console.log('i');
                return { 'lessToDate': true };
            } else if (fromDOBDate && !moment(fromDOBDate).isValid() && !actrl.get('fromDOBDate').hasError('validDate')) {
                actrl.get('fromDOBDate').setErrors({ 'validDate': true });
                // console.log('j');
                return { 'validDate': true };
            } else if (fromDOBDate && moment(fromDOBDate).isAfter(moment(), 'day')
                && !actrl.get('fromDOBDate').hasError('validDate')) {
                // console.log('k');
                actrl.get('fromDOBDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (toDOBDate && !moment(toDOBDate).isValid() && !actrl.get('toDOBDate').hasError('validDate')) {
                actrl.get('toDOBDate').setErrors({ 'validDate': true });
                // console.log('l');
                return { 'validDate': true };
            } else if (toDOBDate && moment(toDOBDate).isAfter(moment(), 'day')
                && !actrl.get('toDOBDate').hasError('validDate')) {
                actrl.get('toDOBDate').setErrors({ 'validDate': true });
                // console.log('m');
                return { 'validDate': true };
            } else if (fromDOBDate && toDOBDate && moment(fromDOBDate).isAfter(toDOBDate, 'day') &&
                !actrl.get('fromDOBDate').hasError('lessToDOBDate') && !actrl.get('fromDOBDate').hasError('validDate')) {
                actrl.get('fromDOBDate').setErrors({ 'lessToDOBDate': true });
                // console.log('n');
                return { 'lessToDOBDate': true };
            } else {
                if (fromDOBDate && toDOBDate && !moment(fromDOBDate).isAfter(toDOBDate, 'day')) {
                    actrl.get('fromDOBDate').setErrors(null);
                    actrl.get('toDOBDate').setErrors(null);
                    // console.log('o');
                }
                if (fromDate && toDate && !moment(fromDate).isAfter(toDate, 'day')) {
                    actrl.get('fromDate').setErrors(null);
                    actrl.get('toDate').setErrors(null);
                    // console.log('p');
                }
                return null;
            }
        } catch (e) { /* console.log(e); */ return null; }
    }

    static convertedDateValidator(actrl: AbstractControl) {
        try {
            let fromDate = actrl.get('fromDate').value;
            let toDate = actrl.get('toDate').value;
            if (!fromDate && !toDate) {
                actrl.get('fromDate').setErrors({ 'noFromDate': true });
                return { 'noFromDate': true };
            } else if (fromDate && !moment(fromDate).isValid()) {
                actrl.get('fromDate').setErrors({ 'validDate': true });
                // console.log('a');
                return { 'validDate': true };
            } else if (fromDate && moment(fromDate).isAfter(moment(), 'day')) {
                // console.log('a1');
                actrl.get('fromDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (fromDate && !toDate) {
                // console.log(1);
                actrl.get('toDate').setErrors({ 'noToDate': true });
                return { 'noToDate': true };
            } else if (!fromDate && toDate) {
                // console.log(2);
                actrl.get('fromDate').setErrors({ 'noFromDate': true });
                return { 'noFromDate': true };
            } else if (toDate && !moment(toDate).isValid()) {
                actrl.get('toDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (toDate && moment(toDate).isAfter(moment(), 'day')) {
                // console.log(5);
                actrl.get('toDate').setErrors({ 'validDate': true });
                return { 'validDate': true };
            } else if (fromDate && toDate && moment(fromDate).isAfter(toDate, 'day') &&
                !actrl.get('fromDate').hasError('lessToDate')) {
                // console.log(3);
                actrl.get('fromDate').setErrors({ 'lessToDate': true });
                return { 'lessToDate': true };
            } else if (fromDate && toDate && moment(toDate).diff(moment(fromDate), 'days') > 90 &&
                !actrl.get('fromDate').hasError('noFromDate') && !actrl.get('toDate').hasError('noToDate')) {
                // console.log(3);
                actrl.get('fromDate').setErrors({ 'maximumDays': true });
                return { 'maximumDays': true };
            } else {
                if (fromDate && toDate && !moment(fromDate).isAfter(toDate, 'day')) {
                    //actrl.get('fromDate').setErrors( null );
                    // console.log(6);
                    actrl.get('fromDate').setErrors(null);
                    actrl.get('toDate').setErrors(null);
                }
                return null;
            }
        } catch (e) { /* console.log(e); */ return null; }
    }

    static quotesDateValidator(actrl: AbstractControl) {
        try {
            let fromDate = actrl.get('fromDate').value;
            let toDate = actrl.get('toDate').value;
            let fromDOB = actrl.get('fromDOB').value;
            let toDOB = actrl.get('toDOB').value;
            if (!fromDate && !toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('fromDate').setErrors( {'noFromDate': true} );
                return { 'noFromDate': true };
            }else if (!fromDate && !toDate && actrl.get('fromDate').hasError('noFromDate')) {
                actrl.get('toDate').setErrors( {'noToDate': true} );
                return { 'noToDate': true };
            }else if (fromDate && ! moment(fromDate).isValid() &&  !actrl.get('fromDate').hasError('validDate')) {
                actrl.get('fromDate').setErrors( {'validDate': true} );
                // console.log('a');
                return { 'validDate': true };
            }else if (fromDate  && moment(fromDate).isAfter(moment(), 'day') &&  !actrl.get('fromDate').hasError('validDate')) {
                // console.log('a1');
                actrl.get('fromDate').setErrors( {'validDate': true} );
                return { 'validDate': true };
            }else if (fromDate && !toDate &&  !actrl.get('toDate').hasError('noToDate')) {
                // console.log(1);
                actrl.get('toDate').setErrors( {'noToDate': true} );
                return { 'noToDate': true };
            } else if (!fromDate && toDate &&  !actrl.get('fromDate').hasError('noFromDate')) {
                // console.log(2);
                actrl.get('fromDate').setErrors( {'noFromDate': true} );
                return { 'noFromDate': true };
            } else if (toDate && ! moment(toDate).isValid() &&  !actrl.get('toDate').hasError('validDate')) {
                actrl.get('toDate').setErrors( {'validDate': true} );
                return { 'validDate': true };
            } else if (toDate  && moment(toDate).isAfter(moment(), 'day') &&  !actrl.get('toDate').hasError('validDate')) {
                // console.log(5);
                actrl.get('toDate').setErrors( {'validDate': true} );
                return { 'validDate': true };
            } else if (fromDate && toDate && moment(toDate).diff(moment(fromDate), 'days') > 90 &&
                !actrl.get('fromDate').hasError('noFromDate') && !actrl.get('toDate').hasError('noToDate')) {
                // console.log(3);
                actrl.get('fromDate').setErrors( {'maximumDays': true} );
                return { 'maximumDays': true };
            } else if (fromDOB && toDOB && moment(fromDOB).isAfter(toDOB, 'day') &&
                !actrl.get('fromDOB').hasError('lessToDOBDate') &&  !actrl.get('fromDOB').hasError('validDate')) {
                // console.log(3);
                actrl.get('fromDOB').setErrors( {'lessToDOBDate': true} );
                return { 'lessToDOBDate': true };
            } else if (fromDOB && ! moment(fromDOB).isValid() &&  !actrl.get('fromDOB').hasError('validDate')) {
                actrl.get('fromDOB').setErrors( {'validDate': true} );
                return { 'validDate': true };
            } else if (fromDOB  && moment(fromDOB).isAfter(moment(), 'day') &&  !actrl.get('fromDOB').hasError('validDate')) {
                // console.log(5);
                actrl.get('fromDOB').setErrors( {'validDate': true} );
                return { 'validDate': true };
            } else if (toDOB && ! moment(toDOB).isValid() &&  !actrl.get('toDOB').hasError('validDate')) {
                actrl.get('toDOB').setErrors( {'validDate': true} );
                return { 'validDate': true };
            } else if (toDOB  && moment(toDOB).isAfter(moment(), 'day') &&  !actrl.get('toDOB').hasError('validDate')) {
                // console.log(5);
                actrl.get('toDOB').setErrors( {'validDate': true} );
                return { 'validDate': true };
            } else if (fromDate && toDate && moment(fromDate).isAfter(toDate, 'day') &&
                !actrl.get('fromDate').hasError('lessToDate') &&  !actrl.get('fromDate').hasError('validDate')) {
                // console.log(3);
                actrl.get('fromDate').setErrors( {'lessToDate': true} );
                return { 'lessToDate': true };
            } else {
                if (fromDate && toDate && !moment(fromDate).isAfter(toDate, 'day') ) {
                    //actrl.get('fromDate').setErrors( null );
                    // console.log(6);
                        actrl.get('fromDate').setErrors( null );
                        actrl.get('toDate').setErrors( null );
                }
                return null;
            }
        }catch(e) { /* console.log(e); */ return null;}
    }
    static leadsDateValidator(actrl: AbstractControl) {
        try {
            let fromDate = actrl.get('fromDate').value;
            let toDate = actrl.get('toDate').value;
                if (!fromDate && !toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                    actrl.get('fromDate').setErrors( {'noFromDate': true} );
                    return { 'noFromDate': true };
                }else if (fromDate && !toDate &&  !actrl.get('toDate').hasError('noToDate')) {
                    console.log(1);
                    actrl.get('toDate').setErrors( {'noToDate': true} );
                    return { 'noToDate': true };
                } else if (!toDate &&  !actrl.get('toDate').hasError('noToDate')) {
                    console.log(1);
                    actrl.get('toDate').setErrors( {'noToDate': true} );
                    return { 'noToDate': true };
                }else if (!fromDate && toDate && !actrl.get('fromDate').hasError('noFromDate')) {
                    console.log(2);
                    actrl.get('fromDate').setErrors( {'noFromDate': true} );
                    return { 'noFromDate': true };
                }else if (fromDate && ! moment(fromDate).isValid() &&  !actrl.get('fromDate').hasError('validDate')) {
                    actrl.get('fromDate').setErrors( {'validDate': true} );
                    // console.log('a');
                    return { 'validDate': true };
                }else if (toDate && ! moment(toDate).isValid() &&  !actrl.get('toDate').hasError('validDate')) {
                    actrl.get('toDate').setErrors( {'validDate': true} );
                    return { 'validDate': true };
                }else if (toDate  && moment(toDate).isAfter(moment(), 'day') &&  !actrl.get('toDate').hasError('validDate')) {
                    // console.log(5);
                    actrl.get('toDate').setErrors( {'validDate': true} );
                    return { 'validDate': true };
                }else if (fromDate  && moment(fromDate).isAfter(moment(), 'day') &&  !actrl.get('fromDate').hasError('validDate')) {
                    // console.log('a1');
                    actrl.get('fromDate').setErrors( {'validDate': true} );
                    return { 'validDate': true };
                } else if (fromDate && toDate && moment(fromDate).isAfter(toDate, 'day') &&
                !actrl.get('fromDate').hasError('lessToDate') &&  !actrl.get('fromDate').hasError('validDate')) {
                    console.log(3);
                    actrl.get('fromDate').setErrors( {'lessToDate': true} );
                    return { 'lessToDate': true };
                }else {
                    console.log(1111111);
                    if (fromDate && toDate && !moment(fromDate).isAfter(toDate, 'day') ) {
                        actrl.get('fromDate').setErrors( null );
                        if ( moment(toDate).diff(moment(fromDate), 'days') > 90) {
                            actrl.get('fromDate').setErrors( {'dateRangeMore90Days': true} );
                            return { 'dateRangeMore90Days': true };
                        } else {
                          //actrl.get('fromDate').setErrors( null );
                        }
                    }
                    return null;
                }
        }catch(e) { return null;}
    }
}
