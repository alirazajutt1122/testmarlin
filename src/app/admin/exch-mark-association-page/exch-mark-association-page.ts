'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EMAssociation } from 'app/models/exch-mark-association';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AppState } from 'app/app.service';
import { ListingService } from 'app/services/listing.service';
import { AuthService2 } from 'app/services/auth2.service';
import { Exchange } from 'app/models/exchange';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Market } from 'app/models/market';
import { OrderQualifiers } from 'app/models/order-qualifiers';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { OrderTypes } from 'app/models/order-types';
import { TifOptions } from 'app/models/tif-options';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';


declare var jQuery: any;

@Component({
  selector: 'exch-mark-association-page',
  templateUrl: './exch-mark-association-page.html',
})

export class EMAssociationPage implements OnInit {

  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: EMAssociation;
  errorMessage: string;

  public hideForm = true;
  public isSubmitted = null;lang: string;
;
  public isEditing = null;

  isTiffEmpty: boolean = false;
  isOrderQualifiersEmpty: boolean = false;
  isOrderTypeEmpty: boolean = false;

  marketList: any[];
  exchangeList: any[];
  orderTypeList: any[];
  orderQualifierList: any[];
  tifOptionList: any[];
  selectedOrderType: any[];
  selectedOrderQualifiers: any[];
  selectedTifOptions: any[];
  selectedIndex: number = 0;
  private _pageSize = 0;
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('tif') tif: wjcInput.MultiSelect;
  @ViewChild('orderQualifiers') orderQualifiers: wjcInput.MultiSelect;
  @ViewChild('orderType') orderType: wjcInput.MultiSelect;
  @ViewChild('exchangeId') exchangeId: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.clearFields();
    this.hideForm = true;
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
    // Populate ExchangeMarketAssociations data..    
    this.populateExchangeMarketAssociationsList();
    this.populateExchangeList();
    this.populateMarketList();
    this.populatOrderTypesList();
    this.populatOrderQualifiersList();
    this.populatTifOptionsList();

