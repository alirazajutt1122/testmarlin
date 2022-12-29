'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { City } from 'app/models/city';
import { Country } from 'app/models/country';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';


declare var jQuery: any;

@Component({

  selector: 'city-page',
  templateUrl:'./city-page.html',
})

export class CityPage implements OnInit {

  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: City;
  countryList: any[];
  errorMessage: string;

  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  selectedIndex: number = 0;
  private _pageSize = 0;
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('countryId') countryId: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2,
    private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.clearFields();
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
    //this.claims = authService.claims;
  }

  ngOnInit() {
    // Populate Cities data..    
    this.populateCitiesList();
    
    this.populateCountryList();
    // Add Form Validations
    this.addFromValidations();

  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.countryId.focus();
    });
  }

  public hideModal() {
    jQuery("#add_new").modal("hide");   //hiding the modal on save/updating the record
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

    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;

    this.selectedItem = new City();
    this.selectedItem.cityCode = '';
    this.selectedItem.cityId = null;
    this.selectedItem.cityName = '';

    this.selectedItem.country = new Country();
    this.selectedItem.country.countryId = null;

    if (!AppUtility.isEmptyArray(this.countryList)) {
      this.selectedItem.country.countryName = this.countryList[0].countryName;
      this.selectedItem.country.countryId = this.countryList[0].countryId;
    }
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
  }

  public onNewAction() {
    this.clearFields();
    this.hideForm = true;
    //
  }

  public onEditAction() {
    this.clearFields();
    this.selectedIndex = this.flex.selection.row;
    this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.selectedItem)) {
      this.hideForm = true;
      this.isEditing = true;
      //this.populateCountryList();
      //this.selectedItem = this.itemsList.currentItem;
      //this.itemsList.editItem(this.selectedItem);

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

          this.selectedItem.country.countryId = this.countryList[0].countryId;
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

  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      this.loader.show();
      if (this.isEditing) {
        this.listingService.updateCity(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            //      this.itemsList.editItem(this.selectedItem);
            console.log("update>>>>>" + data);
            this.fillCityFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();
            // this.clearFields();  //  Defect id: 606 @ 28/Mar/2017 - AiK
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
        this.listingService.saveCity(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();
            this.fillCityFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            AppUtility.moveSelectionToLastItem(this.itemsList);
            console.log(data);
            // this.clearFields();  //  Defect id: 606 @ 28/Mar/2017 - AiK
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

  private fillCityFromJson(st: City, data: any) {
    if (!AppUtility.isEmpty(data)) {
      st.cityCode = data.cityCode;
      st.cityName = data.cityName;
      st.cityId = data.cityId;
      st.country = new Country();
      st.country.countryId = data.country.countryId;
      st.country.countryName = data.country.countryName;
    }
  }

  private populateCitiesList() {
    this.loader.show();
    this.listingService.getCityList()
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
          this.loader.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
        });
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      cityCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      cityName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      countryId: ['', Validators.compose([Validators.required])],
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }
}