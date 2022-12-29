import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Params, ReportParams } from 'app/models/report-params';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { ReportService } from 'app/services/report.service';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { ParticipantBranch } from 'app/models/participant-branches';
import { Agent } from 'app/models/agent';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';



declare var jQuery: any;
// var downloadAPI = require('./../../../../../scripts/download-document');

@Component({
  selector: 'clients-cash-balance-rpt',
  templateUrl: './clients-cash-balance-rpt.html',
  encapsulation: ViewEncapsulation.None,
})
export class ClientsCashBalanceRpt implements OnInit {
  public myForm: FormGroup;
  public searchForm: FormGroup;
  //claims: any;

  lang: any;
  pdfSrc: String
  pdf = false
  fileNameForDownload = "ClientsCashBalanceRpt.pdf"


  reportParams: ReportParams;
  params: Params;
  dateFormat: string = AppConstants.DATE_FORMAT;
  dateMask: string = AppConstants.DATE_MASK;
  exchangeList: any[] = [];
  clientCustodianList: any[] = [];
  toClientList: any[] = [];
  fromClientList: any[] = [];
  securityList: any[] = [];
  entryTypeList: any[] = [];
  clientList: any[] = [];
  balanceList: any[] = [];
  participantBranchList: any[] = [];
  agentList: any[] = [];
  entryType: string = null;
  reportType: string = null;
  reportTypeList: any[] = [];
  custodianExist: boolean = false;
  custodianId: Number = null;
  isItemsListStatusNew: boolean = false;
  itemsList: wjcCore.CollectionView;;
  data: any;
  exchangeId: number = 0;
  errorMessage: string;
  public isSubmitted: boolean;
  public isValidStartDate: boolean;
  private _pageSize = 0;
  public recExist: boolean;
  public userTypeAgentId: Number;

  @ViewChild('cmbExchange') cmbExchange: wjcInput.ComboBox;
  @ViewChild('GridFrom') GridFrom: wjcGrid.FlexGrid;
  @ViewChild('GridTo') GridTo: wjcGrid.FlexGrid;
  @ViewChild('client') inputEntryType: wjcInput.ComboBox;
  @ViewChild('balance') inputSecurity: wjcInput.ComboBox;
  @ViewChild('inputBranch') inputBranch: wjcInput.ComboBox;
  @ViewChild('inputAgent') inputAgent: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;

