'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Role } from 'app/models/role';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

declare var jQuery: any;

@Component({
  selector: 'role-page',
  templateUrl: './role-page.html',
})
export class RolePage implements OnInit {
  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: Role;
  errorMessage: string;

  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  modal = true;
  selectedIndex: number = 0;

  private _pageSize = 0;
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('recordSaveDlg') recordSaveDlg: wjcInput.Popup;
  @ViewChild('roleName') roleName: wjcInput.InputMask;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;


  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService,private loader : FuseLoaderScreenService) {
    //this.claims = authService.claims;
    this.clearFields();
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.itemsList = new wjcCore.CollectionView();
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }


  ngOnInit() {

    //    jQuery('.parsleyjs').parsley();
    // Populate Banks data..    
    this.populateRoleList();

    // Add Form Validations
    this.addFromValidations();

  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.roleName.focus();
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

    this.selectedItem = new Role();
    this.selectedItem.roleId = null;
    this.selectedItem.roleName = '';
    this.selectedItem.participantId = null;
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
    this.hideModal();
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

  public hideModal() {
    jQuery("#add_new").modal("hide");   //hiding the modal on save/updating the record
  }
  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    this.selectedItem.participantId = AppConstants.participantId;
    if (isValid) {
      this.loader.show();
      if (this.isEditing) {
        this.listingService.updateRole(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            this.fillRoleFromJson(this.selectedItem, data);
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
        this.listingService.saveRole(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();
            this.fillRoleFromJson(this.selectedItem, data);
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

  private fillRoleFromJson(vt: Role, data: any) {
    if (!AppUtility.isEmpty(data)) {
      vt.roleId = data.roleId;
      vt.roleName = data.roleName;
      vt.participantId = data.participantId;
    }
  }

  private populateRoleList() {
    this.loader.show();
    this.listingService.getRoleList(AppConstants.participantId)
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
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
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
      roleName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
    });
  }
  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }

}