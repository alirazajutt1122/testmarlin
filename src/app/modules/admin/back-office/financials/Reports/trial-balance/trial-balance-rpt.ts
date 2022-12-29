import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppConstants } from 'app/app.utility';
import { Params, ReportParams } from 'app/models/report-params';
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
var downloadAPI = require('../../../../../../scripts/download-document');
@Component({
  selector: 'trial-balance-rpt',
  templateUrl: './trial-balance-rpt.html',
  encapsulation: ViewEncapsulation.None,
})
export class TrialBalanceRpt implements OnInit {
  public myForm: FormGroup;
  public searchForm: FormGroup;

  //claims: any;
  lang: any;
  pdfSrc: String;
  pdf = false;
  fileNameForDownload = "TrialBalanceRpt.pdf";


  reportParams: ReportParams;
  params: Params;

  dateFormat: string = AppConstants.DATE_FORMAT;
  dateMask: string = AppConstants.DATE_MASK;

  exchangeList: any[] = [];
  clientCustodianList: any[] = [];
  clientList: any[] = [];
  securityList: any[] = [];
  entryTypeList: any[] = [];
  headLevelList: any[] = [];
  reportTypeList: any[] = [];
  reportType: string = null;
  reportFormatList: any[] = [];
  reportFormat: string = 'PDF';
  headLevel: number = 0;
  entryType: string = null;
  dateComparison: boolean = true;
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
  @ViewChild('headLevelId') headLevelId: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;


