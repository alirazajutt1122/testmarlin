'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Role } from 'app/models/role';
import { RolePrivilege } from 'app/models/role-privilege';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

declare var jQuery: any;

@Component({

    selector: 'role-privs-page',
    templateUrl: './role-privs-page.html',
})
export class RolePrivsPage implements OnInit {

    public myForm: FormGroup;

    itemsList: any[];
    rolesPrivsList: any[];
    selectedItem: Role;
    errorMessage: string;
    roleList: any[];

    public hideForm = false;
    public isSubmitted: boolean;
    public isEditing: boolean;
    modal = true;
    //claims: any;

    private _pageSize = 0;

    @ViewChild('flex') flex: wjcGrid.FlexGrid;
    @ViewChild('recordSaveDlg') recordSaveDlg: wjcInput.Popup;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    lang: string;


    constructor(private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService,private loader : FuseLoaderScreenService) {
        //this.claims = authService.claims;
        this.clearFields();
        this.hideForm = false;
        this.isSubmitted = false;
        this.isEditing = false;
        this.itemsList = [];
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

        // Populate Privilege List
        this.populatePrivilegeList();
        // Add Form Validations
        this.addFromValidations();

    }

    /*********************************
   *      Public & Action Methods
   *********************************/


    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }

        this.hideForm = false;
        this.isSubmitted = false;
        this.isEditing = false;

        this.selectedItem = new Role();
        this.selectedItem.roleId = null;
        this.selectedItem.roleName = null;
        this.selectedItem.participantId = null;

        this.rolesPrivsList = [];
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

    public hideModal() {
        jQuery("#add_new").modal("hide");   //hiding the modal on save/updating the record
    }
    public onSaveAction(model: any, isValid: boolean) {
        this.isSubmitted = true;
        this.selectedItem.participantId = AppConstants.participantId;
        if (isValid) {
            var rolesPL = [];
            var ind = 0;
            for (let i = 0; i < this.itemsList.length; i++) {
                if (this.itemsList[i].hasChild) {
                    for (let j = 0; j < this.itemsList[i].childs.length; j++) {
                        if (this.itemsList[i].childs[j].hasChild) {
                            for (let k = 0; k < this.itemsList[i].childs[j].childs.length; k++) {
                                if (this.itemsList[i].childs[j].childs[k].hasChild) {
                                    for (let l = 0; l < this.itemsList[i].childs[j].childs[k].childs.length; l++) {
                                        if (this.itemsList[i].childs[j].childs[k].childs[l].allowed == true) {
                                            rolesPL[ind] = this.itemsList[i].childs[j].childs[k].childs[l];
                                            ind++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (rolesPL.length <= 0) {
                this.dialogCmp.statusMsg = "Please select some privileges.";
                this.dialogCmp.showAlartDialog('Notification');
                return;
            } else {
                var rp: RolePrivilege = new RolePrivilege();
                rp.roleId = this.selectedItem.roleId;
                rp.privileges = rolesPL;
                this.listingService.saveRolePrivileges(rp).subscribe(
                    data => {
                        this.onCancelAction();
                        this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                        this.dialogCmp.showAlartDialog('Success');

                    },
                    err => {
                        this.dialogCmp.statusMsg = err.message;
                        this.dialogCmp.showAlartDialog('Error');
                    }
                );
            }

        }
    }
    public onRoleChangeEvent(selectedId): void {
        this.unCheckAll();
        if (AppUtility.isEmpty(selectedId)) {
            this.isEditing = false;
        } else {
            this.isEditing = true;
            this.listingService.getRolePriveleges(selectedId)
                .subscribe(
                    restData => {
                        this.rolesPrivsList = restData;
                        if (!AppUtility.isEmpty(this.rolesPrivsList)) {
                            for (let a = 0; a < restData.length; a++) {
                                for (let i = 0; i < this.itemsList.length; i++) {
                                    if (this.itemsList[i].hasChild) {
                                        for (let j = 0; j < this.itemsList[i].childs.length; j++) {
                                            if (this.itemsList[i].childs[j].privilegeId == this.rolesPrivsList[a].privilegeId) {
                                                this.itemsList[i].childs[j].allowed = true;
                                                continue;
                                            }
                                            if (this.itemsList[i].childs[j].hasChild) {
                                                for (let k = 0; k < this.itemsList[i].childs[j].childs.length; k++) {
                                                    if (this.itemsList[i].childs[j].childs[k].privilegeId == this.rolesPrivsList[a].privilegeId) {
                                                        this.itemsList[i].childs[j].childs[k].allowed = true;
                                                        continue;
                                                    }
                                                    if (this.itemsList[i].childs[j].childs[k].hasChild) {
                                                        for (let l = 0; l < this.itemsList[i].childs[j].childs[k].childs.length; l++) {
                                                            if (this.itemsList[i].childs[j].childs[k].childs[l].privilegeId == this.rolesPrivsList[a].privilegeId) {
                                                                this.itemsList[i].childs[j].childs[k].childs[l].allowed = true;
                                                                continue;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    error => this.errorMessage = <any>error.message);
        }
    }
    public clearAction() {
        this.clearFields();
        this.unCheckAll();
    }
    public allowCheckBoxEvent(optionId, state) {
        //if (state.target.checked) {
        for (let i = 0; i < this.itemsList.length; i++) {
            if (this.itemsList[i].hasChild) {
                for (let j = 0; j < this.itemsList[i].childs.length; j++) {
                    if (this.itemsList[i].childs[j].privilegeId == optionId) {
                        this.itemsList[i].childs[j].allowed = state.target.checked;
                        break;
                    }
                    if (this.itemsList[i].childs[j].hasChild) {
                        for (let k = 0; k < this.itemsList[i].childs[j].childs.length; k++) {
                            if (this.itemsList[i].childs[j].childs[k].privilegeId == optionId) {
                                this.itemsList[i].childs[j].childs[k].allowed = state.target.checked;
                                break;
                            }
                            if (this.itemsList[i].childs[j].childs[k].hasChild) {
                                for (let l = 0; l < this.itemsList[i].childs[j].childs[k].childs.length; l++) {
                                    if (this.itemsList[i].childs[j].childs[k].childs[l].privilegeId == optionId) {
                                        this.itemsList[i].childs[j].childs[k].childs[l].allowed = state.target.checked;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //}
    }
    public checkAll() {
        for (let i = 0; i < this.itemsList.length; i++) {
            if (this.itemsList[i].hasChild) {
                for (let j = 0; j < this.itemsList[i].childs.length; j++) {
                    this.itemsList[i].childs[j].allowed = true;
                    if (this.itemsList[i].childs[j].hasChild) {
                        for (let k = 0; k < this.itemsList[i].childs[j].childs.length; k++) {
                            this.itemsList[i].childs[j].childs[k].allowed = true;
                            if (this.itemsList[i].childs[j].childs[k].hasChild) {
                                for (let l = 0; l < this.itemsList[i].childs[j].childs[k].childs.length; l++) {
                                    this.itemsList[i].childs[j].childs[k].childs[l].allowed = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    public unCheckAll() {
        for (let i = 0; i < this.itemsList.length; i++) {
            if (this.itemsList[i].hasChild) {
                for (let j = 0; j < this.itemsList[i].childs.length; j++) {
                    this.itemsList[i].childs[j].allowed = false;
                    if (this.itemsList[i].childs[j].hasChild) {
                        for (let k = 0; k < this.itemsList[i].childs[j].childs.length; k++) {
                            this.itemsList[i].childs[j].childs[k].allowed = false;
                            if (this.itemsList[i].childs[j].childs[k].hasChild) {
                                for (let l = 0; l < this.itemsList[i].childs[j].childs[k].childs.length; l++) {
                                    this.itemsList[i].childs[j].childs[k].childs[l].allowed = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /***************************************
   *          Private Methods
   **************************************/

    private fillVoucherTypeFromJson(vt: Role, data: any) {
        if (!AppUtility.isEmpty(data)) {
            vt.roleId = data.roleId;
            vt.roleName = data.roleName;
            vt.participantId = data.participantId;
        }
    }

    private populateRoleList() {
        this.listingService.getRoleList(AppConstants.participantId)
            .subscribe(
                restData => {
                    if (AppUtility.isEmpty(restData)) {
                        this.roleList = [];
                    } else {
                        this.roleList = restData;
                    }

                    var pb: Role = new Role();
                    pb.roleId = AppConstants.PLEASE_SELECT_VAL;
                    pb.roleName = AppConstants.PLEASE_SELECT_STR;
                    this.roleList.unshift(pb);
                    if (!AppUtility.isEmptyArray(this.roleList)) {
                        this.selectedItem.roleId = this.roleList[0].roleId;
                    }
                },
                error => this.errorMessage = <any>error.message);
    }

    private populatePrivilegeList() {
        this.listingService.getPrivilegeList(AppConstants.participantId)
            .subscribe(
                restData => {
                    if (AppUtility.isEmpty(restData)) {
                        this.itemsList = [];
                    } else {
                        this.itemsList = restData;
                    }
                },
                error => this.errorMessage = <any>error.message);
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
            role: ['', Validators.compose([Validators.required])],
        });
    }

    public getNotification(btnClicked) {
        if (btnClicked == 'Success')
            this.hideModal();
    }

}