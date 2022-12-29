'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';


import { AuthService2 } from 'app/services/auth2.service';
import { Security } from 'app/models/security';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AppState } from 'app/app.service';
import { ListingService } from 'app/services/listing.service';
import { Registrar } from 'app/models/registrar';
import { Sector } from 'app/models/sector';
import { SecurityType } from 'app/models/security-type';
import { SecurityFisDetail } from 'app/models/security-fis-detail';
import { BondType } from 'app/models/bond-type';
import { BondCategory } from 'app/models/bond-category';
import { CouponFrequency } from 'app/models/coupon-frequency';
import { DayCountConvention } from 'app/models/day-count-convention';
import { CollectionView, SortDescription, IPagedCollectionView, } from '@grapecity/wijmo';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { SecurityExchange } from 'app/models/security_exchange';
import { ExchangeMarket } from 'app/models/exchange-market';
import { Exchange } from 'app/models/exchange';
import { AssetClass } from 'app/models/asset_class';
import { size } from 'lodash';
import { ContactDetail } from 'app/models/contact-detail';
import { Country } from 'app/models/country';
import { AppConstants, AppUtility } from 'app/app.utility';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from 'app/models/currency';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'security-page',
  templateUrl: './security-page.html',
})

export class SecurityPage implements OnInit {

  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: Security;
  exchangeList: any[] = [];
  errorMessage: string;
  exchangeId: number = AppConstants.exchangeId;
  securityTypeList: any[];
  registrarList: any[];
  sectorList: any[];
  bondCategoryList: any[];
  couponFrequencyList: any[];
  bondTypeList: any[];
  dayCountConventionList: any[];

