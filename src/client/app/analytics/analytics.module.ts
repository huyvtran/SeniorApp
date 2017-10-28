import { NgModule } from '@angular/core';
import { AnalyticsComponent } from './analytics.component';
//import { AnalyticsRoutingModule } from './analytics-routing.module';
import { SharedModule } from '../shared/shared.module';
import { Ng2BootstrapModule, DatepickerModule, ModalModule, TabsModule, PopoverModule } from 'ngx-bootstrap';
import { DataTableModule, DialogModule, TabViewModule,
         CalendarModule, MultiSelectModule, DropdownModule, TabMenuModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnalyticsService } from './analytics.service';
import { AnalyticsConfig } from './api/analyticsConfig';
import { ByPartnerComponent } from './by-partner/analytics-by-partner.component';
import { ByProductTypeComponent } from './by-product-type/analytics-by-product-type.component';
import { BySystemComponent } from './by-system/analytics-by-system.component';
import { ConvertedComponent } from './converted/analytics-converted.component';
import { LatencyComponent } from './latency/analytics-latency.component';
import { LeadsComponent } from './leads/analytics-leads.component';
import { QuotesComponent } from './quotes/analytics-quotes.component';
import { AnalyticsValidatorComponent } from './analytics-validator';
import { AnalyticsCalendarValidatorComponent } from './analytics-calendar-validator';
import { AnalyticsValidationService } from './analytics-validation.service';
import { TotalProfileComponent } from './total-profile/analytics-total-profile.component';
import { HelpByPartnerModalComponent } from '../shared/modal-template/helpbypartner.modal';
import { HelpByProductTypeModalComponent } from '../shared/modal-template/helpbyproducttype.modal';
import { HelpConvertedModalComponent } from '../shared/modal-template/helpconverted.modal';
import { DownloadCSVService } from '../shared/services/downloadcsv/downloadcsv.service';

@NgModule({
  imports: [
    Ng2BootstrapModule.forRoot(),
    ModalModule.forRoot(),
    //AnalyticsRoutingModule,
    SharedModule,
    DatepickerModule.forRoot(),
    TabsModule.forRoot(),
    DataTableModule,
    DialogModule,
    TabViewModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TabMenuModule,
    PopoverModule.forRoot(),
  ],
  declarations: [
    AnalyticsComponent,
    ByPartnerComponent,
    ByProductTypeComponent,
    BySystemComponent,
    ConvertedComponent,
    LatencyComponent,
    LeadsComponent,
    QuotesComponent,
    TotalProfileComponent,
    AnalyticsValidatorComponent,
    AnalyticsCalendarValidatorComponent,
    HelpByPartnerModalComponent,
    HelpByProductTypeModalComponent,
    HelpConvertedModalComponent,
  ],
  exports: [
    AnalyticsComponent,
    ByPartnerComponent,
    ByProductTypeComponent,
    BySystemComponent,
    ConvertedComponent,
    LatencyComponent,
    LeadsComponent,
    QuotesComponent,
    TotalProfileComponent,
    AnalyticsValidatorComponent,
    AnalyticsCalendarValidatorComponent,
    HelpByPartnerModalComponent,
    HelpByProductTypeModalComponent,
    HelpConvertedModalComponent,
  ],
  providers: [ AnalyticsService, AnalyticsConfig, AnalyticsValidationService, DownloadCSVService]
})
export class AnalyticsModule {
}
