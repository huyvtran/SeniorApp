import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from './../../config/env.config';

@Injectable()
export class PaymentHistoryService {
    public API_URL: string = Config.API;
    //public requestUrl = './app/testdata/paymentHistory.json';
    public requestUrl: string = this.API_URL+'reports/getPaymentInfo';
    public usernameUrl: string = this.API_URL+'getUserName';
    public resetPasswordUrl: string = this.API_URL+'resetPassword';

    public historyReqObj: Object;

    constructor (private http:Http) {}

    public getHistory(acn: string) {
        let requestObj = { 'acn' : acn};
        let data = JSON.stringify(requestObj);
        return this.http.post(this.requestUrl, data, null)
                          .map(res => res.json())
                          .catch((error:any) => Observable.throw(error || 'Server error'));
        // return this.http.get(this.requestUrl)
        //                  .map(res => res.json())
        //                  .catch((error:any) => Observable.throw(error || 'Server error'));
    }

}
