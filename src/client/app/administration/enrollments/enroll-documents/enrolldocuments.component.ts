import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Config } from '../../../shared/config/env.config';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, Response, Jsonp, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    selector: 'enroll-documents-tab',
    templateUrl: 'enrolldocuments.component.html',
    styleUrls: ['enrolldocuments.component.css'],
})
export class EnrollDocumentsComponent implements OnInit {
    public acn: any;
    public API_URL: string = Config.API;
    public sanitizedUrl: any;
    public responsePdfUrl = '';
    public pdfDataExists = true;

    constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private http: Http) {
        this.acn = this.route.snapshot.params['acn'];
        // Check the response of service before calling the pdf function
        this.responsePdfUrl = this.API_URL + 'reports/getPdf?acn=' + this.acn;
        this.getPdfService().subscribe((response:  any)  =>  {
            if  (response.status  ===  200) {
                this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.API_URL + 'reports/getPdf?acn=' + this.acn);
                this.pdfDataExists = true;
            }
        },
            (error:  any)  =>  {
                console.log('error : '  +  error);
                this.pdfDataExists = false;
            }
        );
    }

    ngOnInit() {// tslint:disable-line
    }

    public  getPdfService():  Observable<Response> {
        return  this.http.get(this.responsePdfUrl)
            .map(res  =>  res)
            .catch((error:  any)  =>  Observable.throw(error  ||  'Server error'));
    }
}
