import { Component, OnInit, ViewEncapsulation, ViewChild, Injector, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Params, ReportParams } from 'app/models/report-params';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { AppState } from 'app/app.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';

import { AppConstants, AppUtility } from 'app/app.utility';
import { Migrator } from 'app/models/migrator';
import { AuthService2 } from 'app/services/auth2.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';


declare var jQuery: any;
var downloadAPI = require('./../../../../../../scripts/download-document');

@Component({
    selector: 'voucher-rpt',
    templateUrl: './voucher-rpt.html',
    encapsulation: ViewEncapsulation.None,
})

export class VoucherRpt implements OnInit {
    //private showLoader: boolean = false;


    lang: any;
    pdfSrc: String
    pdf = false
    fileNameForDownload = "VoucherRpt.pdf"



    public isSubmitted: boolean;
    public myForm: FormGroup;
    voucherTypeList: any[];
    reportParams: ReportParams;
    selectedItem: Params;
    errorMessage: string;
    dateComparison: boolean = true;
    vouchertype: boolean = true;
    email: boolean = false;
    sms: boolean = false;
    vouNo: Number = 0;

    @ViewChild('vouchertypeid') vouchertypeid: wjcInput.MultiSelect;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;

    constructor(private appState: AppState, private listingService: ListingService, private reportService: ReportService, private _fb: FormBuilder, private userService: AuthService2 , private translate: TranslateService,private loader : FuseLoaderScreenService) {
        this.clearFields();
        this.reportParams = new ReportParams();
        this.dateComparison = true;
        this.vouchertype = true;

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang);
    }

    ngOnInit() {
        this.populateVoucherTypeList();
        // Add Form Validations
        this.addFromValidations();

    }

    public clearFields() {
        this.selectedItem = new Params();
        this.selectedItem.PARTICIPANT_ID = AppConstants.participantId;
        this.selectedItem.START_DATE = new Date();
        this.selectedItem.END_DATE = new Date();
        this.selectedItem.IDS = null;
        this.selectedItem.NAMES = null;
        this.selectedItem.VOUCHER_NO = null;
        this.dateComparison = true;
        this.vouchertype = true;
        this.email = false;
        this.sms = false;
    }

    printReport(model: any, isValid: boolean) {
      console.log(model , this.vouchertypeid.checkedItems.length);
        this.isSubmitted = true;
        if (this.selectedItem.START_DATE > this.selectedItem.END_DATE) {
            this.dateComparison = false;
            return;
        }
        else {
            this.dateComparison = true;
            if (this.vouchertypeid.checkedItems.length > 0) {
                this.vouchertype = true;
                  isValid = true;
                if (isValid) {
                    //this.showLoader = true;
                    let params = new Params();
                    params.PARTICIPANT_ID = AppConstants.participantId;
                    params.START_DATE = this.selectedItem.START_DATE;
                    params.END_DATE = this.selectedItem.END_DATE;
                    this.selectedVoucherTypes();
                    params.IDS = this.selectedItem.IDS;
                    params.NAMES = this.selectedItem.NAMES;

                    if (this.selectedItem.VOUCHER_NO == 0)
                        params.VOUCHER_NO = null
                    else
                        params.VOUCHER_NO = this.selectedItem.VOUCHER_NO;

                    this.reportParams.setParams(params);
                    if (this.email)
                        this.getVouchersForPrinting(this.reportParams);
                    else if (this.sms) {
                        if (this.selectedItem.VOUCHER_NO == 0 || this.selectedItem.VOUCHER_NO == null)
                            this.vouNo = 0
                        else
                            this.vouNo = this.selectedItem.VOUCHER_NO;
                        this.getVouchersForSMS(params.PARTICIPANT_ID, params.IDS.toString(), this.vouNo, params.START_DATE, params.END_DATE);
                    }
                    else
                        this.getVouchersWithOutEmail(this.reportParams);
                }
            }
            else
                this.vouchertype = false;
        }
    }

    public getVouchersWithOutEmail(params) {
       this.loader.show()
        this.reportService.getVouchers(params,this.lang)
            .subscribe(
                restData => {
                   this.loader.hide();
                    var reportData: any;
                    reportData = restData;
                    AppUtility.printConsole(reportData);
                    //var w = window.open(reportData.reportBase64/*,"_self"*/);
                    // downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
                    this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,', '');
                    if (this.pdfSrc != "") {
                        this.pdf = true
                    }
                },
                error => {
                   this.loader.hide();
                    this.dialogCmp.statusMsg = error.message;
                    this.dialogCmp.showAlartDialog('Error');
                });
    }

    public getVouchersForPrinting(params) {
       this.loader.show();
        this.reportService.getVouchersForBanks(params,this.lang)
            .subscribe(
                restData => {
                   this.loader.hide();
                    var reportData: any;
                    reportData = restData;
                    AppUtility.printConsole(reportData);
                    //var w = window.open(reportData.reportBase64/*,"_self"*/);
                    // downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
                    
                    this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,', '');
                    if (this.pdfSrc != "") {
                    this.pdf = true
                    }
                    
                },
                error => {
                   this.loader.hide();
                    this.dialogCmp.statusMsg = error.message;
                    this.dialogCmp.showAlartDialog('Error');
                });
    }

    public getVouchersForSMS(participantId, voucherTypeIds, vouNo, startDate, endDate) {
       this.loader.show()
        startDate = wjcCore.Globalize.format(startDate, AppConstants.DATE_FORMAT);
        endDate = wjcCore.Globalize.format(endDate, AppConstants.DATE_FORMAT);
       this.loader.show()
        this.reportService.getVouchersForSMS(participantId, voucherTypeIds, vouNo, startDate, endDate)
            .subscribe(
                restData => {
                   this.loader.hide();
                    var reportData: any;
                    reportData = restData;
                    // var w = window.open(reportData.reportBase64/*,"_self"*/);
                    this.UpdateRecords(reportData, "SMSLOG.txt");
                },
                error => {
                   this.loader.hide();
                    this.dialogCmp.statusMsg = error.message;
                    this.dialogCmp.showAlartDialog('Error');
                    //  alert(error);
                });
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
        let fileName = fileName_;
        downloadAPI(base64Data, fileName, contentType);
    }

    public onPrintVoucher(model: any, isValid: boolean) {
        this.isSubmitted = true;
        if (this.selectedItem.START_DATE > this.selectedItem.END_DATE) {
            this.dateComparison = false;
            return;
        }
        else {
            this.dateComparison = true;
            if (this.vouchertypeid.checkedItems.length > 0) {
                this.vouchertype = true;
                if (isValid) {
                   // this.showLoader = true;
                    let params = new Params();
                    params.PARTICIPANT_ID = AppConstants.participantId;
                    params.START_DATE = this.selectedItem.START_DATE;
                    params.END_DATE = this.selectedItem.END_DATE;
                    this.selectedVoucherTypes();
                    params.IDS = this.selectedItem.IDS;
                    params.NAMES = this.selectedItem.NAMES;

                    if (this.selectedItem.VOUCHER_NO == 0)
                        params.VOUCHER_NO = null
                    else
                        params.VOUCHER_NO = this.selectedItem.VOUCHER_NO;

                    /*for (let selectedVoucherType of this.vouchertypeid.checkedItems) {
                        if(selectedVoucherType.typeDesc==)

                    }*/

                    this.reportParams.setParams(params);
                    this.reportService.getVouchersForBanks(this.reportParams,this.lang)
                        .subscribe(
                            restData => {
                               this.loader.hide();
                                var reportData: any;
                                reportData = restData;
                                AppUtility.printConsole(reportData);
                                //var w = window.open(reportData.reportBase64/*,"_self"*/);
                                // downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
                                this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,', '');
                                if (this.pdfSrc != "") {
                                this.pdf = true
                                }
                            },
                            error => {
                               this.loader.hide();
                                this.dialogCmp.statusMsg = error.message;
                                this.dialogCmp.showAlartDialog('Error');
                            });
                }
            }
            else
                this.vouchertype = false;
        }
    }

    private selectedVoucherTypes() {

        var items: Number[] = [];
        var items_Name: String[] = [];
        for (let selectedVoucherType of this.vouchertypeid.checkedItems) {
            items.push(selectedVoucherType.voucherTypeId);
            items_Name.push(selectedVoucherType.typeDesc);
        }
        this.selectedItem.IDS = items;
        this.selectedItem.NAMES = items_Name;
    }
    private populateVoucherTypeList() {
        this.listingService.getVoucherTypeList(AppConstants.participantId)
            .subscribe(
                restData => {
                    this.voucherTypeList = restData;
                },
                error => this.errorMessage = <any>error.message);
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            VOUCHER_TYPES: ['', Validators.compose([Validators.required])],
            START_DATE: ['', Validators.compose([Validators.required])],
            END_DATE: ['', Validators.compose([Validators.required])],
            VOUCHER_NO: [''],
            email: [''],
            sms: [''],
        });
    }

    public hideModal() {
        jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
    }

    public getNotification(btnClicked) {

    }
}

