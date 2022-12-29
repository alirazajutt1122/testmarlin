'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';


import { SettlementType } from '../models/settlement-type';
import { ListingService } from '../services/listing.service';
import { AppConstants, AppUtility } from '../app.utility';
import { AuthService2 } from 'app/services/auth2.service';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AppState } from '../app.service';
import { TranslateService } from '@ngx-translate/core';

import { CollectionView, SortDescription, IPagedCollectionView, } from '@grapecity/wijmo';
import { FuseLoaderScreenService, FuseSplashScreenService } from '@fuse/services/splash-screen';

declare var jQuery: any;

@Component({
  selector: 'settlement-type-page',
  templateUrl: './settlement-type-page.html',
})

export class SettlementTypePage implements OnInit {
  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: SettlementType;
  errorMessage: string;
  selectedIndex: number = 0;
  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  public isReadOnly = false;

  private _pageSize = 0;
  //claims: any;

  @ViewChild('flex', { static: false }) flex: wjcGrid.FlexGrid;
  @ViewChild('settlementType', { static: false }) settlementType: wjcInput.InputMask;
  @ViewChild('dialogCmp', { static: false }) dialogCmp: DialogCmp;
  lang: string;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, private translate: TranslateService, 
    public userService: AuthService2, public splash : FuseLoaderScreenService) {
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
    jQuery("#add_new").modal("hide");   //hiding the modal on save/updating the record
  }

  ngOnInit() {
    // Populate SettlementTypes data..    
    this.populateSettlementTypesList();

    // Add Form Validations
    this.addFromValidations();

  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.settlementType.focus();
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
    this.isSubmitted = false;
    this.isEditing = false;

    this.selectedItem = new SettlementType();
    this.selectedItem.settlementType = '';
    this.selectedItem.settlementTypeId = null;
    this.selectedItem.tradeDays = 1;
    this.selectedItem.settlementDays = 1;
    this.selectedItem.active = true;
    this.selectedItem.settlementDesc = '';
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
    this.isReadOnly = false;
  }

  public onEditAction() {
    this.clearFields();
    this.selectedIndex = this.flex.selection.row;
    this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.selectedItem)) {
      this.getSettlementCalenderCountBySettlementTypeId(this.selectedItem.settlementTypeId);
      this.hideForm = true;
      this.isEditing = true;
    }
  }

  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
       this.splash.show();
      if (this.isEditing) {
        this.listingService.updateSettlementType(this.selectedItem).subscribe(
          data => {
             this.splash.hide();
            console.log("update>>>>>" + data);
            this.fillSettlementTypeFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();
            // this.clearFields();
            this.flex.invalidate();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
          },
          error => {
             this.splash.hide();
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
        this.listingService.saveSettlementType(this.selectedItem).subscribe(
          data => {
             this.splash.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();
            this.fillSettlementTypeFromJson(this.selectedItem, data);
            this.itemsList.commitNew();

            // Select the newly added item
            AppUtility.moveSelectionToLastItem(this.itemsList);

            // this.clearFields();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          error => {
             this.splash.hide();
            this.hideForm = true;
            if(error.message){
              this.errorMessage = error.message;
          }
          else{
              this.errorMessage = error;
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

  private fillSettlementTypeFromJson(st: SettlementType, data: any) {
    if (!AppUtility.isEmpty(data)) {
      st.settlementType = data.settlementType;
      st.settlementDesc = data.settlementDesc;
      st.settlementDays = data.settlementDays;
      st.settlementTypeId = data.settlementTypeId;
      st.tradeDays = data.tradeDays;
      st.active = data.active;
    }
  }

  private populateSettlementTypesList() {
     this.splash.show();
    this.listingService.getAllSettlementTypesList()
      .subscribe(
        restData => {
           this.splash.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            this.itemsList = new wjcCore.CollectionView(restData);
          }
        },
        error => {
           this.splash.hide();
          if(error.message){
            this.errorMessage = error.message;
        }
        else{
            this.errorMessage = error;
        }
        });
  }

  private getSettlementCalenderCountBySettlementTypeId(settlementTypeId: Number) {
     this.splash.show();
    this.listingService.getSettlementCalenderCountBySettlementTypeId(settlementTypeId)
      .subscribe(
        restData => {
           this.splash.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.isReadOnly = false;
          } else {
            let temp: any = restData;
            if (temp > 0) {
              this.isReadOnly = true;
            }
            else {
              this.isReadOnly = false;
            }
          }
        },
        error => {
           this.splash.hide();
          if(error.message){
            this.errorMessage = error.message;
        }
        else{
            this.errorMessage = error;
        }
        });
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      settlementType: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternSettlementType)])],
      tradeDays: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
      settlementDays: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)])],
      settlementDesc: [''],
      active: [''],
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }
}