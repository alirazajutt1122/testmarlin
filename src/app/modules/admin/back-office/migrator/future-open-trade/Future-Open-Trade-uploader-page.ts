'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Migrator } from 'app/models/migrator';
import { TraansactionType } from 'app/models/traansaction-type';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { DialogCmp } from '../../user-site/dialog/dialog.component';

declare var jQuery: any;
let downloadAPI = require('./../../../../../scripts/download-document');

@Component({
    selector: 'future-open-trade-uploader-page',
    templateUrl: './future-open-trade-uploader-page.html',
})

export class FutureOpenTradeUploaderPage implements OnInit {
    public myForm: FormGroup;
    errorMessage: string;
    //claims: any;
    public oFutOpenTrade: Migrator;
    public debit: boolean = true;
    public loaded_records: number = 0;
    public error_records: number = 0;
    public fileSizeExceed = false;
    public IsFileAttached: boolean = false;
    public file_srcs: string[] = [];
    public fileName_: string = '';
    public fileContentType_: string = '';
    public traansactionCode: string = 'FUT';
    public fileInput_: any;
    public isSubmitted: boolean;
    public traansactionTypeList: any[] = [];
    public transDate: Date = new Date();



    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    lang: any;

    constructor(private appState: AppState, private changeDetectorRef: ChangeDetectorRef, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService,private loader : FuseLoaderScreenService) {
        //this.claims = authService.claims;
        this.oFutOpenTrade = new Migrator();
        this.isSubmitted = false;
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________


    }

    ngOnInit() {
        this.clearFields();
        this.addFromValidations();
        this.loadTraansactionTypes();
    }

    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }
        this.loaded_records = 0;
        this.error_records = 0;
        this.fileSizeExceed = false;
        this.IsFileAttached = false;
        this.file_srcs = [];
        this.fileName_ = '';
        this.fileContentType_ = '';
        this.isSubmitted = false;
        // if(!AppUtility.isEmpty(this.fileInput_)){
        //     this.fileInput_.value = '';
        //  }
    }

    public btnUpload(model: any, isValid: boolean) {
        this.isSubmitted = true;
        if (isValid) {
            if (this.file_srcs.length === 0) {
                this.IsFileAttached = true;
                this.loaded_records = this.error_records = 0;
                this.file_srcs = [];
                this.fileName_ = '';
                this.fileContentType_ = '';
                return;
            }
            this.oFutOpenTrade.participantId = AppConstants.participantId;
            this.oFutOpenTrade.transactionType = model.transactionType;
            this.oFutOpenTrade.requestFileBase64 = this.file_srcs[0];
            this.oFutOpenTrade.date = this.transDate;
            this.appState.showLoader = true;

            AppUtility.printConsole('btnUpload called: ' + JSON.stringify(this.oFutOpenTrade));
            this.listingService.uploadFutOpenTrade(this.oFutOpenTrade).subscribe(
                data => {
                    this.appState.showLoader = false;

                    AppUtility.printConsole('received data: ' + JSON.stringify(data));
                    this.UpdateRecords(data);
                    this.file_srcs = [];
                    if (!AppUtility.isEmpty(this.fileInput_)) {
                        this.fileInput_.value = '';
                    }
                },
                err => {
                    this.appState.showLoader = false;

                    this.clearFields();
                    this.errorMessage = err;
                    this.file_srcs = [];
                    if (!AppUtility.isEmpty(this.fileInput_)) {
                        this.fileInput_.value = '';
                    }
                    this.dialogCmp.statusMsg = this.errorMessage;
                    this.dialogCmp.showAlartDialog('Error');
                });
        }
    }

    UpdateRecords(oTrans_: Migrator) {
        AppUtility.printConsole('in UpdateRecords');
        this.error_records = oTrans_.errorRecords;
        this.loaded_records = oTrans_.loadedRecords;
        this.dialogCmp.statusMsg = oTrans_.serverResponse;
        this.dialogCmp.showAlartDialog('Notification');
        if (this.error_records > 0) {
            this.onDownloadDocumentAction(oTrans_.responseFileBase64);
        }
    }

    public onDownloadDocumentAction(filecontent_: string) {
        AppUtility.printConsole('file: ' + filecontent_);
        let base64Data = filecontent_;
        let contentType = 'application/vnd.text';
        let fileName = 'Fut_Open_Trade_Error.csv';
        downloadAPI(base64Data, fileName, contentType);
    }

    fileChangeEvent(input) {
        AppUtility.printConsole('fileChangeEvent called');
        this.clearFields();
        this.file_srcs = [];
        if (!AppUtility.isEmpty(input.files[0])) {
            //  50 mb file size
            if (input.files[0].size > 50000000) {
                this.fileSizeExceed = true;
                return;
            } else {
                this.fileSizeExceed = false;
                this.fileContentType_ = input.files[0].type;
            }
        } else {
            this.file_srcs = [];
            return;
        }

        let fullPath = input.value;
        if (fullPath) {
            let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            let filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
            this.fileName_ = filename;
        }

        this.readFiles(input.files);
        this.fileInput_ = input;
    }

    readFiles(files, index = 0) {
        AppUtility.printConsole('readFiles called');
        // Create the file reader
        let reader = new FileReader();
        // If there is a file
        if (index in files) {
            // Start reading this file
            this.readFile(files[index], reader, (result) => {
                // After the callback fires do:
                this.file_srcs = [];
                // this.selectedItem.documentContent = result;
                this.file_srcs.push(result);
                this.readFiles(files, index + 1); // Read the next file;
            });
        } else {
            // When all files are done This forces a change detection
            this.changeDetectorRef.detectChanges();
        }
    }

    readFile(file, reader, callback) {
        AppUtility.printConsole('readFile called');
        // Set a callback funtion to fire after the file is fully loaded
        reader.onload = () => {
            // callback with the results
            callback(reader.result);
        };
        // Read the file
        reader.readAsDataURL(file);
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            fileUpload: [''],
            transactionType: ['', Validators.compose([Validators.required])],
            transDate: ['', Validators.compose([Validators.required])]
        });
    }

    public hideModal() {
        jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
    }

    public getNotification(btnClicked) {
        if (btnClicked == 'Success')
            this.hideModal();
    }
    public loadTraansactionTypes() {
        this.traansactionTypeList = [];
        this.listingService.getTraansactionList(this.traansactionCode)
            .subscribe(
                restData => {
                    if (!AppUtility.isEmptyArray(restData)) {
                        this.traansactionTypeList = restData;
                        let cs: TraansactionType = new TraansactionType();
                        cs.traansactionTypeId = AppConstants.PLEASE_SELECT_VAL;
                        cs.code = AppConstants.PLEASE_SELECT_STR;
                        this.traansactionTypeList.unshift(cs);
                    }
                },
                error => {
                    this.errorMessage = <any>error;;
                });
    }

}
