import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutedHistoryService } from '../../../shared/services/routedhistory/routedhistory.service';
//import * as XmlObjects from "nativescript-xmlobjects";


@Component({
    moduleId: module.id,
    selector: 'enroll-routed-tab',
    templateUrl: 'enrollrouted.component.html',
    styleUrls: ['enrollrouted.component.css'],
})
export class EnrollRoutedComponent implements OnInit {
    public acn: any;
    public xmlEnabled: boolean = true;
    public message: any;

    constructor(private route: ActivatedRoute, private routedHistoryService: RoutedHistoryService) {
        this.acn = this.route.snapshot.params['acn'];
        this.getRoutedHistory();
    }

    ngOnInit() {// tslint:disable-line
    }
    public getRoutedHistory() {
        this.routedHistoryService.getRoutedHistory(this.acn).subscribe((data: any) => {
            console.log('routed data');
            console.log(data);
            this.xmlEnabled = true;
            this.message = data._body;
            console.log('body==' + this.message);
        },
            (error: any) => {
                console.log('error : ' + error);
                this.xmlEnabled = false;
                this.message = error;
            });
    }
}
