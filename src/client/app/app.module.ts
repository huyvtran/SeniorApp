import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { RouterModule, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SecurityComponent } from './security/security.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';

// External Module
import { Ng2BootstrapModule, DatepickerModule, ModalModule, TabsModule } from 'ngx-bootstrap';
import { DataTableModule, DialogModule, CalendarModule } from 'primeng/primeng';

// API class
import { AuthGuard, HasAccess } from './auth-guard';
import { SecurityService } from './security/security.service';
import { HttpService } from './core/http.service';
import { HttpFactory } from './core/http.factory';
import { GlobalErrorHandler } from './core/global-error-handler';
import { LoggingService } from './core/logging.service';

import { LoginValidatorComponent } from './login/login.validator';
import { LoginValidationService } from './login/login.validation.service';
import { ViewDetailsModalComponent } from './shared/modal-template/viewdetails.modal';
import { ReportsModule } from './reports/reports.module';
import { AdministrationModule } from './administration/administration.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { TimeoutModalComponent } from  './shared/modal-template/timeout.modal';

import { SecurityValidatorComponent } from './security/security.validator';
import { SecurityCalendarValidatorComponent } from './security/security-calendar-validator';

import { SecurityValidationService } from './security/security.validation.service';
@NgModule({
  imports: [
    Ng2BootstrapModule.forRoot(),
    TabsModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    DatepickerModule,
    DataTableModule,
    DialogModule,
    CalendarModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ReportsModule,
    AdministrationModule,
    AnalyticsModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    SecurityComponent,
    LoginValidatorComponent,
    ViewDetailsModalComponent,
    SecurityValidatorComponent,
    SecurityCalendarValidatorComponent,
    TimeoutModalComponent
  ],
  providers: [{provide: APP_BASE_HREF, useValue: document.location.pathname},
              {provide: LocationStrategy, useClass: HashLocationStrategy},
              {provide: ErrorHandler, useClass: GlobalErrorHandler},
              {provide: Http, useFactory: HttpFactory,
                deps: [XHRBackend, RequestOptions, Router]},
              AuthGuard, HasAccess, SecurityService, SecurityValidationService, LoginValidationService, LoggingService],
  bootstrap: [AppComponent]

})
export class AppModule { }
