import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppConstants } from 'app/app.utility';
import { Params, ReportParams } from 'app/models/report-params';
import { ReportService } from 'app/services/report.service';
import { ListingService } from 'app/services/listing.service';
import { AppState } from 'app/app.service';

import { AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { AuthService2 } from 'app/services/auth2.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';


declare var jQuery: any;
// var downloadAPI = require('./../../../../../scripts/download-document');
@Component({
  selector: 'capital-gain-tax-rpt',
  templateUrl: './capital-gain-tax-rpt.html',
  encapsulation: ViewEncapsulation.None,
})
export class CapitalGainTaxRpt implements OnInit {

  //private showLoader: boolean = false;

  public myForm: FormGroup;
  public searchForm: FormGroup;

  //claims: any;
  lang: any;
  pdfSrc: String
  pdf = false
  fileNameForDownload = "CapitalGainTaxRpt.pdf"

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
  entryType: string = null;
  reportType: string = null;
  reportTypeList: any[] = [];
  marketType: string = null;
  marketTypeList: any[] = [];


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

  @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
  @ViewChild('cmbExchange') cmbExchange: wjcInput.ComboBox;
  @ViewChild('inputEntryType') inputEntryType: wjcInput.ComboBox;
  @ViewChild('inputSecurity') inputSecurity: wjcInput.ComboBox;
  @ViewChild('inputClient') inputClient: wjcInput.ComboBox;
  @ViewChild('GridFrom') GridFrom: wjcGrid.FlexGrid;
  @ViewChild('GridTo') GridTo: wjcGrid.FlexGrid;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;

  constructor(private reportService: ReportService, public userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private appState: AppState, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.initForm();
    this.isSubmitted = false;
    this.isValidStartDate = true;
    //this.claims = authService.claims;
    this.loadexchangeList();



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

  /*********************************
 *      Public & Action Methods
 *********************************/
  initForm() {

    this.reportParams = new ReportParams();
    this.params = new Params();
    this.params.START_DATE = new Date();
    this.params.END_DATE = new Date();
    this.toClientList = [];
    this.fromClientList = [];
    this.reportTypeList = this.params.getSummaryDetailOptions();
    this.marketTypeList = this.params.getMarketOptions();
    // this.marketTypeList = [{ 'name': AppConstants.ALL_STR, 'code': AppConstants.ALL_VAL }, { 'name': 'REG', 'code': 'REG' },
    // { 'name': 'FUT', 'code': 'FUT' }]; 
    // let obj = new ComboItem(AppConstants.ALL_STR, AppConstants.ALL_VAL.toString());
    // this.marketTypeList.unshift(obj);
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
    this.loader.show();
    console.log("getting exchangeList");
    this.listingService.getParticipantExchangeList(AppConstants.participantId).subscribe(
      data => {
        this.loader.hide();
        if (data != null) {
          //console.log("exchangeList: "+ data); 
          this.exchangeList = data;
          //this.exchangeId = this.exchangeList[0].exchangeId;
          var exchange: Exchange = new Exchange(AppConstants.PLEASE_SELECT_VAL, AppConstants.PLEASE_SELECT_STR, AppConstants.PLEASE_SELECT_STR);
          this.exchangeList.unshift(exchange);
          this.exchangeId = this.exchangeList[0].exchangeId;

        }
      },
      error => {
        this.loader.hide();
        this.errorMessage = <any>error.message
      });
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
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message
          });
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
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message
          });
    }
  }

  public onExchangeChange(val) {
    this.exchangeId = val;
    this.getExchangeBrokerToClients(val);
    this.getExchangeBrokerFromClients(val);
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
    if (isValid) {
      this.loader.show();

      //print report ... 
      // set parameters 
      this.params.PARTICIPANT_ID = AppConstants.participantId;
      var startDate = wjcCore.Globalize.format(this.params.START_DATE, AppConstants.DATE_FORMAT);
      var endDate = wjcCore.Globalize.format(this.params.END_DATE, AppConstants.DATE_FORMAT);
      let exchangeName: string = this.cmbExchange.getDisplayText(this.cmbExchange.selectedIndex);
      let mktType = this.marketType
      if (mktType == null)
        mktType = '-1';
      let rptType
      if (this.reportType == "Resumo"){
        rptType = "Summary"
      }
      else if(this.reportType == "Detalhe"){
        rptType = "Detail"
      }
      else if(this.reportType == "Summary"){
        rptType = "Summary"
      }
      else if(this.reportType == "Detail"){
        rptType = "Detail"
      }
      this.reportService.getCGT(this.params.PARTICIPANT_ID, startDate, endDate, this.params.EXCHANGE_ID, exchangeName, encodeURIComponent(this.params.FROM_ACCOUNT.valueOf()), encodeURIComponent(this.params.TO_ACCOUNT.valueOf()), rptType.toLowerCase(), mktType, this.lang)
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
      this.loader.show();
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
      toClientId: ['', Validators.compose([Validators.required])],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      reportType: ['', Validators.compose([Validators.required])],
      marketType: [''],
    });
  }
}