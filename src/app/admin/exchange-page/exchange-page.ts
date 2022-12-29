'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { City } from 'app/models/city';
import { ContactDetail } from 'app/models/contact-detail';
import { Country } from 'app/models/country';
import { Exchange } from 'app/models/exchange';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';


declare var jQuery: any;
@Component({
  selector: 'exchange-page',
  templateUrl:'./exchange-page.html',
})

export class ExchangePage implements OnInit {

  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: Exchange;

  errorMessage: string;

  countryList: any[];
  cityList: any[];
  bondPricingMechanismList: any[];
  bondPricingModelList: any[];

  public cityId: number
  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;

  selectedIndex: number = 0;

  private _pageSize = 0;
  //claims: any;

  @ViewChild('flex', { static: false }) flex: wjcGrid.FlexGrid;
  @ViewChild('cmbCityId', { static: false }) cmbCityId: wjcInput.ComboBox;
  @ViewChild('exchangeName', { static: false }) exchangeName: wjcInput.InputMask;
  @ViewChild('dialogCmp', { static: false }) dialogCmp: DialogCmp;
  lang: any;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.clearFields();
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    //this.claims = authService.claims;
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }

  public clearFields() {

    this.cityId = null;


    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.itemsList)) {
      this.itemsList.cancelEdit();
      this.itemsList.cancelNew();
    }
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;

    this.selectedItem = new Exchange();
    this.selectedItem.contactDetail = new ContactDetail();
    this.selectedItem.exchangeCode = "";
    this.selectedItem.exchangeId = null;
    this.selectedItem.exchangeName = "";
    this.selectedItem.bondPricingMechanism = null;
    this.selectedItem.bondPricingModel = null;

    if (!AppUtility.isEmptyArray(this.countryList)) {
      this.selectedItem.contactDetail.country = this.countryList[0].country;
      this.selectedItem.contactDetail.countryId = this.countryList[0].countryId;
    }

    this.cityList = [];
    if (!this.isEditing) {
      var city: City = new City();
      city.cityId = AppConstants.PLEASE_SELECT_VAL;
      city.cityName = AppConstants.PLEASE_SELECT_STR;
      this.cityList.push(city);
      this.selectedItem.contactDetail.cityId = null;
    }

    this.selectedItem.contactDetail.postalCode = "";
    this.selectedItem.contactDetail.address1 = "";
  }

  public hideModal() {
    jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  }

  ngOnInit() {

    // Populate exchange Listing.    
    this.populateExchangeList();
    // Populate country combo
    this.populateCountryList();

    this.bondPricingMechanismList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL },
    { "name": "Absolute", "code": 1 }, { "name": "Percentage", "code": 2 }]

    this.bondPricingModelList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL },
    { "name": "Clean", "code": 1 }, { "name": "Dirty", "code": 2 }]

    // Add form Validations
    this.addFromValidations();
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      if (self.cityList.length > 1) {
        self.selectedItem.contactDetail.cityId = self.cityId;
      }
      self.exchangeName.focus();
      (<any>self.myForm).controls.cityId.markAsPristine();
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
    this.clearFields();
    this.hideForm = false;
  }

  public onNewAction() {
    this.clearFields();
    this.selectedItem.contactDetail.cityId = null;
    (<any>this.myForm).controls.cityId.markAsPristine();
    this.hideForm = true;
  }

  public onEditAction() {
    this.clearFields();
    this.selectedIndex = this.flex.selection.row;
    this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.selectedItem)) {
      this.isEditing = true;
      this.cityId = this.selectedItem.contactDetail.cityId.valueOf();

      this.populateCityListByCountry(this.selectedItem.contactDetail.countryId);
      AppUtility.printConsole("City Id:: " + this.selectedItem.contactDetail.cityId);
      this.selectedItem.contactDetail.cityId = this.cityId;
      this.hideForm = true;
      this.cmbCityId.invalidate();

    }
  }

  public onCountryChangeEvent(slectedCountryId): void {
    this.populateCityListByCountry(slectedCountryId);
  }

  public onSaveAction(model: any, isValid: boolean) {

    this.isSubmitted = true;

    if (isValid) {
      this.loader.show();
      if (this.isEditing) {
        this.listingService.updateExchange(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            this.fillExchangeFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();

            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.flex.invalidate();
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
            this.hideForm = true;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');

          }
        );
      }
      else {
        this.listingService.saveExchange(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();
            this.fillExchangeFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            // Select the newly added item
            AppUtility.moveSelectionToLastItem(this.itemsList);

            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
            this.hideForm = true;
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

  private fillExchangeFromJson(ex: Exchange, data: any) {
    if (!AppUtility.isEmpty(data)) {
      ex.exchangeId = data.exchangeId;
      ex.exchangeName = data.exchangeName;
      ex.exchangeCode = data.exchangeCode;
      ex.contactDetail = new ContactDetail();
      ex.contactDetail.contactDetailId = data.contactDetail.contactDetailId;
      ex.contactDetail.country = data.contactDetail.country;
      ex.contactDetail.countryId = data.contactDetail.countryId;
      ex.contactDetail.city = data.contactDetail.city;
      ex.contactDetail.cityId = data.contactDetail.cityId;
      ex.contactDetail.address1 = data.contactDetail.address1;
      ex.contactDetail.postalCode = data.contactDetail.postalCode;
      ex.bondPricingMechanism = (data.bondPricingMechanism);
      ex.bondPricingModel = data.bondPricingModel;
    }
  }

  private populateCountryList() {
    this.loader.show();
    this.listingService.getCountryList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.countryList = restData;

          var country: Country = new Country();
          country.countryId = AppConstants.PLEASE_SELECT_VAL;
          country.countryName = AppConstants.PLEASE_SELECT_STR;
          this.countryList.unshift(country);

          this.selectedItem.contactDetail.countryId = this.countryList[0].countryId;
          if (this.countryList[0].countryId != null)
            this.populateCityListByCountry(this.countryList[0].countryId);
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
  private populateExchangeList() {
    this.loader.show();
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            this.itemsList = new wjcCore.CollectionView(restData);
          }
        },
        err => {
          this.loader.show();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }

  private populateCityListByCountry(countryId: Number) {
    
    var city: City = new City();
    city.cityId = AppConstants.PLEASE_SELECT_VAL;
    city.cityName = AppConstants.PLEASE_SELECT_STR;

    const cityCombo: FormControl = (<any>this.myForm).controls.cityId;
    if (AppUtility.isEmpty(countryId)) {
    } else {
      this.listingService.getCityListByCountry(countryId)
        .subscribe(
          restData => {
            if (AppUtility.isEmpty(restData)) {
              if (!this.isEditing) {
                this.cityList = [];
              }
            }
            else {
              this.cityList = restData;
            }

            this.cityList.unshift(city);
            if (this.isEditing) {
              setTimeout(() => {
                this.selectedItem.contactDetail.cityId = this.cityId;
              }, 250);
            
              this.cmbCityId.refresh();
            }
          },
          err => {
            if(err.message){
              this.errorMessage = err.message;
            }
            else {
              this.errorMessage = err;
            }
          },
          () => {
            cityCombo.reset();
          }
        );
    }

  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      exchangeCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      exchangeName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      countryId: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      postalCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      bondPricingMechanism: ['', Validators.compose([Validators.required])],
      bondPricingModel: ['', Validators.compose([Validators.required])],
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }
}