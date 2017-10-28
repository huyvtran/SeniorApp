import { Component, OnInit } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

//import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginValidatorComponent } from './login.validator';
import { LoginValidationService } from './login.validation.service';
import { AuthService } from './../shared/services/auth/auth.service';
import { Config } from '../shared/config/env.config';

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit {

  public loginForm: any;

  public username: string;
  public password: string;
  public invalidCredentials: string = '';

  //data: any;
  constructor(private router: Router, private route: ActivatedRoute,
  private formBuilder: FormBuilder, private authService: AuthService) { //, private http:Http
  }
  /**
   * Initialize Form validation OnInit
   */
  ngOnInit() {
    // Check for local env
    if (Config.ENV !== 'SBX' && Config.ENV !== 'DEVELOP') {
      this.authService.getHeaders(Config.ENV).subscribe((data: any) => {
        //console.log('called sm headers');
      }, (error: any) => { console.log('error : ' + error);  });

      this.authService.getToken(Config.ENV).subscribe((data: any) => {
        //console.log('called get token non dev');
      }, (error: any) => { console.log('error : ' + error);  });

      // TODO :check local storage auth before calling the auth service
      if (localStorage.getItem('userID')) {
        let returnUrl = (localStorage.getItem('returnUrl')) ? localStorage.getItem('returnUrl') : 'home';
        localStorage.removeItem('returnUrl');
        this.router.navigate([returnUrl]);
      } else {
        window.location.href = window.location.origin+'/solsadmin/login.html';
      }
    }

    this.loginForm = this.formBuilder.group({
      'username': ['', [LoginValidationService.userNameValidator]],
      'password': ['', [LoginValidationService.passwordValidator]],
    });
  }

  /**
  onSubmit(username:string,password:string) {
    console.log('Hello1');
    this.data = {
        USER: username, //Jayshort
        PASSWORD: password, //wellpoint1
        TARGET: '/home1'
      };
    this.http.post('https://va10tlvihs330.wellpoint.com/siteminderagent/forms/login.fcc', JSON.stringify(this.data));
        console.log(this.data);
        console.log('Hello' + JSON.stringify(this.data));
  }*/

  /**
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  public authenticate() {
    if (this.loginForm.dirty && this.loginForm.valid) {
      localStorage.setItem('userID', this.loginForm.get('username').value);
      this.authService.getToken(Config.ENV).subscribe((data: any) => {
        //console.log('called get headers');
      }, (error: any) => { console.log('error : ' + error);  });
      let returnUrl = (localStorage.getItem('returnUrl')) ? localStorage.getItem('returnUrl') : 'home';
      localStorage.removeItem('returnUrl');
      this.router.navigate([returnUrl]);
    }
    return false;
  }
}
