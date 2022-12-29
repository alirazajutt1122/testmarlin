'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { TranslateService } from '@ngx-translate/core';
import { Client } from 'app/models/client';
import { ClientBankAccount } from 'app/models/client-bank-account';
import { ClientJointAccount } from 'app/models/client-joint-account';
import { ClientDocument } from 'app/models/client-document';
import { ClientExchange } from 'app/models/client-exchange';
import { DialogCmp } from '../../back-office/user-site/dialog/dialog.component';
import { PasswordStrengthMeasurer } from 'app/util/PasswordStrengthMeasurer';

import { AppState } from 'app/app.service';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { AppConstants, AppUtility, UserTypes } from 'app/app.utility';
import { ContactDetail } from 'app/models/contact-detail';
import { Bank } from 'app/models/bank';
import { BankBranch } from 'app/models/bank-branches';
import { Agent } from 'app/models/agent';
import { ChartOfAccount } from 'app/models/chart-of-account';
import { Participant } from 'app/models/participant';
import { CommissionSlabMaster } from 'app/models/commission-slab-master';
import { ParticipantBranch } from 'app/models/participant-branches';
import { User } from 'app/models/user';
import { Exchange } from 'app/models/exchange';
import { IdentificationType } from 'app/models/identification-type';
import { Profession } from 'app/models/profession';
import { Industry } from 'app/models/industry';
import { Country } from 'app/models/country';
import { ParticipantExchange } from 'app/models/participant-exchanges';
import { ExchangeMarket } from 'app/models/exchange-market';
import { City } from 'app/models/city';
import { PasswordValidators } from 'ng2-validators';
import { ClientCustodian } from 'app/models/client-custodian';
import { ClientMarket } from 'app/models/client-market';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { DialogCmpRegistration } from '../dialog-cmp-registration/dialog-cmp-registration';
import { Beneficiary } from 'app/models/beneficiary';
import { AuthService2 } from 'app/services/auth2.service';
import { AccountCategory } from 'app/models/account-category';
import { IncomeSource } from 'app/models/income-source';
import { ClientAppliedLevy } from 'app/models/client-applied-levy';
import { ListingService } from 'app/services/listing.service';
import { Relation } from 'app/models/relation';
import { ClientLevieMaster } from 'app/models/client-levy-master';
import { Provinces } from 'app/models/Province';
import { DocumentType } from 'app/models/document-type';
import { AccountType } from 'app/models/account-type';
import { CollectionView, SortDescription, IPagedCollectionView, } from '@grapecity/wijmo';
import { ActivatedRoute, Router } from '@angular/router';
import { InvestorRegistrationDepositry } from 'app/models/investor_registration_depo';
import { isEmpty } from 'lodash';
import { OrderCancel } from '../../oms/order/order-cancel/order-cancel';
import { InvestorDividendDetail } from 'app/models/investor-dividend-details';
import { InvestorJointAccountDetail } from 'app/models/investor-joint-account';
import { InvestorSuccessorAccountDetail } from 'app/models/investor-successor-detail';
import { InvestorDocumentDepo } from 'app/models/investor-document-depo';
import { ResidenceStatus } from 'app/models/residenceStatus';
import { InvCDCStatus } from 'app/models/inv-cdc-status';
import { Market } from 'app/models/market';
import { LevieDetail } from 'app/models/levy-detail';
import { OnlineAccountRegistration } from '../online-account-registration/online-account-registration';
var downloadAPI = require('../../../../scripts/download-document');
declare var jQuery: any;

@Component({
  selector: 'online-account-activation',
  templateUrl: './online-account-activation.html',
  encapsulation: ViewEncapsulation.None
})
export class OnlineAccountActivation implements OnInit {

  public myForm: FormGroup;

  @Input() isDashBoard: string;

  public bankDetailForm: FormGroup;
  public beneficiaryForm: FormGroup;
  public jointAccountForm: FormGroup;
  public clientExchangeForm: FormGroup;
  public documentForm: FormGroup;
  public allowedMarketForm: FormGroup;
  public clientCustodianForm: FormGroup;
  itemsList: wjcCore.CollectionView;
  itemsBanAccountList: wjcCore.CollectionView;
  itemsBeneficiaryList: wjcCore.CollectionView;
  itemsJointAccountList: wjcCore.CollectionView;
  itemsClientExchangeList: wjcCore.CollectionView;
  itemsDocumentList: wjcCore.CollectionView;
  itemsAllowedMarketList: wjcCore.CollectionView;
  itemsClientCustodianList: wjcCore.CollectionView;

  selectedItem: Client;
  selectedAccountItem : Client;

  
  beneficiarySelectedIndex : number = 0;
  bankSelectedIndex : number = 0;
  documentsSelectedIndex : number = 0;
  jointSelectedIndex : number = 0;

  selectedBankAccountItem: ClientBankAccount;
  selectedJointAccountItem: ClientJointAccount;
  selectedClientDocument: ClientDocument;
  selectedClientExchange: ClientExchange;
  selectedDepositoryItem: InvestorRegistrationDepositry;
  invCDCStatus: InvCDCStatus[];

  errorMessage: string;
  selectedIndex: number = 0;

  commissionSlabList: any[];
  participantBranchList: any[];
  agentList: any[];
  accountTypeInvestorList: any[];
  participantsList: any[];
  documentTypes: any[];
  exchangeList: any[];
  marketList: any[];
  custodianList: any[];
  clientMarket: any[];
  clientCustodian: any[];
  genderList: any[];
  residenceStatusList: any[];
  riskList: any[];
  identificationTypeList: any[];
  professionList: any[];
  industryList: any[];
  countryList: any[];
  cityList: any[];
  bankList: any[];
  bankBranchList: any[];
  leviesList: any[] = [];
  selectedLevies: any[];
  itemsLeviesList: wjcCore.CollectionView;
  today: Date = new Date();
  incomeSourceList: any[];
  relationList: any[];
  provinceList: any[];
  //  districtList: any[];
  beneficiaryList: any[];
  selectedBeneficiaryItem: Beneficiary;
  selectedFileName: any
  selectedProfessionId : Number = null;

  public showForm = false;
  public isSubmitted = false;
  public isSubmittedBankAccount = false;
  public isSubmittedJointAccount = false;
  public isSubmittedDocumentForm = false;
  public isSubmittedClientExchange = false;
  public isSubmittedBeneficiary: boolean = false;
  public fileSizeExceed = false;
  public fileSelectionMsgShow = false;
  public marginPerExceed = true;

  public isEditing: boolean;
  public isEditingBankDetail: boolean;
  public isEditingBeneficiaryDetail: boolean;
  public isEditingClientExchange = false;

  public searchInvestorTaxNumber: string = "";
  public searchInvestorName: string = "";
  public glCodeLength_: number = 25;
  public incomeSourcee: string = "";

  public showIndividual = false;
  public showCorporate = false;
  public showJoint = false;
  public showOnlineAccess = false;
  public showTrustee = false;

  public glCode_: String = "";
  public coaCode_: String = "";
  private clientControlChartOfAccountCode_: String = "";
  public coaId_: Number;
  private _pageSize = 0;
  public confirmPassword_: String = "";
  public currentTab_ = "AC";

  private file_srcs: string[] = [];
  accountCategoryList: any[];

  public fileName_: String = "";
  private fileContentType_: String = "";
  //claims: any;
  public selectedCityId: number
  public selectedProvinceId: number
  public deleteClientExchangeAction: boolean = false;
  //public selectedProvinceId: number;
  //public selectedDistrictId: number;
  public selectedRelationId: number;
  public bCnicValid: Boolean = true;
  public clientCodeForInvReg: String = "";
  public statusCodeForInvReg: String = "";
  public itemClientId: Number = null;
  public isDisabledUpdate : boolean = false;
  public isDisabledFields : boolean = false;


  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('bankAccountGrid') bankAccountGrid: wjcGrid.FlexGrid;
  @ViewChild('documentGrid') documentGrid: wjcGrid.FlexGrid;
  @ViewChild('flexCustodian') flexCustodian: wjcGrid.FlexGrid;
  @ViewChild('flexAllowedMarket') flexAllowedMarket: wjcGrid.FlexGrid;
  @ViewChild('jointAccountGrid') jointAccountGrid: wjcGrid.FlexGrid;
  @ViewChild('clientExchangeGrid') clientExchangeGrid: wjcGrid.FlexGrid;
  @ViewChild('beneficiaryGrid') beneficiaryGrid: wjcGrid.FlexGrid;
  @ViewChild('cmbCityId') cmbCityId: wjcInput.ComboBox;
  @ViewChild('clientCode') clientCode: wjcInput.InputMask;
  @ViewChild('reference') reference: wjcInput.InputMask;
  @ViewChild('commissionSlabId') commissionSlabId: wjcInput.ComboBox;
  @ViewChild('cmbLevy') cmbLevy: wjcInput.MultiSelect;
  //@ViewChild('cmbDistrictId') cmbDistrictId: wjcInput.ComboBox;
  @ViewChild('cmbRelationId') cmbRelationId: wjcInput.ComboBox;

  @ViewChild('BIAnchorTag') BIAnchorTag: ElementRef;
  @ViewChild('CONAnchorTag') CONAnchorTag: ElementRef;
  @ViewChild('SAAnchorTag') SAAnchorTag: ElementRef;
  @ViewChild('JAAnchorTag') JAAnchorTag: ElementRef;
  @ViewChild('CRSAnchorTag') CRSAnchorTag: ElementRef;
  @ViewChild('AMAnchorTag') AMAnchorTag: ElementRef;
  @ViewChild('CUAnchorTag') CUAnchorTag: ElementRef;
  @ViewChild('BAAnchorTag') BAAnchorTag: ElementRef;
  @ViewChild('DOCAnchorTag') DOCAnchorTag: ElementRef;
  @ViewChild('BENAnchorTag') BENAnchorTag: ElementRef;
  @ViewChild('ACAnchorTag') ACAnchorTag: ElementRef;

  @ViewChild('dialogCmp') dialogCmp: DialogCmp;

  @ViewChild('beneficiaryDeleteDlg',{ static: false }) beneficiaryDeleteDlg: wjcInput.Popup;
  @ViewChild('bankDeleteDlg',{ static: false }) bankDeleteDlg: wjcInput.Popup;
  @ViewChild('documentDeleteDlg',{ static: false }) documentDeleteDlg: wjcInput.Popup;
  @ViewChild('jointDeleteDlg',{ static: false }) jointDeleteDlg: wjcInput.Popup;

  @ViewChild('active1') active1: ElementRef;
  @ViewChild('clientType') clientType: ElementRef;
  @ViewChild('accountType') accountType: ElementRef;
  @ViewChild('participant') participant: ElementRef;
  @ViewChild('taxNumberField') taxNumberField: wjcInput.InputMask;
  @ViewChild('countryCombo') countryCombo: wjcInput.ComboBox;
  @ViewChild('statesCombo') statesCombo: wjcInput.ComboBox;

  @ViewChild(OnlineAccountRegistration) onlineAccountRegistration : OnlineAccountRegistration;




  //@ViewChild('progressBar') progressBar:ElementRef;
  private fileInput_: any;
  modal = true;
  private changePasswordError: string;
  private measurer: PasswordStrengthMeasurer = new PasswordStrengthMeasurer();
  private passwordStrength = 0;
  lang: string;
  clientExchangeId: Number;
  clientExchangeName: String;
  InvestorClientId: Number = null;
  showSelectForParticpantsBranch: Boolean = true;
  loggedInUserType: String = "";
  public userType = UserTypes;
  public isShowInvestorForm: Boolean = false;
  public showApprove: Boolean = false;
  public showReject: Boolean = false;
  public investorNameForAR: String = "";
  public showParticipantBasedGrid: Boolean = false;
  public clientIdForAR: Number = null;
  public statusCodeForAR: String = '';
  public selectedParticipantBranchId: Number = null;
  public selectedCountryId: Number = null;
  public selectedAccTypeId: Number = null;
  public selectedAgentId : Number = null;
  public selectedParticipantId : Number = null;
  public beneficiaryDeleteMsg : String = "";
  public bankDeleteMsg : String = "";
  public documentDeleteMsg : String = "";
  public jointDeleteMsg : String = "";

  glCodeDisplayName_: String;
  glDescription_: String;
  headLevel_: Number;
  leaf_: Boolean;
  parentChartOfAccountId_: Number;
  parentGlCode_: String;
  parentGlDesc_: String;
  chartOfAccountParticipant_: Participant;
  chartofAccountId_: Number;
  glFamily_: any;
 
  participantGlCode: String = "";
  isDisabledButtons : boolean = false;
  disabledTradConfigFields : boolean = false;

  public statusDraft : String = "";
  public statusSubmitted : String = "";
  public statusRejected : String = "";
  public statusRegistered : String = "";
  public statusActive : String = "";
  public statusPending : String = "";
  public selectedIdentificationTypeId : number = null;

  public tabFocusChanged1() {
    this.active1.nativeElement.focus();
  }

  public tabFocusChanged2() {
    this.commissionSlabId.focus();
  }

  public tabFocusChanged3() {
    this.clientType.nativeElement.focus();
  }

  public tabFocusChanged4() {
    this.reference.focus();
  }

  public tabFocusChanged5() {
    this.accountType.nativeElement.focus();
  }
  constructor(private appState: AppState, private changeDetectorRef: ChangeDetectorRef, private listingService: ListingService, private _fb: FormBuilder,
    public userService: AuthService2, private translate: TranslateService, private splash: FuseLoaderScreenService, public router: ActivatedRoute, public route: Router) {
       
    //this.claims = authService.claims;
    this.clearFields();
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.isEditingBankDetail = false;
    this.isSubmittedBankAccount = false;
    this.isSubmittedJointAccount = false;
    this.isSubmittedDocumentForm = false;
    this.isSubmittedClientExchange = false;
    this.isEditingClientExchange = false;
    this.isSubmittedBeneficiary = false;
    this.isEditingBeneficiaryDetail = false;
    this.itemsList = new wjcCore.CollectionView();
    this.itemsDocumentList = new wjcCore.CollectionView();
    this.itemsBeneficiaryList = new wjcCore.CollectionView();
    this.itemsJointAccountList = new wjcCore.CollectionView();
    this.itemsBanAccountList = new wjcCore.CollectionView();
    this.selectedDepositoryItem = new InvestorRegistrationDepositry();
    this.loggedInUserType = AppConstants.userType;

    this.beneficiaryDeleteMsg = AppConstants.BENEFICIARY_ITEM_DELETE_MSG;
    this.bankDeleteMsg = AppConstants.BANK_ITEM_DELETE_MSG;
    this.documentDeleteMsg = AppConstants.DOCUMENT_ITEM_DELETE_MSG;
    this.jointDeleteMsg = AppConstants.JOINT_ITEM_DELETE_MSG;

    this.statusDraft = AppConstants.INV_STATUS_DRAFT;
    this.statusSubmitted = AppConstants.INV_STATUS_SUBMITTED;
    this.statusRegistered = AppConstants.INV_STATUS_REGISTERED;
    this.statusRejected = AppConstants.INV_STATUS_REJECTED;
    this.statusPending = AppConstants.INV_STATUS_PENDING;
    this.statusActive = AppConstants.INV_STATUS_ACTIVE



    let x;
    this.router.paramMap.subscribe(params => {
      x = params.get('action');
      if (x === "participant") {
        this.showParticipantBasedGrid = true;
      }
      if (x === "user") {
        this.showParticipantBasedGrid = false;
        this.isShowInvestorForm = true;
      }


    });




    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________


  }

  ngOnInit() {

    this.addFromValidations();
    this.populateParticipants();
    this.populateAccountTypeInvestor();
    this.populateAccountCategoryList();
    this.populateResidenceStatusList();
    this.populateRelationList();
    this.populateDocumentTypes();
  //  this.populateIdentificationTypeList();
    this.populateProfessionList();
    this.populateIndustryList();
    this.populateCountryList();
    this.populateIncomeSourceList();
    this.populateClientControlAccount();
    this.loadLeveisByParticipant();
    this.populateCommissionSlabList();
    this.changePasswordError = undefined;
    this.passwordStrength = 0;


    switch (this.lang) {
      case 'en':
        this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Male", "code": "M" }, { "name": "Female", "code": "F" }]
        //  this.residenceStatusList = [{"id" : null,  "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, {"id" : 4, "name": "Angolian", "code": "ANG" }, {"id" : 1, "name": "Foreigner", "code": "FOR" }, {"id" : 2, "name": "Other", "code": "O" },{"id" : 3, "name": "NON RESIDENT Angolian", "code": "NRA" },{"id" : 5, "name": "RESIDENT Angolian", "code": "RA" }, {"id" : 6, "name": "NON RESIDENT FOREIGNER", "code": "NRF" }]
        this.riskList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "High", "code": "H" }, { "name": "Medium", "code": "M" }, { "name": "Low", "code": "L" }]
        break;
      case 'pt':
        this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Macho", "code": "M" }, { "name": "Fêmea", "code": "F" }]
        //  this.residenceStatusList = [{"id" : null,  "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, {"id" : 4, "name": "Angolano", "code": "ANG" }, {"id" : 1, "name": "Estrangeiro", "code": "FOR" }, {"id" : 2, "name": "Outro", "code": "O" },{"id" : 3, "name": "NÃO RESIDENTE Angolano", "code": "NRA" },{"id" : 5, "name": "RESIDENTE Angolano", "code": "RA" }, {"id" : 6, "name": "ESTRANGEIRO NÃO RESIDENTE", "code": "NRF" }]
        this.riskList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Alta", "code": "H" }, { "name": "Média", "code": "M" }, { "name": "Baixo", "code": "L" }]
        break;
      default:
        this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Male", "code": "M" }, { "name": "Female", "code": "F" }]
        //  this.residenceStatusList = [{"id" : null,  "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, {"id" : 4, "name": "Angolian", "code": "ANG" }, {"id" : 1, "name": "Foreigner", "code": "FOR" }, {"id" : 2, "name": "Other", "code": "O" },{"id" : 3, "name": "NON RESIDENT Angolian", "code": "NRA" },{"id" : 5, "name": "RESIDENT Angolian", "code": "RA" }, {"id" : 6, "name": "NON RESIDENT FOREIGNER", "code": "NRF" }]
        this.riskList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "High", "code": "H" }, { "name": "Medium", "code": "M" }, { "name": "Low", "code": "L" }]
    }



    // Populate Bank List in DropDown.
    if (AppConstants.participantId !== null) {
      this.populateBankList(AppConstants.participantId, true);
    }


    // Add form Validations


    if (this.isDashBoard) {
      this.searchInvestorTaxNumber = '';
      this.searchInvestorName = '';
      this.populateItemGrid();
    }

    if (AppConstants.participantId === null) {
      this.onGetDraft();
    }


    this.populateLoginDetails();




  }

  ngAfterViewInit() {


    this.onTabChangeEvent("AC");
    let x;
    this.router.paramMap.subscribe(params => {
      x = params.get('action');
      if (x === "participant") {
        this.showParticipantBasedGrid = true;
        this.isShowInvestorForm = false;
        this.onSearchAction();
      }
      if (x === "user") {
        this.showParticipantBasedGrid = false;
        this.isShowInvestorForm = true;
      }


    });


  }








  public showBeneficiaryDeleteConfirmation=()=>{
     
    this.showDialog(this.beneficiaryDeleteDlg);
}



