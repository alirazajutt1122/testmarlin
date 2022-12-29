import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { TransactionDetail } from 'app/models/transaction-detail';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { AppState } from 'app/app.service';
import { ListingService } from 'app/services/listing.service';
import { AuthService2 } from 'app/services/auth2.service';

//imports for ngx translate
import { TranslateService } from '@ngx-translate/core';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Client } from 'app/models/client';
import { Market } from 'app/models/market';
import { Security } from 'app/models/security';
import { ClientCustodian } from 'app/models/client-custodian';
// import * as jQuery from 'jquery';
declare var jQuery : any;
import { TraansactionType } from 'app/models/traansaction-type';
import { BasicInfo } from 'app/models/basic-info';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

var Decimal = require('../../../../../../../decimal.js/decimal.min');

declare var jQuery: any;

@Component({

    selector: 'manual-transaction-page',
    templateUrl: './manual-transaction-page.html',
    encapsulation: ViewEncapsulation.None,
})

export class ManualTransactionPage implements OnInit {


    public myForm: FormGroup;

    settlementCalendarList: wjcCore.CollectionView;
    itemsList: wjcCore.CollectionView;
    selectedItem: TransactionDetail;

    @Input() isDashBoard: string;


    errorMessage: string;

    public hideForm = false;
    public isSubmitted: boolean;
    public isEditing: boolean;
    public recExist: boolean;
    public unPost = false;
    public custodianExist = false;
    public securityExist = false;
    public transStatus: string;
    selectedIndex: number = 0;

    public selectedAction: String = null;

    marketList: any[];
    symbolList: any[];
    clientList: any[];
    tradeSideList: any[];
    transactionTypeList: any[];

    TransactionStatusList: any[];
    exchangeMarketSecurityDetailList: any[];
    clientCustodianList: any[];

    public marketId: number;
    public securityId: number;
    public buyerClientId: Number;
    public sellerClientId: Number;
    public refParticipantId: Number;
    public traansactionTypeId: number;

    today: Date = new Date();

    private _pageSize = 0;

    private boardLot: number;
    private tickSize: number;
    public fcDays: number = 0;
    public disabledCheckbox: Boolean = true;
    public buyerClientError: boolean;
    public sellerClientError: boolean;
    // private counterClientId: Number;
    // private counterClientCode: String;

    ////claims: any;
    BrowserLang: any
    lang: any

    @ViewChild('flex') flex: wjcGrid.FlexGrid;
    @ViewChild('settlementGrid') settlementGrid: wjcGrid.FlexGrid;
    @ViewChild('transactionStatus') transactionStatus: wjcInput.DropDown;
    @ViewChild('transactionDate') transactionDate: wjcInput.InputDate;
    @ViewChild('tradeDate') tradeDate: wjcInput.InputDate;
    @ViewChild('cmbMarketId') cmbMarketId: wjcInput.ComboBox;
    @ViewChild('cmbSecurityId') cmbSecurityId: wjcInput.ComboBox;
    @ViewChild('fcAmount') fcAmount: wjcInput.InputNumber;
    @ViewChild('fcRate') fcRate: wjcInput.InputNumber;
    @ViewChild('fcDays') fcDaysControl: wjcInput.InputNumber;
    @ViewChild('cmbRefParticipantId') cmbRefParticipantId: wjcInput.ComboBox;
    @ViewChild('cmbBuyerClient') cmbBuyerClient: wjcInput.ComboBox;
    @ViewChild('cmbSellerClient') cmbSellerClient: wjcInput.ComboBox;
    @ViewChild('cmbTransactionType') cmbTransactionType: wjcInput.ComboBox;
    @ViewChild('cmbBuySellType') cmbBuySellType: wjcInput.ComboBox;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    @ViewChild('badlaDate') badlaDate: wjcInput.InputDate;

    constructor(private appState: AppState,
        private listingService: ListingService,
        private _fb: FormBuilder,
        public userService: AuthService2,
        private translate: TranslateService, private loader : FuseLoaderScreenService) {

            this.clearFields();
        this.hideForm = false;
        this.isSubmitted = false;
        this.isEditing = false;
        // //this.claims = authService.claims;
        // Add Form Validations
        this.addFromValidations();
        this.itemsList = new wjcCore.CollectionView();
        //_______________________________for ngx_translate_________________________________________
        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        if (this.lang == 'pt') {
            AppConstants.PLEASE_SELECT_STR = "Selecione";
        }
        //_______________________________for ngx_translate_________________________________________
    }

    ngOnInit() {

        if (this.lang == 'en') {
            // Populate transaction type combo
            this.tradeSideList = [{ 'name': AppConstants.PLEASE_SELECT_STR, 'code': AppConstants.PLEASE_SELECT_VAL },
            { 'name': 'Buy', 'code': 'Buy' }, { 'name': 'Sell', 'code': 'Sell' }];

            this.TransactionStatusList = [{ 'name': AppConstants.PLEASE_SELECT_STR, 'code': AppConstants.PLEASE_SELECT_VAL }, { 'name': 'Post', 'code': 'POSTED' },
            { 'name': 'New / Unpost', 'code': 'UNPOSTED' }];
        }

        if (this.lang == 'pt') {
            // Populate transaction type combo
            this.tradeSideList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL },
            { "name": "Comprar", "code": "Buy" }, { "name": "Vender", "code": "Sell" }]

