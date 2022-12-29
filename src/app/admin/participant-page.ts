import { DepoUser } from './../models/depo-user';
'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { PasswordStrengthMeasurer } from '../util/PasswordStrengthMeasurer';
import { PasswordValidators } from 'ng2-validators';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { ListingService } from '../services/listing.service';
import { AppUtility, AppConstants } from '../app.utility';
import { Participant } from '../models/participant';
import { ContactDetail } from '../models/contact-detail';
import { ParticipantType } from '../models/participant-type';
import { IdentificationType } from '../models/identification-type';
import { Industry } from '../models/industry';
import { Profession } from '../models/profession';
import { Country } from '../models/country';
import { City } from '../models/city';
import { User } from '../models/user';
import { Exchange } from '../models/exchange';
import { ExchangeMarket } from '../models/exchange-market';
import { ParticipantExchange } from '../models/participant-exchanges';
import { AuthService2 } from 'app/services/auth2.service';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AppState } from '../app.service';
import { CollectionView, SortDescription, IPagedCollectionView, } from '@grapecity/wijmo';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

declare var jQuery: any;


@Component({
  selector: 'participant-page',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './participant-page.html',
})
export class ParticipantPage implements OnInit {


  participantTypeList: any[];

  public myForm: FormGroup;
  public participantExchangeForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: Participant;
  errorMessage: string;
  participantBranchList: any[];
  exchangeList: any[];
  primaryExchangeList: any[];

  genderList: any[];
  identificationTypeList: any[];
  professionList: any[];
  industryList: any[];
  countryList: any[];
  cityList: any[];
  moduleList: any[];
  particpantExchangeList: any[] = [];
  participantModulesList: any[] = [];
  today: Date = new Date();

  selectedItemParticipantId: number = null;
  public showForm = false;
  public isSubmitted = false;
  public isEditing: boolean;

  public searchParticipantCode: string = '';
  public searchParticipantName: string = '';
  public searchParticipantType: Boolean = false;
  isExchangeEmpty: boolean = false;
  primaryExchangeSelectedError: boolean = false;
  isModuleEmpty: boolean = false;

  public isCustodian: boolean = false;
  public showOnlineAccess = false;
  public compulsoryError: boolean;
  public alertMessage: String;

  private _pageSize = 0;
  public confirmPassword_: String = '';
  public confirmPasswordDU_ : String = '';
  public currentTab_ = 'BI';
  public primaryExchangeId: number;
  public participantTypeID = null;
  public cityId: number

  private validBasic: boolean = false;
  private validContact: boolean = false;
  private validExchanges: boolean = false;
  private validModules: boolean = false;
  private validUser: boolean = false;
  private validDepoUser: boolean = false;
  private finalsave: boolean = false;
  updatingExchangeAssocciation: boolean = false;
  updatingModules: boolean = false;
  updatingUsers: boolean = false;
  updatingContact: boolean = false;
  updatingDepoUser : boolean = false;
  updatingBasic : boolean = false;

  //claims: any;
  @ViewChild('depoUserTab', { static: false }) depoUserTab:  ElementRef;
  @ViewChild('flex', { static: false }) flex: wjcGrid.FlexGrid;
  @ViewChild('basicTab', { static: false }) basicTab: ElementRef;
  @ViewChild('contactTab', { static: false }) contactTab: ElementRef;
  @ViewChild('modulesTab', { static: false }) modulesTab: ElementRef;
  @ViewChild('exchangeTab', { static: false }) exchangeTab: ElementRef;
  @ViewChild('systemAccessTab', { static: false }) systemAccessTab: ElementRef;
  @ViewChild('exchanges', { static: false }) exchanges: wjcInput.MultiSelect;
  @ViewChild('modules', { static: false }) modules: wjcInput.MultiSelect;
  @ViewChild('cmbCityId', { static: false }) cmbCityId: wjcInput.ComboBox;
  @ViewChild('participantCode', { static: false }) participantCode: wjcInput.InputMask;
  @ViewChild('dialogCmp', { static: false }) dialogCmp: DialogCmp;

  private changePasswordError: string;
  private measurer: PasswordStrengthMeasurer = new PasswordStrengthMeasurer();
  private passwordStrength = 0;

  private fileInput_: any;
  lang: string;

  constructor(private appState: AppState, private changeDetectorRef: ChangeDetectorRef, renderer: Renderer2,
    elementRef: ElementRef, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2,
     private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.clearFields();
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;


    //this.claims = authService.claims;
    renderer.listen(elementRef.nativeElement, 'click', (event) => {
      if (AppUtility.isValidVariable(this.exchanges) && !this.exchanges.containsFocus()) this.exchanges.refresh();
      if (AppUtility.isValidVariable(this.modules) && !this.modules.containsFocus()) this.modules.refresh();
    });

    this.itemsList = new wjcCore.CollectionView();
    this.participantTypeList = [{ 'name': AppConstants.PLEASE_SELECT_STR, 'code': AppConstants.PLEASE_SELECT_VAL }, { 'name': 'Yes', 'code': 'true' },
    { 'name': 'No', 'code': 'false' }]
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
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

  // public hideModal() {
  //   jQuery('#add_new').modal('hide');   //hiding the modal on save/updating the record
  // }

  ngOnInit() {
    this.genderList = [{ 'name': AppConstants.PLEASE_SELECT_STR, 'code': AppConstants.PLEASE_SELECT_VAL }, { 'name': 'Male', 'code': 'M' }, { 'name': 'Female', 'code': 'F' }]
    this.changePasswordError = undefined;
    this.passwordStrength = 0;

    // Add form Validations
    this.addFromValidations();

    // Populate country combo
    this.populateCountryList();

    this.populateExchangeList();
    this.populateProfessionList();
    this.populateIdentificationTypeList();
    this.populateIndustryList();
    this.populateModulesList();
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      if (self.cityList.length > 1) {
        self.selectedItem.contactDetail.cityId = self.cityId;
      }
      self.participantCode.focus();
    });
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
    this.showOnlineAccess = false;
    this.isCustodian = false;
    this.isExchangeEmpty = false;
    this.primaryExchangeSelectedError = false;
    this.isModuleEmpty = false;

