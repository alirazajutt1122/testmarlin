import { Component, Inject, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import * as wjcInput from '@grapecity/wijmo.input';

@Component({
    selector: 'dialog-cmp-watch',
    templateUrl:'./dialog-template.html',
})

export class DialogCmpWatch {

    modal = true;
    dialogIsVisible: boolean = false;

    public statusMsg: string = '';
    public cssClass: string = '';
    lang:any

    @ViewChild('successDialog',{ static: false }) successDialog: wjcInput.Popup;
    @ViewChild('errorDialog',{ static: false }) errorDialog: wjcInput.Popup;
    @ViewChild('warningDialog',{ static: false }) warningDialog: wjcInput.Popup;
    @ViewChild('notificationDialog',{ static: false }) notificationDialog: wjcInput.Popup;
    @ViewChild('confirmationDialog',{ static: false }) confirmationDialog: wjcInput.Popup;
    @ViewChild('successDialogLocal',{ static: false }) successDialogLocal: wjcInput.Popup;


    @Output() btnClick: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    public showDialog(dlg: wjcInput.Popup) {
        if (dlg) {
            dlg.modal = this.modal;
            dlg.hideTrigger = dlg.modal ? wjcInput.PopupTrigger.None : wjcInput.PopupTrigger.Blur;
            dlg.show();
        }
    };

    public showAlartDialog(dialogName: String) {
        if (dialogName == 'Success')
            this.showDialog(this.successDialog);
        else if (dialogName == 'Error')
            this.showDialog(this.errorDialog);
        else if (dialogName == 'Warning')
            this.showDialog(this.warningDialog);
        else if (dialogName == 'Notification')
            this.showDialog(this.notificationDialog);
        else if (dialogName == 'Confirmation')
            this.showDialog(this.confirmationDialog);
        else if (dialogName == 'LocalSuccess')
            this.showDialog(this.successDialogLocal);
    }

    onClick(btnClicked) {
        this.btnClick.emit(btnClicked);
    }
}
