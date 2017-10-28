import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import { ReportsConfig } from '../api/reportsconfig';
import { SelectItem } from 'primeng/primeng';
import * as moment from 'moment';
import { DownloadCSVService } from '../../shared/services/downloadcsv/downloadcsv.service';
import { PaymentHistoryModalComponent } from '../../shared/modal-template/paymenthistory.modal';
import { HelpModalComponent } from '../../shared/modal-template/help.modal';
import { NopdfModalComponent } from '../../shared/modal-template/nopdf.modal';
import { ReportsValidatorComponent } from '../reports-validator';
import { ReportsCalendarValidatorComponent } from '../reports-calendar-validator';
import { ReportsValidationService } from '../reports-validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Config } from '../../shared/config/env.config';
import { Http, Headers, Response, Jsonp, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'reports-payments-search',
    templateUrl: 'reportspayments.component.html',
    styleUrls: ['reportspayments.component.css']
})
export class ReportsPaymentsComponent implements OnInit, AfterViewInit {
    public paymentDateError: string = '';
    public userACN: string = '';
    public userACNError: string = '';
    public trackingID: string = '';
    public trackingIDError: string = '';
    public noSearchResult: string = '';
    public reportPaymentList: any = [];
    public reportPaymentListTemp: any = [];
    public downloadData: any = [];
    public currentReportPaymentList: any = [];
    public showSearchCriteria: boolean = false;
    public showResult: boolean = false;
    public statusList: SelectItem[];
    public selectedStatus: any[] = [];
    public paginateMessage: string = '';
    public countMessage: string = '';
    public fromDate: Date;
    public toDate: Date;
    public maxToDate: Date;
    public maxFromDate: Date;
    public reportPaymentsByACNForm: any;
    public reportPaymentsByTrackingIdForm: any;
    public reportPaymentsByDateForm: any;
    public timer: any;
    public API_URL: string = Config.API;
    public calendarTextBoxMarginBtm = { 'margin-bottom': '0px' };
    public responsePdfUrl: string;
    public pdfacn: string = '';

    @ViewChild('paymentHistoryModal') paymentHistoryModal: PaymentHistoryModalComponent;
    @ViewChild('helpModal') helpModal: HelpModalComponent;
    @ViewChild('noPdfModal') noPdfModal: NopdfModalComponent;

    /**
     * Constructor function
     * @param reportService
     * @param reportsConfig
     */
    constructor(public reportService: ReportsService,
        public reportsConfig: ReportsConfig,
        private formBuilder: FormBuilder,
        private http: Http,
        public downloadCSV: DownloadCSVService) {

        this.statusList = reportsConfig.statusList();
        this.calendarTextBoxMarginBtm['margin-bottom'] = this.isIE() ? '-6px' : '0px';
    }

