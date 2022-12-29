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
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { Bank } from 'app/models/bank';
import { Participant } from 'app/models/participant';

declare var jQuery: any;

@Component({

  selector: 'bank-page',
  templateUrl:'./bank-page.html',
})
export class BankPage implements OnInit {

  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: Bank;
  errorMessage: string;
  //claims: any;
  selectedIndex: number = 0;

  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;

  private _pageSize = 0;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('bankCode') bankCode: wjcInput.InputMask;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;


  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2,private translate: TranslateService,private loader : FuseLoaderScreenService) {
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

    this.populateBanksList(AppConstants.participantId);
    // Add Form Validations
    this.addFromValidations();
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.bankCode.focus();
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

    this.selectedItem = new Bank();
    this.selectedItem.active = true;
    this.selectedItem.bankCode = '';
    this.selectedItem.bankId = null;
    this.selectedItem.bankName = '';
    this.selectedItem.participant = new Participant();
    // if (!AppUtility.isEmpty(this.claims))
    this.selectedItem.participant.participantId = AppConstants.participantId;
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
      this.isEditing = true;
      // this.selectedItem = this.itemsList.currentItem;
      // this.itemsList.editItem(this.selectedItem);
    }
  }

  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      this.loader.show();
      if (this.isEditing) {

        this.listingService.updateBank(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            this.fillBanksFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.refreshOnEdit = true;             
            this.itemsList.commitEdit();            
            
            // this.clearFields();
            this.flex.refresh();
            

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
        console.log("POST>>>>" + this.selectedItem.participant.participantId);
        this.listingService.saveBank(this.selectedItem).subscribe(
          data => {
            // this.loader.hide();
            // if (AppUtility.isEmpty(this.itemsList))
            //   this.itemsList = new wjcCore.CollectionView;

            // this.selectedItem = this.itemsList.addNew();
            // this.fillBanksFromJson(this.selectedItem, data);
            // this.itemsList.commitNew();
            // // Select the newly added item
            // AppUtility.moveSelectionToLastItem(this.itemsList);
            // // this.clearFields();
            // this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            // this.dialogCmp.showAlartDialog('Success');
            


            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            AppUtility.moveSelectionToLastItem(this.itemsList);
            // this.clearFields();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');

          
            this.selectedItem = this.itemsList.addNew();
            this.fillBanksFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            // Select the newly added item
          },
          err => {
            this.loader.hide();
            this.hideForm = true;
            if ( err.message !=null || err.message != undefined) {
              this.errorMessage = err.message;
            } else {
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

  private fillBanksFromJson(st: Bank, data: any) {
    if (!AppUtility.isEmpty(data)) {
      st.active = data.active;
      st.bankCode = data.bankCode;
      st.bankId = data.bankId;
      st.bankName = data.bankName;
      st.participant = new Participant();
      st.participant.participantId = AppConstants.participantId;

      /*************solution for wijmo filter issue*********** */

      // this.itemsList.items[this.selectedIndex].active = data.active;
      // this.itemsList.items[this.selectedIndex].bankCode = data.bankCode;
      // this.itemsList.items[this.selectedIndex].bankName = data.bankName;
      this.itemsList.commitEdit();
    }
  }

  private populateBanksList(_participantid: Number) {
    this.loader.show();
    this.listingService.getBanksList(_participantid, false)
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

  private addFromValidations() {
    this.myForm = this._fb.group({
      bankCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      bankName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      active: ['']
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }

}