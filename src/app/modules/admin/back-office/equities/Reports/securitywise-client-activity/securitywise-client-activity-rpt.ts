import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';


import { Agent } from 'app/models/agent';
import { Exchange } from 'app/models/exchange';
import { Migrator } from 'app/models/migrator';
import { ParticipantBranch } from 'app/models/participant-branches';
import { Params, ReportParams } from 'app/models/report-params';
import { Security } from 'app/models/security';
import { TraansactionType } from 'app/models/traansaction-type';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';


import { DialogCmp } from '../../../user-site/dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';


declare var jQuery: any;
// var downloadAPI = require('../../../../../../scripts/download-document');

@Component({

    selector: 'securitywise-client-activity-rpt',
    templateUrl: './securitywise-client-activity-rpt.html',
    encapsulation: ViewEncapsulation.None,
})
export class SecuritywiseClientActivityRpt implements OnInit {
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
    toClientList: any[] = [];
    fromClientList: any[] = [];
    securityList: any[] = [];
    reportTypeList: any[] = [];
    agentList: any[] = [];
    transactionTypeList: any[];
    email: boolean = false;

    reportType: string = null;

    custodianExist: boolean = false;
    custodianId: Number = null;

    isItemsListStatusNew: boolean = false;

    itemsList: wjcCore.CollectionView;
    data: any;

    exchangeId: number = 0;
    errorMessage: string;
    public traansactionTypeId: number;

    public userTypeAgentId: Number;

    public isSubmitted: boolean;
    public isValidStartDate: boolean;
    transType: boolean = true;

    private _pageSize = 0;

    public recExist: boolean;

    lang:any
    pdfSrc:String
    pdf=false
    fileNameForDownload = "SecuritywiseClientActivityReport.pdf"

    @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
    @ViewChild('inputEntryType') inputEntryType: wjcInput.ComboBox;
    @ViewChild('inputExchange') inputExchange: wjcInput.ComboBox;
    @ViewChild('inputBranch') inputBranch: wjcInput.ComboBox;
    @ViewChild('inputSecurity') inputSecurity: wjcInput.ComboBox;
    @ViewChild('inputClient') inputClient: wjcInput.ComboBox;
    @ViewChild('inputAgent') inputAgent: wjcInput.ComboBox;
    @ViewChild('transactionType') transactionType: wjcInput.MultiSelect;
    @ViewChild('GridFrom') GridFrom: wjcGrid.FlexGrid;
    @ViewChild('GridTo') GridTo: wjcGrid.FlexGrid;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    participantExchangeId: any;

