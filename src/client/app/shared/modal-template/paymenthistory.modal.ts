import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { PaymentHistoryService } from './../services/paymenthistory/paymenthistory.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'sd-payment-history',
    templateUrl: 'paymenthistory.modal.html',
    styleUrls: ['modal-custom.css'],
    providers: [DatePipe]
})

export class PaymentHistoryModalComponent {

    @ViewChild('paymentHistoryModal') public paymentHistoryModal: ModalDirective;
    @Input() title?: string;
    @Input() appRecordObj?:any;
    @Input() appRecordACN?: string;
    @Input() reportType?: String;

    public paymentList: Object;
    public noDataMessage: string = '';
    public showResult: boolean = false;

    constructor(public paymentHistoryService: PaymentHistoryService) {
        this.paymentList = {};
    }

    /**
     *
     */
    show() {
        this.appRecordObj.applicationStatus = ('applicationStatus' in this.appRecordObj)?this.appRecordObj.applicationStatus:'';
        //this.appRecordACN = 'Y7413N8W'; // test ACN
        this.paymentHistoryService.getHistory(this.appRecordACN).subscribe((data: any) => {
                this.showResult = true;
                this.paymentList = (data.paymentList)?data.paymentList:'';
                this.noDataMessage = '';
                if (data.responseCode === '001') {
                    this.noDataMessage = 'There are no Payment Tracking Details for the application';//data.status;
                }
            },
            (error: any) => { console.log('error : ' + error); this.noDataMessage = 'Service is Temporarily Unavailable'; });

        this.paymentHistoryModal.show();
    }
    /**
     *
     */
    hide() {
        this.paymentHistoryModal.hide();
    }
}
