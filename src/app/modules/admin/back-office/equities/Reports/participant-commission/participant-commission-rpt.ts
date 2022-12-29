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
import { Params, ReportParams } from 'app/models/report-params';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';

var downloadAPI = require('../../../../../../scripts/download-document');



declare var jQuery: any;
AppConstants

@Component({

  selector: 'participant-commission-rpt',
  templateUrl:'./participant-commission-rpt.html',
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantCommissionRpt implements OnInit {

  public myForm: FormGroup;
  public searchForm: FormGroup;

  dateFormat: string = AppConstants.DATE_FORMAT;
  dateMask: string = AppConstants.DATE_MASK;

  //claims: any; 

  reportParams: ReportParams;
  params: Params;


  exchangeList: any[] = [];
  reportTypeList: any[] = [];

  data: any;
  lang: any
  pdfSrc: String
  pdf = false
  fileNameForDownload = "ParticipantCommissionReport.pdf"
  reportType: string = null;
  exchangeId: number = 0;
  errorMessage: string;

  public isSubmitted: boolean;
  public isValidStartDate: boolean;

  @ViewChild('cmbExchange') cmbExchange: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  participantExchangeId: any;

  constructor(private appState: AppState, private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.initForm();
    this.isSubmitted = false;
    this.isValidStartDate = true;
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

    this.reportParams = new ReportParams();
    this.params = new Params();
    this.clearFields();
    this.reportTypeList = this.params.getSummaryDetailOptions();
  }
  public clearFields() {
    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }
    if (AppUtility.isValidVariable(this.searchForm)) {
      this.searchForm.markAsPristine();
    }

    this.isSubmitted = false;


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
      var startDate = wjcCore.Globalize.format(this.params.START_DATE, AppConstants.DATE_FORMAT);
      var endDate = wjcCore.Globalize.format(this.params.END_DATE, AppConstants.DATE_FORMAT);

      if (this.reportType.toLowerCase() == 'summary' || this.reportType.toLowerCase() == "resumo") {
        this.reportService.getParticipantCommisssionSummary(this.params.PARTICIPANT_ID, startDate, endDate, this.lang)
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
            });
      } else if (this.reportType.toLowerCase() == 'detail' || this.reportType.toLowerCase() == "detalhe") {
        this.reportService.getParticipantCommisssionDetail(this.params.PARTICIPANT_ID, startDate, endDate,this.lang)
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
            });
      }

    }

  }

  public getNotification(btnClicked) {
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      reportType: ['', Validators.compose([Validators.required])],
    });
  }

}