    ngOnInit() {
        this.resetAllFormBuilders();
    }
    ngAfterViewInit() {
        console.log('ngAfterViewInit');
    }
    public buildReportPaymentsByTrackingIdForm() {
        this.reportPaymentsByTrackingIdForm = this.formBuilder.group({
            'trackingNo': ['', [ReportsValidationService.trackingIdValidator]],
        });
    }
    public buildReportPaymentsByDateForm() {
        this.reportPaymentsByDateForm = this.formBuilder.group({
            fromDate: [null, []],
            toDate: [null, []],
            appStatus: [null, ''],
        }, {
                validator: ReportsValidationService.paymentDateValidator
            });
        this.setFromToDate();
    }
    public buildReportPaymentsByACNForm() {
        this.reportPaymentsByACNForm = this.formBuilder.group({
            'acn': ['', [ReportsValidationService.acnValidator]],
        });
    }
    public resetReportPaymentsByACNForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildReportPaymentsByACNForm();
        }, 500);
    }
    public resetReportPaymentsByTrackingIdForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildReportPaymentsByTrackingIdForm();
        }, 500);
    }
    public resetReportPaymentsByDateForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildReportPaymentsByDateForm();
            //this.setFromToDate();
        }, 500);
    }
    public resetAllFormBuilders() {
        this.buildReportPaymentsByDateForm();
        this.buildReportPaymentsByACNForm();
        this.buildReportPaymentsByTrackingIdForm();
    }
    applyMarkAsTouched(selectedForm: any) {
        for (let inner in selectedForm.controls) {
            selectedForm.get(inner).markAsTouched();
            selectedForm.get(inner).updateValueAndValidity();
        }
    }
    applyMarkAsTouchedByDateForm() {
        for (let inner in this.reportPaymentsByDateForm.controls) {
            this.reportPaymentsByDateForm.get(inner).markAsTouched();
            this.reportPaymentsByDateForm.get(inner).updateValueAndValidity();
        }
    }
    /**
     * Setting default from to dates
     */
    public setFromToDate() {
        let today = new Date();
        this.toDate = new Date();
        this.maxToDate = new Date();
        this.maxFromDate = new Date();
        this.fromDate = new Date();
        this.fromDate.setDate(today.getDate() - 90);
        this.maxFromDate.setDate(today.getDate() - 1);
        this.reportPaymentsByDateForm.get('fromDate').updateValueAndValidity();
        this.reportPaymentsByDateForm.get('fromDate').markAsDirty();
        this.reportPaymentsByDateForm.get('toDate').updateValueAndValidity();
        this.reportPaymentsByDateForm.get('toDate').markAsDirty();
    }

    /**
     * Search By App Status
     */
    public paymentReportByDate() {
        this.paymentDateError = '';
        this.applyMarkAsTouchedByDateForm();
        if (this.reportPaymentsByDateForm.dirty && this.reportPaymentsByDateForm.valid) {
            let data = this.serviceData('date');
            this.showSearchCriteria = !this.showSearchCriteria;
            this.serviceInvoke(data);
        } else {
            console.log('entered2');
            this.reportPaymentList = null;
        }
        return false;
    }

    /**
     * Search By ACN
     */
    public paymentReportByACN() {
        this.userACNError = '';
        this.applyMarkAsTouched(this.reportPaymentsByACNForm);
        if (this.reportPaymentsByACNForm.dirty && this.reportPaymentsByACNForm.valid) {
            let data = this.serviceData('acn');
            this.showSearchCriteria = !this.showSearchCriteria;
            this.serviceInvoke(data);
        } else {
            this.reportPaymentList = null;
        }
        return false;
    }

    /**
     * Search By Track ID
     */
    public paymentReportByTrackID() {
        this.trackingIDError = '';
        this.applyMarkAsTouched(this.reportPaymentsByTrackingIdForm);
        if (this.reportPaymentsByTrackingIdForm.dirty && this.reportPaymentsByTrackingIdForm.valid) {
            let data = this.serviceData('tid');
            this.showSearchCriteria = !this.showSearchCriteria;
            this.serviceInvoke(data);
        } else {
            this.reportPaymentList = null;
        }
    }

    /**
     * Web service invoke
     */
    public serviceInvoke(postData: any) {
        this.noSearchResult = '';
        this.countMessage = '';
        this.reportPaymentList = '';
        this.reportService.searchReportService(postData).subscribe((data: any) => {
            this.showResult = true;
            this.reportPaymentList = data.appReportLineItem;
            if (this.reportPaymentList)
                this.checkReportsData(this.reportPaymentList);
            if (!this.reportPaymentList || !this.reportPaymentList.length) {
                this.noSearchResult = 'No Records found. Please refine your search criteria';
            } else if (this.reportPaymentList.length > 1) {
                this.countMessage = ': ' + this.reportPaymentList.length + ' Results Found';
            } else {
                this.countMessage = ': ' + this.reportPaymentList.length + ' Result Found';
            }
            this.paginateMessage = this.getPaginateMessage();
        },
            (error: any) => { console.log('error : ' + error); this.noSearchResult = 'error'; });
    }

    /**
     *service data creation
     */
    public serviceData(type: string) {
        let data: any = '';

        switch (type) {
            case 'date': data = {
                'appSearchCriteriaBean': {
                    'medFromDateStr': moment(this.fromDate).format('MM/DD/YYYY'),
                    'medToDateStr': moment(this.toDate).format('MM/DD/YYYY'),
                    'appStatusesSelected': (this.selectedStatus.length === 10) ? ['All'] : this.selectedStatus,
                    'searchBy': 'MEDSUPP'
                }
            };
                break;
            case 'acn': data = {
                'appSearchCriteriaBean': {
                    'medAcn': this.userACN,
                    'searchBy': 'MEDSUPP_ACN'
                }
            };
                break;
            case 'tid': data = {
                'appSearchCriteriaBean': {
                    'medTrackingID': this.trackingID,
                    'searchBy': 'MEDSUPP_TRACKID'
                }
            };
                break;
        }

        return data;
    }

    /**
     * Pagination page click event & message
     */
    public paginationInfo(event: any) {
        if (this.reportPaymentListTemp.length !== 0) {
            let number1 = (event.first + event.rows + 1) - event.rows;
            let number2 = ((event.first + event.rows) > this.reportPaymentListTemp.length)
                ? this.reportPaymentListTemp.length : event.first + event.rows;
            this.paginateMessage = number1 + '-' + number2 + ' of ' + this.reportPaymentListTemp.length + ' Results';
            this.currentPageInfo(number1, number2, this.reportPaymentListTemp);
        } else {
            let number1 = (event.first + event.rows + 1) - event.rows;
            let number2 = ((event.first + event.rows) > this.reportPaymentList.length)
                ? this.reportPaymentList.length : event.first + event.rows;
            this.paginateMessage = number1 + '-' + number2 + ' of ' + this.reportPaymentList.length + ' Results';
            this.currentPageInfo(number1, number2, this.reportPaymentList);
        }
    }

    /**
     * Pagination message on click
     */
    public getPaginateMessage() {
        let message: string = '';

        if (!this.reportPaymentList || !this.reportPaymentList.length) {
            message = '';
        } else if (this.reportPaymentList.length > 10) {
            message = '1-10' + ' of ' + this.reportPaymentList.length + ' Results';
        } else if (this.reportPaymentList.length === 1) {
            message = '1-' + this.reportPaymentList.length + ' of ' + this.reportPaymentList.length + ' Result';
        } else {
            message = '1-' + this.reportPaymentList.length + ' of ' + this.reportPaymentList.length + ' Results';
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
        this.currentReportPaymentList = [];
        for (let i: number = number1 - 1; i < number2; i++) {
            this.currentReportPaymentList[j] = data[i];
            j++;
        }
        this.saveDownloadData();
    }

    /**
     *
     */
    public convertoToDateString(date: any) {
        if (date) {
            let newData = moment(date).format('MM/DD/YYYY HH:mm:ss');
            return newData;
        } else {
            return null;
        }
    }

    /**
     * Current data displayed on table stored to new object array
     */
    public saveDownloadData() {
        this.downloadData = [];
        this.currentReportPaymentList.map((item: any) => {
            return {
                ACN: item.acn,
                APP_STATUS: item.applicationStatus,
                APP_SUB_STATUS: item.appSubStatus,
                VERSION: item.applicationVersion,
                STATE: item.applicationState,
                FIRST_NAME: item.primaryFirst,
                LAST_NAME: item.primaryLast,
                HOV_SENT: this.convertoToDateString(item.medHOVTSStr),
                CREATED: this.convertoToDateString(item.medCreateDtStr),
                AGENT_FIRST: item.agentFirstName,
                AGENT_LAST: item.agentLastName,
                HICN: item.medicareClaimNo,
                INIT_PAY_TRACK_ID: item.initialPaymentTrackingID,
                INIT_PAY_CRT_DATE: item.medInitialPaymentDtStr,
                ONGOING_PAY_TRACK_ID: item.ongoingPaymentTrackingID,
                ONGOING_PAY_CRT_DATE: item.medOnGoingPaymentDtStr,
                DOCUMENT_TYPE: item.documentType
            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
    }

    /**
     * Download current Page details
     */
    public downloadCurrentPage() {
        this.downloadCSV.downloadCurrentData(this.downloadData, 'Payments');
    }

    /**
     * Sort result and save current
     * @param event
     */
    public sortResult(event: any) {
        //console.log(event.sortResult);
        //console.log(event.sortResult.length);
    }

    /**
     * Filter result and change the pagination message
     * @param event
     */
    public filterResult(event: any) {
        if (event.filteredValue) {
            this.checkReportsData(event.filteredValue);
            this.reportPaymentListTemp = event.filteredValue;
            if (event.filteredValue.length > 1) {
                this.countMessage = ': ' + event.filteredValue.length + ' Results Found';
            } else {
                this.countMessage = ': ' + event.filteredValue.length + ' Result Found';
            }
        } else {
            this.reportPaymentListTemp = [];
        }

        if (!event.filteredValue || !event.filteredValue.length) {
            this.paginateMessage = '';
        } else if (event.filteredValue.length > 10) {
            this.paginateMessage = '1-10' + ' of ' + event.filteredValue.length + ' Results';
        } else if (event.filteredValue.length === 1) {
            this.paginateMessage = '1-' + event.filteredValue.length + ' of ' + event.filteredValue.length + ' Result';
        } else {
            this.paginateMessage = '1-' + event.filteredValue.length + ' of ' + event.filteredValue.length + ' Results';
        }
    }

    public getPDFReport(acn: string) {
        this.responsePdfUrl = this.API_URL + 'reports/getPdf?acn=' + acn;
        this.pdfacn = acn;
        this.getPdfService().subscribe((response: any) => {
            if (response.status === 200) {
                window.open(this.API_URL + 'reports/getPdf?acn=' + acn, '_blank');
            } else {
                this.noPdfModal.show();
            }
        },
            (error: any) => {
                console.log('error : ' + error);
                this.noPdfModal.show();
            }
        );
    }

    public getPdfService(): Observable<Response> {
        return this.http.get(this.responsePdfUrl)
            .map(res => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    /**
     * Form Reset function
     */
    public resetResult() {
        this.reportPaymentList = [];
        this.reportPaymentListTemp = [];
        this.selectedStatus = [];
        this.paymentDateError = '';
        this.userACN = '';
        this.userACNError = '';
        this.trackingID = '';
        this.trackingIDError = '';
        this.noSearchResult = '';
        this.showResult = false;
        this.paginateMessage = '';
        this.countMessage = '';
    }

    public isIE() {
        let ua = window.navigator.userAgent;
        if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0) {
            return true;
        } else { return false; }
    }
}
