import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from './../shared/config/env.config';

@Injectable()
export class LoggingService {
    public API_URL: string = Config.API;
    public headers = new Headers({'Content-Type': 'application/json'});
    public options = new RequestOptions({headers: this.headers});
    public requestUrl = '/app/shared/api/security/userList.json';
    //public requestUrl: string = this.API_URL+'searchUsers';
    public usernameUrl: string = this.API_URL+'getUserName';

    constructor (private http:Http) {}

    /**
     * Log error
     *
     * @param error
     */
    public log(error: any): Observable<Response> {
        let data = JSON.stringify(error);
        console.log(data);
        return this.http.post(this.requestUrl, data, this.options)
                         .map(res => res.json());
    }
}