public showBankDeleteConfirmation=()=>{
 
    this.showDialog(this.bankDeleteDlg);
}


public showDocumentDeleteConfirmation=()=>{
 
    this.showDialog(this.documentDeleteDlg);
}

public showJointDeleteConfirmation=()=>{
 
    this.showDialog(this.jointDeleteDlg);
}



showDialog(dlg: wjcInput.Popup) {
  if (dlg) {
    let inputs = <NodeListOf<HTMLInputElement>>dlg.hostElement.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].type !== 'checkbox') {
        inputs[i].value = '';
      }
    }

    dlg.modal = this.modal;
    dlg.hideTrigger = dlg.modal ? wjcInput.PopupTrigger.None : wjcInput.PopupTrigger.Blur;

    dlg.show();
  }
};





  populateLoginDetails = () => {

    this.selectedItem.contactDetail.firstName = AppConstants.INV_FIRST_NAME;
    this.selectedItem.contactDetail.lastName = AppConstants.INV_LAST_NAME;
    this.selectedItem.contactDetail.email = AppConstants.INV_EMAIL;
    this.selectedItem.contactDetail.cellNo = AppConstants.INV_MOBILE_NUMBER;
    this.selectedItem.contactDetail.countryId = AppConstants.INV_COUNTRY_ID;
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


  public onChangeParticipants = (event) => {
    if (AppUtility.isValidVariable(event)) {
      this.participantsList.find(element => {
        if (element.participantId === event) {
          this.populateParticipantBranchList(element.participantId);
          this.populateAgentList(element.participantId);
          this.populateBankList(element.participantId, true);
          this.clientExchangeId = element.exchange.exchangeId;
          this.clientExchangeName = element.exchange.exchangeName;

        }

      });
    }
  }




  public onChangeAccountTypeInvestor = (event) => {

    if (AppUtility.isValidVariable(event)) {
      if (event === AppConstants.ACCOUNT_TYPE_INDIVIDUAL_ID || event === AppConstants.ACCOUNT_TYPE_INDIVIDUAL_INSTITUTIONAL_ID
        || event === AppConstants.ACCOUNT_TYPE_INDIVIDUAL_ITF_ID) {
          if (event === AppConstants.ACCOUNT_TYPE_INDIVIDUAL_ITF_ID) {
            this.populateIdentificationTypesChange(AppConstants.ACCOUNT_TYPE_INDIVIDUAL);
            this.showTrustee = true;
            this.showIndividual = true;
            this.showCorporate = false;
            this.showJoint = false;
            this.selectedItem.accountType = "S";
          }
          else
          {
            this.populateIdentificationTypesChange(AppConstants.ACCOUNT_TYPE_INDIVIDUAL);
            this.showTrustee = false;
            this.showIndividual = true;
            this.showCorporate = false;
            this.showJoint = false;
            this.selectedItem.accountType = "S";
          }
      }

      else if (event === AppConstants.ACCOUNT_TYPE_CORPORATE_ID || event === AppConstants.ACCOUNT_TYPE_CORPORATE_INSTITUTIONAL_ID
        || event === AppConstants.ACCOUNT_TYPE_COLLECTIVE_INVESTMENT_ID) {
          this.populateIdentificationTypesChange(AppConstants.ACCOUNT_TYPE_CORPORATE);
        this.showIndividual = false;
        this.showCorporate = true;
        this.showJoint = false;
        this.showTrustee = false;
        this.selectedItem.accountType = "S";
      }
      else if (event === AppConstants.ACCOUNT_TYPE_JOINT_ID) {
        this.populateIdentificationTypesChange(AppConstants.ACCOUNT_TYPE_INDIVIDUAL);
        this.showIndividual = false;
        this.showCorporate = false;
        this.showJoint = true;
        this.selectedBankItemFromGrid();
        this.showTrustee = false;
        this.selectedItem.accountType = "J"; //joint
      }
    }
  }









  public onCancelAction() {
    this.clearFields();
    this.showForm = false;
  }



  onNewPasswordChange(newValue) {
    this.changePasswordError = undefined;
    this.passwordStrength = this.measurer.measure(newValue);
  }

  public onNextAction() {
    //this.progressBar.nativeElement.style.width="50";
    var isValid: boolean = true;
    this.isSubmitted = true;
    this.selectedItem.chartOfAccount.glCode = this.coaCode_;
    if (this.currentTab_ == "BI") {
      isValid = this.validateBasicInfo();
      if (isValid) {
        this.CONAnchorTag.nativeElement.click();
        this.currentTab_ = "CON";
      }
    }
    else if (this.currentTab_ == "CON") {
      isValid = this.validateContactDetail();
      if (isValid) {
        if (this.showJoint) {
          this.JAAnchorTag.nativeElement.click();
          this.currentTab_ = "JA";
        } else if (this.showIndividual) {
          this.BENAnchorTag.nativeElement.click();
          this.currentTab_ = "BEN";
        }
        else {
          this.BAAnchorTag.nativeElement.click();
          this.currentTab_ = "BA"
        }
      }
    }

    else if (this.currentTab_ == "JA") {
      isValid = this.validateJointAccount();
      if (isValid) {
        this.BENAnchorTag.nativeElement.click();
        this.currentTab_ = "BEN";
      }
    }
    else if (this.currentTab_ == "BEN") {
       
      isValid = this.validateBeneficiary();
      if (isValid) {
        this.BAAnchorTag.nativeElement.click();
        this.currentTab_ = "BA";
      }
    }

    else if (this.currentTab_ == "BA") {
      isValid = this.validateBankAccount();
      if (isValid) {
        this.DOCAnchorTag.nativeElement.click();
        this.currentTab_ = "DOC";
      }
    }

    else if (this.currentTab_ == "DOC") {
      isValid = this.validateDocument();
      if (isValid) {
        this.ACAnchorTag.nativeElement.click();
        this.currentTab_ = "AC";
      }
    }


  }








  public onPreviousAction() {

    if (this.currentTab_ == "CON") {
      this.BIAnchorTag.nativeElement.click();
      this.currentTab_ = "BI";
    }

    else if (this.currentTab_ == "JA") {
      if (this.selectedItem.onlineClient == true) {
        this.SAAnchorTag.nativeElement.click();
        this.currentTab_ = "SA";
      } else {
        this.CONAnchorTag.nativeElement.click();
        this.currentTab_ = "CON";
      }
    }
    else if (this.currentTab_ == "BEN") {
      if (this.showJoint) {
        this.JAAnchorTag.nativeElement.click();
        this.currentTab_ = "JA";
      } else if (this.selectedItem.onlineClient == true) {
        this.SAAnchorTag.nativeElement.click();
        this.currentTab_ = "SA";
      } else {
        this.CONAnchorTag.nativeElement.click();
        this.currentTab_ = "CON";
      }
    }

    else if (this.currentTab_ == "BA") {
      if (this.showIndividual || this.showJoint) {
        this.BENAnchorTag.nativeElement.click();
        this.currentTab_ = "BEN";
      }
      else if (this.showCorporate) {
        this.CONAnchorTag.nativeElement.click();
        this.currentTab_ = "CON";
      }

    } else if (this.currentTab_ == "DOC") {
      this.BAAnchorTag.nativeElement.click();
      this.currentTab_ = "BA";
    }
    else if (this.currentTab_ == "AC") {
      this.DOCAnchorTag.nativeElement.click();
      this.currentTab_ = "DOC";
    }
  }

  public onSearchAction() {
    this.populateItemGrid();
  }

  public onCommissioSlabChangeEvent(comSlbId: any) {
    if (!AppUtility.isEmpty(this.commissionSlabList)) {
      this.selectedItem.commissionSlabMaster.slabNameDisplay_ = this.commissionSlabList.filter(
        function (obj) { return obj.commissionSlabId == comSlbId; })[0].slabNameDisplay_;
    }
  }
  public onNewBankAccountAction() {
    this.clearBankAccountFields();
  }

  public onEditBankAccountAction() {
    this.isEditingBankDetail = true;
  }

  public onDeleteBankAccountAction() {
     
    this.bankSelectedIndex =  this.bankAccountGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.bankAccountGrid.rows[this.bankSelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId) && AppUtility.isValidVariable(item.clientBankId)) {
    this.listingService.deleteSingleBankAccount(item.clientId , item.clientBankId).subscribe((res : any)=>{
           this.itemsBanAccountList.remove(this.itemsBanAccountList.currentItem);
    }, error => {
       
      if(error.message){
        this.errorMessage = <any>error.message;
      }
      else
      {
        this.errorMessage = <any>error;
      }
      this.dialogCmp.statusMsg = this.errorMessage;
      this.dialogCmp.showAlartDialog('Error');
    });
    }
    else
    {
      this.itemsBanAccountList.remove(this.itemsBanAccountList.currentItem);
    }

    
 
  }

  public onDeleteBeneficiaryAction() {
    
    this.beneficiarySelectedIndex =  this.beneficiaryGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.beneficiaryGrid.rows[this.beneficiarySelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId) && AppUtility.isValidVariable(item.beneficiaryId)) {
    this.listingService.deleteSingleBeneficiary(item.clientId , item.beneficiaryId).subscribe((res : any)=>{
           this.itemsBeneficiaryList.remove(this.itemsBeneficiaryList.currentItem);
    }, error => {
       
      if(error.message){
        this.errorMessage = <any>error.message;
      }
      else
      {
        this.errorMessage = <any>error;
      }
      this.dialogCmp.statusMsg = this.errorMessage;
      this.dialogCmp.showAlartDialog('Error');
    });
    }
    else
    {
      this.itemsBeneficiaryList.remove(this.itemsBeneficiaryList.currentItem);
    }

  }

  public onDeleteDocumentAction() {
    this.isSubmittedDocumentForm = false;
    debugger
    this.documentsSelectedIndex =  this.documentGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.documentGrid.rows[this.documentsSelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId) && AppUtility.isValidVariable(item.clientDocumentId)) {
    this.listingService.deleteSingleDocuments(item.clientId , item.clientDocumentId).subscribe((res : any)=>{
      this.itemsDocumentList.remove(this.itemsDocumentList.currentItem);
    }, error => {
      debugger
      if(error.message){
        this.errorMessage = <any>error.message;
      }
      else
      {
        this.errorMessage = <any>error;
      }
      this.dialogCmp.statusMsg = this.errorMessage;
      this.dialogCmp.showAlartDialog('Error');
    });
    }
    else
    {
      this.itemsDocumentList.remove(this.itemsDocumentList.currentItem);
    }
   
  }

  public onDeleteJointAccountAction() {

    debugger
    this.jointSelectedIndex =  this.jointAccountGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.jointAccountGrid.rows[this.jointSelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId) && AppUtility.isValidVariable(item.clientJointAccountId)) {
    this.listingService.deleteSingleJointAccount(item.clientId , item.clientJointAccountId).subscribe((res : any)=>{
      this.itemsJointAccountList.remove(this.itemsJointAccountList.currentItem);
    }, error => {
      debugger
      if(error.message){
        this.errorMessage = <any>error.message;
      }
      else
      {
        this.errorMessage = <any>error;
      }
      this.dialogCmp.statusMsg = this.errorMessage;
      this.dialogCmp.showAlartDialog('Error');
    });
    }
    else
    {
      this.itemsJointAccountList.remove(this.itemsJointAccountList.currentItem);
    }
    
  }

  public onDownloadDocumentAction() {
    this.isSubmittedDocumentForm = false;

    if (!AppUtility.isEmpty(this.itemsDocumentList.currentItem)) {
      var base64Data = this.itemsDocumentList.currentItem.documentBase64_;
      var contentType = this.itemsDocumentList.currentItem.contentType;
      var fileName = this.itemsDocumentList.currentItem.documentName;
      downloadAPI(base64Data, fileName, contentType);
    }
  }






  public onGetDraft = () => {

    this.splash.show();
    this.currentTab_ = "BI";
    this.showForm = true;
    this.isShowInvestorForm = true;
    this.listingService.getInvestorByUserId(AppConstants.userId)
      .subscribe(
        restData => {
           
          if (restData !== null && restData.length > 0) {
            if (AppUtility.isValidVariable(restData[0].clientId)) {
              this.InvestorClientId = restData[0].clientId;
              this.selectedItem.clientId = restData[0].clientId;
              this.populateAccountType();
              this.populateClientBankAccountGrid();
              this.populateClientBeneficiaryGrid();
              this.populateClientJointAccountGrid();
              this.populateClientDocuemntsGrid();
              this.showSelectForParticpantsBranch = false;
              this.fillClientFromJson(this.selectedItem, restData[0]);

            }

            this.splash.hide();
          }

        },
        error => {
          this.appState.showLoader = false
          if(error.message){
            this.errorMessage = <any>error.message;
          }
          else
          {
            this.errorMessage = <any>error;
          }
          this.dialogCmp.statusMsg = this.errorMessage;
          AppUtility.printConsole('errorMessage: ' + this.errorMessage);
          this.dialogCmp.showAlartDialog('Error');
        });







  }






  public onGetInvestorByClient = (invClientId: Number) => {
    debugger
    this.splash.show();
    this.disabledTradConfigFields = false;
    this.isDisabledButtons = false;
   

    this.clearFields();
    if (!AppUtility.isEmpty(invClientId)) {
      this.populateParticipants();
      this.populateAccountTypeInvestor();
      this.populateCountryList();
      this.listingService.getInvestorByClientId(invClientId).subscribe(
        restData => {
          
          this.isShowInvestorForm = true;
          if (AppUtility.isValidVariable(restData[0].clientId)) {
            this.InvestorClientId = restData[0].clientId;
            this.selectedItem.clientId = restData[0].clientId;
            this.populateAccountType();
            this.populateClientBankAccountGrid();
            this.populateClientBeneficiaryGrid();
            this.populateClientJointAccountGrid();
            this.populateClientDocuemntsGrid();

            if(AppUtility.isValidVariable(restData[0].contactDetail.firstName) && AppUtility.isValidVariable(restData[0].contactDetail.lastName) && restData[0].clientType === "I") {
              this.selectedItem.chartOfAccount.glDesc = restData[0].contactDetail.firstName + " " + restData[0].contactDetail.lastName; 
            }
            else if(AppUtility.isValidVariable(restData[0].contactDetail.companyName) && restData[0].clientType === "C") {
              this.selectedItem.chartOfAccount.glDesc = restData[0].contactDetail.companyName; 
            }

            if(AppUtility.isValidVariable(restData[0].clientCode)) {
              this.glCode_ = restData[0].clientCode;
            }

            if(restData[0].statusCode === AppConstants.INV_STATUS_REGISTERED || restData[0].statusCode === AppConstants.INV_STATUS_ACTIVE) {
               this.isDisabledFields = true;
               this.documentForm.controls['fileUpload'].disable();
             

            }


            if(restData[0].statusCode === AppConstants.INV_STATUS_REGISTERED){
              this.currentTab_ = 'AC';
               this.ACAnchorTag.nativeElement.click();
            }
            else{
              this.currentTab_ = 'BI';
              this.BIAnchorTag.nativeElement.click();
            }


            if(restData[0].statusCode === AppConstants.INV_STATUS_ACTIVE) {
                this.disabledTradConfigFields = true;
            }

             
            if (restData[0].user != null && restData[0].user.exchange != null && restData[0].user.exchange.exchangeId !== null) {
              this.populateAllowedMarkets(restData[0].user.exchange.exchangeId, restData[0].user.exchange.exchangeName);
            }
            
            this.showSelectForParticpantsBranch = false;
            this.fillClientFromJson(this.selectedItem, restData[0]);
            this.loadClientMarkets();
            this.splash.hide();
             
          }
          
        },
        error => {
          this.splash.hide();
          if(error.message){
            this.errorMessage = <any>error.message;
          }
          else
          {
            this.errorMessage = <any>error;
          }
          this.dialogCmp.statusMsg = this.errorMessage;
          AppUtility.printConsole('errorMessage: ' + this.errorMessage);
          this.dialogCmp.showAlartDialog('Error');
        });
    }




  }









  public selectedBeneficiaryItemFromGrid = () => {
  //  if(AppUtility.isValidVariable(this.beneficiaryGrid)) {
      setTimeout(() => {
        this.beneficiarySelectedIndex =  this.beneficiaryGrid.selection.row;
        if(AppUtility.isValidVariable(this.beneficiaryGrid.rows[this.beneficiarySelectedIndex])){
          let item = JSON.parse(JSON.stringify(this.beneficiaryGrid.rows[this.beneficiarySelectedIndex].dataItem));
          if(item) {
            this.selectedBeneficiaryItem.taxNumber = item.taxNumber;
            this.selectedBeneficiaryItem.beneficiaryName = item.beneficiaryName;
            this.selectedBeneficiaryItem.identificationType.identificationTypeId = item.identificationType.identificationTypeId;
            this.selectedBeneficiaryItem.beneficiaryCNIC = item.beneficiaryCNIC;
            this.selectedBeneficiaryItem.relation.relationId = item.relation.relationId;
          }
        }
       }, 500);      
  //  }
    
}



