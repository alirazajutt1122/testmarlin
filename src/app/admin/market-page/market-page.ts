'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Market } from 'app/models/market';
import { MarketType } from 'app/models/market-type';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';



declare var jQuery: any;

@Component({
  selector: 'market-page',
  templateUrl: './market-page.html',
})

export class MarketPage implements OnInit {

  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: Market;

  errorMessage: string;

  marketTypeList: any[];
  baseMarketsList: any[];

  public showForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  selectedIndex: number = 0;
  private _pageSize = 0;
  public baseMarketId: number
  //claims: any;

  @ViewChild('flex', { static: false }) flex: wjcGrid.FlexGrid;
  @ViewChild('cmbbaseMarketId', { static: false }) cmbbaseMarketId: wjcInput.ComboBox;
  @ViewChild('mktTypeId', { static: false }) mktTypeId: wjcInput.ComboBox;
  @ViewChild('dialogCmp', { static: false }) dialogCmp: DialogCmp;
  lang: string;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.clearFields();
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    //this.claims = authService.claims;
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
    // Populate market data..    
    this.populateMarketDetailList();

    // Poppulate Market Type List
    this.populateMarketTypeList();

    // Poppulate Base Markets
    this.populateBaseMarketList();

    // Add form Validations
    this.addFromValidations();
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.selectedItem.baseMarketId = self.baseMarketId;
      self.mktTypeId.focus();
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
    this.showForm = false;
  }

  public onNewAction() {
    this.populateBaseMarketList();
    this.baseMarketId = null;
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
      this.baseMarketId = null;
      // this.baseMarketId = this.selectedItem.baseMarketId.valueOf();
      this.populateBaseMarketList();
      this.selectedItem.baseMarketId = this.baseMarketId;
      this.cmbbaseMarketId.invalidate();
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

    this.selectedItem = new Market();
    this.selectedItem.marketCode = "";
    this.selectedItem.marketId = null;
    this.selectedItem.marketDesc = "";
    this.selectedItem.active = true;

    this.selectedItem.base = true;
    this.selectedItem.marketType = new MarketType();

    this.selectedItem.marketType.mktTypeId = null;
    this.selectedItem.baseMarketId = null;

    if (!AppUtility.isEmptyArray(this.marketTypeList)) {
      this.selectedItem.marketType.description = this.marketTypeList[0].description;
      this.selectedItem.marketType.mktTypeId = this.marketTypeList[0].mktTypeId;
    }
  }


  onIsBaseChangeEvent() {
    const ctrl: FormControl = (<any>this.myForm).controls.baseMarketId;

    if (this.selectedItem.base) {
      ctrl.setValidators(null);
      ctrl.updateValueAndValidity();
    } else {
      ctrl.setValidators(Validators.required);
      ctrl.updateValueAndValidity();
      ctrl.reset();
    }

  }

  /***
   * Save / Update Action
   */
  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;

    if (isValid) {
      if (this.selectedItem.base == false) {
        if (AppUtility.isEmpty(this.selectedItem.baseMarketId)) {
          this.dialogCmp.statusMsg = 'Please select base Market.';
          this.dialogCmp.showAlartDialog('Error');
          return;
        }
      }
      this.loader.show();
      if (this.isEditing) {
        this.listingService.updateMarket(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            this.fillMarketFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();
            //this.itemsList.refresh();
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.flex.invalidate();

            this.selectedItem.baseMarketId = data.baseMarketId;
            this.selectedItem.marketType.description = data.marketType.description;
            // this.populateBaseMarketList();
            // console.log(this.baseMarketsList);
            // var mk: Market = new Market();
            // mk.marketId = data.baseMarketId;
            // mk.marketCode = data.marketType.description;
            this.baseMarketsList.unshift(data);

            // console.log(this.selectedItem);

            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
            this.dialogCmp.statusMsg = err.message;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
      else {
        delete this.selectedItem.marketId
        this.listingService.saveMarket(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();
            this.fillMarketFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            // Select the newly added item
            AppUtility.moveSelectionToLastItem(this.itemsList);
            // this.populateBaseMarketList();
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            // console.log(this.baseMarketsList);
            // var mk: Market = new Market();
            // mk.marketId = data.baseMarketId;
            // mk.marketCode = data.marketType.description;
            this.baseMarketsList.unshift(data);

            // console.log(this.selectedItem);

            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
            this.dialogCmp.statusMsg = err.message;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
    }
  }


  /***************************************
   *          Private Methods
   **************************************/
  private fillMarketFromJson(m: Market, data: any) {
    m.marketCode = data.marketCode;
    m.marketId = data.marketId;
    m.marketDesc = data.marketDesc;
    m.active = data.active;

    m.base = data.base;
    m.marketType = new MarketType();

    m.marketType.mktTypeId = data.marketType.mktTypeId;
    m.marketType.description = data.marketType.description;
    m.baseMarketId = data.baseMarketId;

  }

  private populateBaseMarketList() {
    this.loader.show();
    this.listingService.getAllBaseMarketList()
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmpty(restData)) {
            this.baseMarketsList = [];
            this.selectedItem.baseMarketId = null;
          }
          else {
            this.baseMarketsList = restData;
            // if (!AppUtility.isEmptyArray(this.baseMarketsList)) {
            //   this.selectedItem.baseMarketId = this.baseMarketsList[0].marketId;
            // }
          }
          var mk: Market = new Market();
          mk.marketId = AppConstants.PLEASE_SELECT_VAL;
          mk.marketCode = AppConstants.PLEASE_SELECT_STR;
          this.baseMarketsList.unshift(mk);
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
        }
      );
  }


  private populateMarketDetailList() {
    this.loader.show();
    this.listingService.getMarketList()
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

  private populateMarketTypeList() {
    this.loader.show();
    this.listingService.getMarketTypeList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.marketTypeList = restData;
          var mktType: MarketType = new MarketType();
          mktType.mktTypeId = AppConstants.PLEASE_SELECT_VAL;
          mktType.description = AppConstants.PLEASE_SELECT_STR;
          this.marketTypeList.unshift(mktType);

          this.selectedItem.marketType.mktTypeId = this.marketTypeList[0].mktTypeId;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      marketCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      marketDesc: [''],
      active: [''],
      base: [''],
      mktTypeId: ['', Validators.compose([Validators.required])],
      baseMarketId: ['', Validators.compose([Validators.required])]
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success') {
      this.onNewAction();
      this.hideModal();
    }
  }

}