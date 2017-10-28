import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../shared/config/env.config';

@Injectable()
export class ReportsService {
    public API_URL: string = Config.API;
    public requestUrl: string = this.API_URL + 'reports/searchReports';
    public requestPdfUrl: string = this.API_URL + 'reports/getPdf';
    public requestUrlJSON = './app/reports/api/reportResult.json';

    constructor(private http: Http) { }

    /**
     * Search searvice call
     *
     * @param userObject
     */
    public searchReportService(userObject: Object): Observable<Response> {
        let data = JSON.stringify(userObject);
        return this.http.post(this.requestUrl, data, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));

    }

    /**
     * Get result from JSON
     */
    public searchReportJSON(): Observable<Response> {
        return this.http.get(this.requestUrlJSON)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    public getReportPdf(acn:string): Observable<Response> {
        let acnObj = JSON.stringify({'acn':acn});
        return this.http.post(this.requestPdfUrl, acnObj, null)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
