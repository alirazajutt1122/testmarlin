import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { Exchange } from 'app/models/exchange';
import { Participant } from 'app/models/participant';

declare var jQuery: any;

@Component({
  selector: 'reset-participant-page',
  templateUrl: './reset-participant-page.html',
  encapsulation: ViewEncapsulation.None,
})
export class ResetParticipantPage implements OnInit {

  //private showLoader: boolean = false;
  public myForm: FormGroup;

  exchangeList: any[] = [];
  participantList: any[] = [];

  errorMessage: string;
  public isSubmitted: boolean;

  exchangeId: Number = 0;
  participantId: Number = 0;
  delVoucher: Boolean = false;
  delTrades: Boolean = false;
  delStock: Boolean = false;
  delClient: Boolean = false;
  delCOA: Boolean = false;

  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2
    , private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.clearFields();
    this.isSubmitted = false;
    this.populateExchangeList();
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

  /*********************************
 *      Public & Action Methods
 *********************************/
  public clearFields() {
    if (AppUtility.isValidVariable(this.myForm)) {
      this.exchangeId = null;
      this.participantId = 0;
      this.delVoucher = false;
      this.delTrades = false;
      this.delStock = false;
      this.delClient = false;
      this.delCOA = false;

      this.myForm.markAsPristine();
    }
    this.isSubmitted = false;
    this.exchangeId = null;
    this.participantId = null;
  }

  private populateExchangeList() {
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.exchangeList = restData;
          var ex: Exchange = new Exchange();
          ex.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          ex.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          this.exchangeList.unshift(ex);
          this.exchangeId = this.exchangeList[0].exchangeId;
          // this.selectedItem.exchange.exchangeId = this.exchangeList[0].exchangeId;
        },
        error => { this.errorMessage = <any>error.message });
  }

  private getParticipantListByExchagne(exchangeId) {
    this.listingService.getParticipantListByExchagne(exchangeId)
      .subscribe(
        restData => {
          if (AppUtility.isEmpty(restData)) {
            this.participantList = [];
          } else {
            this.participantList = restData;
          }

          var pb: Participant = new Participant();
          pb.participantId = AppConstants.PLEASE_SELECT_VAL;
          pb.displayName_ = AppConstants.PLEASE_SELECT_STR;
          this.participantList.unshift(pb);
          this.participantId = this.participantList[0].participantId;

        },
        error => this.errorMessage = <any>error.message);
  }
  public onExchangeChange(val) {
    this.getParticipantListByExchagne(val);
  }

  public delParticipant(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      if (new Boolean(model.delVoucher) == false && new Boolean(model.delTrades) == false && new Boolean(model.delStock) == false && new Boolean(model.delClient) == false && new Boolean(model.delCOA) == false) {

        this.dialogCmp.statusMsg = "Select atleast one checkbox to proceed.";
        this.dialogCmp.showAlartDialog('Error');
      }
      else {
        this.exchangeId = model.exchangeId;
        this.participantId = model.participantId;

        if (new Boolean(model.delVoucher) != true)
          this.delVoucher = false;
        else
          this.delVoucher = model.delVoucher;

        if (new Boolean(model.delTrades) != true)
          this.delTrades = false;
        else
          this.delTrades = model.delTrades;

        if (new Boolean(model.delStock) != true)
          this.delStock = false;
        else
          this.delStock = model.delStock;

        if (new Boolean(model.delClient) != true)
          this.delClient = false;
        else
          this.delClient = model.delClient;

        if (new Boolean(model.delCOA) != true)
          this.delCOA = false;
        else
          this.delCOA = model.delCOA;


        this.dialogCmp.statusMsg = "Are you sure you want to Delete all records?";
        this.dialogCmp.showAlartDialog('Confirmation');
      }
    }
  }
  public getNotification(btnClicked) {
    if (btnClicked == 'Yes') {
      this.listingService.deleteParticipant(this.participantId, this.exchangeId, this.delVoucher, this.delTrades, this.delStock, this.delClient, this.delCOA).subscribe(
        data => {
          this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_DELETED;
          this.dialogCmp.showAlartDialog('Success');
        },
        err => {
          this.errorMessage = err.message;
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        }
      );
    }
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
      participantId: ['', Validators.compose([Validators.required])],
      delVoucher: [''],
      delStock: [''],
      delTrades: [''],
      delClient: [''],
      delCOA: [''],
    });
  }
}