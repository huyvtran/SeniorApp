import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar, SelectItem } from 'primeng/primeng';
import { AdministrationService } from '../../administration.service';
import { EnrollConfig } from '../../api/enrollConfig';
import { ModalDirective, ModalModule } from 'ngx-bootstrap';
import * as moment from 'moment';
import { EnrollmentsValidatorComponent } from '../enrollments-validator';
import { EnrollmentsCalendarValidatorComponent } from '../enrollments-calendar-validator';
import { EnrollmentsValidationService } from '../enrollments-validation.service';


@Component({
    moduleId: module.id,
    selector: 'sd-enroll-advanced',
    templateUrl: 'enrolladvance.component.html',
    styleUrls: ['enrolladvance.component.css'],
})
export class EnrollmentsAdvanceComponent implements OnInit {
    public formValidationError: string = '';
    public reportDateValidationError: string = '';
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public enrollSearchList: any = [];
    public showForm: boolean = false;
    public showResult: boolean = false;
    public openMore: string = 'block';
    public closeMore: string = 'none';
    public noSearchResult: string = '';
    public enrollAdvancedSearchForm: any;

    public appStatusList: SelectItem[];
    public backEndList: SelectItem[];
    public backEndStatusList: SelectItem[];
    public appSourceList: SelectItem[];
    public appTypeList: SelectItem[];
    public stateList: SelectItem[];
    public brandList: SelectItem[];

    public selectedAppStatus: any[] = [];
    public selectedBackEnd: string = '';
    public selectedAppField: string = '';
    public selectedBackEndStatus: string = '';
    public selectedAppSource: string = '';
    public selectedAppType: string = '';
    public selectedState: string = '';
    public selectedDeviceType: string = '';
    public selectedBrand: string = '';

    public paginateMessage: string = '';
    public fromDate: Date;
    public toDate: Date;
    public fromReqEffDate: Date;
    public toReqEffDate: Date;
    public maxFromDate: Date;
    public maxToDate: Date;
    public maxFromReqEffDate: Date;
    public maxToReqEffDate: Date;
    public isMoreBtnExpanded: boolean = false;
    public timer : any;
    public calendarTextBoxMarginBtm = { 'margin-bottom':'0px' };

    @Output() advancedSearchNotify: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Constructor function
     * @param formBuilder
     * @param reportService
     * @param enrollConfig
     */
    constructor(private formBuilder: FormBuilder,
        public administrationService: AdministrationService,
        public enrollConfig: EnrollConfig) {
        this.calendarTextBoxMarginBtm['margin-bottom'] = this.isIE() ? '-1px' : '0px';
    }

    /**
     * Init Block
     */
    ngOnInit() {
        this.manageBackButtonDataRetain();
        this.buildEnrollAdvancedSearchForm();
        this.initForm();
    }

    manageBackButtonDataRetain() {
        try {
            let retainedInfo: any = JSON.parse(sessionStorage.getItem('administrationEnrollResulsRetain'));
            if (retainedInfo.isFromBack === true && retainedInfo.searchType === 'advance') {
                this.retainLessSearchCriteriaDateFields(retainedInfo);
                this.retainMoreSearchCriteriaFields(retainedInfo);
                if (this.isMoreBtnExpanded) {
                    this.openMore = 'block';
                    this.closeMore = 'none';
                }
                this.invokService(retainedInfo.searchedCriteria);
            }
        } catch (e) { } // tslint:disable-line
    }

