'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';

import { Security } from '../models/security';
import { ExchangeMarketSecurity } from '../models/exch-mark-security';
import { SecurityState } from '../models/security-state';
import { SettlementType } from '../models/settlement-type';
import { ListingService } from '../services/listing.service';
import { AppUtility, AppConstants } from '../app.utility';
import { Registrar } from '../models/registrar';
import { MmAuction } from '../models/mm-Auctions';
import { Sector } from '../models/sector';
import { SecurityType } from '../models/security-type';
import { SecurityFisDetail } from '../models/security-fis-detail';
import { BondType } from '../models/bond-type';
import { BondCategory } from '../models/bond-category';
import { BondSubCategory } from '../models/bond-sub-category';
import { CouponFrequency } from '../models/coupon-frequency';
import { DayCountConvention } from '../models/day-count-convention';
import { AuthService2 } from 'app/services/auth2.service';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AppState } from '../app.service';
import { CollectionView, SortDescription,IPagedCollectionView,} from '@grapecity/wijmo';
import { TranslateService } from '@ngx-translate/core';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Currency } from 'app/models/currency';


declare var jQuery: any;

@Component({
  selector: 'fixed-income-security-page',
  templateUrl:'./fixed-income-security-page.html',  
})

export class FISecurityPage implements OnInit {

  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: Security;
  securityStateList: any[];
  settlementTypeList: any[];
  bondPaymentSchedualList: any[];

  errorMessage: string;
  public lblCouponRate: string;
  public lblDiscountRate: string
  public isTBillsType: boolean = false;
  securityTypeList: any[];
  registrarList: any[];
  auctionList: any[];
  sectorList: any[];
  bondCategoryList: any[];
  bondSubCategoryList: any[];
  couponFrequencyList: any[];
  bondTypeList: any[];
  dayCountConventionList: any[];

  currencyList: any[];
  maturityDaysList: any[];
  public showForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  public showBondDetail: boolean;
  public isDisable: boolean;
  public numberOfCoupons: number = 0;
  public maturityTenure: number = 0;
  selectedIndex: number = 0;
  public securityTypeId_: Number;
  
  private _pageSize = 0;
  lang: string;
  //claims: any;

