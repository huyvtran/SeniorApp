import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../../administration.service';
import { PaymentHistoryService } from '../../../shared/services/paymenthistory/paymenthistory.service';

@Component({
    moduleId: module.id,
    selector: 'enroll-payments-tab',
    templateUrl: 'enrollpayments.component.html',
    styleUrls: ['enrollpayments.component.css'],
})
export class EnrollPaymentsComponent implements OnInit {
    data: any = null;
    public acn: any;
    public paymentList: Object;
    public noDataMessage: string = '';
    public showResult: boolean = false;
    private searchFormdata: any = { 'appSearchCriteriaBean': { 'acn': '', 'searchBy': 'ACN' } };

    constructor(private route: ActivatedRoute, private administrationService: AdministrationService,
        private paymentHistoryService: PaymentHistoryService) {
        this.acn = this.route.snapshot.params['acn'];
        this.searchFormdata.appSearchCriteriaBean.acn = this.acn;
        this.paymentList = {};
        // this.testService();
        this.getSearchReport(this.searchFormdata);
        this.getPaymentHistory();
    }

    ngOnInit() {// tslint:disable-line
    }
    /**
     * Web service invoke
     */
    public getSearchReport(postData: object) {
        this.administrationService.enrollmentSearchReportService(postData).subscribe((data: any) => {
            this.data = data.appReportLineItem[0];
        }, (error: any) => { console.log('error : ' + error); });
    }
    public getPaymentHistory() {
        this.paymentHistoryService.getHistory(this.acn).subscribe((data: any) => {
            this.showResult = true;
            this.paymentList = (data.paymentList) ? data.paymentList : '';
            console.log('response data');
            console.log(data);
            this.noDataMessage = '';
            if (data.responseCode === '001') {
                this.noDataMessage = 'There are no Payment Tracking Details for the application';//data.status;
            }
        },
            (error: any) => { console.log('error : ' + error); this.noDataMessage = 'Service is Temporarily Unavailable'; });
    }

    public testService() {
        this.administrationService.getConfiguration()
            .subscribe(
            (data: any) => {
                this.data = data.appReportLineItem[0];
            },
            (error) => console.log('error : ' + error)
            );
    }
}