            this.TransactionStatusList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Publicar", "code": "POSTED" },
            { "name": "Nova / Destravar", "code": "UNPOSTED" }]
        }


        if (this.isDashBoard) {
            this.onSearchTransaction('UNPOSTED', new Date());
        }
    }

    ngAfterViewInit() {
        var self = this;
        // $('#add_new_transaction').on('shown.bs.modal', function (e) {
        //   self.selectedItem.marketId = self.marketId;
        //   self.selectedItem.securityId = self.securityId;
        //   self.cmbSecurityId.selectedValue = self.securityId;
        //   self.selectedItem.traansactionTypeId = self.traansactionTypeId;
        //   self.cmbTransactionType.selectedValue = self.traansactionTypeId;
        //   self.selectedItem.buyerClientId = self.buyerClientId;
        //   self.selectedItem.sellerClientId = self.sellerClientId;
        //   self.selectedItem.refParticipantId = self.refParticipantId;
        //   self.cmbRefParticipantId.selectedValue = self.refParticipantId;
        //   self.tradeDate.focus();
        // });

        // jQuery('.grid div div:nth-child(2)').addClass("slim_scroll");
        // jQuery('.slim_scroll').slimScroll({
        //   height: '100%',
        //   width: '100%',
        //   wheelStep: 10,
        //   alwaysVisible: true,
        //   allowPageScroll: false,
        //   railVisible: true,
        //   size: '7px',
        //   opacity: 1,
        //   axis: 'both'
        // });

        (<any>this.myForm).controls.exchangeCode.markAsPristine();
        (<any>this.myForm).controls.settlementType.markAsPristine();

    }

    /*********************************
   *      Public & Action Methods
   *********************************/

    public populateClientList(exchangeId: Number) {

        this.appState.showLoader = true;
        this.loader.show();
        // Populate client combo
        this.listingService.getClientBasicInfoListByExchangeBroker(exchangeId, AppConstants.participantId, true)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.clientList = null;
                        this.selectedItem.buyerClientId = null;
                        this.selectedItem.sellerClientId = null;
                    } else {
                        this.clientList = restData;

                        if (!this.isEditing) {
                            let c: BasicInfo = new BasicInfo();
                            c.id = AppConstants.PLEASE_SELECT_VAL;
                            c.code = AppConstants.PLEASE_SELECT_STR;
                            c.displayName = AppConstants.PLEASE_SELECT_DISPLAYVALUE;
                            this.clientList.unshift(c);
                        }

                        setTimeout(() => {
                            if (!this.isEditing) {
                                this.selectedItem.buyerClientId = this.clientList[0].id;
                                this.selectedItem.sellerClientId = this.clientList[0].id;
                            } else {
                                this.selectedItem.buyerClientId = this.buyerClientId;
                                this.selectedItem.sellerClientId = this.sellerClientId;
                            }
                        }, 150);
                    }
                },
                error => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    this.errorMessage = <any>error;
                });

    }

    public populateMarketList(exchangeId: Number) {
        this.appState.showLoader = true;
        this.loader.show();
        // Populate market combo
        this.listingService.getMarketListByExchange(exchangeId)
            .subscribe(
                restData => {
                    this.appState.showLoader = false;
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.marketList = null;
                    } else {
                        this.marketList = restData;

                        if (!this.isEditing) {
                            let m: Market = new Market();
                            m.marketId = AppConstants.PLEASE_SELECT_VAL;
                            m.marketCode = AppConstants.PLEASE_SELECT_STR;
                            this.marketList.unshift(m);
                        }

                        setTimeout(() => {
                            if (!this.isEditing) {
                                this.selectedItem.marketId = this.marketList[0].marketId;
                            } else {
                                this.selectedItem.marketId = this.marketId;
                            }
                        }, 150);
                    }
                },
                error => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    this.errorMessage = <any>error;
                });
    }

    public onMarketChangeEvent(): void {
        if (!AppUtility.isEmpty(this.cmbMarketId.selectedValue)) {
            this.populateTransactionTypeList(this.selectedItem.exchangeId, this.cmbMarketId.selectedValue);
            this.populateSecurityList(this.selectedItem.exchangeId, this.cmbMarketId.selectedValue, this.selectedItem.settlementTypeId, true);
            if (this.cmbMarketId.text === 'MTS' || this.cmbMarketId.text == 'MFS')
                this.badlaDate.isDisabled = false;
            else
                this.badlaDate.isDisabled = true;
        }
        else {
            if (!AppUtility.isEmpty(this.symbolList))
                this.symbolList = null;

            this.cmbSecurityId.isDisabled = true;
        }
    }

    public populateSecurityList(exchangeId: Number, marketId: Number, settlementTypeId: Number, status: Boolean) {
        this.appState.showLoader = true;
        this.loader.show();
        // Populate market combo
        this.listingService.getSymbolListByExchangeMarketandSettlementType(exchangeId, marketId, settlementTypeId, status)
            .subscribe(
                restData => {
                    this.appState.showLoader = false;
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.symbolList = null;
                        this.cmbSecurityId.isDisabled = true;
                        // this.securityExist = false;
                    } else {
                        this.symbolList = restData;

                        if (!this.isEditing) {
                            let sec: Security = new Security();
                            sec.securityId = AppConstants.PLEASE_SELECT_VAL;
                            sec.symbol = AppConstants.PLEASE_SELECT_STR;
                            this.symbolList.unshift(sec);
                        }

                        setTimeout(() => {
                            if (!this.isEditing) {
                                this.selectedItem.securityId = this.symbolList[0].securityId;
                            } else {
                                this.selectedItem.securityId = this.securityId;
                            }
                        }, 150);

                        this.securityExist = true;
                        this.cmbSecurityId.isDisabled = false;
                    }
                },
                error => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    this.errorMessage = <any>error;
                });
    }

    public onDateChangeEvent(selectedDate): void {
        if (!AppUtility.isEmpty(selectedDate) && !this.isEditing) {
            this.selectedItem.exchangeCode = '';
            this.selectedItem.settlementType = '';
        }
    }

    public populateClientCustodianList(buyerClientId: Number) {
        this.loader.show();
        this.appState.showLoader = true;
        // Populate market combo
        this.listingService.getClientCustodian(buyerClientId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.clientCustodianList = null;
                        this.custodianExist = false;
                        this.cmbRefParticipantId.isDisabled = true;
                    } else {
                        this.clientCustodianList = restData;


                        if (!this.isEditing) {
                            let c: ClientCustodian = new ClientCustodian();
                            c.custodian.participantId = AppConstants.PLEASE_SELECT_VAL;
                            c.custodian.participantCode = AppConstants.PLEASE_SELECT_STR;
                            this.clientCustodianList.unshift(c);
                        }

                        setTimeout(() => {
                            if (!this.isEditing) {
                                this.selectedItem.refParticipantId = this.clientCustodianList[0].custodian.participantId;
                            } else {
                                this.selectedItem.refParticipantId = this.refParticipantId;
                            }
                        }, 150);

                        this.custodianExist = true;
                        this.cmbRefParticipantId.isDisabled = false;
                    }
                },
                error => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    this.errorMessage = <any>error;
                });
    }

    public onSecurityChangeEvent(selectedId): void {
        if (!AppUtility.isEmpty(selectedId)) {
            this.populateExchangeMarketSecurityDetail(this.selectedItem.exchangeId, this.selectedItem.marketId, selectedId);
        }
    }

    public onSearchTransaction(selectedStatus, transactionDate): void {
        // Populate ManualTransactions data..
        if (AppUtility.isEmpty(selectedStatus)) {
            this.dialogCmp.statusMsg = 'Please select transaction status';
            this.dialogCmp.showAlartDialog('Warning');
            // alert("Please select transaction status");
            this.itemsList = new wjcCore.CollectionView();
            this.flex.invalidate();
            this.unPost = false;
        }
        else {
            this.populateManualTransactionsList(selectedStatus, transactionDate);
            this.unPost = false;
            if (selectedStatus === 'CANCELED') {
                this.transStatus = '';
            }
            else if (selectedStatus === 'UNPOSTED') {
                this.transStatus = 'New / Unpost';
            }
            else {
                this.transStatus = 'Post';
            }

        }
    }

    public getFCDays(exchangeId: Number, settlementCalendarId: Number, participantId: Number) {
        this.loader.show();
        this.appState.showLoader = true;
        // Populate market combo
        this.listingService.getFCDays(exchangeId, settlementCalendarId, participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.fcDays = 0;
                    } else {
                        this.fcDays = restData;
                    }
                },
                error => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    this.errorMessage = <any>error;
                });
    }

    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }

        if (AppUtility.isValidVariable(this.itemsList)) {
            this.itemsList.cancelEdit();
            this.itemsList.cancelNew();
        }
        this.hideForm = false;
        this.isSubmitted = false;
        this.isEditing = false;

        this.selectedItem = new TransactionDetail();
        this.selectedItem.exchangeCode = '';
        this.selectedItem.exchangeId = null;
        this.selectedItem.participantId = AppConstants.participantId;
        this.selectedItem.refParticipantCode = null;
        this.selectedItem.volume = 1;
        this.selectedItem.price = 0;
        this.selectedItem.ticketNo = null;
        this.selectedItem.settlementType = '';
        this.selectedItem.settlementTypeId = null;
        this.selectedItem.startDate = new Date();
        this.selectedItem.endDate = new Date();
        this.selectedItem.settlementDate = new Date();
        this.selectedItem.transDate = new Date();
        this.selectedItem.posted = null;
        this.selectedItem.entryDatetime = new Date();
        this.selectedItem.processed = null;
        this.selectedItem.delCommRate = 0;
        this.selectedItem.diffCommRate = 0;
        this.selectedItem.fcRate = 0;
        this.selectedItem.fcDays = 0;
        this.selectedItem.fcAmount = 0;
        this.selectedItem.traansactionTypeId = null;
        this.selectedItem.code = '';
        this.selectedItem.clientId = null;
        this.selectedItem.clientCode = '';
        this.selectedItem.buyerClientId = null;
        this.buyerClientId = null;
        this.selectedItem.buyerClientCode = '';
        this.selectedItem.sellerClientId = null;
        this.sellerClientId = null;
        this.selectedItem.sellerClientCode = '';
        this.selectedItem.c2c = false;
        // if(AppUtility.isValidVariable(this.selectedItem.badlaDate))
        this.selectedItem.badlaDate = new Date();
        // else
        // this.selectedItem.badlaDate = null;
        this.selectedItem.mtmLossPercentage = 0;
        // this.selectedItem.c2cCode = null;

        this.buyerClientError = false;
        this.sellerClientError = false;

        if (AppUtility.isValidVariable(this.tradeSideList) && !AppUtility.isEmpty(this.tradeSideList)) {
            this.selectedItem.buySell = this.tradeSideList[0].code;
        }
    }

    public onCalendarSelect() {
        this.loader.show();
        this.appState.showLoader = true;
        // Populate settlementCalendar data..
        this.listingService.getSettlementCalendarByTradeDate(this.tradeDate.value, false, AppConstants.participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        // alert(this.errorMessage);
                        this.settlementCalendarList = new wjcCore.CollectionView();
                        this.recExist = false;
                        this.settlementGrid.refresh();
                    } else {
                        this.loader.hide();
                        this.appState.showLoader = false;
                        this.settlementCalendarList = new wjcCore.CollectionView(restData);
                        this.recExist = true;
                        // console.log(JSON.stringify( this.settlementCalendarList));
                    }
                },
                error => this.errorMessage = <any>error);
    }

    public updateControls() {
        this.selectedItem.exchangeId = this.settlementGrid.collectionView.currentItem.exchange.exchangeId;
        this.selectedItem.exchangeCode = this.settlementGrid.collectionView.currentItem.exchange.exchangeCode;
        this.selectedItem.settlementType = this.settlementGrid.collectionView.currentItem.settlementType.settlementType;
        this.selectedItem.settlementTypeId = this.settlementGrid.collectionView.currentItem.settlementType.settlementTypeId;
        this.selectedItem.startDate = new Date(this.settlementGrid.collectionView.currentItem.startDate);
        this.selectedItem.endDate = new Date(this.settlementGrid.collectionView.currentItem.endDate);
        this.selectedItem.settlementDate = new Date(this.settlementGrid.collectionView.currentItem.settlementDate);
        this.selectedItem.settlementCalendarId = this.settlementGrid.collectionView.currentItem.settlementCalendarId;
        // this.selectedItem.badlaDate = this.bad;
        this.selectedItem.entryDatetime = new Date();
        this.selectedItem.manual = 'Y';
        this.selectedItem.traansactionTypeId = null;

        this.cmbMarketId.isDisabled = false;
        this.cmbSecurityId.isDisabled = false;
        this.cmbTransactionType.isDisabled = false;
        this.cmbBuySellType.isDisabled = false;

        this.populateMarketList(this.selectedItem.exchangeId);
        this.populateClientList(this.selectedItem.exchangeId);
    }

    get pageSize(): number {
        return this._pageSize;
    }

    set pageSize(value: number) {
        if (this._pageSize !== value) {
            this._pageSize = value;
            if (this.flex) {
                (<wjcCore.IPagedCollectionView><unknown>this.flex.collectionView).pageSize = value;
            }
        }
    }

    public hideModal() {
        jQuery('#add_new_transaction').modal('hide');   // hiding the modal on save/updating the record
    }

    public onCancelAction() {
        this.clearFields();
        this.hideForm = false;
        this.hideModal();
    }

    public onNewAction() {
        this.clearFields();
        this.marketList = null;
        this.symbolList = null;
        this.clientList = null;
        this.hideForm = true;
        this.isEditing = false;
    }

    public onEditAction() {
        this.clearFields();
        this.selectedIndex = this.flex.selection.row;
        this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));

        if (!AppUtility.isEmpty(this.selectedItem)) {
            this.hideForm = true;
            this.isEditing = true;

            this.disabledCheckbox = false;
            if (this.selectedItem.buySell === 'Buy')
                this.cmbSellerClient.isDisabled = true;
            else
                this.cmbBuyerClient.isDisabled = true;

            this.cmbMarketId.isDisabled = true;
            this.cmbSecurityId.isDisabled = true;
            this.cmbTransactionType.isDisabled = true;
            this.cmbBuySellType.isDisabled = true;

            this.marketId = this.selectedItem.marketId;
            this.populateMarketList(this.selectedItem.exchangeId);

            if (this.marketId > 0) {
                this.securityId = this.selectedItem.securityId;
                this.populateSecurityList(this.selectedItem.exchangeId, this.marketId, this.selectedItem.settlementTypeId, true);

                this.traansactionTypeId = this.selectedItem.traansactionTypeId;
                this.populateTransactionTypeList(this.selectedItem.exchangeId, this.marketId);
            }

            if (this.selectedItem.buyerClientId > 0) {
                this.buyerClientId = this.selectedItem.buyerClientId;
                this.populateClientList(this.selectedItem.exchangeId);
            }

            if (this.buyerClientId > 0) {
                this.refParticipantId = this.selectedItem.refParticipantId;
                this.populateClientCustodianList(this.buyerClientId);
            }

            if (this.selectedItem.sellerClientId > 0) {
                this.sellerClientId = this.selectedItem.sellerClientId;
                this.populateClientList(this.selectedItem.exchangeId);
            }

            if (this.selectedItem.marketCode === 'MTS' || this.selectedItem.marketCode == 'MFS') {
                this.badlaDate.isDisabled = false;
            }
            else {
                this.badlaDate.isDisabled = true;
                this.selectedItem.badlaDate = new Date();
            }

            // console.log(this.selectedItem.startDate + ", " + this.selectedItem.endDate + ", " + this.selectedItem.settlementDate + ", " + this.selectedItem.transDate + ", " + this.selectedItem.entryDatetime);
        }
    }

    public onPostAction(selectedStatus) {
        if (this.itemsList.itemCount < 1) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            this.itemsList = new wjcCore.CollectionView();
            this.flex.refresh();
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
        }
        else {
            this.selectedAction = selectedStatus;

            if (selectedStatus === 'CANCELED') {
                this.dialogCmp.statusMsg = 'Are you sure you want to Cancel all records?';
                this.dialogCmp.showAlartDialog('Confirmation');
                // confirmStr = confirm("Are you sure you want to Cancel all records?");

            }
            else if (selectedStatus === 'UNPOSTED') {
                this.dialogCmp.statusMsg = 'Are you sure you want to Unpost all records?';
                this.dialogCmp.showAlartDialog('Confirmation');
                // confirmStr = confirm("Are you sure you want to Unpost all records?");
            }
            else {
                this.dialogCmp.statusMsg = 'Are you sure you want to Post all records?';
                this.dialogCmp.showAlartDialog('Confirmation');
                // confirmStr = confirm("Are you sure you want to Post all records?");

            }
        }
    }

    public onSaveAction(model: any, isValid: boolean) {
        if (this.selectedItem.buySell === 'Buy' && this.selectedItem.buyerClientId == null) {
            this.buyerClientError = true;
            return;
        }
        else
            this.buyerClientError = false;

        if (this.selectedItem.buySell === 'Sell' && this.selectedItem.sellerClientId == null) {
            this.sellerClientError = true;
            return;
        }
        else
            this.sellerClientError = false;

        if ((this.cmbTransactionType.text === 'MTSD' || this.cmbTransactionType.text === 'MFSD' || this.cmbTransactionType.text === 'MTSN' || this.cmbTransactionType.text === 'MFSN') && this.selectedItem.fcDays < 1) {
            this.dialogCmp.statusMsg = 'Next Settlment Calander Date is not defined. Please contact to the administrator.';
            this.dialogCmp.showAlartDialog('Error');
            return;
        }
        // else if ((this.cmbTransactionType.text != 'MTSD'  this.cmbTransactionType.text == 'MFSD' || this.cmbTransactionType.text == 'MTSN' || this.cmbTransactionType.text == 'MFSN')) {
        else if (!this.buyerClientError && !this.sellerClientError) {
            this.isSubmitted = true;
            if (isValid) {
                let price = new Decimal(this.selectedItem.price);
                let tickSize = new Decimal(this.tickSize);

                let modVal = price.modulo(tickSize);

                // alert(modVal);

                // if (modVal !== 0) {
                if (!modVal.isZero()) {
                    this.dialogCmp.statusMsg = 'Invalid Price, Price should be multiple of ' + this.tickSize;
                    this.dialogCmp.showAlartDialog('Error');
                    // alert('Invalid Price, Price should be multiple of ' + this.tickSize);
                    return;
                }

                if ((this.selectedItem.volume % this.boardLot) !== 0) {
                    this.dialogCmp.statusMsg = 'Invalid Quantity, Quantity should be multiple of ' + this.boardLot;
                    this.dialogCmp.showAlartDialog('Error');
                    // alert('Invalid Volume, Volume should be multiple of ' + this.boardLot);
                    return;
                }

                //   if (this.cmbMarketId.text === 'MTS' || this.cmbMarketId.text == 'MFS')
                // this.selectedItem.badlaDate=this.badlaDate.value;
                //else
                // this.selectedItem.badlaDate=null;
                this.loader.show();
                this.appState.showLoader = true;
                if (this.isEditing) {
                    this.selectedItem.diffCommRate = this.selectedItem.delCommRate;
                    this.listingService.updateTransaction(this.selectedItem).subscribe(
                        data => {
                            this.loader.hide();
                            this.appState.showLoader = false;
                            console.log('update>>>>>' + JSON.stringify(data));
                            this.fillManualTransactionFromJson(this.selectedItem, data);
                            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
                            this.itemsList.commitEdit();
                            // this.clearFields();
                            this.flex.invalidate();

                            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                            this.dialogCmp.showAlartDialog('Success');

                            this.unPost = true;
                            this.onSearchTransaction('UNPOSTED', data.transDate);
                            this.transactionStatus.text = 'New / Unpost';
                            this.transactionDate.text = data.transDate;

                            // this.flex.refresh();
                        },
                        err => {
                            this.loader.hide();
                            this.appState.showLoader = false;
                            this.errorMessage = err;
                            this.hideForm = true;
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');
                        }
                    );
                }
                else {
                    this.selectedItem.diffCommRate = this.selectedItem.delCommRate = null;
                    this.listingService.saveTransaction(this.selectedItem).subscribe(
                        data => {
                            this.loader.hide();
                            this.appState.showLoader = false;
                            if (AppUtility.isEmpty(this.itemsList)) {
                                this.itemsList = new wjcCore.CollectionView();
                            }
                            this.selectedItem = this.itemsList.addNew();
                            this.fillManualTransactionFromJson(this.selectedItem, data);
                            this.itemsList.commitNew();

                            // this.clearFields();

                            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
                            this.dialogCmp.showAlartDialog('Success');

                            // alert(AppConstants.MSG_RECORD_SAVED);
                            // this.hideModal();
                            this.unPost = true;
                            this.onSearchTransaction('UNPOSTED', data.transDate);
                            this.transactionStatus.text = 'New / Unpost';
                            this.transactionDate.text = data.transDate;
                        },
                        err => {
                            this.loader.hide();
                            this.appState.showLoader = false;
                            this.hideForm = true;
                            this.errorMessage = err;
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');
                        }
                    );
                }
            }
        }
    }
    /***************************************
     *          Private Methods
    **************************************/

    private fillManualTransactionFromJson(td: TransactionDetail, data: any) {
        if (!AppUtility.isEmpty(data)) {
            td.exchangeCode = data.exchangeCode;
            td.exchangeId = data.exchangeId;
            td.marketCode = data.marketCode;
            td.marketId = data.marketId;
            td.symbol = data.symbol;
            td.securityId = data.securityId;
            td.buyerClientCode = data.buyerClientCode;
            td.buyerClientId = data.buyerClientId;
            td.sellerClientCode = data.sellerClientCode;
            td.sellerClientId = data.sellerClientId;
            td.clientCode = data.clientCode;
            td.clientId = data.clientId;
            td.buySell = data.buySell;
            td.participantId = AppConstants.participantId;
            td.refParticipantCode = data.refParticipantCode;
            td.volume = data.volume;
            td.price = data.price;
            td.ticketNo = data.ticketNo;
            td.settlementType = data.settlementType;
            td.startDate = data.startDate;
            td.endDate = data.endDate;
            td.settlementDate = data.settlementDate;
            td.transDate = data.transDate;
            td.settlementCalendarId = data.settlementCalendarId;
            td.posted = data.posted;
            td.traansactionTypeId = data.traansactionTypeId;
            td.settlementTypeId = data.settlementTypeId;
            td.entryDatetime = data.entryDatetime;
            td.processed = data.processed;
            td.traansactionTypeId = data.traansactionTypeId;
            td.fcRate = data.fcRate;
            td.fcDays = data.fcDays;
            td.fcAmount = data.fcAmount;
            td.c2c = data.c2c;
            td.c2cCode = data.c2cCode;
            td.badlaDate = data.badlaDate;
            td.delCommRate = data.delCommRate;
            td.diffCommRate = data.diffCommRate;
            td.mtmLossPercentage = data.mtmLossPercentage;
        }
    }

    private populateManualTransactionsList(transactionStatus: String, transactionDate: Date) {
        console.log('Transaction Status' + JSON.stringify(transactionStatus));
        console.log('Transaction Date' + JSON.stringify(transactionDate));
        this.loader.show();
        this.appState.showLoader = true;
        this.listingService.getAllTransactionsByBroker(AppConstants.participantId, transactionStatus, transactionDate)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.itemsList = new wjcCore.CollectionView();
                        this.flex.refresh();
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                        // alert(this.errorMessage);
                    } else {
                        this.itemsList = new wjcCore.CollectionView(restData);
                        // Select the newly added item
                        AppUtility.moveSelectionToLastItem(this.itemsList);
                        this._pageSize = 0;
                    }
                },
                error => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    this.errorMessage = <any>error;
                    this.dialogCmp.statusMsg = this.errorMessage;
                    this.dialogCmp.showAlartDialog('Error');
                    // alert(this.errorMessage);
                });
    }

    private populateTransactionTypeList(exchangeId: Number, marketId: Number) {
        this.loader.show();
        this.appState.showLoader = true;
        this.transactionTypeList = null;
        this.listingService.getTransactionTypeByExchangeMarket(exchangeId, marketId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.appState.showLoader = false;
                    if (!AppUtility.isEmptyArray(restData)) {
                        this.transactionTypeList = restData;

                        if (!this.isEditing) {
                            let sett: TraansactionType = new TraansactionType();
                            sett.traansactionTypeId = AppConstants.PLEASE_SELECT_VAL;
                            sett.code = AppConstants.PLEASE_SELECT_STR;
                            this.transactionTypeList.unshift(sett);
                        }

                        setTimeout(() => {
                            if (!this.isEditing) {
                                this.selectedItem.traansactionTypeId = this.transactionTypeList[0].traansactionTypeId;
                            } else {
                                this.selectedItem.traansactionTypeId = this.traansactionTypeId;
                            }
                        }, 150);

                        // this.cmbTransactionType.isDisabled = false;
                    }
                },
                error => { this.appState.showLoader = false; this.errorMessage = <any>error; });
    }

    private populateExchangeMarketSecurityDetail(exchangeId: number, marketId: number, securityId: number) {
        // this.appState.showLoader = true;
        this.loader.show();
        if (AppUtility.isValidVariable(exchangeId)) {
            this.listingService.getExchangeMarketSecuritiesByParam(exchangeId, marketId, securityId)
                .subscribe(
                    restData => {
                        this.loader.hide();
                        // this.appState.showLoader = false;
                        if (AppUtility.isEmptyArray(restData)) {
                            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');
                            // alert(this.errorMessage);
                        } else {
                            this.exchangeMarketSecurityDetailList = restData;
                            this.boardLot = this.exchangeMarketSecurityDetailList[0].boardLot;
                            this.tickSize = this.exchangeMarketSecurityDetailList[0].tickSize;
                        }
                    },
                    error => {
                        // this.appState.showLoader = false;
                        this.loader.hide();
                        this.errorMessage = <any>error;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                        // alert(this.errorMessage);
                    });
        }
    }

    public roundToDecimalPlaces(decimalPlaces: Number, num: Number): Number {

        if (num > 0) {
            var temp: Number = num;
            for (var i: number = 5; i >= decimalPlaces; i--) {
                temp = Number(num.toFixed(i));
                num = temp;
            }
        }

        return num;
    }

    public isValidTickSize(price: number, tickSize: number): Boolean {
        if (price === 0 || tickSize <= 0 || price < tickSize)
            return false;

        if (price === tickSize)
            return true;

        //                    // Check tick size with addition method
        if (price > tickSize) {

            // alert(this.roundToDecimalPlaces(4, (Number(price / tickSize))));
            this.dialogCmp.statusMsg = this.roundToDecimalPlaces(4, (Number(price / tickSize))).toString();
            this.dialogCmp.showAlartDialog('Notification');

            if (this.roundToDecimalPlaces(4, (Number(price / tickSize))) > 0)
                return true;
            else
                return false;
        }

        return false;
    }

    public onTransactionTypeChangeEvent(Type: String) {
        if (this.cmbTransactionType.text === 'MTSD' || this.cmbTransactionType.text === 'MFSD') {
            const ctrl_: FormControl = (<any>this.myForm).controls.fcRate;
            ctrl_.setValidators(Validators.required);
            ctrl_.updateValueAndValidity();
            this.fcRate.isReadOnly = false;
            this.fcDaysControl.isReadOnly = false;

            if (!this.isEditing === true)
                this.disabledCheckbox = false;

            this.selectedItem.c2c = false;
            this.getFCDays(this.selectedItem.exchangeId, this.selectedItem.settlementCalendarId, AppConstants.participantId);
        }
        else if (this.cmbTransactionType.text === 'MTSN' || this.cmbTransactionType.text === 'MFSN') {
            const ctrl_: FormControl = (<any>this.myForm).controls.fcRate;
            ctrl_.setValidators(Validators.required);
            ctrl_.updateValueAndValidity();
            this.fcRate.isReadOnly = false;
            this.fcDaysControl.isReadOnly = false;

            if (!this.isEditing === true)
                this.disabledCheckbox = false;

            this.selectedItem.c2c = false;
        }
        else {
            const ctrl_: FormControl = (<any>this.myForm).controls.fcRate;
            ctrl_.setValidators(null);
            ctrl_.updateValueAndValidity();
            this.fcRate.isReadOnly = true;
            this.fcDaysControl.isReadOnly = true;

            // this.selectedItem.fcDays = 0;
            // this.selectedItem.fcAmount = 0;
            // this.selectedItem.fcRate = 0;

            if (!this.isEditing === true)
                this.disabledCheckbox = true;
        }
    }

    public onc2cChange(e) {
        if (e.target.checked) {
            this.cmbBuySellType.isDisabled = true;
            this.cmbSellerClient.isDisabled = false;
            this.cmbBuyerClient.isDisabled = false;
        }
        else {
            this.cmbBuySellType.isDisabled = false;
            if (this.selectedItem.buySell === 'Buy') {
                this.cmbSellerClient.isDisabled = true;
                this.selectedItem.sellerClientId = this.clientList[0].id;
            }
            else {
                this.cmbBuyerClient.isDisabled = true;
                this.selectedItem.buyerClientId = this.clientList[0].id;
            }
        }
    }

    public onBuySellTypeChangeEvent(buySellType: String) {
        if (buySellType === 'Buy') {
            this.cmbSellerClient.isDisabled = true;
            this.cmbBuyerClient.isDisabled = false;

            if (!AppUtility.isEmptyArray(this.clientList))
                this.selectedItem.sellerClientId = this.clientList[0].id;
        }
        else if (buySellType === 'Sell') {
            this.cmbSellerClient.isDisabled = false;
            this.cmbBuyerClient.isDisabled = true;

            if (!AppUtility.isEmptyArray(this.clientList))
                this.selectedItem.buyerClientId = this.clientList[0].id;
        }
    }

    public onBuyerClientIdChangeEvent(buyerClientId: String) {
        if (AppUtility.isEmpty(buyerClientId) && this.isSubmitted === true)
            this.buyerClientError = true;
        else
            this.buyerClientError = false;
    }

    public onSellerClientIdChangeEvent(sellerClientId: String) {
        if (AppUtility.isEmpty(sellerClientId) && this.isSubmitted === true)
            this.sellerClientError = true;
        else
            this.sellerClientError = false;
    }

    public onFCDaysLostFocusEvent(fcRate: number) {
        if ((this.fcDays > 0 || this.selectedItem.fcDays > 0) && this.selectedItem.fcRate > 0) {
            if (this.fcDays > 0) {
                this.fcAmount.value = new Decimal(this.selectedItem.fcRate) * this.fcDays;
                this.selectedItem.fcAmount = new Decimal(this.selectedItem.fcRate) * this.fcDays;
                this.fcDaysControl.value = this.fcDays;
                // this.selectedItem.fcDays = this.fcDays;
            }
            else {
                this.fcAmount.value = new Decimal(this.selectedItem.fcRate) * this.selectedItem.fcDays;
                this.selectedItem.fcAmount = new Decimal(this.selectedItem.fcRate) * this.selectedItem.fcDays;
            }
        }
        else {
            this.selectedItem.fcAmount = 0;
            this.selectedItem.fcRate = 0;
            this.selectedItem.fcDays = 0;
        }
    }

    public getNotification(btnClicked) {
        if (btnClicked === 'Success') {
            this.onNewAction();
            this.hideModal();
        }
        else if (btnClicked === 'Yes') {
            var isProcessed = false;
            var msg = '';
            var items: String[] = [];
            for (var i = 0; i < this.itemsList.itemCount; i++) {
                if (this.itemsList.items[i].processed) {
                    isProcessed = true;
                }
                else {
                    items.push(this.itemsList.items[i].transactionId);
                    console.log('--------------' + items[i]);
                }
            }

            if (isProcessed) {
                this.dialogCmp.statusMsg = 'Processed transaction(s) can not be Unposted. Please select Unprocessed transaction(s).';
                if(this.lang=='pt'){this.dialogCmp.statusMsg = 'A transação(s) processada não pode ser não lançada. Selecione Transação(s) não processada.';}
                this.dialogCmp.showAlartDialog('Notification');
                // alert('Processed transactions can not be Unposted.');
            }
            if (this.selectedAction === 'CANCELED') {
                msg = AppConstants.MSG_RECORD_CANCELED;
            }
            else if (this.selectedAction === 'UNPOSTED') {
                msg = AppConstants.MSG_RECORD_UNPOSTED;
            }
            else {
                msg = AppConstants.MSG_RECORD_POSTED;
            }

            if (!isProcessed) {
                if (items.length > 0) {
                    this.listingService.updateTransactionStatus(items, this.selectedAction).subscribe(
                        data => {
                            console.log('update>>>>>' + data);
                            this.dialogCmp.statusMsg = msg;
                            this.dialogCmp.showAlartDialog('Success');
                            // alert(msg);
                            this.itemsList = new wjcCore.CollectionView();
                            this.flex.refresh();
                        },
                        err => {
                            this.errorMessage = err;
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');
                            // alert(this.errorMessage);
                        }
                    );
                }
            }
        }
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            exchangeCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            settlementType: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternSettlementType)])],
            marketId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            transactionType: ['', Validators.compose([Validators.required])],
            securityId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            buyerClientId: [''],
            sellerClientId: [''],
            buySellType: ['', Validators.compose([Validators.required])],
            price: ['', Validators.compose([Validators.required])],
            volume: ['', Validators.compose([Validators.required])],
            ticketNo: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternStringPostalCode)])],
            delCommRate: [''],
            fcRate: [''],
            tradeDate: [''],
            badlaDate: [''],
            fcDays: [''],
            fcAmount: [''],
            refParticipantId: [''],
            c2c: ['']
        });
    }








}
