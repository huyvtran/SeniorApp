import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar } from 'primeng/primeng';
import { AnalyticsValidatorComponent } from '../analytics-validator';
import { AnalyticsCalendarValidatorComponent } from '../analytics-calendar-validator';
import { AnalyticsValidationService } from '../analytics-validation.service';
import { DownloadCSVService } from '../../shared/services/downloadcsv/downloadcsv.service';
import { AnalyticsService } from '../analytics.service';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'sd-analytics-by-system',
    templateUrl: 'analytics-by-system.component.html',
    styleUrls: ['analytics-by-system.component.css'],
})
export class BySystemComponent implements OnInit {
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public reportBySystemSearchList: any = [];
    public downloadData: any = [];
    public showForm: boolean = false;
    public showResult: boolean = false;
    public noSearchResult: string = '';
    public paginateMessage: string = '';
    public fromDate: Date;
    public toDate: Date;
    public maxFromDate: Date;
    public maxToDate: Date;
    public timer: any;
    public bySystemForm: any;

    /**
     * Constructor function
     * @param formBuilder
     * @param
     * @param
     */
    constructor(private formBuilder: FormBuilder,
        public analyticsService: AnalyticsService,
        public downloadCSV: DownloadCSVService) {

    }

    /**
     * By System Form initialization
     */
    ngOnInit() { // tslint:disable-line
        this.buildBySystemForm();
    }

    /**
     * Building By System Form
     */
    buildBySystemForm() {
        this.bySystemForm = this.formBuilder.group({
            fromDate: ['', []],
            toDate: ['', []],
        }, {
                validator: AnalyticsValidationService.byPartnerDateValidator
            });
        this.initDateFields();
    }

    /**
     * Reseting By System Form initialization
     */
    public resetBySystemForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildBySystemForm();
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
    }

    /**
     * Initialize Date
     */
    initDateFields() {
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
        this.reportBySystemSearchList = '';
        this.applyMarkAsTouched(this.bySystemForm);

        if (this.bySystemForm.dirty && this.bySystemForm.valid) {
            let postData = this.serviceData();
            this.analyticsService.bySystemSearchReportService(postData).subscribe((data: any) => {
                this.showResult = true;
                this.showForm = !this.showForm;
                // console.log(data);
                this.reportBySystemSearchList = data.analyticsSystemLineItems;
                if (!this.reportBySystemSearchList || !this.reportBySystemSearchList.length) {
                    this.noSearchResult = 'No Records found. Please refine your search criteria';
                } else if (this.reportBySystemSearchList.length > 1) {
                    this.countMessage = ': ' + this.reportBySystemSearchList.length + ' Results Found';
                } else {
                    this.countMessage = ': ' + this.reportBySystemSearchList.length + ' Result Found';
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
            'systemFromDateStr': (this.fromDate) ? moment(this.fromDate).format('MM/DD/YYYY') : '',
            'systemToDateStr': (this.toDate) ? moment(this.toDate).format('MM/DD/YYYY') : '',
        };

        return postData;
    }

    /**
     * Current data displayed on table stored to new object array
     * @param data
     */
    public saveDownloadData() {
        console.log(JSON.stringify(this.reportBySystemSearchList));
        this.downloadData = [];
        this.reportBySystemSearchList.map((item: any) => {
            return {
                DATE: item.dateStr,
                PARTNER:item.partner,
                MA_ACS: item.maAcs,
                MA_MEDISYS: item.maMedisys,
                MA_TOTAL: item.maTotal,
                MS_HOV: item.msHov,
                MS_MEDISYS: item.msMedisys,
                MS_COSMO: item.msCosmo,
                MS_TOTAL: item.msTotal,
                PDP_ACS: item.pdpAcs,
                PDP_MEDISYS: item.pdpMedisys,
                PDP_TOTAL: item.pdpTotal

            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
        this.downloadCSV.downloadCurrentData(this.downloadData, 'By System');
    }

    /**
     *Reset function
     */
    public resetResult() {
        this.reportBySystemSearchList = [];
        this.countMessage = '';
        this.showResult = false;
        this.noSearchResult = '';
        this.paginateMessage = '';
        this.initDateFields();
    }
}
