import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { BasicInfo } from 'app/models/basic-info';
import { ClientCustodian } from 'app/models/client-custodian';
import { ComboItem } from 'app/models/combo-item';
import { Exchange } from 'app/models/exchange';
import { Params, ReportParams } from 'app/models/report-params';
import { Security } from 'app/models/security';
import { StockDepositWithdraw } from 'app/models/stock-deposit-withdraw';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';

var downloadAPI = require('../../../../../../scripts/download-document');



declare var jQuery: any;


@Component({

    selector: 'stock-receipt-rpt',
    templateUrl: './stock-receipt-rpt.html',
    encapsulation: ViewEncapsulation.None,
})
export class StockReceiptRpt implements OnInit {
    //private showLoader: boolean = false;
    public myForm: FormGroup;
    public searchForm: FormGroup;

    //claims: any; 

    reportParams: ReportParams;
    params: Params;

    dateFormat: string = AppConstants.DATE_FORMAT;
    dateMask: string = null

    exchangeList: any[] = [];
    clientCustodianList: any[] = [];
    clientList: any[] = [];
    securityList: any[] = [];
    entryTypeList: any[] = [];

    entryType: string = null;

    custodianExist: boolean = false;
    custodianId: Number = null;

    isItemsListStatusNew: boolean = false;

    itemsList: wjcCore.CollectionView;
    data: any;
    lang: any
    pdfSrc: String
    pdf = false
    fileNameForDownload = "StockReceiptReport.pdf"
    exchangeId: number = 0;
    errorMessage: string;

    public isSubmitted: boolean;

    private _pageSize = 0;

    public recExist: boolean;

    @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
    @ViewChild('inputEntryType') inputEntryType: wjcInput.ComboBox;
    @ViewChild('inputSecurity') inputSecurity: wjcInput.ComboBox;
    @ViewChild('inputClient') inputClient: wjcInput.ComboBox;
    @ViewChild('GridFrom') GridFrom: wjcGrid.FlexGrid;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    participantExchangeId: any;

    constructor(private appState: AppState, private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private translate: TranslateService, private loader: FuseLoaderScreenService) {
        this.initForm();
        this.isSubmitted = false;
        //this.claims = authService.claims; 
        this.loadexchangeList();
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
        this.participantExchangeId = AppConstants.claims2.participant.exchangeId
    }
    ngOnInit() {
        // Add Form Validations
        this.addFromValidations();
    }
    ngAfterViewInit() {

    }