public selectedBankItemFromGrid = () => {
  debugger
  if(AppUtility.isValidVariable(this.bankAccountGrid.selection)){
    this.bankSelectedIndex =  this.bankAccountGrid.selection.row;
    if(AppUtility.isValidVariable(this.bankAccountGrid.rows[this.bankSelectedIndex]) ) {
      let item = JSON.parse(JSON.stringify(this.bankAccountGrid.rows[this.bankSelectedIndex].dataItem));  
      if(item) {
        if(AppUtility.isValidVariable(item.bankAccountNo) && AppUtility.isValidVariable(item.bankTitle)) {
        this.selectedBankAccountItem.bankAccountNo = item.bankAccountNo;
        this.selectedBankAccountItem.bankTitle = item.bankTitle;
        }
    
        if(AppUtility.isValidVariable(item.bankBranch.bank.bankId)){
         setTimeout(() => {
          this.selectedBankAccountItem.bankBranch.bank.bankId = item.bankBranch.bank.bankId;
        }, 150);
      }
        
        if(AppUtility.isValidVariable(this.selectedBankAccountItem.bankBranch.bank.bankId)){
          setTimeout(() => {
            this.selectedBankAccountItem.bankBranch.bankBranchId = item.bankBranch.bankBranchId;
          }, 400);
        }
        
      }
    }
  }
 

}

public selectedDocumentItemFromGrid = () => {
  if(AppUtility.isValidVariable(this.documentGrid)) {
    setTimeout(() => {
      this.documentsSelectedIndex =  this.documentGrid.selection.row;
      if(AppUtility.isValidVariable(this.documentGrid.rows[this.documentsSelectedIndex])) {
        let item = JSON.parse(JSON.stringify(this.documentGrid.rows[this.documentsSelectedIndex].dataItem));  
        if(item) {
         this.selectedClientDocument.documentType.documentTypeId = item.documentType.documentTypeId;
         this.selectedClientDocument.issueDate = item.issueDate;
         this.selectedClientDocument.expiryDate = item.expiryDate;
         this.selectedClientDocument.issuePlace = item.issuePlace;
        }
      }
     
     }, 500);
  }
}


public selectedJointAccountItemFromGrid = () => {
 
    setTimeout(() => {
      this.jointSelectedIndex =  this.jointAccountGrid.selection.row;
      if(AppUtility.isValidVariable(this.jointAccountGrid.rows[this.jointSelectedIndex])) {
        let item = JSON.parse(JSON.stringify(this.jointAccountGrid.rows[this.jointSelectedIndex].dataItem));  
        if(item) {
          this.selectedJointAccountItem.contactDetail.firstName = item.contactDetail.firstName;
          this.selectedJointAccountItem.contactDetail.lastName = item.contactDetail.lastName;
          this.selectedJointAccountItem.contactDetail.taxNumber = item.contactDetail.taxNumber;
          this.selectedJointAccountItem.contactDetail.identificationType = item.contactDetail.identificationType;
          this.selectedJointAccountItem.contactDetail.identificationTypeId = item.contactDetail.identificationTypeId;        
        }
      }
    }, 500);
  
}














  public onEditClientExchangeAction() {
    this.clearClientExchangeFields();
    if (!AppUtility.isEmpty(this.itemsClientExchangeList.currentItem)) {
      this.clearClientExchangeFields();
      //this.selectedClientExchange = this.itemsClientExchangeList.currentItem;
      //this.itemsClientExchangeList.editItem(this.selectedClientExchange);
      this.fillClientExchangeFromJSON(this.selectedClientExchange, this.itemsClientExchangeList.currentItem);
    }
    this.isEditingClientExchange = true;
  }

  public onDeleteClientExchangeAction() {
    this.deleteClientExchangeAction = true;
    if (AppUtility.isValidVariable(this.itemsClientExchangeList)) {
      this.itemsClientExchangeList.currentItem;
      const index = this.itemsClientExchangeList.items.findIndex(item => item.exchangeId == this.itemsClientExchangeList.currentItem.exchangeId);
      this.itemsClientExchangeList.items.splice(index, 1);
      var arr: any[] = JSON.parse(JSON.stringify(this.itemsClientExchangeList.items));
      this.itemsClientExchangeList = new wjcCore.CollectionView(arr);
    }
  }

  public onCancelClientExchangeAction() {
    this.clearClientExchangeFields();
    if (AppUtility.isValidVariable(this.itemsClientExchangeList)) {
      this.itemsClientExchangeList.cancelEdit();
      this.itemsClientExchangeList.cancelNew();
    }
  }

  public clearClientDocuemnt() {
    if (AppUtility.isValidVariable(this.documentForm)) {
      this.documentForm.markAsPristine();
    }
    this.isSubmittedDocumentForm = false;
    this.selectedClientDocument = new ClientDocument();
    this.selectedClientDocument.documentType.documentTypeId = null;
    this.fileSizeExceed = false;
    if (!AppUtility.isEmpty(this.fileInput_)) {
      this.fileInput_.value = "";
    }
    this.file_srcs = [];
    this.fileName_ = "";
    this.fileContentType_ = "";
    this.fileSelectionMsgShow = false;
  }

  public clearJointAccountFields() {
    if (AppUtility.isValidVariable(this.jointAccountForm)) {
      this.jointAccountForm.markAsPristine();
    }
    this.isSubmittedJointAccount = false;
    this.selectedJointAccountItem = new ClientJointAccount();
    //this.selectedJointAccountItem.contactDetail = new ContactDetail;
    this.selectedJointAccountItem.contactDetail.firstName = "";
    this.selectedJointAccountItem.contactDetail.middleName = null;
    this.selectedJointAccountItem.contactDetail.lastName = "";
    this.selectedJointAccountItem.contactDetail.fatherHusbandName = null;
    this.selectedJointAccountItem.contactDetail.gender = null;
    //this.selectedJointAccountItem.contactDetail.residenceStatus = null;
    this.selectedJointAccountItem.contactDetail.identificationTypeId = null;
    this.selectedJointAccountItem.contactDetail.identificationType = "";
    this.selectedJointAccountItem.contactDetail.registrationNo = null;
    this.selectedJointAccountItem.contactDetail.professionId = null;
    this.selectedJointAccountItem.contactDetail.phone1 = null;
    this.selectedJointAccountItem.contactDetail.cellNo = null;
    this.selectedJointAccountItem.contactDetail.email = null;
    this.selectedJointAccountItem.contactDetail.dob = new Date();
    this.selectedJointAccountItem.contactDetail.postalCode = null;
    this.selectedJointAccountItem.contactDetail.address1 = null;
    this.selectedJointAccountItem.contactDetail.address2 = null;
    this.selectedJointAccountItem.contactDetail.address3 = null;
    this.selectedJointAccountItem.contactDetail.companyName = null;
    this.selectedJointAccountItem.contactDetail.industryId = null;

  }

  public clearBankAccountFields() {
    if (AppUtility.isValidVariable(this.bankDetailForm)) {
      this.bankDetailForm.markAsPristine();
    }
    this.isSubmittedBankAccount = false;
    this.isEditingBankDetail = false;
    this.selectedBankAccountItem = new ClientBankAccount();
    this.selectedBankAccountItem.bankBranch.bank.bankId = null;

  }

  public clearBeneficiaryFields() {

    if (AppUtility.isValidVariable(this.beneficiaryForm)) {
      this.beneficiaryForm.markAsPristine();
    }
    this.isSubmittedBeneficiary = false;
    this.isEditingBeneficiaryDetail = false;
    this.selectedBeneficiaryItem = new Beneficiary();
    this.selectedBeneficiaryItem.relation.relationId = null;
    //this.selectedBeneficiaryItem.isBeneficiarySubmit = "false";
  }

  public clearClientExchangeFields() {
    if (AppUtility.isValidVariable(this.clientExchangeForm)) {
      this.clientExchangeForm.markAsPristine();
    }
    this.isSubmittedClientExchange = false;
    this.isEditingClientExchange = false;
    this.selectedClientExchange = new ClientExchange();
    this.marginPerExceed = false;
  }

  public clearFields() {

    this.selectedProvinceId = null;
    this.selectedCityId = null;
    this.selectedLevies = null;

    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.bankDetailForm)) {
      this.bankDetailForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.beneficiaryForm)) {
      this.beneficiaryForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.jointAccountForm)) {
      this.jointAccountForm.markAsPristine();
    }
    if (AppUtility.isValidVariable(this.documentForm)) {
      this.documentForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.clientExchangeForm)) {
      this.clientExchangeForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.itemsList)) {
      this.itemsList.cancelEdit();
      this.itemsList.cancelNew();
    }
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.showOnlineAccess = false;

    this.glCode_ = "";
    this.confirmPassword_ = "";
    this.coaCode_ = "";
    this.selectedItem = new Client();

    this.selectedItem.clientId = null;
    this.selectedItem.accountTypeNew.accTypeId = AppConstants.PLEASE_SELECT_VAL;
    this.selectedItem.active = false;
    this.selectedItem.allowShortSell = false;
    this.selectedItem.bypassCrs = false;
    this.selectedItem.clientCode = "";
    this.selectedItem.depositoryAccountNo = "";
    this.selectedItem.risk = "";
    this.selectedItem.sendEmail = false;
    this.selectedItem.sendMail = false;
    this.selectedItem.proprietaryAccount = false;
    this.selectedItem.sendSms = false;
    this.selectedItem.generateKits = false;
    this.selectedItem.margin = 0;
    this.selectedItem.onlineClient = false;
    this.selectedItem.openPositionStatus = false;
    this.selectedItem.reference = "";
    this.selectedItem.clientType = AppConstants.INDIVIDUAL_TYPE;
    this.selectedItem.displayName_ = "";
    this.selectedItem.glCodeLength_ = 0;
    this.selectedItem.chartOfAccount = new ChartOfAccount;
    this.selectedItem.chartOfAccount.chartOfAccountId = null;
    this.selectedItem.chartOfAccount.glCode = "";
    this.selectedItem.chartOfAccount.glDesc = "";

    this.selectedItem.accountTypeNew = new AccountType();
    this.selectedItem.accountTypeNew.accTypeId = null;

    this.selectedItem.agent = new Agent;
    this.selectedItem.agent.agentId = null;
    this.selectedItem.agent.agentCode = "";

    this.selectedItem.participant = new Participant;
    this.selectedItem.participant.participantId = null;
    this.selectedItem.participant.participantCode = "";
    this.selectedItem.participant.participantName = "";

    this.selectedItem.contactDetail = new ContactDetail();
    if (!AppUtility.isEmptyArray(this.countryList)) {
      this.selectedItem.contactDetail.country = '';
      this.selectedItem.contactDetail.countryId = null;
    }
    this.selectedItem.contactDetail.cityId = null
    this.selectedItem.contactDetail.city = '';

    //this.selectedProvinceId = null;
    this.selectedItem.contactDetail.provinceId = null
    this.selectedItem.contactDetail.province = '';

    //this.selectedDistrictId = null;
    //this.selectedItem.contactDetail.districtId = null
    //this.selectedItem.contactDetail.district = '';
    // if (!AppUtility.isEmptyArray(this.cityList)) {
    //   this.selectedItem.contactDetail.city = this.cityList[0].city;
    //   this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
    // }

    this.selectedRelationId = null;

    this.selectedItem.contactDetail = new ContactDetail;
    this.selectedItem.contactDetail.firstName = AppConstants.INV_FIRST_NAME;
    this.selectedItem.contactDetail.middleName = "";
    this.selectedItem.contactDetail.lastName = AppConstants.INV_LAST_NAME;
    this.selectedItem.contactDetail.fatherHusbandName = "";
    this.selectedItem.contactDetail.ntnNo = "";
    this.selectedItem.contactDetail.gender = null;
    this.selectedItem.contactDetail.residenceStatus = null;
    this.selectedItem.contactDetail.identificationTypeId = null;
    this.selectedItem.contactDetail.identificationType = "";
    this.selectedItem.contactDetail.registrationNo = "";
    this.selectedItem.contactDetail.professionId = null;
    this.selectedItem.contactDetail.phone1 = "";
    this.selectedItem.contactDetail.cellNo = AppConstants.INV_MOBILE_NUMBER;
    this.selectedItem.contactDetail.email = AppConstants.INV_EMAIL;
    this.selectedItem.contactDetail.dob = new Date();
    this.selectedItem.contactDetail.postalCode = "";
    this.selectedItem.contactDetail.address1 = "";
    this.selectedItem.contactDetail.address2 = "";
    this.selectedItem.contactDetail.address3 = "";
    this.selectedItem.contactDetail.companyName = "";
    this.selectedItem.contactDetail.industryId = null;

    this.selectedItem.contactDetail.idExpDate = new Date();
    this.selectedItem.contactDetail.idIssueDate = new Date();
    this.selectedItem.contactDetail.issuePlaceId = null;

    this.selectedItem.commissionSlabMaster = new CommissionSlabMaster;
    this.selectedItem.commissionSlabMaster.commissionSlabId = null;
    this.selectedItem.commissionSlabMaster.slabName = "";


    this.selectedItem.participantBranch = new ParticipantBranch;
    this.selectedItem.participantBranch.branchId = null;
    this.selectedItem.participantBranch.branchCode = "";

    this.selectedItem.accountCategory = new AccountCategory;
    this.selectedItem.accountCategory.accountCategoryId = null;
    this.selectedItem.accountCategory.name = "";


    this.selectedItem.user = new User;
    this.selectedItem.user.userId = null;
    this.selectedItem.user.email = "";
    this.selectedItem.user.password = "";
    this.selectedItem.user.status = "";
    this.selectedItem.user.active = false;
    this.selectedItem.user.userName = "";

    this.selectedItem.user.participant = new Participant;
    this.selectedItem.user.participant.participantId = null;


    this.clearClientExchangeFields();
    this.selectedItem.clientExchange = [];
    this.selectedClientExchange = new ClientExchange();
    this.populateClientExchangeGrid();


    this.clearBankAccountFields();
    this.selectedItem.bankAccount = [];
    this.selectedBankAccountItem = new ClientBankAccount();
    //  this.populateClientBankAccountGrid();

    this.clearBeneficiaryFields();
    this.selectedItem.beneficiary = [];
    this.selectedBeneficiaryItem = new Beneficiary();
    //this.selectedBeneficiaryItem.isBeneficiarySubmit = "false";
    //  this.populateClientBeneficiaryGrid();

    this.selectedItem.appliedLevy = [];

    this.clearJointAccountFields();
    this.selectedItem.jointAccount = [];
    //  this.populateClientJointAccountGrid();


    this.clearClientDocuemnt();
    this.selectedItem.clientDocuments = [];
    //  this.populateClientDocuemntsGrid();

    this.itemsAllowedMarketList = new wjcCore.CollectionView();
    this.populateAllowedMarkets(null, null);

    this.itemsClientCustodianList = new wjcCore.CollectionView();
    this.populateCustodians(null, null);

    this.selectedItem.annualGrossIncome = 0;
    this.selectedItem.incomeSource = new IncomeSource();
    this.selectedItem.incomeSource.incomeSourceId = null;
    this.selectedItem.incomePercentage = 0;


    console.log("Selected Values : ", this.selectedItem);


  }





  private selectedAppliedLevy() {
    
     
    var items: String[] = [];
    if (this.cmbLevy.checkedItems.length > 0) {
      if (this.cmbLevy.checkedItems[0].leviesMasterId == "-1") {
        for (let i = 1; i < this.leviesList.length; i++) {
          items.push(this.leviesList[i].leviesMasterId);
        }
      }
      else {
        for (let selectedAppLevies of this.cmbLevy.checkedItems) {
          items.push(selectedAppLevies.leviesMasterId);
        }
      }
    }
    this.selectedLevies = items
  }










  public fileChangeEvent(fileInput: any) {
    if (AppUtility.isEmpty(fileInput)) {
      this.fileSelectionMsgShow = true;
      return;
    } else {
      this.fileSelectionMsgShow = false;
    }
    if (!AppUtility.isEmpty(fileInput.files[0])) {
      if (fileInput.files[0].size > 2000000) {
        this.fileSizeExceed = true;
        return;
      } else {
        this.fileSizeExceed = false;
        this.fileContentType_ = fileInput.files[0].type;
      }
    } else {
      this.file_srcs = [];
      return;
    }
    var fullPath = fileInput.value;
    if (fullPath) {
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }
      this.fileName_ = filename;
    }
    var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".doc", ".docx", ".pdf"];
    if (this.fileName_.length > 0) {
      var blnValid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (this.fileName_.substr(this.fileName_.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          break;
        }
      }
      if (!blnValid) {
        this.dialogCmp.statusMsg = "Sorry, " + this.fileName_ + " is invalid, allowed extensions are: " + _validFileExtensions.join(", ");
        this.dialogCmp.showAlartDialog('Warning');

        this.fileName_ = "";
        this.fileContentType_ = "";
        fileInput.value = "";
        return;
      }
    }

    this.readFiles(fileInput.files);
    this.fileInput_ = fileInput;
  }