  @ViewChild('flex',{ static: false }) flex: wjcGrid.FlexGrid;
  @ViewChild('bondTypeId',{ static: false }) bondTypeId: wjcInput.ComboBox;  
  @ViewChild('couponFrequency',{ static: false }) couponFrequency: wjcInput.ComboBox;
  @ViewChild('cmbMaturityDaysTBills',{ static: false }) cmbMaturityDaysTBills: wjcInput.ComboBox;
  @ViewChild('securityCode',{ static: false }) securityCode: wjcInput.InputMask;
  @ViewChild('dialogCmp',{ static: false }) dialogCmp: DialogCmp;  
  @ViewChild('issueDate',{ static: false }) issueDate: wjcInput.InputDate;
  @ViewChild('maturityDate',{ static: false }) maturityDate: wjcInput.InputDate;
  @ViewChild('firstTradingDate',{ static: false }) firstTradingDate: wjcInput.InputDate;
  @ViewChild('lastTradingDate',{ static: false }) lastTradingDate: wjcInput.InputDate;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, private translate: TranslateService, 
    public userService: AuthService2, public splash : FuseSplashScreenService) {
    //this.claims = authService.claims;
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________

    this.clearFields();
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.showBondDetail = true;
    this.isDisable = false;
    this.lblCouponRate = "Client Coupon Rate (%)";
    this.lblDiscountRate = "Client Discount Rate (%)";

   this.selectedItem.securityFisDetail.indexedCurrency = new Currency();
   this.selectedItem.securityFisDetail.currency = new Currency();
    
  }
  public hideModal() {
    jQuery("#add_new").modal("hide");   //hiding the modal on save/updating the record
  }

  ngOnInit() {

    this.populateAllCurrencies();
    // Populate market data..    
    this.populateSecurityDetailList();

    // Poppulate Security Type
    //this.populateSecurityTypeList();

    // Poppulate Registrar
    this.populateRegistrarList();

    this.populateMaturityDaysInCaseOfTBills();

    // Poppulate Sector
    // this.populateSectorList();

    //Populate Bond Category
    this.populateBondCategoryList();

    //Populate Bond SubCategory
    this.populateBondSubCategoryList();

    //Populate Coupon Frequency
    this.populateCouponFrequencyList();

    //Populate Bond Type
    this.populateBondTypeList();

    //Populate Day Count Convention
    this.populateDayCountConventionsList();

    // Poppulate SecurityState
    this.populateSecurityStateList();

    // Poppulate SettlementType
    this.populateSettlementTypeList();

    // Add form Validations
    this.addFromValidations();
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {      
      self.securityCode.focus(); 
    });
  }

  private initGrid(s: wjcGrid.FlexGrid) {
    // AppUtility.printConsole('initGrid called');
    // // create a GroupRow to show aggregates automatically
    // let row = new wjGrid.GroupRow();
    // // add the new GroupRow to the grid's 'columnFooters' panel
    // s.columnFooters.rows.push(row);
    // // add a sigma to the header to show that this is a summary row
    // s.bottomLeftCells.setCellData(0, 0, '\u03A3');
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
    //this.populateauctionNumberList();
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

      if (this.selectedItem.securityType.securityTypeId == AppConstants.SECURITY_TYPE_BOND) {

        if (this.selectedItem.securityFisDetail.maturityAlertDays == null)
          this.selectedItem.securityFisDetail.maturityAlertDays = 0;

        if (this.selectedItem.securityFisDetail.confirmRate == null)
          this.selectedItem.securityFisDetail.confirmRate = 0;

        if (this.selectedItem.securityFisDetail.lastTradingDate == null)
          this.selectedItem.securityFisDetail.lastTradingDate = new Date();

        if (this.selectedItem.securityFisDetail.firstTradingDate == null)
          this.selectedItem.securityFisDetail.firstTradingDate = new Date();

        this.showBondDetail = true;
      }
      else {
        this.showBondDetail = false;
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
    this.showBondDetail = true;
    this.numberOfCoupons = 0;
    this.maturityTenure = 0;

    this.securityTypeId_ = null;
    this.selectedItem = new Security();
    this.selectedItem.clear();
    this.selectedItem.securityId = null;
    this.selectedItem.isin = "";
    this.selectedItem.active = true;

    this.selectedItem.symbol = "";

    this.selectedItem.outstandingShares = 1;


    this.selectedItem.securityType = new SecurityType();
    this.selectedItem.securityType.securityTypeId = null;
    this.selectedItem.securityType.securityType = null;

    this.selectedItem.registrar = new Registrar();
    this.selectedItem.registrar.registrarId = null;
    this.selectedItem.registrar.name = null;
    this.selectedItem.registrar.registrarCode = null;

    this.selectedItem.sector = new Sector();
    this.selectedItem.sector.sectorId = AppConstants.BOND_SECTOR_ID;
    this.selectedItem.sector.sectorName = null;

    this.selectedItem.securityFisDetail = new SecurityFisDetail();
    this.selectedItem.securityFisDetail.securityId = null;
    this.selectedItem.securityFisDetail.aIrr = 0;
    this.selectedItem.securityFisDetail.baseRate = 0;
    this.selectedItem.securityFisDetail.couponRate = 0.0001;
    this.selectedItem.securityFisDetail.discountRate = 0;
    this.selectedItem.securityFisDetail.confirmRate = 0.0001;
    this.selectedItem.securityFisDetail.currency = null;
    this.selectedItem.securityFisDetail.irr = 0;
    this.selectedItem.securityFisDetail.issueDate = new Date();
    this.selectedItem.securityFisDetail.maturityDate = new Date();
    this.selectedItem.securityFisDetail.firstTradingDate = new Date();
    this.selectedItem.securityFisDetail.lastTradingDate = new Date();
    this.selectedItem.securityFisDetail.maturityDays = 0;
    this.selectedItem.securityFisDetail.nextCouponDate = new Date();
    this.selectedItem.securityFisDetail.parValue = 1;
    this.selectedItem.securityFisDetail.spreadRate = 0;
    this.selectedItem.securityFisDetail.yearDays = 0;
    this.selectedItem.securityFisDetail.dayCountConvention = "";
    this.selectedItem.securityFisDetail.reInvested = 'N';

    this.selectedItem.securityFisDetail.indexedCurrency = new Currency();
    if (!AppUtility.isEmptyArray(this.currencyList)) {
      this.selectedItem.securityFisDetail.indexedCurrency.currencyId = this.currencyList[0].currencyId;
    }
    this.selectedItem.securityFisDetail.currency = new Currency();
    if (!AppUtility.isEmptyArray(this.currencyList)) {
      this.selectedItem.securityFisDetail.currency.currencyId = this.currencyList[0].currencyId;
    }

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

    this.selectedItem.securityFisDetail.bondSubCategory = new BondSubCategory();
    if (!AppUtility.isEmptyArray(this.bondSubCategoryList)) {
      this.selectedItem.securityFisDetail.bondSubCategory.subCategoryId = this.bondSubCategoryList[0].subCategoryId;
      this.selectedItem.securityFisDetail.bondSubCategory.subCategory = this.bondSubCategoryList[0].subCategory;
    }

    this.selectedItem.securityFisDetail.couponFrequency = new CouponFrequency();
    if (!AppUtility.isEmptyArray(this.couponFrequencyList)) {
      this.selectedItem.securityFisDetail.couponFrequency.frequencyCode = this.couponFrequencyList[0].frequencyCode;
      this.selectedItem.securityFisDetail.couponFrequency.frequencyDesc = this.couponFrequencyList[0].frequencyDesc;
    }

    this.selectedItem.securityFisDetail.mmAuction = new MmAuction();
    if (!AppUtility.isEmptyArray(this.auctionList)) {
      this.selectedItem.securityFisDetail.mmAuction.auctionId = this.auctionList[0].auctionId;
      this.selectedItem.securityFisDetail.mmAuction.auctionNumber_ = this.auctionList[0].auctionNumber_;
    }

    this.bondPaymentSchedualList = [];

    this.isTBillsType = false;
  }

  public onGeneratePaymentSchedualAction() {
    
   
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
      this.selectedItem.securityFisDetail.firstTradingDate = new Date();
      this.selectedItem.securityFisDetail.lastTradingDate = new Date();
      this.selectedItem.securityFisDetail.maturityDays = 0;
      this.maturityTenure = 0;
      this.selectedItem.securityFisDetail.nextCouponDate = new Date();
      this.selectedItem.securityFisDetail.parValue = 1;
      this.selectedItem.securityFisDetail.spreadRate = 0;
      this.selectedItem.securityFisDetail.yearDays = 0;
      this.selectedItem.securityFisDetail.dayCountConvention = "";
      this.selectedItem.securityFisDetail.bondType = new BondType();
      this.selectedItem.securityFisDetail.bondCategory = new BondCategory();
      this.selectedItem.securityFisDetail.couponFrequency = new CouponFrequency();
      this.selectedItem.securityFisDetail.mmAuction = new MmAuction();

      this.showBondDetail = false;
      this.validateBondsControl(false, null);
    }
    else {
      this.showBondDetail = true;
      this.validateBondsControl(true, null);
    }
  }

  disabledFields(slectedBondTypeId): void {

    this.validateBondsControl(true, slectedBondTypeId);
    if (slectedBondTypeId == 1) {
      this.lblCouponRate = "Brokerage Discount Rate (%)";
      this.lblDiscountRate = "Client Discount Rate (%)";
      this.numberOfCoupons = 0;
      this.maturityTenure = 0;
    }
    else {
      this.lblCouponRate = "Brokerage Coupon Rate (%)";
      this.lblDiscountRate = "Client Coupon Rate (%)";
    }

    if (slectedBondTypeId == 1) {
      this.selectedItem.securityFisDetail.couponFrequency = new CouponFrequency();
      if (!AppUtility.isEmptyArray(this.couponFrequencyList)) {
        this.selectedItem.securityFisDetail.couponFrequency.frequencyCode = this.couponFrequencyList[0].frequencyCode;
        this.selectedItem.securityFisDetail.couponFrequency.frequencyDesc = this.couponFrequencyList[0].frequencyDesc;
      }
      this.numberOfCoupons == 0
      this.maturityTenure == 0
    }
    else if (slectedBondTypeId == 4) {
      this.selectedItem.securityFisDetail.couponFrequency = new CouponFrequency();
      if (!AppUtility.isEmptyArray(this.couponFrequencyList)) {
        this.selectedItem.securityFisDetail.couponFrequency.frequencyCode = this.couponFrequencyList[1].frequencyCode;
        this.selectedItem.securityFisDetail.couponFrequency.frequencyDesc = this.couponFrequencyList[1].frequencyDesc;
      }
    }
  }

  showHideFieldsInCaseOfTBills(slectedTypeId): void {
    if (AppUtility.isValidVariable(slectedTypeId)) {
      this.maturityTenure = 0;
      // this.issueDate.value = new Date();
      // this.maturityDate.value = new Date();
      if (slectedTypeId == 1) { //  1 == T-Bills
        this.isTBillsType = true;
        this.maturityDate.isDisabled = true;
      }
      else {
        this.isTBillsType = false;
        this.maturityDate.isDisabled = false;
      }
      this.maturityTenure = 0;
    }
  }

  calculateMaturityDateInCaseOfTBills(selectedDays): void {
    if (AppUtility.isValidVariable(selectedDays) && AppUtility.isValidVariable(this.issueDate) && AppUtility.isValidVariable(this.maturityDate)) {
      this.maturityDate.value = wjcCore.DateTime.addDays(this.issueDate.value, selectedDays);
    }
  }

  onLostFocusMaturityDays(): void {
    if (AppUtility.isValidVariable(this.maturityTenure) && AppUtility.isValidVariable(this.issueDate) && AppUtility.isValidVariable(this.maturityDate)) {
      this.maturityDate.value = wjcCore.DateTime.addDays(this.issueDate.value, this.maturityTenure);
    }
  }

  onLostFocusMaturityDate(): void {
    if (AppUtility.isValidVariable(this.maturityTenure) && AppUtility.isValidVariable(this.issueDate) && AppUtility.isValidVariable(this.maturityDate)) {
      var date1 = new Date("" + this.selectedItem.securityFisDetail.issueDate);
      var date2 = new Date("" + this.selectedItem.securityFisDetail.maturityDate);
      var diff = Math.floor(date2.getTime() - date1.getTime());
      var day = 1000 * 60 * 60 * 24;
      var result = Math.round(diff / day);
      var final_Result = result.toFixed(0);
      this.maturityTenure = Number(final_Result);
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
        this.maturityTenure = 0;
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

      this.maturityTenure = days;

      if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "A") {
        this.numberOfCoupons = Math.round(coupons);
      }
      else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "B") {
        this.numberOfCoupons = Math.round(coupons * 2);
      }
      else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "Q") {
        this.numberOfCoupons = Math.round(coupons * 4);
      }
      else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "M") {
        this.numberOfCoupons = Math.round(coupons * 12);
      }
    } else {
      this.numberOfCoupons = 0;
    }
  }

  //  Asif bhai asked to call following method when coupon frequency dropdown changes, don't calculate tenure again @ 06/Feb/2020 - AiK
  calculateOnlyNoOfCoupons(selectedValue): void {
    if (!AppUtility.isEmpty(this.selectedItem.securityFisDetail.couponFrequency.frequencyCode)
      && !AppUtility.isEmpty(this.selectedItem.securityFisDetail.issueDate)
      && !AppUtility.isEmpty(this.selectedItem.securityFisDetail.maturityDate)) {
      var date1 = new Date("" + this.selectedItem.securityFisDetail.issueDate);
      var date2 = new Date("" + this.selectedItem.securityFisDetail.maturityDate);
      if (date1.getTime() > date2.getTime()) {
        this.numberOfCoupons = 0;
        this.maturityTenure = 0;
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

      //  this.maturityTenure = days;

      if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "A") {
        this.numberOfCoupons = Math.round(coupons);
      }
      else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "B") {
        this.numberOfCoupons = Math.round(coupons * 2);
      }
      else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "Q") {
        this.numberOfCoupons = Math.round(coupons * 4);
      }
      else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "M") {
        this.numberOfCoupons = Math.round(coupons * 12);
      }
    } else {
      this.numberOfCoupons = 0;
    }
  }

  /***
   * Save / Update Action
   */
  public onSaveAction(model: any, isValid: boolean) {
    debugger
    this.isSubmitted = true;
    if (isValid) {
      this.selectedItem.securityType.securityTypeId = AppConstants.SECURITY_TYPE_BOND;

      //this.selectedItem.sector.sectorId = 83;
      if (this.selectedItem.securityType.securityTypeId == AppConstants.SECURITY_TYPE_BOND) {
        var date1 = new Date("" + this.selectedItem.securityFisDetail.issueDate);
        var date2 = new Date("" + this.selectedItem.securityFisDetail.maturityDate);
        var date3 = new Date("" + this.selectedItem.securityFisDetail.firstTradingDate);
        var date4 = new Date("" + this.selectedItem.securityFisDetail.lastTradingDate);
       
        //var diff = Math.floor(date2.getTime() - date1.getTime());
        var day = 1000 * 60 * 60 * 24;
        //var days = Math.floor(diff / day);

        //this.maturityTenure = days;
        //this.selectedItem.securityFisDetail.maturityDays = days;
        this.selectedItem.securityFisDetail.maturityDays = this.maturityTenure;

        if (this.selectedItem.securityFisDetail.dayCountConvention == "AA") {
          var date5 = new Date("1-Jan-" + this.selectedItem.securityFisDetail.issueDate.getFullYear());
          var date6 = new Date("31-DEC-" + this.selectedItem.securityFisDetail.issueDate.getFullYear());
          var diff_year = Math.floor(date6.getTime() - date5.getTime());
          this.selectedItem.securityFisDetail.yearDays = Math.floor(diff_year / day);
        }
        else if (this.selectedItem.securityFisDetail.dayCountConvention == "A64" || this.selectedItem.securityFisDetail.dayCountConvention == "AA64")
          this.selectedItem.securityFisDetail.yearDays = 364;
        else if (this.selectedItem.securityFisDetail.dayCountConvention == "A365")
          this.selectedItem.securityFisDetail.yearDays = 365;
        else if (this.selectedItem.securityFisDetail.dayCountConvention == "A360" || this.selectedItem.securityFisDetail.dayCountConvention == "AA360")
          this.selectedItem.securityFisDetail.yearDays = 360;
        else
          this.selectedItem.securityFisDetail.yearDays = 365;


        if (date3.getTime() < date1.getTime()) {
          this.dialogCmp.statusMsg = 'First Trading Date should be greater than Issue Date.';
          this.dialogCmp.showAlartDialog('Error');
          return;
        }
        if (date3.getTime() > date4.getTime()) {
          this.dialogCmp.statusMsg = 'First Trading Date should be less than Last Trading Date.';
          this.dialogCmp.showAlartDialog('Error');
          return;
        }
        if (date4.getTime() > date2.getTime()) {
          this.dialogCmp.statusMsg = 'Last Trading Date should be less than Maturity Date.';
          this.dialogCmp.showAlartDialog('Error');
          return;
        }
        if (date1.getTime() > date2.getTime()) {
          this.dialogCmp.statusMsg = 'Maturity Date should be greater than Issue Date.';
          this.dialogCmp.showAlartDialog('Error');
          return;
        }
       
        if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "A" && this.maturityTenure > 365 && this.selectedItem.securityFisDetail.bondType.bondTypeId == 4) {
          this.dialogCmp.statusMsg = 'Issue and Maturity date difference should be within 1 year in case of ET (End of Term).';
          this.dialogCmp.showAlartDialog('Error');
          return;
        }

        if (AppUtility.isEmpty(this.numberOfCoupons) || this.numberOfCoupons == 0) {
          if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "A") {
            this.dialogCmp.statusMsg = 'Issue and Maturity date difference should be at least 1 year in case of \'ANNUAL\' Coupon Frequency.';
            this.dialogCmp.showAlartDialog('Error');
            return;
          }
          else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "B") {
            this.dialogCmp.statusMsg = 'Issue and Maturity date difference should be at least 6 months in case of \'BI-ANNUAL\' Coupon Frequency.';
            this.dialogCmp.showAlartDialog('Error');
            return;
          }
          else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "Q") {
            this.dialogCmp.statusMsg = 'Issue and Maturity date difference should be at least 3 months in case of \'QUARTER\' Coupon Frequency.';
            this.dialogCmp.showAlartDialog('Error');
            return;
          }
          else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "M") {
            this.dialogCmp.statusMsg = 'Issue and Maturity date difference should be at least 1 month in case of \'MONTHLY\' Coupon Frequency.';
            this.dialogCmp.showAlartDialog('Error');
            return;
          }
          else if (this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "S" && (this.bondTypeId.selectedValue == 2 || this.bondTypeId.selectedValue == 3)) {
            this.dialogCmp.statusMsg = 'Coupon Frequency is required.';
            this.dialogCmp.showAlartDialog('Error');
            return;
          }
        }

        this.selectedItem.securityFisDetail.issueDate = new Date(AppUtility.toYYYYMMDD(this.issueDate.value));
        this.selectedItem.securityFisDetail.maturityDate = new Date(AppUtility.toYYYYMMDD(this.maturityDate.value));
        this.selectedItem.securityFisDetail.firstTradingDate = new Date(AppUtility.toYYYYMMDD(this.firstTradingDate.value));
        this.selectedItem.securityFisDetail.lastTradingDate = new Date(AppUtility.toYYYYMMDD(this.lastTradingDate.value));
        this.selectedItem.securityFisDetail.maturityDays = this.maturityTenure;
      }

      if(this.selectedItem.securityFisDetail.currency.currencyId === this.selectedItem.securityFisDetail.indexedCurrency.currencyId) {
        this.dialogCmp.statusMsg = 'Curreny and indexed currency should be different.';
        this.dialogCmp.showAlartDialog('Error');
        return;
      }
      

      if(this.selectedItem.securityFisDetail.indexedCurrency.currencyId === null){
        debugger
        this.selectedItem.securityFisDetail.indexedCurrency = null;
      }

      if(this.selectedItem.securityFisDetail.couponFrequency.frequencyCode == "S"){
        this.selectedItem.securityFisDetail.couponFrequency.frequencyCode = "";
      }


     this.splash.show();
      AppUtility.printConsole('Selected security: ' + JSON.stringify(this.selectedItem));
      if (this.isEditing) {
        this.listingService.updateSecurity(this.selectedItem).subscribe(
          data => {
           this.splash.hide();
            this.fillSecurityFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.flex.invalidate();
            this.selectedItem.securityType.securityTypeId = data.securityType.securityTypeId;
            this.selectedItem.securityType.securityType = data.securityType.securityType;

            this.selectedItem.registrar.registrarId = data.registrar.registrarId;
            this.selectedItem.registrar.name = data.registrar.name;
            this.selectedItem.registrar.registrarCode = data.registrar.registrarCode;
            // this.selectedItem.sector.sectorId = data.sector.sectorId;
            //  this.selectedItem.sector.sectorName = data.sector.sectorName;
            //this.itemsList.refresh();
            this.errorMessage = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.statusMsg = this.errorMessage;
            
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
           this.splash.hide();
           this.dialogCmp.statusMsg = "";
           this.errorMessage = "";
            if(err.message){
              this.errorMessage = err.message;
            }
            else {
              this.errorMessage = err;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
      else {
        this.selectedItem.securityFisDetail.reInvested = 'N';
        this.selectedItem.securityName = this.selectedItem.symbol; 
        this.listingService.saveSecurity(this.selectedItem).subscribe(
          data => {
           this.splash.hide();
           this.errorMessage = "";
           this.dialogCmp.statusMsg = "";
            if (AppUtility.isEmpty(this.itemsList))
            this.itemsList = new wjcCore.CollectionView;
            this.selectedItem = this.itemsList.addNew();
            this.fillSecurityFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            AppUtility.moveSelectionToLastItem(this.itemsList);
            this.errorMessage = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
           this.splash.hide();
           this.errorMessage = "";
           this.dialogCmp.statusMsg = "";
            if(err.message){
              this.errorMessage = err.message;
            }
            else {
              this.errorMessage = err;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
    }
  }

  /***************************************
   *          Private Methods
   **************************************/
  private fillSecurityFromJson(s: Security, data: any) {
    s.securityId = data.securityId;
    s.isin = data.isin;
    s.active = data.active;

    s.symbol = data.symbol;
    s.outstandingShares = data.outstandingShares;


    s.securityType = new SecurityType();
    s.securityType.securityTypeId = data.securityType.securityTypeId;
    s.securityType.securityType = data.securityType.securityType;

    s.registrar = new Registrar();
    s.registrar.registrarId = data.registrar.registrarId;
    s.registrar.name = data.registrar.name;

    //  s.sector = new Sector();
    // s.sector.sectorId = data.sector.sectorId;
    //  s.sector.sectorName = data.sector.sectorName;

    if (data.securityType.securityTypeId == AppConstants.SECURITY_TYPE_BOND) {
      s.securityFisDetail = new SecurityFisDetail();
      s.securityFisDetail.securityId = data.securityFisDetail.securityId;
      s.securityFisDetail.aIrr = data.securityFisDetail.aIrr;
      s.securityFisDetail.baseRate = data.securityFisDetail.baseRate;
      s.securityFisDetail.couponRate = data.securityFisDetail.couponRate;
      s.securityFisDetail.discountRate = data.securityFisDetail.discountRate;
      s.securityFisDetail.confirmRate = data.securityFisDetail.confirmRate;
    
      s.securityFisDetail.parValue = data.securityFisDetail.parValue;
      s.securityFisDetail.irr = data.securityFisDetail.irr;
      s.securityFisDetail.issueDate = new Date(data.securityFisDetail.issueDate);
      s.securityFisDetail.maturityDate = new Date(data.securityFisDetail.maturityDate);
      s.securityFisDetail.firstTradingDate = new Date(data.securityFisDetail.firstTradingDate);
      s.securityFisDetail.lastTradingDate = new Date(data.securityFisDetail.lastTradingDate);
      s.securityFisDetail.maturityDays = data.securityFisDetail.maturityDays;
      this.maturityTenure = data.securityFisDetail.maturityDays;
      s.securityFisDetail.nextCouponDate = data.securityFisDetail.nextCouponDate;
      //s.securityFisDetail.parValue = data.securityFisDetail.parValue;
      s.securityFisDetail.spreadRate = data.securityFisDetail.spreadRate;
      s.securityFisDetail.yearDays = data.securityFisDetail.yearDays;
      s.securityFisDetail.dayCountConvention = data.securityFisDetail.dayCountConvention;
      s.securityFisDetail.reInvested = data.securityFisDetail.reInvested;


      s.securityFisDetail.currency = new Currency();
      if(AppUtility.isValidVariable(data.securityFisDetail.currency)){
        s.securityFisDetail.currency.currencyId = data.securityFisDetail.currency.currencyId;
      }


   
      s.securityFisDetail.indexedCurrency = new Currency();
      if(AppUtility.isValidVariable(data.securityFisDetail.indexedCurrency)){
        s.securityFisDetail.indexedCurrency.currencyId = data.securityFisDetail.indexedCurrency.currencyId;
      }
      

      s.securityFisDetail.bondType = new BondType();
      if ( data.securityFisDetail.bondType != null && data.securityFisDetail.bondType != undefined) {
        s.securityFisDetail.bondType.bondTypeId = data.securityFisDetail.bondType.bondTypeId;
        s.securityFisDetail.bondType.bondType = data.securityFisDetail.bondType.bondType;
      }

      s.securityFisDetail.bondCategory = new BondCategory();
      if ( data.securityFisDetail.bondCategory != null && data.securityFisDetail.bondCategory != undefined) {
        s.securityFisDetail.bondCategory.categoryId = data.securityFisDetail.bondCategory.categoryId;
        s.securityFisDetail.bondCategory.category = data.securityFisDetail.bondCategory.category;
      }

      s.securityFisDetail.bondSubCategory = new BondSubCategory();
      if ( data.securityFisDetail.bondSubCategory != null && data.securityFisDetail.bondSubCategory != undefined) {
        s.securityFisDetail.bondSubCategory.subCategoryId = data.securityFisDetail.bondSubCategory.subCategoryId;
        s.securityFisDetail.bondSubCategory.subCategory = data.securityFisDetail.bondSubCategory.subCategory;
      }

      s.securityFisDetail.couponFrequency = new CouponFrequency();
      if ( data.securityFisDetail.couponFrequency != null && data.securityFisDetail.couponFrequency != undefined) {
        s.securityFisDetail.couponFrequency.frequencyCode = data.securityFisDetail.couponFrequency.frequencyCode;
        s.securityFisDetail.couponFrequency.frequencyDesc = data.securityFisDetail.couponFrequency.frequencyDesc;
      }


      //this.onGeneratePaymentSchedualAction();
    }
  }

  private populateSecurityTypeList() {
   this.splash.show();
    this.listingService.getSecurityTypeByTypeId(AppConstants.SECURITY_TYPE_BOND)
      .subscribe(
        restData => {
         this.splash.hide();
          this.securityTypeList = restData;
          // var sType: SecurityType = new SecurityType();
          // sType.securityTypeId = AppConstants.PLEASE_SELECT_VAL;
          // sType.securityType = AppConstants.PLEASE_SELECT_STR;
          // this.securityTypeList.unshift(sType);
          // this.selectedItem.securityType.securityTypeId = this.securityTypeList[0].securityTypeId;
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }
  private populateRegistrarList() {
   this.splash.show();
    this.listingService.getActiveRegistrarList(0)
      .subscribe(
        restData => {
         this.splash.hide();
          this.registrarList = restData;
          var reg: Registrar = new Registrar();
          reg.registrarId = AppConstants.PLEASE_SELECT_VAL;
          reg.displayName_ = AppConstants.PLEASE_SELECT_STR;
          this.registrarList.unshift(reg);
          this.selectedItem.registrar.registrarId = this.registrarList[0].registrarId;
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }

  // private populateauctionNumberList() {
  //  this.splash.show();
  //   //  Customer asked to create & show auctions in previous dates @ 09/Sep/2020 - AiK
  //   //  this.listingService.getActiveMmAuctionListByDateAndStatus(new Date(), true)
  //   this.listingService.getActiveMmAuctionListByDateAndStatus(wjcCore.DateTime.addYears(new Date(), -10), true)
  //     .subscribe(
  //       restData => {
  //        this.splash.hide();
  //         this.auctionList = restData;
  //         var mma: MmAuction = new MmAuction();
  //         mma.auctionId = AppConstants.PLEASE_SELECT_VAL;
  //         mma.auctionNumber_ = AppConstants.PLEASE_SELECT_STR;
  //         if (restData != null) {
  //           this.auctionList.unshift(mma);
  //           this.selectedItem.securityFisDetail.mmAuction.auctionId = this.auctionList[0].auctionId;
  //         }
  //       },
  //       error => {
  //        this.splash.hide();
  //         this.errorMessage = <any>error
  //       });
  // }

  private getAuctionById(auctionId: number) {
   this.splash.show();
    this.listingService.getAuctionById(auctionId)
      .subscribe(
        restData => {
         this.splash.hide();
          var auc: any[];
          auc = new Array(restData);
         
          this.auctionList = auc;
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }


  private populateSectorList() {
   this.splash.show();
    this.listingService.getActiveSectorsList()
      .subscribe(
        restData => {
         this.splash.hide();
          this.sectorList = restData;
          var sec: Sector = new Sector();
          sec.sectorId = AppConstants.PLEASE_SELECT_VAL;
          sec.displayName_ = AppConstants.PLEASE_SELECT_STR;
          this.sectorList.unshift(sec);
          this.selectedItem.sector.sectorId = this.sectorList[0].sectorId;
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }




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
       this.splash.hide();
        if(err.message){
          this.errorMessage = err.message;
        }
        else {
          this.errorMessage = err;
        }
      });
 }
 






  private populateBondCategoryList() {
   this.splash.show();
    this.listingService.getBondCategoryList()
      .subscribe(
        restData => {
         this.splash.hide();
          this.bondCategoryList = restData;
          var bc: BondCategory = new BondCategory();
          bc.categoryId = AppConstants.PLEASE_SELECT_VAL;
          bc.category = AppConstants.PLEASE_SELECT_STR;
          this.bondCategoryList.unshift(bc);
          this.selectedItem.securityFisDetail.bondCategory.categoryId = this.bondCategoryList[0].categoryId;
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }

  private populateBondSubCategoryList() {
   this.splash.show();
    this.listingService.getBondSubCategoryList()
      .subscribe(
        restData => {
         this.splash.hide();
          this.bondSubCategoryList = restData;
          var bc: BondSubCategory = new BondSubCategory();
          bc.subCategoryId = AppConstants.PLEASE_SELECT_VAL;
          bc.subCategory = AppConstants.PLEASE_SELECT_STR;
          this.bondSubCategoryList.unshift(bc);
          this.selectedItem.securityFisDetail.bondSubCategory.subCategoryId = this.bondSubCategoryList[0].subCategoryId;
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }

  private populateBondTypeList() {
   this.splash.show();
    this.listingService.getBondTypeList()
      .subscribe(
        restData => {
         this.splash.hide();
          this.bondTypeList = restData;
          var bt: BondType = new BondType();
          bt.bondTypeId = AppConstants.PLEASE_SELECT_VAL;
          bt.bondType = AppConstants.PLEASE_SELECT_STR;
          this.bondTypeList.unshift(bt);
          this.selectedItem.securityFisDetail.bondType.bondTypeId = this.bondTypeList[0].bondTypeId;
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }
  private populateDayCountConventionsList() {
   this.splash.show();
    this.listingService.getDayCountConventions()
      .subscribe(
        restData => {
         this.splash.hide();
          this.dayCountConventionList = restData;
          var bt: DayCountConvention = new DayCountConvention();
          bt.conventionId = null;
          bt.convention = AppConstants.PLEASE_SELECT_STR;
          this.dayCountConventionList.unshift(bt);
          this.selectedItem.securityFisDetail.dayCountConvention = this.dayCountConventionList[0].conventionId;
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }
  private populateCouponFrequencyList() {
   this.splash.show();
    this.listingService.getCouponFrequencyList()
      .subscribe(
        restData => {
         this.splash.hide();
          this.couponFrequencyList = restData;
          var cf: CouponFrequency = new CouponFrequency();
          cf.frequencyCode = "S";
          cf.frequencyDesc = AppConstants.PLEASE_SELECT_STR;
          this.couponFrequencyList.unshift(cf);
          this.selectedItem.securityFisDetail.couponFrequency.frequencyCode = this.couponFrequencyList[0].frequencyCode;
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }
  private populateSecurityDetailList() {
   this.splash.show();
    this.listingService.getSecuritiesBySecurityType(AppConstants.SECURITY_TYPE_BOND)
      .subscribe(
        restData => {
         this.splash.hide();
          this.itemsList = new wjcCore.CollectionView(restData);
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }

  private populateSecurityStateList() {
   this.splash.show();
    this.listingService.getSecurityStates()
      .subscribe(
        restData => {
         this.splash.hide();
          this.securityStateList = restData;
          var ss: SecurityState = new SecurityState();
          ss.stateId = AppConstants.PLEASE_SELECT_VAL;
          ss.state = AppConstants.PLEASE_SELECT_STR;
          this.securityStateList.unshift(ss);
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }

  private populateSettlementTypeList() {
   this.splash.show();
    this.listingService.getActiveSettlementTypesList()
      .subscribe(
        restData => {
         this.splash.hide();
          this.settlementTypeList = restData;
          var st: SettlementType = new SettlementType();
          st.settlementTypeId = AppConstants.PLEASE_SELECT_VAL;
          st.settlementType = AppConstants.PLEASE_SELECT_STR;
          this.settlementTypeList.unshift(st);
         // this.selectedItem.exchangeMarketSecurity.settlementTypeId = this.settlementTypeList[0].settlementTypeId;
        },
        err => {
         this.splash.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }

  onSecurityChangeEvent(selectedId): void {
    if (!AppUtility.isEmpty(selectedId)) {
     this.splash.show();
      this.bondPaymentSchedualList = [];
      this.listingService.getPaymentSchedualByExchangeMarketSecurityId(selectedId)
        .subscribe(
          restData => {
           this.splash.hide();
            this.bondPaymentSchedualList = restData;
          },
          err => {
           this.splash.hide();
            if(err.message){
              this.errorMessage = err.message;
            }
            else {
              this.errorMessage = err;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    }
  }


  private addFromValidations() {
    this.myForm = this._fb.group({
      securityCode: ['', Validators.compose([Validators.required])],      
      isin: ['' , Validators.compose([Validators.required])],
      outstandingShares: [''],
      parValue: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],      
      confirmRate: [''],
      active: [''],
      securityTypeId: [''],
      sectorId: [''],
      registrarId: ['', Validators.compose([Validators.required])],
      bondCategoryId: [''],
      bondSubCategoryId: [''],
      bondTypeId: [''],
      couponFrequency: [''],
      dayCountConvention: [''],
      numberOfCoupons: [''],
      maturityTenure: [''],
      couponRate: [''],
      issuePrice: [''],
      currency: ['', Validators.compose([Validators.required])],
      indexed_currency : [''],
      etf : [''],
      fisn : [''],
      lei : [''],
      cfi : [''],
      cmbMaturityDaysTBills: [''],
      
      
    });
  }

  public validateBondsControl(_flag: boolean, _bondType: number) {
    if (_flag) {
      (<any>this.myForm).controls.bondCategoryId.setValidators([Validators.required]);
      (<any>this.myForm).controls.bondCategoryId.updateValueAndValidity();
      (<any>this.myForm).controls.bondSubCategoryId.setValidators([Validators.required]);
      (<any>this.myForm).controls.bondSubCategoryId.updateValueAndValidity();
      (<any>this.myForm).controls.bondTypeId.setValidators([Validators.required]);
      (<any>this.myForm).controls.bondTypeId.updateValueAndValidity();

      if (_bondType == 1)
        this.numberOfCoupons == 0

      if (_bondType == 1 || _bondType == 4) {
        (<any>this.myForm).controls.couponFrequency.setValidators(null);
        (<any>this.myForm).controls.couponFrequency.updateValueAndValidity();
        this.isDisable = true;
      }
      else {
        (<any>this.myForm).controls.couponFrequency.setValidators([Validators.required]);
        (<any>this.myForm).controls.couponFrequency.updateValueAndValidity();
        this.isDisable = false;
      }
      (<any>this.myForm).controls.dayCountConvention.setValidators([Validators.required]);
      (<any>this.myForm).controls.dayCountConvention.updateValueAndValidity();
      (<any>this.myForm).controls.couponRate.setValidators([Validators.required]);
      (<any>this.myForm).controls.couponRate.updateValueAndValidity();
    }
    else {
      (<any>this.myForm).controls.bondCategoryId.setValidators(null);
      (<any>this.myForm).controls.bondCategoryId.updateValueAndValidity();
      (<any>this.myForm).controls.bondSubCategoryId.setValidators(null);
      (<any>this.myForm).controls.bondSubCategoryId.updateValueAndValidity();
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









  private populateCurrency() {
    this.currencyList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL },
    { "name": "AED", "code": "AED" },
    { "name": "AFN", "code": "AFN" },
    { "name": "AMD", "code": "AMD" },
    { "name": "ANG", "code": "ANG" },
    { "name": "AOA", "code": "AOA" },
    { "name": "ARS", "code": "ARS" },
    { "name": "AUD", "code": "AUD" },
    { "name": "AWG", "code": "AWG" },
    { "name": "AZN", "code": "AZN" },
    { "name": "BAM", "code": "BAM" },
    { "name": "BBD", "code": "BBD" },
    { "name": "BDT", "code": "BDT" },
    { "name": "BGN", "code": "BGN" },
    { "name": "BHD", "code": "BHD" },
    { "name": "BIF", "code": "BIF" },
    { "name": "BMD", "code": "BMD" },
    { "name": "BND", "code": "BND" },
    { "name": "BOB", "code": "BOB" },
    { "name": "BOV", "code": "BOV" },
    { "name": "BRL", "code": "BRL" },
    { "name": "BSD", "code": "BSD" },
    { "name": "BTN", "code": "BTN" },
    { "name": "BWP", "code": "BWP" },
    { "name": "BYN", "code": "BYN" },
    { "name": "BZD", "code": "BZD" },
    { "name": "CAD", "code": "CAD" },
    { "name": "CDF", "code": "CDF" },
    { "name": "CHE", "code": "CHE" },
    { "name": "CHF", "code": "CHF" },
    { "name": "CHW", "code": "CHW" },
    { "name": "CLF", "code": "CLF" },
    { "name": "CLP", "code": "CLP" },
    { "name": "CNY", "code": "CNY" },
    { "name": "COP", "code": "COP" },
    { "name": "COU", "code": "COU" },
    { "name": "CRC", "code": "CRC" },
    { "name": "CUC", "code": "CUC" },
    { "name": "CUP", "code": "CUP" },
    { "name": "CVE", "code": "CVE" },
    { "name": "CZK", "code": "CZK" },
    { "name": "DJF", "code": "DJF" },
    { "name": "DKK", "code": "DKK" },
    { "name": "DOP", "code": "DOP" },
    { "name": "DZD", "code": "DZD" },
    { "name": "EGP", "code": "EGP" },
    { "name": "ERN", "code": "ERN" },
    { "name": "ETB", "code": "ETB" },
    { "name": "EUR", "code": "EUR" },
    { "name": "FJD", "code": "FJD" },
    { "name": "FKP", "code": "FKP" },
    { "name": "GBP", "code": "GBP" },
    { "name": "GEL", "code": "GEL" },
    { "name": "GHS", "code": "GHS" },
    { "name": "GIP", "code": "GIP" },
    { "name": "GMD", "code": "GMD" },
    { "name": "GNF", "code": "GNF" },
    { "name": "GTQ", "code": "GTQ" },
    { "name": "GYD", "code": "GYD" },
    { "name": "HKD", "code": "HKD" },
    { "name": "HNL", "code": "HNL" },
    { "name": "HRK", "code": "HRK" },
    { "name": "HTG", "code": "HTG" },
    { "name": "HUF", "code": "HUF" },
    { "name": "IDR", "code": "IDR" },
    { "name": "ILS", "code": "ILS" },
    { "name": "INR", "code": "INR" },
    { "name": "IQD", "code": "IQD" },
    { "name": "IRR", "code": "IRR" },
    { "name": "ISK", "code": "ISK" },
    { "name": "JMD", "code": "JMD" },
    { "name": "JOD", "code": "JOD" },
    { "name": "JPY", "code": "JPY" },
    { "name": "KES", "code": "KES" },
    { "name": "KGS", "code": "KGS" },
    { "name": "KHR", "code": "KHR" },
    { "name": "KMF", "code": "KMF" },
    { "name": "KPW", "code": "KPW" },
    { "name": "KWD", "code": "KWD" },
    { "name": "KYD", "code": "KYD" },
    { "name": "KZT", "code": "KZT" },
    { "name": "LAK", "code": "LAK" },
    { "name": "LBP", "code": "LBP" },
    { "name": "LKR", "code": "LKR" },
    { "name": "LRD", "code": "LRD" },
    { "name": "LSL", "code": "LSL" },
    { "name": "LYD", "code": "LYD" },
    { "name": "MAD", "code": "MAD" },
    { "name": "MDL", "code": "MDL" },
    { "name": "MGA", "code": "MGA" },
    { "name": "MKD", "code": "MKD" },
    { "name": "MMK", "code": "MMK" },
    { "name": "MNT", "code": "MNT" },
    { "name": "MOP", "code": "MOP" },
    { "name": "MRU", "code": "MRU" },
    { "name": "MUR", "code": "MUR" },
    { "name": "MVR", "code": "MVR" },
    { "name": "MWK", "code": "MWK" },
    { "name": "MXN", "code": "MXN" },
    { "name": "MXV", "code": "MXV" },
    { "name": "MYR", "code": "MYR" },
    { "name": "MZN", "code": "MZN" },
    { "name": "NAD", "code": "NAD" },
    { "name": "NGN", "code": "NGN" },
    { "name": "NIO", "code": "NIO" },
    { "name": "NOK", "code": "NOK" },
    { "name": "NPR", "code": "NPR" },
    { "name": "NZD", "code": "NZD" },
    { "name": "OMR", "code": "OMR" },
    { "name": "PAB", "code": "PAB" },
    { "name": "PEN", "code": "PEN" },
    { "name": "PGK", "code": "PGK" },
    { "name": "PHP", "code": "PHP" },
    { "name": "PKR", "code": "PKR" },
    { "name": "PLN", "code": "PLN" },
    { "name": "PYG", "code": "PYG" },
    { "name": "QAR", "code": "QAR" },
    { "name": "RON", "code": "RON" },
    { "name": "RSD", "code": "RSD" },
    { "name": "RUB", "code": "RUB" },
    { "name": "RWF", "code": "RWF" },
    { "name": "SAR", "code": "SAR" },
    { "name": "SBD", "code": "SBD" },
    { "name": "SCR", "code": "SCR" },
    { "name": "SDG", "code": "SDG" },
    { "name": "SEK", "code": "SEK" },
    { "name": "SGD", "code": "SGD" },
    { "name": "SHP", "code": "SHP" },
    { "name": "SLL", "code": "SLL" },
    { "name": "SOS", "code": "SOS" },
    { "name": "SRD", "code": "SRD" },
    { "name": "SSP", "code": "SSP" },
    { "name": "STN", "code": "STN" },
    { "name": "SVC", "code": "SVC" },
    { "name": "SYP", "code": "SYP" },
    { "name": "SZL", "code": "SZL" },
    { "name": "THB", "code": "THB" },
    { "name": "TJS", "code": "TJS" },
    { "name": "TMT", "code": "TMT" },
    { "name": "TND", "code": "TND" },
    { "name": "TOP", "code": "TOP" },
    { "name": "TRY", "code": "TRY" },
    { "name": "TTD", "code": "TTD" },
    { "name": "TWD", "code": "TWD" },
    { "name": "TZS", "code": "TZS" },
    { "name": "UAH", "code": "UAH" },
    { "name": "UGX", "code": "UGX" },
    { "name": "USD", "code": "USD" },
    { "name": "USN", "code": "USN" },
    { "name": "UYI", "code": "UYI" },
    { "name": "UYU", "code": "UYU" },
    { "name": "UZS", "code": "UZS" },
    { "name": "VEF", "code": "VEF" },
    { "name": "VND", "code": "VND" },
    { "name": "VUV", "code": "VUV" },
    { "name": "WST", "code": "WST" },
    { "name": "XAF", "code": "XAF" },
    { "name": "XCD", "code": "XCD" },
    { "name": "XDR", "code": "XDR" },
    { "name": "XOF", "code": "XOF" },
    { "name": "XPF", "code": "XPF" },
    { "name": "XSU", "code": "XSU" },
    { "name": "XUA", "code": "XUA" },
    { "name": "YER", "code": "YER" },
    { "name": "ZAR", "code": "ZAR" },
    { "name": "ZMW", "code": "ZMW" },
    { "name": "ZWL", "code": "ZWL" }];
  }

  private populateMaturityDaysInCaseOfTBills() {
    this.maturityDaysList = [{ "name": "91", "code": 91 },
    { "name": "182", "code": 182 },
    { "name": "364", "code": 364 }];
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success') {
      this.clearFields();
      this.hideModal();
      // this.clearFields();
    }
  }

}