
'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

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

import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { VoucherType } from 'app/models/voucher-type';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { Participant } from 'app/models/participant';
import { CollectionView, SortDescription,IPagedCollectionView,} from '@grapecity/wijmo';
import { ComboItem } from 'app/models/combo-item';
import { CurrencyRate } from 'app/models/currency-rate';
import { Currency } from 'app/models/currency';
import { CurrencyListItems } from 'app/models/currency-list';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';

declare var jQuery: any;

@Component({

  selector: 'currency-rates',
  templateUrl:'./currency-rates.html',
})
export class CurrencyRates implements OnInit {

  public myForm: FormGroup;
  dateFormat = AppConstants.DATE_FORMAT;
  //------------------------------
  currencyRate :  CurrencyRate;

  //------------------------------

  itemsList: wjcCore.CollectionView; // for currencyRates List
  currencyList : any[];
  filterCurrencyList : any[];
  selectedItem: VoucherType;
  errorMessage: string;
  currencyFilter : Number;
  public isSubmitted: boolean;

  modal = true;
  selectedIndex: number = 0;

  private _pageSize = 0;
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('recordSaveDlg') recordSaveDlg: wjcInput.Popup;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  //--------------------------------------------
  @ViewChild('currencyListCmb') currencyListCmb : wjcInput.ComboBox;
  @ViewChild('currencyFilterCmb') currencyFilterCmb : wjcInput.ComboBox;
  @ViewChild('inputRate',{ static: false }) inputRate: wjcInput.InputNumber;
  @ViewChild('inputCoefficient',{ static: false }) inputCoefficient : wjcInput.InputNumber;
  //------------------------------------------------------
  lang: string;


  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2,private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.clearFields();
    this.isSubmitted = false;
    //this.claims = authService.claims;
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }


  ngOnInit() {

    //    jQuery('.parsleyjs').parsley();
     // Add Form Validations
    this.addFromValidations();
    // get Currency list   
    this.getCurrencyList(); 
    this.init();

  }

  ngAfterViewInit() {
   // this.currencyFilter = AppConstants.USD_CURRENCY_ID;
  }

  /*********************************
 *      Public & Action Methods
 *********************************/


  public clearFields() {
    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }

    this.isSubmitted = false;

    this.selectedItem = new VoucherType();
    this.selectedItem.voucherTypeId = null;
    this.selectedItem.voucherType = '';
    this.selectedItem.typeDesc = '';
    this.selectedItem.participant = new Participant();
    this.selectedItem.participant.participantId = AppConstants.participantId;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    if (this._pageSize != value) {
      this._pageSize = value;
      if (this.flex) {
        (<IPagedCollectionView><unknown>this.flex.collectionView).pageSize = value;
      }
    }
  }


  public onCancelAction() {
    this.clearFields();
    this.init();
  }

  

  
  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;

    if (this.isValidate()) {
      
       const newCurrencyRate = {
        foreignCurrencyAcronym: this.currencyRate.foreignCurrencyAcronym,
        rate: this.currencyRate.rate,
        coefficient : this.currencyRate.coefficient,
        currency: {
            currencyId: this.currencyRate.currency.currencyId,
            currencyCode: this.currencyRate.currency.code
        }
       }
       this.listingService.saveNewCurrencyRate(newCurrencyRate).subscribe((res) => {
         this.getCurrencyCodeList(this.currencyRate.currency.code);
         this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
         this.dialogCmp.showAlartDialog('Success');
       }, error => {
        if(error.message){
          this.errorMessage = error.message;
        } else {
          this.errorMessage = error;
        }
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
       })
    }

  }
  

  isValidate() : boolean{
    if(!AppUtility.isValidVariable(this.currencyRate.currency.currencyId)){
      this.currencyListCmb.focus();
      return false;
    }
    else if(this.currencyRate.rate <= 0){
       this.inputRate.focus();
       return false;
    }
    else if(this.currencyRate.coefficient <= 0){
     this.inputCoefficient.focus();
     return false;
    }


    return true;
  }
  

  onFilterAction(currencyId){
    if(AppUtility.isValidVariable(currencyId)){
      const selectedCurrency = this.filterCurrencyList.find((currencyItem) => {
        return currencyId === currencyItem.currencyId
      })
      if(!AppUtility.isEmpty(selectedCurrency)){
        const currencyCode = selectedCurrency.currencyCode;
        if(currencyCode === AppConstants.ALL_STR)
        this.getCurrencyCodeList(selectedCurrency.currencyId);
        else
        this.getCurrencyCodeList(currencyCode);

      } 
    }
  }

  public onNewAction() {
    this.clearFields();
    this.init();
  }

  init(){
   
    this.currencyRate = new CurrencyRate();
    this.currencyRate.dateTime = new Date();
    this.currencyRate.currency = new Currency();
  }

  onCurrencyChange(id : any){
    if(AppUtility.isValidVariable(id)){
      this.currencyList.forEach((currencyItem) => {
           if(id === currencyItem.currencyId){
              this.currencyRate.foreignCurrencyAcronym = currencyItem.currencyCode;
              this.currencyRate.currency.code = currencyItem.currencyCode;
              this.listingService.getLatestExchangeRateCoefficient(this.currencyRate.currency.code).subscribe(res => {
                  if(!AppUtility.isEmpty(res)){
                    this.currencyRate.coefficient = AppUtility.isEmpty(res.coefficient) ? 0 : res.coefficient;
                  } else {
                    this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                  }
              }, error => {
                if(error.message){
                  this.errorMessage = error.message;
                }
                else{
                  this.errorMessage = error;
                }
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              })
           }
       });
    } else {
       this.currencyRate.coefficient = 0;
    }
  }
  


  // get list of currency for combo box
  private getCurrencyList(){
    this.loader.show();
  
    
    this.listingService.getCurrencyList()
    .subscribe(
      restData => {
     
        this.loader.hide();
        if (AppUtility.isEmptyArray(restData)) {
          this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        } else {
          this.currencyList = restData;
          this.filterCurrencyList = [...restData];
          console.log('data',JSON.stringify(this.currencyList));
          let c = new CurrencyListItems();
          c.currencyCode = AppConstants.ALL_STR;
          c.currencyId = AppConstants.ALL_VAL;
          this.filterCurrencyList.unshift(c);
          
          c = new CurrencyListItems();
          c.currencyCode = AppConstants.PLEASE_SELECT_STR;
          c.currencyId = AppConstants.PLEASE_SELECT_VAL;
          this.currencyList.unshift(c);
        }
      },
      error => {
        if(error.message){
          this.errorMessage = error.message;
        }
        else{
          this.errorMessage = error;
        }
        this.loader.hide();
        this.dialogCmp.statusMsg = this.errorMessage;
        this.dialogCmp.showAlartDialog('Error');
      });
  }

  //get list of exchange rates for selected currency code
  private getCurrencyCodeList(currencyCode : any) {
    this.loader.show();
    this.listingService.getCurrencyCodeList(currencyCode)
      .subscribe(
        restData => {
        this.loader.hide();
        if (AppUtility.isEmptyArray(restData)) {
          this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        } else {
          this.itemsList = new wjcCore.CollectionView(restData);
        }
      },
      error => {
        this.loader.hide();
        if(error.message){
          this.errorMessage = error.message;
        }
        else{
          this.errorMessage = error;
        }
        this.dialogCmp.statusMsg = this.errorMessage;
        this.dialogCmp.showAlartDialog('Error');
      });
  }
  //-------------------------------------------


  private addFromValidations() {
    this.myForm = this._fb.group({
        currencyId: ['', Validators.compose([Validators.required])],
        dateTime: [''],
        rate : ['' , Validators.compose([Validators.required])],
        coefficient : ['' , Validators.compose([Validators.required])]

    });
  }

  public hideModal() {
    jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  }
  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }

}