    /*********************************
   *      Public & Action Methods
   *********************************/
    initForm() {
        let objStockDepositWithdraw = new StockDepositWithdraw()
        this.reportParams = new ReportParams();
        this.params = new Params();
        this.securityList = [];
        this.clientList = [];
        this.entryTypeList = this.getEntryTypesList();
        this.entryTypeList.splice(this.entryTypeList.length - 2, 2);
        this.clearFields();
    }
    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }
        if (AppUtility.isValidVariable(this.searchForm)) {
            this.searchForm.markAsPristine();
        }

        this.securityList = [];
        this.clientList = [];
        this.clientCustodianList = [];
        this.custodianExist = false;
        this.isSubmitted = false;


    }

    get pageSize(): number {
        return this._pageSize;
    }
    set pageSize(value: number) {
        if (this._pageSize != value) {
            this._pageSize = value;
            if (this.flexGrid) {
                (<wjcCore.IPagedCollectionView>this.flexGrid.collectionView).pageSize = value;
            }
        }
    }

    loadexchangeList(): void {
        // update exchangeList data    
        console.log("getting exchangeList");
        this.listingService.getParticipantExchangeList(AppConstants.participantId).subscribe(
            data => {
                if (data != null) {
                    //console.log("exchangeList: "+ data); 
                    this.exchangeList = data;
                    //this.exchangeId = this.exchangeList[0].exchangeId;
                    var exchange: Exchange = new Exchange(AppConstants.PLEASE_SELECT_VAL, AppConstants.PLEASE_SELECT_STR, AppConstants.PLEASE_SELECT_STR);
                    this.exchangeList.unshift(exchange);
                    this.exchangeId = this.exchangeList[0].exchangeId;

                    data.map((a) => {
                        if (a.exchangeId == this.participantExchangeId) {
                          this.exchangeId = a.exchangeId;
                          this.params.EXCHANGE_ID = a.exchangeId;
                        }
                      })

                }
            },
            error => this.errorMessage = <any>error);
    }

    getExchangeBrokerClients(exchangeId) {
        this.clientList = [];
        if (AppUtility.isValidVariable(exchangeId)) {
            this.loader.show();
            this.listingService.getClientBasicInfoListByExchangeBroker(exchangeId, AppConstants.participantId, false)
                .subscribe(restData => {
                    this.loader.hide();
                    if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                        this.clientList = restData;
                        //@todo update  list by exchagne 
                        // for ( let i=0; i < restData.length; i++) {
                        //     if ( this.clientList[i].exchange.exchangeId == exchangeId){
                        //         this.clientList[i]=new ComboItem(this.clientList[i].clientCode, this.clientList[i].clientId); 
                        //     }
                        // }   

                        let obj: BasicInfo = new BasicInfo();
                        obj.displayName = AppConstants.PLEASE_SELECT_STR;
                        obj.id = AppConstants.PLEASE_SELECT_VAL;
                        this.clientList.unshift(obj);
                    }
                },
                    error => {
                        this.loader.hide();
                        this.errorMessage = <any>error.message
                    });
        }
    }

    public onClientChange(selectedId) {
        if (!AppUtility.isEmpty(selectedId))
            this.populateClientCustodianList(selectedId);
        else {
            if (!AppUtility.isEmpty(this.clientCustodianList))
                this.clientCustodianList = null;
            this.custodianExist = false;
        }
    }

    public populateClientCustodianList(clientId: Number) {
        // Populate market combo
        this.custodianExist = false;
        if (AppUtility.isValidVariable(clientId)) {
            this.listingService.getClientCustodian(clientId)
                .subscribe(
                    restData => {
                        if (AppUtility.isEmptyArray(restData)) {
                            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                            this.clientCustodianList = null;
                            //this.custodianExist = false;
                        } else {
                            this.clientCustodianList = restData;

                            var c: ClientCustodian = new ClientCustodian();
                            c.custodian.participantId = AppConstants.PLEASE_SELECT_VAL;
                            c.custodian.participantCode = AppConstants.PLEASE_SELECT_STR;
                            this.clientCustodianList.unshift(c);
                            this.custodianExist = true;
                        }
                    },
                    error => this.errorMessage = <any>error);
        }
    }
    public onExchangeChange(val) {
        this.getExchangeBrokerClients(val);
        this.getSecuritiesByExchange(val);
    }
    private getSecuritiesByExchange(exchangeId) {
        // Populate market combo
        this.securityList = [];
        if (AppUtility.isValidVariable(exchangeId)) {
            // this.loader.show();
            this.listingService.getSecurityListByExchagne(exchangeId)
                .subscribe(
                    restData => {
                        // this.loader.hide();
                        if (AppUtility.isEmptyArray(restData)) {
                            this.securityList = [];
                            //this.custodianExist = false;
                        } else {
                            this.securityList = restData;

                            var selectSecurity: Security = new Security();
                            selectSecurity.securityId = null;
                            selectSecurity.symbol = AppConstants.ALL_STR;
                            this.securityList.unshift(selectSecurity);
                        }
                    },
                    error => { this.loader.hide(); this.errorMessage = <any>error });
        }
    }

    public printReport(model: any, isValid: boolean) {
        AppUtility.printConsole("onSave Action, isValid: " + isValid);
        //AppUtility.printConsole("Stock deposit:"+JSON.stringify(this.selectedItem)); 
        this.isSubmitted = true;

        if (isValid) {
            this.loader.show();
            //print report ... 
            // set parameters 
            this.params.PARTICIPANT_ID = AppConstants.participantId;
            let CUSTODIAN_ID:any =  this.params.CUSTODIAN_ID
           
            if (CUSTODIAN_ID === ""){
                this.params.CUSTODIAN_ID=null
            }
            this.reportParams.setParams(this.params);

            //deposit report
            if (this.entryType == AppConstants.ENTRY_TYPE_DEPOSIT) {
                this.reportService.getStockReceiptDeposit(this.reportParams, this.lang)
                    .subscribe(
                        restData => {
                            this.loader.hide();
                            var reportData: any;
                            reportData = restData;
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

            //withdraw report 
            else if (this.entryType == AppConstants.ENTRY_TYPE_WITHDRAW) {
                this.reportService.getStockReceiptWithdraw(this.reportParams, this.lang)
                    .subscribe(
                        restData => {
                            this.loader.hide();
                            var reportData: any;
                            reportData = restData;
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
            else if (this.entryType == AppConstants.ENTRY_TYPE_PLEDGE) {
                this.loader.hide();
                this.dialogCmp.statusMsg = "Pledge Report not found";
                this.dialogCmp.showAlartDialog('Error');
            }
            else if (this.entryType == AppConstants.ENTRY_TYPE_RELEASE) {
                this.loader.hide();
                this.dialogCmp.statusMsg = "Release Report not found";
                this.dialogCmp.showAlartDialog('Error');
            }

        }

    }

    public onSearch() {
        this.itemsList = new wjcCore.CollectionView();
        this.recExist = false;
        this.GridFrom.refresh();
    }

    public updateControlsFrom() {
        this.params.CLIENT_ID = this.GridFrom.collectionView.currentItem.clientId;
        this.itemsList = new wjcCore.CollectionView();
        this.recExist = false;
        this.GridFrom.refresh();
    }

    public clearControls() {
        this.itemsList = new wjcCore.CollectionView();
        this.GridFrom.refresh();
        this.recExist = false;
    }

    public populateItemGrid(searchClientCode: string, searchClientName: string) {
        this.recExist = false;
        if (this.params.EXCHANGE_ID <= 0) {
            this.dialogCmp.statusMsg = 'Please select Exchange first.';
            this.dialogCmp.showAlartDialog('Warning');
            return;
        }
        if (AppUtility.isEmpty(searchClientCode) && AppUtility.isEmpty(searchClientName)) {
            this.loader.show();
            this.listingService.getClientListByExchangeBroker(this.params.EXCHANGE_ID, AppConstants.participantId, false, true)
                .subscribe(
                    restData => {
                        this.loader.hide();
                        if (!AppUtility.isEmpty(restData))
                            this.recExist = true;
                        else {
                            this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
                            this.dialogCmp.showAlartDialog('Warning');
                        }
                        this.itemsList = new wjcCore.CollectionView(restData);
                    },
                    error => {
                        this.loader.hide();
                        this.errorMessage = <any>error;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
        } else if (!AppUtility.isEmpty(searchClientCode) && AppUtility.isEmpty(searchClientName)) {
            this.listingService.getBindedClientListByBrokerAndExchangeAndClientCode(AppConstants.participantId, this.params.EXCHANGE_ID, encodeURIComponent(searchClientCode))
                .subscribe(
                    restData => {
                        this.loader.hide();
                        if (!AppUtility.isEmpty(restData))
                            this.recExist = true;
                        else {
                            this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
                            this.dialogCmp.showAlartDialog('Warning');
                        }
                        this.itemsList = new wjcCore.CollectionView(restData);
                    },
                    error => {
                        this.loader.hide();
                        this.errorMessage = <any>error;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
        } else if (AppUtility.isEmpty(searchClientCode) && !AppUtility.isEmpty(searchClientName)) {
            this.listingService.getBindedClientListByBrokerAndExchangeAndClientName(AppConstants.participantId, this.params.EXCHANGE_ID, encodeURIComponent(searchClientName))
                .subscribe(
                    restData => {
                        this.loader.hide();
                        if (!AppUtility.isEmpty(restData))
                            this.recExist = true;
                        else {
                            this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
                            this.dialogCmp.showAlartDialog('Warning');
                        }
                        this.itemsList = new wjcCore.CollectionView(restData);
                    },
                    error => {
                        this.loader.hide();
                        this.errorMessage = <any>error;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
        } else if (!AppUtility.isEmpty(searchClientCode) && !AppUtility.isEmpty(searchClientName)) {
            this.listingService.getBindedClientListByBrokerAndExchangeAndClientCodeAndClientName(AppConstants.participantId, this.params.EXCHANGE_ID, encodeURIComponent(searchClientCode), encodeURIComponent(searchClientName))
                .subscribe(
                    restData => {
                        this.loader.hide();
                        if (!AppUtility.isEmpty(restData))
                            this.recExist = true;
                        else {
                            this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
                            this.dialogCmp.showAlartDialog('Warning');
                        }
                        this.itemsList = new wjcCore.CollectionView(restData);
                    },
                    error => {
                        this.loader.hide();
                        this.errorMessage = <any>error;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
        }
    }

    public getNotification(btnClicked) {
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
            custodianId: [''],
            securityId: [''],
            clientId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
            entryType: ['', Validators.compose([Validators.required])],
            transDate: ['', Validators.compose([Validators.required])],
        });
    }
    getEntryTypesList(): any[] {

        let typesLabelArr
        switch (this.lang) {
            case 'en':
                typesLabelArr = ['Deposit', 'Withdraw', 'Pledge', 'Release'];
                break;
            case 'pt':
                typesLabelArr = ['Depósito', 'Retirar', 'Compromisso', 'Liberar'];
                break;
            default:
                typesLabelArr = ['Deposit', 'Withdraw', 'Pledge', 'Release'];
        }
        let typesValueArr = ['D', 'W', 'P', 'R'];
        let typesCmbList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < typesLabelArr.length; i++) {
            cmbItem = new ComboItem(typesLabelArr[i], typesValueArr[i]);
            typesCmbList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        typesCmbList.unshift(obj);

        return typesCmbList;
    }

}