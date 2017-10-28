import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'sd-help',
    templateUrl: 'help.modal.html',
    styleUrls: ['modal-custom.css']
})

export class HelpModalComponent {

    @ViewChild('helpModal') public helpModal: ModalDirective;
    @Input() title?: string;

    /**
     *
     */
    show() {
        this.helpModal.show();
    }
    /**
     *
     */
    hide() {
        this.helpModal.hide();
    }
}