    this.updatingExchangeAssocciation = false;
    this.updatingContact = false;
    this.updatingModules = false;
    this.updatingUsers = false;
    this.updatingDepoUser = false;

    this.selectedItem = new Participant();
    this.selectedItem.depoUser = new DepoUser();
    this.selectedItem.depoUser.participant = null;
    this.selectedItem.depoUser.password = '';
    this.selectedItem.depoUser.userName = '';
    this.selectedItem.participantId = null;
    this.selectedItem.participantCode = '';
    this.selectedItem.participantName = '';
    this.selectedItem.contactDetail = new ContactDetail;
    this.selectedItem.contactDetail.firstName = '';
    this.selectedItem.contactDetail.middleName = '';
    this.selectedItem.contactDetail.lastName = '';
    this.selectedItem.contactDetail.fatherHusbandName = '';
    this.selectedItem.contactDetail.gender = null;
    this.selectedItem.contactDetail.identificationTypeId = null;
    this.selectedItem.contactDetail.identificationType = '';
    this.selectedItem.contactDetail.registrationNo = '';
    this.selectedItem.contactDetail.professionId = null;
    this.selectedItem.contactDetail.phone1 = '';
    this.selectedItem.contactDetail.cellNo = '';
    this.selectedItem.contactDetail.email = '';
    this.selectedItem.contactDetail.dob = new Date();
    this.selectedItem.contactDetail.postalCode = '';
    this.selectedItem.contactDetail.address1 = '';
    this.selectedItem.contactDetail.companyName = '';
    this.selectedItem.contactDetail.industryId = null;
    this.selectedItem.accountType = 'I'
    this.alertMessage = '';

    this.validBasic = false;
    this.validContact = false;
    this.validExchanges = false;
    this.validModules = false;
    this.validUser = false;
    this.finalsave = false;

    if (!AppUtility.isEmptyArray(this.countryList)) {
      this.selectedItem.contactDetail.country = this.countryList[0].countryName;
      this.selectedItem.contactDetail.countryId = this.countryList[0].countryId;
    }

    if (!AppUtility.isEmptyArray(this.cityList)) {
      this.selectedItem.contactDetail.city = this.cityList[0].city;
      this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
    }

    if (!AppUtility.isEmptyArray(this.primaryExchangeList)) {
      this.primaryExchangeId = this.primaryExchangeList[0].exchangeId;
      this.unSelectAllItems(this.exchangeList);
    }

    if (!AppUtility.isEmptyArray(this.moduleList)) {
      this.unSelectAllItems(this.moduleList);
    }

    this.compulsoryError = false;

    this.selectedItem.user = new User;
    this.selectedItem.user.userId = null;
    this.selectedItem.user.email = '';
    this.selectedItem.user.dashboard = '';
    this.selectedItem.user.password = '';
    this.confirmPassword_ = '';
    this.confirmPasswordDU_ = '';
    this.selectedItem.user.status = '';
    this.selectedItem.user.active = false;
    this.selectedItem.user.userName = '';

