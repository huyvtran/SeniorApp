import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from './../../config/env.config';

@Injectable()
export class RoutedHistoryService {
    public API_URL: string = Config.API;
    public requestUrl: string = this.API_URL + 'enrollment/routed';

    constructor(private http: Http) { }

    public getRoutedHistory(acn: String) {
        let headers = new Headers();
        headers.append('SM_USER', localStorage.getItem('userID'));
        headers.append('Authorization', localStorage.getItem('userToken'));
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.requestUrl + '?acn=' + acn, options)
            .map(res => res)
            .catch((error: any) => {
                if (error.status === 400) {
                    return Observable.throw('There is no valid data for this application');
                }else if (error.status === 500) {
                    return Observable.throw('We are sorry, due to a technical error the request could not be processed');
                }else { return Observable.throw('Service error'); }
            });
    }
}
