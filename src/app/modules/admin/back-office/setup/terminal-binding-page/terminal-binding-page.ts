'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcGridDetail from '@grapecity/wijmo.grid.detail';

import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';

import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { IPagedCollectionView, } from '@grapecity/wijmo'
import { UserBinding } from 'app/models/terminal-binding';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { Client } from 'app/models/client';
import { User } from 'app/models/user';

declare var jQuery: any;
import 'select2';
// declare var $: any;

@Component({

    selector: 'terminal-binding-page',
    templateUrl:'./terminal-binding-page.html',
})
export class TerminalBindingPage implements OnInit {

    public myForm: FormGroup;

    itemsList: wjcCore.CollectionView;
    itemsList2: wjcCore.CollectionView;

    selectedItem: UserBinding;
    errorMessage: string;
    //claims: any;
    usersList: any[];
    clientList: any[];
    clientListSearch: any[];
    showAlert: boolean = true;

    public userId: number = AppConstants.PLEASE_SELECT_VAL;
    public clientId: number = AppConstants.PLEASE_SELECT_VAL;
    isExchangeEmpty: boolean = false;
    public detailMode: any;
    public hideForm = false;
    public isSubmitted: boolean;
    public isEditing: boolean;

    private _pageSize = 0;

    @ViewChild('flex') flex: wjcGrid.FlexGrid;
    @ViewChild('clients') clients: wjcInput.MultiSelect;
    @ViewChild('userName') userName: wjcInput.ComboBox;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    lang: string;

    constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService, private loader: FuseLoaderScreenService) {
        this.hideForm = false;
        this.isSubmitted = false;
        this.isEditing = false;
        //this.claims = authService.claims;
        this.detailMode = wjcGridDetail.DetailVisibilityMode[wjcGridDetail.DetailVisibilityMode.ExpandSingle];
        this.itemsList2 = new wjcCore.CollectionView();
        
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
    }


    ngOnInit() {
        this.clearFields();
        this.addFromValidations();
        this.populateUsers(AppConstants.participantId);
        this.populateClientList();
        this.populateClientListforSearch()
    }

    ngAfterViewInit() {
        var self = this;
        $('#add_new').on('shown.bs.modal', function (e) {
            self.userName.focus();
        });
        $(".select2-multiselect").select2({
            placeholder: "Select",
            allowClear: true,
          
        });

        $(".select2-multiselect").select2({
            placeholder: "Select",
           
        });
    }

    /*********************************
   *      Public & Action Methods
   *********************************/


    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }

        this.userId = AppConstants.PLEASE_SELECT_VAL;
        this.clientId = AppConstants.PLEASE_SELECT_VAL;

        if (AppUtility.isValidVariable(this.itemsList)) {
            this.itemsList.cancelEdit();
            this.itemsList.cancelNew();
        }
        if (AppUtility.isValidVariable(this.itemsList2)) {
            this.itemsList2.cancelEdit();
            this.itemsList2.cancelNew();
        }
        if (!AppUtility.isEmpty(this.clientList)) {
            this.unSelectAllItems(this.clientList);
        }
        jQuery("#clients").val(null).trigger("change")

        this.hideForm = false;
        this.isSubmitted = false;
        this.isEditing = false;
        this.isExchangeEmpty = false;

        this.selectedItem = new UserBinding();
        this.selectedItem.terminalBindingId = null;
        this.selectedItem.user = new User();
        this.selectedItem.user.userTypeId = null;

        if (AppUtility.isValidVariable(this.usersList) && !AppUtility.isEmpty(this.usersList)) {
            this.selectedItem.user.userId = this.usersList[0].userId;
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

    unSelectAllItems(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].selected = false;
            items[i].$checked = false;
        }
    }

    public onCancelAction() {
        this.clearFields();
        this.hideForm = false;
    }

    public onNewAction() {

        this.clearFields();
        if (this.clientList[0].clientCode == 'Select') this.clientList.shift();
        this.clients.refresh();
        this.hideForm = true;


    }

    public onEditAction() {
        if (!AppUtility.isEmpty(this.itemsList2.currentItem)) {
            this.clearFields();
            this.isEditing = true;
            this.selectedItem = this.itemsList2.currentItem;
            console.log(this.itemsList.items);
            this.itemsList2.editItem(this.selectedItem);

            if (this.clientList[0].clientCode == 'Select') this.clientList.shift();

            let checkedItems: any[] = [];
            for (let i: number = 0; i < this.itemsList.items.length; i++) {
                if (this.itemsList.items[i].user.userId == this.selectedItem.user.userId) {
                    checkedItems.push(this.itemsList.items[i].client.clientId);
                    let index = this.clientList.map(function (el) {
                        return el.clientId;
                    }).indexOf(this.itemsList.items[i].client.clientId);
                    this.clientList[index].$checked = true;
                }
            }
            jQuery("#clients").val(checkedItems).trigger("change");
            // this.clients.refresh();
        }
    }

    getClients(userId: any) {
        let checkedItems: any[] = [];
        for (let i: number = 0; i < this.itemsList.items.length; i++) {
            if (this.itemsList.items[i].user.userId == userId) {
                checkedItems.push(this.itemsList.items[i].client);
            }
        }
        return checkedItems;
    }

    public onSearchAction() {
        if (AppUtility.isValidVariable(this.userId) && AppUtility.isValidVariable(this.clientId)) {
            this.populateClientUserBindings(this.userId, this.clientId);
        }
        else if (!AppUtility.isValidVariable(this.userId) && AppUtility.isValidVariable(this.clientId)) {
            this.populateClientUserBindings(-1, this.clientId);
        }
        else if (AppUtility.isValidVariable(this.userId) && !AppUtility.isValidVariable(this.clientId)) {
            this.populateClientUserBindings(this.userId, -1);
        }
        else {
            this.populateClientUserBindings(-1, -1);
        }

    }

    public FinalSave() {
        // TODO
        // if (!jQuery("#clients").select2('val').length) {
        //     this.isExchangeEmpty = true;
        // } else {
        this.isExchangeEmpty = false;
        this.selectedItem.clients = jQuery("#clients").select2('val');
        // }
    }

    public toJSON(): any {
        let clientIds: any[] = [];
        if (this.selectedItem.clients[0].toString() == "-1") {
            for (let i = 2; i < this.clientList.length; i++) {
                clientIds.push(this.clientList[i].clientId);
            }
        }
        else {
            for (let i: number = 0; i < this.selectedItem.clients.length; i++)
                clientIds.push(this.selectedItem.clients[i]);
        }
        return {
            idsList: clientIds,
            userId: this.selectedItem.user.userId,
            participantId: AppConstants.participantId
        }
    }
    public onSaveAction(model: any, isValid: boolean) {
        this.isSubmitted = true;
        if (isValid && !this.isExchangeEmpty) {
            if (this.isEditing) {
                this.listingService.updateUserBinding(this.toJSON()).subscribe(
                    data => {
                        // this.clearFields();
                        this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                        this.dialogCmp.showAlartDialog('Success');
                        this.onSearchAction();
                        this.flex.refresh();
                    },
                    err => {
                        this.errorMessage = err;
                        this.hideForm = true;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
            }
            else {
                this.listingService.saveUserBinding(this.toJSON()).subscribe(
                    data => {
                        // this.clearFields();
                        if (AppUtility.isEmpty(this.itemsList2))
                            this.itemsList2 = new wjcCore.CollectionView;
                        this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
                        this.dialogCmp.showAlartDialog('Success');
                        this.onSearchAction();
                    },
                    err => {
                        this.hideForm = true;
                        this.errorMessage = err;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
            }
        }
    }

    public onDeleteAction() {
        // let _confirm: boolean = confirm(AppConstants.MSG_CONFIRM_RECORD_DELETION);
        this.dialogCmp.statusMsg = AppConstants.MSG_CONFIRM_RECORD_DELETION;
        this.dialogCmp.showAlartDialog('Confirmation');
    }

    /***************************************
   *          Private Methods
   **************************************/

    public populateUsers(participantId: number) {
       
        this.listingService.getActiveUsersListExceptParticipantAdmin(participantId)
            .subscribe(restData => {
                
                if (AppUtility.isEmptyArray(restData)) {
                    this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                    this.usersList = null;
                } else {
                    this.usersList = restData;
                    this.usersList.unshift({
                        userId: AppConstants.PLEASE_SELECT_VAL,
                        email: AppConstants.PLEASE_SELECT_STR
                    });
                }
            },
                error => {  this.errorMessage = <any>error.message })
    }

    private populateClientList() {
       
        this.listingService.getClientListByBroker(AppConstants.participantId, true)
            .subscribe(
                restData => {
                    
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.clientList = null;
                    } else {     
                        this.clientList = null;
                       
                        this.clientList = restData;
                         if(this.clientList[0].clientCode=="Select"){
                            this.clientList.shift();
                        }
                        var c1 = new Client();
                        c1.clientId = AppConstants.ALL_VAL;
                        c1.clientCode = AppConstants.ALL_STR;
                        this.clientList.unshift(c1);
                    }
                },
                error => {  this.errorMessage = <any>error.message });
    }

    private populateClientListforSearch() {
        this.loader.show();
        this.listingService.getClientListByBroker(AppConstants.participantId, true)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.clientListSearch = null;
                    } else {
                        this.clientListSearch = restData;

                        var c1: Client  = new Client();
                        c1.clientId = AppConstants.ALL_VAL;
                        c1.clientCode = AppConstants.ALL_STR;
                        this.clientListSearch.unshift(c1);

                        var c: Client = new Client();
                        c.clientId = AppConstants.PLEASE_SELECT_VAL;
                        c.clientCode = AppConstants.PLEASE_SELECT_STR;
                        this.clientListSearch.unshift(c);

                       
                    }
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    public onUserChangeEvent(userId: number) {

    }

    private populateClientUserBindings(userId: number, clientId: number) {
        this.loader.show();
        this.listingService.getClientUserBindings(AppConstants.participantId, userId, clientId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.itemsList2 = new wjcCore.CollectionView();
                        if (this.showAlert) {
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');
                        }
                        else
                            this.showAlert = true;
                    }
                    else {
                        this.itemsList = new wjcCore.CollectionView(restData);
                        let temp: any = restData;
                        let uniqueIDs: any[];
                        let uniqueValues: any[] = [];
                        uniqueIDs = Array.from(new Set([...new Array(temp.map(item => item.user.userId))][0]));

                        for (let i: number = 0; i < uniqueIDs.length; i++) {
                            for (let j: number = 0; j < temp.length; j++) {
                                if (temp[j].user.userId == uniqueIDs[i]) {
                                    uniqueValues.push(temp[j]);
                                    break;
                                }
                            }
                        }
                        this.itemsList2 = new wjcCore.CollectionView(uniqueValues);
                    }
                },
                error => {
                    this.loader.hide();
                    this.errorMessage = <any>error.message;
                    if (this.showAlert) {
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    }
                    else
                        this.showAlert = true;
                });
    }
    private addFromValidations() {
        this.myForm = this._fb.group({
            userName: ['', Validators.compose([Validators.required])],
            clients: [''],
        });
    }
    public hideModal() {
        jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
    }

    public getNotification(btnClicked) {
        if (btnClicked == 'Success')
            this.hideModal();
        else if (btnClicked == 'Yes') {
            this.onEditAction();
            this.FinalSave();
            this.showAlert = false;
            this.listingService.deleteUserBinding(this.toJSON()).subscribe(
                data => {
                    this.clearFields();
                    this.onSearchAction();
                },
                error => {
                    this.errorMessage = error.message;
                    this.hideForm = true;
                    this.dialogCmp.statusMsg = this.errorMessage;
                    this.dialogCmp.showAlartDialog('Error');

                });
        }
    }
}