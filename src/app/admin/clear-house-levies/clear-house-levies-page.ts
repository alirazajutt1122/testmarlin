'use strict';
import { Component, OnInit, AfterViewInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ClearingHouseLeviesDetail } from 'app/models/clear-house-levies-detail';
import { ClearingHouseLeviesMaster } from 'app/models/clear-house-levies-master';
import { Exchange } from 'app/models/exchange';
import { SettlementType } from 'app/models/settlement-type';
import { ListingService } from 'app/services/listing.service';
import { IPagedCollectionView, } from '@grapecity/wijmo';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AuthService2 } from 'app/services/auth2.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

declare var jQuery: any;
@Component({
    selector: 'clear-house-levies-page',
    templateUrl: './clear-house-levies-page.html',
})

export class ClearHouseLeviesPage implements OnInit {

    public static _exchangeid: Number;
    private static searchButtonDisabled: String = 'btn btn-success btn-sm disabled';
    private static searchButtonEnabled: String = 'btn btn-success btn-sm';
    private static selectExchangeMsg: String = 'Please select any exchange';
    private static lowerRangeMax: Number = 999999.9998;
    public myForm: FormGroup;
    itemsList: wjcCore.CollectionView;        // A list which will bind to the flex grid of Page.
    slabDetailList: wjcCore.CollectionView;   // A list which will bind to the flex grid of Modal.
    selectedItem: ClearingHouseLeviesDetail;  // The Master Item
    selectedDetailItem: ClearingHouseLeviesDetail;    // The Detail Item

    errorMessage: string;
    exchangeNameList: any[];
    settlementTypeList: any[];
    appliesToList: any[];

    private detail_editing: Boolean;

    // sampleDetailList = [];


    today: Date = new Date();
    public hideForm = false;
    public isSubmitted: boolean;
    public isEditing: boolean;
    public isParentDisabled: boolean;

    public maxAmountError: boolean;
    public LevyRateError: Boolean;
    public minimumAmountError: Boolean;
    public maximumAmountError: Boolean;
    public minimumGreaterThanMaximumError: Boolean;
    public isDetailEditing: boolean;

    public searchButtonClass: String;
    public searchButtonTooltip: String;
    public addingNew: boolean;
    public finalSaveUpdate: boolean;
    public maxLevyRate: Number;
    public disabled: String;
    public levyRateLabelModalDisplay: String;
    public levyRateLabelPageDisplay: String;
    private isNotUnique: boolean = false;
    private _pageSize = 0;

    //claims: any;

    @ViewChild('flex') flex: wjcGrid.FlexGrid;
    @ViewChild('flexDetail') flexDetail: wjcGrid.FlexGrid;
    @ViewChild('levyRate') levyRateControl: wjcInput.InputNumber;
    @ViewChild('exchangeCode') exchangeCode: wjcInput.InputMask;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    lang: string;

    constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2
        , private translate: TranslateService, private loader: FuseLoaderScreenService) {
        //this.claims = authService.claims;
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

        this.clearFields(true, true);
        this.hideForm = false;
        this.isSubmitted = false;
        this.isEditing = false;
        this.today = new Date();
        this.today.setDate(this.today.getDate() + 1);
        this.itemsList = new wjcCore.CollectionView();

        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
    }
    ngOnInit() {
        
        jQuery('.parsleyjs').parsley();

        this.clearFields(true, true);

        // Populate exchangesList in DropDown in search option.
        this.populateExchangeList();

        // Populate settlementType List
        this.populateSettlementTypeList();

        // Add Form Validations
        this.addFormValidations();
    }
    public ngAfterViewInit() {
        var self = this;
        $('#add_new').on('shown.bs.modal', function () {
            wjcGrid.FlexGrid.invalidateAll();
            self.exchangeCode.focus();
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


        if (AppUtility.isValidVariable(this.itemsList)) {
            this.itemsList.cancelEdit();
            this.itemsList.cancelNew();
        }
        this.hideForm = false;
        this.isEditing = false;
        this.addingNew = true;
        this.isDetailEditing = false;
        this.maxAmountError = false;
        this.LevyRateError = false;
        this.minimumAmountError = false;
        this.maximumAmountError = false;
        this.minimumGreaterThanMaximumError = false;
        this.searchButtonClass = ClearHouseLeviesPage.searchButtonDisabled;
        this.searchButtonTooltip = ClearHouseLeviesPage.selectExchangeMsg;
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
        this.selectedItem = new ClearingHouseLeviesDetail();
        this.selectedItem.effectiveDate = this.today;
        this.selectedItem.levyRate = 0;
        this.selectedItem.tradingSide = this.appliesToList[0].abbreviation;
        this.selectedItem.minAmount = 0;
        this.selectedItem.maxAmount = this.selectedItem.minAmount.valueOf() + 0.00000001;
        this.selectedItem.leviesDetailId = null;
        this.selectedItem.active = true;


        this.disabled = 'disabled';
        this.selectedItem.settlementType = new SettlementType();
        this.selectedItem.settlementType.settlementTypeId = null;
        this.selectedItem.settlementType.active = null;
        this.selectedItem.settlementType.settlementDays = null;
        this.selectedItem.settlementType.settlementDesc = null;
        this.selectedItem.settlementType.settlementType = null;
        this.selectedItem.settlementType.tradeDays = null;

        this.selectedItem.chLeviesMaster = new ClearingHouseLeviesMaster();
        this.selectedItem.chLeviesMaster.leviesMasterId = null;
        this.selectedItem.chLeviesMaster.percentage = true;
        this.selectedItem.chLeviesMaster.levyDesc = null;
        this.selectedItem.chLeviesMaster.levyCode = null;
        this.selectedItem.chLeviesMaster.levyType = 'P';
        this.selectedItem.chLeviesMaster.levyTypeDisplay = 'Percentage';

        this.selectedItem.chLeviesMaster.exchange = new Exchange();

        this.selectedItem.chLeviesMaster.exchange.exchangeId = null;
        this.selectedItem.chLeviesMaster.exchange.exchangeCode = null;
        this.selectedItem.chLeviesMaster.exchange.exchangeName = null;

        if (!AppUtility.isEmptyArray(this.appliesToList)) {
            this.selectedItem.tradingSide = this.appliesToList[0].abbreviation;
        }
        this.selectedItem.settlementType = new SettlementType();

        if (!AppUtility.isEmptyArray(this.settlementTypeList)) {
            this.selectedItem.settlementType.settlementTypeId = this.settlementTypeList[0].settlementTypeId;
            this.selectedItem.settlementType.active = this.settlementTypeList[0].active;
            this.selectedItem.settlementType.settlementDays = this.settlementTypeList[0].settlementDays;
            this.selectedItem.settlementType.settlementDesc = this.settlementTypeList[0].settlementDesc;
            this.selectedItem.settlementType.settlementType = this.settlementTypeList[0].settlementType;
            this.selectedItem.settlementType.tradeDays = this.settlementTypeList[0].tradeDays;
        }
    }

    private ClearDetailObject() {
        this.selectedDetailItem = new ClearingHouseLeviesDetail();
        this.selectedDetailItem.effectiveDate = this.today;
        this.selectedDetailItem.levyRate = 0;
        this.selectedDetailItem.tradingSide = this.appliesToList[0].abbreviation;
        this.selectedDetailItem.tradingSideDisplay_ = AppConstants.SELL_STRING;
        this.selectedDetailItem.minAmount = 0;
        this.selectedDetailItem.maxAmount = this.selectedDetailItem.minAmount.valueOf() + 0.00000001;
        this.selectedDetailItem.leviesDetailId = null;
        this.selectedDetailItem.active = true;

        this.selectedDetailItem.settlementType = new SettlementType();
        if (!AppUtility.isEmptyArray(this.settlementTypeList)) {
            this.selectedDetailItem.settlementType.settlementTypeId = this.settlementTypeList[0].settlementTypeId;
            this.selectedDetailItem.settlementType.active = this.settlementTypeList[0].active;
            this.selectedDetailItem.settlementType.settlementDays = this.settlementTypeList[0].settlementDays;
            this.selectedDetailItem.settlementType.settlementDesc = this.settlementTypeList[0].settlementDesc;
            this.selectedDetailItem.settlementType.settlementType = this.settlementTypeList[0].settlementType;
            this.selectedDetailItem.settlementType.tradeDays = this.settlementTypeList[0].tradeDays;
        }

        this.selectedDetailItem.chLeviesMaster = new ClearingHouseLeviesMaster();
        this.selectedDetailItem.chLeviesMaster.leviesMasterId = null;
        this.selectedDetailItem.chLeviesMaster.percentage = true;
        this.selectedDetailItem.chLeviesMaster.levyDesc = null;
        this.selectedDetailItem.chLeviesMaster.levyCode = null;
        this.selectedDetailItem.chLeviesMaster.levyType = 'P';
        this.selectedDetailItem.chLeviesMaster.levyTypeDisplay = 'Percentage';


        if (this.selectedItem.chLeviesMaster.levyType == 'P') {
            this.selectedDetailItem.chLeviesMaster.levyTypeDisplay = 'Percentage';
            this.levyRateLabelModalDisplay = 'Levy Rate (Overall)';
        }
        else {
            this.selectedDetailItem.chLeviesMaster.levyTypeDisplay = 'Fixed';
            this.levyRateLabelModalDisplay = 'Levy Rate (Per Share)';
        }
        this.selectedDetailItem.chLeviesMaster.exchange = new Exchange();

        this.selectedDetailItem.chLeviesMaster.exchange.exchangeId = null;
        this.selectedDetailItem.chLeviesMaster.exchange.exchangeCode = null;
        this.selectedDetailItem.chLeviesMaster.exchange.exchangeName = null;
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

    public onSettlementTypeChangeEvent(stId) {
        if (AppUtility.isValidVariable(this.settlementTypeList)) {
            for (let i = 0; i < this.settlementTypeList.length; i++) {
                if (this.settlementTypeList[i].settlementTypeId == stId) {
                    this.selectedDetailItem.settlementType.active = this.settlementTypeList[i].active;
                    this.selectedDetailItem.settlementType.settlementDays = this.settlementTypeList[i].settlementDays;
                    this.selectedDetailItem.settlementType.settlementDesc = this.settlementTypeList[i].settlementDesc;
                    this.selectedDetailItem.settlementType.settlementType = this.settlementTypeList[i].settlementType;
                    this.selectedDetailItem.settlementType.tradeDays = this.settlementTypeList[i].tradeDays;
                }
            }
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

    public onModalLoaded() {
        $('#add_new').on('shown.bs.modal', function () {
            wjcGrid.FlexGrid.invalidateAll();
        });

        if (AppUtility.isValidVariable(this.slabDetailList)) {

            if (this.selectedItem.chLeviesMaster.levyType == 'P') {
                this.levyRateLabelModalDisplay = 'Levy Rate (Overall)';
                this.maxLevyRate = 100;
            }
            else {
                this.levyRateLabelModalDisplay = 'Levy Rate (Per Share)';
                this.maxLevyRate = 999999.99999999;
            }
        }
        this.flexDetail.invalidate();
    }
    public onCancelAction() {
        this.clearFields(true, true);
        this.getClearingHouseLevysList(ClearHouseLeviesPage._exchangeid);
        this.hideForm = false;
    }

    public onNewAction() {
        this.clearFields(true, true);
        this.hideForm = true;
        if (AppUtility.isValidVariable(this.slabDetailList)) {
            this.slabDetailList = null;
            this.onModalLoaded();
        }
        this.isParentDisabled = false;
        this.addingNew = true;
        this.onLevyTypeChangeEvent(true);
    }

    public onSearchAction() {
        if (AppUtility.isValidVariable(this.itemsList)) {
            while (!this.itemsList.isEmpty)
                this.itemsList.removeAt(0);
            this.flex.refresh();
        }
        this.getClearingHouseLevysList(this.selectedItem.chLeviesMaster.exchange.exchangeId);
    }


    public loadObject(selectedDetailItem: ClearingHouseLeviesDetail, selectedItem: ClearingHouseLeviesDetail) {
        let temp_detail = this.slabDetailList.addNew();
        temp_detail.effectiveDate = selectedDetailItem.effectiveDate;
        temp_detail.levyRate = selectedDetailItem.levyRate;
        temp_detail.minAmount = selectedDetailItem.minAmount;
        temp_detail.maxAmount = selectedDetailItem.maxAmount;
        temp_detail.leviesDetailId = selectedDetailItem.leviesDetailId;
        temp_detail.active = selectedDetailItem.active;
        temp_detail.tradingSide = selectedDetailItem.tradingSide;

        if (selectedDetailItem.tradingSide == 'S')
            temp_detail.tradingSideDisplay_ = 'Sell';
        else if (selectedDetailItem.tradingSide == 'B')
            temp_detail.tradingSideDisplay_ = 'Buy';
        else
            temp_detail.tradingSideDisplay_ = 'Both';

        temp_detail.settlementType = new SettlementType();
        temp_detail.settlementType.settlementTypeId = selectedDetailItem.settlementType.settlementTypeId;
        temp_detail.settlementType.active = selectedDetailItem.settlementType.active;
        temp_detail.settlementType.settlementDays = selectedDetailItem.settlementType.settlementDays;
        temp_detail.settlementType.settlementDesc = selectedDetailItem.settlementType.settlementDesc;
        temp_detail.settlementType.settlementType = selectedDetailItem.settlementType.settlementType;
        temp_detail.settlementType.tradeDays = selectedDetailItem.settlementType.tradeDays;

        temp_detail.chLeviesMaster = selectedItem.chLeviesMaster;
        temp_detail.chLeviesMaster.leviesMasterId = selectedItem.chLeviesMaster.leviesMasterId;
        temp_detail.chLeviesMaster.percentage = selectedItem.chLeviesMaster.percentage;
        temp_detail.chLeviesMaster.levyDesc = selectedItem.chLeviesMaster.levyDesc;
        temp_detail.chLeviesMaster.levyCode = selectedItem.chLeviesMaster.levyCode;
        if (selectedItem.chLeviesMaster.percentage) {
            temp_detail.chLeviesMaster.levyType = 'P';
            temp_detail.chLeviesMaster.levyTypeDisplay = 'Percentage';
            this.levyRateLabelModalDisplay = 'Levy Rate (Overall)';
        }
        else {
            temp_detail.chLeviesMaster.levyType = 'F';
            temp_detail.chLeviesMaster.levyTypeDisplay = 'Fixed';
            this.levyRateLabelModalDisplay = 'Levy Rate (Per Share)';
        }
        temp_detail.chLeviesMaster.exchange = selectedItem.chLeviesMaster.exchange;
        temp_detail.chLeviesMaster.exchange.exchangeId = selectedItem.chLeviesMaster.exchange.exchangeId;
        temp_detail.chLeviesMaster.exchange.exchangeCode = selectedItem.chLeviesMaster.exchange.exchangeCode;
        temp_detail.chLeviesMaster.exchange.exchangeName = selectedItem.chLeviesMaster.exchange.exchangeName;
        this.slabDetailList.commitNew();
    }


    public onAddNewRow() {

        if (!this.maxAmountError && !this.LevyRateError &&
            !this.minimumAmountError && !this.minimumGreaterThanMaximumError) {


            const ctrl_: FormControl = (<any>this.myForm).controls.settlementType;
            ctrl_.setValidators(Validators.required);
            ctrl_.updateValueAndValidity();


            const ctrl: FormControl = (<any>this.myForm).controls.appliesTo;
            ctrl.setValidators(Validators.required);
            ctrl.updateValueAndValidity();

            if (!this.isDetailEditing && !this.maximumAmountError) {
                if (AppUtility.isValidVariable(this.slabDetailList) && this.slabDetailList.items.length && this.myForm.valid) {
                    if (this.isUnique()) {
                        this.loadObject(this.selectedDetailItem, this.selectedItem);
                        this.AllowingEdit();
                    }
                }
                else {
                    // it is the 1st ever element to be added in the list.
                    if (this.myForm.valid) {
                        this.slabDetailList = new wjcCore.CollectionView();
                        this.loadObject(this.selectedDetailItem, this.selectedItem);
                        this.AllowingEdit();
                    }
                    else console.log('invalid value');
                }
            }
            else {
                // this part will be executed in case of editing the detail records in Modal.
                if (this.myForm.valid) {
                    let temp: ClearingHouseLeviesDetail = new ClearingHouseLeviesDetail();
                    temp = (JSON.parse(JSON.stringify(this.slabDetailList.currentItem)));

                    this.deleteCurrentItem();
                    if (this.isUnique())
                        this.loadObject(this.selectedDetailItem, this.selectedItem);
                    else
                        this.loadObject(temp, temp);
                    this.slabDetailList.refresh();
                    this.flexDetail.refresh();
                    this.isDetailEditing = false;
                    this.AllowingEdit();
                }
            }
        }
    }

    public onExchangeNameChangeEvent(selectedSlabId): void {
        if (selectedSlabId == null) {
            this.searchButtonClass = ClearHouseLeviesPage.searchButtonDisabled;
            this.searchButtonTooltip = ClearHouseLeviesPage.selectExchangeMsg;
        }
        else {
            this.searchButtonClass = ClearHouseLeviesPage.searchButtonEnabled;
            this.searchButtonTooltip = 'Search';
        }

    }
    public onEditAction() {
        if (!AppUtility.isEmpty(this.itemsList.currentItem)) {
            this.clearFields(true, true);
            this.hideForm = true;
            this.isEditing = true;
            this.addingNew = false;
            this.selectedItem.chLeviesMaster = this.itemsList.currentItem;
            this.GetClearHouseLeviesDetail(this.selectedItem.chLeviesMaster.leviesMasterId);
            this.itemsList.editItem(this.selectedItem);
        }
        this.addingNew = false;
        this.onModalLoaded();
        this.AllowingEdit();
        this.flexDetail.refresh();
    }

    /**
     * This function allow the user to edit the Clear house Levis detail
     * if the date of that detail is greater than the current date.
     */
    private AllowingEdit() {
        debugger
        this.isParentDisabled = false;
        let milliSecondsInOneDay: Number = 86400000;

        // Number of days from  01 January, 1970
        let _Day: Number = Math.round(new Date().valueOf() / milliSecondsInOneDay.valueOf());

        if (AppUtility.isValidVariable(this.slabDetailList)) {
            for (let i = 0; i < this.slabDetailList.items.length; i++) {

                // Number of days from  01 January, 1970
                let _dayOfRecord: Number =
                    Math.round(this.slabDetailList.items[i].effectiveDate.valueOf() /
                        milliSecondsInOneDay.valueOf());


                if (isNaN(_dayOfRecord.valueOf()))
                    _dayOfRecord = Math.round(Date.parse(
                        this.slabDetailList.items[i].effectiveDate.valueOf()
                    ).valueOf() / milliSecondsInOneDay.valueOf());

                if (_dayOfRecord >= _Day) {
                    if (this.slabDetailList.items[i].leviesDetailId == null) {
                        this.slabDetailList.items[i].validFrom = true;
                        this.slabDetailList.items[i].newElement = true;
                    }
                    else {
                        this.slabDetailList.items[i].validFrom = true;
                        this.slabDetailList.items[i].newElement = false;
                    }
                }
                else {
                    this.isParentDisabled = true;
                    this.slabDetailList.items[i].validFrom = false;
                    this.slabDetailList.items[i].newElement = false;
                }
            }
            this.slabDetailList.refresh();
        }
    }

    private isUnique(): boolean {
        let _sell: boolean = false;
        let _buy: boolean = false;
        let _both: boolean = false;
        let _itemTradingSide: String = this.selectedDetailItem.tradingSide;
        let b: boolean = true;

        if (AppUtility.isValidVariable(this.slabDetailList)) {
            for (let i = 0; i < this.slabDetailList.items.length; i++) {
                //alert(this.selectedDetailItem.settlementType.settlementTypeId + ", " + this.slabDetailList.items[i].settlementType.settlementTypeId);
                if (this.selectedDetailItem.settlementType.settlementTypeId ==
                    this.slabDetailList.items[i].settlementType.settlementTypeId) {
                    if (this.slabDetailList.items[i].tradingSide == 'S')
                        _sell = true;
                    else if (this.slabDetailList.items[i].tradingSide == 'B')
                        _buy = true;
                    else if (this.slabDetailList.items[i].tradingSide == 'O')
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
            this.dialogCmp.statusMsg = 'A record should be Unique by Levy Code, Settlement Type and Applies To';
            this.dialogCmp.showAlartDialog('Warning');
            this.isNotUnique = true;
        } else this.isNotUnique = false;

        return b;
    }
    public onEditDetailAction() {
        debugger
        this.isDetailEditing = true;
        this.selectedDetailItem = (JSON.parse(JSON.stringify(this.slabDetailList.currentItem)));
        this.selectedDetailItem.effectiveDate = this.slabDetailList.currentItem.effectiveDate;
        this.onLevyTypeChangeEvent(this.selectedItem.chLeviesMaster.levyType == 'P');
    }




    public onUpperRangeChange(maxAmount: Number) {
        if (maxAmount.valueOf() < 0)
            this.maximumAmountError = true;
        else
            this.maximumAmountError = false;

        if (maxAmount.valueOf() <= this.selectedDetailItem.minAmount.valueOf()) {
            this.maxAmountError = true;
            this.minimumGreaterThanMaximumError = true;
        }
        else {
            this.maxAmountError = false;
            this.minimumGreaterThanMaximumError = false;
        }
    }

    public onLowerRangeChange(lowerRange: Number) {
        if (lowerRange.valueOf() < 0 || lowerRange.valueOf() > ClearHouseLeviesPage.lowerRangeMax)
            this.minimumAmountError = true;
        else
            this.minimumAmountError = false;

        if (lowerRange.valueOf() >= this.selectedDetailItem.maxAmount.valueOf()) {
            this.minimumGreaterThanMaximumError = true;
            this.maxAmountError = true;
        }
        else {
            this.minimumGreaterThanMaximumError = false;
            this.maxAmountError = false;
        }
    }
    public onLevyRateChange(LevyRate: Number) {
        if (LevyRate.valueOf() < 0 || LevyRate.valueOf() > this.maxLevyRate)
            this.LevyRateError = true;
        else
            this.LevyRateError = false;
    }

    onEditDetailDelete() {
        if (this.slabDetailList.items.length > 1) {
            this.selectedDetailItem.settlementType = this.settlementTypeList[1];
            this.deleteCurrentItem();
            this.AllowingEdit();
        }
        else {
            this.dialogCmp.statusMsg = 'At least 1 item is required in Clearing House levies.';
            this.dialogCmp.showAlartDialog('Warning');
        }
        //        alert('Atleast 1 item is required in Clearing House levies.');
    }

    public deleteCurrentItem() {
        this.slabDetailList.remove(this.slabDetailList.currentItem);
    }

    public onLevyTypeChangeEvent(_isPercentage: Boolean) {
        this.selectedItem.chLeviesMaster.percentage = _isPercentage;
        if (_isPercentage) {
            this.levyRateLabelModalDisplay = 'Levy Rate (Overall)';
            this.maxLevyRate = 100;
            this.levyRateControl.min = 0;
            // this.levyRateControl.max = 100;
        }
        else {
            this.levyRateLabelModalDisplay = 'Levy Rate (Per Share)';
            this.maxLevyRate = 999999.99999999;
            this.levyRateControl.min = 0;
            // this.levyRateControl.max = 999999.99999999;

        }
        if (this.selectedDetailItem.levyRate.valueOf() < 0 || this.selectedDetailItem.levyRate > this.maxLevyRate) {
            this.LevyRateError = true;
        }
        else {
            this.LevyRateError = false;
        }
    }

    public FinalSave() {
        const ctrl_: FormControl = (<any>this.myForm).controls.settlementType;
        ctrl_.setValidators(null);
        ctrl_.updateValueAndValidity();

        const ctrl: FormControl = (<any>this.myForm).controls.appliesTo;
        ctrl.setValidators(null);
        ctrl.updateValueAndValidity();

        this.finalSaveUpdate = true;
        this.isEditing = false;
    }
    public FinalUpdate() {
        const ctrl_: FormControl = (<any>this.myForm).controls.settlementType;
        ctrl_.setValidators(null);
        ctrl_.updateValueAndValidity();

        const ctrl: FormControl = (<any>this.myForm).controls.appliesTo;
        ctrl.setValidators(null);
        ctrl.updateValueAndValidity();
        this.finalSaveUpdate = true;
    }
    public onSaveAction(model: any, isValid: boolean) {
        if (!this.maxAmountError && !this.LevyRateError &&
            !this.minimumAmountError && !this.minimumGreaterThanMaximumError &&
            !this.maximumAmountError) {

            this.isSubmitted = true;
            if (this.finalSaveUpdate) {
                if (isValid) {
                    this.loader.show();
                    if (this.isEditing) {

                        if (AppUtility.isValidVariable(this.slabDetailList)) {
                            let tempArray: ClearingHouseLeviesDetail[] = [];
                            for (let i = 0; i < this.slabDetailList.items.length; i++) {
                                tempArray[i] = new ClearingHouseLeviesDetail();
                                this.slabDetailList.items[i].chLeviesMaster = (JSON.parse(JSON.stringify(this.selectedItem.chLeviesMaster)));
                                tempArray[i] = this.slabDetailList.items[i];
                            }
                            this.listingService.updateClearingHouseLevis(tempArray).subscribe(
                                data => {
                                    this.loader.hide();
                                    this.slabDetailList.commitEdit();
                                    // this.clearFields(true, true);    //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                                    this.selectedDetailItem.settlementType = this.settlementTypeList[0];
                                    console.log('value cleared.')
                                    if (this.selectedDetailItem.settlementType.settlementTypeId == this.settlementTypeList[0].settlementTypeId) {
                                        this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                                        this.dialogCmp.showAlartDialog('Success');
                                    }
                                    // alert(AppConstants.MSG_RECORD_UPDATED);
                                    this.getClearingHouseLevysList(data.exchange.exchangeId);
                                    if (AppUtility.isValidVariable(this.itemsList))
                                        this.itemsList.refresh();
                                    this.flex.refresh();
                                    // this.hideModal();
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

                                    // alert(this.errorMessage);
                                }
                            );
                        }
                        else {

                        }
                    }
                    else {
                        if (AppUtility.isValidVariable(this.slabDetailList)) {
                            let tempArray: ClearingHouseLeviesDetail[] = [];
                            for (let i = 0; i < this.slabDetailList.items.length; i++) {
                                tempArray[i] = new ClearingHouseLeviesDetail();
                                this.slabDetailList.items[i].chLeviesMaster = (JSON.parse(JSON.stringify(this.selectedItem.chLeviesMaster)));
                                tempArray[i] = this.slabDetailList.items[i];
                            }
                            if (!(AppUtility.isValidVariable(ClearHouseLeviesPage._exchangeid)))
                                ClearHouseLeviesPage._exchangeid = this.selectedItem.chLeviesMaster.exchange.exchangeId;
                            this.listingService.saveClearingHouseLevis(tempArray).subscribe(
                                data => {
                                    this.loader.hide();
                                    // this.clearFields(true, true);    //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                                    this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
                                    this.dialogCmp.showAlartDialog('Success');

                                    // alert(AppConstants.MSG_RECORD_SAVED);
                                    this.getClearingHouseLevysList(data.exchange.exchangeId);
                                    if (AppUtility.isValidVariable(this.itemsList))
                                        this.itemsList.refresh();
                                    AppUtility.moveSelectionToLastItem(this.itemsList);

                                    this.flex.refresh();
                                    // this.hideModal();
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

                                    // alert(this.errorMessage);
                                }
                            );
                            this.selectedDetailItem.settlementType = this.settlementTypeList[0];
                        }
                        else {
                            this.dialogCmp.statusMsg = 'At least 1 item is required in Clearing House Levies.';
                            this.dialogCmp.showAlartDialog('Warning');

                            // alert('Atleast 1 item is required in Clearing House Levies.');
                            this.clearFields(false, true);
                        }
                    }
                }
            }
            else {
                if (isValid) {
                    let b1: boolean = this.addingNew;
                    let b2: boolean = this.isEditing;
                    if (!this.isDetailEditing && !this.maxAmountError && !this.LevyRateError &&
                        !this.minimumAmountError && !this.minimumGreaterThanMaximumError
                        && !this.isNotUnique && !this.maximumAmountError)
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

    private populateSettlementTypeList() {
        this.loader.show();
        this.listingService.getActiveSettlementTypesList()
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.settlementTypeList = restData;
                    let sett: SettlementType = new SettlementType();
                    sett.settlementTypeId = AppConstants.PLEASE_SELECT_VAL;
                    sett.settlementType = AppConstants.PLEASE_SELECT_STR;
                    this.settlementTypeList.unshift(sett);
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }



    /**
     * Getting the Master record for selected Exchange.
     */
    private getClearingHouseLevysList(_exchangeId: Number) {
        debugger
        this.loader.show();
        this.listingService.getClearingHouseLeviesList(_exchangeId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    // Storing the value of Exchange ID initially Selected sort
                    // that the FlexGrid of Page could be refreshed in case of any
                    // testcase failure, like canceling after edit.
                    ClearHouseLeviesPage._exchangeid = _exchangeId;

                    if (AppUtility.isEmptyArray(restData)) {
                        if (AppUtility.isValidVariable(this.itemsList)) {
                            while (!this.itemsList.isEmpty)
                                this.itemsList.removeAt(0);
                            this.flex.refresh();
                        }

                        this.dialogCmp.statusMsg = 'No Clearing House Levies found in this Exchange';
                        this.dialogCmp.showAlartDialog('Notification');

                        // alert('No Clearing House Levies found in this Exchange');

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

    /**
     * Getting the child detail records for the selected master.
     */
    private GetClearHouseLeviesDetail(_chLevyMasterId: Number) {
        this.loader.show();
        this.listingService.getClearingHouseLeviesDetailList(_chLevyMasterId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    // Storing the value of Exchange ID initially Selected sort
                    // that the FlexGrid of Page could be refreshed in case of any
                    // testcase failure, like canceling after edit.
                    // ClearHouseLeviesPage._exchangeid = _exchangeId;

                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                    } else {
                        this.slabDetailList = new wjcCore.CollectionView(restData);
                        this.AllowingEdit();

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
                    this.selectedItem.chLeviesMaster.exchange.exchangeId = this.exchangeNameList[0].exchangeId;
                    this.selectedDetailItem.chLeviesMaster.exchange.exchangeId = this.exchangeNameList[0].exchangeId;
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

    private addFormValidations() {
        let maxLengthLevyRate: number = 8;
        if (!this.selectedItem.chLeviesMaster.percentage)
            maxLengthLevyRate = 12;
        this.myForm = this._fb.group({
            exchangeCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            levyDescription: ['', Validators.compose([Validators.required])],
            exchangeName: ['', Validators.compose([Validators.required])],
            percentage: [''],
            settlementType: ['', Validators.compose([Validators.required])],
            effectiveDate: ['', Validators.compose([Validators.required])],
            levyRate: ['', Validators.compose([Validators.required])],
            minAmount: ['', Validators.compose([Validators.required])],
            maxAmount: ['', Validators.compose([Validators.required])],
            appliesTo: ['', Validators.compose([Validators.required])],
            active: ['']
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
