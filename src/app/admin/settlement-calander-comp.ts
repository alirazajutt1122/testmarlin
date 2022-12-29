'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';

import { SettlementCalendar } from '../models/settlement-calendar';
import { ListingService } from '../services/listing.service';
import { AppUtility, AppConstants } from '../app.utility';
import { Exchange } from '../models/exchange';
import { SettlementType } from '../models/settlement-type';
import { AuthService2 } from 'app/services/auth2.service';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AppState } from '../app.service';
import { TranslateService } from '@ngx-translate/core';

import { CollectionView, SortDescription, IPagedCollectionView, } from '@grapecity/wijmo';
import { FuseLoaderScreenService, FuseSplashScreenService } from '@fuse/services/splash-screen';
declare var jQuery: any;

@Component({
  selector: 'settlement-calander-page',
  templateUrl: './settlement-calander-page.html',
})

export class SettlementCalanderPage implements OnInit {

  public myForm: FormGroup;

  exchangesList: any[];
  settlementCalendarDetailsList: wjcCore.CollectionView;
  selectedSettlementCalendar: SettlementCalendar;
  settlementTypeList: any[];

  errorMessage: string;

  public showForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  private _pageSize = 0;
  //claims: any;
  selectedIndex: number = 0;

  @ViewChild('flex', { static: false }) flex: wjcGrid.FlexGrid;
  @ViewChild('stMultiSelect', { static: false }) stMultiSelect: wjcInput.MultiSelect;
  @ViewChild('exchangeId', { static: false }) exchangeId: wjcInput.ComboBox;
  @ViewChild('dialogCmp', { static: false }) dialogCmp: DialogCmp;
  @ViewChild('startDate', { static: false }) startDate: wjcInput.InputDate;
  @ViewChild('endDate', { static: false }) endDate: wjcInput.InputDate;
  @ViewChild('settlementDate', { static: false }) settlementDate: wjcInput.InputDate;
  lang: string;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, private translate: TranslateService, 
    public userService: AuthService2, public splash : FuseLoaderScreenService) {
    this.clearFields();
    //this.claims = authService.claims;
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________

  }

  ngOnInit() {
    // Populate Settlement Calendar data..    
    this.populateSettlementCalendarDetailList();

    // populate exchangesList
    this.populateExchangeList();

    // Populate settlementType List
    this.populateSettlementTypeList();

    // Add form Validations
    this.addFromValidations();

  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.exchangeId.focus();
    });
  }

  /*********************************
   *      Public & Action Methods
   *********************************/

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
    this.isEditing = false;
    this.clearFields();
  }

  public onNewAction() {
    this.isEditing = false;
    this.clearFields();
    this.showForm = true;
    this.populateSettlementTypeList();
  }

  public onEditAction() {
    this.selectedIndex = this.flex.selection.row;
    //alert(this.flex.selection.row);
    this.selectedSettlementCalendar = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.selectedSettlementCalendar)) {

      // this.clearFields();
      // if (!AppUtility.isEmpty(this.settlementCalendarDetailsList.currentItem)) {  
      // alert(this.settlementCalendarDetailsList.currentItem.processed);
      if (this.settlementCalendarDetailsList.currentItem.processed) {
        this.dialogCmp.statusMsg = 'Processed Settlements are not allowed to edit.';
        this.dialogCmp.showAlartDialog('Warning');
        this.clearFields();
      } else {
        // this.selectedSettlementCalendar = this.settlementCalendarDetailsList.currentItem;
        //this.fillMarketFromJson(this.selectedSettlementCalendar,this.settlementCalendarDetailsList.currentItem);
        // this.settlementCalendarDetailsList.editItem(this.selectedSettlementCalendar);
        // this.dateFormation();
        this.showForm = true;
        this.isEditing = true;
      }
    }

  }

  public clearFields() {

    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }

    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;

    this.selectedSettlementCalendar = new SettlementCalendar();
    this.selectedSettlementCalendar.settlementCalendarId = null;
    this.selectedSettlementCalendar.active = false;
    this.selectedSettlementCalendar.processed = false;

    this.selectedSettlementCalendar.startDate = new Date();
    this.selectedSettlementCalendar.endDate = new Date();
    this.selectedSettlementCalendar.settlementDate = new Date();

    this.selectedSettlementCalendar.exchange = new Exchange();

    this.selectedSettlementCalendar.exchange.exchangeId = null;
    this.selectedSettlementCalendar.exchange.exchangeCode = null;

    this.selectedSettlementCalendar.settlementType = new SettlementType();

    this.selectedSettlementCalendar.settlementType.settlementTypeId = null;
    this.selectedSettlementCalendar.settlementType.settlementType = null;

    this.selectedSettlementCalendar.settlementTypeList = [];

  }

  /***
   * Save / Update Action
   */
  public onSaveAction(model: any, isValid: boolean) {
    debugger
     this.splash.show();
    this.isSubmitted = true;
    if (isValid) {
      
      if (this.isEditing) {
        console.log(JSON.stringify(this.toJson()));
        this.listingService.updateSettlementCalendar(this.toJson()).subscribe(
          data => {
             this.splash.hide();
            this.fillMarketFromJson(this.selectedSettlementCalendar, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedSettlementCalendar;
            this.settlementCalendarDetailsList.commitEdit();
            // this.settlementCalendarDetailsList.refresh();
            this.flex.invalidate();
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            if(err.message){
              this.dialogCmp.statusMsg = err.message;
            }
            else
            {
              this.dialogCmp.statusMsg = err;
            }
             this.splash.hide();
          
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
      else {
        this.splash.show();
        this.selectedSettlementCalendar.settlementTypeList = this.stMultiSelect.checkedItems;
        console.log(JSON.stringify(this.toJson()));
        this.listingService.generateSettlementCalendar(this.toJson()).subscribe(
          data => {
             this.splash.hide();
            this.populateSettlementCalendarDetailList();
       
            this.dialogCmp.statusMsg = "Settlement Calendar Generated Successfully";
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
             this.splash.hide();
            if(err.message){
              this.dialogCmp.statusMsg = err.message;
            }
            else
            {
              this.dialogCmp.statusMsg = err;
            }
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
    }
  }

  private toJson(): any {
    if (this.isEditing)
      return {
        "settlementCalendarId": this.selectedSettlementCalendar.settlementCalendarId,
        "active": this.selectedSettlementCalendar.active,
        "endDate": AppUtility.toYYYYMMDD(this.endDate.value),
        "settlementDate": AppUtility.toYYYYMMDD(this.settlementDate.value),
        "startDate": AppUtility.toYYYYMMDD(this.startDate.value),
        "processed": this.selectedSettlementCalendar.processed,
        "settlementType": {
          "settlementTypeId": this.selectedSettlementCalendar.settlementType.settlementTypeId,
          "settlementType": this.selectedSettlementCalendar.settlementType.settlementType
        },
        "settlementTypeList": [],
        "exchange": {
          "exchangeId": this.selectedSettlementCalendar.exchange.exchangeId,
          "exchangeCode": this.selectedSettlementCalendar.exchange.exchangeCode
        }
      }
    else
      return {
        "endDate": AppUtility.formatDate(this.selectedSettlementCalendar.endDate),
        "settlementDate": AppUtility.formatDate(this.selectedSettlementCalendar.settlementDate),
        "startDate": AppUtility.formatDate(this.selectedSettlementCalendar.startDate),
        "settlementCalendarId": null,
        "active": false,
        "processed": false,
        "exchange": {
          "exchangeCode": null,
          "exchangeName": "",
          "exchangeId": this.selectedSettlementCalendar.exchange.exchangeId
        },
        "settlementType": {
          "settlementDesc": "",
          "settlementType": null,
          "settlementTypeId": null
        },
        "settlementTypeList": this.selectedSettlementCalendar.settlementTypeList
      }
  }
  private getSettlementTypeListToJson() {
    let temp: any[] = [];
    for (let i: number = 0; i < this.selectedSettlementCalendar.settlementTypeList.length; i++) {
      temp.push({
        "settlementTypeId": this.selectedSettlementCalendar.settlementTypeList[i].settlementTypeId,
        "active": this.selectedSettlementCalendar.settlementTypeList[i].active,
        "settlementDays": this.selectedSettlementCalendar.settlementTypeList[i].settlementDays,
        "settlementDesc": this.selectedSettlementCalendar.settlementTypeList[i].settlementDesc,
        "settlementType": this.selectedSettlementCalendar.settlementTypeList[i].settlementType,
        "tradeDays": this.selectedSettlementCalendar.settlementTypeList[i].tradeDays,
        "$checked": true
      });
    }
    return temp;
  }

  /***************************************
   *          Private Methods
   **************************************/
  private fillMarketFromJson(m: SettlementCalendar, data: any) {
    this.selectedSettlementCalendar.settlementCalendarId = data.settlementCalendarId;
    this.selectedSettlementCalendar.active = data.active;
    this.selectedSettlementCalendar.processed = data.processed;

    this.selectedSettlementCalendar.startDate = new Date(data.startDate);
    this.selectedSettlementCalendar.endDate = new Date(data.endDate);
    this.selectedSettlementCalendar.settlementDate = new Date(data.settlementDate);

    this.selectedSettlementCalendar.exchange = new Exchange();

    this.selectedSettlementCalendar.exchange.exchangeId = data.exchange.exchangeId;
    this.selectedSettlementCalendar.exchange.exchangeCode = data.exchange.exchangeCode;

    this.selectedSettlementCalendar.settlementType = new SettlementType();

    this.selectedSettlementCalendar.settlementType.settlementTypeId = data.settlementType.settlementTypeId;
    this.selectedSettlementCalendar.settlementType.settlementType = data.settlementType.settlementType;
  }
  private populateExchangeList() {
     this.splash.show();
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
           this.splash.hide();
          this.exchangesList = restData;
          var exch: Exchange = new Exchange();
          exch.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          exch.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          this.exchangesList.unshift(exch);
        },
        error => {
           this.splash.hide();
          this.errorMessage = <any>error.message;
        });
  }

  private populateSettlementTypeList() {
     this.splash.show();
    
    this.listingService.getActiveSettlementTypesList()
      .subscribe(
        restData => {
          
           this.splash.hide();
          this.settlementTypeList = restData;
        },
        error => {
           this.splash.hide();
          this.errorMessage = <any>error.message;
        });
  }


  private populateSettlementCalendarDetailList() {
     this.splash.show();
    this.listingService.getSettlementCalendarList()
      .subscribe(
        restData => {
           this.splash.hide();
          if (!AppUtility.isEmptyArray(restData)) {
            console.log(JSON.stringify(restData[0]));
            this.settlementCalendarDetailsList = new wjcCore.CollectionView(restData);

            let temp: any[] = restData;
            for (let i: number = 0; i < temp.length; i++) {
              this.settlementCalendarDetailsList.items[i].processed = temp[i].processed;
            }
          }
        },
        error => {
           this.splash.hide();
          this.errorMessage = <any>error.message;
        });
  }


  private addFromValidations() {
    this.myForm = this._fb.group({
      exchangeId: ['', Validators.compose([Validators.required])],
      startDate: [''],
      endDate: [''],
      settlementDate: [''],
      settlementTypeId: ['']
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