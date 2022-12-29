'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


import { PasswordValidators } from 'ng2-validators';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { User } from 'app/models/user';
import { PasswordStrengthMeasurer } from 'app/util/PasswordStrengthMeasurer';
import { ListingService } from 'app/services/listing.service';
import { AppState } from 'app/app.service';
import { AuthService2 } from 'app/services/auth2.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Role } from 'app/models/role';
import { UserType } from 'app/models/user-type';
import { Agent } from 'app/models/agent';
import { Client } from 'app/models/client';
import { ParticipantBranch } from 'app/models/participant-branches';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { Country } from 'app/models/country';

declare var jQuery: any;

@Component({
  selector: 'user-page',
  templateUrl: './user-page.html',
})
export class UserPage implements OnInit {
  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  clItemsList: wjcCore.CollectionView;
  selectedItem: User;
  errorMessage: string;
  userTypeList: any[];
  dashboardList: any[];
  roleList: any[];
  selectedRoleList: any[];
  agentList: any[];
  clientList: any[];
  participantBranchList: any[];
  selectedIndex: number = 0;
  IDS: Number[];
  strTemp: string = '';

  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  public confirmPassword_: String = "";
  public selectUserTypeId: Number;
  public userTypeParticipantBranchId: Number;
  public userTypeAgentId: Number;
  public userTypeClientId: Number;
  isroleIdEmpty: boolean = false;
  selectDashboard: string = '';
  modal = true;
  public recExist: boolean;
  private _pageSize = 0;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('recordSaveDlg') recordSaveDlg: wjcInput.Popup;
  @ViewChild('stMultiSelect') stMultiSelect: wjcInput.MultiSelect;
  @ViewChild('securityId') securityId: wjcInput.MultiSelect;
  @ViewChild('userEmail') userEmail: wjcInput.InputMask;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  @ViewChild('password') password: ElementRef;
  @ViewChild('activeUser') activeUser: ElementRef;
  @ViewChild('updateBtn') updateBtn: ElementRef;
  @ViewChild('saveBtn') saveBtn: ElementRef;
  @ViewChild('Grid') Grid: wjcGrid.FlexGrid;
  @ViewChild('dashboard') dashboard: wjcInput.ComboBox;
  lang: string;
  countryList: Object[];
  countryId: Number = null;

  public tabFocusChanged1() {
    // if (!this.isEditing)
    //   this.password.nativeElement.focus();
  }

  public tabFocusChanged2() {
    this.activeUser.nativeElement.focus();
  }

  public tabFocusChanged3() {
    if (this.isEditing)
      this.updateBtn.nativeElement.focus();
    else
      this.saveBtn.nativeElement.focus();
  }

  private changePasswordError: string;
  private measurer: PasswordStrengthMeasurer = new PasswordStrengthMeasurer();
  private passwordStrength = 0;


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
    this.populateUserList();

    // Populate User Types
    this.populateUserTypeList();

    //Populate Roles
    this.populateRoleList();

    //Populate Agents
    this.populateAgentList();

    //Populate Clients
    this.populateClientList();

    //Populate Participant branches
    this.populateParticipantBranchList();

    // Add Form Validations
    this.addFromValidations();

    this.populateCountryList()

    this.changePasswordError = undefined;
    this.passwordStrength = 0;
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.userEmail.focus();
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

    this.selectedItem = new User();
    this.selectedItem.userTypeId = null;

    this.confirmPassword_ = "";

    this.userTypeParticipantBranchId = null;
    this.userTypeAgentId = null;
    this.userTypeClientId = null;
    this.selectedItem.userName = '';

    this.selectUserTypeId = null;

    this.selectedItem.roles = [];

    this.isroleIdEmpty = false;
    this.countryId= null;

    if (!AppUtility.isEmpty(this.roleList)) {
      this.unSelectAllItems(this.roleList);
    }

