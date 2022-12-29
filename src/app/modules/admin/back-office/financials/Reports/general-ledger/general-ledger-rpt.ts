import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppState } from 'app/app.service';
import { ReportService } from 'app/services/report.service';
import { VoucherType } from 'app/models/voucher-type';
import { Params, ReportParams } from 'app/models/report-params';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { ListingService } from 'app/services/listing.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';

import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { AuthService2 } from 'app/services/auth2.service';
import { AppConstants, AppUtility } from 'app/app.utility';


declare var jQuery: any;
// var downloadAPI = require('./../../../../../scripts/download-document');

@Component({

  selector: 'general-ledger-rpt',
  templateUrl: './general-ledger-rpt.html',
  encapsulation: ViewEncapsulation.None,
})
export class GeneralLedgerRpt implements OnInit {

  public myForm: FormGroup;
  public searchForm: FormGroup;

  //claims: any;

  lang: any;
  pdfSrc: String
  pdf = false
  fileNameForDownload = "GeneralLedgerRpt.pdf";

  reportParams: ReportParams;
  params: Params;

  dateFormat: string = AppConstants.DATE_FORMAT;
  dateMask: string = AppConstants.DATE_MASK;

  exchangeList: any[] = [];
  fromChartOfAccountList: any[] = [];
  toChartOfAccountList: any[] = [];
  voucherTypeList: any[] = [];
  clientCustodianList: any[] = [];
  clientList: any[] = [];
  securityList: any[] = [];
  entryTypeList: any[] = [];
  postedList: any[] = [];
  entryType: string = null;
  dateComparison: boolean = true;
  checkFromAccount: boolean = true;
  checkToAccount: boolean = true;
  custodianExist: boolean = false;
  custodianId: Number = null;

  isItemsListStatusNew: boolean = false;

  itemsList: wjcCore.CollectionView;
  data: any;

  exchangeId: number = 0;
  errorMessage: string;

  reportType: string = null;
  reportTypeList: any[] = [];
  public isValidReport: boolean;

  public isSubmitted: boolean;

  private _pageSize = 0;

  @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
  @ViewChild('voucherType') voucherType: wjcInput.ComboBox;
  @ViewChild('inputSecurity') inputSecurity: wjcInput.ComboBox;
  @ViewChild('inputClient') inputClient: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;

  constructor(private appState: AppState, private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.initForm();
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang);
    //_______________________________for ngx_translate_________________________________________

    this.isSubmitted = false;
    this.isValidReport = true;
    //this.claims = authService.claims;
    this.populateToChartOfAccountList();
    this.populateFromChartOfAccountList();
    // this.loadexchangeList();
    this.loadPostedList();
    this.loadVoucherTypeList();
    this.dateComparison = true;
    this.checkFromAccount = true;
    this.checkToAccount = true;

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
    this.params.POSTED = this.params.VOUCHER_TYPE_ID = -1;
    this.reportTypeList = this.params.getReportFormatOptions();

    this.clearFields();
  }

  public clearFields() {
    this.isSubmitted = false;
    this.dateComparison = true;
    this.checkFromAccount = true;
    this.checkToAccount = true;
  }

  loadPostedList(): void {
    AppUtility.printConsole('in loadPostedList');

    switch (this.lang) {
      case "en":
        this.postedList = [{ 'name': AppConstants.ALL_STR, 'code': AppConstants.ALL_VAL },
        { 'name': 'Posted', 'code': 1 }, { 'name': 'UnPosted', 'code': 0 }];
        break;

      case "pt":
        this.postedList = [{ 'name': AppConstants.ALL_STR, 'code': AppConstants.ALL_VAL },
        { 'name': 'Publicado', 'code': 1 }, { 'name': 'Não Postado', 'code': 0 }];
        break;

      default:
        this.postedList = [{ 'name': AppConstants.ALL_STR, 'code': AppConstants.ALL_VAL },
        { 'name': 'Posted', 'code': 1 }, { 'name': 'UnPosted', 'code': 0 }];
    }
  }

  loadVoucherTypeList(): void {
    console.log('in loadVoucherTypeList');
    this.listingService.getVoucherTypeList(AppConstants.participantId).subscribe(
      data => {
        if (data != null) {
          this.voucherTypeList = data;
          let oVT: VoucherType = new VoucherType();
          oVT.voucherTypeId = AppConstants.ALL_VAL;
          oVT.typeDesc = AppConstants.ALL_STR;
          this.voucherTypeList.unshift(oVT);
        }
      },
      error => this.errorMessage = <any>error.message);
  }

  public populateToChartOfAccountList() {
    this.listingService.getBindedAndSortedChartOfAccountBasicInfoList(AppConstants.participantId, false)
      .subscribe(
        restData => {
          this.toChartOfAccountList = JSON.parse(JSON.stringify(restData));
        },
        error => this.errorMessage = <any>error.message);
  }

  public populateFromChartOfAccountList() {
    this.listingService.getBindedAndSortedChartOfAccountBasicInfoList(AppConstants.participantId, true)
      .subscribe(
        restData => {
          this.fromChartOfAccountList = restData;
        },
        error => this.errorMessage = <any>error.message);
  }

  public printReport(model: any, isValid: boolean) {
    AppUtility.printConsole('in printReport: ' + isValid);
    console.log(this.params);
    this.isSubmitted = true;
    if (!this.params.TO_ACCOUNT && !this.params.FROM_ACCOUNT) {
      this.checkFromAccount = false;
      this.checkToAccount = false;
      return;
    } else if (!this.params.FROM_ACCOUNT) {
      this.checkFromAccount = false;
      return;
    } else if (!this.params.TO_ACCOUNT) {
      this.checkToAccount = false;
      return;
    }
    if (this.params.START_DATE > this.params.END_DATE) {
      this.dateComparison = false;
      return;
    }
    else
      this.dateComparison = true;
    this.checkFromAccount = true;
    this.checkToAccount = true;
    if (this.reportType == null) {
      this.isValidReport = false;
      isValid = false;
    } else {

      if (this.reportType == "Formato-1") {
        this.reportType = "Format-1"
      }
      else if (this.reportType == "Formato-2") {
        this.reportType = "Format-2"
      }

      this.isValidReport = true;
    }
    if (isValid) {
      this.loader.show();
      let fromDateString: string;
      let toDateString: string;
      fromDateString = wjcCore.Globalize.format(this.params.START_DATE, AppConstants.DATE_FORMAT);
      toDateString = wjcCore.Globalize.format(this.params.END_DATE, AppConstants.DATE_FORMAT);
      this.reportParams.setParams(this.params);
      AppUtility.printConsole('params: ' + JSON.stringify(this.params));
      this.listingService.getGeneralLedgerReport(AppConstants.participantId, encodeURIComponent(this.params.FROM_ACCOUNT.toString()),
        encodeURIComponent(this.params.TO_ACCOUNT.toString()), fromDateString, toDateString, this.params.VOUCHER_TYPE_ID,
        this.voucherType.text, this.params.POSTED, this.reportType.toLowerCase(),this.lang)
        .subscribe(restData => {
          this.loader.hide();
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
            this.loader.hide();
            this.dialogCmp.statusMsg = error.message;
            this.dialogCmp.showAlartDialog('Error');
          });
    }

  }

  public getNotification(btnClicked) {
  }

  public addFromValidations() {
    this.myForm = this._fb.group({
      posted: ['', Validators.compose([Validators.required])],
      voucherType: ['', Validators.compose([Validators.required])],
      fromClientId: ['', Validators.compose([Validators.required])],
      toClientId: ['', Validators.compose([Validators.required])],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      reportType: [''],
    });
  }
}
