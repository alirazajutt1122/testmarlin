'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';


import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { ClientLevieDetail } from 'app/models/client-levy-detail';

import { TraansactionTypesExchange } from 'app/models/traansaction-type-exchange';
import { ClientLevieMaster } from 'app/models/client-levy-master';
import { Participant } from 'app/models/participant';
import { VoucherType } from 'app/models/voucher-type';
import { ChartOfAccount } from 'app/models/chart-of-account';
import { BasicInfo } from 'app/models/basic-info';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { LevieDetail } from 'app/models/levy-detail';

declare var jQuery: any;
//import 'slim_scroll/jquery.slimscroll.js';

@Component({

  selector: 'client-levies-page',
  templateUrl: './client-levies-page.html',

  encapsulation: ViewEncapsulation.None,
})

export class ClientLeviePage implements OnInit {
  private showLoader: boolean = false;
  public static _exchangeid: Number;
  private static searchButtonDisabled: String = 'btn btn-success btn-sm disabled';
  private static searchButtonEnabled: String = 'btn btn-success btn-sm';
  private static lowerRangeMax: Number = 999999.9998;
  public myForm: FormGroup;
  itemsList: wjcCore.CollectionView;        // A list which will bind to the flex grid of Page.
  detailList: wjcCore.CollectionView;   // A list which will bind to the flex grid of Modal.
  selectedItem: LevieDetail;  // The Master Item
  selectedDetailItem: LevieDetail;    // The Detail Item

  errorMessage: string;
  exchangeNameList: any[];
  transactionTypeList: any[];
  appliesToList: any[];
  voucherTypeList: any[];
  chartOfAccountList: any[];
  levyTypeList: any[];
  levelList: any[];
  recurrenceList: any[];
  today: Date = new Date();
  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  public isParentDisabled: boolean;
  public LevyRateError: Boolean;
  public isDetailEditing: boolean;
  public addingNew: boolean;
  public finalSaveUpdate: boolean;
  public maxLevyRate: Number;
  public disabled: String;
  public levyRateLabelModalDisplay: String;

  private isNotUnique: boolean;
  private _pageSize = 0;

  public disabledCheckbox: Boolean = true;
  allTransTypes: Boolean = false;
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('flexDetail') flexDetail: wjcGrid.FlexGrid;
  @ViewChild('levyRate') levyRateControl: wjcInput.InputNumber;
  @ViewChild('exchangeName') exchangeName: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  @ViewChild('updateBtn') updateBtn: ElementRef;
  @ViewChild('saveBtn') saveBtn: ElementRef;
  @ViewChild('transactionType') transactionTypeControl: wjcInput.MultiSelect;
  lang: string;

  public tabFocusChanged() {
    if (this.isEditing)
      this.updateBtn.nativeElement.focus();
    else
      this.saveBtn.nativeElement.focus();
  }

  constructor(private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.appliesToList = [
      {
        'value': AppConstants.PLEASE_SELECT_STR,
        'abbreviation': AppConstants.PLEASE_SELECT_VAL
      },
      {
        'value': AppConstants.SELL_STRING,
        'abbreviation': AppConstants.SELL_ABBREVIATION
      },
      {
        'value': AppConstants.BUY_STRING,
        'abbreviation': AppConstants.BUY_ABBREVIATION
      },
      {
        'value': AppConstants.BOTH_STRING,
        'abbreviation': AppConstants.BOTH_ABBREVIATION
      }
    ];

    this.levelList  = [
      {
        'value': AppConstants.PLEASE_SELECT_STR,
        'abbreviation': AppConstants.PLEASE_SELECT_VAL
      },
      {
        'value': AppConstants.PARTICIPANT,
        'abbreviation': AppConstants.PARTICIPANT_ABBREVIATION
      },
      {
        'value': AppConstants.CLIENT,
        'abbreviation': AppConstants.CLIENT_ABBREVIATION
      },
    
    ];

    this.recurrenceList= [
      {
        'value': AppConstants.PLEASE_SELECT_STR,
        'abbreviation': AppConstants.PLEASE_SELECT_VAL
      },
      {
        'value': 'Annual',
        'abbreviation': "A"
      },
      {
        'value': "Bi-Annually",
        'abbreviation': "BA"
      },
      {
        'value': "Quarterly",
        'abbreviation': "Q"
      },
      {
        'value': "Monthly",
        'abbreviation': "M"
      },
      {
        'value': "One time",
        'abbreviation': "OT"
      },
      {
        'value': "Per Transaction",
        'abbreviation': "PT"
      },
    
    ];

    this.levyTypeList = [
      {
        'value': AppConstants.PLEASE_SELECT_STR,
        'abbreviation': AppConstants.PLEASE_SELECT_VAL
      },
      {
        'value': AppConstants.FIXED_STRING,
        'abbreviation': AppConstants.FIXED_ABBREVIATION
      },
      {
        'value': AppConstants.PERCENTAGE_STRING,
        'abbreviation': AppConstants.PERCENTAGE_ABBREVIATION
      },
      {
        'value': AppConstants.PERCENTAGE_ON_COMMISSION_STRING,
        'abbreviation': AppConstants.PERCENTAGE_ON_COMMISSION_ABBREVIATION
      },
      {
        'value': AppConstants.PERCENTAGE_ON_BADLA_STRING,
        'abbreviation': AppConstants.PERCENTAGE_ON_BADLA_ABBREVIATION
      },
      {
        'value': AppConstants.PERCENTAGE_ON_DELIVERY_STRING,
        'abbreviation': AppConstants.PERCENTAGE_ON_DELIVERY_ABBREVIATION
      }
    ];

    this.clearFields(true, true);
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.today = new Date();
    this.today.setDate(this.today.getDate() + 1);
    this.disabledCheckbox = false;
    //this.claims = authService.claims;
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }
  ngOnInit() {

    jQuery('.parsleyjs').parsley();

    this.populateClientLevieMasterList();
    this.populateVoucherTypeList();
    this.populateChartOfAccountList();

    this.clearFields(true, true);

    // Populate exchangesList in DropDown in search option.
    this.populateExchangeList();

    // Populate transactionType List
    //this.populateTransactionTypeList();

    // Add Form Validations
    this.addFormValidations();
  }