    this.strTemp = null;
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
    this.itemsList.cancelEdit();
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
      this.countryId = this.selectedItem.country.countryId
      // this.clearFields();
      this.isEditing = true;
      // this.selectedItem = this.itemsList.currentItem;
      // this.itemsList.editItem(this.selectedItem);
      this.selectUserTypeId = this.selectedItem.userTypeId;
      if (this.selectedItem.userTypeId == AppConstants.USER_TYPE_AGENT)
        this.userTypeAgentId = this.selectedItem.lookupId;
      else if (this.selectedItem.userTypeId == AppConstants.USER_TYPE_CLIENT)
        this.userTypeClientId = this.selectedItem.lookupId;
      else if (this.selectedItem.userTypeId == AppConstants.USER_TYPE_PARTICIPANT_OPERATOR)
        this.userTypeParticipantBranchId = this.selectedItem.lookupId;
      // this.selectDashboard = this.selectedItem.dashboard;
      let checkedItems: any[] = [];
      if (this.selectedItem.roleNamesDisplay_.length > 0) {
        let selectedItems: any[] = this.selectedItem.roleNamesDisplay_.split(',');
        for (let i = 0; i < this.roleList.length; i++) {
          let obj: Role = this.roleList[i];
          for (let j = 0; j < selectedItems.length; j++) {
            if (obj.roleName == selectedItems[j]) {
              obj.selected = true;
              this.roleList[i].$checked = true;
              checkedItems.push(obj);
              this.strTemp = this.strTemp + this.selectedItem.roles[j].roleId + ',';
            }
          }
        }
        this.strTemp = this.strTemp.substr(0, this.strTemp.length - 1);
      }

      if (AppUtility.isValidVariable(checkedItems))
        this.selectedItem.roles = checkedItems;

      if (AppUtility.isValidVariable(this.stMultiSelect) && !this.stMultiSelect.containsFocus())
        this.stMultiSelect.refresh();

      this.listingService.getDashboardsbyParticipantAndUserTypeAndRoles(AppConstants.participantId, this.selectUserTypeId, this.strTemp)
        .subscribe(
          restData => {
            if (AppUtility.isEmpty(restData)) {
              this.dashboardList = [];
            } else {
              AppUtility.printConsole('this.dashboardList: ' + JSON.stringify(restData));
              this.BindAssignedDashboards(restData);
            }
          },
          error => this.errorMessage = <any>error.message);
    }
  }

  onNewPasswordChange(newValue) {
    this.changePasswordError = undefined;
    this.passwordStrength = this.measurer.measure(newValue);
  }
  public hideModal() {
    jQuery("#add_new").modal("hide");   //hiding the modal on save/updating the record
  }
  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;

    if (AppUtility.isValidVariable(this.stMultiSelect)) {
      if (this.stMultiSelect.checkedItems.length === 0) {
        this.isroleIdEmpty = true;
        return false;
      }
      else {
        this.isroleIdEmpty = false;
      }
    }
    if (AppUtility.isEmpty(this.selectedItem.email))
      return false;
    if (!AppUtility.validateEmail("" + this.selectedItem.email))
      return false;
    // due to implementation of default password at user creation, no need of password & confirm password fields @ 10/Oct/2017 - AiK
    // if (!this.isEditing && (AppUtility.isEmpty(this.selectedItem.password) || AppUtility.isEmpty(this.confirmPassword_)))
    //   return false;
    // if (!this.isEditing && (this.selectedItem.password != this.confirmPassword_))
    //   return false;

    if (this.selectUserTypeId == AppConstants.USER_TYPE_AGENT) {
      if (AppUtility.isEmpty(this.userTypeAgentId))
        return false;
    }
    else if (this.selectUserTypeId == AppConstants.USER_TYPE_CLIENT) {
      if (AppUtility.isEmpty(this.userTypeClientId))
        return false;

    }
    else if (this.selectedItem.userTypeId == AppConstants.USER_TYPE_PARTICIPANT_OPERATOR) {
      if (AppUtility.isEmpty(this.userTypeParticipantBranchId))
        return false;
    }
    else if (AppUtility.isEmpty(this.selectDashboard)) {
      return false;
    }

    // if (!this.isEditing) {
    //   if (!(<any>this.myForm).controls.password.valid)
    //     return false;
    // }
    isValid = true;
    this.selectedItem.country.countryId = this.countryId
    this.selectedItem.userTypeId = this.selectUserTypeId;
    this.selectedItem.participant.participantId = AppConstants.participantId;
    if (this.selectedItem.userTypeId == AppConstants.USER_TYPE_AGENT)
      this.selectedItem.lookupId = this.userTypeAgentId;
    else if (this.selectedItem.userTypeId == AppConstants.USER_TYPE_CLIENT)
      this.selectedItem.lookupId = this.userTypeClientId;
    else if (this.selectedItem.userTypeId == AppConstants.USER_TYPE_PARTICIPANT_OPERATOR)
      this.selectedItem.lookupId = this.userTypeParticipantBranchId;
    else
      this.selectedItem.lookupId = null;
    if (this.selectedItem.userTypeId != AppConstants.USER_TYPE_PARTICIPANT_ADMIN)
      this.selectedItem.roles = this.stMultiSelect.checkedItems;
    else
      this.selectedItem.roles = null;
    this.selectedItem.dashboard = this.selectDashboard;

