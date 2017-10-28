import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar, SelectItem, TabViewModule } from 'primeng/primeng';
import { AnalyticsValidationService } from '../analytics-validation.service';
import { DownloadCSVService } from '../../shared/services/downloadcsv/downloadcsv.service';
import { AnalyticsService } from '../analytics.service';
import { AnalyticsConfig } from '../api/analyticsConfig';
import { HelpConvertedModalComponent } from '../../shared/modal-template/helpconverted.modal';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'sd-analytics-converted',
    templateUrl: 'analytics-converted.component.html',
    styleUrls: ['analytics-converted.component.css'],
})
export class ConvertedComponent implements OnInit {
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public reportConvertedSearchList: any = [];
    public showForm: boolean = false;
    public showResult: boolean = false;
    public convertedForm: any;
    public downloadData: any = [];
    public brandList: SelectItem[];
    public stateList: SelectItem[];
    public productList: SelectItem[];
    public appList: SelectItem[];
    public selectedState: any[] = [];
    public selectedBrand: any[] = [];
    public selectedProduct: any[] = [];
    public selectedApp: string = '';
    public noSearchResult: string = '';
    public paginateMessage: string = '';
    public fromDate: Date;
    public toDate: Date;
    public maxFromDate: Date;
    public maxToDate: Date;
    public timer: any;

    @ViewChild('helpConvertedModal') helpConvertedModal: HelpConvertedModalComponent;

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
     * Co nverted Form initialization
     */
    ngOnInit() { // tslint:disable-line
        this.buildConvertedForm();
    }

    /**
     * Build Converted Form
     */
    buildConvertedForm() {
        this.convertedForm = this.formBuilder.group({
            fromDate: ['', []],
            toDate: ['', []],
            brands: [[], ''],
            states: [[], ''],
            products: [[], ''],
            apps: [[], '']
        }, {
                validator: AnalyticsValidationService.convertedDateValidator
            });
        this.initForm();
    }

    /**
     * Reset Converted Form
     */
    public resetConvertedForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildConvertedForm();
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
        selectedForm.get('products').markAsTouched();
        selectedForm.get('products').updateValueAndValidity();
        selectedForm.get('apps').markAsTouched();
        selectedForm.get('apps').updateValueAndValidity();
    }

    /**
     * Initialization
     */
    initForm() {
        this.initDateFields();
        this.brandList = this.analyticsConfig.initBrandList();
        this.stateList = this.analyticsConfig.initStateList();
        this.productList = this.analyticsConfig.initProductList();
        this.appList = this.analyticsConfig.initAppSourceList();
    }

    /**
     * Initialize Date
     */
    initDateFields() {
        let today = new Date();
        this.toDate = new Date();
        this.fromDate = new Date();
        this.maxToDate = new Date();
        this.maxFromDate = new Date();
        this.fromDate.setDate(today.getDate() - 90);
        this.convertedForm.get('fromDate').updateValueAndValidity();
        this.convertedForm.get('fromDate').markAsDirty();
    }

    /**
     * Search function
     */
    public searchReport() {
        this.noSearchResult = '';
        this.countMessage = '';
        this.reportConvertedSearchList = '';
        this.applyMarkAsTouched(this.convertedForm);

        if (this.convertedForm.dirty && this.convertedForm.valid) {
            let postData = this.serviceData();
            this.analyticsService.convertedSearchReportService(postData).subscribe((data: any) => {
                this.showResult = true;
                this.showForm = !this.showForm;
                // console.log(data);
                this.reportConvertedSearchList = data.quoteConversionLineItems;
                if (!this.reportConvertedSearchList || !this.reportConvertedSearchList.length) {
                    this.noSearchResult = 'No Records found. Please refine your search criteria';
                } else if (this.reportConvertedSearchList.length > 1) {
                    this.countMessage = ': ' + this.reportConvertedSearchList.length + ' Results Found';
                } else {
                    this.countMessage = ': ' + this.reportConvertedSearchList.length + ' Result Found';
                }
            },
                (error: any) => { console.log('error : ' + error); this.noSearchResult = 'error'; });
        }
        return false;
    }

    /**
     * service data creation
     */
    public serviceData() {
        let postData = {
            'quoteConversionFromDateStr': (this.fromDate) ? moment(this.fromDate).format('MM/DD/YYYY') : '',
            'quoteConversionToDateStr': (this.toDate) ? moment(this.toDate).format('MM/DD/YYYY') : '',
            'quoteConversionBrandsSelected': (this.selectedBrand && this.selectedBrand.length === 9) ? ['all'] : this.selectedBrand,
            'quoteConversionStatesSelected': (this.selectedState && this.selectedState.length === 47) ? ['all'] : this.selectedState,
            'quoteConversionProductTypesSelected': (this.selectedProduct && this.selectedProduct.length === 4) ?
                ['all'] : this.selectedProduct,
            'appSource':   (this.selectedApp) ? this.selectedApp : '',
        };

        return postData;
    }

      /**
     * Current data displayed on table stored to new object array
     * @param data
     */
    public saveDownloadData() {
        console.log(JSON.stringify(this.reportConvertedSearchList));
        this.downloadData = [];
        this.reportConvertedSearchList.map((item: any) => {
            return {
                DATE: item.quoteDate,
                BRAND: item.brand,
                STATE: item.state,
                PRODUCT_TYPE: item.productType,
                CAMPAIGN_ID: item.campaignId,
                CONVERTED: item.convertedCount,
                DENITALS: item.cmsDenialCount,
                ABANDONED: item.abandonedCount,
                APP_ABANDONED: item.appAbandonedCount,
                TOTAL: item.totalQuoteCount
            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
        this.downloadCSV.downloadCurrentData(this.downloadData, 'Converted');
    }

    /**
     * Reset function
     */
    public resetResult() {
        this.reportConvertedSearchList = [];
        this.countMessage = '';
        this.showResult = false;
        this.noSearchResult = '';
        this.paginateMessage = '';
        this.selectedState = [];
        this.selectedBrand = [];
        this.initForm();
    }
}
