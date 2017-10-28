import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, HasAccess } from './auth-guard';
import { HomeComponent } from './home/home.component';
import { SecurityComponent } from './security/security.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ReportsComponent } from './reports/reports.component';
import { ReportsSearchComponent } from './reports/search/reportssearch.component';
import { ReportsAdvSearchComponent } from './reports/advsearch/reportsadvsearch.component';
import { ReportsPaymentsComponent } from './reports/payments/reportspayments.component';

import { AnalyticsComponent } from './analytics/analytics.component';
import { ByPartnerComponent } from './analytics/by-partner/analytics-by-partner.component';
import { ByProductTypeComponent } from './analytics/by-product-type/analytics-by-product-type.component';
import { BySystemComponent } from './analytics/by-system/analytics-by-system.component';
import { ConvertedComponent } from './analytics/converted/analytics-converted.component';
import { LatencyComponent } from './analytics/latency/analytics-latency.component';
import { LeadsComponent } from './analytics/leads/analytics-leads.component';
import { QuotesComponent } from './analytics/quotes/analytics-quotes.component';
import { TotalProfileComponent } from './analytics/total-profile/analytics-total-profile.component';

import { AdministrationComponent } from './administration/administration.component';
import { EnrollmentsComponent } from './administration/enrollments/enrollments.component';
import { EntitlementsComponent } from './administration/entitlements/entitlements.component';
import { EnrollmentsSearchComponent } from './administration/enrollments/enroll-search/enrollsearch.component';
import { EnrollmentsAdvanceComponent } from './administration/enrollments/enroll-advance/enrolladvance.component';
import { EnrollDetailsComponent } from './administration/enrollments/enroll-details/enrolldetails.component';
import { EnrollRoutedComponent } from './administration/enrollments/enroll-routed/enrollrouted.component';
import { EnrollPaymentsComponent } from './administration/enrollments/enroll-payments/enrollpayments.component';
import { EnrollDataComponent } from './administration/enrollments/enroll-data/enrolldata.component';
import { EnrollDocumentsComponent } from './administration/enrollments/enroll-documents/enrolldocuments.component';

import { LoginComponent } from './login/login.component';
import { ReportsModule } from './reports/reports.module';
import { AdministrationModule } from './administration/administration.module';
import { AnalyticsModule } from './analytics/analytics.module';

export function ReportsRoutingModule() {
    return ReportsModule;
}

export function AdministrationRoutingModule() {
    return AdministrationModule;
}

export function AnalyticsRoutingModule() {
    return AnalyticsModule;
}

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: LoginComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'home',
                component: HomeComponent,
                children: [
                    { path: '', pathMatch: 'prefix', redirectTo: 'dashboard' },
                    { path: 'dashboard', component: DashboardComponent },
                    { path: 'security', component: SecurityComponent },
                    {
                        path: 'reports', component: ReportsComponent,
                        children: [
                            {
                                path: '',
                                component: ReportsSearchComponent,
                            },
                            {
                                path: 'search',
                                component: ReportsSearchComponent
                            },
                            {
                                path: 'advsearch',
                                component: ReportsAdvSearchComponent
                            },
                            {
                                path: 'payments',
                                component: ReportsPaymentsComponent
                            }
                        ]
                    },//loadChildren: ReportsRoutingModule },
                    {
                        path: 'administration', component: AdministrationComponent,
                        children: [
                            {
                                path: 'enrollment',
                                component: EnrollmentsComponent,
                                children: [
                                    {
                                        path: '',
                                        component: EnrollmentsSearchComponent,
                                    },
                                    {
                                        path: 'search',
                                        component: EnrollmentsSearchComponent,
                                    },
                                    {
                                        path: 'advance',
                                        component: EnrollmentsAdvanceComponent,
                                    }]
                            },
                            {
                                path: 'entitlement',
                                component: EntitlementsComponent,
                            },
                        ]
                    },
                    {
                        path: 'administration/enrolldetails/:acn',
                        component: AdministrationComponent,
                        children: [
                            {
                                path: '',
                                component: EnrollDetailsComponent
                            },
                            {
                                path: 'details/:acn',
                                component: EnrollDetailsComponent
                            },
                            {
                                path: 'payments/:acn',
                                component: EnrollPaymentsComponent
                            },
                            {
                                path: 'documents/:acn',
                                component: EnrollDocumentsComponent
                            },
                            {
                                path: 'data/:acn',
                                component: EnrollDataComponent
                            },
                            {
                                path: 'routed/:acn',
                                component: EnrollRoutedComponent
                            }
                        ]
                    },
                    {
                        path: 'analytics', component: AnalyticsComponent,
                        children: [
                            {
                                path: '',
                                component: ByPartnerComponent
                            },
                            {
                                path: 'byPartner',
                                component: ByPartnerComponent
                            },
                            {
                                path: 'byProductType',
                                component: ByProductTypeComponent
                            },
                            {
                                path: 'bySystem',
                                component: BySystemComponent
                            },
                            {
                                path: 'converted',
                                component: ConvertedComponent
                            },
                            {
                                path: 'latency',
                                component: LatencyComponent
                            },
                            {
                                path: 'leads',
                                component: LeadsComponent
                            },
                            {
                                path: 'quotes',
                                component: QuotesComponent
                            },
                            {
                                path: 'totalProfile',
                                component: TotalProfileComponent
                            }
                        ]
                    }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})

export class AppRoutingModule { }
