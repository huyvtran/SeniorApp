import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar, SelectItem, TabViewModule } from 'primeng/primeng';
import { AnalyticsValidationService } from '../analytics-validation.service';
import { DownloadCSVService } from '../../shared/services/downloadcsv/downloadcsv.service';
import { AnalyticsService } from '../analytics.service';
import { AnalyticsConfig } from '../api/analyticsConfig';
import { HelpByProductTypeModalComponent } from '../../shared/modal-template/helpbyproducttype.modal';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'sd-analytics-by-product-type',
    templateUrl: 'analytics-by-product-type.component.html',
    styleUrls: ['analytics-by-product-type.component.css'],
})
export class ByProductTypeComponent implements OnInit {
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public reportByProductTypeSearchList: any = [];
    public selectedState: any[] = [];
    public selectedBrand: any[] = [];
    public selectedProductType: any[] = [];
    public downloadData: any = [];
    public brandList: SelectItem[];
    public stateList: SelectItem[];
    public productTypeList: SelectItem[];
    public productTypeSelection: any = ['MA', 'MAPD', 'MED SUPP', 'PDP'];
    public showForm: boolean = false;
    public showResult: boolean = false;
    public noSearchResult: string = '';
    public byProductForm: any;
    public paginateMessage: string = '';
    public fromDate: Date;
    public toDate: Date;
    public maxFromDate: Date;
    public maxToDate: Date;
    public timer: any;

