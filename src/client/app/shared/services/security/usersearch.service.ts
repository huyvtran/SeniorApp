import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from './../../config/env.config';

@Injectable()
export class UserSearchService {
    public API_URL: string = Config.API;
    public headers = new Headers({'Content-Type': 'application/json'});
    public options = new RequestOptions({headers: this.headers});
    //public requestUrl = '/app/shared/api/security/userList.json';
    public requestUrl: string = this.API_URL+'searchUsers';
    public usernameUrl: string = this.API_URL+'getUserName';
    public resetPasswordUrl: string = this.API_URL+'resetPassword';

    constructor (private http:Http) {}

    /**
     * Get user search result
     *
     * @param userObject
     */
    public getUserList(userObject: Object): Observable<Response> {
        let data = JSON.stringify(userObject);
        console.log(data);
        return this.http.post(this.requestUrl, data, this.options)
                         .map(res => res.json())
                         .catch((error:any) => Observable.throw(error || 'Server error'));
        // return this.http.get(this.requestUrl)
        //                 .map(res => res.json())
        //                 .catch((error:any) => Observable.throw(error || 'Server error'));

    }

    /**
     * Get username service call
     *
     * @param userObject
     */
    public getUserName(userObject: Object): Observable<Response> {
        let data = JSON.stringify(userObject);
        return this.http.post(this.usernameUrl, data, this.options)
                        .map(res => res.json())
                        .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    /**
     * Get temp password
     *
     * @param webGuid
     */
    public resetPasswordService(userObject: Object): Observable<Response> {
        let data = JSON.stringify(userObject);
        return this.http.post(this.resetPasswordUrl, data, this.options)
                        .map(res => res.json())
                        .catch((error:any) => Observable.throw(error || 'Server error'));
    }
}
