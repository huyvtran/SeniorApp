import { NgModule } from '@angular/core';
import { ReportsComponent } from './reports.component';
//import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';
import { Ng2BootstrapModule, DatepickerModule, ModalModule, TabsModule } from 'ngx-bootstrap';
import { DataTableModule, DialogModule, TabViewModule, CalendarModule, MultiSelectModule, DropdownModule } from 'primeng/primeng';
import { ReportsSearchComponent } from './search/reportssearch.component';
import { ReportsAdvSearchComponent } from './advsearch/reportsadvsearch.component';
import { ReportsPaymentsComponent } from './payments/reportspayments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from './reports.service';
import { ReportsConfig } from './api/reportsconfig';
import { PaymentHistoryModalComponent } from '../shared/modal-template/paymenthistory.modal';
import { HelpModalComponent } from '../shared/modal-template/help.modal';
import { NopdfModalComponent } from '../shared/modal-template/nopdf.modal';
import { DownloadCSVService } from '../shared/services/downloadcsv/downloadcsv.service';
import { ReportsValidatorComponent } from './reports-validator';
import { ReportsCalendarValidatorComponent } from './reports-calendar-validator';

import { ReportsValidationService } from './reports-validation.service';

@NgModule({
  imports: [
    Ng2BootstrapModule.forRoot(),
    ModalModule.forRoot(),
    //ReportsRoutingModule,
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
  ],
  declarations: [
    ReportsComponent,
    ReportsSearchComponent,
    ReportsAdvSearchComponent,
    ReportsPaymentsComponent,
    PaymentHistoryModalComponent,
    HelpModalComponent,
    NopdfModalComponent,
    ReportsValidatorComponent,
    ReportsCalendarValidatorComponent
  ],
  exports: [
    ReportsComponent,
    ReportsSearchComponent,
    ReportsAdvSearchComponent,
    ReportsPaymentsComponent,
    ReportsValidatorComponent,
    ReportsCalendarValidatorComponent
  ],
  providers: [ReportsService, ReportsConfig, DownloadCSVService, ReportsValidationService]
})
export class ReportsModule {
  result: any[];
  showForm: boolean = true;
}