    // Add Form Validations
    this.addFromValidations();

  }


  ngAfterViewInit() {

    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.tif.placeholder = "Select";
      self.orderQualifiers.placeholder = 'Select';
      self.orderType.placeholder = 'Select';
      self.orderType.invalidate();
      self.tif.invalidate();
      self.orderQualifiers.invalidate();
      self.exchangeId.focus();
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

    this.isTiffEmpty = false;
    this.isOrderQualifiersEmpty = false;
    this.isOrderTypeEmpty = false;

    this.isSubmitted = false;
    this.isEditing = false;

    this.selectedItem = new EMAssociation();
    this.selectedItem.exchangeMarketId = null;
    this.selectedItem.active = true;

    this.selectedItem.exchange = new Exchange();
    this.selectedItem.exchange.exchangeCode = null;
    this.selectedItem.exchange.exchangeId = null;

    this.selectedItem.market = new Market();
    this.selectedItem.market.marketCode = null;
    this.selectedItem.market.marketId = null;

    if (!AppUtility.isEmptyArray(this.exchangeList)) {
      this.selectedItem.exchange.exchangeCode = this.exchangeList[0].exchangeCode;
      this.selectedItem.exchange.exchangeId = this.exchangeList[0].exchangeId;
    }

    if (!AppUtility.isEmptyArray(this.marketList)) {
      this.selectedItem.market.marketCode = this.marketList[0].marketCode;
      this.selectedItem.market.marketId = this.marketList[0].marketId;
    }

    this.selectedItem.orderTypes = [];
    this.selectedItem.orderQualifiers = [];
    this.selectedItem.orderTifOptions = [];


    if (!AppUtility.isEmpty(this.tifOptionList)) {
      this.unSelectAllItems(this.tifOptionList);
    }
    if (!AppUtility.isEmpty(this.orderQualifierList)) {
      this.unSelectAllItems(this.orderQualifierList);
    }
    if (!AppUtility.isEmpty(this.orderTypeList)) {
      this.unSelectAllItems(this.orderTypeList);
    }

  }

  unSelectAllItems(items) {
    for (let i = 0; i < items.length; i++) {
      items[i].selected = false;
      items[i].$checked = false;
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
    this.orderType.checkedItems = [];
    this.orderQualifiers.checkedItems = [];
   this.tif.checkedItems = [];
    this.tif.placeholder = "Select";
    this.orderQualifiers.placeholder = 'Select';
    this.orderType.placeholder = 'Select';
    this.orderType.invalidate();
    this.tif.invalidate();
    this.orderQualifiers.invalidate();
    this.hideForm = true;
  }

  public onNewAction() {
    this.clearFields();
    this.orderType.checkedItems = [];
    this.orderQualifiers.checkedItems = [];
     this.tif.checkedItems = [];
    this.tif.placeholder = "Select";
    this.orderQualifiers.placeholder = 'Select';
    this.orderType.placeholder = 'Select';
    this.orderType.invalidate();
    this.tif.invalidate();
    this.orderQualifiers.invalidate();
    this.hideForm = false;
  }

  public onSelectionChanged(selectedCell) {
    AppUtility.printConsole("onSelectionChanged is called");
    this.hideForm = true;
  }

  // @ViewChild('tif') tif: wijmo.input.MultiSelect;
  // @ViewChild('orderQualifiers') orderQualifiers: wijmo.input.MultiSelect;
  // @ViewChild('orderType') orderType: wijmo.input.MultiSelect;

  public FinalSave() {
    if (this.tif.checkedItems.length === 0) {
      this.isTiffEmpty = true;
    } else {
      this.isTiffEmpty = false;
    }

    if (this.orderQualifiers.checkedItems.length === 0) {
      this.isOrderQualifiersEmpty = true;
    } else {
      this.isOrderQualifiersEmpty = false;
    }

    if (this.orderType.checkedItems.length === 0) {
      this.isOrderTypeEmpty = true;
    } else {
      this.isOrderTypeEmpty = false;
    }
  }

  public onTiffCheckedEvent(tiffIds: any) {
    if (this.tif.checkedItems.length > 0) this.isTiffEmpty = false;
    else this.isTiffEmpty = true;
  }

  public onOrderQualifierCheckedEvent(tiffIds: any) {
    if (this.orderQualifiers.checkedItems.length > 0) this.isOrderQualifiersEmpty = false;
    else this.isOrderQualifiersEmpty = true;
  }

  public onOrderTypesCheckedEvent(tiffIds: any) {
    if (this.orderQualifiers.checkedItems.length > 0) this.isOrderTypeEmpty = false;
    else this.isOrderTypeEmpty = true;
  }

  public onEditAction() {
    this.clearFields();
     this.orderType.checkedItems = [];
     this.orderQualifiers.checkedItems = [];
     this.tif.checkedItems = [];
  
  
    debugger

    this.selectedIndex = this.flex.selection.row;
    this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.selectedItem)) {
      this.isEditing = true;

      let checkedItems: any[] = [];
      if (this.selectedItem.orderTypes_.length > 0) {
        let selectedItems: any[] = this.selectedItem.orderTypes_.split(',');

        for (let i = 0; i < this.orderTypeList.length; i++) {
          let obj: OrderTypes = this.orderTypeList[i];
          for (let j = 0; j < selectedItems.length; j++) {
            if (obj.code == selectedItems[j]) {
              obj.selected = true;
              this.orderTypeList[i].$checked = true;
              checkedItems.push(obj);
            }
          }
        }
      }

      if (AppUtility.isValidVariable(checkedItems))
        this.selectedItem.orderTypes = checkedItems;
        this.orderType.checkedItems = checkedItems;

      //     if (AppUtility.isValidVariable(this.orderType) && !this.orderType.containsFocus())
      this.orderType.refresh();
      //AppUtility.printConsole("order types::" + this.selectedItem.orderTypes);

      let checkedItemsTif: any[] = [];
      if (this.selectedItem.tifOptions_.length > 0) {
        let selectedItems: any[] = this.selectedItem.tifOptions_.split(',');
        for (let i = 0; i < this.tifOptionList.length; i++) {
          let obj: TifOptions = this.tifOptionList[i];
          for (let j = 0; j < selectedItems.length; j++) {
            if (obj.code == selectedItems[j]) {
              obj.selected = true;
              this.tifOptionList[i].$checked = true;
              checkedItemsTif.push(obj);
            }
          }
        }
      }

      if (AppUtility.isValidVariable(checkedItemsTif))
        this.selectedItem.orderTifOptions = checkedItemsTif;
        this.tif.checkedItems = checkedItemsTif;

      //   if (AppUtility.isValidVariable(this.tif) && !this.tif.containsFocus())
      this.tif.refresh();
      //AppUtility.printConsole("order Tif::" + this.selectedItem.orderTifOptions);

      this.orderQualifiers.placeholder = 'Select';
      let checkedItemsQualifiers: any[] = [];
      if (this.selectedItem.orderQualifiers_.length > 0) {
        let selectedItems: any[] = this.selectedItem.orderQualifiers_.split(',');
        for (let i = 0; i < this.orderQualifierList.length; i++) {
          let obj: OrderQualifiers = this.orderQualifierList[i];
          for (let j = 0; j < selectedItems.length; j++) {
            if (obj.code == selectedItems[j]) {
              obj.selected = true;
              this.orderQualifierList[i].$checked = true;
              checkedItemsQualifiers.push(obj);
            }
          }
        }
      }

      if (AppUtility.isValidVariable(checkedItemsQualifiers))
        this.selectedItem.orderQualifiers = checkedItemsQualifiers;
        this.orderQualifiers.checkedItems = checkedItemsQualifiers;
      //AppUtility.printConsole("order Qualifiers::" + this.selectedItem.orderQualifiers.length);

      //  if (AppUtility.isValidVariable(this.orderQualifiers) && !this.orderQualifiers.containsFocus())
      this.orderQualifiers.refresh();

     
    
     
      this.hideForm = false;
    }
  }


  //   public onEditAction() {
  //     if (!AppUtility.isEmpty(this.itemsList2.currentItem)) {
  //         this.clearFields();
  //         this.isEditing = true;
  //         this.selectedItem = this.itemsList2.currentItem;
  //         this.itemsList2.editItem(this.selectedItem);

  //         if (this.clientList[0].clientCode == 'Select') this.clientList.shift();
  //         let checkedItems: any[] = [];
  //         for (let i: number = 0; i < this.itemsList.items.length; i++) {
  //             if (this.itemsList.items[i].user.userId == this.selectedItem.user.userId) {
  //                 checkedItems.push(this.itemsList.items[i].client);
  //                 let index = this.clientList.map(function (el) {
  //                     return el.clientId;
  //                 }).indexOf(this.itemsList.items[i].client.clientId);
  //                 this.clientList[index].$checked = true;
  //             }
  //         }
  //         this.clients.refresh();
  //     }
  // }

  public onSaveAction(model: any, isValid: boolean) {
   debugger
    this.isSubmitted = true;
    // alert(isValid + ',' + !this.isTiffEmpty + ',' + !this.isOrderQualifiersEmpty + ',' + !this.isOrderTypeEmpty);
    if (isValid && !this.isTiffEmpty && !this.isOrderQualifiersEmpty && !this.isOrderTypeEmpty) {
      this.loader.show();
      if (this.isEditing) {
        this.selectedOrderTypes();
        this.listingService.updateExchangeMarketAssociationList(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            this.fillExchangeMarketAssociationFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
           
            this.itemsList.commitEdit();
            this.flex.invalidate();
            this.populateExchangeMarketAssociationsList();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
            this.errorMessage = err.message;
            this.hideForm = false;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');

          }
        );
      }
      else {
        this.selectedOrderTypes();
        this.listingService.saveExchangeMarketAssociationList(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();
            this.fillExchangeMarketAssociationFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            // Select the newly added item
            AppUtility.moveSelectionToLastItem(this.itemsList);
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');

          },
          err => {
            this.loader.hide();
            this.hideForm = false;
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

  private selectedOrderTypes() {
    this.selectedItem.orderTypes = this.orderType.checkedItems;
    this.selectedItem.orderQualifiers = this.orderQualifiers.checkedItems;
    this.selectedItem.orderTifOptions = this.tif.checkedItems;
  }

  private fillExchangeMarketAssociationFromJson(st: EMAssociation, data: any) {
    if (!AppUtility.isEmpty(data)) {
      st.exchangeMarketId = data.exchangeMarketId;
      st.active = data.active;
      if (AppUtility.isEmpty(st.exchange)) {
        st.exchange = new Exchange();
      }
      st.exchange.exchangeId = data.exchange.exchangeId;
      st.exchange.exchangeCode = data.exchange.exchangeCode;

      if (AppUtility.isEmpty(st.market)) {
        st.market = new Market();
      }
      st.market.marketId = data.market.marketId;
      st.market.marketCode = data.market.marketCode;

      st.tifOptions_ = "";
      for (let selectedTif of this.tif.checkedItems) {
        st.tifOptions_ = selectedTif.code + "," + st.tifOptions_;
      }
      st.tifOptions_ = st.tifOptions_.slice(0, -1);

      st.orderQualifiers_ = "";
      for (let selectedOrderQualifier of this.orderQualifiers.checkedItems) {
        st.orderQualifiers_ = selectedOrderQualifier.code + "," + st.orderQualifiers_;
      }
      st.orderQualifiers_ = st.orderQualifiers_.slice(0, -1);

      st.orderTypes_ = "";
      for (let selectedOrderType of this.orderType.checkedItems) {
        st.orderTypes_ = selectedOrderType.code + "," + st.orderTypes_;
      }
      st.orderTypes_ = st.orderTypes_.slice(0, -1);

    }
  }

  private populateExchangeMarketAssociationsList() {
    this.loader.show();
    this.listingService.getExchangeMarketAssociationList()
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = "No Data Found! "
          } else {
            this.itemsList = new wjcCore.CollectionView(restData);
          }
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
        });
  }


  private populateExchangeList() {
    this.loader.show();
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.exchangeList = restData;

          var exchange: Exchange = new Exchange();
          exchange.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          exchange.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          this.exchangeList.unshift(exchange);

          this.selectedItem.exchange.exchangeId = this.exchangeList[0].exchangeId;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }

  private populateMarketList() {
    this.loader.show();
    this.listingService.getActiveMarketList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.marketList = restData;

          var market: Market = new Market();
          market.marketId = AppConstants.PLEASE_SELECT_VAL;
          market.marketCode = AppConstants.PLEASE_SELECT_STR;
          this.marketList.unshift(market);

          this.selectedItem.market.marketId = this.marketList[0].marketId;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }

  private populatOrderTypesList() {
    this.loader.show();
    this.listingService.getOrderTypesList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.orderTypeList = restData;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }

  private populatOrderQualifiersList() {
    this.loader.show();
    this.listingService.getOrderQualifiersList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.orderQualifierList = restData;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }

  private populatTifOptionsList() {
    this.loader.show();
    this.listingService.getTifOptionsList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.tifOptionList = restData;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }

  private getSelectedOrderTypesList(exchangeId: Number, marketId: Number) {
    this.listingService.getOrderTypesByExchangeMarket(exchangeId, marketId)
      .subscribe(
        restData => {
          this.selectedOrderType = restData;
        },
        error => this.errorMessage = <any>error.message);
  }

  private getSelectedOrderQualifiersList(exchangeId: Number, marketId: Number) {
    this.listingService.getOrderQualifiersByExchangeMarket(exchangeId, marketId)
      .subscribe(
        restData => {
          this.selectedOrderQualifiers = restData;
        },
        error => this.errorMessage = <any>error.message);
  }

  private getSelectedTifOptionsList(exchangeId: Number, marketId: Number) {
    this.listingService.getTifOptionsByExchangeMarket(exchangeId, marketId)
      .subscribe(
        restData => {
          this.selectedTifOptions = restData;
        },
        error => this.errorMessage = <any>error.message);
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      exchangeId: ['', Validators.compose([Validators.required])],
      marketId: ['', Validators.compose([Validators.required])],
      tif: [''],
      orderType: [''],
      orderQualifiers: [''],
      active: [''],
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }
}