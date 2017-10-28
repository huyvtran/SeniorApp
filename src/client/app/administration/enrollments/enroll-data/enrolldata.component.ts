import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataHistoryService } from '../../../shared/services/datahistory/datahistory.service';
//import * as XmlObjects from "nativescript-xmlobjects";


@Component({
    moduleId: module.id,
    selector: 'enroll-data-tab',
    templateUrl: 'enrolldata.component.html',
    styleUrls: ['enrolldata.component.css'],
})
export class EnrollDataComponent implements OnInit {
    public acn: any;
    public xmlEnabled: boolean = true;
    public message: any;

    constructor(private route: ActivatedRoute, private dataHistoryService: DataHistoryService) {
        this.acn = this.route.snapshot.params['acn'];
        this.getDataHistory();
    }

    ngOnInit() { // tslint:disable-line
    }
    public getDataHistory() {
        this.dataHistoryService.getDataHistory(this.acn).subscribe((data: any) => {
            this.xmlEnabled = true;
            this.message = data._body;
        },
            (error: any) => {
          //      console.log('error : ' + error);
                this.xmlEnabled = false;
                this.message = error;
            });
    }
}