this.selectedItem.active
    if (isValid) {
      this.loader.show();
      if (this.isEditing) {
        this.listingService.updateUser(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            this.fillUserFromJson(this.selectedItem, data);
            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
            this.itemsList.commitEdit();
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.flex.invalidate();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
          
            if(err.message){
              this.errorMessage = err.message;
            }
            else{
              this.errorMessage = err;
            }
            this.hideForm = true;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
      else {
        this.listingService.saveUser(this.selectedItem).subscribe(
          data => {
            
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;

            this.selectedItem = this.itemsList.addNew();
            this.fillUserFromJson(this.selectedItem, data);
            this.itemsList.commitNew();
            // Select the newly added item
            AppUtility.moveSelectionToLastItem(this.itemsList);

            console.log(data);
            // this.clearFields(); //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
            this.hideForm = true;
            if(err.message){
              this.errorMessage = err.message;
            }
            else{
              this.errorMessage = err;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
    }
  }
  public onUserTypeChangeEvent(selectedTypeId): void {
    //this.userTypeAgentId=null;
    //this.userTypeClientId=null;
    //this.userTypeParticipantBranchId=null;
    if (!AppUtility.isEmpty(selectedTypeId)) {
      if (selectedTypeId == AppConstants.USER_TYPE_AGENT)
        this.populateAgentList();
      else if (selectedTypeId == AppConstants.USER_TYPE_CLIENT)
        this.populateClientList();
      else if (selectedTypeId == AppConstants.USER_TYPE_PARTICIPANT_OPERATOR)
        this.populateParticipantBranchList();
      else if (selectedTypeId == AppConstants.USER_TYPE_PARTICIPANT_ADMIN)
        this.populateDashboardList();

      if (selectedTypeId !== AppConstants.USER_TYPE_PARTICIPANT_ADMIN && AppUtility.isValidVariable(this.stMultiSelect) && this.isEditing)
        this.populateDashboardList();

      // if (this.isEditing)
      //   this.selectDashboard = this.selectedItem.dashboard;
    }
  }

  /***************************************
  *          Private Methods
  **************************************/

  private fillUserFromJson(vt: User, data: any) {
    if (!AppUtility.isEmpty(data)) {
      
      vt.userId = data.userId;
      vt.email = data.email;
      // when service returns the password, it's encrypted so it's more than 32 characters, that's why warning shows.
      // one solution is to trim this field upto less than 32 characters @ 05/May/2017 - AiK, Defect Id: 1080      
      this.confirmPassword_ = vt.password = 'a123456789A';
      vt.status = data.status;
      vt.active = data.active;
      vt.lookupId = data.lookupId;
      vt.userTypeId = data.userTypeId;
      vt.userType = data.userType;
      vt.userName = data.userName;
      vt.participant = data.participant;
      vt.roles = data.roles;
      vt.dashboard = data.dashboard;
      vt.defaultUser = data.defaultUser;
      
      vt.country = data.country
      vt.roleNamesDisplay_ = "";
      if (this.stMultiSelect)
        for (let selectedRole of this.stMultiSelect.checkedItems) {
          vt.roleNamesDisplay_ = selectedRole.roleName + "," + vt.roleNamesDisplay_;
        }
      vt.roleNamesDisplay_ = vt.roleNamesDisplay_.slice(0, -1);
    }
  }

  private populateUserList() {
    this.loader.show();
    this.listingService.getUserList(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            this.itemsList = new wjcCore.CollectionView(restData);
          }
        },
        err => {
          this.loader.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else{
            this.errorMessage = err;
          }
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

  private populateUserTypeList() {
    this.listingService.getUserTypeList()
      .subscribe(
        restData => {
          if (AppUtility.isEmpty(restData)) {
            this.userTypeList = [];
          } else {
            this.userTypeList = restData;
          }
          var pb: UserType = new UserType();
          pb.userTypeId = AppConstants.PLEASE_SELECT_VAL;
          pb.typeName = AppConstants.PLEASE_SELECT_STR;
          this.userTypeList.unshift(pb);
          debugger
          
          this.userTypeList =  this.userTypeList.filter(user => user.typeName !== 'MARLIN ADMIN');
       
        },
        
        error => this.errorMessage = <any>error.message);
  }

  private populateDashboardList() {
    // this.dashboardList = [{ 'dashboard': AppConstants.PLEASE_SELECT_VAL, 'dashboardName': AppConstants.PLEASE_SELECT_STR },
    // { 'dashboard': 'TRADING', 'dashboardName': 'TRADING' }, { 'dashboard': 'BACKOFFICE', 'dashboardName': 'BACKOFFICE' },
    // { 'dashboard': 'RNA', 'dashboardName': 'RNA' }];

    if (this.selectUserTypeId !== 3)  // it means this isn't Participant Admin
      this.selectedRoles();
    else
      this.strTemp = null;
    this.listingService.getDashboardsbyParticipantAndUserTypeAndRoles(AppConstants.participantId, this.selectUserTypeId, this.strTemp)
      .subscribe(
        restData => {
          if (AppUtility.isEmpty(restData)) {
            this.dashboardList = [];
          } else {
            AppUtility.printConsole('this.dashboardList: ' + JSON.stringify(restData));
            this.BindAssignedDashboards(restData);
          }
        },
        error => this.errorMessage = <any>error.message);
  }

  private selectedRoles(): String {
    this.strTemp = '';
    if (this.stMultiSelect.checkedItems.length > 0) {
      for (let selectedRole of this.stMultiSelect.checkedItems) {
        this.strTemp = this.strTemp + selectedRole.roleId + ',';
      }
      this.strTemp = this.strTemp.substr(0, this.strTemp.length - 1);
      return this.strTemp;
    }
    else {
      return this.strTemp;
    }
  }

  private BindAssignedDashboards(dashboardList_: any[]) {
    let dashboardList_Temp: any[];
    dashboardList_Temp = [];
    for (let i = 0; i < dashboardList_.length; i++) {
      if (dashboardList_[i] === 1)
        dashboardList_Temp.push({ 'dashboard': 'TRADING', 'dashboardName': 'TRADING' });
      else if (dashboardList_[i] === 2)
        dashboardList_Temp.push({ 'dashboard': 'BACKOFFICE', 'dashboardName': 'BACKOFFICE' });
      else if (dashboardList_[i] === 3)
        dashboardList_Temp.push({ 'dashboard': 'RNA', 'dashboardName': 'RNA' });
    }
    this.dashboardList = dashboardList_Temp;

    if (this.isEditing) {
      this.selectDashboard = this.selectedItem.dashboard;
      this.dashboard.text = this.selectDashboard;
    }
  }

  private onLostFocus(): void {
    this.populateDashboardList();
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
        },
        error => this.errorMessage = <any>error.message);
  }

  private populateAgentList() {
    if (AppUtility.isEmpty(this.agentList)) {
      this.listingService.getActiveAgentsbyParticipant(AppConstants.participantId)
        .subscribe(
          restData => {
            if (AppUtility.isEmpty(restData)) {
              this.agentList = [];
            } else {
              this.agentList = restData;
            }
            var ag: Agent = new Agent();
            ag.agentId = AppConstants.PLEASE_SELECT_VAL;
            ag.displayName_ = AppConstants.PLEASE_SELECT_STR;
            this.agentList.unshift(ag);
            if (!AppUtility.isEmptyArray(this.agentList)) {
              this.userTypeAgentId = this.agentList[0].agentId;
            }
          },
          error => this.errorMessage = <any>error.message);
    }
  }

  private populateClientList() {
    if (AppUtility.isEmpty(this.clientList)) {
      this.listingService.getClientListByBroker(AppConstants.participantId, true)
        .subscribe(
          restData => {
            if (AppUtility.isEmptyArray(restData)) {
              this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
              this.clientList = null;
            } else {
              this.clientList = restData;

              var c: Client = new Client();
              c.clientId = AppConstants.PLEASE_SELECT_VAL;
              c.clientCode = AppConstants.PLEASE_SELECT_STR;
              this.clientList.unshift(c);
              this.userTypeClientId = this.clientList[0].clientId;
            }
          },
          error => this.errorMessage = <any>error.message);
    }
  }

  private populateParticipantBranchList() {
    if (AppUtility.isEmpty(this.participantBranchList)) {
      this.listingService.getParticipantBranchList(AppConstants.participantId)
        .subscribe(
          restData => {
            if (AppUtility.isEmpty(restData)) {
              this.participantBranchList = [];
            } else {
              this.participantBranchList = restData;
            }

            var pb: ParticipantBranch = new ParticipantBranch();
            pb.branchId = AppConstants.PLEASE_SELECT_VAL;
            pb.displayName_ = AppConstants.PLEASE_SELECT_STR;
            this.participantBranchList.unshift(pb);
            if (!AppUtility.isEmptyArray(this.participantBranchList)) {
              this.userTypeParticipantBranchId = this.participantBranchList[0].branchId;
            }
          },
          error => this.errorMessage = <any>error.message);
    }
  }

  public onSearch() {
    this.clItemsList = new wjcCore.CollectionView();
    this.recExist = false;
    this.Grid.refresh();
  }

  public updateControls() {
    this.userTypeClientId = this.Grid.collectionView.currentItem.clientId;
    this.clItemsList = new wjcCore.CollectionView();
    this.recExist = false;
    this.Grid.refresh();
  }

  public clearControls() {
    this.clItemsList = new wjcCore.CollectionView();
    this.Grid.refresh();
    this.recExist = false;
  }

  public populateItemGrid(searchClientCode: string, searchClientName: string) {
    this.recExist = false;
    this.loader.show();
    if (AppUtility.isEmpty(searchClientCode) && AppUtility.isEmpty(searchClientName)) {
      this.listingService.getClientListByBroker(AppConstants.participantId, true)
        .subscribe(
          restData => {
            this.loader.hide();
            if (!AppUtility.isEmpty(restData))
              this.recExist = true;
            else {
              this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
              this.dialogCmp.showAlartDialog('Warning');
            }
            this.clItemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (!AppUtility.isEmpty(searchClientCode) && AppUtility.isEmpty(searchClientName)) {
      this.listingService.getClientListByBrokerAndClientCode(AppConstants.participantId, encodeURIComponent(searchClientCode))
        .subscribe(
          restData => {
            this.loader.hide();
            if (!AppUtility.isEmpty(restData))
              this.recExist = true;
            else {
              this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
              this.dialogCmp.showAlartDialog('Warning');
            }
            this.clItemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (AppUtility.isEmpty(searchClientCode) && !AppUtility.isEmpty(searchClientName)) {
      this.listingService.getClientListByBrokerAndClientName(AppConstants.participantId, encodeURIComponent(searchClientName))
        .subscribe(
          restData => {
            this.loader.hide();
            if (!AppUtility.isEmpty(restData))
              this.recExist = true;
            else {
              this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
              this.dialogCmp.showAlartDialog('Warning');
            }
            this.clItemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (!AppUtility.isEmpty(searchClientCode) && !AppUtility.isEmpty(searchClientName)) {
      this.listingService.getClientListByBrokerAndClientCodeAndClientName(AppConstants.participantId, encodeURIComponent(searchClientCode), encodeURIComponent(searchClientName))
        .subscribe(
          restData => {
            this.loader.hide();
            if (!AppUtility.isEmpty(restData))
              this.recExist = true;
            else {
              this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
              this.dialogCmp.showAlartDialog('Warning');
            }
            this.clItemsList = new wjcCore.CollectionView(restData);
          },
          err => {
            this.loader.hide();
            if(err.message){
              this.errorMessage = err.message;
            }
            else{
              this.errorMessage = err;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    }
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

           
        },
        err => {
          this.loader.hide();
          if(err.message){
            this.errorMessage = err.message;
          }
          else{
            this.errorMessage = err;
          }
        });


  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      password: ['', Validators.compose([Validators.required,
      PasswordValidators.repeatCharacterRegexRule(4),
      PasswordValidators.alphabeticalCharacterRule(1),
      PasswordValidators.digitCharacterRule(1),
      PasswordValidators.lowercaseCharacterRule(1),
      PasswordValidators.uppercaseCharacterRule(1)])],

      confirmPassword: ['', Validators.compose([Validators.required])],
      userEmail: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternEmail)])],
      activeUser: [''],
      defaultUser : [''],
      userName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      userTypeId: ['', Validators.compose([Validators.required])],
      dashboardId: ['', Validators.compose([Validators.required])],
      userTypeParticipantBranchId: ['', Validators.compose([Validators.required])],
      userTypeAgentId: ['', Validators.compose([Validators.required])],
      userTypeClientId: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success') {
      this.onNewAction();
      this.hideModal();
    }
  }

}