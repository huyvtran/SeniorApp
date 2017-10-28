import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar, SelectItem } from 'primeng/primeng';
import { AnalyticsValidatorComponent } from '../analytics-validator';
import { AnalyticsCalendarValidatorComponent } from '../analytics-calendar-validator';
import { AnalyticsValidationService } from '../analytics-validation.service';
import { AnalyticsService } from '../analytics.service';
import { AnalyticsConfig } from '../api/analyticsConfig';
import { DownloadCSVService } from '../../shared/services/downloadcsv/downloadcsv.service';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'sd-analytics-leads',
    templateUrl: 'analytics-leads.component.html',
    styleUrls: ['analytics-leads.component.css'],
})
export class LeadsComponent implements OnInit {
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public reportLeadsSearchList: any = [];
    public showForm: boolean = false;
    public showResult: boolean = false;
    public leadsForm: any;
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
     * Lead Form initialization
     */
    ngOnInit() { // tslint:disable-line
        this.buildLeadsForm();
    }

    /**
     * Building Leading Form
     */
    buildLeadsForm() {
        this.leadsForm = this.formBuilder.group({
            fromDate: [null, []],
            toDate: [null, []],
            brands: [[], ''],
            states: [[], ''],
        }, {
                validator: AnalyticsValidationService.leadsDateValidator
            });
        this.initForm();
    }

    /**
     * Reseting the Leads Form
     */
    public resetLeadsForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildLeadsForm();
        }, 500);
    }

    /**
     * Form validation
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
        this.setFromToDate();
        this.brandList = this.analyticsConfig.initBrandList();
        this.stateList = this.analyticsConfig.initStateList();
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
        this.leadsForm.get('fromDate').updateValueAndValidity();
        this.leadsForm.get('fromDate').markAsDirty();
        this.leadsForm.get('toDate').updateValueAndValidity();
        this.leadsForm.get('toDate').markAsDirty();
    }

    /**
     * Search function
     */
    public searchReport() {
        this.noSearchResult = '';
        this.countMessage = '';
        this.reportLeadsSearchList = '';
        this.applyMarkAsTouched(this.leadsForm);

        if (this.leadsForm.dirty && this.leadsForm.valid) {
            let postData = this.serviceData();
            this.analyticsService.leadsSearchReportService(postData).subscribe((data: any) => {
                this.showResult = true;
                this.showForm = !this.showForm;
                // console.log(data);
                this.reportLeadsSearchList = data.analyticsLeadLineItems;
                if (!this.reportLeadsSearchList || !this.reportLeadsSearchList.length) {
                    this.noSearchResult = 'No Records found. Please refine your search criteria';
                } else if (this.reportLeadsSearchList.length > 1) {
                    this.countMessage = ': ' + this.reportLeadsSearchList.length + ' Results Found';
                } else {
                    this.countMessage = ': ' + this.reportLeadsSearchList.length + ' Result Found';
                }
            },
                (error: any) => { console.log('error : ' + error); this.noSearchResult = 'error'; });
        }
        return false;
    }

    /**
     * ServiceRequest
     */
    public serviceData() {
        let postData = {
            'leadFromDateStr': (this.fromDate) ? moment(this.fromDate).format('MM/DD/YYYY') : '',
            'leadToDateStr': (this.toDate) ? moment(this.toDate).format('MM/DD/YYYY') : '',
            'leadBrandList': (this.selectedBrand && this.selectedBrand.length === 9) ? ['all'] : this.selectedBrand,
            'leadStateList': (this.selectedState && this.selectedState.length === 47) ? ['all'] : this.selectedState,
        };

        return postData;
    }

    /**
     * Current data displayed on table stored to new object array
     * @param data
     */
    public saveDownloadData() {
        console.log(JSON.stringify(this.reportLeadsSearchList));
        this.downloadData = [];
        this.reportLeadsSearchList.map((item: any) => {
            return {
                DATE: item.leadCreationDate,
                STATE: item.leadState,
                BRAND: item.leadBrand,
                SUCCESS_LEADS: item.leadSuccessCount,
                FAILED_LEADS: item.leadFailureCount,
                TOTAL: item.leadTotalCount,
            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
        this.downloadCSV.downloadCurrentData(this.downloadData, 'Leads');
    }

    /**
     *Reset function
     */
    public resetResult() {
        this.reportLeadsSearchList = [];
        this.countMessage = '';
        this.showResult = false;
        this.noSearchResult = '';
        this.paginateMessage = '';
        this.selectedState = [];
        this.selectedBrand = [];
        this.initForm();
    }
}
