import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { ParticipantBranch } from 'app/models/participant-branches';
import { Params, ReportParams } from 'app/models/report-params';
import { Security } from 'app/models/security';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';

var downloadAPI = require('../../../../../../scripts/download-document');

declare var jQuery: any;


@Component({
  selector: 'share-holding-rpt',
  templateUrl: './share-holding-rpt.html',
  encapsulation: ViewEncapsulation.None,
})
export class ShareHoldingRpt implements OnInit {

  //private showLoader: boolean = false;
  public myForm: FormGroup;
  public searchForm: FormGroup;

  //claims: any;

  reportParams: ReportParams;
  params: Params;

  reportType: string = null;
  reportTypeList: any[] = [];
  reportFormatList: any[] = [];
  reportFormat: string = 'PDF';
  netHolding: string = 'All';
  netHoldingList: any[] = [];

  dateFormat: string = AppConstants.DATE_FORMAT;
  dateMask: string = AppConstants.DATE_MASK;

  exchangeList: any[] = [];
  participantBranchList: any[] = [];
  clientCustodianList: any[] = [];
  toClientList: any[] = [];
  fromClientList: any[] = [];
  securityList: any[] = [];


  entryType: string = null;

  custodianExist: boolean = false;
  custodianId: Number = null;

  isItemsListStatusNew: boolean = false;

  itemsList: wjcCore.CollectionView;
  data: any;

  exchangeId: number = 0;
  errorMessage: string;
  lang: any
  pdfSrc: String
  pdf = false
  fileNameForDownload = "ShareHoldingReport.pdf"
  public isSubmitted: boolean;
  public isValidStartDate: boolean;

  private _pageSize = 0;

  public recExist: boolean;

  @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
  @ViewChild('inputExchange') inputExchange: wjcInput.ComboBox;
  @ViewChild('inputBranch') inputBranch: wjcInput.ComboBox;
  @ViewChild('inputSecurity') inputSecurity: wjcInput.ComboBox;
  @ViewChild('GridFrom') GridFrom: wjcGrid.FlexGrid;
  @ViewChild('GridTo') GridTo: wjcGrid.FlexGrid;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  participantExchangeId: any;