    constructor(private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private appState: AppState,private translate: TranslateService, private loader : FuseLoaderScreenService) {
        this.initForm();
        this.isSubmitted = false;
        this.isValidStartDate = true;
        this.transType = true;
        //this.claims = authService.claims;

        this.loadexchangeList();
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

        this.reportParams = new ReportParams();
        this.params = new Params();
        this.params.START_DATE = new Date();
        this.params.END_DATE = new Date();
        this.params.TRANSACTION_TYPE_ID = 0;
        this.securityList = [];
        this.toClientList = [];
        this.fromClientList = [];
        this.transactionTypeList = [];
        this.reportTypeList = this.params.getSummaryDetailOptions();
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
        this.toClientList = [];
        this.fromClientList = [];
        this.clientCustodianList = [];
        this.transactionTypeList = [];
        this.custodianExist = false;
        this.isSubmitted = false;
        this.email = false;
        this.transType = true;
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

    getExchangeBrokerFromClients(agentId) {

        this.fromClientList = [];
        if (AppUtility.isValidVariable(agentId)) {
            this.loader.show();
            if (agentId == -1) {
                this.listingService.getClientBasicInfoListByExchangeBroker(this.exchangeId, AppConstants.participantId, false, true)
                    .subscribe(restData => {
                        this.loader.hide();
                        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                            this.fromClientList = restData;
                        }
                    },
                        error => { this.loader.hide(); this.errorMessage = <any>error });
            }
            else {
                this.listingService.getClientBasicInfoListByExchangeBrokerAgent(this.exchangeId, AppConstants.participantId, agentId, false, true)
                    .subscribe(restData => {
                        this.loader.hide();
                        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                            this.fromClientList = restData;
                        }
                    },
                        error => { this.loader.hide(); this.errorMessage = <any>error });
            }
        }
    }

    getExchangeBrokerToClients(agentId) {
        this.toClientList = [];
        if (AppUtility.isValidVariable(agentId)) {
            this.loader.show();
            if (agentId == -1) {
                this.listingService.getClientBasicInfoListByExchangeBroker(this.exchangeId, AppConstants.participantId, false, false)
                    .subscribe(restData => {
                        this.loader.hide();
                        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                            this.toClientList = restData;
                        }
                    },
                        error => { this.loader.hide(); this.errorMessage = <any>error });
            }
            else {
                this.listingService.getClientBasicInfoListByExchangeBrokerAgent(this.exchangeId, AppConstants.participantId, agentId, false, false)
                    .subscribe(restData => {
                        this.loader.hide();
                        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                            this.toClientList = restData;
                        }
                    },
                        error => { this.loader.hide(); this.errorMessage = <any>error });
            }
        }
    }

    public onExchangeChange(val) {
        if (AppUtility.isValidVariable(val)) {
            this.getSecuritiesByExchange(val);
            this.populateTransactionTypeList(val);
            this.populateAgentList();
            this.exchangeId = val;
            this.getExchangeBrokerFromClients(-1);
            this.getExchangeBrokerToClients(-1);
        }
    }

    public onAgentChange(val) {
        this.getExchangeBrokerFromClients(val);
        this.getExchangeBrokerToClients(val);
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
                            selectSecurity.securityId = AppConstants.ALL_VAL;
                            selectSecurity.symbol = AppConstants.ALL_STR;
                            this.securityList.unshift(selectSecurity);
                        }
                    },
                    error => { this.loader.hide(); this.errorMessage = <any>error });
        }
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
                    pb.displayName_ = AppConstants.ALL_STR;
                    this.participantBranchList.unshift(pb);

                },
                error => this.errorMessage = <any>error);
    }

    private populateTransactionTypeList(exchangeId: Number) {
        this.loader.show();
        this.transactionTypeList = null;
        this.listingService.getTransactionTypeByExchange(exchangeId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (!AppUtility.isEmptyArray(restData)) {
                        this.transactionTypeList = restData;
                        let sett: TraansactionType = new TraansactionType();
                        sett.transactionTypeId = AppConstants.ALL_VAL;
                        sett.transactionType = AppConstants.ALL_STR;
                        this.transactionTypeList.unshift(sett);
                    }
                },
                error => { this.loader.hide(); this.errorMessage = <any>error });
    }

    private populateAgentList() {
        if (AppUtility.isEmpty(this.agentList)) {
            this.listingService.getActiveAgentsbyParticipant(AppConstants.participantId)
                .subscribe(
                    restData => {
                        if (AppUtility.isEmpty(restData)) {
                            this.agentList = [];
                        } else {
                            this.agentList = restData;
                        }
                        var ag: Agent = new Agent();
                        ag.agentId = AppConstants.ALL_VAL;
                        ag.displayName_ = AppConstants.ALL_STR;
                        this.agentList.unshift(ag);
                        if (!AppUtility.isEmptyArray(this.agentList)) {
                            this.userTypeAgentId = this.agentList[0].agentId;
                        }
                    },
                    error => this.errorMessage = <any>error);
        }
    }


    public printReport(model: any, isValid: boolean) {
        AppUtility.printConsole("onSave Action, isValid: " + isValid);
        //AppUtility.printConsole("Stock deposit:"+JSON.stringify(this.selectedItem)); 
        this.isSubmitted = true;
        // check start and end date 
        if (this.params.START_DATE.setHours(0, 0, 0, 0) > this.params.END_DATE.setHours(0, 0, 0, 0)) {
            this.isValidStartDate = false;
            isValid = false;
        } else {
            this.isValidStartDate = true;
        }
        if (this.transactionType.checkedItems.length > 0) {
            this.transType = true;
            if (isValid) {
                this.loader.show();
                //print report ... 
                // set parameters 
                this.params.PARTICIPANT_ID = AppConstants.participantId;
                this.selectedTransTypes();


                if (this.params.TRANSACTION_TYPE_ID == 0)
                    this.params.TRANSACTION_TYPE_ID = null

                var startDate = wjcCore.Globalize.format(this.params.START_DATE, AppConstants.DATE_FORMAT);
                var endDate = wjcCore.Globalize.format(this.params.END_DATE, AppConstants.DATE_FORMAT);
                var exchange = this.inputExchange.text;
                var security = this.inputSecurity.text;
                var branch = this.inputBranch.text;
                var agent = this.inputAgent.text;
                //var transactionType = this.cmbTransactionType.text;
                if (this.reportType.toLowerCase() == 'summary' || this.reportType.toLowerCase() == 'resumo') {
                    this.reportService.getSecurityWiseClientActivitySummary(this.params.PARTICIPANT_ID, startDate, endDate, this.params.EXCHANGE_ID,
                        exchange, this.params.PARTICIPANT_BRANCH_ID, branch, encodeURIComponent(this.params.FROM_ACCOUNT.valueOf()), encodeURIComponent(this.params.TO_ACCOUNT.valueOf()),
                        this.params.SECURITY_ID, security, this.params.VOLUME, this.params.AGENT_ID, agent, this.params.TRANS_IDS, this.params.NAMES, this.lang)
                        .subscribe(
                            restData => {
                                this.loader.hide();
                                var reportData: any;
                                reportData = restData;
                                //var w = window.open(reportData.reportBase64/*,"_self"*/);
                                this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,','');
                                if(this.pdfSrc!=""){
                                  this.pdf=true
                                }
                                // downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
                            },
                            error => {
                                this.loader.hide();
                                this.dialogCmp.statusMsg = error.message;
                                this.dialogCmp.showAlartDialog('Error');
                            });
                } else if (this.reportType.toLowerCase() == 'detail' || this.reportType.toLowerCase() == 'detalhe') {
                    if (this.email) {
                        this.SecurityWiseClientActivityDetailWithEmail(this.params, exchange, security, branch, startDate, endDate, this.params.AGENT_ID, agent);
                    } else {
                        this.SecurityWiseClientActivityDetailWithOutEmail(this.params, exchange, security, branch, startDate, endDate, this.params.AGENT_ID, agent);
                    }
                }
            }
        }
        else
            this.transType = false;
    }

    private selectedTransTypes() {
        var items: String[] = [];
        var items_Name: String[] = [];

        if (this.transactionType.checkedItems[0].transactionTypeId == "-1") {
            for (let i = 1; i < this.transactionTypeList.length; i++) {
                items.push(this.transactionTypeList[i].transactionTypeId);
            }
            items_Name.push(this.transactionTypeList[0].transactionType);
        }
        else {
            for (let selectedTransType of this.transactionType.checkedItems) {
                items.push(selectedTransType.transactionTypeId);
                items_Name.push(selectedTransType.transactionType);
            }
        }
        this.params.TRANS_IDS = items
        this.params.NAMES = items_Name;
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
                        this.errorMessage = <any>error.message;
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
                        this.errorMessage = <any>error.message;
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
                        this.errorMessage = <any>error.message;
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
                        this.errorMessage = <any>error.message;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
        }
    }

    public SecurityWiseClientActivityDetailWithOutEmail(params, exchange, security, branch, startDate, endDate, agentId, agent) {
        this.reportService.getSecurityWiseClientActivityDetail(params.PARTICIPANT_ID, startDate, endDate, this.params.EXCHANGE_ID,
            exchange, params.PARTICIPANT_BRANCH_ID, branch, encodeURIComponent(params.FROM_ACCOUNT.valueOf()), encodeURIComponent(params.TO_ACCOUNT.valueOf()),
            params.SECURITY_ID, security, params.VOLUME, agentId, agent, params.TRANS_IDS, params.NAMES, this.lang)
            .subscribe(
                restData => {
                    this.loader.hide();
                    var reportData: any;
                    reportData = restData;
                    //var w = window.open(reportData.reportBase64/*,"_self"*/);
                    // downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
                    this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,','');
                    if(this.pdfSrc!=""){
                      this.pdf=true
                    }

                },
                error => {
                    this.loader.hide();
                    this.dialogCmp.statusMsg = error.message;
                    this.dialogCmp.showAlartDialog('Error');
                });
    }
    public SecurityWiseClientActivityDetailWithEmail(params, exchange, security, branch, startDate, endDate, agentId, agent) {
        this.reportService.getSecurityWiseClientActivityDetailWithEmail(params.PARTICIPANT_ID, startDate, endDate, this.params.EXCHANGE_ID,
            exchange, params.PARTICIPANT_BRANCH_ID, branch, encodeURIComponent(params.FROM_ACCOUNT.valueOf()), encodeURIComponent(params.TO_ACCOUNT.valueOf()),
            params.SECURITY_ID, security, params.VOLUME, agentId, agent, params.TRANS_IDS, params.NAMES, this.lang)
            .subscribe(
                restData => {
                    this.loader.hide();
                    var reportData: any;
                    reportData = restData;
                    //var w = window.open(reportData.reportBase64/*,"_self"*/);
                    this.UpdateRecords(reportData, "Mailed_Persons");
                },
                error => {
                    this.loader.hide();
                    this.dialogCmp.statusMsg = error.message;
                    this.dialogCmp.showAlartDialog('Error');
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
        let fileName = fileName_ + '.csv';
        // downloadAPI(base64Data, fileName, contentType);
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
            participantBranch: ['', Validators.compose([Validators.required])],
            securityId: ['', Validators.compose([Validators.required])],
            reportType: ['', Validators.compose([Validators.required])],
            userTypeAgentId: ['', Validators.compose([Validators.required])],
            fromClientId: ['', Validators.compose([Validators.required])],
            toClientId: ['', Validators.compose([Validators.required,])],
            fromDate: ['', Validators.compose([Validators.required])],
            toDate: ['', Validators.compose([Validators.required])],
            email: ['']
        });
    }

    public getNotification(btnClicked) {
    }
}