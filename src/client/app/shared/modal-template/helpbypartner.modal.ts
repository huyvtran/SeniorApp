import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'sd-bypartner-help',
    templateUrl: 'helpbypartner.modal.html',
    styleUrls: ['modal-custom.css']
})

export class HelpByPartnerModalComponent {

    @ViewChild('helpByPartnerModal') public helpByPartnerModal: ModalDirective;
    @Input() title?: string;

    /**
     *
     */
    show() {
        this.helpByPartnerModal.show();
    }
    /**
     *
     */
    hide() {
        this.helpByPartnerModal.hide();
    }
}