  public ngAfterViewInit() {
    // jQuery('.grid div div:nth-child(2)').addClass("slim_scroll");
    var self = this;

    // jQuery('.slim_scroll').slimScroll({
    //   height: '100%',
    //   width: '100%',
    //   wheelStep: 10,
    //   alwaysVisible: true,
    //   allowPageScroll: false,
    //   railVisible: true,
    //   size: '7px',
    //   opacity: 1,
    //   axis: 'both'
    // });

    $('#add_new').on('shown.bs.modal', function () {
      wjcGrid.FlexGrid.invalidateAll();
      self.exchangeName.focus();
    });

    this.flexDetail.invalidate();

  }

  /*********************************
 *      Public & Action Methods
 *********************************/


  public clearFields(_clearMaster: Boolean, _clearDetail: Boolean) {
    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }

    this.disabledCheckbox = false;
    if (AppUtility.isValidVariable(this.itemsList)) {
      this.itemsList.cancelEdit();
      this.itemsList.cancelNew();
    }
    this.hideForm = false;
    this.isEditing = false;
    this.addingNew = true;
    this.isDetailEditing = false;
    this.LevyRateError = false;
    this.finalSaveUpdate = false;
    this.isSubmitted = false;
    if (!this.isNotUnique)
      this.levyRateLabelModalDisplay = 'Levy Rate (Overall)';
    if (_clearMaster)
      this.ClearMasterObject();
    if (_clearDetail)
      this.ClearDetailObject();
  }

  private ClearMasterObject() {
    this.selectedItem = new LevieDetail();
    this.selectedItem.effectiveDate = this.today;
    this.selectedItem.effectiveToDate = this.today;
    this.selectedItem.levyRate = 0;
    this.selectedItem.tradingSide = this.appliesToList[0].abbreviation;
    this.selectedItem.leviesDetailId = null;
    this.selectedItem.active = true;
    this.selectedItem.unProcessedLevy = null;

    this.disabled = 'disabled';
    this.selectedItem.traansactionTypesExchange = new TraansactionTypesExchange();
    this.selectedItem.traansactionTypesExchange.traansactionTypeExchangeId = null;
    this.selectedItem.traansactionTypesExchange.transactionType = null;

    this.selectedItem.leviesMaster = new ClientLevieMaster();
    this.selectedItem.leviesMaster.leviesMasterId = null;
    this.selectedItem.leviesMaster.levyDesc = null;
    this.selectedItem.leviesMaster.levyCode = null;
    this.selectedItem.leviesMaster.levyType = '';
    this.selectedItem.leviesMaster.levyTypeDispaly_ = null;
    this.levyRateLabelModalDisplay = '';

    this.selectedItem.leviesMaster.exchange = new Exchange();
    this.selectedItem.leviesMaster.exchange.exchangeId = null;
    this.selectedItem.leviesMaster.exchange.exchangeCode = null;
    this.selectedItem.leviesMaster.exchange.exchangeName = null;

    this.selectedItem.leviesMaster.participant = new Participant();
    this.selectedItem.leviesMaster.participant.participantId = AppConstants.participantId;

    this.selectedItem.leviesMaster.voucherType = new VoucherType();
    if (!AppUtility.isEmptyArray(this.voucherTypeList)) {
      this.selectedItem.leviesMaster.voucherType.voucherType = this.voucherTypeList[0].voucherType;
      this.selectedItem.leviesMaster.voucherType.voucherTypeId = this.voucherTypeList[0].voucherTypeId;
    }

    this.selectedItem.leviesMaster.chartOfAccount = new ChartOfAccount();
    if (!AppUtility.isEmptyArray(this.chartOfAccountList)) {
      this.selectedItem.leviesMaster.chartOfAccount.glCodeDisplayName_ = this.chartOfAccountList[0].glCodeDisplayName_;
      this.selectedItem.leviesMaster.chartOfAccount.chartOfAccountId = this.chartOfAccountList[0].chartOfAccountId;
    }

    if (!AppUtility.isEmptyArray(this.appliesToList)) {
      this.selectedItem.tradingSide = this.appliesToList[0].abbreviation;
    }

    this.selectedItem.traansactionTypesExchange = new TraansactionTypesExchange();
    if (!AppUtility.isEmptyArray(this.transactionTypeList)) {
      this.selectedItem.traansactionTypesExchange.traansactionTypeExchangeId = this.transactionTypeList[0].traansactionTypeExchangeId;
      this.selectedItem.traansactionTypesExchange.transactionType = this.transactionTypeList[0].transactionType;
    }
  }

  private ClearDetailObject() {
    this.selectedDetailItem = new LevieDetail();
    this.selectedDetailItem.effectiveDate = this.today;
    this.selectedItem.effectiveToDate = this.today;
    this.selectedDetailItem.levyRate = 0;
    this.selectedDetailItem.tradingSide = this.appliesToList[0].abbreviation;
    this.selectedDetailItem.leviesDetailId = null;
    this.selectedDetailItem.active = true;
    this.selectedDetailItem.unProcessedLevy = null;
    this.selectedDetailItem.traansactionTypesExchange = new TraansactionTypesExchange();

    if (!AppUtility.isEmptyArray(this.transactionTypeList)) {
      this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId = this.transactionTypeList[0].traansactionTypeExchangeId;
      this.selectedDetailItem.traansactionTypesExchange.transactionType = this.transactionTypeList[0].transactionType;
    }
    else {
      this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId = null;
      this.selectedDetailItem.traansactionTypesExchange.transactionType = null;
    }

    this.selectedDetailItem.leviesMaster = new ClientLevieMaster();
    this.selectedDetailItem.leviesMaster.leviesMasterId = null;
    this.selectedDetailItem.leviesMaster.levyDesc = null;
    this.selectedDetailItem.leviesMaster.levyCode = null;
    this.selectedDetailItem.leviesMaster.levyType = '';
    this.selectedDetailItem.leviesMaster.levyTypeDispaly_ = '';
    this.levyRateLabelModalDisplay = 'Levy Rate';

    if (this.selectedItem.leviesMaster.levyType == 'F') {
      //this.selectedDetailItem.leviesMaster.levyTypeDispaly_ = 'Fixed';
      this.levyRateLabelModalDisplay = 'Levy Rate (Per Share)';
    }
    else {
      // this.selectedDetailItem.leviesMaster.levyTypeDispaly_ = 'Commission Percentage';
      this.levyRateLabelModalDisplay = 'Levy Rate (Overall)';
    }

    this.selectedDetailItem.leviesMaster.exchange = new Exchange();
    this.selectedDetailItem.leviesMaster.exchange.exchangeId = null;
    this.selectedDetailItem.leviesMaster.exchange.exchangeCode = null;
    this.selectedDetailItem.leviesMaster.exchange.exchangeName = null;

    this.selectedDetailItem.leviesMaster.participant = new Participant();
    this.selectedDetailItem.leviesMaster.participant.participantId = AppConstants.participantId;

    this.selectedDetailItem.leviesMaster.voucherType = new VoucherType();
    this.selectedDetailItem.leviesMaster.voucherType.voucherType = null;
    this.selectedDetailItem.leviesMaster.voucherType.voucherTypeId = null;

    this.selectedDetailItem.leviesMaster.chartOfAccount = new ChartOfAccount();
    this.selectedDetailItem.leviesMaster.chartOfAccount.glCodeDisplayName_ = null;
    this.selectedDetailItem.leviesMaster.chartOfAccount.chartOfAccountId = null;

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

  public onTransactionTypeChangeEvent(stId) {
    if (AppUtility.isValidVariable(this.transactionTypeList)) {
      for (let i = 0; i < this.transactionTypeList.length; i++) {
        if (this.transactionTypeList[i].traansactionTypeExchangeId == stId) {
          this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId = this.transactionTypeList[i].traansactionTypeExchangeId;
          this.selectedDetailItem.traansactionTypesExchange.transactionType = this.transactionTypeList[i].transactionType;
        }
      }
    }
  }
  // public hideModal() {
  //   jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  // }

  public onModalLoaded() {
    $('#add_new').on('shown.bs.modal', function () {
      wjcGrid.FlexGrid.invalidateAll();
    });

    if (AppUtility.isValidVariable(this.detailList)) {
      if (this.selectedItem.leviesMaster.levyType == 'F') {
        this.levyRateLabelModalDisplay = 'Levy Rate (Per Share)';
        this.maxLevyRate = 999999.9999;
      }
      else {
        this.levyRateLabelModalDisplay = 'Levy Rate (Overall)';
        this.maxLevyRate = 100;
      }
    }
    this.flexDetail.invalidate();
  }

  public onCancelAction() {
    this.clearFields(true, true);
    this.populateClientLevieMasterList();
    this.transactionTypeControl.placeholder = 'Select';
    this.transactionTypeControl.invalidate();
    this.hideForm = false;
  }

  public onNewAction() {
    this.clearFields(true, true);
    this.transactionTypeControl.placeholder = 'Select';
    this.transactionTypeControl.invalidate();
    this.hideForm = true;
    if (AppUtility.isValidVariable(this.detailList)) {
      this.detailList = null;
      this.onModalLoaded();
    }
    this.isParentDisabled = false;
    this.addingNew = true;
    this.onLevyTypeChangeEvent(AppConstants.PERCENTAGE_ABBREVIATION);
  }

  public loadObject(selectedDetailItem: ClientLevieDetail) {
    let temp_detail = this.detailList.addNew();
    //if (selectedDetailItem.unProcessedLevy > 0)
    temp_detail.effectiveDate = new Date();
    temp_detail.effectiveDate = selectedDetailItem.effectiveDate;
    //else
    temp_detail.effectiveToDate =selectedDetailItem.effectiveToDate


    temp_detail.levyRate = selectedDetailItem.levyRate;
    temp_detail.tradingSide = selectedDetailItem.tradingSide;

    if (selectedDetailItem.tradingSide == 'S')
      temp_detail.tradingSideDisplay_ = 'Sell';
    else if (selectedDetailItem.tradingSide == 'B')
      temp_detail.tradingSideDisplay_ = 'Buy';
    else if (selectedDetailItem.tradingSide == 'O')
      temp_detail.tradingSideDisplay_ = 'Both';
    else
      temp_detail.tradingSideDisplay_ = null;

    temp_detail.leviesDetailId = selectedDetailItem.leviesDetailId;
    temp_detail.active = selectedDetailItem.active;
    temp_detail.tradingSide = selectedDetailItem.tradingSide;

    temp_detail.traansactionTypesExchange = new TraansactionTypesExchange();
    temp_detail.traansactionTypesExchange.transactionType = selectedDetailItem.traansactionTypesExchange.transactionType;
    temp_detail.traansactionTypesExchange.traansactionTypeExchangeId = selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId;

    temp_detail.leviesMaster = selectedDetailItem.leviesMaster;
    temp_detail.leviesMaster.leviesMasterId = selectedDetailItem.leviesMaster.leviesMasterId;
    temp_detail.leviesMaster.levyDesc = selectedDetailItem.leviesMaster.levyDesc;
    temp_detail.leviesMaster.levyCode = selectedDetailItem.leviesMaster.levyCode;
    if (selectedDetailItem.leviesMaster.levyType == 'F') {
      // temp_detail.leviesMaster.levyTypeDispaly_ = 'Fixed';
      this.levyRateLabelModalDisplay = 'Levy Rate (Per Share)';
    }
    else {
      // temp_detail.leviesMaster.levyTypeDispaly_ = 'Commission Percentage';
      this.levyRateLabelModalDisplay = 'Levy Rate (Overall)';
    }

    //tradingSideDisplay_
    temp_detail.leviesMaster.exchange = selectedDetailItem.leviesMaster.exchange;
    temp_detail.leviesMaster.exchange.exchangeId = selectedDetailItem.leviesMaster.exchange.exchangeId;
    temp_detail.leviesMaster.exchange.exchangeCode = selectedDetailItem.leviesMaster.exchange.exchangeCode;
    temp_detail.leviesMaster.exchange.exchangeName = selectedDetailItem.leviesMaster.exchange.exchangeName;

    temp_detail.leviesMaster.voucherType = selectedDetailItem.leviesMaster.voucherType;
    temp_detail.leviesMaster.voucherType.voucherTypeId = selectedDetailItem.leviesMaster.voucherType.voucherTypeId;
    temp_detail.leviesMaster.voucherType.voucherType = selectedDetailItem.leviesMaster.voucherType.voucherType;

    temp_detail.leviesMaster.chartOfAccount = selectedDetailItem.leviesMaster.chartOfAccount;
    temp_detail.leviesMaster.chartOfAccount.chartOfAccountId = selectedDetailItem.leviesMaster.chartOfAccount.chartOfAccountId;
    temp_detail.leviesMaster.chartOfAccount.glCodeDisplayName_ = selectedDetailItem.leviesMaster.chartOfAccount.glCodeDisplayName_;
    this.detailList.commitNew();
  }
  public onAddNewRow() {
    
    if (!this.LevyRateError) {
      // const ctrl_: FormControl = (<any>this.myForm).controls.transactionType;
      // ctrl_.setValidators(Validators.required);
      // ctrl_.updateValueAndValidity();


      // const ctrl: FormControl = (<any>this.myForm).controls.appliesTo;
      // ctrl.setValidators(Validators.required);
      // ctrl.updateValueAndValidity();
      if (this.selectedDetailItem.tradingSide == null || this.selectedDetailItem.tradingSide == "null") {
        this.myForm.controls['appliesTo'].setErrors({ 'required': true });
      }
      
      if (this.allTransTypes) {
        let transList=[]
        for (let i = 0; i < this.transactionTypeList.length; i++) {
          this.transactionTypeList[i].$checked = true;
          transList.push(this.transactionTypeList[i]);
        }
        this.transactionTypeControl.checkedItems = transList
        this.allTransTypes = false
      }
      debugger
      for (let selectedTransactionType of this.transactionTypeControl.checkedItems) {
        this.selectedDetailItem.traansactionTypesExchange = new TraansactionTypesExchange();
        this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId = selectedTransactionType.traansactionTypeExchangeId;
        this.selectedDetailItem.traansactionTypesExchange.transactionType = selectedTransactionType.transactionType;
        if (!this.isDetailEditing) {
          if (AppUtility.isValidVariable(this.detailList) && this.detailList.items.length && this.myForm.valid) {
            if (this.isUnique()) {
              this.loadObject(this.selectedDetailItem);
              this.AllowingEdit();
            }
          }
          else {
            // it is the 1st ever element to be added in the list.
            if (this.myForm.valid) {
              this.detailList = new wjcCore.CollectionView();
              this.loadObject(this.selectedDetailItem);
              this.AllowingEdit();
            }
          }
        }
        else {
          // this part will be executed in case of editing the detail records in Modal.
          if (this.myForm.valid) {
            let temp: ClientLevieDetail = new ClientLevieDetail();
            temp = (JSON.parse(JSON.stringify(this.detailList.currentItem)));
            this.deleteCurrentItem();
            if (this.isUnique())
              this.loadObject(this.selectedDetailItem);
            else
              this.loadObject(temp);
            this.detailList.refresh();
            this.flexDetail.refresh();
            this.isDetailEditing = false;
            this.AllowingEdit();
          }
        }
      }
      this.transactionTypeList = [];
      this.populateTransactionTypeList(this.exchangeName.selectedValue);
      this.selectedDetailItem.levyRate = 0;
      this.selectedDetailItem.unProcessedLevy = null;
      this.selectedItem.tradingSide = this.appliesToList[0].abbreviation;
      this.selectedDetailItem.effectiveDate = this.today;
      this.selectedDetailItem.effectiveToDate = this.today;
      this.transactionTypeControl.placeholder = 'Select';
    }
  }

  public onAllSelected(e) {
    if (e.target.checked) {
      this.transactionTypeControl.isDisabled = true;
      this.allTransTypes = true;
      this.transactionTypeControl.placeholder = 'All';
    } else {
      this.transactionTypeControl.isDisabled = false;
      this.allTransTypes = false;
    }
  }

  public onAppliesToChangeEvent(stId) {
    if (AppConstants.SELL_ABBREVIATION == stId) {
      this.selectedDetailItem.tradingSideDisplay_ = AppConstants.SELL_STRING;
    } else if (AppConstants.BUY_ABBREVIATION == stId) {
      this.selectedDetailItem.tradingSideDisplay_ = AppConstants.BUY_STRING;
    } else {
      this.selectedDetailItem.tradingSideDisplay_ = AppConstants.BOTH_STRING;
    }
  }

  public onEditAction() {
    debugger
    if (!AppUtility.isEmpty(this.itemsList.currentItem)) {
      this.clearFields(true, true);
      this.hideForm = true;
      this.isEditing = true;
      this.addingNew = false;
      this.selectedItem.leviesMaster = this.itemsList.currentItem;
      this.getClientLevieDetailList(this.selectedItem.leviesMaster.leviesMasterId);
      this.itemsList.editItem(this.selectedItem);
    }
    this.addingNew = false;
    this.onModalLoaded();
    this.AllowingEdit();
    this.flexDetail.refresh();

  }

  /**
   * This function allow the user to edit the Levis detail
   * if the date of that detail is greater than the current date.
   */
  private AllowingEdit() {
    this.isParentDisabled = false;

    let milliSecondsInOneDay: Number = 86400000;

    // Number of days from  01 January, 1970
    let _Day: Number = Math.round(new Date().valueOf() / milliSecondsInOneDay.valueOf());

    if (AppUtility.isValidVariable(this.detailList)) {
      for (let i = 0; i < this.detailList.items.length; i++) {

        // Number of days from  01 January, 1970
        let _dayOfRecord: Number =
          Math.round(this.detailList.items[i].effectiveDate.valueOf() /
            milliSecondsInOneDay.valueOf());


        if (isNaN(_dayOfRecord.valueOf()))
          _dayOfRecord = Math.round(Date.parse(
            this.detailList.items[i].effectiveDate.valueOf()
          ).valueOf() / milliSecondsInOneDay.valueOf());

        if (_dayOfRecord >= _Day) {
          if (this.detailList.items[i].leviesDetailId == null) {
            this.detailList.items[i].validFrom = true;
            this.detailList.items[i].newElement = true;
          }
          else {
            this.detailList.items[i].validFrom = true;
            this.detailList.items[i].newElement = false;
          }
        }
        else {
          this.isParentDisabled = true;
          this.detailList.items[i].validFrom = false;
          this.detailList.items[i].newElement = false;
        }
      }
      this.detailList.refresh();
    }
  }

  private isUnique(): boolean {
    let _sell: boolean = false;
    let _buy: boolean = false;
    let _both: boolean = false;
    let _itemTradingSide: String = this.selectedDetailItem.tradingSide;
    let b: boolean = true;

    if (AppUtility.isValidVariable(this.detailList)) {
      for (let i = 0; i < this.detailList.items.length; i++) {

        if (this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId ==
          this.detailList.items[i].traansactionTypesExchange.traansactionTypeExchangeId) {
          if (this.detailList.items[i].tradingSide == 'S')
            _sell = true;
          else if (this.detailList.items[i].tradingSide == 'B')
            _buy = true;
          else if (this.detailList.items[i].tradingSide == 'O')
            _both = true;
        }
      }
    }


    if (_both || (_sell && _buy))                  // if Both is true, neither Buy nor Sell is allowed.
      b = false;
    else if (!_buy && _sell && !_both) {
      if (_itemTradingSide == 'B') b = true;
      else b = false;
    }
    else if (_buy && !_sell && !_both) {
      if (_itemTradingSide == 'S') b = true;
      else b = false;
    }
    else if (!_buy && !_sell && !_both)
      b = true;

    if (!b) {
      this.dialogCmp.statusMsg = 'A record should be Unique by Levy Code, Transaction Type and Applies To';
      this.dialogCmp.showAlartDialog('Warning');
    }
    // alert('A record should be Unique by Levy Code, Settlement Type and Applies To');
    this.isNotUnique = true;
    return b;
  }

  public onEditDetailAction() {
    debugger
    this.isDetailEditing = true;
    this.transactionTypeControl.isDisabled = false;
    this.selectedDetailItem = (JSON.parse(JSON.stringify(this.detailList.currentItem)));
    this.selectedDetailItem.effectiveDate = this.detailList.currentItem.effectiveDate;

    this.selectedDetailItem.leviesMaster = JSON.parse(JSON.stringify(this.selectedItem.leviesMaster));
    this.transactionTypeControl.placeholder = 'Select';
    for (let i = 0; i < this.transactionTypeList.length; i++) {
      this.transactionTypeList[i].$checked = false;
      if (this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId == this.transactionTypeList[i].traansactionTypeExchangeId) {
        this.transactionTypeList[i].$checked = true;
        this.transactionTypeControl.placeholder = this.transactionTypeList[i].transactionType;
        const ctrl_: FormControl = (<any>this.myForm).controls.transactionType;
        ctrl_.setValidators(null);
        ctrl_.updateValueAndValidity();
      }
    }
    this.onLevyTypeChangeEvent(this.selectedItem.leviesMaster.levyType);

  }

  public onLevyRateChange(LevyRate: Number) {
    if (LevyRate.valueOf() < 0 || LevyRate.valueOf() > this.maxLevyRate)
      this.LevyRateError = true;
    else
      this.LevyRateError = false;
  }

  onEditDetailDelete() {
    if (this.detailList.items.length > 1) {
      this.selectedItem.traansactionTypesExchange = this.transactionTypeList[1];
      this.deleteCurrentItem();
      this.AllowingEdit();
    }
    else {
      this.dialogCmp.statusMsg = 'At least 1 item is required in Client Levy Detail.';
      this.dialogCmp.showAlartDialog('Warning');
    }
    // alert('Atleast 1 item is required in Client Levy Detail.');
  }

  public deleteCurrentItem() {
    this.detailList.remove(this.detailList.currentItem);
  }

  public onLevyTypeChangeEvent(_isPercentage: String) {
    /* if (_isPercentage == 'P')
       this.selectedItem.leviesMaster.levyType = 'P';
     else if (_isPercentage == 'F')
       this.selectedItem.leviesMaster.levyType = 'F';
     else if (_isPercentage == 'C')
       this.selectedItem.leviesMaster.levyType = 'C';
     else if (_isPercentage == 'D')
       this.selectedItem.leviesMaster.levyType = 'D';
     else if (_isPercentage == 'B')
       this.selectedItem.leviesMaster.levyType = 'B';*/
    if (_isPercentage == 'F') {
      this.levyRateLabelModalDisplay = 'Levy Rate (Per Share)';
      this.maxLevyRate = 999999.9999;
      // this.levyRateControl.min = 0;
      //     this.levyRateControl.max = 999999.9999;
    }
    else {
      this.levyRateLabelModalDisplay = 'Levy Rate (Overall)';
      this.maxLevyRate = 100;
      // this.levyRateControl.min = 0;
      //     this.levyRateControl.max = 100;
    }

    if (this.selectedDetailItem.levyRate.valueOf() < 0 || this.selectedDetailItem.levyRate > this.maxLevyRate) {
      this.LevyRateError = true;
    }
    else {
      this.LevyRateError = false;
    }
  }

  public FinalSave() {

    const ctrl_: FormControl = (<any>this.myForm).controls.transactionType;
    ctrl_.setValidators(null);
    ctrl_.updateValueAndValidity();

    const ctrl: FormControl = (<any>this.myForm).controls.appliesTo;
    ctrl.setValidators(null);
    ctrl.updateValueAndValidity();


    this.finalSaveUpdate = true;
    this.isEditing = false;
  }


  public FinalUpdate() {
    this.finalSaveUpdate = true;
    const ctrl_: FormControl = (<any>this.myForm).controls.transactionType;
    ctrl_.setValidators(null);
    ctrl_.updateValueAndValidity();

    const ctrl: FormControl = (<any>this.myForm).controls.appliesTo;
    ctrl.setValidators(null);
    ctrl.updateValueAndValidity();
  }
  public onSaveAction(model: any, isValid: boolean) {
    debugger
    if (!this.LevyRateError) {
      this.isSubmitted = true;
      if (this.finalSaveUpdate) {
        if (isValid) {
          if (this.isEditing) {
            if (AppUtility.isValidVariable(this.detailList)) {
              let tempArray: ClientLevieDetail[] = [];
              for (let i = 0; i < this.detailList.items.length; i++) {
                tempArray[i] = new ClientLevieDetail();
                this.detailList.items[i].leviesMaster = this.selectedItem.leviesMaster;
                tempArray[i] = this.detailList.items[i];
              }
              this.listingService.updateLevies(tempArray).subscribe(
                data => {
                  this.detailList.commitEdit();
                  // this.clearFields(true, true);
                  //alert(this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId + " ," + this.transactionTypeList[0].traansactionTypeExchangeId);
                  //if (this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId == this.transactionTypeList[0].traansactionTypeExchangeId) {
                  this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                  this.dialogCmp.showAlartDialog('Success');
                  //}
                  // alert(AppConstants.MSG_RECORD_UPDATED);
                  this.populateClientLevieMasterList();
                  if (AppUtility.isValidVariable(this.itemsList)) {
                    this.itemsList.refresh();
                  }
                  this.flex.refresh();
                  if (AppUtility.isValidVariable(this.itemsList))
                    AppUtility.moveSelectionToLastItem(this.itemsList);
                  // this.hideModal();
                },
                err => {
                  this.errorMessage = err;
                  this.hideForm = true;
                  this.dialogCmp.statusMsg = this.errorMessage;
                  this.dialogCmp.showAlartDialog('Error');
                  // alert(this.errorMessage);
                }
              );
            }
          }
          else {
            if (AppUtility.isValidVariable(this.detailList)) {
              let tempArray: ClientLevieDetail[] = [];
              for (let i = 0; i < this.detailList.items.length; i++) {
                tempArray[i] = new ClientLevieDetail();
                this.detailList.items[i].leviesMaster = (JSON.parse(JSON.stringify(this.selectedItem.leviesMaster)));
                tempArray[i] = this.detailList.items[i];
              }
              if (!(AppUtility.isValidVariable(ClientLeviePage._exchangeid)))
                ClientLeviePage._exchangeid = this.selectedItem.leviesMaster.exchange.exchangeId;
              this.listingService.saveLevies(tempArray).subscribe(
                data => {
                  // this.clearFields(true, true);
                  // alert(AppConstants.MSG_RECORD_SAVED);
                  if (AppUtility.isEmpty(this.itemsList))
                    this.itemsList = new wjcCore.CollectionView;
                  this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
                  this.dialogCmp.showAlartDialog('Success');

                  this.populateClientLevieMasterList();
                  if (AppUtility.isValidVariable(this.itemsList))
                    this.itemsList.refresh();
                  AppUtility.moveSelectionToLastItem(this.itemsList);
                  this.flex.refresh();
                  // this.hideModal();
                },
                err => {
                  this.clearFields(false, true);
                  this.hideForm = true;
                  this.errorMessage = err;
                  this.dialogCmp.statusMsg = this.errorMessage;
                  this.dialogCmp.showAlartDialog('Error');

                  // alert(this.errorMessage);
                }
              );
              this.selectedDetailItem.traansactionTypesExchange = this.transactionTypeList[0];

            }
            else {
              // alert('Atleast 1 item is required in Client Levy Detail.');
              this.dialogCmp.statusMsg = 'At least 1 item is required in Client Levy Detail.';
              this.dialogCmp.showAlartDialog('Warning');

              this.clearFields(false, true);
            }
          }
        }
      }
      else {
        if (isValid) {
          let b1: boolean = this.addingNew;
          let b2: boolean = this.isEditing;
          if (!this.isDetailEditing)
            this.clearFields(false, true);
          this.addingNew = b1;
          this.isEditing = b2;

        }
      }
      this.finalSaveUpdate = false;
    }
  }
  /***************************************
 *          Private Methods
 **************************************/

  private populateTransactionTypeList(exchangeId: Number) {
    this.loader.show();
    this.listingService.getTransactionTypeByExchange(exchangeId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (!AppUtility.isEmptyArray(restData)) {
            this.transactionTypeList = restData;
            this.disabledCheckbox = true;
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error });
  }
  /**
   * Getting the Master record for selected Exchange.
   */
  private populateClientLevieMasterList() {
    this.loader.show();
    this.listingService.getLeviesByBroker(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            this.itemsList = new wjcCore.CollectionView();
            this.flex.refresh();

            // alert(this.errorMessage);
            // this.dialogCmp.statusMsg = this.errorMessage;
            // this.dialogCmp.showAlartDialog('Error');

          } else {
            this.itemsList = new wjcCore.CollectionView(restData);
            restData.sort((a: any, b: any) => {
              if (a.exchange.exchangeCode.toLowerCase() < b.exchange.exchangeCode.toLowerCase()) return -1;
              if (a.exchange.exchangeCode.toLowerCase() > b.exchange.exchangeCode.toLowerCase()) return 1;
              return 0;
            });
          }
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error;
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        });
  }

  private getClientLevieDetailList(_leviesMasterId: Number) {
    this.listingService.getClientLevieDetailList(_leviesMasterId, AppConstants.participantId)
      .subscribe(
        restData => {
          debugger
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            this.detailList = new wjcCore.CollectionView();
            this.flexDetail.refresh();
            //alert(this.errorMessage);
          } else {
            this.detailList = new wjcCore.CollectionView(restData);

            this.AllowingEdit();
          }
        },
        error => {
          this.errorMessage = <any>error;
        });
  }

  private populateVoucherTypeList() {
    this.loader.show();
    this.listingService.getVoucherTypeList(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          this.voucherTypeList = restData;
          var vt: VoucherType = new VoucherType();
          vt.voucherTypeId = AppConstants.PLEASE_SELECT_VAL;
          vt.voucherType = AppConstants.PLEASE_SELECT_STR;
          this.voucherTypeList.unshift(vt);
        },
        error => { this.loader.hide(); this.errorMessage = <any>error });
  }

  private populateChartOfAccountList() {
    this.loader.show();
    this.listingService.getChartOfAccountBasicInfoList(AppConstants.participantId, true)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            this.chartOfAccountList = restData;
            var vt: BasicInfo = new BasicInfo();
            vt.id = AppConstants.PLEASE_SELECT_VAL;
            vt.displayName = AppConstants.PLEASE_SELECT_STR;
            this.chartOfAccountList.unshift(vt);
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error });
  }

  private populateExchangeList() {
    this.loader.show();
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.exchangeNameList = restData;

          let cs: Exchange = new Exchange();
          cs.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          cs.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          this.exchangeNameList.unshift(cs);
          this.selectedItem.leviesMaster.exchange.exchangeId = this.exchangeNameList[0].exchangeId;
          this.selectedDetailItem.leviesMaster.exchange.exchangeId = this.exchangeNameList[0].exchangeId;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error;;
        });
  }

  public onExchangeChangeEvent(exId) {
    if (AppUtility.isValidVariable(exId)) {
      this.populateTransactionTypeList(exId);
    }
  }

  private addFormValidations() {
    this.myForm = this._fb.group({
      levyCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      voucherTypeId: ['', Validators.compose([Validators.required])],
      levyDescription: ['', Validators.compose([Validators.required])],
      vouNaration: ['', Validators.compose([Validators.required,])],
      chartOfAccountId: ['', Validators.compose([Validators.required])],
      exchangeName: ['', Validators.compose([Validators.required])],
      levyType: ['', Validators.compose([Validators.required])],
      transactionType: ['', Validators.compose([Validators.required])],
      effectiveDate: ['', Validators.compose([Validators.required])],
      levyRate: ['', Validators.compose([Validators.required])],
      appliesTo: ['', Validators.compose([Validators.required])],
      active: [''],

      name: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      level: ['', Validators.compose([Validators.required])],
      recurrence: ['', Validators.compose([Validators.required])],
      marketName: [''],
      SecurityType: [''],
      effectiveToDate: ['', Validators.compose([Validators.required])],
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
