import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Params, ReportParams } from 'app/models/report-params';
import { AppConstants } from 'app/app.utility';

import { AuthService2 } from 'app/services/auth2.service';
import { AppState } from 'app/app.service';
import { ReportService } from 'app/services/report.service';
import { ListingService } from 'app/services/listing.service';
import { AppUtility } from 'app/app.utility';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';

declare var jQuery: any;
// var downloadAPI = require('./../../../../../scripts/download-document');
@Component({

  selector: 'profit-loss-statement-rpt',
  templateUrl: './profit-loss-statement-rpt.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProfitLossStatementRpt implements OnInit {
  public myForm: FormGroup;
  public searchForm: FormGroup;

  //claims: any;

  
  lang: any;
  pdfSrc: String
  pdf = false
  fileNameForDownload = "ProfitLossStatementRpt.pdf"

  reportParams: ReportParams;
  params: Params;

  dateFormat: string = AppConstants.DATE_FORMAT;
  dateMask: string = AppConstants.DATE_MASK;

  exchangeList: any[] = [];
  clientCustodianList: any[] = [];
  clientList: any[] = [];
  securityList: any[] = [];
  entryTypeList: any[] = [];
  headLevelList: any[];
  headLevel: number = 0;

  entryType: string = null;

  custodianExist: boolean = false;
  custodianId: Number = null;

  isItemsListStatusNew: boolean = false;

  itemsList: wjcCore.CollectionView;;
  data: any;

  exchangeId: number = 0;
  errorMessage: string;

  public isSubmitted: boolean;

  private _pageSize = 0;

  @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
  @ViewChild('inputEntryType') inputEntryType: wjcInput.ComboBox;
  @ViewChild('inputSecurity') inputSecurity: wjcInput.ComboBox;
  @ViewChild('inputClient') inputClient: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;

  constructor(private appState: AppState, private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder , private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.initForm();
    this.isSubmitted = false;
    //this.claims = authService.claims;
    this.params.HEAD_LEVEL = 1;
    this.loadheadLevel();

    //_______________________________for ngx_translate_________________________________________

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
    this.securityList = [];
    this.clientList = [];
    //this.entryTypeList = StockDepositWithdraw.getEntryTypesList();
    this.clearFields();
  }

  public clearFields() {
    // if (AppUtility.isValidVariable(this.myForm)) {
    //   this.myForm.markAsPristine();
    // }
    // if (AppUtility.isValidVariable(this.searchForm)) {
    //   this.searchForm.markAsPristine();
    // }

    this.securityList = [];
    this.clientList = [];
    this.clientCustodianList = [];
    this.headLevelList = [];
    this.custodianExist = false;
    this.isSubmitted = false;
  }

  loadheadLevel(): void {
    AppUtility.printConsole('in loadheadLevel');
    let headLevels: any[] = [];
    this.listingService.getLastHeadLevel(AppConstants.participantId).subscribe(
      data => {
        AppUtility.printConsole('complete headlevel: ' + JSON.stringify(data));
        this.headLevel = data.headLevel;
        if (this.headLevel !== 0) {
          this.headLevelList = this.params.getHeadLevelOptions(data.headLevel);
          // for (let i: number = 1; i <= this.headLevel; i++)
          //   headLevels[i] = { 'name': i.toString(), 'code': i };
        }
        // this.headLevelList = headLevels;
      },
      error => this.errorMessage = <any>error.message);
  }

  public printReport(model: any, isValid: boolean) {


    AppUtility.printConsole("onSave Action, isValid: " + isValid);

    this.isSubmitted = true;

    if (isValid) {
      this.loader.show();
      let asOnDateString: string;
      asOnDateString = wjcCore.Globalize.format(this.params.DATE, AppConstants.DATE_FORMAT);
      this.reportParams.setParams(this.params);
      AppUtility.printConsole('params: ' + JSON.stringify(this.params));
      this.listingService.getProfitLossStatementReport(AppConstants.participantId, this.params.HEAD_LEVEL, asOnDateString,this.lang)
        .subscribe(
        restData => {
          this.loader.hide();
          let reportData: any;
          reportData = restData;
          //let w = window.open(reportData.reportBase64);
          // downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
          this.pdfSrc = reportData.reportBase64.replace('data:application/pdf;base64,', '');
                if (this.pdfSrc != "") {
                    this.pdf = true;
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

  private addFromValidations() {
    this.myForm = this._fb.group({
      headLevelId: ['', Validators.compose([Validators.required])],
      AsOnDate: ['', Validators.compose([Validators.required])],
    });
  }

}