public onCreateAccount = () => {
  let bankListTemp: any[] = [];
  let beneficiaryListTemp: any[] = [];
  let documentsListTemp: any[] = [];
  let clientIdTempForStatus = this.selectedItem.clientId;
  this.selectedAccountItem = new Client();
  this.selectedAccountItem = this.selectedItem;
  this.selectedAccountItem.depositoryAccountNo = this.selectedItem.clientCode;
  this.selectedAccountItem.contactDetail.contactDetailId = null;
  this.selectedAccountItem.clientId = null;
  this.selectedAccountItem.chartOfAccount.glDesc = this.selectedItem.chartOfAccount.glDesc;
  this.selectedAccountItem.chartOfAccount.chartOfAccountId = null;
  this.selectedAccountItem.statusCode = AppConstants.INV_STATUS_ACTIVE;
 
  if (!(AppUtility.isEmpty(this.itemsBanAccountList) || this.itemsBanAccountList.itemCount == 0)) {
    this.itemsBanAccountList.items.forEach(element => {
      bankListTemp.push(element);
    });
    this.selectedAccountItem.bankAccount = bankListTemp;
  } else {
    this.selectedAccountItem.bankAccount = null;
  }
  if (!(AppUtility.isEmpty(this.itemsBeneficiaryList) || this.itemsBeneficiaryList.itemCount == 0)) {
    this.itemsBeneficiaryList.items.forEach(element => {
      beneficiaryListTemp.push(element);
    });
    this.selectedAccountItem.beneficiary = beneficiaryListTemp;
  } else {
    this.selectedAccountItem.beneficiary = null;
  }
  if (this.showJoint) {
    if (!(AppUtility.isEmpty(this.itemsJointAccountList) || this.itemsJointAccountList.itemCount == 0)) {
      this.selectedAccountItem.jointAccount = [];
      var itemFound = false;
      for (let i = 0; i < this.itemsJointAccountList.items.length; i++) {
        this.selectedAccountItem.jointAccount[i] = this.itemsJointAccountList.items[i];
        this.selectedAccountItem.jointAccount[i].contactDetail.contactDetailId = null;
        itemFound = true;
      }
      if (itemFound == false) {
        this.selectedAccountItem.jointAccount = null;
      }
    } else {
      this.selectedAccountItem.jointAccount = null;
    }
  } else {
    this.selectedAccountItem.jointAccount = null;
  }
  if (!(AppUtility.isEmpty(this.itemsDocumentList) || this.itemsDocumentList.itemCount == 0)) {
    this.itemsDocumentList.items.forEach(element => {
      documentsListTemp.push(element);
    });
    this.selectedAccountItem.clientDocuments = documentsListTemp;
  } else {
    this.selectedAccountItem.clientDocuments = null;
  }
  if(this.selectedAccountItem.beneficiary !== null) {
     this.selectedAccountItem.beneficiary.forEach(element => {
        element.beneficiaryId = null;
     });
  }
  if(this.selectedAccountItem.bankAccount !== null) {
    this.selectedAccountItem.bankAccount.forEach(element => {
       element.clientBankId = null;
       element.clientId = null;
    });
 }

 if(this.selectedAccountItem.clientDocuments !== null) {
  this.selectedAccountItem.clientDocuments.forEach(element => {
     element.clientDocumentId = null;
     element.clientId = null;
  });
}

if(this.selectedAccountItem.jointAccount !== null) {
  this.selectedAccountItem.jointAccount.forEach(element => {
     element.clientJointAccountId = null;
     element.clientId = null;
  });
}


// Individual and joint account flag setup 
if (this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
  this.selectedItem.clientType == AppConstants.ACCOUNT_TYPE_JOINT;
} else {
  this.selectedItem.clientType == AppConstants.INDIVIDUAL_TYPE; 
}


  if(this.selectedAccountItem.clientExchange !== null && this.selectedAccountItem.clientExchange.length > 0) {
    this.selectedAccountItem.clientExchange.forEach(element => {
         element.clientExchangeId = null;
         element.clientId = null;
         element.active = true;
    })
  }


  if(this.selectedAccountItem.clientMarkets !== null && this.selectedAccountItem.clientMarkets.length > 0) {
      this.selectedAccountItem.clientMarkets.forEach(element => {
          element.clientMarketId = null;
          element.clientId = null;
          
      })
  }


  if(this.selectedAccountItem.appliedLevy !== null && this.selectedAccountItem.appliedLevy.length > 0) {
    this.selectedAccountItem.appliedLevy.forEach(element => {
      element.clientAppliedLevyId = null;
      element.clientId = null;
      
  })
  }

    this.splash.show();
    this.listingService.saveClient(this.selectedItem).subscribe((restData) => {
                 this.splash.hide(); 
                 this.updateClientStatus(clientIdTempForStatus);
                 this.isDisabledButtons = true;
                 this.dialogCmp.statusMsg = AppConstants.MSG_CREATE_ACCOUNT;
                 this.dialogCmp.showAlartDialog('LocalSuccess');
                
    }, (error) => {
              this.splash.hide();
              if(error.message){
                this.errorMessage = <any>error.message;
              }
              else
              {
                this.errorMessage = <any>error;
              }
              this.dialogCmp.statusMsg = this.errorMessage;
              this.dialogCmp.showAlartDialog('Error');
    });
}




