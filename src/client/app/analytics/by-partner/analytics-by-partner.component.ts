import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar, SelectItem, TabViewModule } from 'primeng/primeng';
import { AnalyticsValidatorComponent } from '../analytics-validator';
import { AnalyticsCalendarValidatorComponent } from '../analytics-calendar-validator';
import { AnalyticsValidationService } from '../analytics-validation.service';
import { DownloadCSVService } from '../../shared/services/downloadcsv/downloadcsv.service';
import { HelpByPartnerModalComponent } from '../../shared/modal-template/helpbypartner.modal';
import { AnalyticsService } from '../analytics.service';
import { AnalyticsConfig } from '../api/analyticsConfig';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'sd-analytics-by-partner',
    templateUrl: 'analytics-by-partner.component.html',
    styleUrls: ['analytics-by-partner.component.css'],
})
export class ByPartnerComponent implements OnInit {
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public reportByPartnerSearchList: any = [];
    public showForm: boolean = false;
    public showResult: boolean = false;
    public byPartnerForm: any;
    public brandList: SelectItem[];
    public stateList: SelectItem[];
    public selectedState: any[] = [];
    public selectedBrand: any[] = [];
    public downloadData: any = [];
    public noSearchResult: string = '';
    public paginateMessage: string = '';
    public fromDate: Date;
    public toDate: Date;
    public maxFromDate: Date;
    public maxToDate: Date;
    public timer: any;

    @ViewChild('helpByPartnerModal') helpByPartnerModal: HelpByPartnerModalComponent;

    /**
     * Constructor function
     * @param formBuilder
     * @param
     * @param
     */
    constructor(private formBuilder: FormBuilder,
        public analyticsService: AnalyticsService,
        public analyticsConfig: AnalyticsConfig,
        public downloadCSV: DownloadCSVService) {

    }

    /**
     * By Partner Form initialization
     */
    ngOnInit() { // tslint:disable-line
        this.buildByPartnerForm();
    }

    /**
     * Building By Partner Form
     */
    buildByPartnerForm() {
        this.byPartnerForm = this.formBuilder.group({
            fromDate: ['', []],
            toDate: ['', []],
            brands: [[], ''],
            states: [[], ''],
        }, {
                validator: AnalyticsValidationService.byPartnerDateValidator
            });
        this.initForm();
    }

    /**
     * Reseting By Partner Form initialization
     */
    public resetByPartnerForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildByPartnerForm();
        }, 500);
    }

    /**
     * Form Validation
     */
    applyMarkAsTouched(selectedForm: any) {
        selectedForm.get('fromDate').markAsTouched();
        selectedForm.get('fromDate').updateValueAndValidity();
        selectedForm.get('toDate').markAsTouched();
        selectedForm.get('toDate').updateValueAndValidity();
        selectedForm.get('brands').markAsTouched();
        selectedForm.get('brands').updateValueAndValidity();
        selectedForm.get('states').markAsTouched();
        selectedForm.get('states').updateValueAndValidity();
    }

    /**
     * Initialization
     */
    initForm() {
        this.initDateFields();
        this.brandList = this.analyticsConfig.initBrandList();
        this.stateList = this.analyticsConfig.initStateList();
    }

    /**
     * Initialize Date
     */
    initDateFields() {
        console.log('here');
        this.toDate = new Date();
        this.maxToDate = new Date();
        this.maxFromDate = new Date();
    }

    /**
     * Search function
     */
    public searchReport() {
        this.noSearchResult = '';
        this.countMessage = '';
        this.reportByPartnerSearchList = '';
        this.applyMarkAsTouched(this.byPartnerForm);

        if (this.byPartnerForm.dirty && this.byPartnerForm.valid) {
            let postData = this.serviceData();
            this.analyticsService.byPartnerSearchReportService(postData).subscribe((data: any) => {
                this.showResult = true;
                this.showForm = !this.showForm;
                // console.log(data);
                this.reportByPartnerSearchList = data.analyticsPartnerLineItems;
                if (!this.reportByPartnerSearchList || !this.reportByPartnerSearchList.length) {
                    this.noSearchResult = 'No Records found. Please refine your search criteria';
                } else if (this.reportByPartnerSearchList.length > 1) {
                    this.countMessage = ': ' + this.reportByPartnerSearchList.length + ' Results Found';
                } else {
                    this.countMessage = ': ' + this.reportByPartnerSearchList.length + ' Result Found';
                }
            },
                (error: any) => { console.log('error : ' + error); this.noSearchResult = 'error'; });
        }
        return false;
    }

    /**
     *service data creation
     */
    public serviceData() {
        let postData = {
            'partnerFromDateStr': (this.fromDate) ? moment(this.fromDate).format('MM/DD/YYYY') : '',
            'partnerToDateStr': (this.toDate) ? moment(this.toDate).format('MM/DD/YYYY') : '',
            'partnerBrandList': (this.selectedBrand && this.selectedBrand.length === 9) ? ['all'] : this.selectedBrand,
            'partnerStateList': (this.selectedState && this.selectedState.length === 47) ? ['all'] : this.selectedState,
        };

        return postData;
    }

    /**
     * Current data displayed on table stored to new object array
     * @param data
     */
    public saveDownloadData() {
        console.log(JSON.stringify(this.reportByPartnerSearchList));
        this.downloadData = [];
        this.reportByPartnerSearchList.map((item: any) => {
            return {
                DATE: item.dateStr,
                PARTNER: item.partner,
                MA_ENROLLING: item.maEnrolling,
                MA_POTENTIALS: item.maPotentials,
                MA_SALES: item.maSales,
                MA_RETURNS: item.maReturns,
                MA_TOTAL: item.maTotal,
                MS_ENROLLING: item.msEnrolling,
                MS_POTENTIALS: item.msPotentials,
                MS_SALES: item.msSales,
                MS_RETURNS: item.msReturns,
                MS_TOTAL: item.msTotal,
                PDP_ENROLLING: item.pdpEnrolling,
                PDP_POTENTIALS: item.pdpPotentials,
                PDP_SALES: item.pdpSales,
                PDP_RETURNS: item.pdpReturns,
                PDP_TOTAL: item.pdpTotal

            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
        this.downloadCSV.downloadCurrentData(this.downloadData, 'By Partner');
    }

    /**
     * Reset function
     */
    public resetResult() {
        this.reportByPartnerSearchList = [];
        this.countMessage = '';
        this.showResult = false;
        this.noSearchResult = '';
        this.paginateMessage = '';
        this.selectedState = [];
        this.selectedBrand = [];
        this.initForm();
    }
}