    // this.selectedItem.user.participant = new Participant;
    // this.selectedItem.user.participant.participantId = null;
  }

  public onNewAction() {
    this.clearFields();
    //this.populateClientType();
    // this.populateClientControlAccount();
    this.showForm = true;
    this.basicTab.nativeElement.click();
    this.currentTab_ = 'BI';
    // this.cmbCityId.;
    // if (AppUtility.isValidVariable(this.cmbCityId))
    //   (<any>this.myForm).controls.cmbCityId.markAsPristine();
  }


  public onSearchAction() {
    this.populateItemGrid();
    // this.pageSize = 0;
  }

  public closeAlert() {
    this.compulsoryError = false;
  }

  public onCountryChangeEvent(slectedCountryId): void {
    this.populateCityListByCountry(slectedCountryId);
  }

  public onaccountTypeChangeEvent(selectedAccountType: string) {
    this.selectedItem.accountType = selectedAccountType;
  }

  public onTabChangeEvent(tabName: string) {
    this.currentTab_ = tabName;
  }

  public onExchangeChange(exch) {

  }

  // @ViewChild('basicTab') basicTab: ElementRef;
  // @ViewChild('contactTab') contactTab: ElementRef;
  // @ViewChild('modulesTab') modulesTab: ElementRef;
  // @ViewChild('exchangeTab') exchangeTab: ElementRef;
  // @ViewChild('systemAccessTab') systemAccessTab: ElementRef;


  // if (this.currentTab_ == 'BI') {
  //   if (this.validateBasic()) this.contactTab.nativeElement.click();
  // } else if (this.currentTab_ == 'CON') {
  //   if (this.validateContact()) this.exchangeTab.nativeElement.click();
  // } else if (this.currentTab_ == 'EA') {
  //   if (this.validateExchangeAssociation()) this.modulesTab.nativeElement.click();
  // } else if (this.currentTab_ == 'M') {
  //   if (this.validateModules()) this.systemAccessTab.nativeElement.click();
  // }

  public onPreviousAction() {
    if (this.currentTab_ == "CON") {
      this.basicTab.nativeElement.click();
      this.currentTab_ = "BI";
    }
    else if (this.currentTab_ == "EA") {
      this.contactTab.nativeElement.click();
      this.currentTab_ = "CON";
    }
    else if (this.currentTab_ == "M") {
      this.exchangeTab.nativeElement.click();
      this.currentTab_ = "EA";
    }
    else if (this.currentTab_ == "SA") {
      this.modulesTab.nativeElement.click();
      this.currentTab_ = "M";
    } else if(this.currentTab_ == "DU"){
      this.systemAccessTab.nativeElement.click();
      this.currentTab_ = "SA";
    }
  }

  unSelectAllItems(items) {
    for (let i = 0; i < items.length; i++) {
      items[i].selected = false;
      items[i].$checked = false;
    }
  }

  public onEditAction() {
    if (!AppUtility.isEmpty(this.itemsList.currentItem)) {
      this.clearFields();
      this.isEditing = true;
      this.basicTab.nativeElement.click();
      this.fromJSON(this.itemsList.currentItem);
      this.itemsList.editItem(this.itemsList.currentItem);

      this.cityId = this.selectedItem.contactDetail.cityId.valueOf();

      this.populateCityListByCountry(this.selectedItem.contactDetail.countryId);
      this.selectedItem.contactDetail.cityId = this.cityId;
      this.cmbCityId.invalidate();
    }
  }

  fromJSON(data: any) {
   
   //-------------------------------------------------------------
    this.selectedItem.depoUser.id = data.depoUser.id;
    this.selectedItem.depoUser.participant = data.depoUser.participant;
    this.selectedItem.depoUser.userName = data.depoUser.userName;
    this.selectedItem.depoUser.password = data.depoUser.password;
    //-------------------------------------------------------------
    this.selectedItemParticipantId = data.participantId;
    this.selectedItem.participantCode = data.participantCode;
    this.selectedItem.accountType = data.accountType == 'Individual' ? 'I' : 'C';
    this.selectedItem.active = data.active;
    this.isCustodian = data.participantType.description == 'Custodian';
    this.participantTypeID = data.participantType.participantTypeId;

    this.selectedItem.contactDetail.contactDetailId = data.contactDetail.contactDetailId;
    // if (this.selectedItem.accountType == 'I') {
    this.selectedItem.contactDetail.firstName = data.contactDetail.firstName;
    this.selectedItem.contactDetail.middleName = data.contactDetail.middleName;
    this.selectedItem.contactDetail.lastName = data.contactDetail.lastName;
    this.selectedItem.contactDetail.fatherHusbandName = data.contactDetail.fatherHusbandName;
    this.selectedItem.contactDetail.gender = data.contactDetail.gender;
    this.selectedItem.contactDetail.identificationTypeId = data.contactDetail.identificationTypeId;
    this.selectedItem.contactDetail.identificationType = data.contactDetail.identificationType;
    this.selectedItem.contactDetail.dob = new Date(data.contactDetail.dob);
    this.selectedItem.contactDetail.professionId = data.contactDetail.professionId;
    this.populateParticipantExchangeList(data.participantId);
    this.getParticipantUser(data.participantId);
    this.getParticipantModulesList(data.participantId)
    // }
    // else {
    this.selectedItem.contactDetail.companyName = data.contactDetail.companyName;
    this.selectedItem.contactDetail.registrationNo = data.contactDetail.registrationNo;
    this.selectedItem.contactDetail.industryId = data.contactDetail.industryId;
    // }

    this.selectedItem.contactDetail.countryId = data.contactDetail.countryId;
    this.selectedItem.contactDetail.cityId = data.contactDetail.cityId;
    this.selectedItem.contactDetail.address1 = data.contactDetail.address1;
    this.selectedItem.contactDetail.postalCode = data.contactDetail.postalCode;
    this.selectedItem.contactDetail.phone1 = data.contactDetail.phone1;
    this.selectedItem.contactDetail.cellNo = data.contactDetail.cellNo;
    this.selectedItem.contactDetail.email = data.contactDetail.email;

    this.primaryExchangeId = data.exchange.exchangeId;
  }

  private participantToJSON() {
    let temp: any = null;
    if (!this.isEditing) {
      temp = {
        'participant': {
          'participantId': null,//this.isEditing ? this.selectedItemParticipantId : null,
          'active': this.selectedItem.active,
          'participantCode': this.selectedItem.participantCode,
          'participantName': '',
          'accountType': this.selectedItem.accountType,
          'contactDetail': {
            'address1': this.selectedItem.contactDetail.address1,
            'cellNo': this.selectedItem.contactDetail.cellNo,
            'cityId': this.selectedItem.contactDetail.cityId,
            'companyName': this.selectedItem.contactDetail.companyName,
            'countryId': this.selectedItem.contactDetail.countryId,
            'dob': AppUtility.formatDate(this.selectedItem.contactDetail.dob),
            'email': this.selectedItem.contactDetail.email,
            'fatherHusbandName': this.selectedItem.contactDetail.fatherHusbandName,
            'firstName': this.selectedItem.contactDetail.firstName,
            'gender': this.selectedItem.contactDetail.gender,
            'lastName': this.selectedItem.contactDetail.lastName,
            'middleName': this.selectedItem.contactDetail.middleName,
            'phone1': this.selectedItem.contactDetail.phone1,
            'postalCode': this.selectedItem.contactDetail.postalCode,
            'registrationNo': this.selectedItem.contactDetail.registrationNo,
            'identificationTypeId': this.selectedItem.contactDetail.identificationTypeId,
            'identificationType': this.selectedItem.contactDetail.identificationType,
            'industryId': this.selectedItem.contactDetail.industryId,
            'professionId': this.selectedItem.contactDetail.professionId
          },

          'exchange': {
            'exchangeId': this.primaryExchangeId
          },

          'participantType': {
            'description': this.isCustodian ? 'Custodian' : 'Participant'
          }
        },
        'user': this.userToJSON(),
        'participantExchanges': this.participantExchangesToJSON(),
        'participantRolesPrivs': this.modulesToJSON(),
        //--------------------------------------
        'depoUser' : this.selectedItem.depoUser
        //------------------------------------
      }
    } else {
      temp = {
        'participantId': this.selectedItemParticipantId,
        'active': this.selectedItem.active,
        'participantCode': this.selectedItem.participantCode,
        'participantName': '',
        'accountType': this.selectedItem.accountType,
        'contactDetail': {
          'contactDetailId': this.selectedItem.contactDetail.contactDetailId,
          'address1': this.selectedItem.contactDetail.address1,
          'cellNo': this.selectedItem.contactDetail.cellNo,
          'cityId': this.selectedItem.contactDetail.cityId,
          'companyName': this.selectedItem.contactDetail.companyName,
          'countryId': this.selectedItem.contactDetail.countryId,
          'dob': AppUtility.formatDate(this.selectedItem.contactDetail.dob),
          'email': this.selectedItem.contactDetail.email,
          'fatherHusbandName': this.selectedItem.contactDetail.fatherHusbandName,
          'firstName': this.selectedItem.contactDetail.firstName,
          'gender': this.selectedItem.contactDetail.gender,
          'lastName': this.selectedItem.contactDetail.lastName,
          'middleName': this.selectedItem.contactDetail.middleName,
          'phone1': this.selectedItem.contactDetail.phone1,
          'postalCode': this.selectedItem.contactDetail.postalCode,
          'registrationNo': this.selectedItem.contactDetail.registrationNo,
          'identificationTypeId': this.selectedItem.contactDetail.identificationTypeId,
          'identificationType': this.selectedItem.contactDetail.identificationType,
          'industryId': this.selectedItem.contactDetail.industryId,
          'professionId': this.selectedItem.contactDetail.professionId
        },

        'exchange': {
          'exchangeId': this.primaryExchangeId
        },

        'participantType': {
          'participantTypeId': this.participantTypeID,
          'description': this.isCustodian ? 'Custodian' : 'Participant'
        }
      }
    }
    return temp;
  }

  private userToJSON(): any {
    return {
      'userId': this.selectedItem.user.userId,
      'email': this.selectedItem.user.email,
      'active': this.selectedItem.user.active,
      'dashboard': this.selectedItem.user.dashboard,
      'password': this.selectedItem.user.password,
      'userName': this.selectedItem.user.userName,
      'userType': this.isEditing ? this.selectedItem.user.userType : null,
      'userTypeId': this.isEditing ? this.selectedItem.user.userTypeId : null,
      'lookupId': this.isEditing ? this.selectedItem.user.lookupId : null,

      'participant': {
        'participantId': this.isEditing ? this.selectedItemParticipantId : null
        // 'contactDetail': {
        //   'contactDetailId': this.selectedItem.user.participant.contactDetail.contactDetailId
        // },
        // 'exchange': {
        //   'exchangeId': this.selectedItem.user.participant.exchange.exchangeId
        // }
      }
    }
  }

  private modulesToJSON() {
    let tempModule: any[] = [];
    if (AppUtility.isValidVariable(this.modules))
      tempModule = this.modules.checkedItems;

    let sendingArray: any[] = [];
    for (let i: number = 0; i < tempModule.length; i++) {
      sendingArray.push({
        'module': {
          'moduleId': tempModule[i].moduleId,
          'moduleName': tempModule[i].moduleName
        },
        'participant': {
          'participantId': this.isEditing ? this.selectedItemParticipantId : null
        }
      });
    }
    return sendingArray;
  }

  private participantExchangesToJSON() {
    let tempExchanges: any[] = [];
    if (AppUtility.isValidVariable(this.exchanges))
      tempExchanges = this.exchanges.checkedItems;

    let sendingArray: any[] = [];
    for (let i: number = 0; i < tempExchanges.length; i++) {
      sendingArray.push({
        'exchange': {
          'exchangeId': tempExchanges[i].exchangeId,
          'exchangeCode': tempExchanges[i].exchangeCode
        },
        'participant': {
          'participantId': this.isEditing ? this.selectedItemParticipantId : null
        }
      });
    }
    return sendingArray;
  }

 

  public onCancelAction() {

  }

  public onFinalSave() {
    this.compulsoryError = false;
    this.alertMessage = '';
    this.finalsave = true;
    this.validateBasic();
    this.validateContact();
    this.validateDepoUser();
    if (!this.isCustodian) {
      this.validateExchangeAssociation();
      this.validateModules();
      this.validateSystemAccess();
    }
  
  }

  //------------------------------------------------------------------

  private setSelectedTabForUpdate(){
     this.updatingBasic = this.currentTab_ === 'BI' ? true : false;
     this.updatingContact = this.currentTab_ === 'CON' ? true : false;
     this.updatingModules = this.currentTab_ === 'M' ? true : false;
     this.updatingExchangeAssocciation = this.currentTab_ === 'EA' ? true : false;
     this.updatingUsers = this.currentTab_ === 'SA' ? true : false;
     this.updatingDepoUser = this.currentTab_ === 'DU' ? true : false;
  }



  //-------------------------------------------------------------------
  
  public onUpdateBasic() {
    this.compulsoryError = false;
    this.alertMessage = '';
    this.validBasic = this.validateBasic();
    this.setSelectedTabForUpdate();
  }

  public onUpdateContact() {
    this.compulsoryError = false;
    this.alertMessage = '';
    this.updatingContact = true;
    this.validContact = this.validateContact();
    this.setSelectedTabForUpdate();
  }

  public onUpdateExchange() {
    this.compulsoryError = false;
    this.alertMessage = '';
    this.validExchanges = this.validateExchangeAssociation();
    this.updatingExchangeAssocciation = true;
    this.setSelectedTabForUpdate();
  }

  public onUpdateModules() {
    this.compulsoryError = false;
    this.alertMessage = '';
    this.validModules = this.validateModules();
    this.updatingModules = true;
    this.setSelectedTabForUpdate();
  }

  public onUpdateUser() {
    this.compulsoryError = false;
    this.alertMessage = '';
    this.validUser = this.validateSystemAccess();
    this.updatingUsers = true;
    this.setSelectedTabForUpdate();
  }

  public onUpdateDepoUser(){
    this.compulsoryError = false;
    this.alertMessage = '';
    this.validDepoUser = this.validateDepoUser();
    this.updatingDepoUser = true;
    this.setSelectedTabForUpdate();
  }

  public onCustodianSelected(costodianSelected: boolean) {
    if (!this.isCustodian) {
      this.alertMessage = '';
      this.compulsoryError = false;
    }
  }

  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (this.isEditing) {
      if (this.updatingExchangeAssocciation) {
        if (this.validExchanges) {
          this.loader.show();
          this.listingService.updateParticipantExchangeAssociation(this.participantExchangesToJSON()).subscribe(
            data => {
              this.loader.hide();
              // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
              this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
              this.dialogCmp.showAlartDialog('Success');
            },
            err => {
              this.loader.hide();
              if(err.message){
                this.errorMessage = err.message;
              } else {
                this.errorMessage = err;
              }
              this.dialogCmp.statusMsg = this.errorMessage;
              this.dialogCmp.showAlartDialog('Error');
            });
        }
      } else if (this.updatingModules) {
        if (this.validModules) {
          this.loader.show();
          this.listingService.updateParticipantModules(this.modulesToJSON()).subscribe(
            data => {
              this.loader.hide();
              // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
              this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
              this.dialogCmp.showAlartDialog('Success');
            },
            err => {
              this.loader.hide();
              if(err.message){
                this.errorMessage = err.message;
              } else {
                this.errorMessage = err;
              }
              this.dialogCmp.statusMsg = this.errorMessage;
              this.dialogCmp.showAlartDialog('Error');
            });
        }
      }
      else if (this.updatingUsers) {
        if (this.validUser) {
          this.loader.show();
          this.listingService.updateUser(this.userToJSON()).subscribe(
            data => {
              this.loader.hide();
              // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
              this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
              this.dialogCmp.showAlartDialog('Success');
              // this.hideModal();   //for hiding the modal.
            },
            err => {
              this.loader.hide();
              if(err.message){
                this.errorMessage = err.message;
              } else {
                this.errorMessage = err;
              }
              this.dialogCmp.statusMsg = this.errorMessage;
              this.dialogCmp.showAlartDialog('Error');
            });
        }
      } else if (this.updatingContact) {
        if (this.validContact) {
          this.loader.show();
          this.listingService.updateContact(this.participantToJSON()).subscribe(
            data => {
              this.loader.hide();
              // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
              this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
              this.dialogCmp.showAlartDialog('Success');
              this.onSearchAction();
              // this.hideModal();   //for hiding the modal.
              this.flex.refresh();
            },
            err => {
              this.loader.hide();
              if(err.message){
                this.errorMessage = err.message;
              } else {
                this.errorMessage = err;
              }
              this.dialogCmp.statusMsg = this.errorMessage;
              this.dialogCmp.showAlartDialog('Error');
            });
        }
      } else if(this.updatingDepoUser){
             if(this.validDepoUser){
               this.loader.show()
                const depoUserBO = this.selectedItem.depoUser;
                this.listingService.updateDepoUser(depoUserBO).subscribe(data => {
                  this.loader.hide();
                  this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                  this.dialogCmp.showAlartDialog('Success');
                  this.onSearchAction();
                  this.flex.refresh();

                },(error) => {
                   if(error.message){
                    this.dialogCmp.statusMsg = error.message;
                   } else {
                    this.dialogCmp.statusMsg = error;
                   }
                   this.dialogCmp.showAlartDialog('Error');
                });
             }
      }
       else if(this.updatingBasic){
        if (this.validBasic) {
          
          this.loader.show();
          this.listingService.updateParticipant(this.participantToJSON()).subscribe(
            data => {
              this.loader.hide();
              // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
              this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
              this.dialogCmp.showAlartDialog('Success');
              this.onSearchAction();
              // this.hideModal();   //for hiding the modal.
              this.flex.refresh();
            },
            err => {
              this.loader.hide();
              if(err.message){
                this.errorMessage = err.message;
              } else {
                this.errorMessage = err;
              }
              this.dialogCmp.statusMsg = this.errorMessage;
              this.dialogCmp.showAlartDialog('Error');
            });
        }
      }
    }
    // if not the editing case
    else {
      if (!this.compulsoryError) {
         this.selectedItem.depoUser.participant = null;
        this.loader.show();
        this.listingService.saveParticipant(this.participantToJSON()).subscribe(
          data => {
            this.loader.hide();
            console.log(JSON.stringify(data));
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');

            this.searchParticipantCode = data.participant.participantCode;
            this.searchParticipantName = '';
            this.searchParticipantType = data.participant.participantType.description == 'Custodian';
            this.onSearchAction();
            this.flex.refresh();
          },
          err => {
            this.loader.hide();
            if(err.message){
              this.errorMessage = err.message;
            } else {
              this.errorMessage = err;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
      }
     }
  }

  onNewPasswordChange(newValue) {
    this.changePasswordError = undefined;
    this.passwordStrength = this.measurer.measure(newValue);
  }

  public validateBasic() {
    this.markDirtBasic();
    let errorArray: string[] = [];
    if (!(<any>this.myForm).controls.participantCode.valid) errorArray.push('Participant Code');
    if (!(<any>this.myForm).controls.exchangeName.valid) errorArray.push('Primary Exchange');

    if (this.selectedItem.accountType != 'I') {
      if (!(<any>this.myForm).controls.companyName.valid) errorArray.push('Company Name');
      if (!(<any>this.myForm).controls.registrationNo.valid) errorArray.push('Registration Number');
    }
    else {
      if (!(<any>this.myForm).controls.firstName.valid) errorArray.push('First Name');
      if (!(<any>this.myForm).controls.middleName.valid) errorArray.push('Middle Name');
      if (!(<any>this.myForm).controls.lastName.valid) errorArray.push('Last Name');
      if (!(<any>this.myForm).controls.fatherHusbandName.valid) errorArray.push('Father/Husband Name');
      if (!(<any>this.myForm).controls.gender.valid) errorArray.push('Gender');
      if (!(<any>this.myForm).controls.identificationType.valid) errorArray.push('Identification Type');
      if (!(<any>this.myForm).controls.identificationNumber.valid) errorArray.push('Identification Number');
      if (!(<any>this.myForm).controls.profession.valid) errorArray.push('Profession');
    }

    if (errorArray.length > 0) {
      if (!this.isEditing && this.finalsave) {
        this.alertMessage = this.alertMessage.concat('Please enter valid ' + errorArray.join(", ") + ' on \'<b>Basic Tab</b>\'<br/>');
        this.compulsoryError = true;
      }
      return false;
    } else return true;
  }

  private markDirtBasic() {
    (<any>this.myForm).controls.participantCode.markAsDirty();
    (<any>this.myForm).controls.exchangeName.markAsDirty();
    if (this.selectedItem.accountType != 'I') {
      (<any>this.myForm).controls.companyName.markAsDirty();
      (<any>this.myForm).controls.registrationNo.markAsDirty();
    }
    else {
      (<any>this.myForm).controls.firstName.markAsDirty();
      (<any>this.myForm).controls.middleName.markAsDirty();
      (<any>this.myForm).controls.lastName.markAsDirty();
      (<any>this.myForm).controls.fatherHusbandName.markAsDirty();
      (<any>this.myForm).controls.gender.markAsDirty();
      (<any>this.myForm).controls.identificationType.markAsDirty();
      (<any>this.myForm).controls.identificationNumber.markAsDirty();
      (<any>this.myForm).controls.profession.markAsDirty();
    }
  }

  public validateContact() {
    this.markDirtyContact();
    let errorArray: string[] = [];
    if (!(<any>this.myForm).controls.countryId.valid) errorArray.push('Country');
    if (!(<any>this.myForm).controls.cityId.valid) errorArray.push('City');
    if (!(<any>this.myForm).controls.address.valid) errorArray.push('Address');
    if (!(<any>this.myForm).controls.postalCode.valid) errorArray.push('Postal Code');
    if (!(<any>this.myForm).controls.phone1.valid) errorArray.push('Phone Number');
    if (!(<any>this.myForm).controls.cellNo.valid) errorArray.push('Mobile Number');
    if (!(<any>this.myForm).controls.email.valid) errorArray.push('Email');

    if (errorArray.length > 0) {
      if (!this.isEditing && this.finalsave) {
        this.alertMessage = this.alertMessage.concat('Please enter valid ' + errorArray.join(", ") + ' on \'<b>Contact Tab</b>\'<br/>');
        this.compulsoryError = true;
      }
      return false;
    }
    else return true;
  }

  private markDirtyContact() {
    (<any>this.myForm).controls.countryId.markAsDirty();
    (<any>this.myForm).controls.cityId.markAsDirty();
    (<any>this.myForm).controls.address.markAsDirty();
    (<any>this.myForm).controls.postalCode.markAsDirty();
    (<any>this.myForm).controls.phone1.markAsDirty();
    (<any>this.myForm).controls.cellNo.markAsDirty();
    (<any>this.myForm).controls.email.markAsDirty();
  }

  public validateExchangeAssociation() {
    let index = this.exchanges.checkedItems.map(function (el) {
      return el.exchangeId;
    }).indexOf(this.primaryExchangeId);

    if (!this.isCustodian && this.exchanges.checkedItems.length === 0) {
      this.isExchangeEmpty = true;
      this.primaryExchangeSelectedError = false;
    } else {
      this.isExchangeEmpty = false;
      if (index == -1) {
        this.primaryExchangeSelectedError = true;
      } else {
        this.primaryExchangeSelectedError = false;
      }
    }

    if (this.isExchangeEmpty) {
      if (!this.isEditing && this.finalsave) {
        this.alertMessage = this.alertMessage.concat('Please select at least 1 Associated Exchange on \'<b>Exchange Association Tab</b>\'<br/>');
        this.compulsoryError = true;
      }
      return false;
    }

    if (!this.isCustodian && this.primaryExchangeSelectedError) {
      if (!this.isEditing && this.finalsave) {
        this.alertMessage = this.alertMessage.concat('Primary Exchange must be selected as Associated Exchanges on \'<b>Exchange Association Tab</b>\'<br/>');
        this.compulsoryError = true;
      }
      return false;
    }
    else return true;
  }

  public onExchangesCheckedEvent(exchageIds: any) {
    if (this.exchanges.checkedItems.length > 0) {
      this.isExchangeEmpty = false;
      let index = this.exchanges.checkedItems.map(function (el) {
        return el.exchangeId;
      }).indexOf(this.primaryExchangeId);

      if (index == -1) this.primaryExchangeSelectedError = true;
      else this.primaryExchangeSelectedError = false;
    }
    else {
      this.isExchangeEmpty = true;
      this.primaryExchangeSelectedError = false;
    }
    debugger
  }

  public validateModules() {
    this.markDirtyModules();
    if (this.isModuleEmpty) {
      if (!this.isEditing && this.finalsave) {
        this.alertMessage = this.alertMessage.concat('Please select at least 1 Module on \'<b>Modules Tab</b>\'<br/>');
        this.compulsoryError = true;
      } return false;
    }
    else return true;
  }

  private markDirtyModules() {
    if (this.modules.checkedItems.length === 0) {
      this.isModuleEmpty = true;
    } else {
      this.isModuleEmpty = false;
    }
  }

  public validateSystemAccess() {
    this.markDirtySystemAccess();

    let errorArray: string[] = [];
    if (!(<any>this.myForm).controls.userName.valid) errorArray.push('User Name');
    if (!this.isEditing) {
      if (!(<any>this.myForm).controls.password.valid) errorArray.push('Password');
      if (!(<any>this.myForm).controls.confirmPassword.valid) errorArray.push('Confirm Password');
    }
    if (!(<any>this.myForm).controls.userEmail.valid) errorArray.push('Email');

    if (errorArray.length > 0) {
      if (!this.isEditing && this.finalsave) {
        this.alertMessage = this.alertMessage.concat('Please enter valid ' + errorArray.join(", ") + ' on \'<b>System Access Tab</b>\'<br/>');
        this.compulsoryError = true;
      } return false;
    } else return true;
  }

  //------------------------------------

  private markDirtyDepoUser() {
    console.log(this.myForm.controls.usernameDU);
    (<any>this.myForm).controls.usernameDU.markAsDirty();
    if (!this.isEditing) {
      (<any>this.myForm).controls.passwordDU.markAsDirty();
      (<any>this.myForm).controls.confirmPasswordDU.markAsDirty();
    }
  }

  public validateDepoUser() {
    this.markDirtyDepoUser();

    let errorArray: string[] = [];
    if (!(<any>this.myForm).controls.usernameDU.valid) errorArray.push('User Name');
    if (!this.isEditing) {
      if (!(<any>this.myForm).controls.passwordDU.valid) errorArray.push('Password');
      if (!(<any>this.myForm).controls.confirmPasswordDU.valid) errorArray.push('Confirm Password');
    }
 

    if (errorArray.length > 0) {
      if (!this.isEditing && this.finalsave) {
        this.alertMessage = this.alertMessage.concat('Please enter valid ' + errorArray.join(", ") + ' on \'<b>Depo User Tab</b>\'<br/>');
        this.compulsoryError = true;
      } return false;
    } else return true;
  }

  //---------------------------------
  private markDirtySystemAccess() {
    (<any>this.myForm).controls.userName.markAsDirty();
    if (!this.isEditing) {
      (<any>this.myForm).controls.password.markAsDirty();
      (<any>this.myForm).controls.confirmPassword.markAsDirty();
    }
    (<any>this.myForm).controls.userEmail.markAsDirty();
  }


  public onNextAction() {
    this.finalsave = false;
    if (this.currentTab_ == 'BI') {
      if (this.validateBasic()) this.contactTab.nativeElement.click();
    } else if (this.currentTab_ == 'CON') {
      if (this.validateContact()) this.exchangeTab.nativeElement.click();
    } else if (this.currentTab_ == 'EA') {
      if (this.validateExchangeAssociation()) this.modulesTab.nativeElement.click();
    } else if (this.currentTab_ == 'M') {
      if (this.validateModules()) this.systemAccessTab.nativeElement.click();
    } else if (this.currentTab_ == 'SA'){
      if(this.validateSystemAccess()) this.depoUserTab.nativeElement.click();
    }
    
  }
  // modulesTab
  private populateItemGrid() {
    this.loader.show();
    this.listingService.getParticipantListbyCodeNameType(this.searchParticipantCode, this.searchParticipantName, this.searchParticipantType)
      .subscribe(
        restData => {
          this.loader.hide();
          this.itemsList = new wjcCore.CollectionView(restData);
          this._pageSize = 0;
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');

        });
  }

  private populateCityListByCountry(countryId: Number) {
    var city: City = new City();
    city.cityId = AppConstants.PLEASE_SELECT_VAL;
    city.cityName = AppConstants.PLEASE_SELECT_STR;

    const cityCombo: FormControl = (<any>this.myForm).controls.cityId;
    if (AppUtility.isEmpty(countryId)) {
      this.cityList = [];
      this.cityList.unshift(city);
      cityCombo.reset();
    } else {
      this.loader.show();
      this.listingService.getCityListByCountry(countryId)
        .subscribe(
          restData => {
            this.loader.hide();
            if (AppUtility.isEmpty(restData)) {
              this.cityList = [];
              this.selectedItem.contactDetail.cityId = null;
              this.selectedItem.contactDetail.city = null;
            }
            else {
              this.cityList = restData;
              if (!AppUtility.isEmptyArray(this.cityList)) {
                if (!this.isEditing) {
                  this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
                  this.selectedItem.contactDetail.city = this.cityList[0].cityName;
                }
              }

            }
            this.cityList.unshift(city);
          },
          error => { this.loader.hide(); this.errorMessage = <any>error.message; },
          () => {
            cityCombo.reset();
          }
        );
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

          this.selectedItem.contactDetail.countryId = this.countryList[0].countryId;
          this.selectedItem.contactDetail.country = this.countryList[0].countryName;
          if (this.countryList[0].countryId != null)
            this.populateCityListByCountry(this.countryList[0].countryId);
        },
        error => {
          this.loader.hide(); this.errorMessage = <any>error.message
            , () => {
            }
        });
  }

  private getParticipantModulesList(participantId: number) {
    this.loader.show();
    this.listingService.getParticipantModulesList(participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            if (!AppUtility.isEmptyArray(restData)) {
              this.participantModulesList = restData;
              let tempArray: any[] = restData;
              for (let i: number = 0; i < tempArray.length; i++) {
                let index = this.moduleList.map(function (el) {
                  return el.moduleId;
                }).indexOf(tempArray[i].moduleId);
                this.moduleList[index].$checked = true;
              }
            }
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message });
  }

  private populateModulesList() {
    this.loader.show();
    this.listingService.getModulesList()
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            this.moduleList = restData;
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message });
  }

  private populateExchangeList() {
    this.loader.show();
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.exchangeList = restData;
          this.primaryExchangeList = null;
          this.primaryExchangeList = JSON.parse(JSON.stringify(restData));
          let cs: Exchange = new Exchange();
          cs.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          cs.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          this.primaryExchangeList.unshift(cs);

        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
        });
  }

  private populateParticipantExchangeList(participantId: number) {
    this.particpantExchangeList = [];
    this.loader.show();
    this.listingService.getParticipantExchangeList(participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (!AppUtility.isEmptyArray(restData)) {
            this.particpantExchangeList = restData;
            let tempArray: any[] = restData;
            for (let i: number = 0; i < tempArray.length; i++) {
              let index = this.exchangeList.map(function (el) {
                return el.exchangeId;
              }).indexOf(tempArray[i].exchangeId);
              this.exchangeList[index].$checked = true;
            }
          }
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
        });
  }

  private getParticipantUser(participantId: number) {
    this.loader.show();
    this.listingService.getParticipantUser(participantId, 2)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isValidVariable(restData)) {
            let temp: any = restData[0];
            this.selectedItem.user.userId = temp.userId;
            this.selectedItem.user.dashboard = temp.dashboard;
            this.selectedItem.user.userName = temp.userName;
            this.selectedItem.user.email = temp.email;
            this.selectedItem.user.password = temp.password;
            this.selectedItem.user.active = temp.active;
            this.selectedItem.user.userType = temp.userType;
            this.selectedItem.user.userTypeId = temp.userTypeId;
            this.selectedItem.user.lookupId = temp.lookupId;
            this.selectedItem.user.participant = temp.participant.participantId;
            // this.selectedItem.user.participant.contactDetail.contactDetailId = temp.participant.contactDetail.contactDetailId;
            // this.selectedItem.user.participant.exchange.exchangeId = temp.participant.exchange.exchangeId;
          }
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
        });

  }

  private populateProfessionList() {
    this.loader.show();
    this.listingService.getProfessionList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.professionList = restData;

          var profession: Profession = new Profession();
          profession.professionId = AppConstants.PLEASE_SELECT_VAL;
          profession.professionCode = AppConstants.PLEASE_SELECT_STR;
          this.professionList.unshift(profession);
          this.selectedItem.contactDetail.professionId = this.professionList[0].professionId;
        },
        error => {
          this.loader.hide(); this.errorMessage = <any>error.message
            , () => {
            }
        });
  }

  private populateIdentificationTypeList() {
    this.loader.show();
    this.listingService.getIdentificationTypeList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.identificationTypeList = restData;

          var identificationType: IdentificationType = new IdentificationType();
          identificationType.identificationTypeId = AppConstants.PLEASE_SELECT_VAL;
          identificationType.identificationType = AppConstants.PLEASE_SELECT_STR;
          this.identificationTypeList.unshift(identificationType);
          this.selectedItem.contactDetail.identificationTypeId = this.identificationTypeList[0].identificationTypeId;
        },
        error => {
          this.loader.hide(); this.errorMessage = <any>error.message
            , () => {
            }
        });
  }

  private populateIndustryList() {
    this.loader.show();
    this.listingService.getIndustryList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.industryList = restData;

          var industry: Industry = new Industry();
          industry.industryId = AppConstants.PLEASE_SELECT_VAL;
          industry.industryName = AppConstants.PLEASE_SELECT_STR;
          this.industryList.unshift(industry);
          this.selectedItem.contactDetail.industryId = this.industryList[0].industryId;
        },
        error => {
          this.loader.hide(); this.errorMessage = <any>error.message
            , () => {
            }
        });
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      searchParticipantName: [''],
      searchParticipantCode: [''],
      searchParticipantType: [''],
      active: [''],
      custodian: [''],
      participantCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      exchanges: [''],
      exchangeName: ['', Validators.compose([Validators.required])],
      modules: [''],

      firstName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      middleName: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternString)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      fatherHusbandName: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternString)])],
      gender: ['', Validators.compose([Validators.required])],
      identificationType: [''],
      identificationNumber: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      dob: [''],
      profession: [''],

      companyName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      registrationNo: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      industry: [''],

      countryId: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      postalCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternStringPostalCode)])],
      phone1: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternNumeric)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternEmail)])],
      cellNo: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternNumeric)])],


      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, PasswordValidators.repeatCharacterRegexRule(4),
      PasswordValidators.alphabeticalCharacterRule(1),
      PasswordValidators.digitCharacterRule(1),
      PasswordValidators.lowercaseCharacterRule(1),
      PasswordValidators.uppercaseCharacterRule(1)])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      userEmail: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternEmail)])],
      activeUser: [''],
      usernameDU : ['',Validators.compose([Validators.required])],
      passwordDU : ['',Validators.compose([Validators.required, PasswordValidators.repeatCharacterRegexRule(4),
        PasswordValidators.alphabeticalCharacterRule(1),
        PasswordValidators.digitCharacterRule(1),
        PasswordValidators.lowercaseCharacterRule(1),
        PasswordValidators.uppercaseCharacterRule(1)])],
      confirmPasswordDU : ['',Validators.compose([Validators.required])]
    });
  }

  public hideModal() {
    jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success') {
      this.onNewAction();
      this.hideModal();
    }
  }
}