    @Output() searchNotify: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('helpByProductTypeModal') helpByProductTypeModal: HelpByProductTypeModalComponent;

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
        this.buildByProductForm();
    }

    /**
     * Building by product form with fields
     */
    buildByProductForm() {
        this.byProductForm = this.formBuilder.group({
            fromDate: ['', []],
            toDate: ['', []],
            brands: [[], ''],
            states: [[], ''],
            productTypes: [[], ''],
        }, {
                validator: AnalyticsValidationService.byProductTypeDateValidator
            });
        this.initForm();
    }

    /**
     * Resting By Product Form
     */
    public resetByProductForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildByProductForm();
        }, 500);
    }

    /**
     * Required field validation starts
     */
    applyMarkAsTouched(selectedForm: any) {
        if (this.fromDate) {
            selectedForm.get('fromDate').markAsDirty();
        } else {
            selectedForm.get('fromDate').markAsTouched();
        }
        selectedForm.get('fromDate').updateValueAndValidity();
        selectedForm.get('toDate').markAsTouched();
        selectedForm.get('toDate').updateValueAndValidity();
        selectedForm.get('brands').markAsTouched();
        selectedForm.get('brands').updateValueAndValidity();
        selectedForm.get('states').markAsTouched();
        selectedForm.get('states').updateValueAndValidity();
        selectedForm.get('productTypes').markAsTouched();
        selectedForm.get('productTypes').updateValueAndValidity();
    }

    /**
    * Initialization
    */
    initForm() {
        this.initDateFields();
        this.brandList = this.analyticsConfig.initBrandList();
        this.stateList = this.analyticsConfig.initStateList();
        this.productTypeList = this.initProductTypeList();
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
        { value: 'GA', label: 'GA' }, { value: 'HI', label: 'HI' },
        { value: 'IA', label: 'IA' }, { value: 'ID', label: 'ID' },
        { value: 'IL', label: 'IL' }, { value: 'IN', label: 'IN' },
        { value: 'KS', label: 'KS' }, { value: 'KY', label: 'KY' },
        { value: 'LA', label: 'LA' }, { value: 'MA', label: 'MA' },
        { value: 'MD', label: 'MD' }, { value: 'MI', label: 'MI' },
        { value: 'ME', label: 'ME' }, { value: 'MO', label: 'MO' },
        { value: 'MS', label: 'MS' }, { value: 'NA', label: 'NA' },
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
     * Product Type List
     */
    public initProductTypeList() {
        return [{ value: 'MA', label: 'MA' },
        { value: 'MAPD', label: 'MAPD' },
        { value: 'MED SUPP', label: 'MED SUPP' },
        { value: 'PDP', label: 'PDP' }];
    }

    /**
     * Initialize Date
     */
    initDateFields() {
        let today = new Date();
        this.toDate = new Date();
        this.fromDate = new Date();
        this.fromDate.setDate(today.getDate() - 90);
        this.maxToDate = new Date();
        this.maxFromDate = new Date();
        this.byProductForm.get('fromDate').updateValueAndValidity();
        this.byProductForm.get('fromDate').markAsDirty();
    }

    /**
     * Search function
     */
    public searchReport() {
        this.noSearchResult = '';
        this.countMessage = '';
        this.reportByProductTypeSearchList = '';
        console.log(this.selectedProductType);
        this.applyMarkAsTouched(this.byProductForm);

        if (this.byProductForm.dirty && this.byProductForm.valid) {
            let postData = this.serviceData();
            this.analyticsService.byProductTypeSearchReportService(postData).subscribe((data: any) => {
                this.showResult = true;
                this.showForm = !this.showForm;
                // console.log(data);
                this.reportByProductTypeSearchList = data.planTypeLineItems;
                if (!this.reportByProductTypeSearchList || !this.reportByProductTypeSearchList.length) {
                    this.noSearchResult = 'No Records found. Please refine your search criteria';
                } else if (this.reportByProductTypeSearchList.length > 1) {
                    this.countMessage = ': ' + this.reportByProductTypeSearchList.length + ' Results Found';
                } else {
                    this.countMessage = ': ' + this.reportByProductTypeSearchList.length + ' Result Found';
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
            'planTypeFromDate': (this.fromDate) ? moment(this.fromDate).format('MM/DD/YYYY') : '',
            'planTypeToDate': (this.toDate) ? moment(this.toDate).format('MM/DD/YYYY') : '',
            'planTypeBrandsSelected': (this.selectedBrand && this.selectedBrand.length === 9) ? ['all'] : this.selectedBrand,
            'planTypeStatesSelected': (this.selectedState && this.selectedState.length === 48) ? ['all'] : this.selectedState,
            'planTypePlansSelected': (this.selectedProductType && this.selectedProductType.length === 4)
                ? ['all'] : this.selectedProductType,
        };

        return postData;
    }

    /**
     * Current data displayed on table stored to new object array
     * @param data
     */
    public saveDownloadData() {
        console.log(JSON.stringify(this.reportByProductTypeSearchList));
        this.downloadData = [];
        this.reportByProductTypeSearchList.map((item: any) => {
            let testData:any = {'DATE': item.planTypeDate};
            if(this.productTypeSelection) {
                for(let i=0;i<=this.productTypeSelection.length;i++) {
                    if(this.productTypeSelection[i] === 'MA') {
                        testData['MA'] = item.maCount;
                    }
                    if(this.productTypeSelection[i] === 'MAPD') {
                        testData['MAPD'] = item.mapdCount;
                    }
                    if(this.productTypeSelection[i] === 'MED SUPP') {
                        testData['MED SUPP'] = item.medsuppCount;
                    }
                    if(this.productTypeSelection[i] === 'PDP') {
                        testData['PDP'] = item.pdpCount;
                    }
                }
            }
            return testData;
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
        this.downloadCSV.downloadCurrentData(this.downloadData, 'By Product Type');
    }

    /**
     * Set Product Types to a variable
     */
    public setProductTypes(event: any) {
        console.log(event.value);
        this.productTypeSelection = [];
        this.productTypeSelection = event.value;
    }

    /**
     *Reset function
     */
    public resetResult() {
        this.reportByProductTypeSearchList = [];
        this.countMessage = '';
        this.showResult = false;
        this.noSearchResult = '';
        this.paginateMessage = '';
        this.selectedState = [];
        this.selectedBrand = [];
        this.selectedProductType = [];
        this.initForm();
    }
}
