import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'sd-byproducttype-help',
    templateUrl: 'helpbyproducttype.modal.html',
    styleUrls: ['modal-custom.css']
})

export class HelpByProductTypeModalComponent {

    @ViewChild('helpByProductTypeModal') public helpByProductTypeModal: ModalDirective;
    @Input() title?: string;

    /**
     *
     */
    show() {
        this.helpByProductTypeModal.show();
    }
    /**
     *
     */
    hide() {
        this.helpByProductTypeModal.hide();
    }
}
