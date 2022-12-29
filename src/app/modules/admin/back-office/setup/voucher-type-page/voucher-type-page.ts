'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { ParticipantBranch } from 'app/models/participant-branches';
import { Params, ReportParams } from 'app/models/report-params';
import { Security } from 'app/models/security';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';

import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { VoucherType } from 'app/models/voucher-type';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { Participant } from 'app/models/participant';
import { CollectionView, SortDescription,IPagedCollectionView,} from '@grapecity/wijmo';

declare var jQuery: any;

@Component({

  selector: 'voucher-type-page',
  templateUrl:'./voucher-type-page.html',
})
export class VoucherTypePage implements OnInit {

  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: VoucherType;
  errorMessage: string;

  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  public isDisabled: boolean;
  modal = true;
  selectedIndex: number = 0;

  private _pageSize = 0;
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('recordSaveDlg') recordSaveDlg: wjcInput.Popup;
  @ViewChild('voucherType') voucherType: wjcInput.InputMask;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;


  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2,private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.clearFields();
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.isDisabled = false;
    //this.claims = authService.claims;
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }


  ngOnInit() {

    //    jQuery('.parsleyjs').parsley();
    // Populate Banks data..    
    this.populateVoucherTypeList();


    // Add Form Validations
    this.addFromValidations();

  }

  ngAfterViewInit() {

    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.voucherType.focus();
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
    this.isDisabled = false;

    this.selectedItem = new VoucherType();
    this.selectedItem.voucherTypeId = null;
    this.selectedItem.voucherType = '';
    this.selectedItem.typeDesc = '';
    this.selectedItem.participant = new Participant();
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
      this.itemsList.editItem(this.selectedItem);
      if (this.selectedItem.voucherType == 'BRV' || this.selectedItem.voucherType == 'BPV' || this.selectedItem.voucherType == 'CPV' || this.selectedItem.voucherType == 'CRV' || this.selectedItem.voucherType == 'AUTO')
        this.isDisabled = true;
      else
        this.isDisabled = false;
    }
  }

  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      this.loader.show();
      if (this.isEditing) {

        this.listingService.updateVoucherType(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            this.fillVoucherTypeFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.flex.invalidate();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
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
          }
        );
      }
      else {
        this.listingService.saveVoucherType(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();
            this.fillVoucherTypeFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            // Select the newly added item
            AppUtility.moveSelectionToLastItem(this.itemsList);

            console.log(data);
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
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
          }
        );
      }
    }
  }

  /***************************************
 *          Private Methods
 **************************************/

  private fillVoucherTypeFromJson(vt: VoucherType, data: any) {
    if (!AppUtility.isEmpty(data)) {
      vt.voucherTypeId = data.voucherTypeId;
      vt.voucherType = data.voucherType;
      vt.typeDesc = data.typeDesc;
      vt.participant = new Participant();
      vt.participant.participantId = AppConstants.participantId;
    }
  }

  private populateVoucherTypeList() {
    this.loader.show();
    this.listingService.getVoucherTypeList(AppConstants.participantId)
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
          this.errorMessage = <any>error.message;
        }
        else
        {
          this.errorMessage = <any>error;
        }
      });
  }

  showDialog(dlg: wjcInput.Popup) {
    if (dlg) {
      dlg.modal = this.modal;
      dlg.hideTrigger = dlg.modal ? wjcInput.PopupTrigger.None : wjcInput.PopupTrigger.Blur;
      dlg.show();
    }
  };

  private addFromValidations() {
    this.myForm = this._fb.group({
      voucherType: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      typeDesc: ['', Validators.compose([Validators.required])],
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