  constructor(private appState: AppState, private reportService: ReportService, private userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder , private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.initForm();
    this.isSubmitted = false;
    //this.claims = authService.claims;
    this.params.HEAD_LEVEL = 1;
    this.loadheadLevel();
    this.dateComparison = true;



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
    this.reportTypeList = this.params.getReportFormatOptionsTrial();
    this.reportFormatList = this.params.getReportFormatTypeOptions();
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
    this.dateComparison = true;
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
      },
      error => this.errorMessage = <any>error.message);
  }









  public printReport(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (this.params.START_DATE > this.params.END_DATE) {
      this.dateComparison = false;
      return;
    }
    else {
      this.dateComparison = true;
      if (isValid) {
       this.loader.show();
        let fromDateString: string;
        let toDateString: string;
        let tradeDateString: string;
        fromDateString = wjcCore.Globalize.format(this.params.START_DATE, AppConstants.DATE_FORMAT);
        toDateString = wjcCore.Globalize.format(this.params.END_DATE, AppConstants.DATE_FORMAT);
        tradeDateString = wjcCore.Globalize.format(this.params.TRADE_DATE, AppConstants.DATE_FORMAT);
        this.reportParams.setParams(this.params);
        //  AppUtility.printConsole('params: ' + JSON.stringify(this.params));
        if (this.reportType.toLowerCase() == 'format-1' || this.reportType.toLowerCase() == 'formato-1') {
          if (this.reportFormat.toLowerCase() === 'pdf') {
            this.listingService.getTrialBalanceReport(AppConstants.participantId, this.params.HEAD_LEVEL,
              fromDateString, toDateString, this.reportFormat.toLowerCase(),this.lang).subscribe(restData => {
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
                (error) => {
                  this.loader.hide();
                  this.dialogCmp.statusMsg = error.message;
                  this.dialogCmp.showAlartDialog('Error');
                });
          } else if(this.reportFormat.toLowerCase() === 'csv'){
               this.listingService.getTrialBalanceReport(AppConstants.participantId, this.params.HEAD_LEVEL,
                 fromDateString, toDateString, this.reportFormat.toLowerCase(),this.lang).subscribe(restData => {
                 this.loader.hide();
                 let reportData: any;
                 reportData = restData;
                 //let w = window.open(reportData.reportBase64);
                 downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
               
              },
                (error) => {
                  this.loader.hide();
                  this.dialogCmp.statusMsg = error.message;
                  this.dialogCmp.showAlartDialog('Error');
                });
          }
          else {
            this.loader.hide();
            this.dialogCmp.statusMsg = 'Format-1 is not available';
            this.dialogCmp.showAlartDialog('Error');
          }
        }
        // format - 2
        else if (this.reportType.toLowerCase() == 'format-2' || this.reportType.toLowerCase() == 'formato-2') {

          if (this.params.START_DATE > this.params.TRADE_DATE) {
            this.loader.hide();
            this.dialogCmp.statusMsg = 'From Date should be less or equal than Trade Date.';
            this.dialogCmp.showAlartDialog('Warning');
            return;
          }

          if(this.reportFormat.toLowerCase() === 'pdf'){
          this.listingService.getTrialBalanceReportForamt1(AppConstants.participantId, this.params.HEAD_LEVEL,
            fromDateString, toDateString, tradeDateString, this.reportFormat.toLowerCase(),this.lang).subscribe((restData) => {

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
              (error) => {
                this.loader.hide();
                this.dialogCmp.statusMsg = error.message;
                this.dialogCmp.showAlartDialog('Error');
              });
        } else if(this.reportFormat.toLowerCase() === 'csv'){
             this.listingService.getTrialBalanceReportForamt1(AppConstants.participantId, this.params.HEAD_LEVEL,
               fromDateString, toDateString, tradeDateString, this.reportFormat.toLowerCase(),this.lang).subscribe((restData) => {

              this.loader.hide();
              let reportData: any;
              reportData = restData;
              //let w = window.open(reportData.reportBase64);
              downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
             
            },
              (error) => {
                this.loader.hide();
                this.dialogCmp.statusMsg = error.message;
                this.dialogCmp.showAlartDialog('Error');
              });
        }

      }
         

        // Format-2A
        else if (this.reportType.toLowerCase() == 'format-2a' || this.reportType.toLowerCase() == 'formato-2a') {

          if (this.params.START_DATE > this.params.TRADE_DATE) {
            this.loader.hide();
            this.dialogCmp.statusMsg = 'From Date should be less or equal than Trade Date.';
            this.dialogCmp.showAlartDialog('Warning');
            return;
          }
          if(this.reportFormat.toLowerCase() === 'pdf'){
          this.listingService.getTrialBalanceReportForamt2A(AppConstants.participantId, this.params.HEAD_LEVEL,
            fromDateString, toDateString, tradeDateString, this.reportFormat.toLowerCase(), this.reportType.toLowerCase(),this.lang).subscribe((restData) => {
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
              (error) => {
                this.loader.hide();
                this.dialogCmp.statusMsg = error.message;
                this.dialogCmp.showAlartDialog('Error');
              });
        } else if(this.reportFormat.toLowerCase() === 'csv'){
          this.listingService.getTrialBalanceReportForamt2A(AppConstants.participantId, this.params.HEAD_LEVEL,
            fromDateString, toDateString, tradeDateString, this.reportFormat.toLowerCase(), this.reportType.toLowerCase(),this.lang).subscribe((restData) => {
              this.loader.hide();
              let reportData: any;
              reportData = restData;
              //let w = window.open(reportData.reportBase64);
              downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
            },
              (error) => {
                this.loader.hide();
                this.dialogCmp.statusMsg = error.message;
                this.dialogCmp.showAlartDialog('Error');
              });
        }
        } 
        // for secp format
        else if (this.reportType.toLowerCase() == 'secp-format' || this.reportType.toLowerCase() == 'secp-formato') {
          if (this.params.START_DATE > this.params.TRADE_DATE) {
            this.loader.hide();
            this.dialogCmp.statusMsg = 'From Date should be less or equal than Trade Date.';
            this.dialogCmp.showAlartDialog('Warning');
            return;
          }

          if(this.reportFormat.toLowerCase() === 'pdf'){
          this.listingService.getTrialBalanceReportForamt2Secp(AppConstants.participantId, this.params.HEAD_LEVEL,
            fromDateString, toDateString, tradeDateString, this.reportFormat.toLowerCase(),this.lang)
            .subscribe(
              restData => {

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
          } else if(this.reportFormat.toLowerCase() === 'csv'){
            this.listingService.getTrialBalanceReportForamt2Secp(AppConstants.participantId, this.params.HEAD_LEVEL,
              fromDateString, toDateString, tradeDateString, this.reportFormat.toLowerCase(),this.lang)
              .subscribe(
                restData => {
  
                  this.loader.hide();
                  let reportData: any;
                  reportData = restData;
                  //let w = window.open(reportData.reportBase64);
                  downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
                 
                },
                error => {
                  this.loader.hide();
                  this.dialogCmp.statusMsg = error.message;
                  this.dialogCmp.showAlartDialog('Error');
                });
          }
        }

        // end secp format
        // for marlin secp format
        else if (this.reportType.toLowerCase() == 'marlinsecp-format' || this.reportType.toLowerCase() == 'marlinsecp-formato') {

          if (this.params.START_DATE > this.params.TRADE_DATE) {
            this.loader.hide();
            this.dialogCmp.statusMsg = 'From Date should be less or equal than Trade Date.';
            this.dialogCmp.showAlartDialog('Warning');
            return;
          }
           if(this.reportFormat.toLowerCase() === 'pdf'){
            this.listingService.getTrialBalanceReportForamt2MarlinSecp(AppConstants.participantId, this.params.HEAD_LEVEL,
              fromDateString, toDateString, tradeDateString, this.reportFormat.toLowerCase(),this.lang).subscribe((restData) => {
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
           } else if(this.reportFormat.toLowerCase() === 'csv'){
            this.listingService.getTrialBalanceReportForamt2MarlinSecp(AppConstants.participantId, this.params.HEAD_LEVEL,
              fromDateString, toDateString, tradeDateString, this.reportFormat.toLowerCase(),this.lang).subscribe((restData) => {
                this.loader.hide();
                let reportData: any;
                reportData = restData;
                //let w = window.open(reportData.reportBase64);
                downloadAPI(reportData.reportBase64, reportData.reportName, reportData.contentType);
              },
                error => {
                  this.loader.hide();
                  this.dialogCmp.statusMsg = error.message;
                  this.dialogCmp.showAlartDialog('Error');
                });
           }
        }
        // end marlin secp format
      }
    }

  }








  public getNotification(btnClicked) {
  }




  private addFromValidations() {
    this.myForm = this._fb.group({
      headLevelId: ['', Validators.compose([Validators.required])],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      tradeDate: ['', Validators.compose([Validators.required])],
      reportType: ['', Validators.compose([Validators.required])],
      reportFormat: ['', Validators.compose([Validators.required])]
    });
  }

}
