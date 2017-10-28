import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'sd-nopdf',
    templateUrl: 'nopdf.modal.html',
    styleUrls: ['modal-custom.css']
})

export class NopdfModalComponent {

    @ViewChild('nopdfModal') public nopdfModal: ModalDirective;
    @Input() title?: string;
    @Input() pdfacn?: string;

    /**
     *
     */
    show() {
        this.nopdfModal.show();
    }
    /**
     *
     */
    hide() {
        this.nopdfModal.hide();
    }
}
