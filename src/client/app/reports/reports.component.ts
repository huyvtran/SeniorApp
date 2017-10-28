import { Component, OnInit } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';


@Component({
    moduleId: module.id,
    selector: 'reports-tab',
    templateUrl: 'reports.component.html',
    styleUrls: ['reports.component.css'],
})
export class ReportsComponent {
    public  tabs : any = { 'searchTabOvered': true,
                           'advsearchTabOvered' : false,
                           'paymentsTabOvered' : false,
                           'cmsTabOvered' : false
                         };

    public selectedTab : string = 'searchTabOvered';

    toggleTabHighlight(tabIdentifier:string,value:boolean) {
        if( this.selectedTab !== tabIdentifier) {
             this.tabs[tabIdentifier] = value ;
        }
    }
    triggerTabSelection(tabIdentifier:string) {
         this.tabs[this.selectedTab] = false ;
         this.tabs[tabIdentifier] = true ;
         this.selectedTab = tabIdentifier;
    }

}
