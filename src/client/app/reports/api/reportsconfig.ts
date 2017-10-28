import { Injectable } from '@angular/core';

@Injectable()
export class ReportsConfig {

    constructor() {
        console.log('Init');
    }

    /**
     * App Status List
     */
    public initAppStatusList() {
        return [{ value: 'INPROGRESS', label: 'INPROGRESS' }, { value: 'CANCELLED', label: 'CANCELLED' },
        { value: 'SUBMITTED', label: 'SUBMITTED' }, { value: 'SUBMITREJECT', label: 'SUBMITREJECT' },
        { value: 'APPROVED', label: 'APPROVED' }, { value: 'DENIED', label: 'DENIED' },
        { value: 'DUPLICATE', label: 'DUPLICATE' }, { value: 'PENDING', label: 'PENDING' },
        { value: 'CLOSED', label: 'CLOSED' }, { value: 'EXPIRED', label: 'EXPIRED' },
        { value: 'ACTIVE', label: 'ACTIVE' }];
    }

    /**
     * BackEnd Status List
     */
    public initBackEndStatusList() {
        return [{ value: 'ALL', label: 'ALL' }, { value: 'I', label: 'Confirmation Received' },
        { value: 'A', label: 'MediSys Confirmation' }, { value: 'X', label: 'Error' },
        { value: 'M', label: 'Manual' }];
    }

    /**
     * Create Partner List
     */
    public initCreatePartnerList() {
        return [{ value: 'AON', label: 'AON' }, { value: 'EMO', label: 'EMO' },
        { value: 'EXHEALTH', label: 'EXHEALTH' }, { value: 'INTACT', label: 'INTACT' }, { value: 'MADE', label: 'MADE' },
        { value: 'MPRODUCER', label: 'MPRODUCER' }, { value: 'OLS', label: 'OLS' }, { value: 'SEIBEL', label: 'SEIBEL' }];
    }

    /**
     * App Source List
     */
    public initAppSourceList() {
        return [{ value: 'ALL', label: 'ALL' }, { value: 'APAC', label: 'APAC' },
        { value: 'CONSUMERDIRECT', label: 'CONSUMER DIRECT' }, { value: 'EMO', label: 'EMO' },
        { value: 'EMOPARTNERS', label: 'EMO PARTNERS' }, { value: 'EXTERNALBROKER', label: 'EXTERNAL BROKER' },
        { value: 'EXTERNALMICROSITE', label: 'EXTERNAL MICROSITE' }, { value: 'FAX', label: 'FAX' },
        { value: 'FIELDSALES', label: 'FIELD SALES' }, { value: 'FIELDSALESMICROSITE', label: 'FIELD SALES MICROSITE' },
        { value: 'PAPER', label: 'PAPER' }, { value: 'TELESALES', label: 'TELESALES' },
        { value: 'TELESALESMICROSITE', label: 'TELESALES MICROSITE' }];
    }

    /**
     * Submit Partner List
     */
    public initSubmitPartnerList() {
        return [{ value: 'AON', label: 'AON' },
        { value: 'EMO', label: 'EMO' }, { value: 'EXHEALTH', label: 'EXHEALTH' },
        { value: 'INTACT', label: 'INTACT' }, { value: 'MADE', label: 'MADE' },
        { value: 'MPRODUCER', label: 'MPRODUCER' }, { value: 'OLS', label: 'OLS' }];
    }

    /**
     * State List
     */
    public initStateList() {
        return [{ value: 'ALL', label: 'ALL' }, { value: 'CA', label: 'CA' },
        { value: 'CO', label: 'CO' }, { value: 'CT', label: 'CT' }, { value: 'GA', label: 'GA' },
        { value: 'IN', label: 'IN' }, { value: 'KY', label: 'KY' }, { value: 'MD', label: 'MD' },
        { value: 'ME', label: 'ME' }, { value: 'MO', label: 'MO' }, { value: 'MD', label: 'MD' },
        { value: 'NH', label: 'NH' },
        { value: 'NM', label: 'NM' }, { value: 'NV', label: 'NV' }, { value: 'NY', label: 'NY' },
        { value: 'NJ', label: 'NJ' }, { value: 'OH', label: 'OH' }, { value: 'TN', label: 'TN' },
        { value: 'TX', label: 'TX' }, { value: 'VA', label: 'VA' }, { value: 'WA', label: 'WA' },
        { value: 'WI', label: 'WI' }, { value: 'WX', label: 'WX' }, { value: 'KS', label: 'KS' }];
    }

