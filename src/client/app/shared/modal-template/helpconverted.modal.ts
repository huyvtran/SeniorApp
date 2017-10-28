import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'sd-converted-help',
    templateUrl: 'helpconverted.modal.html',
    styleUrls: ['modal-custom.css']
})

export class HelpConvertedModalComponent {

    @ViewChild('helpConvertedModal') public helpConvertedModal: ModalDirective;
    @Input() title?: string;

    /**
     *
     */
    show() {
        this.helpConvertedModal.show();
    }
    /**
     *
     */
    hide() {
        this.helpConvertedModal.hide();
    }
}
