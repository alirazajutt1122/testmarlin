import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Agent } from 'app/models/agent';
import { Params, ReportParams } from 'app/models/report-params';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';
import { DialogCmp } from '../../../user-site/dialog/dialog.component';

var downloadAPI = require('../../../../../../scripts/download-document');

declare var jQuery: any;


@Component({

  selector: 'agent-commission-rpt',
  templateUrl: './agent-commission-rpt.html',
  encapsulation: ViewEncapsulation.None,
})
export class AgentCommissionRpt implements OnInit {

  public myForm: FormGroup;
  public searchForm: FormGroup;

  //claims: any; 

  dateFormat: string = AppConstants.DATE_FORMAT;
  dateMask: string = AppConstants.DATE_MASK;

  reportParams: ReportParams;
  params: Params;


  exchangeList: any[] = [];
  reportTypeList: any[] = [];
  agentList: any[] = [];

  data: any;
  lang: any
  pdfSrc: String
  pdf = false
  fileNameForDownload = "AgentCommissionReport.pdf"
  reportType: string = null;
  exchangeId: number = 0;
  errorMessage: string;
  public isValidReport: boolean;
  public userTypeAgentId: Number;
  public isSubmitted: boolean;
  public isValidStartDate: boolean;

  @ViewChild('cmbExchange') cmbExchange: wjcInput.ComboBox;
  @ViewChild('inputAgent') inputAgent: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;

  constructor(private appState: AppState, private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.initForm();
    this.isSubmitted = false;
    this.isValidStartDate = true;
    this.isValidReport = true;
    //this.claims = authService.claims; 
    this.populateAgentList();
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    if (this.lang == 'pt') {
      AppConstants.PLEASE_SELECT_STR = "Selecione";
    }
    //______________________________for ngxtranslate__________________________________________
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
    this.reportTypeList = this.params.getAgentReportFormatOptions();
    this.clearFields();
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
      var agent_name = this.inputAgent.text;
      let rptType = this.reportType.toLowerCase()

      switch (this.reportType.toLowerCase()) {
        case 'formato-1':
          rptType = 'format-1'
          break;
        case 'resumo':
          rptType = 'summary'
          break;
        case 'detalhe':
          rptType = 'detail'
          break;
      }
      this.reportService.getAgentCommissionSummary(this.params.PARTICIPANT_ID, startDate, endDate, this.params.AGENT_ID, agent_name, rptType, this.lang)
        .subscribe(
          restData => {
            this.loader.hide();
            var reportData: any;
            reportData = restData;
            //  var w = window.open(reportData.reportBase64/*,"_self"*/);
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

  private addFromValidations() {
    this.myForm = this._fb.group({
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      userTypeAgentId: ['', Validators.compose([Validators.required])],
      reportType: [''],
    });
  }

}