  constructor(private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private appState: AppState , private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.initForm();
    this.isSubmitted = false;
    this.isValidStartDate = true;
    this.loadClient();
    this.loadBalance();
    this.params.CLIENT = -1;
    this.params.BALANCE = 'ALL';
    //this.claims = authService.claims;
    this.loadexchangeList();
    this.populateParticipantBranchList();



    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang);
  }

  ngOnInit() {
    // Add Form Validations
    this.addFromValidations();
  }

  ngAfterViewInit() {
  }

  initForm() {
    this.reportParams = new ReportParams();
    this.params = new Params();
    this.params.START_DATE = new Date();
    this.params.END_DATE = new Date();
    this.toClientList = [];
    this.fromClientList = [];
    this.clientList = [];
    this.balanceList = [];
    this.reportTypeList = this.params.getReportFormatOptionsForClientCashBalance();
    this.clearFields();
  }

  public clearFields() {
    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }
    if (AppUtility.isValidVariable(this.searchForm)) {
      this.searchForm.markAsPristine();
    }
    this.toClientList = [];
    this.fromClientList = [];
    this.clientList = [];
    this.balanceList = [];
    this.isSubmitted = false;
  }

  loadClient(): void {
    AppUtility.printConsole('in loadClient');
    this.clientList = [{ 'name': AppConstants.ALL_STR, 'code': AppConstants.ALL_VAL },
    { 'name': 'ACTIVE', 'code': 1 }, { 'name': 'INACTIVE', 'code': 0 }];
  }

  loadBalance(): void {
    AppUtility.printConsole('in loadBalance');
    this.balanceList = [{ 'name': AppConstants.ALL_STR, 'code': 'ALL' },
    { 'name': 'NON-ZERO', 'code': 'NON-ZERO' }, { 'name': 'CREDIT', 'code': 'CREDIT' },
    { 'name': 'DEBIT', 'code': 'DEBIT' }];
  }

  loadexchangeList(): void {
    console.log('getting exchangeList');
    this.listingService.getParticipantExchangeList(AppConstants.participantId).subscribe(
      data => {
        if (data != null) {
          this.exchangeList = data;
          let exchange: Exchange = new Exchange(AppConstants.PLEASE_SELECT_VAL, AppConstants.PLEASE_SELECT_STR, AppConstants.PLEASE_SELECT_STR);
          this.exchangeList.unshift(exchange);
          this.exchangeId = this.exchangeList[0].exchangeId;
        }
      },
      error => this.errorMessage = <any>error.message);
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
        error => this.errorMessage = <any>error.message);
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
            error => {this.loader.hide(); this.errorMessage = <any>error.message });
      }
      else {
        this.listingService.getClientBasicInfoListByExchangeBrokerAgent(this.exchangeId, AppConstants.participantId, agentId, false, true)
          .subscribe(restData => {
           this.loader.hide();
            if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
              this.fromClientList = restData;
            }
          },
            error => {this.loader.hide(); this.errorMessage = <any>error.message });
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
            error => {this.loader.hide(); this.errorMessage = <any>error.message });
      }
      else {
        this.listingService.getClientBasicInfoListByExchangeBrokerAgent(this.exchangeId, AppConstants.participantId, agentId, false, false)
          .subscribe(restData => {
           this.loader.hide();
            if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
              this.toClientList = restData;
            }
          },
            error => {this.loader.hide(); this.errorMessage = <any>error.message });
      }
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
          error => this.errorMessage = <any>error.message);
    }
  }

  public onAgentChange(val) {
    this.getExchangeBrokerFromClients(val);
    this.getExchangeBrokerToClients(val);
  }

  public onExchangeChange(val) {
    this.exchangeId = val;
    this.getExchangeBrokerFromClients(-1);
    this.getExchangeBrokerToClients(-1);
    this.populateAgentList();
  }

  public printReport(model: any, isValid: boolean) {
    AppUtility.printConsole('onSave Action, isValid: ' + isValid);
    this.isSubmitted = true;
    // check start and end date
    if (this.params.START_DATE.setHours(0, 0, 0, 0) > this.params.END_DATE.setHours(0, 0, 0, 0)) {
      this.isValidStartDate = false;
      isValid = false;
    } else {
      this.isValidStartDate = true;
    }
    if (isValid) {
      this.loader.show();
      this.params.PARTICIPANT_ID = AppConstants.participantId;
      let startDate = wjcCore.Globalize.format(this.params.START_DATE, AppConstants.DATE_FORMAT);     
      let exchangeName: string = this.cmbExchange.getDisplayText(this.cmbExchange.selectedIndex);
      var branch = this.inputBranch.text;
      var agent = this.inputAgent.text;
  




      this.reportService.getClientsCashBalanceReport(AppConstants.participantId, this.params.CLIENT, this.params.BALANCE, this.params.EXCHANGE_ID, exchangeName,
        encodeURIComponent(this.params.FROM_ACCOUNT.valueOf()), encodeURIComponent(this.params.TO_ACCOUNT.valueOf()), startDate,this.params.PARTICIPANT_BRANCH_ID, branch, this.params.AGENT_ID, agent,this.reportType.toLowerCase(),this.lang)
        .subscribe(
          restData => {
            this.loader.hide();;
            let reportData: any;
            reportData = restData;
            //let w = window.open(reportData.reportBase64);
            // downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
            this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,', '');
            if (this.pdfSrc != "") {
                this.pdf = true
            }

          },
          error => {
            this.loader.hide();;
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

  public getNotification(btnClicked) {
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
      fromClientId: ['', Validators.compose([Validators.required])],
      toClientId: ['', Validators.compose([Validators.required,])],
      fromDate: ['', Validators.compose([Validators.required])],     
      client: ['', Validators.compose([Validators.required])],
      balance: ['', Validators.compose([Validators.required])],
      userTypeAgentId: ['', Validators.compose([Validators.required])],
      participantBranch: ['', Validators.compose([Validators.required])],
      reportType: ['', Validators.compose([Validators.required])],
    });
  }
}
