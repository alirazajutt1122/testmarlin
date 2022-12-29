'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Migrator } from 'app/models/migrator';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { DialogCmp } from '../../user-site/dialog/dialog.component';

declare var jQuery: any;
let downloadAPI = require('./../../../../../scripts/download-document');

@Component({
    selector: 'export-file',
    templateUrl: './export-file.html',
})

export class ExportFile implements OnInit {
    public myForm: FormGroup;
    errorMessage: string;
    //claims: any;
    public oExportFile: Migrator;
    exportTypeList: any[];
    public isSubmitted: boolean;
    public transDate: Date = new Date();


    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    lang: string;

    constructor(private appState: AppState, private changeDetectorRef: ChangeDetectorRef, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService,private loader : FuseLoaderScreenService) {
        //this.claims = authService.claims;
        this.oExportFile = new Migrator();
        this.isSubmitted = false;
        this.exportTypeList = [
            {
                'value': AppConstants.PLEASE_SELECT_VAL,
                'abbreviation': AppConstants.PLEASE_SELECT_STR
            },
            {
                'value': '0',
                'abbreviation': 'All Exports'
            },
            {
                'value': '1',
                'abbreviation': 'Kits-One-Client-List'
            },
            {
                'value': '2',
                'abbreviation': 'Kits-Client-Information'
            },
            {
                'value': '3',
                'abbreviation': 'Kits-Agent-information'
            },
            {
                'value': '4',
                'abbreviation': 'Kits-Cdc-Client-Holding'
            },
            {
                'value': '5',
                'abbreviation': 'Kits-Open-Trade'
            },
            {
                'value': '6',
                'abbreviation': 'Kats-RMG'
            },
            {
                'value': '7',
                'abbreviation': 'FED-Sale-Tax'
            }
        ];
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________

    }

