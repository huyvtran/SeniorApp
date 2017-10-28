import { Component, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HelpAdminModalComponent } from '../../../shared/modal-template/helpadmin.modal';
import { AdministrationService } from '../../administration.service';
import { DownloadCSVService } from '../../../shared/services/downloadcsv/downloadcsv.service';

@Component({
    moduleId: module.id,
    selector: 'sd-enroll-result',
    templateUrl: 'enrollresult.component.html',
    styleUrls: ['enrollresult.component.css']
})
export class EnrollmentsSearchResultComponent implements OnChanges {
    public paginateMessage = '';
    public countMessage: string = '';
    public pageNumber: number = 0;
    public noSearchResult: string = '';
    public showForm: boolean = false;
    public searchCriteria: any = '';
    public selectCheckBox: boolean = false;
    public enrollSearchList: any = [];
    public enrollSearchListTemp: any = [];
    public currentEnrollSearchList: any = [];
    public downloadData: any = [];
    public selectedData: any = [];
    public resendApp: boolean = false;
    public resendImage: boolean = false;
    public resendMessage: string = '';
    public filters: any = {};
    public failure: boolean = false;
    public success: boolean = false;
    public filterObj: any = [];

    @ViewChild('helpAdminModal') helpAdminModal: HelpAdminModalComponent;
    @Input() searchList: any;
    @Input() toggleSearchAccordanceID: boolean;
    @Input() searchObj: any;
    @Output() onResultToggle: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Constructor function.
     */
    constructor(private router: Router,
        private administrationService: AdministrationService,
        public downloadCSV: DownloadCSVService) {
        this.noSearchResult = '';
        this.showForm = false;
    }

    /**
     * Checkbox click event
     */
    ngOnChanges() {
        this.showForm = this.toggleSearchAccordanceID;
        this.searchCriteria = this.searchObj;
        this.onResultToggle.emit(this.showForm);
        this.enrollSearchList = [];
        this.enrollSearchListTemp = [];
        this.selectedData = [];
        this.noSearchResult = '';
        this.resendMessage = '';
        this.selectCheckBox = false;
        this.countMessage = '';
        this.resetFilter();
        this.enrollSearchList = this.searchList;
        this.pageNumber = 0;
        this.failure = false;
        this.success = false;
        this.pageNumber = 0;
        if (this.enrollSearchList)
            this.checkReportsData(this.enrollSearchList);

        if (!this.enrollSearchList) {
            this.noSearchResult = 'No Records found. Please refine your search criteria';
        } else {

            if (this.enrollSearchList[0] && this.enrollSearchList[0] === 'init') {
                this.showForm = false;
                this.enrollSearchList = [];
            } else {

                if (!this.enrollSearchList || !this.enrollSearchList.length) {
                    this.noSearchResult = 'No Records found. Please refine your search criteria';
                } else if (this.enrollSearchList.length > 1) {
                    this.countMessage = ': ' + this.enrollSearchList.length + ' Results Found';
                } else {
                    this.countMessage = ': ' + this.enrollSearchList.length + ' Result Found';
                }
                this.paginateMessage = this.getPaginateMessage();
            }
        }
    }

    /**
     * Reset Filter
     */
    public resetFilter() {
        this.filters = {};
    }


    /**
     * Toggle form display
     */
    public toggleResult() {
        this.showForm = !this.showForm;
        this.onResultToggle.emit(this.showForm);
    }

    /**
    * Pagination page click event & message
    */
    public paginationInfo(event: any) {
        if (this.enrollSearchListTemp.length !== 0) {
            let number1 = (event.first + event.rows + 1) - event.rows;
            let number2 = ((event.first + event.rows) > this.enrollSearchListTemp.length)
                ? this.enrollSearchListTemp.length : event.first + event.rows;
            this.paginateMessage = number1 + '-' + number2 + ' of ' + this.enrollSearchListTemp.length + ' Results';
            this.currentPageInfo(number1, number2, this.enrollSearchListTemp);
        } else {
            let number1 = (event.first + event.rows + 1) - event.rows;
            let number2 = ((event.first + event.rows) > this.enrollSearchList.length)
                ? this.enrollSearchList.length : event.first + event.rows;
            this.paginateMessage = number1 + '-' + number2 + ' of ' + this.enrollSearchList.length + ' Results';
            this.currentPageInfo(number1, number2, this.enrollSearchList);
        }
    }

    /**
     * Pagination message on click
     */
    public getPaginateMessage() {
        let message: string = '';

        if (!this.enrollSearchList || !this.enrollSearchList.length) {
            message = '';
        } else if (this.enrollSearchList.length > 10) {
            message = '1-10' + ' of ' + this.enrollSearchList.length + ' Results';
        } else if (this.enrollSearchList.length === 1) {
            message = '1-' + this.enrollSearchList.length + ' of ' + this.enrollSearchList.length + ' Result';
        } else {
            message = '1-' + this.enrollSearchList.length + ' of ' + this.enrollSearchList.length + ' Results';
        }
        return message;
    }