  public showForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  public showBondDetail: boolean;
  public numberOfCoupons: number = 0;
  selectedIndex: number = 0;
  public securityTypeId_: Number  =AppConstants.SYMBOL_TYPE_EQUITIES;
  tempBase64: any
  attachment: String
  private _pageSize = 0;
  currencyList: any[];
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('bondTypeId') bondTypeId: wjcInput.ComboBox;
  @ViewChild('securityCode') securityCode: wjcInput.InputMask;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  @ViewChild('issueDate') issueDate: wjcInput.InputDate;
  @ViewChild('maturityDate') maturityDate: wjcInput.InputDate;
  @ViewChild('exchangeId') cmbexchangeId: wjcInput.ComboBox;
  attachedImg: string;
  lang: string;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private cd: ChangeDetectorRef, private loader: FuseLoaderScreenService, private translate: TranslateService) {
    //this.claims = authService.claims;
    this.clearFields();
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.showBondDetail = false;
    this.securityTypeId_ = AppConstants.SYMBOL_TYPE_EQUITIES;
    this.loadexchangeList();

    this.selectedItem.securityFisDetail.currency = new Currency();
    
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________

  }

  public hideModal() {
    jQuery("#add_new").modal("hide");   //hiding the modal on save/updating the record
  }

  ngOnInit() {


   this.populateAllCurrencies();

    // Populate market data..    
    this.populateSecurityDetailList();

    // Poppulate Security Type
    this.populateSecurityTypeList();

    // Poppulate Registrar
    this.populateRegistrarList();

    // Poppulate Sector
    this.populateSectorList();

    //Populate Bond Category
    this.populateBondCategoryList();

    //Populate Coupon Frequency
    this.populateCouponFrequencyList();

    //Populate Bond Type
    this.populateBondTypeList();

    //Populate Day Count Convention
    this.populateDayCountConventionsList();

    // Add form Validations
    this.addFromValidations();
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.securityCode.focus();
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
    if (this.itemsList.isEditingItem) {
      this.itemsList.cancelEdit();
    }
    this.clearFields();
  }

  public onNewAction() {
    this.clearFields();
    this.showForm = true;
  }

  public onEditAction() {
    this.clearFields();
    this.selectedIndex = this.flex.selection.row;
    this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.selectedItem)) {

      this.showForm = true;
      this.isEditing = true;

      this.securityTypeId_ = this.selectedItem.securityType.securityTypeId;

      if (this.selectedItem.securityType.securityTypeId != AppConstants.SECURITY_TYPE_BOND) {
        // this.selectedItem.securityFisDetail = new SecurityFisDetail();
        // this.selectedItem.securityFisDetail.securityId = null;
        // this.selectedItem.securityFisDetail.aIrr = 0;
        // this.selectedItem.securityFisDetail.baseRate = 0;
        // this.selectedItem.securityFisDetail.couponRate = 0.0001;
        // this.selectedItem.securityFisDetail.discountRate = 0;
        // this.selectedItem.securityFisDetail.irr = 0;
        // this.selectedItem.securityFisDetail.issueDate = new Date();
        // this.selectedItem.securityFisDetail.maturityDate = new Date();
        // this.selectedItem.securityFisDetail.maturityDays = 0;
        // this.selectedItem.securityFisDetail.nextCouponDate = new Date();
        // this.selectedItem.securityFisDetail.parValue = 0;
        // this.selectedItem.securityFisDetail.spreadRate = 0;
        // this.selectedItem.securityFisDetail.yearDays = 0;
        // this.selectedItem.securityFisDetail.dayCountConvention = "";

        // this.selectedItem.securityFisDetail.bondType = new BondType();
        // this.selectedItem.securityFisDetail.bondType.bondTypeId = null;
        // this.selectedItem.securityFisDetail.bondType.bondType = null;

        // this.selectedItem.securityFisDetail.bondCategory = new BondCategory();
        // this.selectedItem.securityFisDetail.bondCategory.categoryId = null;
        // this.selectedItem.securityFisDetail.bondCategory.category = null;

        // this.selectedItem.securityFisDetail.couponFrequency = new CouponFrequency();
        // this.selectedItem.securityFisDetail.couponFrequency.frequencyCode = "";
        // this.selectedItem.securityFisDetail.couponFrequency.frequencyDesc = "";

        this.showBondDetail = false;
      }
      else {
        this.showBondDetail = true;
      }
    }
  }

  public clearFields() {

    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.itemsList)) {
      this.itemsList.cancelEdit();
      this.itemsList.cancelNew();
    }
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.showBondDetail = false;
    this.numberOfCoupons = 0;

    this.securityTypeId_ = AppConstants.SECURITY_TYPE_EQUITY;
    this.selectedItem = new Security();
    this.selectedItem.clear();
    this.selectedItem.securityId = null;
    this.selectedItem.isin = "";
    this.selectedItem.securityName = "";
    this.selectedItem.active = true;

    this.selectedItem.symbol = "";
    this.selectedItem.faceValue = 0.0001;
    this.selectedItem.outstandingShares = 1;
    this.selectedItem.issuePrice = 0.0001;

    this.selectedItem.securityType = new SecurityType();
    this.selectedItem.securityType.securityTypeId = AppConstants.SECURITY_TYPE_EQUITY;
    this.selectedItem.securityType.securityType = null;

    this.selectedItem.registrar = new Registrar();
    this.selectedItem.registrar.registrarId = null;
    this.selectedItem.registrar.name = null;
    this.selectedItem.registrar.registrarCode = null;

    this.selectedItem.sector = new Sector();
    this.selectedItem.sector.sectorId = AppConstants.BOND_SECTOR_ID;
    this.selectedItem.sector.sectorName = null;


    this.selectedItem.securityFisDetail.currency = new Currency();
    if (!AppUtility.isEmptyArray(this.currencyList)) {
      this.selectedItem.securityFisDetail.currency.currencyId = this.currencyList[0].currencyId;
    }

    this.selectedItem.securityFisDetail = new SecurityFisDetail();

    this.selectedItem.securityFisDetail.securityId = null;
    this.selectedItem.securityFisDetail.aIrr = 0;
    this.selectedItem.securityFisDetail.baseRate = 0;
    this.selectedItem.securityFisDetail.couponRate = 0.0001;
    this.selectedItem.securityFisDetail.discountRate = 0;
    this.selectedItem.securityFisDetail.irr = 0;
    this.selectedItem.securityFisDetail.issueDate = new Date();
    this.selectedItem.securityFisDetail.maturityDate = new Date();
    this.selectedItem.securityFisDetail.maturityDays = 0;
    this.selectedItem.securityFisDetail.nextCouponDate = new Date();
    this.selectedItem.securityFisDetail.parValue = 0;
    this.selectedItem.securityFisDetail.spreadRate = 0;
    this.selectedItem.securityFisDetail.yearDays = 0;
    this.selectedItem.securityFisDetail.dayCountConvention = "";

    this.selectedItem.securityFisDetail.bondType = new BondType();
    if (!AppUtility.isEmptyArray(this.bondTypeList)) {
      this.selectedItem.securityFisDetail.bondType.bondTypeId = this.bondTypeList[0].bondTypeId;
      this.selectedItem.securityFisDetail.bondType.bondType = this.bondTypeList[0].bondType;
    }

    this.selectedItem.securityFisDetail.bondCategory = new BondCategory();
    if (!AppUtility.isEmptyArray(this.bondCategoryList)) {
      this.selectedItem.securityFisDetail.bondCategory.categoryId = this.bondCategoryList[0].categoryId;
      this.selectedItem.securityFisDetail.bondCategory.category = this.bondCategoryList[0].category;
    }

    this.selectedItem.securityFisDetail.couponFrequency = new CouponFrequency();
    if (!AppUtility.isEmptyArray(this.couponFrequencyList)) {
      this.selectedItem.securityFisDetail.couponFrequency.frequencyCode = this.couponFrequencyList[0].frequencyCode;
      this.selectedItem.securityFisDetail.couponFrequency.frequencyDesc = this.couponFrequencyList[0].frequencyDesc;
    }
    this.attachment = ""
    this.attachedImg = ""
    this.selectedItem.exchange = new SecurityExchange
    this.selectedItem.assetClass = new AssetClass
  }


  onSecurityTypeChangeEvent(slectedSecurityTypeId): void {
    if (slectedSecurityTypeId != AppConstants.SECURITY_TYPE_BOND) {
      this.selectedItem.securityFisDetail = new SecurityFisDetail();
      this.selectedItem.securityFisDetail.securityId = null;
      this.selectedItem.securityFisDetail.aIrr = 0;
      this.selectedItem.securityFisDetail.baseRate = 0;
      this.selectedItem.securityFisDetail.couponRate = 0.0001;
      this.selectedItem.securityFisDetail.discountRate = 0;
      this.selectedItem.securityFisDetail.irr = 0;
      this.selectedItem.securityFisDetail.issueDate = new Date();
      this.selectedItem.securityFisDetail.maturityDate = new Date();
      this.selectedItem.securityFisDetail.maturityDays = 0;
      this.selectedItem.securityFisDetail.nextCouponDate = new Date();
      this.selectedItem.securityFisDetail.parValue = 0;
      this.selectedItem.securityFisDetail.spreadRate = 0;
      this.selectedItem.securityFisDetail.yearDays = 0;
      this.selectedItem.securityFisDetail.dayCountConvention = "";
      this.selectedItem.securityFisDetail.bondType = new BondType();
      this.selectedItem.securityFisDetail.bondCategory = new BondCategory();
      this.selectedItem.securityFisDetail.couponFrequency = new CouponFrequency();

      this.showBondDetail = false;
      this.validateBondsControl(false);
    }
    else {
      this.showBondDetail = true;
      this.validateBondsControl(true);
    }
  }
  calculateNoOfCouponsAction(selectedValue): void {
    if (!AppUtility.isEmpty(this.selectedItem.securityFisDetail.couponFrequency.frequencyCode)
      && !AppUtility.isEmpty(this.selectedItem.securityFisDetail.issueDate)
      && !AppUtility.isEmpty(this.selectedItem.securityFisDetail.maturityDate)) {
      var date1 = new Date("" + this.selectedItem.securityFisDetail.issueDate);
      var date2 = new Date("" + this.selectedItem.securityFisDetail.maturityDate);
      if (date1.getTime() > date2.getTime()) {
        this.numberOfCoupons = 0;
        return;
      }
      var diff = Math.floor(date2.getTime() - date1.getTime());
      var day = 1000 * 60 * 60 * 24;
      var days = Math.floor(diff / day);
      var months = Math.floor(days / 30.416);
      if (months == 0)
        months = 1;
      var years = Math.floor(months / 12);
      var diff = Math.abs(months);
      var coupons = Math.abs(months / 12);


      if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "A") {
        this.numberOfCoupons = Math.round(coupons);
      }
      else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "B") {
        this.numberOfCoupons = Math.round(coupons * 2);
      }
      else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "Q") {
        this.numberOfCoupons = Math.round(coupons * 4);
      }
    } else {
      this.numberOfCoupons = 0;
    }
  }

  /***
   * Save / Update Action
   */
  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      this.selectedItem.securityType.securityTypeId = this.securityTypeId_;
      if (this.selectedItem.securityType.securityTypeId == AppConstants.SECURITY_TYPE_BOND) {
        var date1 = new Date("" + this.selectedItem.securityFisDetail.issueDate);
        var date2 = new Date("" + this.selectedItem.securityFisDetail.maturityDate);
        if (date1.getTime() > date2.getTime()) {
          this.dialogCmp.statusMsg = 'Maturity Date should be greater than Issue Date.';
          this.dialogCmp.showAlartDialog('Error');
          return;
        }
        if (AppUtility.isEmpty(this.numberOfCoupons) || this.numberOfCoupons == 0) {
          if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "A") {
            this.dialogCmp.statusMsg = 'Issue and Maturity date difference should be at least 1 year in case of \'ANNUAL\' Coupon Frequency.';
            this.dialogCmp.showAlartDialog('Error');
          }
          else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "B") {
            this.dialogCmp.statusMsg = 'Issue and Maturity date difference should be at least 6 months in case of \'BI-ANNUAL\' Coupon Frequency.';
            this.dialogCmp.showAlartDialog('Error');
          }
          else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "Q") {
            this.dialogCmp.statusMsg = 'Issue and Maturity date difference should be at least 3 months in case of \'QUARTER\' Coupon Frequency.';
            this.dialogCmp.showAlartDialog('Error');
          } else {
            this.dialogCmp.statusMsg = 'Coupon Frequency is required.';
            this.dialogCmp.showAlartDialog('Error');
          }
          return;
        }
        this.selectedItem.securityFisDetail.issueDate = new Date(AppUtility.toYYYYMMDD(this.issueDate.value));
        this.selectedItem.securityFisDetail.maturityDate = new Date(AppUtility.toYYYYMMDD(this.maturityDate.value));

        // 23 Sept, 2022 
        // Updating contact detail id
        let exchange = new Exchange();
        let contactDetailId: Number = 0;

        if (!Array.isArray(this.exchangeList)) {
          for (let i = 0; i < size(this.exchangeList); i++) {
            exchange = this.exchangeList[i];
            if (exchange.exchangeId == this.selectedItem.exchange.exchangeId) {
              contactDetailId = exchange.contactDetail.contactDetailId;
            }
          }
          this.selectedItem.exchange.contactDetail = new ContactDetail();
          this.selectedItem.exchange.contactDetail.contactDetailId = contactDetailId;
        }
      }
      this.selectedItem.image = this.attachment;
      // this.selectedItem.image = this.attachedImg
      console.log(this.selectedItem.image)

      this.selectedItem.imageName = this.selectedItem.securityName + ".png"
      this.selectedItem.imageName = this.selectedItem.imageName.toLowerCase();

      this.loader.show();
      

      this.selectedItem.exchange.exchangeId = this.exchangeId
      console.log(this.selectedItem)
      AppUtility.printConsole('Selected security: ' + JSON.stringify(this.selectedItem));

      if (this.isEditing) {
        this.listingService.updateSecurity(this.selectedItem).subscribe(
          data => {
            
            this.loader.hide();
          //  this.fillSecurityFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.flex.invalidate();

            if(data.securityType && AppUtility.isValidVariable(data.securityType)){
              this.selectedItem.securityType.securityTypeId = data.securityType.securityTypeId;
              this.selectedItem.securityType.securityType = data.securityType.securityType;
            }
          

            if(data.registrar && AppUtility.isValidVariable(data.registrar)){
              this.selectedItem.registrar.registrarId = data.registrar.registrarId;
              this.selectedItem.registrar.name = data.registrar.name;
              this.selectedItem.registrar.registrarCode = data.registrar.registrarCode;
            }
         
            if( data.sector && AppUtility.isValidVariable( data.sector)){
              this.selectedItem.sector.sectorId = data.sector.sectorId;
              this.selectedItem.sector.sectorName = data.sector.sectorName;
            }
         


            //this.itemsList.refresh();

            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
            if(err.message){
              this.errorMessage = err.message;
            }
            else {
              this.errorMessage = err;
            }
            this.dialogCmp.statusMsg =  this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
      else {
        this.listingService.saveSecurity(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();
          //  this.fillSecurityFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            AppUtility.moveSelectionToLastItem(this.itemsList);
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
            if(err.message){
              this.errorMessage = err.message;
            }
            else {
              this.errorMessage = err;
            }
            this.dialogCmp.statusMsg =  this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
    }
  }

  /***************************************
   *          Private Methods
   **************************************/
  
  
   public populateAllCurrencies=()=>{
    debugger
    this.listingService.getCurrencyList()
    .subscribe(
      restData => {
       
        this.currencyList = restData;
        var bc: Currency = new Currency();
        bc.currencyId = AppConstants.PLEASE_SELECT_VAL;
        bc.currencyCode = AppConstants.PLEASE_SELECT_STR;
        this.currencyList.unshift(bc);
        this.selectedItem.securityFisDetail.indexedCurrency.currencyId = this.currencyList[0].currencyId;
        this.selectedItem.securityFisDetail.currency.currencyId = this.currencyList[0].currencyId;
      },
      err => {
       this.loader.hide();
        if(err.message){
          this.errorMessage = err.message;
        }
        else {
          this.errorMessage = err;
        }
      });
 }
  
  
  
  private fillSecurityFromJson(s: Security, data: any) {
    s.securityId = data.securityId;
    s.isin = data.isin;
    s.securityName = data.securityName;
    s.active = data.active;

    s.symbol = data.symbol;
    s.faceValue = data.faceValue;
    s.outstandingShares = data.outstandingShares;
    s.issuePrice = data.issuePrice;

    s.securityType = new SecurityType();
    s.securityType.securityTypeId = data.securityType.securityTypeId;
    s.securityType.securityType = data.securityType.securityType;

    s.registrar = new Registrar();
    s.registrar.registrarId = data.registrar.registrarId;
    s.registrar.name = data.registrar.name;

    s.sector = new Sector();
    s.sector.sectorId = data.sector.sectorId;
    s.sector.sectorName = data.sector.sectorName;

    
    s.securityFisDetail.currency = new Currency();
    if(data.securityFisDetail.currency && AppUtility.isValidVariable(data.securityFisDetail.currency)){
      s.securityFisDetail.currency.currencyId = data.securityFisDetail.currency.currencyId;
    }


    s.securityFisDetail = new SecurityFisDetail();
    s.securityFisDetail.securityId = data.securityFisDetail.securityId;
    s.securityFisDetail.aIrr = data.securityFisDetail.aIrr;
    s.securityFisDetail.baseRate = data.securityFisDetail.baseRate;
    s.securityFisDetail.couponRate = data.securityFisDetail.couponRate;
    s.securityFisDetail.discountRate = data.securityFisDetail.discountRate;
    s.securityFisDetail.irr = data.securityFisDetail.irr;
    s.securityFisDetail.issueDate = new Date(data.securityFisDetail.issueDate);
    s.securityFisDetail.maturityDate = new Date(data.securityFisDetail.maturityDate);
    s.securityFisDetail.maturityDays = data.securityFisDetail.maturityDays;
    s.securityFisDetail.nextCouponDate = data.securityFisDetail.nextCouponDate;
    s.securityFisDetail.parValue = data.securityFisDetail.parValue;
    s.securityFisDetail.spreadRate = data.securityFisDetail.spreadRate;
    s.securityFisDetail.yearDays = data.securityFisDetail.yearDays;
    s.securityFisDetail.dayCountConvention = data.securityFisDetail.dayCountConvention;

    s.securityFisDetail.bondType = new BondType();
    s.securityFisDetail.bondType.bondTypeId = data.securityFisDetail.bondType.bondTypeId;
    s.securityFisDetail.bondType.bondType = data.securityFisDetail.bondType.bondType;

    s.securityFisDetail.bondCategory = new BondCategory();
    s.securityFisDetail.bondCategory.categoryId = data.securityFisDetail.bondCategory.categoryId;
    s.securityFisDetail.bondCategory.category = data.securityFisDetail.bondCategory.category;

    s.securityFisDetail.couponFrequency = new CouponFrequency();
    s.securityFisDetail.couponFrequency.frequencyCode = data.securityFisDetail.couponFrequency.frequencyCode;
    s.securityFisDetail.couponFrequency.frequencyDesc = data.securityFisDetail.couponFrequency.frequencyDesc;
  }

  private populateSecurityTypeList() {
    this.loader.show();
    this.listingService.getSecurityTypeList()
      .subscribe(
        restData => {
           
          this.loader.hide();
          if(AppUtility.isValidVariable(restData)){
            this.securityTypeList = restData;
          
             
          }
          else
          {
       
          }
        
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }
  private populateRegistrarList() {
    this.loader.show();
    debugger 
    this.listingService.getActiveRegistrarList(1)
      .subscribe(
        restData => {
          this.loader.hide();
          this.registrarList = restData;
          var reg: Registrar = new Registrar();
          reg.registrarId = AppConstants.PLEASE_SELECT_VAL;
          reg.displayName_ = AppConstants.PLEASE_SELECT_STR;
          this.registrarList.unshift(reg);
          this.selectedItem.registrar.registrarId = this.registrarList[0].registrarId;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }

  private populateSectorList() {
    this.loader.show();
    this.listingService.getActiveSectorsList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.sectorList = restData;
          var sec: Sector = new Sector();
          sec.sectorId = AppConstants.PLEASE_SELECT_VAL;
          sec.displayName_ = AppConstants.PLEASE_SELECT_STR;
          this.sectorList.unshift(sec);
          this.selectedItem.sector.sectorId = this.sectorList[0].sectorId;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }
  private populateBondCategoryList() {
    this.loader.show();
    this.listingService.getBondCategoryList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.bondCategoryList = restData;
          var bc: BondCategory = new BondCategory();
          bc.categoryId = AppConstants.PLEASE_SELECT_VAL;
          bc.category = AppConstants.PLEASE_SELECT_STR;
          this.bondCategoryList.unshift(bc);
          this.selectedItem.securityFisDetail.bondCategory.categoryId = this.bondCategoryList[0].categoryId;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }
  private populateBondTypeList() {
    this.loader.show();
    this.listingService.getBondTypeList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.bondTypeList = restData;
          var bt: BondType = new BondType();
          bt.bondTypeId = AppConstants.PLEASE_SELECT_VAL;
          bt.bondType = AppConstants.PLEASE_SELECT_STR;
          this.bondTypeList.unshift(bt);
          this.selectedItem.securityFisDetail.bondType.bondTypeId = this.bondTypeList[0].bondTypeId;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }
  private populateDayCountConventionsList() {
    this.loader.show();
    this.listingService.getDayCountConventions()
      .subscribe(
        restData => {
          this.loader.hide();
          this.dayCountConventionList = restData;
          var bt: DayCountConvention = new DayCountConvention();
          bt.conventionId = null;
          bt.convention = AppConstants.PLEASE_SELECT_STR;
          this.dayCountConventionList.unshift(bt);
          this.selectedItem.securityFisDetail.dayCountConvention = this.dayCountConventionList[0].conventionId;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }
  private populateCouponFrequencyList() {
    this.loader.show();
    this.listingService.getCouponFrequencyList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.couponFrequencyList = restData;
          var cf: CouponFrequency = new CouponFrequency();
          cf.frequencyCode = "";
          cf.frequencyDesc = AppConstants.PLEASE_SELECT_STR;
          this.couponFrequencyList.unshift(cf);
          this.selectedItem.securityFisDetail.couponFrequency.frequencyCode = this.couponFrequencyList[0].frequencyCode;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }
  private populateSecurityDetailList() {
    this.loader.show();
    this.listingService.getSecurityList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.itemsList = new wjcCore.CollectionView(restData);
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }

  loadexchangeList(): void {
    this.loader.show();

    // update exchangeList data    
    console.log("getting exchangeList");
    this.listingService.getExchangeList().subscribe(
      data => {

        this.loader.hide();
        if (data != null) {
          
          //console.log("exchangeList: "+ data); 
          this.exchangeList = data;
          // this.exchangeId = this.exchangeList[0].exchangeId;
          // var exchange: SecurityExchange = new SecurityExchange(0, AppConstants.PLEASE_SELECT_STR);
          // this.exchangeList.unshift(exchange);
          // this.exchangeId = this.exchangeList[0].exchangeId;
        }
      },
      error => { this.loader.hide(); this.errorMessage = <any>error.message });
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
      securityCode: ['', Validators.compose([Validators.required])],
      securityName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      isin: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      outstandingShares: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)])],
      faceValue: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      issuePrice: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      active: [''],
      etf : [''],
      currency : ['' , Validators.compose([Validators.required])],
      securityTypeId: ['', Validators.compose([Validators.required])],
      sectorId: ['', Validators.compose([Validators.required])],
      registrarId: ['', Validators.compose([Validators.required])],
      bondCategoryId: [''],
      bondTypeId: [''],
      couponFrequency: [''],
      dayCountConvention: [''],
      numberOfCoupons: [''],
      couponRate: [''],
      image: ['']
    });
  }

  public validateBondsControl(_flag: boolean) {
    if (_flag) {
      (<any>this.myForm).controls.bondCategoryId.setValidators([Validators.required]);
      (<any>this.myForm).controls.bondCategoryId.updateValueAndValidity();
      (<any>this.myForm).controls.bondTypeId.setValidators([Validators.required]);
      (<any>this.myForm).controls.bondTypeId.updateValueAndValidity();
      (<any>this.myForm).controls.couponFrequency.setValidators([Validators.required]);
      (<any>this.myForm).controls.couponFrequency.updateValueAndValidity();
      (<any>this.myForm).controls.dayCountConvention.setValidators([Validators.required]);
      (<any>this.myForm).controls.dayCountConvention.updateValueAndValidity();
      (<any>this.myForm).controls.couponRate.setValidators([Validators.required]);
      (<any>this.myForm).controls.couponRate.updateValueAndValidity();
    }
    else {
      (<any>this.myForm).controls.bondCategoryId.setValidators(null);
      (<any>this.myForm).controls.bondCategoryId.updateValueAndValidity();
      (<any>this.myForm).controls.bondTypeId.setValidators(null);
      (<any>this.myForm).controls.bondTypeId.updateValueAndValidity();
      (<any>this.myForm).controls.couponFrequency.setValidators(null);
      (<any>this.myForm).controls.couponFrequency.updateValueAndValidity();
      (<any>this.myForm).controls.dayCountConvention.setValidators(null);
      (<any>this.myForm).controls.dayCountConvention.updateValueAndValidity();
      (<any>this.myForm).controls.couponRate.setValidators(null);
      (<any>this.myForm).controls.couponRate.updateValueAndValidity();
    }
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success') {
      this.clearFields();
      this.hideModal();
      // this.clearFields();
    }
  }
  onFileSelected(event) {
    let file = event.files[0];

    this.convertImgToBase64(file)
    setTimeout(() => {
      this.attachment = this.tempBase64
      this.attachedImg = "data:image/png;base64," + this.attachment
      console.log(this.attachedImg);
    }, 500);
    console.log(this.attachment);

  }

  convertImgToBase64(file: any) {
    localStorage.removeItem("SymbolImg")
    let me = this;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      me.tempBase64 = reader.result;
      let v = me.tempBase64.split(',')
      me.tempBase64 = v[1]
      localStorage.setItem("SymbolImg", me.tempBase64)
      console.log(me.tempBase64);

    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
    this.tempBase64 = localStorage.getItem("SymbolImg")
    //console.log(this.tempBase64);
  }

}