import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnalyticsValidationService } from '../analytics-validation.service';
import { AnalyticsService } from '../analytics.service';
import { AnalyticsConfig } from '../api/analyticsConfig';
import { DownloadCSVService } from '../../shared/services/downloadcsv/downloadcsv.service';
import { Calendar, SelectItem, TabViewModule } from 'primeng/primeng';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'sd-analytics-quotes',
    templateUrl: 'analytics-quotes.component.html',
    styleUrls: ['analytics-quotes.component.css'],
})
export class QuotesComponent implements OnInit {
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public quotesSearchList: any = [];
    public brandList: SelectItem[];
    public stateList: SelectItem[];
    public productTypeList: SelectItem[];
    public appSourceList: SelectItem[];
    public countyList: SelectItem[];
    public genderList: SelectItem[];
    public selectedState: any[] = [];
    public selectedBrand: any[] = [];
    public selectedProductType: any[] = [];
    public selectedCounty: any[] = [];
    public downloadData: any = [];
    public selectedAppSource: string = '';
    public countySearchList: any = [];
    public selectedGender: string = '';
    public showForm: boolean = false;
    public showResult: boolean = false;
    public noSearchResult: string = '';
    public paginateMessage: string = '';
    public openMore: string = 'block';
    public closeMore: string = 'none';
    public quotesForm: any;
    public fromDate: Date;
    public toDate: Date;
    public fromDOB: Date;
    public toDOB: Date;
    public maxFromDate: Date;
    public maxToDate: Date;
    public timer: any;
    public flag:number = 0;

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
     * Quotes Form initialization
     */
    ngOnInit() { // tslint:disable-line
        this.buildQuotesForm();
    }

    /**
     * Building Quotes Form
     */
    buildQuotesForm() {
        this.quotesForm = this.formBuilder.group({
            fromDate: ['', []],
            toDate: ['', []],
            brands: [[], ''],
            fromDOB: ['', []],
            toDOB: ['', []],
            states: [[], ''],
            counties: [[], ''],
            productTypes: [[], ''],
            appSource: ['', ''],
            gender: ['', ''],
        }, {
                validator: AnalyticsValidationService.quotesDateValidator
            });
        this.initForm();
    }

