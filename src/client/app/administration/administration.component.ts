import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { TabMenuModule, MenuItem } from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    moduleId: module.id,
    selector: 'administration-tab',
    templateUrl: 'administration.component.html',
    styleUrls: ['administration.component.css'],
})
export class AdministrationComponent implements OnInit {
    public menuItems: MenuItem[];
    public activeItem: MenuItem;
    public isEnrollDetails: boolean;
    public acn: any;
    public  tabs : any = { 'searchTabOvered': true, 'advsearchTabOvered' : false };
    public  detailTabs : any = { 'detailsTabOvered': true, 'paymentsTabOvered' : false,
                                 'dataTabOvered': false, 'documentsTabOvered' : false,
                                 'routedTabOvered' : false  };
    public selectedTab : string = 'searchTabOvered';

    constructor( private router: Router, private route: ActivatedRoute ) {
        //   console.log(router.url);
         this.isEnrollDetails = (router.url.indexOf('enrolldetails') > -1) ? true : false;
    }

    ngOnInit() {
        if( this.isEnrollDetails ) {
            this.acn = this.route.snapshot.params['acn'];
            this.tabs = this.detailTabs;
            this.selectedTab = 'detailsTabOvered';
        }
        console.log(' AdministrationComponent ngOninit', this.router.url);
    }


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
    public backToEnrollmentSearchPages() {
        let administrationEnrollResulsRetain: any = JSON.parse(sessionStorage.getItem('administrationEnrollResulsRetain'));
        administrationEnrollResulsRetain.isFromBack = true;
        sessionStorage.setItem('administrationEnrollResulsRetain',JSON.stringify(administrationEnrollResulsRetain));
        let historyUrl = administrationEnrollResulsRetain['historyUrl'];
        this.router.navigate([historyUrl]);
        return false;
    }
}
