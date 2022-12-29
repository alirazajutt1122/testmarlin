'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { Registrar } from 'app/models/registrar';
import { ContactDetail } from 'app/models/contact-detail';
import { City } from 'app/models/city';
import { Country } from 'app/models/country';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
declare var jQuery: any;

@Component({
  selector: 'registrar-page',
  templateUrl: './registrar-page.html',
})

export class RegistrarPage implements OnInit {
  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: Registrar;

  errorMessage: string;

  countryList: any[];
  cityList: any[];
  public cityId: number
  selectedIndex: number = 0;

  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  public isRegistrarIssuer : string = 'true';

  private _pageSize = 0;
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('cmbCityId') cmbCityId: wjcInput.ComboBox;
  @ViewChild('name') name: wjcInput.InputMask;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2
    , private translate: TranslateService, private loader: FuseLoaderScreenService) {
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

    this.selectedItem = new Registrar();
    this.selectedItem.contactDetail = new ContactDetail();
    this.selectedItem.registrarCode = "";
    this.selectedItem.registrarId = null;
    this.selectedItem.name = "";
    this.selectedItem.active = true;

    if (!AppUtility.isEmptyArray(this.countryList)) {
      this.selectedItem.contactDetail.country = this.countryList[0].country;
      this.selectedItem.contactDetail.countryId = this.countryList[0].countryId;
    }

    if (!AppUtility.isEmptyArray(this.cityList)) {
      this.selectedItem.contactDetail.city = this.cityList[0].city;
      this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
    }
    this.selectedItem.contactDetail.postalCode = "";
    this.selectedItem.contactDetail.address1 = "";
    this.selectedItem.contactDetail.phone1 = "";
    this.selectedItem.contactDetail.cellNo = "";
    this.selectedItem.contactDetail.email = "";
  }

  public hideModal() {
    jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  }

  ngOnInit() {

    // Populate registrar Listing.    
    this.populateregistrarList();
    // Populate country combo
    this.populateCountryList();
    // Add form Validations
    this.addFromValidations();
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      if (self.cityList.length > 1) {
        self.selectedItem.contactDetail.cityId = self.cityId;
      }
      self.name.focus();
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
    this.hideForm = true;
  }

  public onEditAction() {
    debugger
    this.clearFields();
    this.selectedIndex = this.flex.selection.row;
    this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.selectedItem)) {
      this.isEditing = true;
      this.cityId = this.selectedItem.contactDetail.cityId.valueOf();
      this.populateCityListByCountry(this.selectedItem.contactDetail.countryId);
      this.selectedItem.contactDetail.cityId = this.cityId;

      if(AppUtility.isValidVariable(this.selectedItem.isRegistrar)){
        let a = this.selectedItem.isRegistrar.valueOf();
        if(a === true || a === null) {
         this.isRegistrarIssuer = 'true';
       }
       else{
         this.isRegistrarIssuer = 'false';
       }
      }
      else{
        this.isRegistrarIssuer = 'true';
      }
     

      this.hideForm = true;
      this.cmbCityId.invalidate();

    }
  }




 public changeRegistrarIssuer=(event)=>{
  if(event.target.value === 'true'){
     this.selectedItem.isRegistrar = true;
  }
  else {
    this.selectedItem.isRegistrar = false;
  }
           
 }







  public onCountryChangeEvent(slectedCountryId): void {
    this.populateCityListByCountry(slectedCountryId);
  }

  public onSaveAction(model: any, isValid: boolean) {
    debugger
    this.isSubmitted = true;

    if (isValid) {
      this.loader.show();
      if (this.isEditing) {
        this.listingService.updateRegistrar(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            this.fillregistrarFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();
            this.flex.invalidate();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
          },
          error => {
            this.loader.hide();
            this.hideForm = true;
            if(error.message){
              this.errorMessage = error.message;
            }
            else{
              this.errorMessage = error;
            }
            this.hideForm = true;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
      else {
        this.listingService.saveRegistrar(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();
            this.fillregistrarFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            AppUtility.moveSelectionToLastItem(this.itemsList);
          
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          error => {
            this.loader.hide();
            this.hideForm = true;
            if(error.message){
              this.errorMessage = error.message;
            }
            else{
              this.errorMessage = error;
            }
            this.errorMessage = error.message;
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

  private fillregistrarFromJson(ex: Registrar, data: any) {
    debugger
    if (!AppUtility.isEmpty(data)) {
      ex.registrarId = data.registrarId;
      ex.name = data.name;
      ex.active = data.active;
      ex.registrarCode = data.registrarCode;
      ex.contactDetail = new ContactDetail();
      ex.contactDetail.contactDetailId = data.contactDetail.contactDetailId;
      ex.contactDetail.country = data.contactDetail.country;
      ex.contactDetail.countryId = data.contactDetail.countryId;
      ex.contactDetail.city = data.contactDetail.city;
      ex.contactDetail.cityId = data.contactDetail.cityId;
      this.cityId = data.contactDetail.cityId;
      ex.contactDetail.address1 = data.contactDetail.address1;
      ex.contactDetail.postalCode = data.contactDetail.postalCode;
      ex.contactDetail.phone1 = data.contactDetail.phone1;
      ex.contactDetail.cellNo = data.contactDetail.cellNo;
      ex.contactDetail.email = data.contactDetail.email;
     debugger
      if(data.isRegistrar === true) {
        this.isRegistrarIssuer = 'true';
      }
      else{
        this.isRegistrarIssuer = 'false';
      }
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
        error => {
          this.loader.show();
          if(error.message){
            this.errorMessage = error.message;
          }
          else{
            this.errorMessage = error;
          }
        });
  }
  private populateregistrarList() {
    this.loader.show();
    this.listingService.getRegistrarList()
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
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
        });
  }

  private populateCityListByCountry(countryId: Number) {
    let city: City = new City();
    city.cityId = AppConstants.PLEASE_SELECT_VAL;
    city.cityName = AppConstants.PLEASE_SELECT_STR;

    const cityCombo: FormControl = (<any>this.myForm).controls.cityId;
    if (AppUtility.isEmpty(countryId)) {
      this.cityList = [];
      this.cityList.unshift(city);
      cityCombo.reset();
    } else {
      this.loader.show();
      this.listingService.getCityListByCountry(countryId)
        .subscribe(
          restData => {
            this.loader.hide();
            if (AppUtility.isEmpty(restData)) {
              this.cityList = [];
              this.selectedItem.contactDetail.cityId = null;
              this.selectedItem.contactDetail.city = null;
            }
            else {
              this.cityList = restData;
              if (!AppUtility.isEmptyArray(this.cityList)) {
                if (!this.isEditing) {
                  this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
                  this.selectedItem.contactDetail.city = this.cityList[0].cityName;
                }
                else{
                  setTimeout(() => {
                    this.selectedItem.contactDetail.cityId = this.cityId;
                  }, 250);
                }
              }
              

            }
            this.cityList.unshift(city);
          },
          error => { this.loader.show(); this.errorMessage = <any>error.message; },
          () => {
            cityCombo.reset();
          }
        );
    }
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      registrarCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      name: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      countryId: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      postalCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternStringPostalCode)])],
      phone1: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternNumeric)])],
      email: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternEmail)])],
      active: [''],
      isRegistrar : [''],
      cellNo: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternNumeric)])],
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }
}