    /**
     * Resting Quotes Form
     */
    public resetQuotesForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildQuotesForm();
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
        selectedForm.get('fromDOB').markAsTouched();
        selectedForm.get('fromDOB').updateValueAndValidity();
        selectedForm.get('toDOB').markAsTouched();
        selectedForm.get('toDOB').updateValueAndValidity();
        selectedForm.get('states').markAsTouched();
        selectedForm.get('states').updateValueAndValidity();
        selectedForm.get('counties').markAsTouched();
        selectedForm.get('counties').updateValueAndValidity();
        selectedForm.get('productTypes').markAsTouched();
        selectedForm.get('productTypes').updateValueAndValidity();
        selectedForm.get('appSource').markAsTouched();
        selectedForm.get('appSource').updateValueAndValidity();
        selectedForm.get('gender').markAsTouched();
        selectedForm.get('gender').updateValueAndValidity();
    }

    /**
    * Initialization
    */
    initForm() {
        this.setFromToDate();
        this.brandList = this.analyticsConfig.initBrandList();
        this.stateList = this.analyticsConfig.initStateList();
        this.productTypeList = this.analyticsConfig.initProductTypesList();
        this.appSourceList = this.analyticsConfig.initAppSourceList();
        this.genderList = this.analyticsConfig.initGenderList();
        this.countyList = [];
        this.countySearchService();
    }

    /**
     * County List
     */
    public initCounty() {
        this.countyList =[];
        for(let i=0;i<this.countySearchList.length;i++) {
                this.countyList.push({label: this.countySearchList[i], value:this.countySearchList[i] });
        }
    }

    /**
     * County List
     */
    setFromToDate() {
        let today = new Date();
        this.toDate = new Date();
        this.maxToDate = new Date();
        this.maxFromDate = new Date();
        this.fromDate = new Date();
        this.fromDate.setDate(today.getDate() - 90);
        this.quotesForm.get('fromDate').updateValueAndValidity();
        this.quotesForm.get('fromDate').markAsDirty();
        this.quotesForm.get('toDate').updateValueAndValidity();
        this.quotesForm.get('toDate').markAsDirty();
    }

    /**
     *
     */
    moreButtonEvent() {
        this.openMore = 'none';
        this.closeMore = 'block';
    }

    /**
     * Search function
     */
    public searchReport() {
        this.noSearchResult = '';
        this.countMessage = '';
        this.quotesSearchList = '';
        this.applyMarkAsTouched(this.quotesForm);

        if (this.quotesForm.dirty && this.quotesForm.valid) {
            let postData = this.serviceData();
            this.analyticsService.quotesService(postData).subscribe((data: any) => {
                this.showResult = true;
                this.showForm = !this.showForm;
                // console.log(data);
                this.quotesSearchList = data.quoteSummaryLineItems;
                if (!this.quotesSearchList || !this.quotesSearchList.length) {
                    this.noSearchResult = 'No Records found. Please refine your search criteria';
                } else if (this.quotesSearchList.length > 1) {
                    this.countMessage = ': ' + this.quotesSearchList.length + ' Results Found';
                } else {
                    this.countMessage = ': ' + this.quotesSearchList.length + ' Result Found';
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
            'quoteSummaryFromDateStr': (this.fromDate) ? moment(this.fromDate).format('MM/DD/YYYY') : '',
            'quoteSummaryToDateStr': (this.toDate) ? moment(this.toDate).format('MM/DD/YYYY') : '',
            'brandsSelected': (this.selectedBrand && this.selectedBrand.length === 9) ? ['all'] : this.selectedBrand,
            'quoteDobFromStr': (this.fromDOB) ? moment(this.fromDOB).format('MM/DD/YYYY') : '',
            'quoteDobToStr': (this.toDOB) ? moment(this.toDOB).format('MM/DD/YYYY') : '',
            'statesSelected': (this.selectedState && this.selectedState.length === 48) ? ['all'] : this.selectedState,
            'countySelected': (this.selectedCounty && this.selectedCounty.length === 1933) ? ['all'] : this.selectedCounty,
            'planTypesSelected': (this.selectedProductType && this.selectedProductType.length === 4)
                ? ['all'] : this.selectedProductType,
            'quoteAppSource': (this.selectedAppSource) ? this.selectedAppSource : '',
            'quoteGender': this.selectedGender,
        };

        return postData;
    }

    /**
    * Search function
    */
    public countySearchService() {
        this.countySearchList = '';
        let postData = this.countySearchServiceData();
        this.analyticsService.countyService(postData).subscribe((data: any) => {
            this.countySearchList = data.countyList;
            this.initCounty();
        },
            (error: any) => { console.log('error : ' + error); this.noSearchResult = 'error'; });
    }

    /**
     *county service data creation
     */
    public countySearchServiceData() {
        let postData = {
            'statesSelected': (this.selectedState && this.selectedState.length === 48) ||
                (this.selectedState.length === 0) ? ['all'] : this.selectedState,
        };

        return postData;
    }


    /**
    * Current data displayed on table stored to new object array
    * @param data
      */
    public saveDownloadData() {
        console.log(JSON.stringify(this.quotesSearchList));
        this.downloadData = [];
        this.quotesSearchList.map((item: any) => {
            return {
                DATE: item.quoteDate,
                STATE: item.state,
                BRAND: item.brand,
                COUNTY: item.county,
                PRODUCT_TYPE: item.planType,
                CAMPAIGN_ID: item.campaignId,
                COUNT: item.count
            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
        this.downloadCSV.downloadCurrentData(this.downloadData, 'Quotes');
    }

    /**
     * Reset function
     */
    public resetResult() {
        this.quotesSearchList = [];
        this.countMessage = '';
        this.showResult = false;
        this.noSearchResult = '';
        this.paginateMessage = '';
        this.selectedState = [];
        this.selectedBrand = [];
        this.selectedProductType = [];
        this.selectedAppSource = '';
        this.selectedCounty = [];
        this.selectedGender = '';
        this.initForm();
    }
}
