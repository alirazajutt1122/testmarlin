import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { Migrator } from 'app/models/migrator';
import { Params, ReportParams } from 'app/models/report-params';
import { smsBroadcast } from 'app/models/smsBroadcast';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';


import { DialogCmp } from '../../user-site/dialog/dialog.component';


declare var jQuery: any;
let downloadAPI = require('./../../../../../scripts/download-document');

@Component({
  selector: 'broadcast-sms-page',
  templateUrl: './broadcast-sms-page.html',
  encapsulation: ViewEncapsulation.None,
})
export class BroadcastSMSPage implements OnInit {
  public myForm: FormGroup;
  public searchForm: FormGroup;
  reportParams: ReportParams;
  public smsBroadcast: smsBroadcast;
  params: Params;
  dateFormat: string = AppConstants.DATE_FORMAT;
  dateMask: string = AppConstants.DATE_MASK;
  exchangeList: any[] = [];
  toClientList: any[] = [];
  fromClientList: any[] = [];
  data: any;
  exchangeId: number = 0;
  errorMessage: string;
  public isSubmitted: boolean;
  public isValidStartDate: boolean;
  private _pageSize = 0;

  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;

  constructor(private reportService: ReportService, public userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private _fb2: FormBuilder, private appState: AppState
    , private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.initForm();
    this.isSubmitted = false;
    this.isValidStartDate = true;
    this.loadexchangeList();
    this.smsBroadcast = new smsBroadcast();
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
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
          error => { this.loader.hide(); this.errorMessage = <any>error.message; });
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
          error => { this.loader.hide(); this.errorMessage = <any>error.message; });
    }
  }

  public onExchangeChange(val) {
    this.getExchangeBrokerFromClients(val);
    this.getExchangeBrokerToClients(val);
  }

  public sendSMS(model: any, isValid: boolean) {
    AppUtility.printConsole('onSave Action, isValid: ' + isValid);
    this.isSubmitted = true;
    if (isValid) {
      this.smsBroadcast.fromAccount = this.params.FROM_ACCOUNT;
      this.smsBroadcast.toAccount = this.params.TO_ACCOUNT;
      this.smsBroadcast.message = this.params.TYPE;
      this.smsBroadcast.participantId = AppConstants.participantId;
      this.smsBroadcast.exchange = this.params.EXCHANGE_ID;

      this.loader.show();
      this.listingService.smsBroadCast(this.smsBroadcast).subscribe(
        data => {
          this.loader.hide();
          AppUtility.printConsole('received data: ' + JSON.stringify(data));
          this.UpdateRecords(data, "BroadCast_SMS_Log.txt");
        },
        err => {
          this.loader.hide();
          this.clearFields();
          this.errorMessage = err.message;
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
      smsText: ['', Validators.compose([Validators.required])]
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
    let fileName = fileName_;
    downloadAPI(base64Data, fileName, contentType);
  }
}
