'use strict';
import { Component, OnInit, AfterViewInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { voucherDetail } from 'app/models/voucher-detail';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { ChartOfAccount } from 'app/models/chart-of-account';
import { VoucherMaster } from 'app/models/voucher-master';
import { VoucherType } from 'app/models/voucher-type';
import { Participant } from 'app/models/participant';
import { SettlementCalendar } from 'app/models/settlement-calendar';
import { GLParams } from 'app/models/gl-params';
import { BasicInfo } from 'app/models/basic-info';
import { DatePipe } from '@angular/common';
 
 

var Decimal = require('../../../../../../../decimal.js/decimal.min');

declare var jQuery: any;
@Component({
    selector: 'voucher-page',
    templateUrl: './voucher-page.html',
})

export class VoucherPage implements OnInit {

    private static searchButtonDisabled: String = 'btn btn-success btn-sm disabled';
    private static searchButtonEnabled: String = 'btn btn-success btn-sm';

    public myForm: FormGroup;

    @Input() isDashBoard: string;

    itemsList: wjcCore.CollectionView;        // A list which will bind to the flex grid of Page.
    voucherDetailList: wjcCore.CollectionView;   // A list which will bind to the flex grid of Modal.
    selectedItem: voucherDetail;  // The Master Item
    selectedDetailItem: voucherDetail;    // The Detail Item
    chartOfAccountList: any[];
    selectedChartOfAccountList: any[];
    selectedIndex: number = 0;

    errorMessage: string;

    voucherStatusList: any[];
    transactionTypeList: any[];
    paymentTypeList: any[];
    voucherTypeList: any[];
    fiscalYearList: any[];

    today: Date;
    minDate: Date;
    public hideForm = false;
    public isSubmitted: boolean;
    public isEditing: boolean;
    public isDeleting: boolean;
    public isParentDisabled: boolean;
    public isDetailEditing: boolean;
    public recExist: boolean;
    private fiscalYearExist = true;
    private serielNo: number = 0;
    public vouStatus: string;
    private isInvalidcode = false;
    public isBtnDisabled = false;
    private vouMasterId: Number = null;

    public searchButtonClass: String;
    public searchButtonTooltip: String;
    public addingNew: boolean;
    private backDateEntry = false;

    public disabledCheckbox: Boolean = true;

    private _selectedVoucherId: Number;
    private _selectedvouStatus: String;

    public disabled: String;

    private _pageSize = 0;
    private _pageSizecoa = 0;
    //claims: any;

    @ViewChild('flex') flex: wjcGrid.FlexGrid;
    @ViewChild('flexDetail') flexDetail: wjcGrid.FlexGrid;
    @ViewChild('coaGrid') coaGrid: wjcGrid.FlexGrid;

    @ViewChild('voucherTypeId') voucherTypeId: wjcInput.DropDown;
    @ViewChild('voucherTypeCombo') voucherTypeCombo: wjcInput.DropDown;
    @ViewChild('voucherStatus') voucherStatus: wjcInput.DropDown;
    @ViewChild('clientId') clientId: wjcInput.DropDown;

    @ViewChild('fromDate') fromDate: wjcInput.InputDate;
    @ViewChild('toDate') toDate: wjcInput.InputDate;
    @ViewChild('vouDate') vouDate: wjcInput.InputDate;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    @ViewChild('updateBtn') updateBtn: ElementRef;
    @ViewChild('saveBtn') saveBtn: ElementRef;
    @ViewChild('addbutton') addbutton: ElementRef;
    lang: string;

    public tabFocusChanged1() {
        this.addbutton.nativeElement.focus();
    }
    public tabFocusChanged() {
        if (this.isEditing)
            this.updateBtn.nativeElement.focus();
        else
            this.saveBtn.nativeElement.focus();
    }

    constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, 
        public userService: AuthService2, private translate: TranslateService, 
        private loader: FuseLoaderScreenService,  private datePipe: DatePipe) {

        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________

        switch (this.lang) {
            case "en":
                this.voucherStatusList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Post", "code": "POSTED" },
                { "name": "New", "code": "UNPOSTED" }]

                this.transactionTypeList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Debit", "code": "Debit" },
                { "name": "Credit", "code": "Credit" }]

                this.paymentTypeList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Wire Transfers (SWIFT)", "code": "1" },
                { "name": "Domestic Payments", "code": "0" }]
                break;
            case "pt":
                this.voucherStatusList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Publicar", "code": "POSTED" },
                { "name": "Nova", "code": "UNPOSTED" }]

                this.transactionTypeList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Débito", "code": "Debit" },
                { "name": "Crédito", "code": "Credit" }]

                this.paymentTypeList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Bancárias Transferências (SWIFT)", "code": "1" },
                { "name": "Domésticos Pagamentos", "code": "0" }]
                break;
            default:
                this.voucherStatusList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Post", "code": "POSTED" },
                { "name": "New", "code": "UNPOSTED" }]

                this.transactionTypeList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Debit", "code": "Debit" },
                { "name": "Credit", "code": "Credit" }]

                this.paymentTypeList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Wire Transfers (SWIFT)", "code": "1" },
                { "name": "Domestic Payments", "code": "0" }]
        }

        this.clearFields(true, true);
        this.hideForm = false;
        this.isSubmitted = false;
        this.isEditing = false;
        this.isDeleting = false;
        this.today = new Date();
        this.minDate = new Date();
        //this.claims = authService.claims;
        //  this.minDate.setDate(this.minDate.getDate() - 365);
        this.itemsList = new wjcCore.CollectionView();

    }
    ngOnInit() {

        jQuery('.parsleyjs').parsley();

        this.clearFields(true, true);

        this.populateVoucherTypeList();

        this.populateChartOfAccountList();

        this.getGlParams();

        // Add Form Validations
        this.addFormValidations();

        if (this.isDashBoard) {
            this.onSearchvoucher(null, 'UNPOSTED', new Date().setDate(new Date().getDate() - 7), new Date());
        }
    }

    // add a footer row to the grid
    public initGrid(s: wjcGrid.FlexGrid) {
        AppUtility.printConsole('initGrid called');
        // create a GroupRow to show aggregates automatically
        let row = new wjcGrid.GroupRow();
        // add the new GroupRow to the grid's 'columnFooters' panel
        s.columnFooters.rows.push(row);
        // add a sigma to the header to show that this is a summary row
        s.bottomLeftCells.setCellData(0, 0, '\u03A3');
    }

    /*********************************
   *      Public & Action Methods
   *********************************/

    public clearFields(_clearMaster: Boolean, _clearDetail: Boolean) {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }

        if (AppUtility.isValidVariable(this.itemsList)) {
            this.itemsList.cancelEdit();
            this.itemsList.cancelNew();
        }

        this.hideForm = false;
        this.isEditing = false;
        this.isDeleting = false;
        this.addingNew = true;
        this.isDetailEditing = false;

        this.searchButtonClass = VoucherPage.searchButtonDisabled;
        this.isSubmitted = false;

        if (_clearMaster)
            this.ClearMasterObject();
        if (_clearDetail)
            this.ClearDetailObject();
    }

    private ClearMasterObject() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }
        this.selectedItem = new voucherDetail();
        this.selectedItem.naration = null;
        this.selectedItem.debitCredit = 0.0001;
        this.selectedItem.debit = 0;
        this.selectedItem.credit = 0;
        this.selectedItem.transactionType = null;
        this.selectedItem.instrumentNo = null;
        this.selectedItem.voucherDetailId = null;


        this.selectedItem.chartOfAccount = new ChartOfAccount();
        this.selectedItem.chartOfAccount.chartOfAccountId = null;
        this.selectedItem.chartOfAccount.glCode = null;
        this.selectedItem.chartOfAccount.glDesc = null;

        this.disabled = 'disabled';

        this.selectedItem.voucherMaster = new VoucherMaster();
        this.selectedItem.voucherMaster.voucherMasterId = null;
        this.selectedItem.voucherMaster.chequeCleared = false;
        this.selectedItem.voucherMaster.paymentType = null;
        this.selectedItem.voucherMaster.vouDate = this.today;
        this.selectedItem.voucherMaster.vouNaration = null;
        this.selectedItem.voucherMaster.manual = true;
        this.selectedItem.voucherMaster.posted = false;
        this.selectedItem.voucherMaster.reversed = false;

        this.selectedItem.voucherMaster.voucherType = new VoucherType();

        if (!AppUtility.isEmptyArray(this.voucherTypeList)) {
            this.selectedItem.voucherMaster.voucherType.voucherTypeId = this.voucherTypeList[0].voucherTypeId;
            this.selectedItem.voucherMaster.voucherType.typeDesc = this.voucherTypeList[0].typeDesc;
        }

        if (!AppUtility.isEmptyArray(this.chartOfAccountList)) {
            this.selectedDetailItem.chartOfAccount.glCode = this.chartOfAccountList[0].code;
            this.selectedDetailItem.chartOfAccount.glDesc = this.chartOfAccountList[0].displayName;
            this.selectedDetailItem.chartOfAccount.chartOfAccountId = this.chartOfAccountList[0].id;
        }

        this.selectedItem.voucherMaster.participant = new Participant();
        this.selectedItem.voucherMaster.participant.participantId = AppConstants.participantId;

        this.selectedItem.voucherMaster.settlementCalendar = new SettlementCalendar();
        this.selectedItem.voucherMaster.settlementCalendar.settlementCalendarId = null;
    }

    private ClearDetailObject() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }
        this.selectedDetailItem = new voucherDetail();
        this.selectedDetailItem.naration = null;
        this.selectedDetailItem.debitCredit = 0.0001;
        this.selectedDetailItem.debit = 0;
        this.selectedDetailItem.credit = 0;
        // this.selectedDetailItem.transactionType = null;
        this.selectedDetailItem.instrumentNo = null;
        this.selectedDetailItem.voucherDetailId = null;

        this.selectedDetailItem.chartOfAccount = new ChartOfAccount();
        this.selectedDetailItem.chartOfAccount.chartOfAccountId = null;
        this.selectedDetailItem.chartOfAccount.glCode = 'Select';
        this.selectedDetailItem.chartOfAccount.glDesc = null;

        this.selectedDetailItem.voucherMaster = new VoucherMaster();
        this.selectedDetailItem.voucherMaster.voucherMasterId = null;
        this.selectedDetailItem.voucherMaster.chequeCleared = true;
        this.selectedDetailItem.voucherMaster.paymentType = null;
        this.selectedDetailItem.voucherMaster.manual = true;
        this.selectedDetailItem.voucherMaster.posted = false;
        this.selectedDetailItem.voucherMaster.reversed = false;

        this.selectedDetailItem.voucherMaster.vouDate = this.today;
        this.selectedDetailItem.voucherMaster.vouNaration = null;

        this.selectedDetailItem.voucherMaster.participant = new Participant();
        this.selectedDetailItem.voucherMaster.participant.participantId = AppConstants.participantId;

        this.selectedDetailItem.voucherMaster.voucherType = new VoucherType();
        this.selectedDetailItem.voucherMaster.voucherType.voucherTypeId = null;
        this.selectedDetailItem.voucherMaster.voucherType.typeDesc = null;

        this.selectedItem.voucherMaster.settlementCalendar = new SettlementCalendar();
        this.selectedItem.voucherMaster.settlementCalendar.settlementCalendarId = null;
        if (AppUtility.isValidVariable(this.myForm)) {
            (<any>this.myForm).controls.type.reset();
        }
        this.isSubmitted = false;
    }

    get pageSize(): number {
        return this._pageSize;
    }

    set pageSize(value: number) {
        if (this._pageSize != value) {
            this._pageSize = value;
            if (this.flex) {
                (<IPagedCollectionView><unknown>this.flex.collectionView).pageSize = value;
            }
        }
    }

    get pageSizecoa(): number {
        return this._pageSizecoa;
    }

    set pageSizecoa(value: number) {
        if (this._pageSizecoa != value) {
            this._pageSizecoa = value;
            if (this.flex) {
                (<IPagedCollectionView><unknown>this.coaGrid.collectionView).pageSize = value;
            }
        }
    }

    public ngAfterViewInit() {
        var self = this;

        // $('#add_new_voucher').on('shown.bs.modal', function () {
        $('#add_new_voucher').on('shown.bs.modal', function () {
            wjcGrid.FlexGrid.invalidateAll();
            self.voucherTypeCombo.focus();
        });

        this.flexDetail.invalidate();
    }

    public onCancelAction() {
        this.clearFields(true, true);
        this.flexDetail.columnFooters.setCellData(0, 4, "");
        this.hideForm = false;
    }

    public onNewAction() {
        this.clearFields(true, true);
        this.hideForm = true;
        if (AppUtility.isValidVariable(this.voucherDetailList)) {
            this.voucherDetailList = null;
            // this.onModalLoaded();
        }
        this.isParentDisabled = false;
        this.addingNew = true;
        this.flexDetail.invalidate();
        this.getFiscalYear();
    }

    public loadObject(selectedDetailItem: voucherDetail, selectedItem: voucherDetail) {
        let temp_detail = this.voucherDetailList.addNew();

        if (!this.isDetailEditing)
            temp_detail.serielNo = ++this.serielNo;
        else {
            temp_detail.serielNo = selectedDetailItem.serielNo;
            this.serielNo = selectedDetailItem.serielNo;
        }

        temp_detail.naration = selectedDetailItem.naration;
        temp_detail.instrumentNo = selectedDetailItem.instrumentNo;
        temp_detail.debitCredit = selectedDetailItem.debitCredit;

        temp_detail.transactionType = selectedDetailItem.transactionType;
        if (selectedDetailItem.transactionType == "Debit")
            temp_detail.debit = selectedDetailItem.debitCredit;
        else
            temp_detail.credit = selectedDetailItem.debitCredit;

        this.selectedChartOfAccountList = this.chartOfAccountList.filter(
            chartOfAccountList => chartOfAccountList.code === this.selectedDetailItem.chartOfAccount.glCode);

        selectedDetailItem.chartOfAccount.glDesc = this.selectedChartOfAccountList[0].displayName;
        selectedDetailItem.chartOfAccount.chartOfAccountId = this.selectedChartOfAccountList[0].id;

        temp_detail.chartOfAccount = new ChartOfAccount();
        temp_detail.chartOfAccount.glCode = selectedDetailItem.chartOfAccount.glCode;
        temp_detail.chartOfAccount.glDesc = selectedDetailItem.chartOfAccount.glDesc;
        temp_detail.chartOfAccount.chartOfAccountId = selectedDetailItem.chartOfAccount.chartOfAccountId;


        temp_detail.voucherMaster = new VoucherMaster();
        temp_detail.voucherMaster.voucherMasterId = selectedItem.voucherMaster.voucherMasterId;
        temp_detail.voucherMaster.chequeCleared = selectedItem.voucherMaster.chequeCleared;
        temp_detail.voucherMaster.vouNaration = selectedItem.voucherMaster.vouNaration;
        temp_detail.voucherMaster.paymentType = selectedItem.voucherMaster.paymentType;
        temp_detail.voucherMaster.vouDate = selectedItem.voucherMaster.vouDate;

        temp_detail.voucherMaster.voucherType = new VoucherType();
        temp_detail.voucherMaster.voucherType.voucherTypeId = selectedItem.voucherMaster.voucherType.voucherTypeId;
        temp_detail.voucherMaster.voucherType.typeDesc = selectedItem.voucherMaster.voucherType.typeDesc;

        this.voucherDetailList.commitNew();
    }

    public loadEditObject(selectedDetailItem: voucherDetail, selectedItem: voucherDetail) {
        this.selectedDetailItem = this.voucherDetailList.currentItem;
        this.voucherDetailList.editItem(this.selectedDetailItem);
        let temp_detail = this.voucherDetailList.currentItem;

        if (!this.isDetailEditing)
            temp_detail.serielNo = ++this.serielNo;
        else {
            temp_detail.serielNo = selectedDetailItem.serielNo;
            this.serielNo = selectedDetailItem.serielNo;
        }

        temp_detail.naration = selectedDetailItem.naration;
        temp_detail.instrumentNo = selectedDetailItem.instrumentNo;
        temp_detail.debitCredit = selectedDetailItem.debitCredit;

        temp_detail.transactionType = selectedDetailItem.transactionType;
        if (selectedDetailItem.transactionType == "Debit") {
            temp_detail.debit = selectedDetailItem.debitCredit;
            temp_detail.credit = 0;
        }
        else {
            temp_detail.credit = selectedDetailItem.debitCredit;
            temp_detail.debit = 0;
        }

        this.selectedChartOfAccountList = this.chartOfAccountList.filter(
            chartOfAccountList => chartOfAccountList.code === selectedDetailItem.chartOfAccount.glCode);

        selectedDetailItem.chartOfAccount.glDesc = this.selectedChartOfAccountList[0].displayName;
        selectedDetailItem.chartOfAccount.chartOfAccountId = this.selectedChartOfAccountList[0].id;


        temp_detail.chartOfAccount = new ChartOfAccount();
        temp_detail.chartOfAccount.glCode = selectedDetailItem.chartOfAccount.glCode;
        temp_detail.chartOfAccount.glDesc = selectedDetailItem.chartOfAccount.glDesc;
        temp_detail.chartOfAccount.chartOfAccountId = selectedDetailItem.chartOfAccount.chartOfAccountId;


        temp_detail.voucherMaster = new VoucherMaster();
        temp_detail.voucherMaster.voucherMasterId = selectedItem.voucherMaster.voucherMasterId;
        temp_detail.voucherMaster.chequeCleared = selectedItem.voucherMaster.chequeCleared;
        temp_detail.voucherMaster.paymentType = selectedItem.voucherMaster.paymentType;
        temp_detail.voucherMaster.vouNaration = selectedItem.voucherMaster.vouNaration;
        temp_detail.voucherMaster.vouDate = selectedItem.voucherMaster.vouDate;

        temp_detail.voucherMaster.voucherType = new VoucherType();
        temp_detail.voucherMaster.voucherType.voucherTypeId = selectedItem.voucherMaster.voucherType.voucherTypeId;
        temp_detail.voucherMaster.voucherType.typeDesc = selectedItem.voucherMaster.voucherType.typeDesc;

        this.voucherDetailList.commitEdit();
    }

    public onAddNewRow() {
        this.isSubmitted = true;
        if (this.fiscalYearExist) {
            if (!this.isInvalidcode) {
                if (!this.isDetailEditing) {
                    if (AppUtility.isValidVariable(this.voucherDetailList) && this.voucherDetailList.items.length && this.myForm.valid) {
                        if (this.isUnique(false)) {
                            this.serielNo = this.voucherDetailList.items[this.voucherDetailList.itemCount - 1].serielNo;
                            this.loadObject(this.selectedDetailItem, this.selectedItem);
                            this.ClearDetailObject();
                            this.flexDetail.columnFooters.setCellData(0, 4, "");
                            let difference = new Decimal(this.flexDetail.columnFooters.getCellData(0, 2, false) - this.flexDetail.columnFooters.getCellData(0, 3, false));
                            this.flexDetail.columnFooters.setCellData(0, 4, "Diff. = " + difference.toFixed(4));
                        }
                        else {
                            this.dialogCmp.statusMsg = 'Account already exist.';
                            this.dialogCmp.showAlartDialog('Error');
                        }
                    }
                    else {
                        // it is the 1st ever element to be added in the list.
                        if (this.myForm.valid) {
                            this.voucherDetailList = new wjcCore.CollectionView();
                            this.loadObject(this.selectedDetailItem, this.selectedItem);
                            this.ClearDetailObject();
                            this.flexDetail.columnFooters.setCellData(0, 4, "");
                        }
                        else console.log('invalid value');
                    }
                }
                else {
                    // this part will be executed in case of editing the detail records in Modal.
                    if (this.myForm.valid) {
                        if (this.isUnique(true)) {
                            this.loadEditObject(this.selectedDetailItem, this.selectedItem);
                            this.ClearDetailObject();
                            this.flexDetail.columnFooters.setCellData(0, 4, "");
                            let difference = new Decimal(this.flexDetail.columnFooters.getCellData(0, 2, false) - this.flexDetail.columnFooters.getCellData(0, 3, false));
                            this.flexDetail.columnFooters.setCellData(0, 4, "Diff. = " + difference.toFixed(4));
                        }
                        else {
                            this.dialogCmp.statusMsg = 'Account already exist.';
                            this.dialogCmp.showAlartDialog('Error');
                        }

                        this.voucherDetailList.refresh();
                        this.flexDetail.refresh();
                        this.isDetailEditing = false;
                    }
                }
            }
            else {
                this.dialogCmp.statusMsg = 'Invalid Code.';
                this.dialogCmp.showAlartDialog('Warning');
            }
        }

        else {
            this.dialogCmp.statusMsg = 'Voucher date must be between current fiscal year.';
            this.dialogCmp.showAlartDialog('Warning');
        }
    }

    private isUnique(isEdit: boolean): boolean {
        let glCodeExist: boolean = true;
        if (AppUtility.isValidVariable(this.voucherDetailList)) {
            if (isEdit) {
                if (this.selectedDetailItem.chartOfAccount.glCode == this.voucherDetailList.currentItem.chartOfAccount.glCode)
                    return glCodeExist = true;
            }

            for (let i = 0; i < this.voucherDetailList.items.length; i++) {

                if (this.selectedDetailItem.chartOfAccount.glCode ==
                    this.voucherDetailList.items[i].chartOfAccount.glCode) {
                    glCodeExist = false;
                }
            }
        }

        return glCodeExist;
    }

    public onEditAction() {
        this.clearFields(true, true);
        this.selectedIndex = this.flex.selection.row;
        this.selectedItem.voucherMaster = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
        if (!AppUtility.isEmpty(this.selectedItem)) {
            // this.clearFields(true, true);
            this.hideForm = true;
            this.isEditing = true;
            this.addingNew = false;
            // this.selectedItem.voucherMaster = this.itemsList.currentItem;
            this.getVoucherDetail(this.selectedItem.voucherMaster.voucherMasterId);
            this.itemsList.editItem(this.selectedItem);
            this.flexDetail.columnFooters.setCellData(0, 4, "Diff. = 0");
        }
        this.addingNew = false;
        // this.onModalLoaded();
        this.flexDetail.refresh();
    }

    public onDeleteAction() {
        this.isDeleting = true;
        //     this.selectedIndex = this.flex.selection.row;
        //     if (AppUtility.isValidVariable(this.selectedIndex)){
        //     //  this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
        //       this.vouMasterId =this.itemsList.currentItem.
        //     }
        //     else{
        //         this.vouMasterId=null;
        //         return;
        //     }
        //    // this.oAMTemp = new AnnouncementModel();
        //    // this.oAMTemp = this.selectedItem;

        this.dialogCmp.statusMsg = AppConstants.MSG_CONFIRM_RECORD_DELETION;
        this.dialogCmp.showAlartDialog('Confirmation');
    }

    public onEditDetailAction() {
        this.isDetailEditing = true;
        this.selectedDetailItem = (JSON.parse(JSON.stringify(this.voucherDetailList.currentItem)));
    }

    public onEditDetailDelete() {
        if (this.voucherDetailList.items.length > 1) {
            this.deleteCurrentItem();
            if (this.voucherDetailList.items.length > 1) {
                let difference = new Decimal(this.flexDetail.columnFooters.getCellData(0, 2, false) - this.flexDetail.columnFooters.getCellData(0, 3, false));
                this.flexDetail.columnFooters.setCellData(0, 4, "Diff. = " + difference.toFixed(4));
            }
            else
                this.flexDetail.columnFooters.setCellData(0, 4, "");
        }
        else {
            this.dialogCmp.statusMsg = 'At least 1 item is required in Voucher Detail.';
            this.dialogCmp.showAlartDialog('Warning');
        }
    }

    public deleteCurrentItem() {
        this.voucherDetailList.remove(this.voucherDetailList.currentItem);
        for (let i = 0; i < this.voucherDetailList.items.length; i++) {
            this.voucherDetailList.items[i].serielNo = i + 1;
            this.serielNo = i + 1;
        }
    }

    public onSaveAction(model: any, isValid: boolean) {
        if (!AppUtility.isEmpty(this.selectedItem.voucherMaster.vouNaration) && !AppUtility.isEmpty(this.selectedItem.voucherMaster.voucherType.voucherTypeId) && !AppUtility.isEmpty(this.selectedItem.voucherMaster.paymentType)) {
            if (this.flexDetail.columnFooters.getCellData(0, 2, true) == this.flexDetail.columnFooters.getCellData(0, 3, true)) {
                if (this.fiscalYearExist) {
                    //  if (!this.isUnique()) {
                    if (this.isEditing) {
                        if (AppUtility.isValidVariable(this.voucherDetailList)) {
                            let tempArray: voucherDetail[] = [];
                            for (let i = 0; i < this.voucherDetailList.items.length; i++) {
                                tempArray[i] = new voucherDetail();
                                this.voucherDetailList.items[i].voucherMaster = (JSON.parse(JSON.stringify(this.selectedItem.voucherMaster)));
                                tempArray[i] = this.voucherDetailList.items[i];
                            }
                            this.listingService.updateVoucher(tempArray).subscribe(
                                data => {
                                    console.log(this.itemsList.items[this.selectedIndex]);
                                    this.itemsList.items[this.selectedIndex].vouNaration = data.vouNaration;
                                    this.itemsList.items[this.selectedIndex].chequeCleared = data.chequeCleared;
                                    this.itemsList.items[this.selectedIndex].paymentType = data.paymentType;
                                    this.itemsList.commitEdit();
                                    this.voucherDetailList.commitEdit();
                                    // this.clearFields(true, true);
                                    // console.log('value cleared.')
                                    console.log(this.selectedItem);
                                    // this.voucherDetailList = tempArray;
                                    for (let i = 0; i < this.voucherDetailList.items.length; i++) {
                                        console.log(this.voucherDetailList.items[i]);
                                    }
                                    this.voucherDetailList.refresh();


                                    this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                                    this.dialogCmp.showAlartDialog('Success');
                                    // this.itemsList.editItem(this.selectedItem);
                                    if (AppUtility.isValidVariable(this.itemsList))
                                        this.itemsList.refresh();

                                    this.serielNo = 0;
                                    this.flex.refresh();
                                },
                                err => {
                                  
                                    if(err.message){
                                        this.errorMessage = err.message;
                                    }
                                    else {
                                        this.errorMessage = err;
                                    }
                                    this.hideForm = true;
                                    this.dialogCmp.statusMsg = this.errorMessage;
                                    this.dialogCmp.showAlartDialog('Error');
                                }
                            );
                        }
                        else {

                        }
                    }
                    else {
                        if (AppUtility.isValidVariable(this.voucherDetailList)) {
                            let tempArray: voucherDetail[] = [];
                            for (let i = 0; i < this.voucherDetailList.items.length; i++) {
                                tempArray[i] = new voucherDetail();
                                this.voucherDetailList.items[i].voucherMaster = this.selectedItem.voucherMaster;
                                tempArray[i] = this.voucherDetailList.items[i];
                            }
                            
                            debugger
                            //  tempArray.forEach(element => {
                            //     let a = (element.voucherMaster.vouDate).toLocaleDateString();
                            //     element.voucherMaster.vouDate = new Date(a);
                            //  })

                            this.listingService.saveVoucher(tempArray).subscribe(   
                                data => {
                                    // this.clearFields(true, true);
                                    if (AppUtility.isEmpty(this.itemsList))
                                        this.itemsList = new wjcCore.CollectionView;
                                    if (AppUtility.isEmpty(this.voucherDetailList))
                                        this.voucherDetailList = new wjcCore.CollectionView;
                                    this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
                                    this.dialogCmp.showAlartDialog('Success');

                                    if (AppUtility.isValidVariable(this.itemsList))
                                        this.itemsList.refresh();

                                    this.serielNo = 0;
                                    this.flex.refresh();
                                    this.onSearchvoucher(null, 'UNPOSTED', this.vouDate.value, this.vouDate.value);
                                    this.voucherStatus.text = 'New';
                                },
                                err => {
                                    this.hideForm = true;
                                    if(err.message){
                                        this.errorMessage = err.message;
                                    }
                                    else {
                                        this.errorMessage = err;
                                    }
                                    this.dialogCmp.statusMsg = this.errorMessage;
                                    this.dialogCmp.showAlartDialog('Error');
                                }
                            );
                        }
                        else {
                            this.dialogCmp.statusMsg = 'At least 1 item is required in Voucher detail.';
                            this.dialogCmp.showAlartDialog('Warning');
                            //this.clearFields(false, true);
                        }
                    }
                    // }
                }
                else {
                    this.dialogCmp.statusMsg = 'Voucher date must be between current fiscal year.';
                    this.dialogCmp.showAlartDialog('Warning');
                }
            }
            else {
                this.dialogCmp.statusMsg = 'Debit and credit must be equal.';
                this.dialogCmp.showAlartDialog('Warning');
            }
        }
        else {
            this.dialogCmp.statusMsg = 'At least 1 item is required in Voucher detail.';
            this.dialogCmp.showAlartDialog('Warning');
            if (isValid) {
                let b1: boolean = this.addingNew;
                let b2: boolean = this.isEditing;
                if (!this.isDetailEditing)
                    this.clearFields(false, true);
                this.addingNew = b1;
                this.isEditing = b2;
            }
        }
    }
    /***************************************
   *          Private Methods
   **************************************/

    /**
     * Getting the child detail records for the selected master.
     */
    private getVoucherDetail(_voucherMasterId: Number) {
        this.listingService.getvoucherDetailList(_voucherMasterId)
            .subscribe(
                restData => {
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                    } else {
                        this.voucherDetailList = new wjcCore.CollectionView(restData);
                        if (this.voucherDetailList.items[0]) {
                            this.selectedItem.voucherMaster.chequeCleared = this.voucherDetailList.items[0].voucherMaster.chequeCleared;
                            this.selectedItem.voucherMaster.vouNaration = this.voucherDetailList.items[0].voucherMaster.vouNaration;
                            this.selectedItem.voucherMaster.paymentType = this.voucherDetailList.items[0].voucherMaster.paymentType;
                        }
                    }
                },
                err => {
                    if(err.message){
                        this.errorMessage = err.message;
                    }
                    else {
                        this.errorMessage = err;
                    }
                });
    }

    private populateVoucherTypeList() {
        this.loader.show();
        this.listingService.getVoucherTypeList(AppConstants.participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.voucherTypeList = restData;
                    var vt: VoucherType = new VoucherType();
                    vt.voucherTypeId = AppConstants.PLEASE_SELECT_VAL;
                    vt.typeDesc = AppConstants.PLEASE_SELECT_STR;
                    this.voucherTypeList.unshift(vt);
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    public onSearchvoucher(voucherTypeId, voucherStatus, fromDate, ToDate): void {
        if (AppUtility.isEmpty(voucherStatus)) {
            this.dialogCmp.statusMsg = 'Please select voucher status.';
            this.dialogCmp.showAlartDialog('Warning');

            this.itemsList = new wjcCore.CollectionView();
            this.flex.refresh();
        }
        else if (fromDate > ToDate) {
            this.dialogCmp.statusMsg = 'From Date should be less or equal than To Date.';
            this.dialogCmp.showAlartDialog('Warning');

            this.itemsList = new wjcCore.CollectionView();
            this.flex.refresh();
        }
        else {
            this.populateVoucherList(voucherTypeId, voucherStatus, fromDate, ToDate);
            if (voucherStatus == "UNPOSTED") {
                this.vouStatus = "New";
            }
            else {
                this.vouStatus = "Post";
            }
        }
    }

    private populateVoucherList(voucherTypeId: Number, voucherStatus: String, fromDate: Date, toDate: Date) {
        if (AppUtility.isEmpty(voucherTypeId))
            voucherTypeId = 0;
        this.loader.show();
        this._selectedVoucherId = voucherTypeId;
        this._selectedvouStatus = voucherStatus;

        this.listingService.getVoucherListByBroker(AppConstants.participantId, voucherTypeId, voucherStatus, fromDate, toDate)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.itemsList = new wjcCore.CollectionView();
                        this.flex.refresh();
                        this.vouStatus = "";
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');

                    } else {
                        this.itemsList = new wjcCore.CollectionView(restData);
                        // Select the newly added item
                        AppUtility.moveSelectionToLastItem(this.itemsList);
                        this._pageSize = 0;
                    }
                },
                err => {
                    this.loader.hide();
                    if(err.message){
                        this.errorMessage = err.message;
                    }
                    else {
                        this.errorMessage = err;
                    }
                    this.dialogCmp.statusMsg = this.errorMessage;
                    this.dialogCmp.showAlartDialog('Error');
                });
    }

    private _msg: string = ''
    private _items: string[] = [];
    private _selectedStatus: any;

    public onPostAction(selectedStatus) {
        this._selectedStatus = selectedStatus
        if (this.itemsList.itemCount < 1) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            this.itemsList = new wjcCore.CollectionView();
            this.flex.refresh();
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
        }
        else {
            var confirmStr;
            var showMsg = "";
            var voucherMasterIdStr = "";

            for (var i = 0; i < this.itemsList.itemCount; i++) {
                if ((this.itemsList.items[i].chequeCleared && this.itemsList.items[i].voucherType.voucherType == 'BRV') || this.itemsList.items[i].voucherType.voucherType != 'BRV') {
                    this._items.push(this.itemsList.items[i].voucherMasterId);
                    console.log("------test voucher id--------" + this._items[i]);
                }
                else
                    voucherMasterIdStr = this.itemsList.items[i].vouNo + ", " + voucherMasterIdStr
            }

            if (this._selectedStatus == "REVERSED") {
                // confirmStr = confirm("Are you sure you want to Reverse all records?");
                this.dialogCmp.statusMsg = "Are you sure you want to Reverse all records?";
                this.dialogCmp.showAlartDialog('Confirmation');

                this._msg = AppConstants.MSG_RECORD_REVERSED;
            }
            else {
                if (AppUtility.isEmptyArray(this._items)) {
                    this.dialogCmp.statusMsg = "Cheque has not been cleared for Voucher No. " + voucherMasterIdStr.slice(0, -2);
                    this.dialogCmp.showAlartDialog('Warning');
                }
                else {
                    if (!AppUtility.isEmpty(voucherMasterIdStr)) {
                        showMsg = "Cheque has not been cleared for Voucher No. " + voucherMasterIdStr.slice(0, -2);

                        showMsg = showMsg + "\nAre you sure you want to Post remaining records?";
                    }
                    else
                        showMsg = showMsg + "\nAre you sure you want to Post all records?";

                    // confirmStr = confirm(showMsg);
                    this.dialogCmp.statusMsg = showMsg;
                    this.dialogCmp.showAlartDialog('Confirmation');

                    this._msg = AppConstants.MSG_RECORD_POSTED;
                }
            }
        }
    }

    private getGlParams() {
        this.listingService.getGlParamsByParticipant(AppConstants.participantId)
            .subscribe(
                restData => {
                    if (AppUtility.isEmpty(restData)) {
                        this.minDate = this.today;
                    } else {
                        var glp: GLParams = new GLParams();
                        glp = restData;
                        if (glp.backdateEntry) {
                            this.backDateEntry = true;
                        }
                        else
                            this.backDateEntry = false;
                    }
                },
                error => this.errorMessage = <any>error.message);
    }

    private getFiscalYear() {
        this.listingService.getFiscalYearByParticipant(AppConstants.participantId, this.selectedItem.voucherMaster.vouDate, true)
            .subscribe(
                restData => {
                    if (AppUtility.isEmpty(restData)) {
                        this.fiscalYearExist = false;
                    } else {
                        this.fiscalYearList = restData;

                        if (this.backDateEntry) {
                            this.minDate = this.fiscalYearList[0].startDate;
                        }
                        else
                            this.minDate = this.today;

                        this.fiscalYearExist = true;
                    }
                },
                error => this.errorMessage = <any>error.message);
    }

    public populateChartOfAccountList() {
        this.loader.show();
        // Populate ChartOfAccount data..      
        //if (!AppUtility.isEmpty(glCode) || !AppUtility.isEmpty(glDesc)) {
        this.listingService.getBindedAndSortedChartOfAccountBasicInfoList(AppConstants.participantId, true)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.recExist = false;
                        this.isInvalidcode = true;
                        this.coaGrid.refresh();
                        this.selectedDetailItem.chartOfAccount.glDesc = 'Invalid Code.';
                        this.selectedDetailItem.chartOfAccount.glCode = null;
                        this.selectedDetailItem.chartOfAccount.chartOfAccountId = null;
                    } else {
                        this.chartOfAccountList = restData;
                        // let bi: BasicInfo = new BasicInfo();
                        // bi.id = AppConstants.PLEASE_SELECT_VAL;
                        // bi.displayName = AppConstants.PLEASE_SELECT_STR;
                        // bi.code = AppConstants.PLEASE_SELECT_STR;
                        // this.chartOfAccountList.unshift(bi);

                        this._pageSizecoa = 0;
                        this.recExist = true;
                        this.isInvalidcode = false;

                        if (this.selectedDetailItem.chartOfAccount.chartOfAccountId < 1) {
                            this.selectedDetailItem.chartOfAccount.glCode = this.chartOfAccountList[0].code;
                            this.selectedDetailItem.chartOfAccount.glDesc = this.chartOfAccountList[0].displayName;
                            this.selectedDetailItem.chartOfAccount.chartOfAccountId = this.chartOfAccountList[0].id;
                        }
                    }
                },
                error => { this.loader.show(); this.errorMessage = <any>error.message });
        this.isInvalidcode = false;
        //}
    }


    public clearControls() {
        this.selectedDetailItem.chartOfAccount.glCode = null;
        this.selectedDetailItem.chartOfAccount.glDesc = null;
        this.selectedDetailItem.chartOfAccount.chartOfAccountId = null;
    }

    public onVoucherTypeChangeEvent(selectedItem: String): void {
        if (selectedItem == 'Bank Receipt Voucher') {
            this.disabledCheckbox = false;
            // console.log(selectedItem + "==============1");
        }
        else {
            this.disabledCheckbox = true;
            // console.log(selectedItem + "==============2");
        }
    }

    public onDateChangeEvent(selectedDate): void {
        if (!AppUtility.isEmpty(selectedDate)) {
            this.getFiscalYear();
        }
    }

    private addFormValidations() {
        this.myForm = this._fb.group({
            voucherType: ['', Validators.compose([Validators.required])],
            vouNaration: ['', Validators.compose([Validators.required])],
            vouDate: ['', Validators.compose([Validators.required])],
            chequeCleared: [''],
            clientId: ['', Validators.compose([Validators.required])],
            // glCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternGlCode)])],
            naration: [''],
            paymentType: ['', Validators.compose([Validators.required])],
            // glDesc: [''],
            type: ['', Validators.compose([Validators.required])],
            debitCredit: ['', Validators.compose([Validators.required])],
            instrumentNo: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternString)])],
        });
    }

    public hideModal() {
        jQuery('#add_new_voucher').modal('hide');   // hiding the modal on save/updating the record
    }

    public getNotification(btnClicked) {
        if (btnClicked == 'Success')
            this.hideModal();

        else if (btnClicked == 'Yes') {
            if (this.isDeleting) {
                if (AppUtility.isValidVariable(this.itemsList.currentItem.voucherMasterId)) {
                    this.listingService.deleteVoucher(this.itemsList.currentItem.voucherMasterId).subscribe(
                        data => {
                            this.dialogCmp.statusMsg = 'Record deleted successfully.';
                            this.dialogCmp.showAlartDialog('Success');
                            this.itemsList = new wjcCore.CollectionView();
                            this.flex.refresh();
                            this.onSearchvoucher(this._selectedVoucherId, this._selectedvouStatus, this.fromDate.value, this.toDate.value);
                        },
                        err => {
                            if(err.message){
                                this.errorMessage = err.message;
                            }
                            else {
                                this.errorMessage = err;
                            }
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');
                            this.onSearchvoucher(this._selectedVoucherId, this._selectedvouStatus, this.fromDate.value, this.toDate.value);
                        }
                    );
                }
                else {
                    this.dialogCmp.statusMsg = 'No action has been taken.';
                    this.dialogCmp.showAlartDialog('Notification');
                }
            }
            else {
                AppUtility.printConsole(this._selectedVoucherId + ", " + this._selectedvouStatus + ", " + this.fromDate.value + ", " + this.toDate.value);
                if (!AppUtility.isEmptyArray(this._items)) {
                    this.listingService.updateVoucherStatus(this._items, this._selectedStatus).subscribe(
                        data => {
                            this.dialogCmp.statusMsg = this._msg;
                            this.dialogCmp.showAlartDialog('Success');
                            this._items = [];
                            this.itemsList = new wjcCore.CollectionView();
                            this.flex.refresh();
                        },
                        err => {
                            if(err.message){
                                this.errorMessage = err.message;
                            }
                            else {
                                this.errorMessage = err;
                            }
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');
                            this._items = [];
                            this.onSearchvoucher(this._selectedVoucherId, this._selectedvouStatus, this.fromDate.value, this.toDate.value);
                        }
                    );
                }
                else {
                    this.dialogCmp.statusMsg = 'No action has been taken.';
                    this.dialogCmp.showAlartDialog('Notification');
                }
            }
        }
    }

}
