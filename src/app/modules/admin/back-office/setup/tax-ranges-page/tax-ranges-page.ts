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

import { IPagedCollectionView, } from '@grapecity/wijmo';
import { DialogCmp } from '../../user-site/dialog/dialog.component';

import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TaxRanges } from 'app/models/tax-range';
import { Exchange } from 'app/models/exchange';

declare var jQuery: any;

@Component({

  selector: 'tax-ranges-page',
  templateUrl: './tax-ranges-page.html',
})
export class TaxRangesPage implements OnInit {

  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: TaxRanges;
  errorMessage: string;
  //claims: any;
  selectedIndex: number = 0;
  exchangeNameList: any[];
  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  exchangeId: number;
  private _pageSize = 0;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;
  exchangeCode: String;


  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService, private loader: FuseLoaderScreenService) {
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

  public hideModal() {
    jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  }


  ngOnInit() {
    // Add Form Validations
    this.addFromValidations();
    // Populate exchangesList in DropDown in search option.
    this.populateExchangeList();

    this.populateTaxRangesList();
  }

  ngAfterViewInit() {

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
    this.exchangeId = null
    this.exchangeCode = ""
    this.selectedItem = new TaxRanges();
    this.selectedItem.exchange = new Exchange;
    this.selectedItem.fromYear = null;
    this.selectedItem.toYear = null;
    this.selectedItem.percentage = null;

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


  private populateTaxRangesList() {
    this.loader.show();
    
    this.listingService.getTaxRangesList()
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
          this.errorMessage = <any>error.message;
        });
  }

  public onCancelAction() {
    this.clearFields();
    this.hideForm = false;
  }

  public onNewAction() {
    this.clearFields();
    this.selectedItem.exchange.exchangeId = (AppConstants.exchangeId === null) ? this.exchangeNameList[0].exchangeId : AppConstants.exchangeId;
    // this.selectedItem.exchange.exchangeId = this.exchangeId
    this.hideForm = true;
  }

  public onEditAction() {
    this.clearFields();
     
    this.selectedIndex = this.flex.selection.row;
    this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.selectedItem)) {
      this.isEditing = true;
      this.selectedItem.percentage = this.itemsList.currentItem.percentage;
      this.itemsList.editItem(this.selectedItem);
  }
  }

  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    // this.selectedItem.exchange.exchangeId = this.exchangeId
    
    const pos = this.exchangeNameList.map(e => e.exchangeId).indexOf(this.selectedItem.exchange.exchangeId);
    this.exchangeCode =this.exchangeNameList[pos].exchangeCode
    
    if (isValid) {
      this.loader.show();
      if (this.isEditing) {

        this.listingService.updateTaxRanges(this.selectedItem).subscribe(
          data => {
            
            this.loader.hide();
            data.exchange.exchangeCode = this.exchangeCode
            this.fillTaxRangesFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();

            // this.clearFields();
            this.flex.invalidate();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
            this.flex.refresh();
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
        console.log("POST>>>>" + this.selectedItem.exchange.exchangeId);
        this.listingService.saveTaxRanges(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            AppUtility.moveSelectionToLastItem(this.itemsList);
            // this.clearFields();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');

            data.exchange.exchangeCode = this.exchangeCode
            this.selectedItem = this.itemsList.addNew();
            this.fillTaxRangesFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            // Select the newly added item

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

  private fillTaxRangesFromJson(tr: TaxRanges, data: any) {
    
    if (!AppUtility.isEmpty(data)) {
      
      tr.id = data.id;
      tr.exchange = new Exchange()
      tr.exchange.exchangeId = data.exchange.exchangeId;
      tr.exchange.exchangeCode = data.exchange.exchangeCode;
      tr.fromYear = data.fromYear;
      tr.toYear = data.toYear;
      tr.percentage = data.percentage;
      

      /*************solution for wijmo filter issue*********** */

      this.itemsList.commitEdit();
    }
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
          

        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error;;
        });
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)])],
      fromYear: ['', Validators.compose([Validators.required, Validators.pattern("([0-9]|[1-9][0-9]|100)")])],
      toYear: ['', Validators.compose([Validators.required, Validators.pattern("([0-9]|[1-9][0-9]|100)")])],
      percentage: ['', Validators.compose([Validators.required, Validators.pattern("([0-9]|[1-9][0-9]|100)")])],
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }

}