    /**
     * Retain the search criteria date field
     * @param retainedInfo
     */
    retainLessSearchCriteriaDateFields(retainedInfo: any) {
        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.fromDateStr) {
            this.fromDate = retainedInfo.searchedCriteria.appSearchCriteriaBean.fromDateStr;
        }

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.toDateStr) {
            this.toDate = retainedInfo.searchedCriteria.appSearchCriteriaBean.toDateStr;
        }

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.fromReqEffDateStr) {
            this.fromReqEffDate = retainedInfo.searchedCriteria.appSearchCriteriaBean.fromReqEffDateStr;
        }

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.toReqEffDateStr) {
            this.toReqEffDate = retainedInfo.searchedCriteria.appSearchCriteriaBean.toReqEffDateStr;
        }

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.status.length > 0) {
            this.selectedAppStatus = retainedInfo.searchedCriteria.appSearchCriteriaBean.status;
        }

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.backEnd) {
            this.selectedBackEnd = retainedInfo.searchedCriteria.appSearchCriteriaBean.backEnd;
        }
    }

    /**
     * To retain more search criteria field value
     * @param retainedInfo
     */
    retainMoreSearchCriteriaFields(retainedInfo: any) {

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.appFields) {
            this.selectedAppField = retainedInfo.searchedCriteria.appSearchCriteriaBean.appFields;
            this.isMoreBtnExpanded = true;
        }

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.muStatus) {
            this.selectedBackEndStatus = retainedInfo.searchedCriteria.appSearchCriteriaBean.muStatus;
            this.isMoreBtnExpanded = true;
        }

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.appType) {
            this.selectedAppType = retainedInfo.searchedCriteria.appSearchCriteriaBean.appType;
            this.isMoreBtnExpanded = true;
        }

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.appSource) {
            this.selectedAppSource = retainedInfo.searchedCriteria.appSearchCriteriaBean.appSource;
            this.isMoreBtnExpanded = true;
        }

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.state) {
            this.selectedState = retainedInfo.searchedCriteria.appSearchCriteriaBean.state;
            this.isMoreBtnExpanded = true;
        }

        if (retainedInfo.searchedCriteria.appSearchCriteriaBean.brand) {
            this.selectedBrand = retainedInfo.searchedCriteria.appSearchCriteriaBean.brand;
            this.isMoreBtnExpanded = true;
        }
    }

    /**
     * Select, multiselect dropdwon initialization
     */
    initForm() {
        this.initDateFields();
        this.appStatusList = this.enrollConfig.initAppStatusList();
        this.backEndStatusList = this.enrollConfig.initBackEndStatusList();
        this.appSourceList = this.enrollConfig.initAppSourceList();
        this.stateList = this.enrollConfig.initStateList('adminAdv');
        this.brandList = this.enrollConfig.initBrandList();
        this.appTypeList = this.enrollConfig.initApptypeList('adminAdv');
        this.backEndList = this.enrollConfig.initBackEndList('adminAdv');
    }

    /**
     * Initialize Date
     */
    initDateFields() {
        this.maxToDate = new Date();
        this.maxFromDate = new Date();
        this.maxToReqEffDate = new Date();
        this.maxFromReqEffDate = new Date();
    }
    buildEnrollAdvancedSearchForm () {
        this.enrollAdvancedSearchForm = this.formBuilder.group({
            fromDate: [null, []],
            toDate: [null, []],
            fromReqEffDate: [null, []],
            toReqEffDate: [null, []],
            appStatus: [null, ''],
            backEnd: ['', ''],
            appSource: ['', ''],
            state: ['', ''],
            brand: ['', ''],
            appType: ['', ''],
            backEndStatus: ['', ''],
        },{
            validator: EnrollmentsValidationService.dateValidator
          });
    }
    public resetEnrollAdvancedSearchForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildEnrollAdvancedSearchForm();
        }, 500);
    }
    applyMarkAsTouched() {
        this.enrollAdvancedSearchForm.get('fromDate').markAsTouched();
        this.enrollAdvancedSearchForm.get('fromDate').updateValueAndValidity();
        this.enrollAdvancedSearchForm.get('toDate').markAsTouched();
        this.enrollAdvancedSearchForm.get('toDate').updateValueAndValidity();
        this.enrollAdvancedSearchForm.get('fromReqEffDate').markAsTouched();
        this.enrollAdvancedSearchForm.get('fromReqEffDate').updateValueAndValidity();
        this.enrollAdvancedSearchForm.get('toReqEffDate').markAsTouched();
        this.enrollAdvancedSearchForm.get('toReqEffDate').updateValueAndValidity();
    }
    /**
     * Search function
     */
    public searchReport() {
        this.noSearchResult = '';
        this.enrollSearchList = '';
        // this.reportDateValidationError = this.validateField();

        this.applyMarkAsTouched();
        if (this.enrollAdvancedSearchForm.dirty && this.enrollAdvancedSearchForm.valid) {
            let postData = this.serviceData();
            this.invokService(postData);
        }
    }

    /**
     * Search service invoke
     */
    public invokService(postData: any) {
        let enrollment: any = {};
        enrollment['enrollSearchList'] = ['init'];
        this.advancedSearchNotify.emit(enrollment);

        this.administrationService.enrollmentSearchReportService(postData).subscribe((data: any) => {
            this.showResult = true;
            this.enrollSearchList = data.appReportLineItem;
            let enrollment: any = {};
            enrollment['enrollSearchList'] = this.enrollSearchList ? this.enrollSearchList : [];
            enrollment['searchedCriteria'] = postData;
            this.advancedSearchNotify.emit(enrollment);
        }, (error: any) => { console.log('error : ' + error); this.noResultsMessage = 'error'; });
    }

    /**
     *service post data creation
     */
    public serviceData() {
        let postData = {
            'appSearchCriteriaBean': {
                'fromDateStr': (this.fromDate) ? moment(this.fromDate).format('MM/DD/YYYY') : '',
                'toDateStr': (this.toDate) ? moment(this.toDate).format('MM/DD/YYYY') : '',
                'fromReqEffDateStr': (this.fromReqEffDate) ? moment(this.fromReqEffDate).format('MM/DD/YYYY') : '',
                'toReqEffDateStr': (this.toReqEffDate) ? moment(this.toReqEffDate).format('MM/DD/YYYY') : '',
                'status': (this.selectedAppStatus && this.selectedAppStatus.length === 11) ? [] : this.selectedAppStatus,
                'backEnd': this.selectedBackEnd,
                'appFields': this.selectedAppField,
                'muStatus': this.selectedBackEndStatus,
                'appSource': this.selectedAppSource,
                'appType': this.selectedAppType,
                'state': this.selectedState,
                'brand': this.selectedBrand,
                'searchBy': 'ADVANCED'
            }
        };

        return postData;
    }

    /**
     *Reset function
     */
    public resetResult() {
        this.enrollSearchList = [];
        this.reportDateValidationError = '';
        this.countMessage = '';
        this.showResult = false;
        this.noSearchResult = '';
        this.paginateMessage = '';
        this.selectedAppStatus = [];
        this.selectedBackEnd = '';
        this.selectedAppField = '';
        this.selectedBackEndStatus = '';
        this.selectedAppSource = '';
        this.selectedAppType = '';
        this.selectedState = '';
        this.selectedBrand = '';
        this.initForm();
        let enrollment: any = {};
        enrollment['enrollSearchList'] = ['init'];
        this.advancedSearchNotify.emit(enrollment);
    }
    public isIE() {
        let ua = window.navigator.userAgent;
        if(ua.indexOf('MSIE ') >0 || ua.indexOf('Trident/') >0 || ua.indexOf('Edge/') >0 ) {
        return true;
        }else { return false; }
     }
}
