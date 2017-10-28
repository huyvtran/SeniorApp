
import { Config } from '../shared/config/env.config';

import { Http, Headers, Response, Jsonp, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class AnalyticsService {
    public API_URL: string = Config.API;
    public partnerSalesRequestUrl: string = this.API_URL + 'analytics/getPartnerSales';
    public systemSalesRequestUrl: string = this.API_URL + 'analytics/getSystemSales';
    public leadsRequestUrl: string = this.API_URL + 'analytics/getLeads';
    public requestLatencyUrl: string = this.API_URL + 'analytics/getLatency';
    public requestTotalProfileUrl: string = this.API_URL + 'analytics/getTotalProfile';
    public requestProductTypeUrl: string = this.API_URL + 'analytics/getPlan';
    public requestUrlJSON = './app/administration/api/acnDrillDownDetails.json';
    public requestConvertedUrl: string = this.API_URL + 'analytics/getConversion';
    public productTypeRequestUrl: string = this.API_URL + 'analytics/getPlan';
    public quotesRequestUrl: string = this.API_URL + 'analytics/getQuotes';
    public countyServiceRequestUrl: string = this.API_URL + 'analytics/getCounty';

    //public requestConvertedUrl: string = 'https://ols.dev1.internal3.eportal.anthem.com/solsadmin/senior/admin/analytics/getConversion';
    /**
     *
     * @param http
     */
    constructor(private http: Http) {
        // this.systemSalesRequestUrl = 'http://30.138.169.145:8090/admin/analytics/getPartnerSales';
    }

    /**
     * Search searvice call
     *
     * @param searchCriteriaObject
     */
    public byPartnerSearchReportService(searchCriteriaObject: Object): Observable<Response> {
        let data = JSON.stringify(searchCriteriaObject);
        return this.http.post(this.partnerSalesRequestUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }

    /**
     * Converted tab search
     *
     * @param searchCriteriaObject
     */
    public convertedSearchReportService(searchCriteriaObject: Object): Observable<Response> {
        let data = JSON.stringify(searchCriteriaObject);
        return this.http.post(this.requestConvertedUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Service is temporarily unavailable'));

    }

    /**
     * Latency Search searvice call
     *
     * @param searchCriteriaObject
     */
    public latencySearchReportService(searchCriteriaObject: Object): Observable<Response> {
        let data = JSON.stringify(searchCriteriaObject);
        return this.http.post(this.requestLatencyUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }
    /**
     * Search by Product Type Service Call
     *
     * @param searchCriteriaObject
     */
    public byProductTypeSearchReportService(searchCriteriaObject: Object): Observable<Response> {
        let data = JSON.stringify(searchCriteriaObject);
        return this.http.post(this.requestProductTypeUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }

    /**
     * Total Profile Search searvice call
     *
     * @param searchCriteriaObject
     */
    public totalProfileSearchReportService(searchCriteriaObject: Object): Observable<Response> {
        let data = JSON.stringify(searchCriteriaObject);
        return this.http.post(this.requestTotalProfileUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    /**
     * Quotes Service Call
     *
     * @param searchCriteriaObject
     */
    public quotesService(searchCriteriaObject: Object): Observable<Response> {
        let data = JSON.stringify(searchCriteriaObject);
        return this.http.post(this.quotesRequestUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    /**
     * County Details Service Call
     *
     * @param searchCriteriaObject
     */
    public countyService(searchCriteriaObject: Object): Observable<Response> {
        let data = JSON.stringify(searchCriteriaObject);
        return this.http.post(this.countyServiceRequestUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    /**
     * Search searvice call
     *
     * @param searchCriteriaObject
     */
    public bySystemSearchReportService(searchCriteriaObject: Object): Observable<Response> {
        // searchCriteriaObject = { 'userId': 'jkhkjk','userRole': 'BIZ_ADMIN' };
        let data = JSON.stringify(searchCriteriaObject);
        return this.http.post(this.systemSalesRequestUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }
    /**
     * Search searvice call
     *
     * @param searchCriteriaObject
     */
    public leadsSearchReportService(searchCriteriaObject: Object): Observable<Response> {
        let data = JSON.stringify(searchCriteriaObject);
        return this.http.post(this.leadsRequestUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }
}