public updateClientStatus = (clientIdForStatus : Number)=> {
   debugger
   this.splash.show();
   
   let x = {
    clientId:  clientIdForStatus,
    statusCode: AppConstants.INV_STATUS_ACTIVE,
  };
   this.listingService.updateClientStatusCode(x).subscribe((restData) => {
              
                this.splash.hide();
                this.onlineAccountRegistration.onSearchAction();
                this.onGetInvestorByClient(this.clientIdForAR);
   }, error => {
        this.splash.hide();
       
   })

}



 
 
  public onSaveAction(model: any, isValid: boolean) {

    debugger
    if (!AppUtility.isValidVariable(this.selectedItem.clientCode) && this.showParticipantBasedGrid) {
      this.dialogCmp.statusMsg = 'Please fill all mandatory fields for Basic tab.';
      this.dialogCmp.showAlartDialog('Notification');
      isValid = false;
      return;
    }

    if (!AppUtility.isValidVariable(this.selectedItem.user.userId)) {
      this.dialogCmp.statusMsg = 'Invalid user id.';
      this.dialogCmp.showAlartDialog('Notification');
      isValid = false;
      return;
    }

    let bankListTemp: any[] = [];
    let beneficiaryListTemp: any[] = [];
    let documentsListTemp: any[] = [];
    this.isSubmitted = true;
    this.selectedItem.user.participant.participantId = this.selectedItem.participant.participantId;
    this.selectedItem.accountCategory.accountCategoryId = AppConstants.ACCOUNT_CATEGORY_INVESTOR;
    this.selectedItem.clientExchange[0] = new ClientExchange();
    if(AppUtility.isValidVariable(this.selectedItem.participant.exchange)) {
      this.selectedItem.clientExchange[0].exchangeId =  this.selectedItem.participant.exchange.exchangeId;
      this.selectedItem.clientExchange[0].exchangeName =  this.selectedItem.participant.exchange.exchangeName;
    }


    this.selectedItem.clientExchange[0].clientId = this.selectedItem.clientId;
    this.selectedItem.clientExchange[0].clientExchangeId = this.selectedClientExchange.clientExchangeId;
    this.selectedItem.clientExchange[0].participantExchangeId =  this.selectedClientExchange.participantExchangeId;
    this.selectedItem.clientExchange[0].margin = this.selectedClientExchange.margin;
    this.selectedItem.clientExchange[0].allowShortSell = this.selectedClientExchange.allowShortSell;
    this.selectedItem.clientExchange[0].bypassCrs = this.selectedClientExchange.bypassCrs;
    this.selectedItem.clientExchange[0].openPositionStatus = this.selectedClientExchange.openPositionStatus;


    //==================Account Configuration Section 
    this.selectedItem.chartOfAccount.glCode = this.coaCode_;
    this.selectedItem.chartOfAccount.glCodeDisplayName_ = this.glCodeDisplayName_;
    this.selectedItem.chartOfAccount.headLevel = this.headLevel_;
    this.selectedItem.chartOfAccount.leaf = this.leaf_;
    this.selectedItem.chartOfAccount.parentChartOfAccountId = this.parentChartOfAccountId_;
    this.selectedItem.chartOfAccount.parentGlCode = this.parentGlCode_;
    this.selectedItem.chartOfAccount.parentGlDesc = this.parentGlDesc_;
    this.selectedItem.chartOfAccount.chartOfAccountId = this.chartofAccountId_;
    this.selectedItem.chartOfAccount.glFamily = this.glFamily_;
    this.selectedItem.chartOfAccount.participant = this.selectedItem.participant;


    this.selectedAppliedLevy(); 
    this.selectedItem.appliedLevy = [];
    let cal = [];
    for (let j = 0; j < this.selectedLevies.length; j++) {
       
      cal[j] = new ClientAppliedLevy();
      cal[j].clientAppliedLevyId = null;
      cal[j].clientId = this.selectedItem.clientId;
      cal[j].levyMasterId = this.selectedLevies[j];
      this.selectedItem.appliedLevy.push(cal[j]);
    }

     
    this.selectedItem.clientMarkets = [];
    let allowedMarketIndex = 0;
    for (let j = 0; j < this.itemsAllowedMarketList.itemCount; j++) {
        if (this.itemsAllowedMarketList.items[j].market.selected == true) {
          var clientMarket = new ClientMarket();
          clientMarket.clientMarketId = null;
          clientMarket.clientId = this.selectedItem.clientId;
          clientMarket.exchangeMarketId = null;
          clientMarket.marketId = this.itemsAllowedMarketList.items[j].market.marketId;
          clientMarket.marketCode = "";
          clientMarket.exchangeId = this.itemsAllowedMarketList.items[j].exchange.exchangeId;
          clientMarket.exchangeName = "";
          clientMarket.active = true;
          this.selectedItem.clientMarkets[allowedMarketIndex] = clientMarket;
          allowedMarketIndex++;
        }

    }

   //==================Account Configuration Section 

    this.selectedItem.statusCode = (this.selectedItem.statusCode == AppConstants.INV_STATUS_DRAFT || this.selectedItem.statusCode == AppConstants.INV_STATUS_EMPTY 
    || this.selectedItem.statusCode == AppConstants.INV_STATUS_REJECTED) ? AppConstants.INV_STATUS_SUBMITTED : this.selectedItem.statusCode;
    this.selectedItem.clientId = this.InvestorClientId;

    if (!(AppUtility.isEmpty(this.itemsBanAccountList) || this.itemsBanAccountList.itemCount == 0)) {
      this.itemsBanAccountList.items.forEach(element => {
        bankListTemp.push(element);
      });
      this.selectedItem.bankAccount = bankListTemp;
    } else {
      this.selectedItem.bankAccount = null;
    }

    if (!(AppUtility.isEmpty(this.itemsBeneficiaryList) || this.itemsBeneficiaryList.itemCount == 0)) {
      this.itemsBeneficiaryList.items.forEach(element => {
        beneficiaryListTemp.push(element);
      });
      this.selectedItem.beneficiary = beneficiaryListTemp;
    } else {
      this.selectedItem.beneficiary = null;
    }

    if (this.showJoint) {
      if (!(AppUtility.isEmpty(this.itemsJointAccountList) || this.itemsJointAccountList.itemCount == 0)) {
        this.selectedItem.jointAccount = [];
        var itemFound = false;
        for (let i = 0; i < this.itemsJointAccountList.items.length; i++) {
          this.selectedItem.jointAccount[i] = this.itemsJointAccountList.items[i];
          itemFound = true;
        }
        if (itemFound == false) {
          this.selectedItem.jointAccount = null;
        }
      } else {
        this.selectedItem.jointAccount = null;
      }
    } else {
      this.selectedItem.jointAccount = null;
    }
    if (!(AppUtility.isEmpty(this.itemsDocumentList) || this.itemsDocumentList.itemCount == 0)) {
      this.itemsDocumentList.items.forEach(element => {
        documentsListTemp.push(element);
      });
      this.selectedItem.clientDocuments = documentsListTemp;
    } else {
      this.selectedItem.clientDocuments = null;
    }


      if (!AppUtility.isEmpty(this.currentTab_)) {
        isValid = this.validateBasicInfo();
        if (this.currentTab_ == "BI" && isValid == false) {
          return;
        }
        if (this.currentTab_ != "BI" && isValid == false) {
          this.dialogCmp.statusMsg = 'Please fill all mandatory fields for Basic tab.';
          this.dialogCmp.showAlartDialog('Notification');
          return;
        }

        isValid = this.validateContactDetail();
        if (this.currentTab_ != "CON" && isValid == false) {
          this.dialogCmp.statusMsg = 'Please fill all mandatory fields for Contact tab.';
          this.dialogCmp.showAlartDialog('Notification');
          return;
        }
        if (this.currentTab_ == "CON" && isValid == false) {
          return;
        }

        isValid = this.validateJointAccount();
        if (isValid == false && this.showCorporate) {
          isValid = true;
        }
        else if (isValid == true && !this.showCorporate) {
          isValid = true;
        }
        else if (isValid == true && this.showCorporate) {
          isValid = true;
        }
        else {
          isValid = false;
        }

        isValid = this.validateBankAccount();

        if (isValid == false) {
          return;
        }
        isValid = this.validateBeneficiary();
        if (isValid == false && this.showCorporate) {
          isValid = true;

        }
        else if (isValid == true && !this.showCorporate) {
          isValid = true;
        }
        else if (isValid == true && this.showCorporate) {
          isValid = true;
        }
        else {
          isValid = false;
        }
        isValid = this.validateDocument();
        if (isValid == false) {
          return;
        }

    
      if(AppUtility.isNullOrEmpty(String(this.glCode_)) || AppUtility.isNullOrEmpty(String(this.coaCode_)) 
      || AppUtility.isEmptyArray(this.selectedItem.appliedLevy) || !AppUtility.isValidVariable(this.selectedItem.commissionSlabMaster.commissionSlabId) 
      || !AppUtility.isValidVariable(this.selectedClientExchange.margin) || this.selectedItem.clientMarkets.length === 0) {
        this.dialogCmp.statusMsg = AppConstants.INV_TRADING_CONFIG_MANDATORY_TEXT;
        this.dialogCmp.showAlartDialog('Notification');
        isValid = false;
        return;
      }
        
      if (isValid) {
        this.splash.show();  
        console.log("Client details:" + this.selectedItem);
        this.listingService.saveInvestor(this.selectedItem).subscribe(data => {
          this.splash.hide();      
          this.selectedItem.statusCode = data.statusCode;
        //  if (AppUtility.isEmpty(this.itemsList))
        //  this.itemsList = new wjcCore.CollectionView;
          this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
          this.dialogCmp.showAlartDialog('Success');
        },
          (error) => {
            this.selectedItem.statusCode = (this.selectedItem.statusCode == AppConstants.INV_STATUS_DRAFT || this.selectedItem.statusCode == AppConstants.INV_STATUS_EMPTY || this.selectedItem.statusCode == AppConstants.INV_STATUS_REJECTED) ? AppConstants.INV_STATUS_SUBMITTED : this.selectedItem.statusCode;
            this.splash.hide();
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


   





  public onRefreshCDCStatus = () => {
    this.splash.show();
    let cdcRecordForFilter = this.itemsList.items;
    this.isDisabledButtons = false;
    this.invCDCStatus = [];
    if (AppUtility.isEmptyArray(cdcRecordForFilter)) {
      for (let i = 0; i < cdcRecordForFilter.length; i++) {
        this.invCDCStatus[i] = new InvCDCStatus();
        this.invCDCStatus[i].participant_Code = cdcRecordForFilter[i].participant.participantCode;
        this.invCDCStatus[i].ref_No = String(cdcRecordForFilter[i].clientId);
      }
    }
    this.listingService.getInvestorCDCStatuses(this.invCDCStatus).subscribe((restData: any) => {
      
      this.splash.hide();
      restData.map((element: any) => {
        if (element.statusCode === AppConstants.INV_STATUS_CONFIRMED) {
          element.statusDesc = AppConstants.INV_CONFIRMED;
        }
        else if (element.statusCode === AppConstants.INV_STATUS_ACTIVE) {
          element.statusDesc = AppConstants.INV_ACTIVE;
        }
        else if (element.statusCode === AppConstants.INV_STATUS_DRAFT) {
          element.statusDesc = AppConstants.INV_DRAFT;
        }
        else if (element.statusCode === AppConstants.INV_STATUS_PENDING) {
          element.statusDesc = AppConstants.INV_PENDING;
        }
        else if (element.statusCode === AppConstants.INV_STATUS_SUBMITTED) {
          element.statusDesc = AppConstants.INV_SUBMITTED;
        }
        else if (element.statusCode === AppConstants.INV_STATUS_REJECTED) {
          element.statusDesc = AppConstants.INV_REJECTED;
        }
        else if (element.statusCode === AppConstants.INV_STATUS_REGISTERED) {
          element.statusDesc = AppConstants.INV_REGISTERED;
        }
      });
      this.itemsList = new wjcCore.CollectionView(restData);
    }, (error) => {
       
      this.splash.hide();
      if(error.message){
        this.errorMessage = <any>error.message;
      }
      else
      {
        this.errorMessage = <any>error;
      }
      this.dialogCmp.statusMsg = this.errorMessage;
      this.dialogCmp.showAlartDialog('Error');
    })


  }













  public onSaveJointAccountAction(model: any, isValid: boolean) {

    this.isSubmittedJointAccount = true;
    if (AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.firstName) ||
      AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.lastName) ||
      AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.taxNumber) ||
      AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.identificationTypeId) ||
      AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.identificationType)) {
      return false;
    }

    if (isValid) {
      var cba: ClientJointAccount = this.itemsJointAccountList.addNew();
      cba.clientId = this.selectedItem.clientId;
      cba.clientJointAccountId = null;
      cba.contactDetail = new ContactDetail();
      cba.contactDetail.contactDetailId = null;
      cba.contactDetail.firstName = this.selectedJointAccountItem.contactDetail.firstName;
      cba.contactDetail.middleName = this.selectedJointAccountItem.contactDetail.middleName;
      cba.contactDetail.lastName = this.selectedJointAccountItem.contactDetail.lastName;
      cba.contactDetail.fatherHusbandName = this.selectedJointAccountItem.contactDetail.fatherHusbandName;
      cba.contactDetail.gender = this.selectedJointAccountItem.contactDetail.gender;
      cba.contactDetail.taxNumber = this.selectedJointAccountItem.contactDetail.taxNumber;
      cba.contactDetail.identificationType = this.selectedJointAccountItem.contactDetail.identificationType;
      cba.contactDetail.dob = this.selectedJointAccountItem.contactDetail.dob;
      cba.contactDetail.professionId = this.selectedJointAccountItem.contactDetail.professionId;


      cba.contactDetail.identificationTypeId = this.selectedJointAccountItem.contactDetail.identificationTypeId;
      for (let i = 0; i < this.identificationTypeList.length; i++) {
        if (this.selectedJointAccountItem.contactDetail.identificationTypeId == this.identificationTypeList[i].identificationTypeId) {
          cba.contactDetail.identificationTypeStr = this.identificationTypeList[i].identificationType;
          break;
        }
      }


      this.itemsJointAccountList.commitNew();
      AppUtility.moveSelectionToLastItem(this.itemsJointAccountList);
      //  this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
      //  this.dialogCmp.showAlartDialog('LocalSuccess');
      this.clearJointAccountFields();
    }
  }

  public onChangeMarginEvent(e) {
    if (e.target.value > 100) {
      this.marginPerExceed = true;
    } else {
      this.marginPerExceed = false;
    }
  }

  public onSaveClientExchangesAction(model: any, isValid: boolean) {
    ;
    if (!this.deleteClientExchangeAction) {
      this.isSubmittedClientExchange = true;
      if (AppUtility.isEmpty(this.selectedClientExchange.exchangeId) ||
        AppUtility.isEmpty(this.selectedClientExchange.margin)) {
        return false;
      } else if (this.selectedClientExchange.margin > 100) {
        this.marginPerExceed = true;
        return false;
      }
      else {
        isValid = true;
      }
      if (isValid) {
        if (this.isEditingClientExchange) {
          for (let i = 0; i < this.itemsClientExchangeList.itemCount; i++) {
            if (this.selectedClientExchange.exchangeId == this.itemsClientExchangeList.items[i].exchangeId) {
              this.fillClientExchangeFromJSON(this.itemsClientExchangeList.items[i], this.selectedClientExchange);
            }
          }
          this.itemsClientExchangeList.commitEdit();
          this.itemsClientExchangeList.refresh();
          this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
          this.dialogCmp.showAlartDialog('LocalSuccess');
          if (!this.isEditing) {
            this.populateAllowedMarkets(this.selectedClientExchange.exchangeId, this.selectedClientExchange.exchangeName);
            this.populateCustodians(this.selectedClientExchange.exchangeId, this.selectedClientExchange.exchangeName);
          }
        } else {
          for (let i = 0; i < this.itemsClientExchangeList.itemCount; i++) {
            if (this.selectedClientExchange.exchangeId == this.itemsClientExchangeList.items[i].exchangeId) {
              this.dialogCmp.statusMsg = this.itemsClientExchangeList.items[i].exchangeName + " already exist.";
              this.dialogCmp.showAlartDialog('Warning');
              return;
            }
          }
          var cba: ClientExchange = this.itemsClientExchangeList.addNew();
          cba.clientExchangeId = this.selectedClientExchange.clientExchangeId;
          cba.clientId = this.selectedItem.clientId;
          cba.active = this.selectedClientExchange.active;
          cba.allowShortSell = this.selectedClientExchange.allowShortSell;
          cba.bypassCrs = this.selectedClientExchange.bypassCrs;
          cba.openPositionStatus = this.selectedClientExchange.openPositionStatus;
          cba.margin = this.selectedClientExchange.margin;
          cba.exchangeId = this.selectedClientExchange.exchangeId;
          for (let i = 0; i < this.exchangeList.length; i++) {
            if (this.exchangeList[i].exchangeId == this.selectedClientExchange.exchangeId) {
              cba.exchangeName = this.exchangeList[i].exchangeName;
              this.selectedClientExchange.exchangeName = cba.exchangeName;
              break;
            }
          }
          cba.participantExchangeId = this.selectedClientExchange.participantExchangeId;
          this.itemsClientExchangeList.commitNew();
          AppUtility.moveSelectionToLastItem(this.itemsClientExchangeList);
          if (!this.isEditing) {
            this.populateAllowedMarkets(cba.exchangeId, cba.exchangeName);
            this.populateCustodians(cba.exchangeId, cba.exchangeName);
          }
          this.dialogCmp.statusMsg = "Record added successfully";
          this.dialogCmp.showAlartDialog('LocalSuccess');
        }
        this.clearClientExchangeFields();
      }
    } else {
      this.deleteClientExchangeAction = false;
    }
  }

  public onAddDocument(model: any, isValid: boolean) {

    this.isSubmittedDocumentForm = true;
    if (AppUtility.isEmpty(this.file_srcs) || AppUtility.isEmpty(this.file_srcs)[0]) {
      this.fileSelectionMsgShow = true;
    } else {
      this.fileSelectionMsgShow = false;
    }
    if (AppUtility.isEmpty(this.file_srcs) || AppUtility.isEmpty(this.file_srcs)[0] ||
      this.fileSizeExceed) {
      return false;
    }
    else {
      isValid = true;
    }
    if (isValid) {
      if (!AppUtility.isEmpty(this.itemsDocumentList) && this.itemsDocumentList.itemCount == 5) {
        this.dialogCmp.statusMsg = "Maximum 5 documents are allowed.";
        this.dialogCmp.showAlartDialog('Warning');
        return;
      }

      var cba: ClientDocument = this.itemsDocumentList.addNew();
      cba.clientDocumentId = this.selectedClientDocument.clientDocumentId;
      cba.clientId = this.selectedItem.clientId;
      //application/vnd.openxmlformats-officedocument.wordprocessingml.document  ==> for DOCX file type
      cba.contentType = this.fileContentType_;
      cba.documentName = this.fileName_;
      cba.documentBase64_ = (this.file_srcs[0]);
      cba.issueDate = this.selectedClientDocument.issueDate;
      cba.expiryDate = this.selectedClientDocument.expiryDate;
      cba.issuePlace = this.selectedClientDocument.issuePlace;
      cba.documentType = new DocumentType();
      cba.documentType.documentTypeId = this.selectedClientDocument.documentType.documentTypeId;

      for (let i = 0; i < this.documentTypes.length; i++) {
        if (this.selectedClientDocument.documentType.documentTypeId == this.documentTypes[i].documentTypeId) {
          cba.documentType.type = this.documentTypes[i].type;
          break;
        }
      }



      this.itemsDocumentList.commitNew();
      AppUtility.moveSelectionToLastItem(this.itemsDocumentList);
      this.clearClientDocuemnt();
      //  this.dialogCmp.statusMsg = "Record added successfully.";
      //  this.dialogCmp.showAlartDialog('LocalSuccess');
    }
  }

  public onSaveBankDetailAction(model: any, isValid: boolean) {

    this.isSubmittedBankAccount = true;
    if (AppUtility.isEmpty(this.selectedBankAccountItem.bankBranch.bank.bankId) ||
      AppUtility.isEmpty(this.selectedBankAccountItem.bankBranch.bankBranchId) ||
      AppUtility.isEmpty(this.selectedBankAccountItem.bankAccountNo) ||
      AppUtility, isEmpty(this.selectedBankAccountItem.bankTitle)) {
      return false;
    }
     
    if (isValid) {
      var cba: ClientBankAccount = this.itemsBanAccountList.addNew();
      cba.clientId = this.selectedItem.clientId;
      cba.bankBranch = new BankBranch();
      cba.bankBranch.bankBranchId = this.selectedBankAccountItem.bankBranch.bankBranchId;
      for (let i = 0; i < this.bankBranchList.length; i++) {
        if (this.bankBranchList[i].bankBranchId == cba.bankBranch.bankBranchId) {
          cba.bankBranch.branchName = this.bankBranchList[i].branchName;
          break;
        }
      }
      cba.bankBranch.bank = new Bank();
      cba.bankBranch.bank.bankId = this.selectedBankAccountItem.bankBranch.bank.bankId;
      for (let i = 0; i < this.bankList.length; i++) {
        if (this.bankList[i].bankId == cba.bankBranch.bank.bankId) {
          cba.bankBranch.bank.bankName = this.bankList[i].bankName;
          break;
        }
      }
      cba.bankAccountNo = this.selectedBankAccountItem.bankAccountNo;
      cba.bankTitle = this.selectedBankAccountItem.bankTitle;
      this.itemsBanAccountList.commitNew();
      AppUtility.moveSelectionToLastItem(this.itemsBanAccountList);
      //  this.dialogCmp.statusMsg = "Record added successfully.";
      //l  this.dialogCmp.showAlartDialog('LocalSuccess');
    //  this.clearBankAccountFields();
      this.selectedBankItemFromGrid();

    }
     
  }

  public onSaveBeneficiaryAction(model: any, isValid: boolean) {

    this.isSubmittedBeneficiary = true;

    if (AppUtility.isEmpty(this.selectedBeneficiaryItem.beneficiaryName) ||
      AppUtility.isEmpty(this.selectedBeneficiaryItem.relation.relationId) ||
      AppUtility.isEmpty(this.selectedBeneficiaryItem.taxNumber)) {
      return false;
    }

    if (isValid) {
      var cba: Beneficiary = this.itemsBeneficiaryList.addNew();
      cba.client = new Client();
      cba.client.clientId = this.selectedItem.clientId;
      cba.relation = new Relation();
      cba.relation.relationId = this.selectedBeneficiaryItem.relation.relationId;
      for (let i = 0; i < this.relationList.length; i++) {
        if (this.relationList[i].relationId == cba.relation.relationId) {
          cba.relation.relationDesc = this.relationList[i].relationDesc;
          break;
        }
      }


      cba.beneficiaryName = this.selectedBeneficiaryItem.beneficiaryName;
      cba.beneficiaryCNIC = this.selectedBeneficiaryItem.beneficiaryCNIC;
      cba.taxNumber = this.selectedBeneficiaryItem.taxNumber;
      cba.identificationType = new IdentificationType();
      cba.identificationType.identificationTypeId = this.selectedBeneficiaryItem.identificationType.identificationTypeId;

      for (let i = 0; i < this.identificationTypeList.length; i++) {
        if (this.selectedBeneficiaryItem.identificationType.identificationTypeId == this.identificationTypeList[i].identificationTypeId) {
          cba.identificationType.identificationType = this.identificationTypeList[i].identificationType;

          break;
        }
      }


      this.itemsBeneficiaryList.commitNew();
      AppUtility.moveSelectionToLastItem(this.itemsBeneficiaryList);
      //  this.dialogCmp.statusMsg = "Record added successfully.";
      //  this.dialogCmp.showAlartDialog('LocalSuccess');
     // this.clearBeneficiaryFields();
    }
  }

  public onTabChangeEvent(currentTab) {
     
    this.currentTab_ = currentTab;

    if (this.currentTab_ == "AM") {
      this.flexAllowedMarket.invalidate();
    }
    if (this.currentTab_ == "CU") {
      this.flexCustodian.invalidate();
    }
    if (this.currentTab_ == "BA") {
      this.bankAccountGrid.invalidate();
    }
    if (this.currentTab_ == "DOC") {
      this.documentGrid.invalidate();
    }
    if (this.currentTab_ == "JA") {
      this.jointAccountGrid.invalidate();
    }
    if (this.currentTab_ == "CRS") {
      this.clientExchangeGrid.invalidate();
    }
    if (this.currentTab_ == "BEN") {
      this.beneficiaryGrid.invalidate();
    }
    if (this.currentTab_ == "CON") {
      this.CONAnchorTag.nativeElement.click();
    }
    if (this.currentTab_ === 'AC') {
      this.ACAnchorTag.nativeElement.click();
    }
  }

  public onClientTypeChangeEvent(selectedClientType) {
    this.selectedItem.clientType = selectedClientType;
    this.populateClientType();
  }

  public onAccountTypeChangeEvent(selectedAccountType) {
    this.selectedItem.accountType = selectedAccountType;
    this.populateAccountType();
  }

  public onGLCodeChangeEvent(e) {
    this.glCode_ = e;
    this.coaCode_ = this.clientControlChartOfAccountCode_ + "" + this.glCode_;
  }

  public onOnlineAccessEvent(e) {
    if (e.target.checked) {
      this.selectedItem.onlineClient = false;
    } else {
      this.selectedItem.onlineClient = false;
    }
    this.populateOnlineAccess();
  }

  public hideModal() {
    (jQuery("#add_new") as any).modal("hide");   //hiding the modal on save/updating the record
  }

  public onBankChangeEvent(slectedBankId): void {
    this.populateBranchListByBank(slectedBankId);
  }


  public onCountryChangeEvent(slectedCountryId): void {
    this.populateProvinceListByCountry(slectedCountryId);
  }

  public onProvinceChangeEvent(selectedProvinceId): void {

    this.populateCityListByProvince(selectedProvinceId);
  }

  public onExchangeChangeEvent(selectedId): void {
    /*this.populateMarketList(selectedId);
    this.populateCustodianList(selectedId);*/
  }

  public allowMarketCheckBoxEvent(exchangeId, marketId, state) {
    if (!AppUtility.isEmpty(exchangeId) && !AppUtility.isEmpty(marketId)) {
      for (let j = 0; j < this.itemsAllowedMarketList.itemCount; j++) {
       
          if ((this.itemsAllowedMarketList.items[j].market.marketId == marketId)
            &&
            (this.itemsAllowedMarketList.items[j].exchange.exchangeId == exchangeId)) {
            if (state.target.checked)
              this.itemsAllowedMarketList.items[j].market.selected = true;
            else
              this.itemsAllowedMarketList.items[j].market.selected = false;
            break;
          }
        
      }

    }
  }

  public chustodianCheckBoxEvent(exchangeId, custodianId, state) {
    if (!AppUtility.isEmpty(exchangeId) && !AppUtility.isEmpty(custodianId)) {
      for (let j = 0; j < this.itemsClientCustodianList.itemCount; j++) {
        for (let k = 0; k < this.itemsClientCustodianList.items[j].participantList.length; k++) {
          if ((this.itemsClientCustodianList.items[j].participantList[k].participantId == custodianId)) {
            if (state.target.checked)
              this.itemsClientCustodianList.items[j].participantList[k].selected = true;
            else
              this.itemsClientCustodianList.items[j].participantList[k].selected = false;
          }
        }
      }
    }
  }
  /***************************************
   *          Private Methods
   **************************************/


  private fillClientFromJson(c: Client, data: any) {

    debugger
    
    this.selectedIdentificationTypeId = data.contactDetail.identificationTypeId;
    if (data.accountType == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
      this.showJoint = true;
      this.populateIdentificationTypesChange(AppConstants.ACCOUNT_TYPE_INDIVIDUAL);
    } else if(data.accountType == AppConstants.ACCOUNT_TYPE_CORPORATE_ID || data.accountType == AppConstants.ACCOUNT_TYPE_COLLECTIVE_INVESTMENT_ID || data.accountType === AppConstants.ACCOUNT_TYPE_CORPORATE_INSTITUTIONAL_ID){
      this.showCorporate = true;
      this.populateIdentificationTypesChange(AppConstants.ACCOUNT_TYPE_CORPORATE);
    }
    else{
      this.showIndividual = true;
      this.populateIdentificationTypesChange(AppConstants.ACCOUNT_TYPE_INDIVIDUAL);
    }

    this.statusCodeForInvReg = data.statusCode;
    this.clientCodeForInvReg = data.clientCode;
    this.selectedAccTypeId = data.accountTypeNew.accTypeId;
    this.selectedParticipantId = data.participant.participantId;
    if(data.agent !== null) {
      this.selectedAgentId = data.agent.agentId;
    }
   
    c.accountCategory = data.accountCategory;
    c.clientId = data.clientId;
    c.accountType = data.accountType;
    c.active = data.active;
    c.allowShortSell = data.allowShortSell;
    c.bypassCrs = data.bypassCrs;
    c.clientCode = data.clientCode;
    c.depositoryAccountNo = data.depositoryAccountNo;
    c.risk = data.risk;
    c.sendEmail = data.sendEmail;
    c.sendMail = data.sendMail;
    c.proprietaryAccount = data.proprietaryAccount;
    c.sendSms = data.sendSms;
    c.generateKits = data.generateKits;
    c.margin = data.margin;
    c.onlineClient = false;//data.onlineClient;
    c.openPositionStatus = data.openPositionStatus;
    c.reference = data.reference;
    c.clientType = data.clientType;
    c.displayName_ = data.displayName_;
    c.glCodeLength_ = data.glCodeLength_;
    c.annualGrossIncome = data.annualGrossIncome;
    c.accountTypeNew.accTypeId = data.accountType;
    c.clientId = data.clientId;
    c.statusCode = data.statusCode;

   
     
    c.participant = new Participant;
    c.participant.participantId = data.participant.participantId;
    c.participant.participantCode = data.participant.participantCode;
    c.participant.participantName = data.participant.participantName;
    
    c.participant.exchange = new Exchange();
    c.participant.exchange.exchangeId = data.participant.exchange.exchangeId;
    c.participant.exchange.exchangeCode = data.participant.exchange.exchangeCode;
    c.participant.exchange.exchangeName = data.participant.exchange.exchangeName;

    if (data.chartOfAccount != null && data.chartOfAccount.chartOfAccountId !=  null) {
      c.chartOfAccount = new ChartOfAccount();
      c.chartOfAccount = data.chartOfAccount;
      this.glCode_ = data.chartOfAccount.glCode.substr(this.participantGlCode.length, data.chartOfAccount.glCode.length);
      this.coaCode_ = data.chartOfAccount.glCode;
    }


    c.contactDetail = new ContactDetail;
    c.contactDetail.contactDetailId = data.contactDetail.contactDetailId;
    c.contactDetail.taxNumber = data.contactDetail.taxNumber;
    c.contactDetail.trustee = data.contactDetail.trustee;
    c.contactDetail.country = data.contactDetail.country;
    c.contactDetail.countryId = data.contactDetail.countryId;
    c.contactDetail.province = data.contactDetail.province;
    c.contactDetail.provinceId = data.contactDetail.provinceId;
    c.contactDetail.city = data.contactDetail.city;
    c.contactDetail.cityId = data.contactDetail.cityId;
    c.contactDetail.firstName = data.contactDetail.firstName;
    c.contactDetail.middleName = data.contactDetail.middleName;
    c.contactDetail.lastName = data.contactDetail.lastName;
    c.contactDetail.fatherHusbandName = data.contactDetail.fatherHusbandName;
    c.contactDetail.gender = data.contactDetail.gender;
    if (AppUtility.isEmpty(c.contactDetail.gender))
      c.contactDetail.gender = "M";
    c.contactDetail.residenceStatus = Number(data.contactDetail.residenceStatus);
    c.contactDetail.ntnNo = data.contactDetail.ntnNo == null ? "0" : data.contactDetail.ntnNo;
    c.contactDetail.identificationTypeId = data.contactDetail.identificationTypeId;
    c.contactDetail.identificationType = data.contactDetail.identificationType;
   

    c.contactDetail.registrationNo = data.contactDetail.registrationNo;
    c.contactDetail.professionId = data.contactDetail.professionId;
    this.selectedProfessionId = data.contactDetail.professionId;
    c.contactDetail.phone1 = data.contactDetail.phone1;
    c.contactDetail.cellNo = (data.contactDetail.cellNo) == null ? "" : data.contactDetail.cellNo;
    c.contactDetail.email = data.contactDetail.email;
    if (!AppUtility.isEmpty(data.contactDetail.dob)) {
      c.contactDetail.dob = data.contactDetail.dob;
    } else {
      c.contactDetail.dob = new Date();
    }

    if (!AppUtility.isEmpty(data.contactDetail.idExpDate)) {
      c.contactDetail.idExpDate = data.contactDetail.idExpDate;
    } else {
      c.contactDetail.idExpDate = new Date();
    }

    if (!AppUtility.isEmpty(data.contactDetail.idIssueDate)) {
      c.contactDetail.idIssueDate = data.contactDetail.idIssueDate;
    } else {
      c.contactDetail.idIssueDate = new Date();
    }
    c.contactDetail.issuePlaceId = data.contactDetail.issuePlaceId;


    c.contactDetail.postalCode = (data.contactDetail.postalCode) == null ? "" : data.contactDetail.postalCode;
    c.contactDetail.address1 = data.contactDetail.address1;
    c.contactDetail.address2 = data.contactDetail.address2;
    c.contactDetail.address3 = data.contactDetail.address3;
    c.contactDetail.companyName = data.contactDetail.companyName;
    c.contactDetail.industryId = data.contactDetail.industryId;
    c.contactDetail.registerationDate = data.contactDetail.registerationDate;
    c.contactDetail.contactPerson = (data.contactDetail.contactPerson) == null ? "" : data.contactDetail.contactPerson;


    this.selectedCountryId = data.contactDetail.countryId;
    if (data.contactDetail.provinceId > 0) {
      this.selectedProvinceId = data.contactDetail.provinceId;
      this.populateProvinceListByCountry(data.contactDetail.countryId);
    }

    if (data.contactDetail.cityId > 0) {
      this.selectedCityId = data.contactDetail.cityId;
      this.populateCityListByProvince(this.selectedProvinceId);
    }


    c.participantBranch = new ParticipantBranch;
    c.participantBranch.branchId = data.participantBranch.branchId;
    c.participantBranch.branchCode = data.participantBranch.branchCode;
    c.participantBranch.displayName_ = data.participantBranch.displayName_;
    this.selectedItem.participantBranch.branchId = data.participantBranch.branchId;
    this.selectedParticipantBranchId = data.participantBranch.branchId;

    c.user = new User;
    c.user.userId = data.user.userId;
    c.user.email = data.user.email;
    c.user.password = data.user.password;
    c.user.status = data.user.status;
    c.user.active = data.user.active;
    c.user.userName = data.user.userName;

    if(data.agent !== null) {
      c.agent = new Agent;
      c.agent.agentId = data.agent.agentId;
      c.agent.agentCode = data.agent.agentCode;
    }
 


    c.user.participant = new Participant;
    c.user.participant.participantId = data.user.participant.participantId;

    c.bankAccount = data.bankAccount;
    c.jointAccount = data.jointAccount;

    c.incomeSource = new IncomeSource();
    c.incomeSource.incomeSourceId = (data.incomeSource != null) ? data.incomeSource.incomeSourceId : null;
    c.incomeSource.incomeSourceDesc = (data.incomeSource != null) ? data.incomeSource.incomeSourceDesc : null;
    c.annualGrossIncome = data.annualGrossIncome == null ? 0 : data.annualGrossIncome;
    c.incomePercentage = data.incomePercentage == null ? 0 : data.incomePercentage;

    if(AppUtility.isValidVariable(data.commissionSlabMaster)){
      c.commissionSlabMaster = new CommissionSlabMaster();
      c.commissionSlabMaster.commissionSlabId = data.commissionSlabMaster.commissionSlabId;
    }
 
 
      
    c.appliedLevy = [];    
    let tempLevy = [];
    for(let i=0; i<data.appliedLevy.length; i++) {
      c.appliedLevy[i] = new ClientAppliedLevy();
      c.appliedLevy[i].levyMasterId = data.appliedLevy[i].leviesMasterId;
      c.appliedLevy[i].clientAppliedLevyId = data.appliedLevy[i].clientAppliedLevyId;
      c.appliedLevy[i].clientId = data.appliedLevy[i].clientId;

      if ( this.leviesList != null && this.leviesList.length > 0) {
        for (let j = 0 ; j < this.leviesList.length; j++) {
          if ( c.appliedLevy[i].levyMasterId == this.leviesList[j].leviesMasterId )  {
            this.leviesList[j].selected = true; 
            this.leviesList[j].$checked = true; 
            tempLevy.push(this.leviesList[j]);

          } else {
            this.leviesList[j].selected = false; 
            this.leviesList[j].$checked = false; 
          }
        }
      }
    }

    this.cmbLevy.checkedItems = tempLevy;
    this.cmbLevy.refresh();
   
    if(!AppUtility.isEmptyArray(data.clientExchange)){
      this.fillClientExchangeFromJSON(this.selectedClientExchange , data.clientExchange[0]);
      c.clientExchange = [];
      c.clientExchange[0] = this.selectedClientExchange;
    }
   

    c.clientMarkets = [];
    c.clientMarkets = data.clientMarkets;
    this.selectedBankItemFromGrid();
    this.selectedJointAccountItemFromGrid();
    

  }



 


  private fillClientExchangeFromJSON(c: ClientExchange, data: any) {
     
    c.clientExchangeId = data.clientExchangeId;
    c.active = data.active;
    c.allowShortSell = data.allowShortSell;
    c.bypassCrs = data.bypassCrs;
    c.margin = data.margin;
    c.openPositionStatus = data.openPositionStatus;
    c.clientId = data.clientId;
    c.exchangeId = data.exchangeId;
    c.exchangeName = data.exchangeName;
    c.participantExchangeId = data.participantExchangeId;

  }

  private populateItemGrid() {

    this.splash.show();
    if (AppUtility.isEmpty(this.searchInvestorTaxNumber) && AppUtility.isEmpty(this.searchInvestorName)) {
      this.listingService.getInvestorListByParticipant(AppConstants.participantId)
        .subscribe(
          restData => {
            this.splash.hide();
            restData.map((element: any) => {
              if (element.statusCode === AppConstants.INV_STATUS_CONFIRMED) {
                element.statusDesc = AppConstants.INV_CONFIRMED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_APPROVED) {
                element.statusDesc = AppConstants.INV_APPROVED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_DRAFT) {
                element.statusDesc = AppConstants.INV_DRAFT;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_PENDING) {
                element.statusDesc = AppConstants.INV_PENDING;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_SUBMITTED) {
                element.statusDesc = AppConstants.INV_SUBMITTED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_REJECTED) {
                element.statusDesc = AppConstants.INV_REJECTED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_REGISTERED) {
                element.statusDesc = AppConstants.INV_REGISTERED;
              }
            });
            this.itemsList = new wjcCore.CollectionView(restData);

          },
          error => {
            this.splash.hide();
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (!AppUtility.isEmpty(this.searchInvestorTaxNumber) && AppUtility.isEmpty(this.searchInvestorName)) {
      this.listingService.getInvestorListBySearch(AppConstants.participantId, AppConstants.ALL_VAL, encodeURIComponent(this.searchInvestorTaxNumber))
        .subscribe(
          restData => {

            this.splash.hide();
            restData.map((element: any) => {
              if (element.statusCode === AppConstants.INV_STATUS_CONFIRMED) {
                element.statusDesc = AppConstants.INV_CONFIRMED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_APPROVED) {
                element.statusDesc = AppConstants.INV_APPROVED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_DRAFT) {
                element.statusDesc = AppConstants.INV_DRAFT;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_PENDING) {
                element.statusDesc = AppConstants.INV_PENDING;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_SUBMITTED) {
                element.statusDesc = AppConstants.INV_SUBMITTED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_REJECTED) {
                element.statusDesc = AppConstants.INV_REJECTED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_REGISTERED) {
                element.statusDesc = AppConstants.INV_REGISTERED;
              }
            });
            this.itemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.splash.hide();
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (AppUtility.isEmpty(this.searchInvestorTaxNumber) && !AppUtility.isEmpty(this.searchInvestorName)) {
      this.listingService.getInvestorListBySearch(AppConstants.participantId, encodeURIComponent(this.searchInvestorName), AppConstants.ALL_VAL)
        .subscribe(
          restData => {

            restData.map((element: any) => {
              if (element.statusCode === AppConstants.INV_STATUS_CONFIRMED) {
                element.statusDesc = AppConstants.INV_CONFIRMED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_APPROVED) {
                element.statusDesc = AppConstants.INV_APPROVED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_DRAFT) {
                element.statusDesc = AppConstants.INV_DRAFT;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_PENDING) {
                element.statusDesc = AppConstants.INV_PENDING;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_SUBMITTED) {
                element.statusDesc = AppConstants.INV_SUBMITTED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_REJECTED) {
                element.statusDesc = AppConstants.INV_REJECTED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_REGISTERED) {
                element.statusDesc = AppConstants.INV_REGISTERED;
              }
            });
            this.splash.hide();
            this.itemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.splash.hide();
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (!AppUtility.isEmpty(this.searchInvestorTaxNumber) && !AppUtility.isEmpty(this.searchInvestorName)) {
      this.listingService.getInvestorListBySearch(AppConstants.participantId, encodeURIComponent(this.searchInvestorName), encodeURIComponent(this.searchInvestorTaxNumber),)
        .subscribe(
          restData => {

            this.splash.hide();
            restData.map((element: any) => {
              if (element.statusCode === AppConstants.INV_STATUS_CONFIRMED) {
                element.statusDesc = AppConstants.INV_CONFIRMED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_APPROVED) {
                element.statusDesc = AppConstants.INV_APPROVED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_DRAFT) {
                element.statusDesc = AppConstants.INV_DRAFT;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_PENDING) {
                element.statusDesc = AppConstants.INV_PENDING;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_SUBMITTED) {
                element.statusDesc = AppConstants.INV_SUBMITTED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_REJECTED) {
                element.statusDesc = AppConstants.INV_REJECTED;
              }
              else if (element.statusCode === AppConstants.INV_STATUS_REGISTERED) {
                element.statusDesc = AppConstants.INV_REGISTERED;
              }
            });
            this.itemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.splash.hide();
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    }
  }

  loadLeveisByParticipant(): void {
    this.listingService.getLeviesByBroker(AppConstants.participantId).subscribe(
      data => {
        if (data != null) {
          this.leviesList = data;
          var levy: ClientLevieMaster = new ClientLevieMaster();
          levy.leviesMasterId = AppConstants.ALL_VAL;
          levy.levyCode = AppConstants.ALL_STR;
          this.leviesList.unshift(levy);
        }
      },
      error => this.errorMessage = <any>error.message);
  }

  private populateClientLeveis(clientId: Number) {
     
   
    this.selectedLevies = null;
    this.listingService.getLeviesByClient(clientId)
      .subscribe(
        restData => {
         
          this.selectedLevies = restData;

          if (!AppUtility.isEmptyArray(this.selectedLevies)) {
            for (let i = 0; i < this.leviesList.length; i++) {
              for (let j = 0; j < this.selectedLevies.length; j++) {
                if (this.leviesList[i].leviesMasterId == this.selectedLevies[j].leviesMasterId) {
                  this.leviesList[i].selected = true;
                  this.leviesList[i].$checked = true;
                }
              }
            }

            if (AppUtility.isValidVariable(this.cmbLevy) && !this.cmbLevy.containsFocus())
              this.cmbLevy.refresh();
          }
        },
        error => { this.splash.hide(); this.errorMessage = <any>error.message });
  }

  private populateCommissionSlabList() {
   
    this.listingService.getCommissionSlabList(AppConstants.participantId)
      .subscribe(
        restData => {
       
          if (AppUtility.isEmpty(restData)) {
            this.commissionSlabList = [];
          } else {
            this.commissionSlabList = restData;
          }
          var csm: CommissionSlabMaster = new CommissionSlabMaster();
          csm.commissionSlabId = AppConstants.PLEASE_SELECT_VAL;
          csm.slabNameDisplay_ = AppConstants.PLEASE_SELECT_STR;
          this.commissionSlabList.unshift(csm);
          if (!AppUtility.isEmptyArray(this.commissionSlabList)) {
            this.selectedItem.commissionSlabMaster.commissionSlabId = this.commissionSlabList[0].commissionSlabId;
          }
        },
        error => { this.splash.hide(); this.errorMessage = <any>error.message });
  }




  private populateParticipantBranchList(participantId) {

    
    this.listingService.getParticipantBranchList(participantId)
      .subscribe(
        restData => {

         
          if (AppUtility.isEmpty(restData)) {
            this.participantBranchList = [];
          } else {
            this.participantBranchList = restData;
            setTimeout(() => {
              if (!this.isShowInvestorForm) {
                this.selectedItem.participantBranch.branchId = this.participantBranchList[0].branchId;
                this.selectedItem.participantBranch.displayName_ = this.participantBranchList[0].displayName_;
              } else {

                this.selectedItem.participantBranch.branchId = this.selectedParticipantBranchId;
              }
            }, 150);
          }

          if (this.showSelectForParticpantsBranch) {
            var pb: ParticipantBranch = new ParticipantBranch();
            pb.branchId = AppConstants.PLEASE_SELECT_VAL;
            pb.displayName_ = AppConstants.PLEASE_SELECT_STR;
            this.participantBranchList.unshift(pb);
          }
        },
        error => { this.splash.hide(); this.errorMessage = <any>error.message });
  }









  private populateAgentList(participantId : Number) {
    debugger
   this.splash.show();
   this.listingService.getActiveAgentsbyParticipant(participantId)
     .subscribe(
       restData => {
         this.splash.hide();
         if (AppUtility.isEmpty(restData)) {
           this.agentList = [];
         } else {
           this.agentList = restData;
           setTimeout(() => {

             if (!this.isShowInvestorForm) {

               this.selectedItem.agent.agentId = this.agentList[0].agentId;
               this.selectedItem.agent.displayName_ = this.agentList[0].displayName_;
             } else {

               this.selectedItem.agent.agentId = this.selectedAgentId;
             }
           }, 150);
         }

         if (this.showSelectForParticpantsBranch) {
         var ag: Agent = new Agent();
         ag.agentId = AppConstants.PLEASE_SELECT_VAL;
         ag.displayName_ = AppConstants.PLEASE_SELECT_STR;
         this.agentList.unshift(ag);
         if (!AppUtility.isEmptyArray(this.agentList)) {
           this.selectedItem.agent.agentId = this.agentList[0].agentId;
         }
       }
       },
       error => { this.splash.hide(); this.errorMessage = <any>error.message });
 }




  public populateResidenceStatusList() {
      
    this.listingService.getInvestorResidenceStatusList()
      .subscribe(
        restData => {
          if (AppUtility.isEmpty(restData)) {
            this.residenceStatusList = [];
          } else {
            this.residenceStatusList = restData;
          }
          var rs: ResidenceStatus = new ResidenceStatus();
          rs.residenceStatusId = AppConstants.PLEASE_SELECT_VAL;
          rs.residenceStatusValue = AppConstants.PLEASE_SELECT_STR;
          this.residenceStatusList.unshift(rs);
          if (!AppUtility.isEmptyArray(this.residenceStatusList)) {
            this.selectedItem.contactDetail.residenceStatus = this.residenceStatusList[0].residenceStatusId;
          }
        },
        error => { this.splash.hide(); this.errorMessage = <any>error.message });
  }









  public focusBasicTab = () => {
    this.showForm = true;
    this.BIAnchorTag.nativeElement.click();
    this.currentTab_ = "BI";
  }







  private populateAccountTypeInvestor() {

 
    this.listingService.getAccountTypeInvestorList().subscribe(restData => {

     
      if (AppUtility.isEmpty(restData)) {
        this.accountTypeInvestorList = [];
      } else {
        this.accountTypeInvestorList = restData;
        var at: AccountType = new AccountType();
        at.accTypeId = AppConstants.PLEASE_SELECT_VAL;
        at.description = AppConstants.PLEASE_SELECT_STR;
      
        if (!AppUtility.isEmptyArray(this.accountTypeInvestorList)) {
          setTimeout(() => {
            this.selectedItem.accountTypeNew.accTypeId = this.selectedAccTypeId;
          }, 500);
       }
      }



    },
      error => { this.splash.hide(); this.errorMessage = <any>error.message });
  }


  private populateParticipants() {
    let tempArr:any[]=[];
    this.listingService.getParticipantListByExchagne(AppConstants.exchangeId).subscribe(restData => {
      if (AppUtility.isEmpty(restData)) {
        this.participantsList = [];
      } else {
        this.participantsList = restData;
      }
     
      // filter participant list 
      if (this.showParticipantBasedGrid) {
        for (let i = 0; i < this.participantsList.length; i++) {
          if (this.participantsList[i].participantId == AppConstants.participantId) {
            tempArr.push(this.participantsList[i]);
          }
        }

        this.participantsList = tempArr;
      }

      else {
        var p: Participant = new Participant();
        p.participantId = AppConstants.PLEASE_SELECT_VAL;
        p.displayName_ = AppConstants.PLEASE_SELECT_STR;
        this.participantsList.unshift(p);
      }

      // if (!AppUtility.isEmptyArray(this.participantsList)) {
      //    setTimeout(() => {
      //      this.selectedItem.participant.participantId = this.selectedParticipantId;
      //    }, 500);
      // }
    },
      error => { this.splash.hide(); this.errorMessage = <any>error.message });
  }



  private populateExchangeList() {
  
    this.listingService.getParticipantExchangeList(AppConstants.participantId)
      .subscribe(
        restData => {
         
          if (AppUtility.isEmpty(restData)) {
            this.exchangeList = [];
          } else {
            this.exchangeList = restData;
          }
          var ag: Exchange = new Exchange();
          ag.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          ag.exchangeName = AppConstants.PLEASE_SELECT_STR;
          this.exchangeList.unshift(ag);

        },
        error => { this.splash.hide(); this.errorMessage = <any>error.message });
  }

  /*private populateMarketList(exchangeId: number) {
    if (AppUtility.isEmpty(exchangeId)) {
      this.marketList = [];
      return;
    }
    this.listingService.getMarketListByExchange(exchangeId)
      .subscribe(
      restData => {
        this.marketList = restData;
      },
      error => this.errorMessage = <any>error);
  }*/
  /*private populateCustodianList(exchangeId: number) {
    if (AppUtility.isEmpty(exchangeId)) {
      this.custodianList = [];
      return;
    }
    this.listingService.getCustodianByExchange(exchangeId)
      .subscribe(
      restData => {
        this.custodianList = restData;
      },
      error => this.errorMessage = <any>error);
  }*/





  private populateDocumentTypes() {
 
    this.listingService.getInvestorDocumentsTypeList()
      .subscribe(
        restData => {
      
          if (AppUtility.isEmpty(restData)) {
            this.documentTypes = [];
          } else {
            this.documentTypes = restData;
          }
          var ag: DocumentType = new DocumentType();
          ag.documentTypeId = AppConstants.PLEASE_SELECT_VAL;
          ag.type = AppConstants.PLEASE_SELECT_STR;
          this.documentTypes.unshift(ag);
        },
        error => { this.splash.hide(); this.errorMessage = <any>error.message });
  }






  private populateRelationList() {
    this.listingService.getBeneficiaryRelationList()
      .subscribe(
        restData => {
          this.relationList = restData;

          let relation: Relation = new Relation();
          relation.relationId = AppConstants.PLEASE_SELECT_VAL;
          relation.relationDesc = AppConstants.PLEASE_SELECT_STR;
          this.relationList.unshift(relation);

          this.selectedBeneficiaryItem.relation.relationId = this.relationList[0].relationId;

        },
        error => {
          if(error.message){
            this.errorMessage = <any>error.message;
          }
          else
          {
            this.errorMessage = <any>error;
          }
        });
  }

  private populateClientType() {

    if (AppUtility.isEmpty(this.selectedItem.clientType)) {
      this.showIndividual = false;
      this.showCorporate = false;
      this.showJoint = false;
    }
    else if (this.selectedItem.clientType == AppConstants.INDIVIDUAL_TYPE) {
      this.showIndividual = true;
      this.showCorporate = false;
      this.populateAccountType();
    }
    else {
      this.showIndividual = false;
      this.showCorporate = true;
      this.showJoint = false;
    }
  }


  private populateAccountType() {
    if (AppUtility.isEmpty(this.selectedItem.accountTypeNew.accTypeId)) {
      this.showJoint = false;
    }
    else if (this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
      this.showJoint = true;
      this.selectedBankItemFromGrid();
    }
    else {
      this.showJoint = false;
    }
  }

  private populateOnlineAccess() {
    if (AppUtility.isEmpty(this.selectedItem.onlineClient)) {
      this.showOnlineAccess = false;
    }
    else if (this.selectedItem.onlineClient == true) {
      this.showOnlineAccess = true;
      if (AppUtility.isEmpty(this.selectedItem.clientId)) {
        this.selectedItem.user = new User();
      } else {
        this.listingService.getClientUser(this.selectedItem.clientId)
          .subscribe(
            restData => {
              if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                var userObj: any = restData;
                this.selectedItem.user = userObj;
              }
            },
            error => {
              if(error.message){
                this.errorMessage = <any>error.message;
              }
              else
              {
                this.errorMessage = <any>error;
              }
              this.dialogCmp.statusMsg = this.errorMessage;
              this.dialogCmp.showAlartDialog('Error');
            });

      }
    }
    else {
      this.showOnlineAccess = false;
    }
  }

  // private populateIdentificationTypeList() {
 
  //   this.listingService.getIdentificationTypeList()
  //     .subscribe(
  //       restData => {
       
  //         this.identificationTypeList = restData;

  //         var identificationType: IdentificationType = new IdentificationType();
  //         identificationType.identificationTypeId = AppConstants.PLEASE_SELECT_VAL;
  //         identificationType.identificationType = AppConstants.PLEASE_SELECT_STR;
  //         this.identificationTypeList.unshift(identificationType);
  //         this.selectedItem.contactDetail.identificationTypeId = this.identificationTypeList[0].identificationTypeId;
  //       },
  //       error => {
  //         this.splash.hide(); this.errorMessage = <any>error.message
  //           , () => {
  //           }
  //       });
  // }




  public populateIdentificationTypesChange=(accountType : String)=>{
    this.identificationTypeList = [];
    this.listingService.getIdentificationTypeListBaseOnAccType(accountType)
    .subscribe(
      restData => {
        debugger
        this.identificationTypeList = restData;  
       
        if(AppUtility.isValidVariable(this.selectedIdentificationTypeId)) {
          setTimeout(() => {
            this.selectedItem.contactDetail.identificationTypeId = this.selectedIdentificationTypeId;
          }, 250);
        }
      
       
      },
      error => {
        this.splash.hide(); this.errorMessage = <any>error.message
          , () => {
          }
      });
  }









  private populateProfessionList() {

   
    this.listingService.getProfessionList()
      .subscribe(
        restData => {
         
          this.professionList = restData;
          var profession: Profession = new Profession();
          profession.professionId = AppConstants.PLEASE_SELECT_VAL;
          profession.professionDesc = AppConstants.PLEASE_SELECT_STR;
          this.professionList.unshift(profession);
          this.selectedItem.contactDetail.professionId = this.professionList[0].professionId;
        },
        error => {
          this.splash.hide(); this.errorMessage = <any>error.message
            , () => {
            }
        });
  }

  private populateIncomeSourceList() {
 
    var incomeSource: IncomeSource = new IncomeSource();
    incomeSource.incomeSourceId = AppConstants.PLEASE_SELECT_VAL;
    incomeSource.incomeSourceDesc = AppConstants.PLEASE_SELECT_STR;
    this.incomeSourceList = [];
    this.incomeSourceList.unshift(incomeSource);
    this.listingService.getIncomeSourceList()
      .subscribe(
        restData => {
    
          this.incomeSourceList = restData;


          this.selectedItem.incomeSource.incomeSourceId = this.incomeSourceList[0].incomeSourceId;
          this.incomeSourceList.unshift(incomeSource);
        },
        error => { this.splash.hide(); this.errorMessage = <any>error.message; },
      );

  }

  private populateIndustryList() {
 
    this.listingService.getIndustryList()
      .subscribe(
        restData => {
       
          this.industryList = restData;

          var industry: Industry = new Industry();
          industry.industryId = AppConstants.PLEASE_SELECT_VAL;
          industry.industryName = AppConstants.PLEASE_SELECT_STR;
          this.industryList.unshift(industry);
          this.selectedItem.contactDetail.industryId = this.industryList[0].industryId;
        },
        error => {
          this.splash.hide(); this.errorMessage = <any>error
            , () => {
            }
        });
  }


  private populateCountryList() {
  
    this.listingService.getCountryList()
      .subscribe(
        restData => {
      
          this.countryList = restData;
          if (AppUtility.isEmpty(restData)) {
            this.countryList = [];
            this.selectedItem.contactDetail.countryId = null;
          }
          else {
            var country: Country = new Country();
            country.countryId = AppConstants.PLEASE_SELECT_VAL;
            country.countryName = AppConstants.PLEASE_SELECT_STR;
            this.countryList.unshift(country);
            this.selectedItem.contactDetail.countryId = AppConstants.INV_COUNTRY_ID;
          }
          setTimeout(() => {

            if (!this.isShowInvestorForm) {
              this.selectedItem.contactDetail.countryId = AppConstants.INV_COUNTRY_ID;
            } else {
              if (AppUtility.isValidVariable(this.selectedCountryId)) {
                this.selectedItem.contactDetail.countryId = this.selectedCountryId;
              }
              else {
                this.selectedItem.contactDetail.countryId = AppConstants.INV_COUNTRY_ID;
              }


            }
          }, 150);

        },
        error => {
          this.splash.hide(); this.errorMessage = <any>error.message
            , () => {
            }
        });
  }

  private populateCustodians(exchangeId: Number, exchangeName: String) {

    if (!AppUtility.isEmpty(exchangeId)) {
      if (!AppUtility.isEmpty(this.itemsClientCustodianList) && this.itemsClientCustodianList.itemCount > 0) {
        for (let i = 0; i < this.itemsClientCustodianList.itemCount; i++) {
          if (this.itemsClientCustodianList.items[i].exchange.exchangeId == exchangeId) {
            return;
          }
        }
      }
      this.listingService.getCustodianByExchange(exchangeId)
        .subscribe(
          restData => {
            if (!AppUtility.isEmpty(restData)) {
              var participantExchange = new ParticipantExchange;
              participantExchange = this.itemsClientCustodianList.addNew();
              participantExchange.exchange = new Exchange();
              participantExchange.exchange.exchangeId = exchangeId;
              participantExchange.exchange.exchangeName = exchangeName;
              participantExchange.participantList = restData;
              for (let i = 0; i < participantExchange.participantList.length; i++) {
                participantExchange.participantList[i].exchange.exchangeName = "";
                participantExchange.participantList[i].exchangeId = exchangeId;
              }
              this.itemsClientCustodianList.commitNew();
              AppUtility.moveSelectionToLastItem(this.itemsClientCustodianList);
              this.flexCustodian.invalidate();
              if (this.isEditing)
                this.loadClientCustodians();
            }
          },
          error => {
            this.splash.hide();
            this.errorMessage = <any>error.message;
          });
    } else {
      // exchange id not provided
    }
  }

  private populateAllowedMarkets(exchangeId: Number, exchangeName: String) {
     
    debugger
    if (!AppUtility.isEmpty(exchangeId)) {
      if (!AppUtility.isEmpty(this.itemsAllowedMarketList) && this.itemsAllowedMarketList.itemCount > 0) {
        for (let i = 0; i < this.itemsAllowedMarketList.itemCount; i++) {
          if (this.itemsAllowedMarketList.items[i].exchange.exchangeId == exchangeId) {
            return;
          }
        }
      }
    
      this.listingService.getMarketListByExchange(exchangeId)
        .subscribe(
          restData => {
            this.itemsAllowedMarketList = new wjcCore.CollectionView();
            if (!AppUtility.isEmpty(restData)) {
              var exchangeMarket = new ExchangeMarket();
                
              //exchangeMarket.marketList = restData;
              for (let i = 0; i < restData.length; i++) {
                //exchangeMarket.marketList[i].exchangeId = exchangeId;
                
                exchangeMarket = this.itemsAllowedMarketList.addNew();
                exchangeMarket.exchange = new Exchange();
                exchangeMarket.exchange.exchangeId = exchangeId;
                exchangeMarket.exchange.exchangeName = exchangeName;
                exchangeMarket.market = new Market() ; 
                exchangeMarket.market = <Market> restData[i];
                exchangeMarket.market.selected = false; 
                this.itemsAllowedMarketList.commitNew();
                AppUtility.moveSelectionToLastItem(this.itemsAllowedMarketList);
                this.loadClientMarkets();
                //exchangeMarket = new ExchangeMarket(); 

              }

              this.flexAllowedMarket.invalidate();
              console.log("Allowed markets:" , exchangeMarket); 

            }
          },
          error => {
            this.errorMessage = <any>error.message;
          });
    } else {
      // exchange id not provided
    }
  }

  private populateBankList(_participantid: Number, _active: Boolean) {
    this.listingService.getBanksList(_participantid, _active)
      .subscribe(
        restData => {
          this.bankList = restData;

          let bank: Bank = new Bank();
          bank.bankId = AppConstants.PLEASE_SELECT_VAL;
          bank.displayName_ = AppConstants.PLEASE_SELECT_STR;
          this.bankList.unshift(bank);

          this.selectedBankAccountItem.bankBranch.bank.bankId = this.bankList[0].bankId;
          if (this.bankList[0].bankId != null)
            this.populateBranchListByBank(this.bankList[0].bankId);
            
          },
        error => {
          if(error.message){
            this.errorMessage = <any>error.message;
          }
          else
          {
            this.errorMessage = <any>error;
          }
        });
  }

  private populateClientDocuemntsGrid() {

    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsDocumentList = new wjcCore.CollectionView();
    } else {
      this.listingService.getInvClientDocumentsList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsDocumentList = new wjcCore.CollectionView(restData);
            if(this.itemsDocumentList.items.length > 0) {
              this.selectedDocumentItemFromGrid();
             }
          },
          (error) => {
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    }
  }

  private populateClientBankAccountGrid() {

    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsBanAccountList = new wjcCore.CollectionView();
    } else {
      this.listingService.getInvClientBankAccountList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsBanAccountList = new wjcCore.CollectionView(restData);
          },
          error => {
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private populateClientBeneficiaryGrid() {

    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsBeneficiaryList = new wjcCore.CollectionView();
    } else {
      this.listingService.getInvClientBeneficiaryList(this.selectedItem.clientId)
        .subscribe(
          restData => {

            this.itemsBeneficiaryList = new wjcCore.CollectionView(restData);
          
              this.selectedBeneficiaryItemFromGrid();
         
          },
          error => {
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private populateClientExchangeGrid() {
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsClientExchangeList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientExchangeList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsClientExchangeList = new wjcCore.CollectionView(restData);
            for (let i = 0; i < this.itemsClientExchangeList.itemCount; i++) {
              this.populateAllowedMarkets(this.itemsClientExchangeList.items[i].exchangeId, this.itemsClientExchangeList.items[i].exchangeName);
              this.populateCustodians(this.itemsClientExchangeList.items[i].exchangeId, this.itemsClientExchangeList.items[i].exchangeName);
            }

          },
          error => {
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private loadClientCustodians() {
    //AppUtility.printConsole('AppState1: ' + this.appState.state);
    //AppUtility.printConsole('showLoader1: ' + this.appState.showLoader);
    this.clientCustodian = [];
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsClientCustodianList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientCustodian(this.selectedItem.clientId)
        .subscribe(
          restData => {
            //AppUtility.printConsole('AppState2: ' + this.appState.state);
            //AppUtility.printConsole('showLoader2: ' + this.appState.showLoader);

            if (!AppUtility.isEmpty(restData)) {
              this.clientCustodian = restData;
              if (!AppUtility.isEmpty(this.clientCustodian)) {
                for (let i = 0; i < this.clientCustodian.length; i++) {
                  for (let j = 0; j < this.itemsClientCustodianList.itemCount; j++) {
                    for (let k = 0; k < this.itemsClientCustodianList.items[j].participantList.length; k++) {
                      //this.itemsClientCustodianList.items[j].participantList[k].selected = false;
                      if (this.itemsClientCustodianList.items[j].participantList[k].participantId == this.clientCustodian[i].custodian.participantId
                        &&
                        (this.clientCustodian[i].active == true)) {
                        this.itemsClientCustodianList.items[j].participantList[k].selected = true;
                      }
                    }
                  }
                }
              }
            }
            else {
              this.itemsClientCustodianList = new wjcCore.CollectionView();
          
            }
          },
          error => {
            this.splash.hide();
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private loadClientMarkets() {
    debugger
    this.clientMarket = [];
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsAllowedMarketList = new wjcCore.CollectionView();
    } else {
      this.listingService.getInvClientMarketList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            if (!AppUtility.isEmpty(restData)) {
               this.clientMarket = restData;
            //  this.clientMarket = this.selectedItem.clientMarkets;
              if (!AppUtility.isEmpty(this.clientMarket)) {
                for (let i = 0; i < this.clientMarket.length; i++) {
                  for (let j = 0; j < this.itemsAllowedMarketList.itemCount; j++) {                    
                      //this.itemsAllowedMarketList.items[j].marketList[k].selected = false;
                      if ((this.itemsAllowedMarketList.items[j].market.marketId == this.clientMarket[i].marketId)
                        &&
                        (this.itemsAllowedMarketList.items[j].exchange.exchangeId == this.clientMarket[i].exchangeId)
                        &&
                        (this.clientMarket[i].active == true)) {
                        this.itemsAllowedMarketList.items[j].market.selected = true;
                      
                    }
                  }
                }
              }
            }
          },
          error => {
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private populateClientJointAccountGrid() {

    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsJointAccountList = new wjcCore.CollectionView();
    } else {
      this.listingService.getInvClientJointAccountList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsJointAccountList = new wjcCore.CollectionView(restData);
            this.selectedJointAccountItemFromGrid();
          },
          error => {
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private populateBranchListByBank(bankId: Number) {
    var branch: BankBranch = new BankBranch();
    branch.bankBranchId = AppConstants.PLEASE_SELECT_VAL;
    branch.branchName = AppConstants.PLEASE_SELECT_STR;
    const branchCombo: FormControl = (<any>this.bankDetailForm).controls.branchId;
    if (AppUtility.isEmpty(bankId)) {
      this.bankBranchList = [];
      this.bankBranchList.unshift(branch);
      branchCombo.reset();
    } else {
      this.listingService.getBankBranchListByBank(bankId)
        .subscribe(
          restData => {
            if (AppUtility.isEmpty(restData)) {
              this.bankBranchList = [];
              this.selectedBankAccountItem.bankBranch.bankBranchId = null;
              this.selectedBankAccountItem.bankBranch.branchName = null;
            }
            else {
              this.bankBranchList = restData;
            }
            
            this.bankBranchList.unshift(branch);
            this.selectedBankItemFromGrid();
          },
          error => { this.errorMessage = <any>error.message; },
          () => {
            branchCombo.reset();
          }
        );
    }
  }

  private populateCityListByProvince(provinceId: Number) {
    this.splash.show();
    var city: City = new City();
    city.cityId = AppConstants.PLEASE_SELECT_VAL;
    city.cityName = AppConstants.PLEASE_SELECT_STR;
    this.cityList = [];
    this.cityList.unshift(city);

    if (AppUtility.isEmpty(provinceId)) {
      this.splash.hide();
    } else {
      this.listingService.getCityListByProvince(provinceId)
        .subscribe(
          restData => {
            this.splash.hide();
            if (AppUtility.isEmpty(restData)) {
              this.cityList = [];
              this.selectedItem.contactDetail.cityId = null;
              this.selectedItem.contactDetail.city = null;
            }
            else {
              this.cityList = restData;
              setTimeout(() => {
                if (!this.isShowInvestorForm) {
                  this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
                  this.selectedItem.contactDetail.city = this.cityList[0].cityName;
                } else {
                  this.selectedItem.contactDetail.cityId = this.selectedCityId;
                }
              }, 150);
            }
          },
          error => {
            this.splash.hide();
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
          },
        );
    }
  }

  private populateProvinceListByCountry(countryId: Number) {


    if (AppUtility.isEmpty(countryId)) {
      return false;
    } else {
      this.listingService.getProvinceListByCountry(countryId)
        .subscribe(
          restData => {
            if (AppUtility.isEmpty(restData)) {
              this.provinceList = [];
              this.selectedItem.contactDetail.provinceId = null;
              this.selectedItem.contactDetail.province = null;
            }
            else {
               
              this.provinceList = restData;
              setTimeout(() => {
                  this.selectedItem.contactDetail.provinceId = this.selectedProvinceId;
              }, 150);
            }
          },
          error => { 
            this.errorMessage = <any>error.message; 
          },
        );
    }
  }

  private populateClientControlAccount() {
    
    this.listingService.getClientControlAccount(AppConstants.participantId)
      .subscribe(
        restData => {
          
          if (AppUtility.isEmpty(restData)) {
            this.clientControlChartOfAccountCode_ = "";
          } else {
            var hld: ChartOfAccount = new ChartOfAccount();
            hld = restData;
            this.clientControlChartOfAccountCode_ = hld.glCode;
            this.coaCode_ = hld.glCode;
            this.participantGlCode = hld.glCode; 
            this.glCodeDisplayName_ = hld.glCodeDisplayName_;
            this.glDescription_ = hld.glDesc;
            this.headLevel_ = hld.headLevel;
            this.leaf_ = hld.leaf;
            this.parentChartOfAccountId_ = hld.parentChartOfAccountId;
            this.parentGlCode_ = hld.parentGlCode;
            this.parentGlDesc_ = hld.parentGlDesc;
            this.chartOfAccountParticipant_ = hld.participant;
            this.glFamily_ = hld.glFamily;
            this.chartofAccountId_ = null;
            

          //  this.selectedItem.chartOfAccount = hld;
          }

        },
        error => 
        {
          // this.errorMessage = <any>error.message
        }
        );
  }

  private validateBasicInfo(): boolean {
    if (this.showIndividual && this.showTrustee) {
      if (AppUtility.isEmpty(this.selectedItem.contactDetail.firstName) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.lastName) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.gender) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.residenceStatus) ||
        AppUtility.isEmpty(this.selectedItem.participant) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.taxNumber) ||
        AppUtility.isEmpty(this.selectedItem.participantBranch.branchId) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.trustee) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationType) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationTypeId) ||
        AppUtility.isEmpty(this.selectedItem.accountTypeNew.accTypeId) ||
        (AppUtility.isEmpty(this.selectedItem.clientCode) && this.showParticipantBasedGrid)) {
        return false;
      }
      else {
        this.selectedItem.contactDetail.companyName = "";
        this.selectedItem.contactDetail.contactPerson = "";
        this.selectedItem.contactDetail.industryId = null;
        this.selectedItem.contactDetail.registerationDate = null;
        return true;
      }
    }
    else if (this.showIndividual && !this.showTrustee) {
      if (AppUtility.isEmpty(this.selectedItem.contactDetail.firstName) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.lastName) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.gender) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.residenceStatus) ||
        AppUtility.isEmpty(this.selectedItem.participant) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.taxNumber) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationType) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationTypeId) ||
        AppUtility.isEmpty(this.selectedItem.participantBranch.branchId) ||
        AppUtility.isEmpty(this.selectedItem.accountTypeNew.accTypeId) ||
        (AppUtility.isEmpty(this.selectedItem.clientCode) && this.showParticipantBasedGrid)) {
        return false;
      }
      else {

        this.selectedItem.contactDetail.contactPerson = "";
        this.selectedItem.contactDetail.industryId = null;
        this.selectedItem.contactDetail.registerationDate = null;
        this.selectedItem.contactDetail.trustee = null;
        return true;
      }
    }
    else if (this.showCorporate) {
      if (AppUtility.isEmpty(this.selectedItem.contactDetail.contactPerson) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.companyName) ||
        AppUtility.isEmpty(this.selectedItem.participant) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.taxNumber) ||
        AppUtility.isEmpty(this.selectedItem.participantBranch.branchId) ||
        AppUtility.isEmpty(this.selectedItem.accountTypeNew.accTypeId) ||
        AppUtility.isEmpty( this.selectedItem.contactDetail.industryId) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationType) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationTypeId) ||
        AppUtility.isEmpty( this.selectedItem.contactDetail.residenceStatus) ||
       (AppUtility.isEmpty(this.selectedItem.clientCode) && this.showParticipantBasedGrid))
       {
        return false;
      }
      else {
        this.selectedItem.contactDetail.gender = null;
        this.selectedItem.contactDetail.trustee = null;
        return true;
      }
    }
    else if (this.showJoint) {
      debugger
      if (AppUtility.isEmpty(this.selectedItem.contactDetail.firstName) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.lastName) ||
        AppUtility.isEmpty(this.selectedItem.participant) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.residenceStatus) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.taxNumber) ||
        AppUtility.isEmpty(this.selectedItem.participantBranch.branchId) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.professionId) || 
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationType) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationTypeId) ||
        AppUtility.isEmpty(this.selectedItem.accountTypeNew.accTypeId ||
          (AppUtility.isEmpty(this.selectedItem.clientCode) && this.showParticipantBasedGrid))
      ) {
        return false;
      }
      else {
        this.selectedItem.contactDetail.gender = null;
        this.selectedItem.contactDetail.trustee = null;
        this.selectedItem.contactDetail.contactPerson = "";
        this.selectedItem.contactDetail.industryId = null;
        this.selectedItem.contactDetail.registerationDate = null;
        this.selectedItem.contactDetail.trustee = null;
        this.selectedItem.contactDetail.companyName = "";
        return true;
      }
    }
    return false;
  }




  private validateContactDetail(): boolean {
    if (AppUtility.isEmpty(this.selectedItem.contactDetail.countryId) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.cityId) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.provinceId) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.address1) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.address2) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.phone1)) {
      return false;
    }
    if (!AppUtility.isEmpty(this.selectedItem.contactDetail.email) && !AppUtility.validateEmail("" + this.selectedItem.contactDetail.email)) {
      return false;
    }

    if (!AppUtility.isEmpty(this.selectedItem.contactDetail.phone1) && !AppUtility.validateNumberOnly("" + this.selectedItem.contactDetail.phone1)) {
      return false;
    }

    return true;
  }











 

  private validateJointAccount(): boolean {
    if (this.showJoint) {
      if (AppUtility.isEmpty(this.itemsJointAccountList) || this.itemsJointAccountList.itemCount == 0) {
        this.dialogCmp.statusMsg = 'Please add some account information in Joint tab.';
        this.dialogCmp.showAlartDialog('Notification');
        return false;
      }
    }
    if (this.isEditing) {
      if (this.showJoint) {
        if (AppUtility.isEmpty(this.itemsJointAccountList) || this.itemsJointAccountList.itemCount == 0) {
          this.dialogCmp.statusMsg = 'Please add some account information in Joint tab.';
          this.dialogCmp.showAlartDialog('Notification');
          return false;
        }
      }
    }
    return true;
  }

  private validateCRS(): boolean {
    if (AppUtility.isEmpty(this.itemsClientExchangeList) || this.itemsClientExchangeList.itemCount == 0) {
      this.dialogCmp.statusMsg = 'Please add some records in Risk tab.';
      this.dialogCmp.showAlartDialog('Notification');
      return false;
    }
    return true;
  }

  private validateBeneficiary(): boolean {

    if ((AppUtility.isEmpty(this.itemsBeneficiaryList) || this.itemsBeneficiaryList.itemCount == 0) && (this.showIndividual || this.showJoint)) {
      this.dialogCmp.statusMsg = 'Please add some records in Beneficiary tab.';
      this.dialogCmp.showAlartDialog('Notification');
      return false;
    }
    return true;
  }
 

 
  private validateBankAccount(): boolean {
    if (AppUtility.isEmpty(this.itemsBanAccountList) || this.itemsBanAccountList.itemCount == 0) {
      this.dialogCmp.statusMsg = 'Please add some records in Bank tab.';
      this.dialogCmp.showAlartDialog('Notification');
      return false;
    }

    if (this.isEditing) {
      if (AppUtility.isEmpty(this.itemsBanAccountList) || this.itemsBanAccountList.itemCount == 0) {
        this.dialogCmp.statusMsg = 'Please add some account information in Bank tab.';
        this.dialogCmp.showAlartDialog('Notification');
        return false;
      }
    }
    return true;
  }

  private validateDocument(): boolean {
    
      if (AppUtility.isEmpty(this.itemsDocumentList) || this.itemsDocumentList.itemCount == 0) {
        this.dialogCmp.statusMsg = 'Please add some documents in Document tab.';
        this.dialogCmp.showAlartDialog('Notification');
        return false;
      }
      else
      {
        return true;
      }
    
   
  }

  private readFile(file, reader, callback) {
    // Set a callback funtion to fire after the file is fully loaded
    reader.onload = () => {
      // callback with the results
      callback(reader.result);
    }

    // Read the file
    reader.readAsDataURL(file);
  }

  private readFiles(files, index = 0) {
    // Create the file reader
    let reader = new FileReader();

    // If there is a file
    if (index in files) {
      // Start reading this file
      this.readFile(files[index], reader, (result) => {
        // After the callback fires do:
        //this.file_srcs.push(result);
        this.file_srcs[0] = result;
        this.readFiles(files, index + 1);// Read the next file;
      });
    } else {
      // When all files are done This forces a change detection
      //alert("Total files are :: "+this.file_srcs.length);
      this.changeDetectorRef.detectChanges();
    }
  }



  private addFromValidations() {
    this.myForm = this._fb.group({

      ////Added For Investor Registration
      client_code: ['', Validators.compose([Validators.required])],
      todayDate: [''],
      participant: [null, Validators.compose([Validators.required])],
      account_type: [null, Validators.compose([Validators.required])],
      tax_no: ['', Validators.compose([Validators.required])],
      trustee: ['', Validators.compose([Validators.required])],
      contactPerson: ['', Validators.compose([Validators.required])],
      registerationDate: [''],
      identification_type : ['' , Validators.compose([Validators.required])],
      identification_no : ['', Validators.compose([Validators.required])],


      //////////////////////////////////
      glCode: ['', Validators.compose([Validators.required])],
      coaCode: [''],
      coaDesc : ['' , Validators.compose([Validators.required])],
      searchClientName: [''],
      searchClientCode: [''],
      active: [''],
      commissionSlab: [''],
      commissionSlabId: ['', Validators.compose([Validators.required])],
      sendEmail: [''],
      sendSms: [''],
      levyId: ['' , Validators.compose([Validators.required])],
      participantBranch: ['', Validators.required],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      gender: ['', Validators.compose([Validators.required])],
      residenceStatus: ['', Validators.compose([Validators.required])],
      identificationTypeId: ['', Validators.compose([Validators.required])],
      registrationNo: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      dob: [''],
      professionId: ['', Validators.compose([Validators.required])],
      countryId: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])],
      provinceId: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      address2: ['', Validators.compose([Validators.required])],
      phone1: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternEmail)])],
      industryId: ['', Validators.compose([Validators.required])],
      companyName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      cellNo: ['',],
      agentId: [''],

      userName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],

      password: ['', Validators.compose([Validators.required, PasswordValidators.repeatCharacterRegexRule(4),
      PasswordValidators.alphabeticalCharacterRule(1),
      PasswordValidators.digitCharacterRule(1),
      PasswordValidators.lowercaseCharacterRule(1),
      PasswordValidators.uppercaseCharacterRule(1)])],

      confirmPassword: ['', Validators.compose([Validators.required])],
      userEmail: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternEmail)])],
      activeUser: [''],
      identificationType: ['', Validators.compose([Validators.required])],
      // incomeSource: [''],
      incomeSourcee: ['', Validators.compose([Validators.required])],
      annualGrossIncome: [''],
      incomePercentage: [''],
    });

    this.bankDetailForm = this._fb.group({
      bankId: ['', Validators.compose([Validators.required])],
      branchId: ['', Validators.compose([Validators.required])],
      accountNo: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      accountTitle: ['', Validators.compose([Validators.required])],
    });

    this.beneficiaryForm = this._fb.group({
      beneficiary_tax_no: ['', Validators.compose([Validators.required])],
      relationId: ['', Validators.compose([Validators.required])],
      beneficiaryName: ['', Validators.compose([Validators.required])],
      beneficiaryCNIC: ['', Validators.compose([Validators.required])],
      identificationTypeId: ['', Validators.compose([Validators.required])],
    });

    this.jointAccountForm = this._fb.group({
      tax_no: ['', Validators.compose([Validators.required])],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      identificationTypeId: ['', Validators.compose([Validators.required])],
      identificationNumber: ['', Validators.compose([Validators.required])],


    });

    this.clientExchangeForm = this._fb.group({
      exchangeId: ['', Validators.compose([Validators.required])],
      active: [''],
      allowShortSell: [''],
      bypassCrs: [''],
      openPositionStatus: [''],
      margin: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
    });


    this.documentForm = this._fb.group({
      identificationTypeId: ['', Validators.compose([Validators.required])],
      identificationNumber: ['', Validators.compose([Validators.required])],
      documentTypeId: ['', Validators.compose([Validators.required])],
      issueDate: [''],
      expiryDate: ['', Validators.compose([Validators.required])],
      issuePlace: [''],
      fileUpload: ['', Validators.compose([Validators.required])],
    });


    this.allowedMarketForm = this._fb.group({
      checkBoxId: [''],
    });
    this.clientCustodianForm = this._fb.group({
      checkBoxId: [''],
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success' && !this.showParticipantBasedGrid) {
      this.route.navigate(['/dashboard']);
    }
  }

  private populateAccountCategoryList() {

  
    this.listingService.getAccountCategoryList()
      .subscribe(
        restData => {
       
          this.accountCategoryList = restData;
          var accCategory: AccountCategory = new AccountCategory();
          accCategory.accountCategoryId = AppConstants.PLEASE_SELECT_VAL;
          accCategory.name = AppConstants.PLEASE_SELECT_STR;
          this.accountCategoryList.unshift(accCategory);

          this.selectedItem.accountCategory.accountCategoryId = this.accountCategoryList[0].accountCategoryId;
        },
        error => {
          this.splash.hide(); this.errorMessage = <any>error.message;
        });
  }

  private onInitPopulate() {

    this.populateParticipants();
    this.populateAccountTypeInvestor();
    this.loadLeveisByParticipant();
    this.populateCommissionSlabList();
    this.populateExchangeList();
    this.populateRelationList();
    this.populateDocumentTypes();
    this.populateClientControlAccount();
    this.populateAllowedMarkets(null, null);
    this.populateAccountCategoryList();
  //  this.populateIdentificationTypeList();
    this.populateProfessionList();
    this.populateIndustryList();
    this.populateCountryList();
    this.populateIncomeSourceList();
    this.populateBankList(AppConstants.participantId, true);
    this.addFromValidations();
    this.populateCustodians(null, null);
    this.changePasswordError = undefined;
    this.passwordStrength = 0;
    //populate Custodians
    this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Male", "code": "M" }, { "name": "Female", "code": "F" }]
    this.riskList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "High", "code": "H" }, { "name": "Medium", "code": "M" }, { "name": "Low", "code": "L" }]

    // Populate Bank List in DropDown.

  }
  public beneficiaryMask = (event) => {
    if (event === "" || event === null || event === undefined) {
      this.bCnicValid = true;
      return;
    }
    else {
      this.bCnicValid = AppUtility.validateCNIC(event);
    }
  }


}
