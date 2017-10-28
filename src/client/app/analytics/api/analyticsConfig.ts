import { Injectable } from '@angular/core';

@Injectable()
export class AnalyticsConfig {

    constructor() {
        console.log('Init');
    }

    /**
     * Brand List
     */
    public initBrandList() {
        return [{ value: 'ANTHEM', label: 'ANTHEM' },
        { value: 'AMV', label: 'AMV' }, { value: 'BCBSKC', label: 'BCBSKC' },
        { value: 'BCBSKS', label: 'BCBSKS' }, { value: 'BCBSGA', label: 'BCBSGA' },
        { value: 'BCC', label: 'BCC' }, { value: 'EMPBC', label: 'EMPBC' },
        { value: 'EMPBCBS', label: 'EMPBCBS' }, { value: 'UNICARE', label: 'UNICARE' }];
    }

    /**
      * State List
      */
    public initStateList() {
        return [{ value: 'AK', label: 'AK' },
        { value: 'AL', label: 'AL' }, { value: 'AR', label: 'AR' },
        { value: 'AZ', label: 'AZ' }, { value: 'CA', label: 'CA' },
        { value: 'CO', label: 'CO' }, { value: 'CT', label: 'CT' },
        { value: 'DC', label: 'DC' }, { value: 'FL', label: 'FL' },
        { value: 'GA', label: 'GA' },{ value: 'HI', label: 'HI' },
        { value: 'IA', label: 'IA' }, { value: 'ID', label: 'ID' },
        { value: 'IL', label: 'IL' }, { value: 'IN', label: 'IN' },
        { value: 'KS', label: 'KS' }, { value: 'KY', label: 'KY' },
        { value: 'LA', label: 'LA' }, { value: 'MA', label: 'MA' },
        { value: 'MD', label: 'MD' }, { value: 'ME', label: 'ME' },
        { value: 'MI', label: 'MI' }, { value: 'MN', label: 'MN' },
        { value: 'MO', label: 'MO' }, { value: 'MS', label: 'MS' },
        { value: 'MT', label: 'MT' }, { value: 'NA', label: 'NA' },
        { value: 'NC', label: 'NC' },
        { value: 'ND', label: 'ND' }, { value: 'NE', label: 'NE' },
        { value: 'NH', label: 'NH' }, { value: 'NJ', label: 'NJ' },
        { value: 'NM', label: 'NM' }, { value: 'NV', label: 'NV' },
        { value: 'NY', label: 'NY' }, { value: 'OH', label: 'OH' },
        { value: 'OK', label: 'OK' }, { value: 'OR', label: 'OR' },
        { value: 'PA', label: 'PA' }, { value: 'RI', label: 'RI' },
        { value: 'SC', label: 'SC' }, { value: 'SD', label: 'SD' },
        { value: 'TN', label: 'TN' },
        { value: 'TX', label: 'TX' }, { value: 'VA', label: 'VA' },
        { value: 'VT', label: 'VT' }, { value: 'WA', label: 'WA' },
        { value: 'WI', label: 'WI' }, { value: 'WV', label: 'WV' },
        { value: 'WY', label: 'WY' }];
    }

    /**
     * Product List
     */
    public initProductList() {
        return [{ value: 'MA', label: 'MA' },
        { value: 'MAPD', label: 'MAPD' }, { value: 'MED_SUPP', label: 'MED SUPP' },
        { value: 'PDP', label: 'PDP' }];
    }

    /**
     * Product Types List
     */
    public initProductTypesList() {
        return [{ value: 'MA', label: 'MA' }, { value: 'MAPD', label: 'MAPD' },
        { value: 'MEDSUPP', label: 'MED SUPP' }, { value: 'PDP', label: 'PDP' }];
    }

    /**
     * Create Partner List
     */
    public initCreatePartnerList() {
        return [{ value: 'EMO', label: 'EMO' }, { value: 'INTACT', label: 'INTACT' },
        { value: 'MADE', label: 'MADE' }, { value: 'MPRODUCER', label: 'MPRODUCER' },
        { value: 'OLS', label: 'OLS' }, { value: 'SEIBEL', label: 'SEIBEL' }];
    }


    /**
     * Submit Partner List
     */
    public initSubmitPartnerList() {
        return [{ value: 'EMO', label: 'EMO' }, { value: 'INTACT', label: 'INTACT' },
        { value: 'MADE', label: 'MADE' }, { value: 'MPRODUCER', label: 'MPRODUCER' },
        { value: 'OLS', label: 'OLS' }];
    }


    /**
     * App Source List
     */
    public initAppSourceList() {
        return [{ value: 'all', label: 'ALL' }, { value: 'APAC', label: 'APAC' },
        { value: 'CONSUMERDIRECT', label: 'CONSUMER DIRECT' }, { value: 'EMO', label: 'EMO' },
        { value: 'EMOPARTNERS', label: 'EMO PARTNERS' }, { value: 'EXTERNALBROKER', label: 'EXTERNAL BROKER' },
        { value: 'EXTERNALMICROSITE', label: 'EXTERNAL MICROSITE' }, { value: 'FAX', label: 'FAX' },
        { value: 'FIELDSALES', label: 'FIELD SALES' }, { value: 'FIELDSALESMICROSITE', label: 'FIELD SALES MICROSITE' },
        { value: 'PAPER', label: 'PAPER' }, { value: 'TELESALES', label: 'TELESALES' },
        { value: 'TELESALESMICROSITE', label: 'TELESALES MICROSITE' }];
    }

    /**
     * Gender List
     */
    public initGenderList() {
        return [{ value: '', label: 'Select' }, { value: 'M', label: 'MALE' }, { value: 'F', label: 'FEMALE' }];
    }
}
