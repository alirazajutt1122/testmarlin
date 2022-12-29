'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';

import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { BankBranch } from 'app/models/bank-branches';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { Bank } from 'app/models/bank';
import { ContactDetail } from 'app/models/contact-detail';
import { Country } from 'app/models/country';
import { City } from 'app/models/city';
import { IPagedCollectionView, } from '@grapecity/wijmo';
declare var jQuery: any;

@Component({
  selector: 'bank-branch-page',
  templateUrl: './bank-branches-page.html',
})

export class BankBranchPage implements OnInit {

  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: BankBranch;
  bankList: any[];
  countryList: any[];
  cityList: any[];
  errorMessage: string;
  //claims: any;
  public cityId: number
  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  selectedIndex: number = 0;

  private _pageSize = 0;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('cmbCityId') cmbCityId: wjcInput.ComboBox;
  @ViewChild('bankId') bankId: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;
  city: any;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.clearFields();
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    //this.claims = authService.claims;
    //_______________________________for ngx_translate_________________________________________
    this.lang = localStorage.getItem("lang");
    if (this.lang == null || typeof this.lang == 'undefined') {
      this.lang = 'en'
    }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }

  ngOnInit() {

    jQuery('.parsleyjs').parsley();
    // Populate Branches data in felx grid.    
    this.populateBankBranchsList(AppConstants.participantId);

    // Populate Bank List in DropDown.
    this.populateBankList(AppConstants.participantId, true);

    // Populate country combo
    this.populateCountryList();

    // Add Form Validations
    this.addFormValidations();
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      if (self.cityList.length > 1) {
        self.selectedItem.contactDetail.cityId = self.cityId;
      }
      self.bankId.focus();
    });
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
    this.isEditing = false;

    this.cityId = null;

    this.selectedItem = new BankBranch();
    this.selectedItem.active = true;
    this.selectedItem.bankBranchCode = '';
    this.selectedItem.bankBranchId = null;
    this.selectedItem.branchName = '';
    this.selectedItem.bank = new Bank();
    if (!AppUtility.isEmptyArray(this.bankList)) {
      this.selectedItem.bank.bankName = this.bankList[0].bankName;
      this.selectedItem.bank.bankId = this.bankList[0].bankId;
      this.selectedItem.bank.displayName_ = this.bankList[0].displayName_;
    }

    this.selectedItem.contactDetail = new ContactDetail();
    if (!AppUtility.isEmptyArray(this.countryList)) {
      this.selectedItem.contactDetail.country = this.countryList[0].countryName;
      this.selectedItem.contactDetail.countryId = this.countryList[0].countryId;
    }

    if (!AppUtility.isEmptyArray(this.cityList)) {
      this.selectedItem.contactDetail.city = this.cityList[0].city;
      this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
    }
    this.selectedItem.contactDetail.address1 = '';
    this.selectedItem.contactDetail.postalCode = '';
    this.selectedItem.contactDetail.phone1 = '';
    this.selectedItem.contactDetail.cellNo = '';
    this.selectedItem.contactDetail.email = '';
    this.isSubmitted = false;
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
    this.hideForm = false;
  }

  public onNewAction() {
    this.clearFields();
    this.hideForm = true;
  }

  public onEditAction() {
    this.clearFields();
    this.selectedIndex = this.flex.selection.row;
    this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.selectedItem)) {
      this.hideForm = true;
      this.isEditing = true;
      // this.selectedItem = this.itemsList.currentItem;
      // this.itemsList.editItem(this.selectedItem);
      // debugger
      this.cityId = this.selectedItem.contactDetail.cityId.valueOf();
      this.city = this.selectedItem.contactDetail.city.valueOf();

      this.populateCityListByCountry(this.selectedItem.contactDetail.countryId);
      // this.selectedItem.contactDetail.cityId = this.cityId;
      this.cmbCityId.invalidate();

    }
  }


  public hideModal() {
    jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  }

  public onCountryChangeEvent(slectedCountryId): void {
    this.populateCityListByCountry(slectedCountryId);
  }
  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      this.loader.show();
      if (this.isEditing) {
        this.listingService.updateBankBranch(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            this.fillBankBranchFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();
            // this.clearFields();
            this.flex.invalidate();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
            // this.flex.refresh();
          },
          err => {
            this.loader.hide();
            this.errorMessage = err.message;
            this.hideForm = true;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
      else {
        this.listingService.saveBankBranch(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();

            this.fillBankBranchFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            // Select the newly added item
            AppUtility.moveSelectionToLastItem(this.itemsList);

            console.log(data);
            // this.clearFields();          
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
            this.hideForm = true;
            this.errorMessage = err.message;
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

  private fillBankBranchFromJson(bb: BankBranch, data: any) {
    if (!AppUtility.isEmpty(data)) {
      debugger
      bb.bankBranchCode = data.bankBranchCode;
      bb.bankBranchId = data.bankBranchId;
      bb.branchName = data.branchName;
      bb.active = data.active;
      bb.bank = new Bank();
      bb.bank.bankId = data.bank.bankId;
      bb.bank.bankName = data.bank.bankName;
      bb.bank.displayName_ = data.bank.displayName_;
      bb.contactDetail = new ContactDetail();
      bb.contactDetail.contactDetailId = data.contactDetail.contactDetailId;
      bb.contactDetail.country = data.contactDetail.country;
      bb.contactDetail.city = data.contactDetail.city;
      bb.contactDetail.countryId = data.contactDetail.countryId;
      bb.contactDetail.cityId = data.contactDetail.cityId;
      bb.contactDetail.address1 = data.contactDetail.address1;
      bb.contactDetail.postalCode = data.contactDetail.postalCode;
      bb.contactDetail.phone1 = data.contactDetail.phone1;
      bb.contactDetail.cellNo = data.contactDetail.cellNo;
      bb.contactDetail.email = data.contactDetail.email;

    }
  }

  private populateBankBranchsList(_participantid: Number) {
    this.loader.show();
    this.listingService.getBankBranchList(_participantid, false)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            //this.itemsList = null;
          } else {
            this.itemsList = new wjcCore.CollectionView(restData);
          }
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
        });
  }

  private populateBankList(_participantid: Number, _active: Boolean) {
    this.loader.show();
    this.listingService.getBanksList(_participantid, _active)
      .subscribe(
        restData => {
          this.loader.hide();
          this.bankList = restData;

          let bank: Bank = new Bank();
          bank.bankId = AppConstants.PLEASE_SELECT_VAL;
          bank.displayName_ = AppConstants.PLEASE_SELECT_STR;
          this.bankList.unshift(bank);

          this.selectedItem.bank.bankId = this.bankList[0].bankId;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
        });
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
          this.selectedItem.contactDetail.country = this.countryList[0].countryName;
          if (this.countryList[0].countryId != null)
            this.populateCityListByCountry(this.countryList[0].countryId);
        },
        error => {
          this.loader.hide(); this.errorMessage = <any>error.message
            , () => {
            }
        });
  }

  private populateCityListByCountry(countryId: Number) {
    let city: City = new City();
    let cityy: City = new City();
    city.cityId = AppConstants.PLEASE_SELECT_VAL;
    city.cityName = AppConstants.PLEASE_SELECT_STR;

    const cityCombo: FormControl = (<any>this.myForm).controls.cityId;
    if (AppUtility.isEmpty(countryId)) {
      this.cityList = [];
      this.cityList.unshift(city);
      cityCombo.reset();
    } else {
      this.listingService.getCityListByCountry(countryId)
        .subscribe(
          restData => {
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
                else if (this.isEditing) {
                  debugger
                  cityy.cityId = this.cityId
                  cityy.cityName = this.city
                  this.selectedItem.contactDetail.cityId = this.cityId
                  this.selectedItem.contactDetail.city = this.city
                }
              }

            }
            if (this.isEditing) {
              // this.cityList.unshift(cityy);
              const fromIndex = this.cityList.indexOf(this.cityId); // 👉️ 0
              const toIndex = 0;

              const element = this.cityList.splice(fromIndex, 1)[0];
              console.log(element); // ['css']

              this.cityList.splice(toIndex, 0, element);
            }
            else
              this.cityList.unshift(city);
          },
          error => { this.errorMessage = <any>error.message; },
          () => {
            cityCombo.reset();
          }
        );
    }
  }

  private addFormValidations() {
    this.myForm = this._fb.group({
      bankId: ['', Validators.compose([Validators.required])],
      branchName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      bankBranchCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      active: [''],
      countryId: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      postalCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternStringPostalCode)])],
      phone1: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)])],
      cellNo: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternNumeric)])],
      email: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternEmail)])]
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }

}