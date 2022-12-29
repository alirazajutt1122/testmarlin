import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ClientLevieMaster } from 'app/models/client-levy-master';
import { Exchange } from 'app/models/exchange';
import { ParticipantBranch } from 'app/models/participant-branches';
import { Params, ReportParams } from 'app/models/report-params';
import { Security } from 'app/models/security';
import { StockDepositWithdraw } from 'app/models/stock-deposit-withdraw';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';

// var downloadAPI = require('../../../../../../scripts/download-document');


declare var jQuery: any;


@Component({

    selector: 'client-levies-rpt',
    templateUrl: './client-levies-rpt.html',
    encapsulation: ViewEncapsulation.None,
})
export class ClientLeviesRpt implements OnInit {
    //private showLoader: boolean = false;
    public myForm: FormGroup;
    public searchForm: FormGroup;

    //claims: any;

    reportParams: ReportParams;
    params: Params;

    dateFormat: string = AppConstants.DATE_FORMAT;
    dateMask: string = AppConstants.DATE_MASK;

    exchangeList: any[] = [];
    participantBranchList: any[] = [];
    clientCustodianList: any[] = [];
    fromClientList: any[] = [];
    toClientList: any[] = [];
    securityList: any[] = [];
    entryTypeList: any[] = [];
    leviesList: any[] = [];

    entryType: string = null;

    custodianExist: boolean = false;
    custodianId: Number = null;

    isItemsListStatusNew: boolean = false;

    itemsList: wjcCore.CollectionView;
    data: any;

    exchangeId: number = 0;
    errorMessage: string;

    public isSubmitted: boolean;
    public isValidStartDate: boolean;

    private _pageSize = 0;
    public recExist: boolean;

    lang: any
    pdfSrc: String
    pdf = false
    fileNameForDownload = "ClientLeviesReport.pdf"

    @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
    @ViewChild('cmbExchange') cmbExchange: wjcInput.ComboBox;
    @ViewChild('cmbBranch') cmbBranch: wjcInput.ComboBox;
    @ViewChild('cmbLevy') cmbLevy: wjcInput.ComboBox;
    @ViewChild('GridFrom') GridFrom: wjcGrid.FlexGrid;
    @ViewChild('GridTo') GridTo: wjcGrid.FlexGrid;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    participantExchangeId: any;

    constructor(private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private translate: TranslateService, private loader: FuseLoaderScreenService,
        private appState: AppState) {
        this.initForm();
        this.isSubmitted = false;
        this.isValidStartDate = true;
        //this.claims = authService.claims;
        this.loadexchangeList();
        this.loadLeveisByParticipant();
        // populate Participant Branch
        this.populateParticipantBranchList();
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
        this.params.START_DATE = new Date();
        this.params.END_DATE = new Date();
        this.params.PARTICIPANT_BRANCH_ID = -1;
        this.securityList = [];
        this.fromClientList = [];
        this.toClientList = [];

        this.entryTypeList = objStockDepositWithdraw.getEntryTypesList();
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
        this.fromClientList = [];
        this.toClientList = [];
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
    loadLeveisByParticipant(): void {

        this.listingService.getLeviesByBroker(AppConstants.participantId).subscribe(
            data => {
                if (data != null) {
                    this.leviesList = data;
                    var levy: ClientLevieMaster = new ClientLevieMaster();
                    levy.leviesMasterId = AppConstants.ALL_VAL;
                    levy.levyCode = AppConstants.ALL_STR;
                    this.leviesList.unshift(levy);
                }
            },
            error => this.errorMessage = <any>error);
    }
    private populateParticipantBranchList() {
        this.listingService.getParticipantBranchList(AppConstants.participantId)
            .subscribe(
                restData => {
                    if (AppUtility.isEmpty(restData)) {
                        this.participantBranchList = [];
                    } else {
                        this.participantBranchList = restData;
                    }

                    var pb: ParticipantBranch = new ParticipantBranch();
                    pb.branchId = AppConstants.ALL_VAL;
                    pb.branchDesc = AppConstants.ALL_STR;
                    this.participantBranchList.unshift(pb);

                },
                error => this.errorMessage = <any>error);
    }
    getExchangeBrokerFromClients(exchangeId) {
        this.fromClientList = [];
        if (AppUtility.isValidVariable(exchangeId)) {
            this.loader.show();
            this.listingService.getClientBasicInfoListByExchangeBroker(exchangeId, AppConstants.participantId, false, true)
                .subscribe(restData => {
                    this.loader.hide();
                    if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                        this.fromClientList = restData;
                    }
                },
                    error => { this.loader.hide(); this.errorMessage = <any>error });
        }
    }

