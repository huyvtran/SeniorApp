import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LogoutModalComponent } from  './modal-template/logout.modal';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { OnlyAlphabetDirective } from './only-alphabet/only-alphabet.component';
import { OnlyNumberDirective } from './only-number/only-number.component';

import { PaymentHistoryService } from './services/paymenthistory/paymenthistory.service';
import { DatexPipe } from './custom-pipes/dateX.pipe';

import { AuthService } from './services/auth/auth.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, ModalModule],
  declarations: [
    ToolbarComponent,
    LogoutModalComponent,
    BreadcrumbComponent,
    OnlyAlphabetDirective,
    OnlyNumberDirective,
    FooterComponent,
    DatexPipe,
  ],
  exports: [
    ToolbarComponent,
    BreadcrumbComponent,
    OnlyAlphabetDirective,
    OnlyNumberDirective,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    DatexPipe,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [AuthService, PaymentHistoryService]
    };
  }
}
