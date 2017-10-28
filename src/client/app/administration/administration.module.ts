import { NgModule } from '@angular/core';
import { AdministrationComponent } from './administration.component';
//import { AdministrationRoutingModule } from './administration-routing.module';
import { SharedModule } from '../shared/shared.module';
import { Ng2BootstrapModule, DatepickerModule, ModalModule, TabsModule } from 'ngx-bootstrap';
import { DataTableModule, DialogModule, TabViewModule,
         CalendarModule, MultiSelectModule, DropdownModule, TabMenuModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdministrationService } from './administration.service';
import { EnrollmentsComponent }  from './enrollments/enrollments.component';
import { EntitlementsComponent }  from './entitlements/entitlements.component';
import { EnrollmentsSearchComponent }  from './enrollments/enroll-search/enrollsearch.component';
import { EnrollmentsAdvanceComponent }  from './enrollments/enroll-advance/enrolladvance.component';
import { EnrollmentsSearchResultComponent }  from './enrollments/enroll-result/enrollresult.component';
import { EnrollDetailsComponent }  from './enrollments/enroll-details/enrolldetails.component';
import { EnrollRoutedComponent }  from './enrollments/enroll-routed/enrollrouted.component';
import { EnrollPaymentsComponent }  from './enrollments/enroll-payments/enrollpayments.component';
import { EnrollDataComponent }  from './enrollments/enroll-data/enrolldata.component';
import { EnrollDocumentsComponent }  from './enrollments/enroll-documents/enrolldocuments.component';
import { EnrollConfig } from './api/enrollConfig';
import { HelpAdminModalComponent } from '../shared/modal-template/helpadmin.modal';
import { DataHistoryService } from '../shared/services/datahistory/datahistory.service';
import { RoutedHistoryService } from '../shared/services/routedhistory/routedhistory.service';
import { DownloadCSVService } from '../shared/services/downloadcsv/downloadcsv.service';
import { EnrollmentsValidatorComponent } from './enrollments/enrollments-validator';
import { EnrollmentsCalendarValidatorComponent } from './enrollments/enrollments-calendar-validator';
import { EnrollmentsValidationService } from './enrollments/enrollments-validation.service';

@NgModule({
  imports: [
    Ng2BootstrapModule.forRoot(),
    ModalModule.forRoot(),
    //AdministrationRoutingModule,
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
  ],
  declarations: [
    AdministrationComponent,
    EnrollmentsComponent,
    EntitlementsComponent,
    EnrollmentsSearchComponent,
    EnrollmentsAdvanceComponent,
    EnrollmentsSearchResultComponent,
    EnrollDetailsComponent,
    EnrollRoutedComponent,
    EnrollPaymentsComponent,
    EnrollDataComponent,
    EnrollDocumentsComponent,
    HelpAdminModalComponent,
    EnrollmentsValidatorComponent,
    EnrollmentsCalendarValidatorComponent
  ],
  exports: [
    AdministrationComponent,
    EnrollmentsComponent,
    EntitlementsComponent,
    EnrollmentsSearchComponent,
    EnrollmentsAdvanceComponent,
    EnrollDetailsComponent,
    EnrollRoutedComponent,
    EnrollPaymentsComponent,
    EnrollDataComponent,
    EnrollDocumentsComponent,
    EnrollmentsValidatorComponent,
    EnrollmentsCalendarValidatorComponent
  ],
  providers: [ AdministrationService, EnrollConfig, DataHistoryService,
               RoutedHistoryService, DownloadCSVService, EnrollmentsValidationService ]
})
export class AdministrationModule {
}