    /**
    * Checking Reports data length
    * @param data
    */
    public checkReportsData(data: any) {
        if (data) {
            if (data.length > 0 && data.length < 10) {
                this.currentPageInfo(1, data.length, data);
            } else if (data.length > 10) {
                this.currentPageInfo(1, 10, data);
            }
        }
        if (!data || !data.length) {
            this.downloadData = [];
        }
    }

    /**
     * Current page user details on datatable
     * @param number1
     * @param number2
     * @param data
     */
    public currentPageInfo(number1: number, number2: number, data: any) {
        let j: number = 0;
        this.currentEnrollSearchList = [];
        for (let i: number = number1 - 1; i < number2; i++) {
            this.currentEnrollSearchList[j] = data[i];
            j++;
        }
        this.saveDownloadData();
    }

    /**
    * Current data displayed on table stored to new object array
    */
    public saveDownloadData() {
        this.downloadData = [];
        this.currentEnrollSearchList.map((item: any) => {
            return {
                ACN: item.acn,
                CONFORMATION_NUMBER: item.confirmationNo,
                APP_STATUS: item.applicationStatus,
                APP_SUB_STATUS: item.appSubStatus,
                VERSION: item.applicationVersion,
                STATE: item.state,
                FIRST_NAME: item.firstName,
                LAST_NAME: item.lastName,
                DOB: item.dob,
                GENDER: item.sex,
                REQ_EFF: item.requestEffectiveDate,
                EB: item.ebReply,
                ACS: item.acsSentTimeStamp,
                MEDYSIS: item.medisysSentTimeStamp,
                IMAGING: item.imagingSentTimeStamp,
                HOV: item.hovSentTimeStamp,
                COSMO: item.cosmoSentTimeStamp,
                HICN: item.medicareClaimNo,
                PRODUCT_ID: item.productId,
                PRODUCT_NAME: item.productDisplayName,
                DOCUMENT_TYPE: item.documentType

            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
    }

    /**
   * Current data displayed on table stored to new object array
   */
    public saveAllDownloadData() {
        this.downloadData = [];
        this.enrollSearchList.map((item: any) => {
            return {
                ACN: item.acn,
                CONFORMATION_NUMBER: item.confirmationNo,
                APP_STATUS: item.applicationStatus,
                APP_SUB_STATUS: item.appSubStatus,
                VERSION: item.applicationVersion,
                STATE: item.state,
                FIRST_NAME: item.firstName,
                LAST_NAME: item.lastName,
                DOB: item.dob,
                GENDER: item.sex,
                REQ_EFF: item.requestEffectiveDate,
                EB: item.ebReply,
                ACS: item.acsSentTimeStamp,
                MEDYSIS: item.medisysSentTimeStamp,
                IMAGING: item.imagingSentTimeStamp,
                HOV: item.hovSentTimeStamp,
                COSMO: item.cosmoSentTimeStamp,
                HICN: item.medicareClaimNo,
                PRODUCT_ID: item.productId,
                PRODUCT_NAME: item.productDisplayName,
                DOCUMENT_TYPE: item.documentType

            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
        this.downloadPage();
    }

    /**
     * Download current Page details
     */
    public downloadPage() {
        console.log(this.downloadData);
        this.downloadCSV.downloadCurrentData(this.downloadData, 'Enrollments');
    }

    /**
     * Filter result and change the pagination message
     * @param event
     */
    public filterResult(event: any) {
        if (event.filteredValue) {
            this.enrollSearchListTemp = event.filteredValue;
            this.checkReportsData(event.filteredValue);
            if (event.filteredValue.length > 1) {
                this.countMessage = ': ' + event.filteredValue.length + ' Results Found';
            } else {
                this.countMessage = ': ' + event.filteredValue.length + ' Result Found';
            }
            this.filterObj = event.filteredValue;
        } else {
            this.enrollSearchListTemp = [];
        }

        if (!event.filteredValue || !event.filteredValue.length) {
            this.paginateMessage = '';
            this.filterObj = [];
        } else if (event.filteredValue.length > 10) {
            this.filterObj = event.filteredValue;
            this.paginateMessage = '1-10' + ' of ' + event.filteredValue.length + ' Results';
        } else if (event.filteredValue.length === 1) {
            this.paginateMessage = '1-' + event.filteredValue.length + ' of ' + event.filteredValue.length + ' Result';
        } else {
            this.paginateMessage = '1-' + event.filteredValue.length + ' of ' + event.filteredValue.length + ' Results';
        }
    }

    /**
     * Checkbox click event
     * @param event
     */
    public selectAllSubmitted(event: any) {
        console.log(this.filterObj);
        if (this.filterObj.length > 0) {
            this.addToSelectList(event, this.filterObj);
        } else {
            this.addToSelectList(event, this.enrollSearchList);
        }
    }

    /**
     * Add to select List and enable resend flags
     * @param event
     * @param dataList
     */
    public addToSelectList(event: any, dataList: any) {
        dataList.forEach(function (item: any) {
            if (event.target.checked) {
                item.status = true;
            } else {
                item.status = false;
            }
        });

        if (event.target.checked) {
            for (let i = 0, l = dataList.length; i < l; i++) {
                if (dataList[i].applicationStatus === 'SUBMITTED') {
                    this.selectedData.push(dataList[i]);
                    this.resendApp = true;
                    this.resendImage = true;
                }
            }
        } else {
            this.resendApp = false;
            this.resendImage = false;
            this.selectedData = [];
        }

        if (!event) {
            this.selectedData = [];
        }
    }
    /**
     * Single checkbox click event
     * @param row
     */
    public singleItemClick(row: any) {
        if (row.status) {
            this.resendApp = true;
            this.resendImage = true;
            this.selectedData.push(row);
        } else {
            this.findObject(row);

            if (this.selectedData.length === 0) {
                this.resendApp = false;
                this.resendImage = false;
            }
        }
    }

    /**
     * Removing an object selectedData list.
     * @param item
     */
    public findObject(item: any) {
        if (item) {

            for (var i = 0, l = this.selectedData.length; i < l; i++) {
                if (this.selectedData[i].acn === item.acn) {
                    this.selectedData.splice(i, 1);
                    return;
                }
            }
        }
    }

    /**
     * Resend application functionality
     */
    public resendApplication() {
        this.resendMessage = '';
        let postData: Array<string> = [];
        postData = this.selectedACNList();

        this.administrationService.enrollmentResendApplication(postData).subscribe((data: any) => {
            this.validateResultData(postData, data, false);
            this.selectCheckBox = false;
        }, (error: any) => { console.log('error : ' + error); });
    }

    /**
     * Resend application Imaging functionality
     */
    public resendApplicationImaging() {
        this.resendMessage = '';
        this.failure = false;
        this.success = false;

        if (this.validateEB()) {
            this.failure = true;
            this.resendMessage = 'Please resend the application- ' + this.validateEB() + ' before resending to imaging';
            return;
        }

        let postData: Array<string> = [];
        postData = this.selectedACNList();

        this.administrationService.enrollmentResendApplicationImaging(postData).subscribe((data: any) => {
            this.validateResultData(postData, data, true);
            this.selectCheckBox = false;
        }, (error: any) => { console.log('error : ' + error); });
    }

    /**
     * Validating result Data
     */
    public validateResultData(postData: Array<string>, data: any, flag: boolean) {
        if (data && data.responseCode === '200') {
            this.success = true;
            this.failure = false;
            this.initSearchResult();

            if (postData.length > 1) {
                this.resendMessage = 'Following ACNs (' + postData.toString() + ') were resent successfully';
            } else {
                this.resendMessage = (flag) ? 'Applications Resent to Imaging System Successfully' : 'Applications Resent Successfully';
            }
            this.selectedData = [];
            this.resendApp = false;
            this.resendImage = false;
        } else if (data && data.responseCode !== '200') {
            this.failure = true;
            this.success = false;
            this.resendMessage = (flag) ? 'Resend Application to Imaging System is Unsuccessful' : 'Resend Application is Unsuccessful';
        }
    }

    /**
     * Post data ACN list
     */
    public selectedACNList() {
        let data: Array<string> = [];

        if (this.selectedData) {

            for (var i = 0, l = this.selectedData.length; i < l; i++) {
                data.push(this.selectedData[i].acn);
            }
        }
        return data;
    }

    /**
     * Validating EB value before sending resending Imaging
     */
    public validateEB() {
        let message: string = '';

        for (let i = 0, l = this.selectedData.length; i < l; i++) {
            console.log(this.selectedData[i]);
            if (this.selectedData[i].ebReply === '' || this.selectedData[i].ebReply === null) {
                message = (message) ? message + ', ' + this.selectedData[i].acn : this.selectedData[i].acn;
            } else {
                message = (message) ? message : '';
            }
        }
        return message;
    }

    /**
     * Initializating this.enrollSearchList object.
     */
    public initSearchResult() {
        this.administrationService.enrollmentSearchReportService(this.searchCriteria).subscribe((data: any) => {
            this.enrollSearchList = [];
            this.enrollSearchList = data.appReportLineItem;
        }, (error: any) => { console.log('error : ' + error); });
    }

    /**
     * Re-Directing to home
     */
    public acnLinkRouter() {
        localStorage.setItem('administrationEnrollResulsRetain', '');
        this.router.navigate(['home']);
    }
}
