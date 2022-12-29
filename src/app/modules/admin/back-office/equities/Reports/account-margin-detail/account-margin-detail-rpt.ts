import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core'; AppConstants
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Agent } from 'app/models/agent';
import { Exchange } from 'app/models/exchange';
import { ParticipantBranch } from 'app/models/participant-branches';
import { Params, ReportParams } from 'app/models/report-params';
import { Security } from 'app/models/security';
import { AuthService2 } from 'app/services/auth2.service';
import { ReportService } from 'app/services/report.service';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';
import { AppState } from 'app/app.service';
import { ListingService } from 'app/services/listing.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';


declare var jQuery: any;
// var downloadAPI = require('../../../../../../scripts/download-document');

@Component({
    selector: 'account-margin-detail-rpt',
    templateUrl: './account-margin-detail-rpt.html',
    encapsulation: ViewEncapsulation.None,
})
export class AccountMarginDetailRpt implements OnInit {

    //private showLoader: boolean = false;
    public myForm: FormGroup;
    public searchForm: FormGroup;

    //claims: any;

    reportParams: ReportParams;
    params: Params;

    reportType: string = null;
    reportTypeList: any[] = [];

    dateFormat: string = AppConstants.DATE_FORMAT;
    dateMask: string = AppConstants.DATE_MASK;

    exchangeList: any[] = [];
    participantBranchList: any[] = [];
    clientCustodianList: any[] = [];
    toClientList: any[] = [];
    fromClientList: any[] = [];
    securityList: any[] = [];
    agentList: any[] = [];

    entryType: string = null;
    public isValidReport: boolean;
    custodianExist: boolean = false;
    custodianId: Number = null;
    public userTypeAgentId: Number;
    isItemsListStatusNew: boolean = false;

    itemsList: wjcCore.CollectionView;
    data: any;
    lang: any
    pdfSrc: String
    pdf = false
    fileNameForDownload = "AccountMarginDetailReport.pdf"

    exchangeId: number = 0;
    errorMessage: string;

    public isSubmitted: boolean;
    public isValidStartDate: boolean;

    private _pageSize = 0;

    public recExist: boolean;
    active: boolean = false;

    @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
    @ViewChild('inputExchange') inputExchange: wjcInput.ComboBox;
    @ViewChild('inputBranch') inputBranch: wjcInput.ComboBox;
    @ViewChild('inputSecurity') inputSecurity: wjcInput.ComboBox;
    @ViewChild('inputAgent') inputAgent: wjcInput.ComboBox;
    @ViewChild('GridFrom') GridFrom: wjcGrid.FlexGrid;
    @ViewChild('GridTo') GridTo: wjcGrid.FlexGrid;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    participantExchangeId: any;

