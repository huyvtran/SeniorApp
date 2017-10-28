import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar, SelectItem, TabViewModule } from 'primeng/primeng';
import { AnalyticsValidatorComponent } from '../analytics-validator';
import { AnalyticsCalendarValidatorComponent } from '../analytics-calendar-validator';
import { AnalyticsValidationService } from '../analytics-validation.service';
import { DownloadCSVService } from '../../shared/services/downloadcsv/downloadcsv.service';
import { AnalyticsService } from '../analytics.service';
import { AnalyticsConfig } from '../api/analyticsConfig';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'sd-analytics-latency',
    templateUrl: 'analytics-latency.component.html',
    styleUrls: ['analytics-latency.component.css'],
})
export class LatencyComponent implements OnInit {
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public reportLatencySearchList: any = [];
    public showForm: boolean = false;
    public showResult: boolean = false;
    public openMore: string = 'block';
    public closeMore: string = 'none';
    public latencyForm: any;
    public brandList: SelectItem[];
    public stateList: SelectItem[];
    public productTypesList: SelectItem[];
    public createPartnerList: SelectItem[];
    public submitPartnerList: SelectItem[];
    public appSourceList: SelectItem[];
    public downloadData: any = [];
    public noSearchResult: string = '';
    public paginateMessage: string = '';
    public fromDate: Date;
    public toDate: Date;
    public maxFromDate: Date;
    public maxToDate: Date;
    public fromSubmitDate: Date;
    public toSubmitDate: Date;
    public maxFromSubmitDate: Date;
    public maxToSubmitDate: Date;
    public timer: any;
    public selectedState: any[] = [];
    public selectedBrand: any[] = [];
    public selectedProductTypes: any[] = [];
    public selectedCreatePartners: any[] = [];
    public selectedSubmitPartners: any[] = [];
    public selectedAppSource: string = '';

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
     * Initialize form and load dropdown data's
     */
    ngOnInit() { // tslint:disable-line
        this.buildLatencyForm();
    }

    /**
     * Building latency form with fields
     */
    buildLatencyForm() {
        this.latencyForm = this.formBuilder.group({
            fromDate: ['', []],
            toDate: ['', []],
            fromSubmitDate: ['', []],
            toSubmitDate: ['', []],
            brands: [[], ''],
            states: [[], ''],
            productTypes: [null, ''],
            createPartner: [null, ''],
            submitPartner: [null, ''],
            appSource: ['', ''],
        }, {
                validator: AnalyticsValidationService.latencyDateValidator
            });
        this.initForm();
    }

    /**
     * Resting Latency Form
     */
    public resetLatencyForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildLatencyForm();
        }, 500);
    }

    /**
     * Required field validation
     */
    applyMarkAsTouched(selectedForm: any) {
        selectedForm.get('fromDate').markAsTouched();
        selectedForm.get('fromDate').updateValueAndValidity();
        selectedForm.get('toDate').markAsTouched();
        selectedForm.get('toDate').updateValueAndValidity();
        selectedForm.get('fromSubmitDate').markAsTouched();
        selectedForm.get('fromSubmitDate').updateValueAndValidity();
        selectedForm.get('toSubmitDate').markAsTouched();
        selectedForm.get('toSubmitDate').updateValueAndValidity();
    }

    /**
     * Initialization
     */
    initForm() {
        this.initDateFields();
        this.brandList = this.analyticsConfig.initBrandList();
        this.stateList = this.analyticsConfig.initStateList();
        this.productTypesList = this.analyticsConfig.initProductTypesList();
        this.createPartnerList = this.analyticsConfig.initCreatePartnerList();
        this.submitPartnerList = this.analyticsConfig.initSubmitPartnerList();
        this.appSourceList = this.analyticsConfig.initAppSourceList();
    }

    /**
     * Initialize Date
     */
    initDateFields() {
        this.toDate = new Date();
        this.maxToDate = new Date();
        this.maxFromDate = new Date();
        this.maxToSubmitDate = new Date();
        this.maxFromSubmitDate = new Date();
    }

    /**
     * Search function
     */
    public searchReport() {
        this.noSearchResult = '';
        this.countMessage = '';
        this.reportLatencySearchList = '';
        this.applyMarkAsTouched(this.latencyForm);

        if (this.latencyForm.dirty && this.latencyForm.valid) {
            let postData = this.serviceData();
            // console.log(postData);
            this.analyticsService.latencySearchReportService(postData).subscribe((data: any) => {
                this.showResult = true;
                this.showForm = !this.showForm;
                // console.log(data);
                this.reportLatencySearchList = data.latencyLineItems;
                if (!this.reportLatencySearchList || !this.reportLatencySearchList.length) {
                    this.noSearchResult = 'No Records found. Please refine your search criteria';
                } else if (this.reportLatencySearchList.length > 1) {
                    this.countMessage = ': ' + this.reportLatencySearchList.length + ' Results Found';
                } else {
                    this.countMessage = ': ' + this.reportLatencySearchList.length + ' Result Found';
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
            'latencyCreateDateFromStr': (this.fromDate) ? moment(this.fromDate).format('MM/DD/YYYY') : '',
            'latencyCreateDateToStr': (this.toDate) ? moment(this.toDate).format('MM/DD/YYYY') : '',
            'latencySubmitDateFromStr': (this.fromSubmitDate) ? moment(this.fromSubmitDate).format('MM/DD/YYYY') : '',
            'latencySubmitDateToStr': (this.toSubmitDate) ? moment(this.toSubmitDate).format('MM/DD/YYYY') : '',
            'latencyBrandSelected': (this.selectedBrand && this.selectedBrand.length === 9) ? ['all'] : this.selectedBrand,
            'latencyStateSelected': (this.selectedState && this.selectedState.length === 47) ? ['all'] : this.selectedState,
            'latencyProductTypeSelected': (this.selectedProductTypes && this.selectedProductTypes.length === 4) ?
                ['all'] : this.selectedProductTypes,
            'latencyCreatePartnerSelected': (this.selectedCreatePartners && this.selectedCreatePartners.length === 6) ?
                ['all'] : this.selectedCreatePartners,
            'latencySubmitPartnerSelected': (this.selectedSubmitPartners && this.selectedSubmitPartners.length === 5) ?
                ['all'] : this.selectedSubmitPartners,
            'latencyAppSource': (this.selectedAppSource) ? this.selectedAppSource : '',
        };

        return postData;
    }

    /**
     * Current data displayed on table stored to new object array
     * @param data
     */
    public saveDownloadData() {
        // console.log(JSON.stringify(this.reportLatencySearchList));
        this.downloadData = [];
        this.reportLatencySearchList.map((item: any) => {
            return {
                STATE: item.state,
                COUNTY: item.county,
                PRODUCT_TYPE: item.productType,
                DURATION: item.duration,
                COUNT_OF_APPS: item.countOfApps,
            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
        this.downloadCSV.downloadCurrentData(this.downloadData, 'Latency');
    }

    /**
     * Reset function
     */
    public resetResult() {
        this.reportLatencySearchList = [];
        this.countMessage = '';
        this.showResult = false;
        this.noSearchResult = '';
        this.paginateMessage = '';
        this.selectedState = [];
        this.selectedBrand = [];
        this.selectedProductTypes = [];
        this.selectedCreatePartners = [];
        this.selectedSubmitPartners = [];
        this.selectedAppSource = '';
        this.initForm();
    }
}
