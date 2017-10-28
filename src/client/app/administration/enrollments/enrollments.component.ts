import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { TabMenuModule, MenuItem } from 'primeng/primeng';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'enrollment-tab',
    templateUrl: 'enrollments.component.html',
    styleUrls: ['enrollments.component.css'],
})
export class EnrollmentsComponent implements OnDestroy, OnInit {
    public searchResult: any = [];
    public showForm: boolean = false;
    public activeTabIndex: Number = 0;
    public searchCriteria: any;

    /**
     * Constructor function
     */
    constructor(private router: Router) {
        this.searchResult = ['init'];
    }

    /**
     *
     */
    ngOnDestroy() {
        let currentUrl: String = this.router.url;

        if (currentUrl.indexOf('enrolldetails') < 0) {
            try {
                sessionStorage.removeItem('administrationEnrollResulsRetain');
            } catch (e) { }// tslint:disable-line
        }
    }

    /**
     *
     */
    ngOnInit() {
        try {
            let retainedInfo: any = JSON.parse(sessionStorage.getItem('administrationEnrollResulsRetain'));

            if (retainedInfo.isFromBack === true && retainedInfo.searchType === 'advance') {
                this.activeTabIndex = 1;
            }
        } catch (e) { }// tslint:disable-line
    }

    /**
     *
     */
    public onSearchNotify(data: any) {
        if ((data && data.length > 0) || (data.enrollSearchList && data.enrollSearchList[0] && data.enrollSearchList[0] === 'init')) {
            this.showForm = false;
        } else {
            this.showForm = true;
        }

        let administrationEnrollResulsRetain: any = {
            'searchType': 'search', 'isFromBack': false,
            'historyUrl': '/home/administration/enrollment/search'
        };

        this.searchCriteria = data.searchedCriteria ? data.searchedCriteria : '';
        administrationEnrollResulsRetain['searchedCriteria'] = data['searchedCriteria'];
        sessionStorage.setItem('administrationEnrollResulsRetain', JSON.stringify(administrationEnrollResulsRetain));
        this.searchResult = data['enrollSearchList'];
    }

    /**
     *
     */
    public onAdvancedNotify(data: any) {
        if ((data && data.length > 0) || data.enrollSearchList[0] === 'init') {
            this.showForm = false;
        } else {
            this.showForm = true;
        }

        let administrationEnrollResulsRetain: any = {
            'searchType': 'advance',
            'historyUrl': '/home/administration/enrollment/advance',
            'isFromBack': false
        };

        this.searchCriteria = data.searchedCriteria ? data.searchedCriteria : '';
        administrationEnrollResulsRetain['searchedCriteria'] = data['searchedCriteria'];
        sessionStorage.setItem('administrationEnrollResulsRetain', JSON.stringify(administrationEnrollResulsRetain));
        this.searchResult = data['enrollSearchList'];
    }

    /**
     * Reset service
     */
    public resetService(event: any) {
        this.searchResult = ['init'];
    }

    /**
     * Toggle search accrodance
     */
    public toggleSearchAccordance() {
        this.showForm = !this.showForm;
    }

    /**
     * Toggle event
     */
    public doToggle(toggleValue: any) {
        this.showForm = toggleValue;
    }
}