    getExchangeBrokerToClients(exchangeId) {
        this.toClientList = [];
        if (AppUtility.isValidVariable(exchangeId)) {
            this.loader.show();
            this.listingService.getClientBasicInfoListByExchangeBroker(exchangeId, AppConstants.participantId, false, false)
                .subscribe(restData => {
                    this.loader.hide();
                    if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                        this.toClientList = restData;
                    }
                },
                    error => { this.loader.hide(); this.errorMessage = <any>error });
        }
    }

    public onExchangeChange(val) {
        this.getExchangeBrokerFromClients(val);
        this.getExchangeBrokerToClients(val);
        this.getSecuritiesByExchange(val);
    }
    private getSecuritiesByExchange(exchangeId) {
        // Populate market combo
        this.securityList = [];
        if (AppUtility.isValidVariable(exchangeId)) {
            this.loader.show();
            this.listingService.getSecurityListByExchagne(exchangeId)
                .subscribe(
                    restData => {
                        this.loader.hide();
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
        if (this.params.START_DATE.setHours(0, 0, 0, 0) > this.params.END_DATE.setHours(0, 0, 0, 0)) {
            this.isValidStartDate = false;
            isValid = false;
        } else {
            this.isValidStartDate = true;
        }
        if (isValid) {
            this.loader.show();
            //print report ... 
            // set parameters 
            this.params.PARTICIPANT_ID = AppConstants.participantId;
            var startDate: String = wjcCore.Globalize.format(this.params.START_DATE, AppConstants.DATE_FORMAT);
            var endDate: String = wjcCore.Globalize.format(this.params.END_DATE, AppConstants.DATE_FORMAT);
            var exchange: String = (this.params.EXCHANGE_ID == null || this.params.EXCHANGE_ID == -1) ? AppConstants.ALL_STR.toUpperCase() : this.cmbExchange.text;
            var branch: String = (this.params.PARTICIPANT_BRANCH_ID == null || this.params.PARTICIPANT_BRANCH_ID == -1) ? AppConstants.ALL_STR.toUpperCase() : this.cmbBranch.text;
            var levy: String = (this.params.LEVIES_MASTER_ID == null || this.params.LEVIES_MASTER_ID == -1) ? AppConstants.ALL_STR.toUpperCase() : this.cmbLevy.text;

            this.reportService.getClientLevies(this.params.PARTICIPANT_ID, startDate, endDate, this.params.EXCHANGE_ID, this.params.PARTICIPANT_BRANCH_ID,
                encodeURIComponent(this.params.FROM_ACCOUNT.valueOf()), encodeURIComponent(this.params.TO_ACCOUNT.valueOf()), this.params.LEVIES_MASTER_ID, exchange, branch, levy, this.lang).subscribe(
                    restData => {
                        this.loader.hide();
                        var reportData: any;
                        reportData = restData;
                        //var w = window.open(reportData.reportBase64/*,"_self"*/);
                        //   downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
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

    public onSearch() {
        this.itemsList = new wjcCore.CollectionView();
        this.recExist = false;
        this.GridFrom.refresh();
        this.GridTo.refresh();
    }

    public updateControlsFrom() {
        this.params.FROM_ACCOUNT = this.GridFrom.collectionView.currentItem.clientCode;
        this.itemsList = new wjcCore.CollectionView();
        this.recExist = false;
        this.GridFrom.refresh();
    }

    public updateControlsTo() {
        this.params.TO_ACCOUNT = this.GridTo.collectionView.currentItem.clientCode;
        this.itemsList = new wjcCore.CollectionView();
        this.recExist = false;
        this.GridTo.refresh();
    }

    public clearControls() {
        this.itemsList = new wjcCore.CollectionView();
        this.GridFrom.refresh();
        this.GridTo.refresh();
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
            participantBranch: ['', Validators.compose([Validators.required])],
            levyId: ['', Validators.compose([Validators.required])],
            securityId: [''],
            fromClientId: ['', Validators.compose([Validators.required])],
            toClientId: ['', Validators.compose([Validators.required])],
            fromDate: ['', Validators.compose([Validators.required])],
            toDate: ['', Validators.compose([Validators.required])],
        });
    }

}