  constructor(private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private appState: AppState, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.initForm();
    this.isSubmitted = false;
    this.isValidStartDate = true;
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
    this.netHoldingList = this.params.getNetHoldingTypeForShareHolding();
    this.netHolding = this.netHoldingList[0].value
    this.reportTypeList = this.params.getReportFormatOptionsForShareHolding();
    this.reportFormatList = this.params.getReportFormatTypeOptions();
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

  public onExchangeChange(val) {
    this.getExchangeBrokerToClients(val);
    this.getExchangeBrokerFromClients(val);
    this.getSecuritiesByExchange(val);
  }

  public getSecuritiesByExchange(exchangeId) {
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
    let netHolding = this.netHolding
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
      var startDate = wjcCore.Globalize.format(this.params.START_DATE, AppConstants.DATE_FORMAT);
      var endDate = wjcCore.Globalize.format(this.params.END_DATE, AppConstants.DATE_FORMAT);
      var tradeDate = wjcCore.Globalize.format(this.params.TRADE_DATE, AppConstants.DATE_FORMAT);
      var closePriceDate = wjcCore.Globalize.format(this.params.DATE, AppConstants.DATE_FORMAT);
      var exchange = this.inputExchange.text;
      var branch = this.inputBranch.text;
      var security = this.inputSecurity.text;
      debugger
      if (security === "Tudo") {
        security = "ALL"
      }
      if (branch === "Tudo") {
        branch = "ALL"
      }
      if (this.netHolding === "Tudo") {
        netHolding = "ALL"
      }
      if (branch.indexOf('[') > -1) {
        let removeLeftBracket = branch.replace("[", " ");
        let removeRightBracket = removeLeftBracket.replace("]", " ");
        branch = removeRightBracket
      }
      console.log(security, branch)

      if (this.reportType.toLowerCase() == 'client-wise' || this.reportType.toLowerCase() == 'com relacao ao cliente') {
        if (this.params.START_DATE > this.params.TRADE_DATE) {
          this.loader.hide();
          this.dialogCmp.statusMsg = 'From Date should be less or equal than Trade Date.';
          this.dialogCmp.showAlartDialog('Warning');
          return;
        }
        debugger
        this.reportService.getShareHoldingClientWise(this.params.PARTICIPANT_ID, startDate, endDate, tradeDate, this.params.EXCHANGE_ID,
          exchange, this.params.PARTICIPANT_BRANCH_ID, branch, encodeURIComponent(this.params.FROM_ACCOUNT.valueOf()),
          encodeURIComponent(this.params.TO_ACCOUNT.valueOf()), this.params.SECURITY_ID, security, closePriceDate, netHolding.toLowerCase(), this.reportFormat.toLowerCase(), this.lang)
          .subscribe(
            restData => {
              debugger
              this.loader.hide();
              var reportData: any;
              reportData = restData;
              // var w = window.open(reportData.reportBase64/*,"_self"*/);
              if (this.reportFormat.toLowerCase() == "csv") {
                downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
              }
              else {
                this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,', '');
                if (this.pdfSrc != "") {
                  this.pdf = true
                }
              }
            },
            error => {
              debugger
              this.loader.hide();
              this.dialogCmp.statusMsg = error.message;
              this.dialogCmp.showAlartDialog('Error');
              //  alert(error);
            });
      }
      else if (this.reportType.toLowerCase() == 'security-wise' || this.reportType.toLowerCase() == 'seguranca') {
        this.reportService.getShareHoldingSecurityWise(this.params.PARTICIPANT_ID, startDate, endDate, this.params.EXCHANGE_ID,
          exchange, this.params.PARTICIPANT_BRANCH_ID, branch, encodeURIComponent(this.params.FROM_ACCOUNT.valueOf()),
          encodeURIComponent(this.params.TO_ACCOUNT.valueOf()), this.params.SECURITY_ID, security, closePriceDate, netHolding.toLowerCase(), this.reportFormat.toLowerCase(), this.lang)
          .subscribe(
            restData => {
              this.loader.hide();
              var reportData: any;
              reportData = restData;
              // var w = window.open(reportData.reportBase64/*,"_self"*/);
              if (this.reportFormat.toLowerCase() == "csv") {
                downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
              }
              else {
                this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,', '');
                if (this.pdfSrc != "") {
                  this.pdf = true
                }
              }
            },
            error => {
              this.loader.hide();
              this.dialogCmp.statusMsg = error.message;
              this.dialogCmp.showAlartDialog('Error');
              //  alert(error);
            });
      }
      else if (this.reportType.toLowerCase() == 'security-wise-summary' || this.reportType.toLowerCase() == 'seguranca-resumo') {
        this.reportService.getShareHoldingSecurityWiseSummary(this.params.PARTICIPANT_ID, startDate, endDate, this.params.EXCHANGE_ID,
          exchange, this.params.PARTICIPANT_BRANCH_ID, branch, encodeURIComponent(this.params.FROM_ACCOUNT.valueOf()),
          encodeURIComponent(this.params.TO_ACCOUNT.valueOf()), this.params.SECURITY_ID, security, closePriceDate, netHolding.toLowerCase(), this.reportFormat.toLowerCase(), this.lang)
          .subscribe(
            restData => {
              this.loader.hide();
              var reportData: any;
              reportData = restData;
              // var w = window.open(reportData.reportBase64/*,"_self"*/);
              if (this.reportFormat.toLowerCase() == "csv") {
                downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
              }
              else {
                this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,', '');
                if (this.pdfSrc != "") {
                  this.pdf = true
                }
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
      securityId: ['', Validators.compose([Validators.required])],
      fromClientId: ['', Validators.compose([Validators.required])],
      toClientId: ['', Validators.compose([Validators.required])],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      tradeDate: ['', Validators.compose([Validators.required])],
      closePriceDate: ['', Validators.compose([Validators.required])],
      reportType: ['', Validators.compose([Validators.required])],
      netHolding: ['', Validators.compose([Validators.required])],
      reportFormat: ['', Validators.compose([Validators.required])]
    });
  }
}