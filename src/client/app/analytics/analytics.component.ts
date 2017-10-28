import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { TabMenuModule, MenuItem } from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';
import * as lodash from 'lodash';
declare var _: any;
_ = lodash;


@Component({
    moduleId: module.id,
    selector: 'analytics-tab',
    templateUrl: 'analytics.component.html',
    styleUrls: ['analytics.component.css'],
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
    public menuItems: MenuItem[];
    public activeItem: MenuItem;
    //public isEnrollDetails: boolean;
    public acn: any;
    public  tabs : any = { 'byPartnerTabOvered': false, 'bySystemTabOvered' : false,
                            'byProductTypeTabOvered': false, 'leadsTabOvered' : false, 'quotesTabOvered' : false,
                            'convertedTabOvered' : false, 'latencyTabOvered' : false, 'totalProfileTabOvered' : false, };

    public selectedTab : string = null;
    public tabRotator: number = 4;
    public tabIndexing : any = { '1' : { tabId : 'byPartnerTabOvered', cssClass: 'd-block', routerName: '/home/analytics/byPartner' },
                           '2' : { tabId : 'bySystemTabOvered', cssClass: 'd-block', routerName: '/home/analytics/bySystem' },
                           '3' : { tabId : 'byProductTypeTabOvered', cssClass: 'd-block', routerName: '/home/analytics/byProductType' },
                           '4' : { tabId : 'leadsTabOvered', cssClass: 'd-block', routerName: '/home/analytics/leads' },
                           '5' : { tabId : 'quotesTabOvered', cssClass: 'd-none', routerName: '/home/analytics/quotes'  },
                           '6' : { tabId : 'convertedTabOvered', cssClass: 'd-none', routerName: '/home/analytics/converted'  },
                           '7' : { tabId : 'latencyTabOvered', cssClass: 'd-none', routerName: '/home/analytics/latency'  },
                           '8' : { tabId : 'totalProfileTabOvered', cssClass: 'd-none', routerName: '/home/analytics/totalProfile'  },
                          };
    public timer: any;
    public timer2: any;
    public urlParts : string[] = [];

    constructor( private router: Router, private route: ActivatedRoute ) {
    }

    ngOnInit() {
            this.selectedTab = 'byPartnerTabOvered';
           console.log('Key==', _.findLastKey(this.tabIndexing, ['tabId','byPartnerTabOvered']));
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.tabs[this.selectedTab] = true;
            }, 0);
    }
    ngAfterViewInit() {
        console.log('ngAfterViewInit');
        this.urlParts = this.router.url.split('/');
        if(this.urlParts.length ===4 && this.urlParts[3] !== '') {
          let tabIndexKey:number = parseInt(_.findLastKey(this.tabIndexing, ['tabId',this.urlParts[3] + 'TabOvered']));
          console.log('tabIndexKey =',tabIndexKey);
          if(tabIndexKey <=4) {
             this.triggerTabSelection( this.urlParts[3] + 'TabOvered');
          }else {
            this.tabRotator = tabIndexKey-1;
            this.rotateMenuToRight();
          }
          //this.triggerTabSelection( this.urlParts[3] + 'TabOvered');
            // console.log()
        }
    }


    public toggleTabHighlight(tabIdentifier:string,value:boolean) {
        if( this.selectedTab !== tabIdentifier) {
             this.tabs[tabIdentifier] = value ;
        }
    }
    public triggerTabSelection(tabIdentifier:string) {
        // if( tabIdentifier !== this.selectedTab ) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.tabs[this.selectedTab] = false ;
            }, 0);
            clearTimeout(this.timer2);
            this.timer2 = setTimeout(() => {
            this.tabs[tabIdentifier] = true;
            this.selectedTab = tabIdentifier;
            let tabIndexKey:number = parseInt(_.findLastKey(this.tabIndexing, ['tabId',tabIdentifier]));
            console.log('tabIndexKey-------',tabIndexKey);
            //this.tabRotator = tabIndexKey;
            //clearTimeout(this.timer);
            }, 0);
        // }
    }
    public rotateMenuToRight() {
        console.log('this.tabRotator====',this.tabRotator);
        if( this.tabRotator >= 4 && this.tabRotator < 8) {
            this.tabRotator = this.tabRotator + 1;
            this.tabIndexing[(this.tabRotator - 4).toString()].cssClass = 'd-none';
            this.tabIndexing[this.tabRotator.toString()].cssClass = 'd-block';
            this.triggerTabSelection(this.tabIndexing[(this.tabRotator - 3).toString()].tabId);
            this.router.navigate([this.tabIndexing[(this.tabRotator - 3).toString()].routerName]);
        }
        return false;
    }
    public rotateMenuToLeft() {
        let tRotator = this.tabRotator;
        if( this.tabRotator > 4) {
          this.tabRotator = this.tabRotator - 4;
          this.tabIndexing[(this.tabRotator + 4).toString()].cssClass = 'd-none';
          this.tabIndexing[this.tabRotator.toString()].cssClass = 'd-block';
          this.triggerTabSelection(this.tabIndexing[this.tabRotator.toString()].tabId);
          this.router.navigate([this.tabIndexing[this.tabRotator.toString()].routerName]);
          this.tabRotator = tRotator -1;
        }
        return false;
    }
}
