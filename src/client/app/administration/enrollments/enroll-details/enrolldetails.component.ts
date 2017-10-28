import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../../administration.service';

@Component({
    moduleId: module.id,
    selector: 'enroll-details-tab',
    templateUrl: 'enrolldetails.component.html',
    styleUrls: ['enrolldetails.component.css'],
})
export class EnrollDetailsComponent implements OnInit, AfterViewInit {
    data: any = null;
    public acn: any;
    private searchFormdata: any = {'appSearchCriteriaBean':{'acn':'','searchBy':'ACN'}};

    constructor( private route: ActivatedRoute, private administrationService: AdministrationService ) {
        this.acn = this.route.snapshot.params['acn'];
        this.searchFormdata.appSearchCriteriaBean.acn = this.acn;
       // this.testService();
        this.serviceInvoke(this.searchFormdata);
    }

     ngAfterViewInit(): void {
        try {
        document.querySelector('#entrolldetails-container').scrollIntoView();
        } catch (e) {
            // console.log('error');
        }
     }

    ngOnInit() {
        document.querySelector('#entrolldetails-container').scrollIntoView();
        // tslint:disable-line
    }
    /**
     * Web service invoke
     */
    public serviceInvoke(postData: object) {
        console.log(postData);
        this.administrationService.enrollmentSearchReportService(postData).subscribe((data: any) => {
              this.data = data.appReportLineItem[0];
        }, (error: any) => { console.log('error : ' + error); });
    }

    public testService() {
         this.administrationService.getConfiguration()
            .subscribe(
            (data: any )=> {
                this.data = data.appReportLineItem[0];
            },
            (error) => console.log('error : ' + error)
        );
    }
}