    /**
     * Brand List
     */
    public initBrandList() {
        return [{ value: 'ALL', label: 'ALL' }, { value: 'ANTHEM', label: 'ANTHEM' },
        { value: 'AMV', label: 'AMV' }, { value: 'BCBSGA', label: 'BCBSGA' },
        { value: 'BCBSKC', label: 'BCBSKC' }, { value: 'BCBSKS', label: 'BCBSKS' },
        { value: 'BCC', label: 'BCC' }, { value: 'EMPBC', label: 'EMPBC' },
        { value: 'EMPBCBS', label: 'EMPBCBS' }, { value: 'UNICARE', label: 'UNICARE' }];
    }

    /**
     * App type List
     */
    public initApptypeList() {
        return [{ value: 'ALL', label: 'ALL' }, { value: 'MA_PFFS,MA_RPPO,MA_HMO,MA_LPPO,MA_SNP', label: 'Medicare Advantage(All)' },
        { value: 'MEDSUPP', label: 'Medicare Supplement' }, { value: 'PDP', label: 'PDP' },
        { value: 'MA_PFFS', label: 'Medicare Adv PFFS' }, { value: 'MA_RPPO', label: 'Medicare R-PPO' },
        { value: 'MA_HMO', label: 'Medicare HMO' }, { value: 'MA_LPPO', label: 'Medicare L-PPO' },
        { value: 'MA_SNP', label: 'Medicare SNP' }];
    }

    /**
     * App Fields List
     */
    public initAppFieldsList() {
        return [{ value: 'ALL', label: 'ALL' }, { value: 'NewEnrollment', label: 'New Enrollment' },
        { value: 'PlanChange', label: 'Change of Coverage' },
        { value: 'IndvPolicyNum', label: 'Individual Policy Number' }];
    }

    /**
     * Device Type List
     */
    public initDeviceTypeList() {
        return [{ value: 'ALL', label: 'ALL' }, { value: 'MOBILE', label: 'MOBILE' },
        { value: 'NONMOBILE', label: 'NON-MOBILE' }];
    }

    /**
     * Approval Status List
     */
    public initApprovalStatusList() {
        return [{ value: 'ALL', label: 'ALL' }, { value: 'AUTO_APPROVED', label: 'Auto Approved' },
        { value: 'SUBMITTED_FOR_REVIEW', label: 'Submitted for Review' }];
    }

    /**
     * BackEnd List
     */
    public initBackEndList() {
        return [{ value: 'ALL', label: 'ALL' }, { value: 'ACS', label: 'ACS' },
        { value: 'HOV', label: 'MED SUPP' }, { value: 'MEDISYS', label: 'MEDISYS' },
        { value: 'FACETS', label: 'CM FACETS' }, { value: 'COSMO', label: 'COSMO' }];
    }

    /**
     * Status List - Payment
     */
    public statusList() {
        return [{ value: 'ACTIVE', label: 'Active' },
        { value: 'APPROVED', label: 'Approved' }, { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'DENIED', label: 'Denied' }, { value: 'DUPLICATE', label: 'Duplicate' },
        { value: 'EXPIRED', label: 'Expired' }, { value: 'INPROGRESS', label: 'In Progress' },
        { value: 'PENDING', label: 'Pending' }, { value: 'SUBMITTED', label: 'Submitted' },
        { value: 'SUBMITREJECT', label: 'Submit Reject' }];
    }
}
