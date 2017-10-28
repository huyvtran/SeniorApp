import { XHRBackend, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { HttpService } from './http.service';

export function HttpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions,
                router: Router): Http {
    return new HttpService(xhrBackend, requestOptions, router);
}
