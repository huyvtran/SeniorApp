import { Config } from '../shared/config/env.config';

import { Http, Headers, Response, Jsonp, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class AdministrationService {
    public API_URL: string = Config.API;
    public requestUrl: string = this.API_URL + 'reports/searchReports';
    public requestUrlJSON = './app/administration/api/acnDrillDownDetails.json';
    public resendAppUrl: string = this.API_URL + 'enrollment/resendApplications';
    public resendAppImageUrl: string = this.API_URL + 'enrollment/resendApplicationsToImaging';
    public getEntitlementUrl: string = this.API_URL + 'entitlements/getUserEntitlements';
    public updateEntitlementUrl: string = this.API_URL + 'entitlements/updateUserEntitlements';

    /**
     *
     * @param http
     */
    constructor(private http: Http) { }

    /**
     * Search searvice call
     *
     * @param searchCriteriaObject
     */
    public enrollmentSearchReportService(searchCriteriaObject: Object): Observable<Response> {
        let data = JSON.stringify(searchCriteriaObject);
        console.log(data);
        return this.http.post(this.requestUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }

    /**
    * Search searvice call
    *
    * @param acnArray
    */
    public enrollmentResendApplication(acnArray: any): Observable<Response> {
        let data = JSON.stringify(acnArray);
        console.log(data);
        return this.http.post(this.resendAppUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }

    /**
    * Search searvice call
    *
    * @param acnArray
    */
    public enrollmentResendApplicationImaging(acnArray: any): Observable<Response> {
        let data = JSON.stringify(acnArray);
        console.log(data);
        return this.http.post(this.resendAppImageUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }

    /**
     * Simulating enrollmentSearchReportService
     */
    public getConfiguration(): Observable<Response> {
        return this.http.get(this.requestUrlJSON).map(res => res.json());
    }

    /**
     * Search and get user entitlements using userid and current user's role
     * Sample
     * {
     *   "userId": "Sample",
     *   "currentUserRole": "IT_ADMIN",
     *   "currentUser": "This User"
     * }
     * @param userDetails
     */
    public getUserEntitlements(userDetails: any): Observable<Response> {
        let data = JSON.stringify(userDetails);
        return this.http.post(this.getEntitlementUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }

    /**
     * Update entitlement details of a user
     *
     * @param userObj
     */
    public updateUserEntitlements(userObj: any): Observable<Response> {
        let data = JSON.stringify(userObj);
        return this.http.put(this.updateEntitlementUrl, data, null)
            .map(res => res.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
}
