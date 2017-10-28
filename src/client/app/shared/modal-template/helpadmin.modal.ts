import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'sd-admin-help',
    templateUrl: 'helpadmin.modal.html',
    styleUrls: ['modal-custom.css']
})

export class HelpAdminModalComponent {

    @ViewChild('helpAdminModal') public helpAdminModal: ModalDirective;
    @Input() title?: string;

    /**
     *
     */
    show() {
        this.helpAdminModal.show();
    }
    /**
     *
     */
    hide() {
        this.helpAdminModal.hide();
    }
}