    ngOnInit() {
        this.clearFields();
        this.addFromValidations();
    }

    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }

        this.isSubmitted = false;
        // if(!AppUtility.isEmpty(this.fileInput_)){
        //     this.fileInput_.value = '';
        //  }
    }

    public btnUpload(model: any, isValid: boolean) {
        this.isSubmitted = true;
        this.oExportFile.participantId = AppConstants.participantId;
        this.oExportFile.transactionType = model.exportType;
        this.oExportFile.date = this.transDate;
        this.appState.showLoader = true;
        if (isValid) {
            AppUtility.printConsole('btnUpload called: ' + JSON.stringify(this.oExportFile));

            this.appState.showLoader = true;
            if (model.exportType == '0') {
                this.exportClients(this.oExportFile);
                this.exportClientswithBalance(this.oExportFile);
                this.exportAgentsList(this.oExportFile);
                this.exportCDC(this.oExportFile);
                this.exportTransaction(this.oExportFile);
                this.exportKats(this.oExportFile);
                this.exportFed(this.oExportFile);

            } else if (model.exportType == '1') {
                this.exportClients(this.oExportFile);
            } else if (model.exportType == '2') {
                this.exportClientswithBalance(this.oExportFile);
            } else if (model.exportType == '3') {
                this.exportAgentsList(this.oExportFile);
            } else if (model.exportType == '4') {
                this.exportCDC(this.oExportFile);
            } else if (model.exportType == '5') {
                this.exportTransaction(this.oExportFile);
            } else if (model.exportType == '6') {
                this.exportKats(this.oExportFile);
            } else if (model.exportType == '7') {
                this.exportFed(this.oExportFile);
            }
        }
    }

    UpdateRecords(oExport_: Migrator, fileName_: String) {
        AppUtility.printConsole('in UpdateRecords');
        this.dialogCmp.statusMsg = oExport_.serverResponse;
        this.dialogCmp.showAlartDialog('Notification');
        this.onDownloadDocumentAction(oExport_.responseFileBase64, fileName_);
    }


    public onDownloadDocumentAction(filecontent_: string, fileName_: String) {
        AppUtility.printConsole('file: ' + filecontent_);
        let base64Data = filecontent_;
        let contentType = 'application/vnd.text';
        let fileName = fileName_ + '.txt';
        downloadAPI(base64Data, fileName, contentType);
    }

    UpdateRecordsCsv(oExport_: Migrator, fileName_: String) {
        AppUtility.printConsole('in UpdateRecords');
        this.dialogCmp.statusMsg = oExport_.serverResponse;
        this.dialogCmp.showAlartDialog('Notification');
        this.onDownloadDocumentActionCsv(oExport_.responseFileBase64, fileName_);
    }


    public onDownloadDocumentActionCsv(filecontent_: string, fileName_: String) {
        AppUtility.printConsole('file: ' + filecontent_);
        let base64Data = filecontent_;
        let contentType = 'application/vnd.csv';
        let fileName = fileName_ + '.csv';
        downloadAPI(base64Data, fileName, contentType);
    }


    private addFromValidations() {
        this.myForm = this._fb.group({
            exportType: ['', Validators.compose([Validators.required])],
            transDate: ['']
        });
    }

    public hideModal() {
        jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
    }

    public getNotification(btnClicked) {
        if (btnClicked == 'Success')
            this.hideModal();
    }

    public exportClients(oExportFile: Migrator) {

        this.listingService.exportClients(this.oExportFile).subscribe(
            data => {
                this.appState.showLoader = false;
                AppUtility.printConsole('received data: ' + JSON.stringify(data));
                this.UpdateRecords(data, "Kits-One-Client-List");
            },
            err => {
                this.appState.showLoader = false;
                this.clearFields();
                this.errorMessage = err;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
            });
    }


    public exportClientswithBalance(oExportFile: Migrator) {

        this.listingService.exportClientswithBalance(this.oExportFile).subscribe(
            data => {
                this.appState.showLoader = false;
                AppUtility.printConsole('received data: ' + JSON.stringify(data));
                this.UpdateRecords(data, "Kits-Client-Information");
            },
            err => {
                this.appState.showLoader = false;
                this.clearFields();
                this.errorMessage = err;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
            });
    }

    public exportAgentsList(oExportFile: Migrator) {

        this.listingService.exportAgentList(this.oExportFile).subscribe(
            data => {
                this.appState.showLoader = false;
                AppUtility.printConsole('received data: ' + JSON.stringify(data));
                this.UpdateRecords(data, "Kits-Agent-information");
            },
            err => {
                this.appState.showLoader = false;
                this.clearFields();
                this.errorMessage = err;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
            });
    }
    public exportCDC(oExportFile: Migrator) {

        this.listingService.exportCDC(this.oExportFile).subscribe(
            data => {
                this.appState.showLoader = false;
                AppUtility.printConsole('received data: ' + JSON.stringify(data));
                this.UpdateRecords(data, "Kits-Cdc-Client-Holding");
            },
            err => {
                this.appState.showLoader = false;
                this.clearFields();
                this.errorMessage = err;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
            });
    }
    public exportTransaction(oExportFile: Migrator) {

        this.listingService.exportTransactions(this.oExportFile).subscribe(
            data => {
                this.appState.showLoader = false;
                AppUtility.printConsole('received data: ' + JSON.stringify(data));
                this.UpdateRecords(data, "Kits-Open-Trade");
            },
            err => {
                this.appState.showLoader = false;
                this.clearFields();
                this.errorMessage = err;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
            });
    }
    public exportKats(oExportFile: Migrator) {

        this.listingService.exportKats(this.oExportFile).subscribe(
            data => {
                this.appState.showLoader = false;
                AppUtility.printConsole('received data: ' + JSON.stringify(data));
                this.UpdateRecordsCsv(data, "Kats-RMG");
            },
            err => {
                this.appState.showLoader = false;
                this.clearFields();
                this.errorMessage = err;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
            });
    }

    public exportFed(oExportFile: Migrator) {

        this.listingService.exportFed(this.oExportFile).subscribe(
            data => {
                this.appState.showLoader = false;
                AppUtility.printConsole('received data: ' + JSON.stringify(data));
                this.UpdateRecordsCsv(data, "FED-Sale-Tax");
            },
            err => {
                this.appState.showLoader = false;
                this.clearFields();
                this.errorMessage = err;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
            });
    }
}