    constructor(private reportService: ReportService, private userService: AuthService2,
        private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private appState: AppState, private loader: FuseLoaderScreenService, private translate: TranslateService,) {
        this.initForm();
        this.isSubmitted = false;
        this.isValidStartDate = true;
        this.isValidReport = true;
        //this.claims = authService.claims;
        this.loadexchangeList();

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

        this.reportParams = new ReportParams();
        this.params = new Params();
        this.params.START_DATE = new Date();
        this.params.END_DATE = new Date();
        this.params.DATE = new Date();
        this.securityList = [];
        this.toClientList = [];
        this.fromClientList = [];
        this.reportTypeList = this.params.getAMDReportFormatOptions();
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
        this.custodianExist = false;
        this.isSubmitted = false;
        this.active = false;
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
    getExchangeBrokerFromClients(agentId) {

        this.fromClientList = [];
        if (AppUtility.isValidVariable(agentId)) {
            this.loader.show();
            if (agentId == -1) {
                this.listingService.getClientBasicInfoListByExchangeBroker(this.exchangeId, AppConstants.participantId, false, true)
                    .subscribe(restData => {

                        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                            this.fromClientList = restData;
                        }
                        this.loader.hide();
                    },
                        error => { this.loader.hide(); this.errorMessage = <any>error });
            }
            else {
                this.listingService.getClientBasicInfoListByExchangeBrokerAgent(this.exchangeId, AppConstants.participantId, agentId, false, true)
                    .subscribe(restData => {

                        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                            this.fromClientList = restData;
                        }
                        this.loader.hide();
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

                        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                            this.toClientList = restData;
                        }
                        this.loader.hide();
                    },
                        error => { this.loader.hide(); this.errorMessage = <any>error });
            }
            else {
                this.listingService.getClientBasicInfoListByExchangeBrokerAgent(this.exchangeId, AppConstants.participantId, agentId, false, false)
                    .subscribe(restData => {

                        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                            this.toClientList = restData;
                        }
                        this.loader.hide();
                    },
                        error => { this.loader.hide(); this.errorMessage = <any>error });
            }
        }
    }

    public onExchangeChange(val) {
        this.populateAgentList();
        this.getSecuritiesByExchange(val);
        this.exchangeId = val;
        this.getExchangeBrokerToClients(-1);
        this.getExchangeBrokerFromClients(-1);
    }

    public onAgentChange(val) {
        this.getExchangeBrokerFromClients(val);
        this.getExchangeBrokerToClients(val);
    }

    public getSecuritiesByExchange(exchangeId) {
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
        if (this.reportType == null) {
            this.isValidReport = false;
            isValid = false;
        } else {
            this.isValidReport = true;
        }
        if (isValid) {
            this.loader.show();
            //print report ... 
            // set parameters 
            this.params.PARTICIPANT_ID = AppConstants.participantId;
            var startDate = wjcCore.Globalize.format(this.params.START_DATE, AppConstants.DATE_FORMAT);
            var endDate = wjcCore.Globalize.format(this.params.END_DATE, AppConstants.DATE_FORMAT);
            var closePriceDate = wjcCore.Globalize.format(this.params.DATE, AppConstants.DATE_FORMAT);
            var exchange = this.inputExchange.text;
            var branch = this.inputBranch.text;
            var security = this.inputSecurity.text;
            var agent = this.inputAgent.text;
            let rptType = this.reportType.toLowerCase()
           
            switch (this.reportType.toLowerCase()) {
              case 'formato-1':
                rptType = 'format-1'
                break;
              case 'resumo':
                rptType = 'summary'
                break;
              case 'format-1-summary':
                rptType = 'format-1-summary'
                break;
            }

            this.reportService.getAccountMarginDetail(this.params.PARTICIPANT_ID, startDate, endDate, this.params.EXCHANGE_ID,
                exchange, this.params.PARTICIPANT_BRANCH_ID, branch, encodeURIComponent(this.params.FROM_ACCOUNT.valueOf()),
                encodeURIComponent(this.params.TO_ACCOUNT.valueOf()), this.params.SECURITY_ID, security, closePriceDate, this.params.AGENT_ID, agent, this.active, rptType, this.lang)
                .subscribe(
                    restData => {
                        this.loader.hide();
                        var reportData: any;
                        reportData = restData;
                        // var w = window.open(reportData.reportBase64/*,"_self"*/);
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
                        //  alert(error);
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
            this.listingService.getClientListByExchangeBroker(this.params.EXCHANGE_ID, AppConstants.participantId, true, true)
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

    public getNotification(btnClicked) {
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
            participantBranch: ['', Validators.compose([Validators.required])],
            securityId: ['', Validators.compose([Validators.required])],
            fromClientId: ['', Validators.compose([Validators.required])],
            toClientId: ['', Validators.compose([Validators.required])],
            fromDate: ['', Validators.compose([Validators.required])],
            toDate: ['', Validators.compose([Validators.required])],
            closePriceDate: ['', Validators.compose([Validators.required])],
            userTypeAgentId: ['', Validators.compose([Validators.required])],
            active: [''],
            reportType: [''],
        });
    }
}