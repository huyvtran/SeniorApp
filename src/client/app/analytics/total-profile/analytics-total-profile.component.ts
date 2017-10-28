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
    selector: 'sd-analytics-total-profile',
    templateUrl: 'analytics-total-profile.component.html',
    styleUrls: ['analytics-total-profile.component.css'],
})
export class TotalProfileComponent implements OnInit {
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public reportTotalProfileSearchList: any = [];
    public showForm: boolean = false;
    public showResult: boolean = false;
    public totalProfileForm: any;
    public brandList: SelectItem[];
    public selectedBrand: any[] = [];
    public genderList: SelectItem[];
    public selectedGender: string = '';
    public downloadData: any = [];
    public noSearchResult: string = '';
    public paginateMessage: string = '';
    public fromDate: Date;
    public toDate: Date;
    public maxFromDate: Date;
    public maxToDate: Date;
    public fromDOBDate: Date;
    public toDOBDate: Date;
    public maxFromDOBDate: Date;
    public maxToDOBDate: Date;
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
     * Initialize form and load dropdown data's
     */
    ngOnInit() { // tslint:disable-line
        this.buildTotalProfileForm();
    }

    /**
     * Building total profile form with fields
     */
    buildTotalProfileForm() {
        this.totalProfileForm = this.formBuilder.group({
            fromDate: ['', []],
            toDate: ['', []],
            fromDOBDate: ['', []],
            toDOBDate: ['', []],
            brands: [[], ''],
            gender: [[], ''],
        }, {
                validator: AnalyticsValidationService.totalProfileDateValidator
            });
        this.initForm();
    }

    /**
     * Resting Total Profile Form
     */
    public resetTotalProfileForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildTotalProfileForm();
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
        selectedForm.get('fromDOBDate').markAsTouched();
        selectedForm.get('fromDOBDate').updateValueAndValidity();
        selectedForm.get('toDOBDate').markAsTouched();
        selectedForm.get('toDOBDate').updateValueAndValidity();
    }

    /**
     * Initialization
     */
    initForm() {
        this.initDateFields();
        this.brandList = this.analyticsConfig.initBrandList();
        this.genderList = this.analyticsConfig.initGenderList();
    }

    /**
     * Initialize Date
     */
    initDateFields() {
        this.toDate = new Date();
        this.maxToDate = new Date();
        this.maxFromDate = new Date();
        this.maxToDOBDate = new Date();
        this.maxFromDOBDate = new Date();
    }

    /**
     * Search function
     */
    public searchReport() {
        this.noSearchResult = '';
        this.countMessage = '';
        this.reportTotalProfileSearchList = '';
        this.applyMarkAsTouched(this.totalProfileForm);

        if (this.totalProfileForm.dirty && this.totalProfileForm.valid) {
            let postData = this.serviceData();
            // console.log(postData);
            this.analyticsService.totalProfileSearchReportService(postData).subscribe((data: any) => {
                this.showResult = true;
                this.showForm = !this.showForm;
                // console.log(data);
                this.reportTotalProfileSearchList = data.totalProfileLineItems;
                if (!this.reportTotalProfileSearchList || !this.reportTotalProfileSearchList.length) {
                    this.noSearchResult = 'No Records found. Please refine your search criteria';
                } else if (this.reportTotalProfileSearchList.length > 1) {
                    this.countMessage = ': ' + this.reportTotalProfileSearchList.length + ' Results Found';
                } else {
                    this.countMessage = ': ' + this.reportTotalProfileSearchList.length + ' Result Found';
                }
            },
                (error: any) => { console.log('error : ' + error); this.noSearchResult = 'error'; });
        }
        return false;
    }

    /**
     * Service data creation
     */
    public serviceData() {
        let postData = {
            'totalProfileCreateDateFromStr': (this.fromDate) ? moment(this.fromDate).format('MM/DD/YYYY') : '',
            'totalProfileCreateDateToStr': (this.toDate) ? moment(this.toDate).format('MM/DD/YYYY') : '',
            'totalProfileDobFromStr': (this.fromDOBDate) ? moment(this.fromDOBDate).format('MM/DD/YYYY') : '',
            'totalProfileDobToStr': (this.toDOBDate) ? moment(this.toDOBDate).format('MM/DD/YYYY') : '',
            'totalProfileBrandsSelected': (this.selectedBrand && this.selectedBrand.length === 9) ? ['all'] : this.selectedBrand,
            'totalProfileGender': (this.selectedGender) ? this.selectedGender : '',
        };

        return postData;
    }

    /**
     * Current data displayed on table stored to new object array
     * @param data
     */
    public saveDownloadData() {
        // console.log(JSON.stringify(this.reportTotalProfileSearchList));
        this.downloadData = [];
        this.reportTotalProfileSearchList.map((item: any) => {
            return {
                USERNAME: item.userName,
                GENDER: item.gender,
                DOB: item.dob,
                BRAND: item.brand,
                PLAN_TYPE: item.planType,
                OVERALL_BENEFIT_PREFERENCES: item.overallBenifitPreferences,
                ZIPCODE: item.zipcode,
                STATE: item.state,
                COUNTY: item.county,
                ENROLLMENT_WITHIN_90_DAYS: item.enrollmentWithin90Days,
            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
        this.downloadCSV.downloadCurrentData(this.downloadData, 'Total Profile');
    }

    /**
     * Reset function
     */
    public resetResult() {
        this.reportTotalProfileSearchList = [];
        this.countMessage = '';
        this.showResult = false;
        this.noSearchResult = '';
        this.paginateMessage = '';
        this.selectedBrand = [];
        this.selectedGender = '';
        this.initForm();
    }
}

