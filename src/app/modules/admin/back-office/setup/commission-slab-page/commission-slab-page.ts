'use strict';
import { Component, OnInit, AfterViewInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';

import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';


import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { CommissionSlabDetail } from 'app/models/commission-slab-detail';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { TraansactionTypesExchange } from 'app/models/traansaction-type-exchange';
import { CommissionSlabMaster } from 'app/models/commission-slab-master';
import { Participant } from 'app/models/participant';

declare var jQuery: any;
@Component({
  selector: 'commission-slab-page',
  templateUrl: './commission-slab-page.html',
})

export class CommissionSlabPage implements OnInit, AfterViewInit {

  public static upperRangeMax: Number = 9999999999;
  public myForm: FormGroup;
  itemsList: wjcCore.CollectionView;
  slabDetailList: wjcCore.CollectionView;
  selectedItem: CommissionSlabDetail;

  selectedDetailItem: CommissionSlabDetail;

  commissionSlabList: any[];
  exchangesList: any[];
  transactionTypeList: any[];
  commissionModeList: any[];
  deliveryFPList: any[];
  commissionSlabDetailList: CommissionSlabDetail[];

  errorMessage: string;
  public recExist: boolean;
  public hideForm = false;
  public alertMessage: String;
  public isSubmitted: boolean;
  public disabled: boolean = false;
  public isDisabled: boolean;
  public isEditing: boolean;
  public showButton: boolean;
  public isSearched: boolean;
  public upperRangeError: boolean;
  public lowerRangeError: boolean;
  public deliveryCommError: Boolean;
  public differenceCommError: Boolean;
  public maxCommAmountError: Boolean;
  public isDetailEditing: boolean;
  public static _slabid: Number;
  public static _commissiontype: String;
  public searchButtonClass: boolean = true;
  public searchButtonTooltip: String;
  public addingNew: boolean;
  public finalSaveUpdate: boolean;
  public traansactionTypeExchangeId: Number

  public commisionRateLabelPageDisplay: String;
  public compulsoryError: boolean;
  private _pageSize = 0;

  public minValueDel: Number = 0.0000;
  public maxValueDel: Number = 9999999999.9999;

  public minValueDif: Number = 0.0000;
  public maxValueDif: Number = 9999999999.9999;
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('flexDetail') flexDetail: wjcGrid.FlexGrid;
  @ViewChild('slabName') slabName: wjcInput.InputMask;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  @ViewChild('updateBtn') updateBtn: ElementRef;
  @ViewChild('saveBtn') saveBtn: ElementRef;
  @ViewChild('cmbTransactionType') cmbTransactionType: wjcInput.ComboBox;
  @ViewChild('cmbExchange') cmbExchange: wjcInput.ComboBox;
  @ViewChild('cmbCommissionMode') cmbCommissionMode: wjcInput.ComboBox;
  @ViewChild('deliveryComm') txtDeliveryComm: wjcInput.InputNumber;
  @ViewChild('differenceComm') txtDifferenceComm: wjcInput.InputNumber;
  @ViewChild('slabGrid') slabGrid: wjcGrid.FlexGrid;
  lang: string;

  public tabFocusChanged() {
    if (this.isEditing)
      this.updateBtn.nativeElement.focus();
    else
      this.saveBtn.nativeElement.focus();
  }

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.clearFields();
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.disabled = false;

    this.commissionModeList = [
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

    this.deliveryFPList = [
      {
        'value': AppConstants.NO_STRING,
        'abbreviation': AppConstants.FIXED_ABBREVIATION
      },
      {
        'value': AppConstants.YES_STRING,
        'abbreviation': AppConstants.PERCENTAGE_ABBREVIATION
      }
    ];
    //this.claims = authService.claims;    
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }

  public ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function () {
      self.slabName.focus();
      wjcGrid.FlexGrid.invalidateAll();
    });

    this.flexDetail.invalidate();
  }

  ngOnInit() {

    jQuery('.parsleyjs').parsley();

    // Populate Commission Slab List in DropDown in search option.
    this.populateCommissionSlabList();

    // populate exchangesList
    this.populateExchangeList();

    this.clearFields();

    // Add Form Validations
    this.addFormValidations();
  }

  /*********************************
 *      Public & Action Methods
 *********************************/

  public clearFields() {
    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }


    if (AppUtility.isValidVariable(this.itemsList)) {
      this.itemsList.cancelEdit();
      this.itemsList.cancelNew();
    }

    if (AppUtility.isValidVariable(this.slabDetailList)) {
      this.slabDetailList.cancelEdit();
      this.slabDetailList.cancelNew();
    }
    this.traansactionTypeExchangeId = null;

    this.alertMessage = '';
    this.compulsoryError = false;
    this.hideForm = false;
    this.isEditing = false;
    this.addingNew = true;
    this.isDetailEditing = false;
    this.isSearched = false;
    this.upperRangeError = false;
    this.maxCommAmountError = false;
    this.lowerRangeError = false;
    this.deliveryCommError = false;
    this.differenceCommError = false;
    // this.searchButtonClass = 'btn btn-success btn-sm disabled';
    this.searchButtonClass = true;
    this.searchButtonTooltip = 'Select Commission Slab first';
    this.finalSaveUpdate = false;

    this.selectedItem = new CommissionSlabDetail();

    this.selectedItem.traansactionTypesExchange = new TraansactionTypesExchange();
    this.selectedItem.traansactionTypesExchange.exchangeId = null;
    this.selectedItem.traansactionTypesExchange.exchange = null;
    this.selectedItem.traansactionTypesExchange.traansactionTypeExchangeId = null;
    this.selectedItem.traansactionTypesExchange.transactionType = null;


    this.selectedItem.commissionSlabDetailID = null;
    this.selectedItem.lowerRange = 0;
    this.selectedItem.upperRange = this.selectedItem.lowerRange.valueOf() + 1;

    this.selectedItem.deliveryComm = 0.000000;
    this.selectedItem.differenceComm = 0.000000;
    this.selectedItem.deliveryFP = 'F';
    this.selectedItem.differenceFP = 'F';
    this.selectedItem.deliveryFPDisplay_ = 'N';
    this.selectedItem.differenceFPDisplay_ = 'N';

    this.selectedItem.commissionSlabMaster = new CommissionSlabMaster();
    this.selectedItem.commissionSlabMaster.minCommAmount = 0;
    this.selectedItem.commissionSlabMaster.maxCommAmount = 0;
    this.selectedItem.commissionSlabMaster.minMaxCommFlag = 0;

    if (!AppUtility.isEmptyArray(this.deliveryFPList)) {
      this.selectedItem.deliveryFP = this.deliveryFPList[0].abbreviation;
      this.selectedItem.differenceFP = this.deliveryFPList[0].abbreviation;
    }

    if (!AppUtility.isEmptyArray(this.commissionSlabList)) {
      this.selectedItem.commissionSlabMaster.commissionSlabId = this.commissionSlabList[0].commissionSlabId;
      this.selectedItem.commissionMode = this.commissionModeList[0].abbreviation;
      this.selectedItem.applyDelCommission = 0;

      this.selectedItem.commissionSlabMaster.slabName = this.commissionSlabList[0].slabName;
      this.selectedItem.commissionSlabMaster.minCommAmount = 0;
      this.selectedItem.commissionSlabMaster.maxCommAmount = 0;
      this.selectedItem.commissionSlabMaster.minMaxCommFlag = 0;

      this.selectedItem.commissionSlabMaster.slabNameDisplay_ = this.commissionSlabList[0].slabNameDisplay_;
      this.selectedItem.commissionSlabMaster.participant = new Participant();
      this.selectedItem.commissionSlabMaster.participant.participantId = AppConstants.participantId;
    }

    this.isSubmitted = false;
    this.clearExchangesAndTransTypes();

    this.selectedDetailItem = new CommissionSlabDetail();

    this.selectedDetailItem.traansactionTypesExchange = new TraansactionTypesExchange();
    this.selectedDetailItem.traansactionTypesExchange.exchangeId = null;
    this.selectedDetailItem.traansactionTypesExchange.exchange = null;
    this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId = null;
    this.selectedDetailItem.traansactionTypesExchange.transactionType = null;

    this.selectedDetailItem.commissionSlabDetailID = null;
    this.selectedDetailItem.lowerRange = 0;
    this.selectedDetailItem.upperRange = 1;

    this.selectedDetailItem.deliveryComm = 0.000000;
    this.selectedDetailItem.differenceComm = 0.000000;
    this.selectedDetailItem.deliveryFP = 'F';
    this.selectedDetailItem.differenceFP = 'F';
    this.selectedDetailItem.deliveryFPDisplay_ = 'N';
    this.selectedDetailItem.differenceFPDisplay_ = 'N';


    this.selectedDetailItem.commissionSlabMaster = new CommissionSlabMaster();
    if (!AppUtility.isEmptyArray(this.deliveryFPList)) {
      this.selectedDetailItem.deliveryFP = this.deliveryFPList[0].abbreviation;
      this.selectedDetailItem.differenceFP = this.deliveryFPList[0].abbreviation;
    }

    if (!AppUtility.isEmptyArray(this.commissionSlabList)) {
      this.selectedDetailItem.commissionSlabMaster.commissionSlabId = this.commissionSlabList[0].commissionSlabId;
      this.selectedDetailItem.commissionMode = this.commissionModeList[0].abbreviation;
      this.selectedDetailItem.applyDelCommission = 0;

      this.selectedDetailItem.commissionSlabMaster.slabName = this.commissionSlabList[0].slabName;

      this.selectedDetailItem.commissionSlabMaster.minCommAmount = 0;
      this.selectedDetailItem.commissionSlabMaster.maxCommAmount = 0;
      this.selectedDetailItem.commissionSlabMaster.minMaxCommFlag = 0;

      this.selectedDetailItem.commissionSlabMaster.slabNameDisplay_ = this.commissionSlabList[0].slabNameDisplay_;
      this.selectedDetailItem.commissionSlabMaster.participant = new Participant();
      this.selectedDetailItem.commissionSlabMaster.participant.participantId = AppConstants.participantId;
    }

    //  if (!AppUtility.isEmptyArray(this.exchangesList)) {
    //    this.selectedDetailItem.traansactionTypesExchange.exchangeId = this.exchangesList[0].exchangeId;
    //    this.selectedDetailItem.traansactionTypesExchange.exchange = this.exchangesList[0].exchangeName;
    //  }

    //  if (!AppUtility.isEmptyArray(this.transactionTypeList)) {
    //    this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId = this.transactionTypeList[0].traansactionTypeExchangeId;
    //    this.selectedDetailItem.traansactionTypesExchange.transactionType = this.transactionTypeList[0].transactionType;
    //  }

    this.minValueDel = 0.0000;
    this.maxValueDel = 9999999999.9999;
    this.minValueDif = 0.0000;
    this.maxValueDif = 9999999999.9999;
    this.disabled = false;
  }

  public closeAlert() {
    this.compulsoryError = false;
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

  public onExchangeChangeEvent(exId) {
    if (AppUtility.isValidVariable(exId)) {
      this.populateTransactionTypeList(exId);
    }
  }

  public onModalLoaded() {
    $('#add_new').on('shown.bs.modal', function () {
      wjcGrid.FlexGrid.invalidateAll();
    });
    this.flexDetail.invalidate();
  }
  public onCancelAction() {
    this.clearFields();
    this.getSlabCommissionDetailList(CommissionSlabPage._slabid);
    this.populateCommissionSlabList();
    this.hideForm = false;

    if (AppUtility.isValidVariable(this.itemsList))
      this.itemsList.refresh();
    this.flex.refresh();
  }
  public onNewAction() {
    this.clearFields();
    this.hideForm = true;
    if (AppUtility.isValidVariable(this.slabDetailList)) {
      while (this.slabDetailList.items.length > 0) {
        this.slabDetailList.removeAt(0);
      }
      this.onModalLoaded();
    }
    this.addingNew = true;
  }
  public onSearchAction() {
    this.searchCommissionSlab(this.selectedItem.commissionSlabMaster.commissionSlabId);
  }
  private searchCommissionSlab(slabId: Number) {
    this.getSlabCommissionDetailList(slabId);
    this.flex.onLoadedRows();
    if (AppUtility.isValidVariable(this.itemsList)) {
      this.itemsList.items.sort((a: CommissionSlabDetail, b: CommissionSlabDetail) =>
        a.lowerRange.valueOf() - b.lowerRange.valueOf());
    }
  }

  public loadObject(selectedDetailItem: CommissionSlabDetail, selectedItem: CommissionSlabDetail) {
    let temp_detail = this.slabDetailList.addNew();
    temp_detail.commissionSlabDetailID = selectedDetailItem.commissionSlabDetailID;
    temp_detail.lowerRange = selectedDetailItem.lowerRange;
    temp_detail.upperRange = selectedDetailItem.upperRange;

    temp_detail.deliveryComm = selectedDetailItem.deliveryComm;
    temp_detail.differenceComm = selectedDetailItem.differenceComm;
    temp_detail.deliveryFP = selectedDetailItem.deliveryFP;
    temp_detail.differenceFP = selectedDetailItem.differenceFP;
    temp_detail.deliveryFPDisplay_ = selectedDetailItem.deliveryFPDisplay_;
    temp_detail.differenceFPDisplay_ = selectedDetailItem.differenceFPDisplay_;

    temp_detail.commissionSlabMaster = selectedItem.commissionSlabMaster;
    temp_detail.commissionSlabMaster.commissionSlabId = selectedItem.commissionSlabMaster.commissionSlabId;
    temp_detail.commissionSlabMaster.slabName = selectedItem.commissionSlabMaster.slabName;
    temp_detail.commissionMode = selectedDetailItem.commissionMode;
    temp_detail.applyDelCommission = selectedDetailItem.applyDelCommission;
    temp_detail.commissionModeDisplay_ = selectedDetailItem.commissionModeDisplay_;
    temp_detail.commissionSlabMaster.participant = new Participant();
    temp_detail.commissionSlabMaster.participant.participantId = AppConstants.participantId;

    temp_detail.traansactionTypesExchange = new TraansactionTypesExchange();
    temp_detail.traansactionTypesExchange.exchangeId = selectedDetailItem.traansactionTypesExchange.exchangeId;
    temp_detail.traansactionTypesExchange.traansactionTypeExchangeId = selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId;
    temp_detail.traansactionTypesExchange.exchange = selectedDetailItem.traansactionTypesExchange.exchange;
    temp_detail.traansactionTypesExchange.transactionType = selectedDetailItem.traansactionTypesExchange.transactionType;

    this.slabDetailList.commitNew();
    if (!AppUtility.isEmptyArray(this.exchangesList)) {
      this.selectedDetailItem.traansactionTypesExchange.exchangeId = this.exchangesList[0].exchangeId;
      this.selectedDetailItem.traansactionTypesExchange.exchange = this.exchangesList[0].exchangeName;
    }

    this.populateTransactionTypeList(this.selectedDetailItem.traansactionTypesExchange.exchangeId);

    if (!AppUtility.isEmptyArray(this.commissionModeList)) {
      this.selectedDetailItem.commissionMode = this.commissionModeList[0].commissionMode;
      this.selectedDetailItem.commissionModeDisplay_ = this.commissionModeList[0].commissionModeDisplay_;
    }

    this.selectedDetailItem.lowerRange = 0;
    this.selectedDetailItem.upperRange = 1;

    this.selectedDetailItem.deliveryComm = 0.000000;
    this.selectedDetailItem.differenceComm = 0.000000;
    this.selectedDetailItem.deliveryFP = 'F';
    this.selectedDetailItem.differenceFP = 'F';
    this.selectedDetailItem.deliveryFPDisplay_ = 'N';
    this.selectedDetailItem.differenceFPDisplay_ = 'N';
    this.selectedDetailItem.applyDelCommission = 0;

  }

  public clearExchangesAndTransTypes() {

    if (AppUtility.isValidVariable(this.myForm)) {
      // const ctrl_: FormControl = (<any>this.myForm).controls.exchangeName;
      // ctrl_.setValidators(null);
      // ctrl_.updateValueAndValidity();

      const ctrl_: FormControl = (<any>this.myForm).controls.exchangeId;
      ctrl_.setValidators(null);
      ctrl_.updateValueAndValidity();

      const ctrl: FormControl = (<any>this.myForm).controls.transactionType;
      ctrl.setValidators(null);
      ctrl.updateValueAndValidity();

      const ctr2: FormControl = (<any>this.myForm).controls.commissionMode;
      ctr2.setValidators(null);
      ctr2.updateValueAndValidity();
    }
  }
  public onAddNewRow() {
    if (AppUtility.isValidVariable(this.myForm)) {
      // const ctrl_: FormControl = (<any>this.myForm).controls.exchangeName;
      // ctrl_.setValidators(null);
      // ctrl_.updateValueAndValidity();

      const ctrl_: FormControl = (<any>this.myForm).controls.exchangeId;
      ctrl_.setValidators(Validators.required);
      ctrl_.updateValueAndValidity();

      const ctrl: FormControl = (<any>this.myForm).controls.transactionType;
      ctrl.setValidators(Validators.required);
      ctrl.updateValueAndValidity();

      const ctr2: FormControl = (<any>this.myForm).controls.commissionMode;
      ctr2.setValidators(Validators.required);
      ctr2.updateValueAndValidity();
    }
    if (AppUtility.isValidVariable(this.cmbExchange.selectedValue) && AppUtility.isValidVariable(this.cmbTransactionType.selectedValue) && AppUtility.isValidVariable(this.cmbCommissionMode.selectedValue)) {
      if (!this.upperRangeError && !this.lowerRangeError) {
        if (this.checkValuesOverlaping()) {
          this.alertMessage = '';
          this.compulsoryError = false;
          this.isDisabled = false;
          if (this.selectedDetailItem.deliveryFP == 'P' && this.selectedDetailItem.deliveryComm > 100) {
            this.deliveryCommError = true;
          }
          else if (this.selectedDetailItem.differenceFP == 'P' && this.selectedDetailItem.differenceComm > 100) {
            this.differenceCommError = true;
          }
          else {
            this.deliveryCommError = false;
            this.differenceCommError = false;
            if (!this.isDetailEditing) {
              if (AppUtility.isValidVariable(this.slabDetailList) && this.slabDetailList.items.length) {
                this.selectedDetailItem.traansactionTypesExchange.transactionType = this.cmbTransactionType.text;
                this.selectedDetailItem.traansactionTypesExchange.exchange = this.cmbExchange.text;
                this.loadObject(JSON.parse(JSON.stringify(this.selectedDetailItem)), JSON.parse(JSON.stringify(this.selectedItem)));
                this.clearExchangesAndTransTypes();
              }
              else {
                // it is the 1st ever element to be added in the list.
                this.onUpperRangeChange(this.selectedDetailItem.upperRange);
                // this.onDeliveryFPChangeEvent(this.selectedDetailItem.deliveryFP);
                // this.onDifferenceFPChangeEvent(this.selectedDetailItem.differenceFP);
                this.slabDetailList = new wjcCore.CollectionView();
                this.selectedDetailItem.traansactionTypesExchange.transactionType = this.cmbTransactionType.text;
                this.selectedDetailItem.traansactionTypesExchange.exchange = this.cmbExchange.text;
                this.loadObject(JSON.parse(JSON.stringify(this.selectedDetailItem)), JSON.parse(JSON.stringify(this.selectedItem)));
                this.clearExchangesAndTransTypes();
              }
            }
            else {
              // this part will be executed in case of editing the detail records in Modal.
              this.deleteCurrentItem();
              this.loadObject(JSON.parse(JSON.stringify(this.selectedDetailItem)), JSON.parse(JSON.stringify(this.selectedItem)));
              this.isDetailEditing = false;
              this.clearExchangesAndTransTypes();
            }
          }
        } else {
          switch(this.lang) {
            case 'en':
              this.alertMessage = 'Upper/Lower Range is overlapping or exceeding with existing slabs. Please Verify.';
              break;
            case 'pt':
              this.alertMessage = 'A faixa superior/inferior está se sobrepondo ou excedendo as lajes existentes. Por favor verifique.';
              break;
            default:
              this.alertMessage = 'Upper/Lower Range is overlapping or exceeding with existing slabs. Please Verify.';
          }
          this.compulsoryError = true;
        }
      }
    }
  }
  public onCommissionSlabChangeEvent(selectedSlabId): void {
    if (selectedSlabId == null) {
      // this.searchButtonClass = 'btn btn-success btn-sm disabled';
      this.searchButtonClass = true;
      this.searchButtonTooltip = 'Select Commission Slab first';
    }
    else {
      // this.searchButtonClass = 'btn btn-success btn-sm';
      this.searchButtonClass = false;
      this.searchButtonTooltip = 'Search';
    }
  }

  public onTransactionTypeChangeEvent(TransactionTypeId: String) {
    this.cmbCommissionMode.isDisabled = false;
    if (AppUtility.isValidVariable(this.slabDetailList)) {
      for (let i: number = 0; i < this.slabDetailList.items.length; i++) {
        if (this.slabDetailList.items[i].traansactionTypesExchange.traansactionTypeExchangeId == TransactionTypeId) {
          this.cmbCommissionMode.isDisabled = true;
          this.selectedDetailItem.commissionMode = this.slabDetailList.items[i].commissionMode;
          return;
        }
      }
    }
  }

  public onEditAction() {
    if (!AppUtility.isEmpty(this.itemsList.currentItem)) {
      this.clearFields();
      this.hideForm = true;
      this.isEditing = true;
      this.selectedItem = JSON.parse(JSON.stringify(this.itemsList.currentItem));
      this.clearExchangesAndTransTypes();
      this.itemsList.editItem(this.selectedItem);
    }
    this.populateChildItemsList(this.itemsList);

    this.slabDetailList.refresh();
    this.addingNew = false;
  }
  public populateChildItemsList(masterDataList: wjcCore.CollectionView) {
    let detailList = JSON.parse(JSON.stringify(masterDataList.items));
    /**
     * Sending the shallow copy of detail grid to modal by sorting
     * it on basis of lowerRange.
     */
    detailList.sort((a: CommissionSlabDetail, b: CommissionSlabDetail) =>
      a.lowerRange.valueOf() - b.lowerRange.valueOf());
    this.selectedDetailItem.lowerRange = 0;
    this.selectedDetailItem.upperRange = 1;
    this.slabDetailList = new wjcCore.CollectionView(detailList);
  }
  public onMaxCommAmountChange(maxCommAmount: Number) {
    if (maxCommAmount < this.selectedDetailItem.commissionSlabMaster.minCommAmount || maxCommAmount < 0)
      this.maxCommAmountError = true;
    else
      this.maxCommAmountError = false;
  }
  public onUpperRangeChange(upperRange: Number) {
    if (upperRange.valueOf() <= this.selectedDetailItem.lowerRange.valueOf() || upperRange.valueOf() < 0)
      this.upperRangeError = true;
    else
      this.upperRangeError = false;
  }
  public onLowerRangeChange(lowerRange: Number) {
    if (lowerRange.valueOf() < 0)
      this.lowerRangeError = true;
    else
      this.lowerRangeError = false;

    if (this.selectedDetailItem.upperRange.valueOf() <= lowerRange || this.selectedDetailItem.upperRange.valueOf() < 0)
      this.upperRangeError = true;
    else
      this.upperRangeError = false;
  }
  public onDeliveryFPChangeEvent(deliveryComm: String) {
    this.selectedDetailItem.deliveryFP = deliveryComm;
    this.selectedDetailItem.deliveryFPDisplay_ = 'N';
    if (deliveryComm == 'F') {
      this.minValueDel = 0.0000;
      this.maxValueDel = 9999999999.9999;
      //this.selectedDetailItem.deliveryComm = 0;
      this.selectedDetailItem.deliveryFPDisplay_ = 'N';
    }
    else {
      this.minValueDel = 0.0000;
      this.maxValueDel = 100.0000;
      // this.selectedDetailItem.deliveryComm = 0;
      this.selectedDetailItem.deliveryFPDisplay_ = 'Y';
    }
    // this.txtDeliveryComm.value = 0;
  }
  public onDifferenceFPChangeEvent(differenceComm: String) {
    this.selectedDetailItem.differenceFP = differenceComm;
    this.selectedDetailItem.differenceFPDisplay_ = 'N';
    if (differenceComm == 'F') {
      this.minValueDif = 0.0000;
      this.maxValueDif = 9999999999.9999;
      //this.selectedDetailItem.differenceComm = 0;
      this.selectedDetailItem.differenceFPDisplay_ = 'N';
    }
    else {
      this.minValueDif = 0.0000;
      this.maxValueDif = 100.0000;
      //this.selectedDetailItem.differenceComm = 0;
      this.selectedDetailItem.differenceFPDisplay_ = 'Y';
    }
    // this.txtDifferenceComm.value = 0;
  }

  public onMinMaxCommFlagChangeEvent(minMaxCommFlag: boolean) {
    this.disabled = true;
    if (minMaxCommFlag == true) {
      this.disabled = false;
    }
    else if (minMaxCommFlag == false) {
      this.disabled = true;
      this.selectedItem.commissionSlabMaster.minCommAmount = 0;
      this.selectedItem.commissionSlabMaster.maxCommAmount = 0;
    }
    // this.txtDifferenceComm.value = 0;
  }


  public onEditDetailAction() {
    this.isDetailEditing = true;
    this.selectedDetailItem = JSON.parse(JSON.stringify(this.slabDetailList.currentItem));
    this.traansactionTypeExchangeId = this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId;
    // this.populateTransactionTypeList(this.selectedDetailItem.traansactionTypesExchange.exchangeId);
    this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId = this.traansactionTypeExchangeId;
    this.cmbTransactionType.invalidate();
    this.cmbTransactionType.selectedValue = this.traansactionTypeExchangeId;

  }
  onEditDetailDelete() {
    if (this.slabDetailList.items.length > 1) {
      this.isDetailEditing = false;
      this.deleteCurrentItem();
      this.selectedDetailItem.lowerRange = 0;
      this.selectedDetailItem.upperRange = 1;
      this.selectedDetailItem.deliveryComm = 0;
      this.selectedDetailItem.deliveryFP = 'F';
      this.selectedDetailItem.differenceComm = 0;
      this.selectedDetailItem.differenceFP = 'F';
      this.clearExchangesAndTransTypes();
    }
    else {
      this.dialogCmp.statusMsg = 'At least 1 items is required in Commission Slab Detail.';
      this.dialogCmp.showAlartDialog('Warning');
    }
  }
  public deleteCurrentItem() {
    this.slabDetailList.remove(this.slabDetailList.currentItem);
  }

  public FinalSave() {
    
    this.finalSaveUpdate = true;
    this.isEditing = false;

    this.clearExchangesAndTransTypes();
  }
  public FinalUpdate() {
    this.clearExchangesAndTransTypes();
    this.finalSaveUpdate = true;
  }
  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (this.maxCommAmountError) {
      isValid = false;
    }
    if (this.finalSaveUpdate) {
      if (isValid) {
        this.loader.show();
        if (this.isEditing) {
          if (AppUtility.isValidVariable(this.slabDetailList)) {
            let tempArray: CommissionSlabDetail[] = [];
            for (let i = 0; i < this.slabDetailList.items.length; i++) {
              tempArray[i] = new CommissionSlabDetail();
              this.slabDetailList.items[i].commissionSlabMaster.slabName = model.slabName;
              this.slabDetailList.items[i].commissionSlabMaster.slabNameDisplay_ = model.slabName;
              //this.slabDetailList.items[i].commissionMode = model.commissionMode;
              this.slabDetailList.items[i].commissionSlabMaster.minMaxCommFlag = model.minMaxCommFlag;
              this.slabDetailList.items[i].commissionSlabMaster.maxCommAmount = model.maxCommAmount;
              this.slabDetailList.items[i].commissionSlabMaster.minCommAmount = model.minCommAmount;
              //this.slabDetailList.items[i].traansactionTypesExchange.traansactionTypeExchangeId = model.transactionType;
              //this.slabDetailList.items[i].traansactionTypesExchange.exchangeId = model.exchangeId;
              tempArray[i] = this.slabDetailList.items[i];
            }
            this.listingService.updateCommissionSlab(tempArray).subscribe(
              data => {
                this.loader.hide();
                this.slabDetailList.commitEdit();
                this.searchCommissionSlab(data.commissionSlabId);
                //this.itemsList = this.slabDetailList;
                this.itemsList.refresh();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

                //this.populateCommissionSlabList();

                this.itemsList.items.sort((a: CommissionSlabDetail, b: CommissionSlabDetail) =>
                  a.lowerRange.valueOf() - b.lowerRange.valueOf());
                this.flex.refresh();

              },
              error => {
                this.loader.hide();
                if(error.message){
                  this.errorMessage = <any>error.message;
                }
                else
                {
                  this.errorMessage = <any>error;
                }
                this.hideForm = true;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
        else {
          if (AppUtility.isValidVariable(this.slabDetailList)) {
            let tempArray: CommissionSlabDetail[] = [];
            for (let i = 0; i < this.slabDetailList.items.length; i++) {
              tempArray[i] = new CommissionSlabDetail();
              this.slabDetailList.items[i].commissionSlabMaster.slabName = model.slabName;
              this.slabDetailList.items[i].commissionSlabMaster.slabNameDisplay_ = model.slabName;
              // this.slabDetailList.items[i].commissionMode = model.commissionMode;
              this.slabDetailList.items[i].commissionSlabMaster.minMaxCommFlag = model.minMaxCommFlag;
              this.slabDetailList.items[i].commissionSlabMaster.maxCommAmount = model.maxCommAmount;
              this.slabDetailList.items[i].commissionSlabMaster.minCommAmount = model.minCommAmount;
              // this.slabDetailList.items[i].traansactionTypesExchange.traansactionTypeExchangeId = model.transactionType;
              // this.slabDetailList.items[i].traansactionTypesExchange.exchangeId = model.exchangeId;
              this.slabDetailList.items[i].commissionSlabMaster.commissionSlabId = null;
              this.slabDetailList.items[i].commissionSlabDetailID = null;
              tempArray[i] = this.slabDetailList.items[i];
            }
            this.listingService.saveCommissionSlab(tempArray).subscribe(
              data => {
                this.loader.hide();
                if (AppUtility.isEmpty(this.itemsList))
                  this.itemsList = new wjcCore.CollectionView;
                this.searchCommissionSlab(data.commissionSlabId);
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
                this.dialogCmp.showAlartDialog('Success');
                this.populateCommissionSlabList();
                // if (AppUtility.isValidVariable(this.itemsList)) {
                //   this.itemsList = new wjcCore.CollectionView();
                //   this.itemsList.refresh();
                // }

                this.flex.refresh();
              },
              error => {
                this.loader.hide();
                this.hideForm = true;
                if(error.message){
                  this.errorMessage = <any>error.message;
                }
                else
                {
                  this.errorMessage = <any>error;
                }
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
          else {
            this.dialogCmp.statusMsg = 'At least 1 item is required in Commission Slab Detail.';
            this.dialogCmp.showAlartDialog('Warning');
          }
        }
      }
    }
    this.finalSaveUpdate = false;
  }
  /***************************************
 *          Private Methods
 **************************************/
  private checkValuesOverlaping(): boolean {
    if (AppUtility.isValidVariable(this.slabDetailList)) {
      if (this.isDetailEditing) {
        for (let i: number = 0; i < this.slabDetailList.items.length; i++) {
          if (this.slabDetailList.items[i] != this.slabDetailList.currentItem && this.slabDetailList.items[i].traansactionTypesExchange.traansactionTypeExchangeId == this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId &&
            this.slabDetailList.items[i].commissionMode == this.selectedDetailItem.commissionMode) {
            if ((this.selectedDetailItem.lowerRange >= this.slabDetailList.items[i].lowerRange &&
              this.selectedDetailItem.lowerRange <= this.slabDetailList.items[i].upperRange) ||
              (this.selectedDetailItem.upperRange >= this.slabDetailList.items[i].lowerRange &&
                this.selectedDetailItem.upperRange <= this.slabDetailList.items[i].upperRange))
              return false;
          }

        }
      }
      else {
        for (let i: number = 0; i < this.slabDetailList.items.length; i++) {
          if (this.slabDetailList.items[i].traansactionTypesExchange.traansactionTypeExchangeId == this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId &&
            this.slabDetailList.items[i].commissionMode == this.selectedDetailItem.commissionMode) {
            if ((this.selectedDetailItem.lowerRange >= this.slabDetailList.items[i].lowerRange &&
              this.selectedDetailItem.lowerRange <= this.slabDetailList.items[i].upperRange) ||
              (this.selectedDetailItem.upperRange >= this.slabDetailList.items[i].lowerRange &&
                this.selectedDetailItem.upperRange <= this.slabDetailList.items[i].upperRange))
              return false;
          }
        }
      }
    }
    return true;
  }

  private populateTransactionTypeList(exchangeId: Number) {
    this.loader.show();
    this.transactionTypeList = null;
    this.listingService.getTransactionTypeByExchange(exchangeId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (!AppUtility.isEmptyArray(restData)) {
            this.transactionTypeList = restData;
            let sett: TraansactionTypesExchange = new TraansactionTypesExchange();
            sett.traansactionTypeExchangeId = AppConstants.PLEASE_SELECT_VAL;
            sett.transactionType = AppConstants.PLEASE_SELECT_STR;
            this.transactionTypeList.unshift(sett);

            if (!AppUtility.isEmpty(this.traansactionTypeExchangeId)) {
              this.selectedDetailItem.traansactionTypesExchange.traansactionTypeExchangeId = this.traansactionTypeExchangeId;
              this.cmbTransactionType.invalidate();
              this.cmbTransactionType.selectedValue = this.traansactionTypeExchangeId;
            }
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message });
  }
  private populateExchangeList() {
    this.loader.show();
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.loader.hide();
          if (!AppUtility.isEmptyArray(restData)) {
            this.exchangesList = restData;
            let exch: Exchange = new Exchange();
            exch.exchangeId = AppConstants.PLEASE_SELECT_VAL;
            exch.exchangeCode = AppConstants.PLEASE_SELECT_STR;
            this.exchangesList.unshift(exch);
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message });
  }
  private getSlabCommissionDetailList(_commissionSlabId: Number) {
    if (AppUtility.isValidVariable(_commissionSlabId)) {
      this.loader.show();
      this.listingService.getSlabCommissionDetailList(_commissionSlabId)
        .subscribe(
          restData => {
            this.loader.hide();
            CommissionSlabPage._slabid = _commissionSlabId;
            if (AppUtility.isEmptyArray(restData)) {
              this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
              this.itemsList = new wjcCore.CollectionView();
              this.flex.refresh();
            } else {
              this.itemsList = new wjcCore.CollectionView(restData);
            }
          },
          error => {
            this.loader.hide();
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
          });
    }
  }

  private getSlabCommissionDetailListCopyFrom(_commissionSlabId: Number) {
    if (AppUtility.isValidVariable(_commissionSlabId)) {
      this.loader.show();
      this.listingService.getSlabCommissionDetailList(_commissionSlabId)
        .subscribe(
          restData => {
            this.loader.hide();
            if (AppUtility.isEmptyArray(restData)) {
              this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
              this.itemsList = new wjcCore.CollectionView();
              this.flex.refresh();
            } else {
              this.itemsList = new wjcCore.CollectionView(restData);
              let detailList = JSON.parse(JSON.stringify(this.itemsList.items));

              detailList.sort((a: CommissionSlabDetail, b: CommissionSlabDetail) =>
                a.lowerRange.valueOf() - b.lowerRange.valueOf());
              this.selectedDetailItem.lowerRange = 0;
              this.selectedDetailItem.upperRange = 1;
              this.slabDetailList = new wjcCore.CollectionView(detailList);
            }
          },
          error => {
            this.loader.hide();
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
          });
    }
  }

  private populateCommissionSlabList() {
    this.loader.show();
    this.listingService.getCommissionSlabList(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            this.recExist = false;
          } else {
            this.commissionSlabList = restData;
            let cs: CommissionSlabMaster = new CommissionSlabMaster();
            cs.commissionSlabId = AppConstants.PLEASE_SELECT_VAL;
            cs.slabNameDisplay_ = AppConstants.PLEASE_SELECT_STR;
            this.commissionSlabList.unshift(cs);
            this.selectedItem.commissionSlabMaster.commissionSlabId = this.commissionSlabList[0].commissionSlabId;
            this.recExist = true;
          }
        },
        error => {
          this.loader.hide();
          if(error.message){
            this.errorMessage = <any>error.message;
          }
          else
          {
            this.errorMessage = <any>error;
          }
        });
  }

  public populateCommissionSlabListCallingFrom() {
    this.loader.show();
    this.listingService.getCommissionSlabDetailsList(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            this.recExist = false;
          } else {
            this.commissionSlabList = restData;
            this.recExist = true;
          }
        },
        error => {
          this.loader.hide();
          if(error.message){
            this.errorMessage = <any>error.message;
          }
          else
          {
            this.errorMessage = <any>error;
          }
        });
  }

  public updateControls() {
    /* this.selectedItem.commissionMode = this.slabGrid.collectionView.currentItem.commissionMode;
     this.selectedItem.commissionModeDisplay_ = this.slabGrid.collectionView.currentItem.commissionModeDisplay_;
     this.selectedItem.traansactionTypesExchange.traansactionTypeExchangeId = this.slabGrid.collectionView.currentItem.traansactionTypesExchange.traansactionTypeExchangeId;
     this.selectedItem.traansactionTypesExchange.transactionType = this.slabGrid.collectionView.currentItem.traansactionTypesExchange.transactionType;    
     this.selectedItem.traansactionTypesExchange.exchange = this.slabGrid.collectionView.currentItem.traansactionTypesExchange.exchange;
     this.selectedItem.traansactionTypesExchange.exchangeId = this.slabGrid.collectionView.currentItem.traansactionTypesExchange.exchangeId;    */
    this.selectedItem.commissionSlabMaster.minMaxCommFlag = this.slabGrid.collectionView.currentItem.commissionSlabMaster.minMaxCommFlag;
    this.selectedItem.commissionSlabMaster.minCommAmount = this.slabGrid.collectionView.currentItem.commissionSlabMaster.minCommAmount;
    this.selectedItem.commissionSlabMaster.maxCommAmount = this.slabGrid.collectionView.currentItem.commissionSlabMaster.maxCommAmount;

    this.getSlabCommissionDetailListCopyFrom(this.slabGrid.collectionView.currentItem.commissionSlabMaster.commissionSlabId);
  }

  private addFormValidations() {
    this.myForm = this._fb.group({
      slabName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      exchangeId: ['', Validators.compose([Validators.required])],
      transactionType: ['', Validators.compose([Validators.required])],
      commissionMode: ['', Validators.compose([Validators.required])],
      lowerRange: ['', Validators.compose([Validators.required])],
      upperRange: ['', Validators.compose([Validators.required])],
      deliveryComm: ['', Validators.compose([Validators.required])],
      deliveryFP: ['', Validators.compose([Validators.required])],
      differenceComm: ['', Validators.compose([Validators.required,])],
      differenceFP: ['', Validators.compose([Validators.required])],
      minCommAmount: ['', Validators.compose([Validators.required])],
      maxCommAmount: ['', Validators.compose([Validators.required])],
      minMaxCommFlag: ['', Validators.compose([Validators.required])],
      applyDelCommission: ['']
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