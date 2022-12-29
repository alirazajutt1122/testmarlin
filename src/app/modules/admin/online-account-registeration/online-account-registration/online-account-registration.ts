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
import { OnlineAccountActivation } from '../online-account-activation/online-account-activation';
var downloadAPI = require('../../../../scripts/download-document');
declare var jQuery: any;

@Component({
  selector: 'online-account-registration',
  templateUrl: './online-account-registration.html',
  styleUrls: ['../component.style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OnlineAccountRegistration implements OnInit {

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
  selectedBankAccountItem: ClientBankAccount;
  selectedJointAccountItem: ClientJointAccount;
  selectedClientDocument: ClientDocument;
  selectedClientExchange: ClientExchange;
  selectedDepositoryItem: InvestorRegistrationDepositry;
  invCDCStatus: InvCDCStatus[];

  errorMessage: string;
  selectedIndex: number = 0;

  beneficiarySelectedIndex: number = 0;
  bankSelectedIndex: number = 0;
  documentsSelectedIndex: number = 0;
  jointSelectedIndex: number = 0;

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
  public currentTab_ = "BI";

  private file_srcs: string[] = [];
  accountCategoryList: any[];
  modal = true;

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
  public selectedIdentificationTypeId : number = null;

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

  @ViewChild('beneficiaryDeleteDlg', { static: false }) beneficiaryDeleteDlg: wjcInput.Popup;
  @ViewChild('bankDeleteDlg', { static: false }) bankDeleteDlg: wjcInput.Popup;
  @ViewChild('documentDeleteDlg', { static: false }) documentDeleteDlg: wjcInput.Popup;
  @ViewChild('jointDeleteDlg', { static: false }) jointDeleteDlg: wjcInput.Popup;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  @ViewChild('active1') active1: ElementRef;
  @ViewChild('clientType') clientType: ElementRef;
  @ViewChild('accountType') accountType: ElementRef;
  @ViewChild('participant') participant: ElementRef;
  @ViewChild('taxNumberField') taxNumberField: wjcInput.InputMask;
  @ViewChild('countryCombo') countryCombo: wjcInput.ComboBox;
  @ViewChild('statesCombo') statesCombo: wjcInput.ComboBox;
  @ViewChild('input' , { static: false }) input : ElementRef;

  @ViewChild(OnlineAccountActivation) onlineAccountActivation: OnlineAccountActivation;



  //@ViewChild('progressBar') progressBar:ElementRef;
  private fileInput_: any;

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
  public selectedAgentId: Number = null;
  public invSharedClientId: Number = null;
  public isDisabledFields: boolean = false;
  public isDisabledUpdateReject: boolean = false;
  public beneficiaryDeleteMsg: String = "";
  public bankDeleteMsg: String = "";
  public documentDeleteMsg: String = "";
  public jointDeleteMsg: String = "";


  public statusDraft: String = "";
  public statusSubmitted: String = "";
  public statusRejected: String = "";
  public statusRegistered: String = "";
  public statusActive: String = "";
  public statusPending: String = "";
  public selectedParticipantId : Number = null;
  public selectedResidenceStatus : Number = null;
  public selectedProfessionId : Number = null;


  public identificationTypeExactLength : Number = null;
  public identificationTypeMinLength :Number = 1;
  public idTypeBeneficiaryExactLength : Number = null;
  public idTypeBeneficiaryMinLength : Number = 1;
  public idTypejointExactLength : Number = null;
  public idTypeJointMinLength : Number = 1;



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
        this.invSharedClientId = null;
      }
      if (x === "user") {
        this.showParticipantBasedGrid = false;
        this.isShowInvestorForm = true;
        this.invSharedClientId = null;
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
    this.populateProfessionList();
    this.populateIndustryList();
    this.populateCountryList();
    this.populateIncomeSourceList();
    this.changePasswordError = undefined;
    this.passwordStrength = 0;


    switch (this.lang) {
      case 'en':
        this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Male", "code": "M" }, { "name": "Female", "code": "F" }]
        break;
      case 'pt':
        this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Macho", "code": "M" }, { "name": "Fêmea", "code": "F" }]
        break;
      default:
        this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Male", "code": "M" }, { "name": "Female", "code": "F" }]
    }



    // Populate Bank List in DropDown.
    if (AppConstants.participantId !== null) {
      this.populateBankList(AppConstants.participantId, true);
    }


  
    if (this.isDashBoard) {
      this.searchInvestorTaxNumber = '';
      this.searchInvestorName = '';
      this.populateItemGrid();
    }

    this.onGetDraft();
    this.populateLoginDetails();
  }

  ngAfterViewInit() {

    this.onTabChangeEvent("BI");
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
        this.invSharedClientId = null;
      }
    });

  }




  public showBeneficiaryDeleteConfirmation = () => {

    this.showDialog(this.beneficiaryDeleteDlg);
  }



  public showBankDeleteConfirmation = () => {

    this.showDialog(this.bankDeleteDlg);
  }


  public showDocumentDeleteConfirmation = () => {

    this.showDialog(this.documentDeleteDlg);
  }

  public showJointDeleteConfirmation = () => {

    this.showDialog(this.jointDeleteDlg);
  }






  populateLoginDetails = () => {

    this.selectedItem.contactDetail.firstName = AppConstants.INV_FIRST_NAME;
    this.selectedItem.contactDetail.lastName = AppConstants.INV_LAST_NAME;
    this.selectedItem.contactDetail.email = AppConstants.INV_EMAIL;
    this.selectedItem.contactDetail.cellNo = AppConstants.INV_MOBILE_NUMBER;
    this.selectedItem.contactDetail.countryId = AppConstants.INV_COUNTRY_ID;
  }






  public onIdentificationTypeChangeEvent = (event) =>{
    debugger
    this.identificationTypeExactLength = null;
    this.identificationTypeMinLength = 1;
    if(!AppUtility.isEmptyArray(this.identificationTypeList)){
             this.identificationTypeList.forEach(element => {
               if(event === element.identificationTypeId) {
                 if(AppUtility.isValidVariable(element.exactLength)){
                   this.identificationTypeExactLength = Number(element.exactLength);
                   this.identificationTypeMinLength = Number(element.exactLength);
                 }
                 else{
                   this.identificationTypeExactLength = Number(element.fieldLength);
                   this.identificationTypeMinLength = 1;
                 }
                 
              }
             })
    }
 
 }
 
 
 
 public onIdentificationTypeBenficiaryChange= (event) =>{
   debugger
   this.idTypeBeneficiaryExactLength = null;
   this.idTypeBeneficiaryMinLength = 1;
   if(!AppUtility.isEmptyArray(this.identificationTypeList)){
            this.identificationTypeList.forEach(element => {
              if(event === element.identificationTypeId) {
                if(AppUtility.isValidVariable(element.exactLength)){
                  this.idTypeBeneficiaryExactLength = Number(element.exactLength);
                  this.idTypeBeneficiaryMinLength = Number(element.exactLength);
                }
                else{
                  this.idTypeBeneficiaryExactLength = Number(element.fieldLength);
                  this.idTypeBeneficiaryMinLength = 1;
                }
                
             }
            })
   }
 }
 
 
 
 public onIdentificationTypeJointChange= (event) =>{
   debugger
   this.idTypejointExactLength = null;
   this.idTypeJointMinLength = 1;
   if(!AppUtility.isEmptyArray(this.identificationTypeList)){
            this.identificationTypeList.forEach(element => {
              if(event === element.identificationTypeId) {
                if(AppUtility.isValidVariable(element.exactLength)){
                  this.idTypejointExactLength = Number(element.exactLength);
                  this.idTypeJointMinLength = Number(element.exactLength);
                }
                else{
                  this.idTypejointExactLength = Number(element.fieldLength);
                  this.idTypeJointMinLength = 1;
                }
                
             }
            })
   }
 }
 
 
 

















  public showApproveConfirmation = (action) => {
    this.investorNameForAR = "";
    if (AppUtility.isValidVariable(this.selectedItem.clientId) && AppUtility.isValidVariable(this.selectedItem.contactDetail.firstName)) {
      this.investorNameForAR = this.selectedItem.contactDetail.firstName + " " + this.selectedItem.contactDetail.lastName;
      this.clientIdForAR = this.selectedItem.clientId;

    }

    if (action === 'A') {
      this.showApprove = true;
      this.showReject = false;
    }
    if (action === 'R') {
      this.showReject = true;
      this.showApprove = false;
    }
    jQuery('#approveConfirmation').modal({ backdrop: 'static', keyboard: true });
    jQuery('#approveConfirmation').modal('show');
  }


  public closeApproveConfirmation = () => {
    jQuery('#approveConfirmation').modal('hide');
  }




  public approveInvestor = () => {
    this.splash.show();
    let x = {
      clientId: this.clientIdForAR,
      statusCode: AppConstants.INV_STATUS_APPROVED,
    };
    this.listingService.updateClientStatusCode(x).subscribe(
      restData => {
        this.closeApproveConfirmation();
        this.onSearchAction();
        this.splash.hide();

      },
      error => { this.splash.hide(); this.errorMessage = <any>error.message });

  }



  public changeStatusAfterSendDepository = () => {
    this.splash.show();
    let x = {
      clientId: this.selectedItem.clientId,
      statusCode: AppConstants.INV_STATUS_PENDING,
    };
    this.listingService.updateClientStatusCode(x).subscribe(
      restData => {
        this.onSearchAction();
        this.splash.hide();

      },
      error => { this.splash.hide(); this.errorMessage = <any>error.message });

  }



  public rejectInvestor = () => {
    this.splash.show();
    let x = {
      clientId: this.clientIdForAR,
      statusCode: AppConstants.INV_STATUS_REJECTED,
    };
    this.listingService.updateClientStatusCode(x).subscribe(
      restData => {

        this.closeApproveConfirmation();
        this.onSearchAction();
        this.onGetInvestorByClient();
        this.splash.hide();

      },
      error => { this.splash.hide(); this.errorMessage = <any>error.message });

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
    debugger
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
        else {
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
    if (this.currentTab_ == "BI") {
      isValid = this.validateBasicInfo();
       
      if (isValid) {
        this.isSubmitted = false;
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
    
    this.bankSelectedIndex = this.bankAccountGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.bankAccountGrid.rows[this.bankSelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId) && AppUtility.isValidVariable(item.clientBankId)) {
      this.listingService.deleteSingleBankAccount(item.clientId, item.clientBankId).subscribe((res: any) => {
        this.itemsBanAccountList.remove(this.itemsBanAccountList.currentItem);
      }, error => {
        
        if (error.message) {
          this.errorMessage = <any>error.message;
        }
        else {
          this.errorMessage = <any>error;
        }
        this.dialogCmp.statusMsg = this.errorMessage;
        this.dialogCmp.showAlartDialog('Error');
      });
    }
    else {
      this.itemsBanAccountList.remove(this.itemsBanAccountList.currentItem);
    }



  }

  public onDeleteBeneficiaryAction() {

    this.beneficiarySelectedIndex = this.beneficiaryGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.beneficiaryGrid.rows[this.beneficiarySelectedIndex].dataItem));
   
    if (AppUtility.isValidVariable(item.clientId) && AppUtility.isValidVariable(item.beneficiaryId)) {
      this.listingService.deleteSingleBeneficiary(item.clientId, item.beneficiaryId).subscribe((res: any) => {
        this.itemsBeneficiaryList.remove(this.itemsBeneficiaryList.currentItem);
      }, error => {
     
        if (error.message) {
          this.errorMessage = <any>error.message;
        }
        else {
          this.errorMessage = <any>error;
        }
        this.dialogCmp.statusMsg = this.errorMessage;
        this.dialogCmp.showAlartDialog('Error');
      });
    }
    else {
      this.itemsBeneficiaryList.remove(this.itemsBeneficiaryList.currentItem);
    }

  }

  public onDeleteDocumentAction() {
    this.isSubmittedDocumentForm = false;
 
    this.documentsSelectedIndex = this.documentGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.documentGrid.rows[this.documentsSelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId) && AppUtility.isValidVariable(item.clientDocumentId)) {
      this.listingService.deleteSingleDocuments(item.clientId, item.clientDocumentId).subscribe((res: any) => {
        this.itemsDocumentList.remove(this.itemsDocumentList.currentItem);
      }, error => {
       
        if (error.message) {
          this.errorMessage = <any>error.message;
        }
        else {
          this.errorMessage = <any>error;
        }
        this.dialogCmp.statusMsg = this.errorMessage;
        this.dialogCmp.showAlartDialog('Error');
      });
    }
    else {
      this.itemsDocumentList.remove(this.itemsDocumentList.currentItem);
    }

  }

  public onDeleteJointAccountAction() {

 
    this.jointSelectedIndex = this.jointAccountGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.jointAccountGrid.rows[this.jointSelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId) && AppUtility.isValidVariable(item.clientJointAccountId)) {
      this.listingService.deleteSingleJointAccount(item.clientId, item.clientJointAccountId).subscribe((res: any) => {
        this.itemsJointAccountList.remove(this.itemsJointAccountList.currentItem);
      }, error => {
       
        if (error.message) {
          this.errorMessage = <any>error.message;
        }
        else {
          this.errorMessage = <any>error;
        }
        this.dialogCmp.statusMsg = this.errorMessage;
        this.dialogCmp.showAlartDialog('Error');
      });
    }
    else {
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


    this.selectedAccTypeId = null;
    this.selectedIdentificationTypeId = null;
    this.selectedParticipantId = null;
    this.selectedResidenceStatus = null;
    this.selectedProfessionId = null;
    this.selectedCountryId = null;

    this.currentTab_ = "BI";
    this.showForm = true;
    this.isShowInvestorForm = true;
    this.invSharedClientId = null;
    this.listingService.getInvestorByUserId(AppConstants.userId)
      .subscribe(
        restData => {

          if (restData !== null && restData.length > 0) {
            if (AppUtility.isValidVariable(restData[0].clientId)) {
              this.InvestorClientId = restData[0].clientId;
              this.selectedItem.clientId = restData[0].clientId;
              if ((restData[0].statusCode === AppConstants.INV_STATUS_ACTIVE || restData[0].statusCode === AppConstants.INV_STATUS_PENDING
                || restData[0].statusCode === AppConstants.INV_STATUS_REGISTERED || restData[0].statusCode === AppConstants.INV_STATUS_SUBMITTED) && this.loggedInUserType === AppConstants.USER_TYPE_CLIENT_CODE) {
                this.isDisabledFields = true;
                this.documentForm.controls['fileUpload'].disable();
                
              }
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
          this.appState.showLoader = false;
          if (error.message) {
            this.errorMessage = <any>error.message;
          }
          else {
            this.errorMessage = <any>error;
          }
          this.dialogCmp.statusMsg = this.errorMessage;
          AppUtility.printConsole('errorMessage: ' + this.errorMessage);
          this.dialogCmp.showAlartDialog('Error');
        });







  }




  public selectedBeneficiaryItemFromGrid = () => {
    if (this.itemsBeneficiaryList.items.length > 0 && this.beneficiaryGrid !== undefined) {
      setTimeout(() => {
        this.beneficiarySelectedIndex = this.beneficiaryGrid.selection.row;
        if (AppUtility.isValidVariable(this.beneficiaryGrid.rows[this.beneficiarySelectedIndex])) {
          let item = JSON.parse(JSON.stringify(this.beneficiaryGrid.rows[this.beneficiarySelectedIndex].dataItem));
          if (item) {
            this.selectedBeneficiaryItem.taxNumber = item.taxNumber;
            this.selectedBeneficiaryItem.beneficiaryName = item.beneficiaryName;
            this.selectedBeneficiaryItem.identificationType.identificationTypeId = item.identificationType.identificationTypeId;
            this.selectedBeneficiaryItem.beneficiaryCNIC = item.beneficiaryCNIC;
            this.selectedBeneficiaryItem.relation.relationId = item.relation.relationId;
          }
        }

      }, 450);

    }
  }


  public selectedBankItemFromGrid = () => {
     
    if (this.itemsBanAccountList.items.length > 0 && this.bankAccountGrid !== undefined) {
      this.bankSelectedIndex = this.bankAccountGrid.selection.row;
      if (AppUtility.isValidVariable(this.bankAccountGrid.rows[this.bankSelectedIndex])) {
        let item = JSON.parse(JSON.stringify(this.bankAccountGrid.rows[this.bankSelectedIndex].dataItem));
        if (item) {
          if (AppUtility.isValidVariable(item.bankAccountNo) && AppUtility.isValidVariable(item.bankTitle)) {
            this.selectedBankAccountItem.bankAccountNo = item.bankAccountNo;
            this.selectedBankAccountItem.bankTitle = item.bankTitle;
          }
          setTimeout(() => {
            this.selectedBankAccountItem.bankBranch.bank.bankId = item.bankBranch.bank.bankId;

          }, 200);

          setTimeout(() => {
            this.selectedBankAccountItem.bankBranch.bankBranchId = item.bankBranch.bankBranchId;
          }, 700);
        }
      }

    }


  }

  public selectedDocumentItemFromGrid = () => {

    if (this.itemsDocumentList.items.length > 0 && this.documentGrid !== undefined) {
      setTimeout(() => {
        this.documentsSelectedIndex = this.documentGrid.selection.row;
        if (AppUtility.isValidVariable(this.documentGrid.rows[this.documentsSelectedIndex])) {
          let item = JSON.parse(JSON.stringify(this.documentGrid.rows[this.documentsSelectedIndex].dataItem));
          if (item) {
            this.selectedClientDocument.documentType.documentTypeId = item.documentType.documentTypeId;
            this.selectedClientDocument.issueDate = item.issueDate;
            this.selectedClientDocument.expiryDate = item.expiryDate;
            this.selectedClientDocument.issuePlace = item.issuePlace;

          }
        }

      }, 150);
    }


  }


  public selectedJointAccountItemFromGrid = () => {

    if (this.itemsJointAccountList.items.length > 0 && this.showJoint && this.jointAccountGrid !== undefined) {
      this.jointSelectedIndex = this.jointAccountGrid.selection.row;
      if (AppUtility.isValidVariable(this.jointAccountGrid.rows[this.jointSelectedIndex])) {
        let item = JSON.parse(JSON.stringify(this.jointAccountGrid.rows[this.jointSelectedIndex].dataItem));
        if (item) {
          this.selectedJointAccountItem.contactDetail.firstName = item.contactDetail.firstName;
          this.selectedJointAccountItem.contactDetail.lastName = item.contactDetail.lastName;
          this.selectedJointAccountItem.contactDetail.taxNumber = item.contactDetail.taxNumber;
          this.selectedJointAccountItem.contactDetail.identificationType = item.contactDetail.identificationType;
          setTimeout(() => {
            this.selectedJointAccountItem.contactDetail.identificationTypeId = item.contactDetail.identificationTypeId;
          }, 250);
        }
      }

    }

  }

 


  public clearSelectedJointAccountItemFromGrid = () => {
    this.clearJointAccountFields();

  }


  public clearSelectedBankAccountItemFromGrid = () => {
    this.clearBankAccountFields();
  }


  public clearSelectedBeneficiaryFromGrid = () => {
    this.clearBeneficiaryFields();
  }


  public clearSelectedDocumentsFromGrid = () => {
    this.clearClientDocuemnt();
  }





  public onGetInvestorByClient = () => {
     
    this.clearFields();
    
    this.selectedIndex = this.flex.selection.row;
    var item = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    this.itemClientId = item.clientId;
    if (!AppUtility.isEmpty(item)) {
      this.listingService.getInvestorByClientId(item.clientId).subscribe(
        restData => {

          this.splash.hide();
          this.invSharedClientId = null;
          this.isShowInvestorForm = true;
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
            if (restData[0].statusCode === AppConstants.INV_STATUS_PENDING || restData[0].statusCode === AppConstants.INV_STATUS_ACTIVE) {
              this.isDisabledFields = true;
              this.documentForm.controls['fileUpload'].disable();
            }

          }

          this.splash.hide();
        },
        error => {
          this.appState.showLoader = false
          if (error.message) {
            this.errorMessage = <any>error.message;
          }
          else {
            this.errorMessage = <any>error;
          }
          this.dialogCmp.statusMsg = this.errorMessage;
          AppUtility.printConsole('errorMessage: ' + this.errorMessage);
          this.dialogCmp.showAlartDialog('Error');
        });
    }




  }






  public onGetInvestorClientId = () => {

    this.selectedIndex = this.flex.selection.row;
    var item = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    this.invSharedClientId = item.clientId;
    this.isShowInvestorForm = false;
    if (this.invSharedClientId !== null) {
      this.onlineAccountActivation.onGetInvestorByClient(this.invSharedClientId);
    }

  }










  public onEditAction() {

    this.BIAnchorTag.nativeElement.click();
    this.currentTab_ = "BI";
    this.clearFields();
    this.selectedIndex = this.flex.selection.row;

    var item = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(item)) {
      this.showForm = true;
      this.isEditing = true;
      // this.selectedItem = this.itemsList.currentItem;
      // this.itemsList.editItem(this.selectedItem);

      this.listingService.getClientById(AppConstants.participantId, item.clientId)
        .subscribe(
          restData => {

            this.fillClientFromJson(this.selectedItem, restData);
            // this.fillClientFromJson_Test(this.selectedItem, restData);
            this.coaCode_ = this.selectedItem.chartOfAccount.glCode;
           
            this.populateClientLeveis(this.selectedItem.clientId);
            this.populateClientType();
            this.populateAccountType();
            this.populateOnlineAccess();
            this.populateClientExchangeGrid();
            this.populateClientBankAccountGrid();
            this.populateClientBeneficiaryGrid();
            this.populateAllowedMarkets(null, null);
            this.populateCustodians(null, null);
            this.populateClientJointAccountGrid();
            this.populateClientDocuemntsGrid();

            this.glCode_ = "dummy";
            if (this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID && this.selectedItem.clientType == AppConstants.INDIVIDUAL_TYPE) {
              this.showJoint = true
            } else {
              this.showJoint = false;
            }
            this.selectedItem.contactDetail.firstName = restData.contactDetail.firstName;
           
            this.splash.hide();
          },
          error => {
            this.appState.showLoader = false
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    }

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

    this.selectedAccTypeId = null;
    this.selectedIdentificationTypeId = null;
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





  public onSaveDepository = () => {
    this.splash.show();
    debugger
    let zero_value: Number = 0;
    let beneficiaryListTemp: any[] = [];
    let documentsListTemp: any[] = [];


    //For Get Participant Code
    if (AppUtility.isValidVariable(this.selectedItem.participant.participantId)) {

      this.participantsList.filter(element => {
        if (element.participantId === this.selectedItem.participant.participantId) {
          this.selectedDepositoryItem.Participant_Code = element.participantCode;
        }
      })
    }
    //For Get Profession Code
    if (AppUtility.isValidVariable(this.selectedItem.contactDetail.professionId)) {
      this.professionList.filter(element => {
        if (element.professionId === this.selectedItem.contactDetail.professionId) {
          this.selectedDepositoryItem.Occupation_Code = element.professionCode;
        }
      })
    }

    //For Get Country Name
    if (AppUtility.isValidVariable(this.selectedItem.contactDetail.countryId)) {
      this.countryList.filter(element => {
        if (element.countryId === this.selectedItem.contactDetail.countryId) {
          this.selectedDepositoryItem.Country_Name = element.countryName;
        }
      })
    }

    //For Get City Name
    if (AppUtility.isValidVariable(this.selectedItem.contactDetail.cityId)) {
      this.cityList.filter(element => {
        if (element.cityId === this.selectedItem.contactDetail.cityId) {
          this.selectedDepositoryItem.City_Name = element.cityName;
        }
      })
    }

    //For Get Industry List
    if (AppUtility.isValidVariable(this.selectedItem.contactDetail.industryId)) {
      this.industryList.filter(element => {
        if (element.industryId === this.selectedItem.contactDetail.industryId) {

          this.selectedDepositoryItem.Industury_Code = element.industryCode;
        }
      })
    }


    this.selectedDepositoryItem.REF_No = String(this.selectedItem.clientId);
    this.selectedDepositoryItem.Account_Code = this.selectedItem.clientCode;
    this.selectedDepositoryItem.Opening_Date = this.selectedItem.todayDate;
    if(this.selectedItem.clientType === "I"){
      this.selectedDepositoryItem.Name = this.selectedItem.contactDetail.firstName + " " + this.selectedItem.contactDetail.lastName;
    }
    else if(this.selectedItem.clientType === "C"){
      this.selectedDepositoryItem.Name = this.selectedItem.contactDetail.companyName;
    }
    
    if (this.selectedItem.accountTypeNew.accTypeId === 3) {
      this.selectedDepositoryItem.contactPerson = this.selectedItem.contactDetail.trustee;
    }
    else {
      this.selectedDepositoryItem.contactPerson = this.selectedItem.contactDetail.contactPerson;
    }
    this.selectedDepositoryItem.Acc_Type_Id = this.selectedItem.accountTypeNew.accTypeId;
    this.selectedDepositoryItem.Identification_Type_Id = this.selectedItem.contactDetail.identificationTypeId;
    this.selectedDepositoryItem.Identification_Number = this.selectedItem.contactDetail.identificationType;
    this.selectedDepositoryItem.Residence_Status_Id = this.selectedItem.contactDetail.residenceStatus;
    this.selectedDepositoryItem.Address1 = this.selectedItem.contactDetail.address1;
    this.selectedDepositoryItem.Address2 = this.selectedItem.contactDetail.address2;
    this.selectedDepositoryItem.Telephone1 = this.selectedItem.contactDetail.phone1;
    
    this.selectedDepositoryItem.webAddress = this.selectedItem.contactDetail.webAddress;
    this.selectedDepositoryItem.Mobile = this.selectedItem.contactDetail.cellNo;
    this.selectedDepositoryItem.TaxNumber = this.selectedItem.contactDetail.taxNumber;
    this.selectedDepositoryItem.isProprietary = zero_value;
    this.selectedDepositoryItem.Postal_Code = this.selectedItem.contactDetail.postalCode;
    this.selectedDepositoryItem.AccountType = this.selectedItem.accountTypeNew.accTypeId;
    this.selectedDepositoryItem.Is_Tax_Number_Valid = zero_value;
    this.selectedDepositoryItem.IS_TAX_EXMP = zero_value;

    if(AppUtility.isValidVariable(this.selectedItem.contactDetail.email)){
      this.selectedDepositoryItem.Email = this.selectedItem.contactDetail.email;
    }
    else{
      this.selectedDepositoryItem.Email = "";
    }
   

    this.selectedDepositoryItem.AccountDividendDetail = new InvestorDividendDetail();
    if (!(AppUtility.isEmpty(this.itemsBanAccountList) || this.itemsBanAccountList.itemCount == 0)) {

      this.selectedDepositoryItem.AccountDividendDetail.Bank_Account_Title = this.itemsBanAccountList.items[0].bankTitle;
      this.selectedDepositoryItem.AccountDividendDetail.Bank_Account_Number = this.itemsBanAccountList.items[0].bankAccountNo;
      this.selectedDepositoryItem.AccountDividendDetail.Bank_Branch_Code = this.itemsBanAccountList.items[0].bankBranch.bankBranchCode;
      this.selectedDepositoryItem.AccountDividendDetail.Bank_Code = this.itemsBanAccountList.items[0].bankBranch.bank.bankCode;
    }
    else {

      this.selectedDepositoryItem.AccountDividendDetail.Bank_Account_Title = this.selectedItem.bankAccount[0].bankTitle;
      this.selectedDepositoryItem.AccountDividendDetail.Bank_Account_Number = this.selectedItem.bankAccount[0].bankAccountNo;
      this.selectedDepositoryItem.AccountDividendDetail.Bank_Branch_Code = this.selectedItem.bankAccount[0].bankBranch.bankBranchCode;
      //For Get bank code
      if (AppUtility.isValidVariable(this.selectedItem.bankAccount[0].bankBranch.bank.bankId)) {
        this.bankList.filter(element => {
          if (element.bankId === this.selectedItem.bankAccount[0].bankBranch.bank.bankId) {
            this.selectedDepositoryItem.AccountDividendDetail.Bank_Code = element.bankCode;
          }
        })
      }
    }



    if (!(AppUtility.isEmpty(this.itemsJointAccountList) || this.itemsJointAccountList.itemCount == 0)) {
      this.selectedDepositoryItem.JointAccountDetails = [];
      var itemFound = false;
      for (let i = 0; i < this.itemsJointAccountList.items.length; i++) {
        this.selectedDepositoryItem.JointAccountDetails[i] = new InvestorJointAccountDetail();
        this.selectedDepositoryItem.JointAccountDetails[i].Name = this.itemsJointAccountList.items[i].contactDetail.firstName + " " + this.itemsJointAccountList.items[i].contactDetail.lastName;
        this.selectedDepositoryItem.JointAccountDetails[i].Tax_Number = this.itemsJointAccountList.items[i].contactDetail.taxNumber;
        this.selectedDepositoryItem.JointAccountDetails[i].Identification_Number = this.itemsJointAccountList.items[i].contactDetail.identificationType;
        this.selectedDepositoryItem.JointAccountDetails[i].Identification_Type_Id = this.itemsJointAccountList.items[i].contactDetail.identificationTypeId;
        itemFound = true;
      }
      if (itemFound == false) {
        this.selectedDepositoryItem.JointAccountDetails = null;
      }
    }


    if (!(AppUtility.isEmpty(this.itemsBeneficiaryList) || this.itemsBeneficiaryList.itemCount == 0)) {
      this.selectedDepositoryItem.SuccessorAccountDetails = [];
      this.itemsBeneficiaryList.items.forEach(element => {
        beneficiaryListTemp.push(element);
      });

      for (let i = 0; i < this.itemsBeneficiaryList.items.length; i++) {
        this.selectedDepositoryItem.SuccessorAccountDetails[i] = new InvestorSuccessorAccountDetail();
        this.selectedDepositoryItem.SuccessorAccountDetails[i].Name = beneficiaryListTemp[i].beneficiaryName;
        this.selectedDepositoryItem.SuccessorAccountDetails[i].Tax_Number = beneficiaryListTemp[i].taxNumber;
        this.selectedDepositoryItem.SuccessorAccountDetails[i].Relationship = beneficiaryListTemp[i].relation.relationDesc;
        this.selectedDepositoryItem.SuccessorAccountDetails[i].Identification_Number = beneficiaryListTemp[i].beneficiaryCNIC;
        this.selectedDepositoryItem.SuccessorAccountDetails[i].Identification_Type_Id = beneficiaryListTemp[i].identificationType.identificationTypeId;
        itemFound = true;
      }
    }
    else {
      this.selectedDepositoryItem.SuccessorAccountDetails = null;
    }


    if (!(AppUtility.isEmpty(this.itemsDocumentList) || this.itemsDocumentList.itemCount == 0)) {
      this.selectedDepositoryItem.AccountDocumentModels = [];
      this.itemsDocumentList.items.forEach(element => {
        documentsListTemp.push(element);
      });
      for (let i = 0; i < this.itemsDocumentList.items.length; i++) {
        this.selectedDepositoryItem.AccountDocumentModels[i] = new InvestorDocumentDepo();

        let splitString = (documentsListTemp[i].documentBase64_).split('base64,');
        this.selectedDepositoryItem.AccountDocumentModels[i].Document = splitString[1];
        this.selectedDepositoryItem.AccountDocumentModels[i].DocTypeID = documentsListTemp[i].documentType.documentTypeId;
        let a = (documentsListTemp[i].contentType).split('/');
        let fileTypeString = "." + a[1].toUpperCase();

        this.selectedDepositoryItem.AccountDocumentModels[i].DocExtension = fileTypeString;
        itemFound = true;
      }
    }
    else {
      this.selectedDepositoryItem.AccountDocumentModels = null;
    }



    this.listingService.saveDepository(this.selectedDepositoryItem).subscribe((data: any) => {

      console.log("Depo Reposnse", data);
      this.isDisabledUpdateReject = true;
      this.isDisabledFields = true;
      this.documentForm.controls['fileUpload'].disable();
      this.changeStatusAfterSendDepository();
      this.dialogCmp.statusMsg = AppConstants.MSG_REQUEST_FORWARD;
      this.dialogCmp.showAlartDialog('Success');
      this.splash.hide();

    }, (error) => {

      console.log("Depo Error", error);
      if (error.Message) {
        this.errorMessage = error.Message;
      }
      else {
        this.errorMessage = error;
      }

      this.dialogCmp.statusMsg = this.errorMessage;
      this.dialogCmp.showAlartDialog('Error');
      this.splash.hide();
    })




  }






  public onSaveDraft = () => {
    let isValid: Boolean = true;
    if(this.currentTab_ === 'BI'){
      if(this.identificationTypeExactLength !== null && this.identificationTypeMinLength !== 1) {
        if(this.myForm.controls['identification_no'].value.length !== this.identificationTypeExactLength){
          isValid = false;
          this.dialogCmp.statusMsg =  AppConstants.MSG_BASIC_TAB_REQUIRED;
          this.dialogCmp.showAlartDialog('Notification');
          return false;
        }
      }
      else if(this.identificationTypeExactLength !== null && this.identificationTypeMinLength === 1){
        if(this.myForm.controls['identification_no'].value.length > this.identificationTypeExactLength){
          isValid = false;
          this.dialogCmp.statusMsg =  AppConstants.MSG_BASIC_TAB_REQUIRED;
          this.dialogCmp.showAlartDialog('Notification');
          return false;
        }
      }
    }

    let bankListTemp: any[] = [];
    let beneficiaryListTemp: any[] = [];
    let documentsListTemp: any[] = [];
    this.isSubmitted = true;
    this.selectedItem.user.participant.participantId = this.selectedItem.participant.participantId;
    if (!AppUtility.isValidVariable(this.selectedItem.user.userId)) {

      this.selectedItem.user.userId = AppConstants.userId;
      this.selectedItem.user.userName = AppConstants.username;
      this.selectedItem.user.userType = AppConstants.userType;
    }

    this.selectedItem.accountCategory.accountCategoryId = AppConstants.ACCOUNT_CATEGORY_INVESTOR;
    this.selectedItem.statusCode = (this.selectedItem.statusCode == 'R' || this.selectedItem.statusCode == '' || this.selectedItem.statusCode == null) ? AppConstants.INV_STATUS_DRAFT : this.selectedItem.statusCode;
    this.selectedItem.clientId = this.InvestorClientId;

    this.selectedItem.chartOfAccount = null;
    this.selectedItem.commissionSlabMaster = null;
    this.selectedItem.clientExchange = null;


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




    if (!(AppUtility.isEmpty(this.itemsDocumentList) || this.itemsDocumentList.itemCount == 0)) {
      this.itemsDocumentList.items.forEach(element => {
        documentsListTemp.push(element);
      });
      this.selectedItem.clientDocuments = documentsListTemp;
    } else {
      this.selectedItem.clientDocuments = null;
    }

    if (this.showCorporate && AppUtility.isValidVariable(this.selectedItem.contactDetail.lastName)) {
      this.selectedItem.contactDetail.lastName = "";
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
    }


    if(this.showCorporate){
      this.selectedItem.contactDetail.firstName = this.selectedItem.contactDetail.companyName;
      this.selectedItem.contactDetail.lastName =  "";
      this.selectedItem.clientType = AppConstants.CORPORATE_TYPE;
      this.selectedItem.contactDetail.registrationNo = this.selectedItem.contactDetail.identificationType;
    }





    if (isValid) {
      this.dialogCmp.statusMsg = "";
      this.splash.show();
      this.listingService.saveInvestor(this.selectedItem).subscribe(
        data => {
          this.splash.hide();

          if (AppUtility.isValidVariable(data.clientId)) {
            this.InvestorClientId = data.clientId;
            this.selectedItem.clientId = data.clientId;
          }
          this.populateAccountType();
          this.populateClientBankAccountGrid();
          this.populateClientBeneficiaryGrid();
          this.populateClientJointAccountGrid();
          this.populateClientDocuemntsGrid();

          this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
          this.dialogCmp.showAlartDialog('LocalSuccess');
          if (AppUtility.isEmpty(this.itemsList)) {
            this.itemsList = new wjcCore.CollectionView;
          }
        },
        error => {

          this.splash.hide();
          if (error.message) {
            this.errorMessage = <any>error.message;
          }
          else {
            this.errorMessage = <any>error;
          }
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        }
      );
    }




  }



  /***
   * Save / Update Action
   */
  public onSaveAction(model: any, isValid: boolean) {

    debugger
    if (!AppUtility.isValidVariable(this.selectedItem.clientCode) && this.showParticipantBasedGrid) {
      this.dialogCmp.statusMsg = 'Please fill all mandatory fields for Basic tab.';
      this.dialogCmp.showAlartDialog('Notification');
      isValid = false;
      return;
    }

    if (!AppUtility.isValidVariable(this.selectedItem.user.userId)) {

      this.selectedItem.user.userId = AppConstants.userId;
      this.selectedItem.user.userName = AppConstants.username;
      this.selectedItem.user.userType = AppConstants.userType;
    }



    let bankListTemp: any[] = [];
    let beneficiaryListTemp: any[] = [];
    let documentsListTemp: any[] = [];
    this.isSubmitted = true;
    this.selectedItem.user.participant.participantId = this.selectedItem.participant.participantId;
    this.selectedItem.accountCategory.accountCategoryId = AppConstants.ACCOUNT_CATEGORY_INVESTOR;

    this.selectedItem.statusCode = (this.selectedItem.statusCode == AppConstants.INV_STATUS_DRAFT || this.selectedItem.statusCode == AppConstants.INV_STATUS_EMPTY || this.selectedItem.statusCode == AppConstants.INV_STATUS_REJECTED) ? AppConstants.INV_STATUS_SUBMITTED : this.selectedItem.statusCode;
    this.selectedItem.clientId = this.InvestorClientId;
    this.selectedItem.chartOfAccount = null;
    this.selectedItem.commissionSlabMaster = null;
    this.selectedItem.clientExchange = null;



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

      //  this.selectedItem.clientDocuments = this.itemsDocumentList.items;
      this.itemsDocumentList.items.forEach(element => {
        documentsListTemp.push(element);
      });
      this.selectedItem.clientDocuments = documentsListTemp;
    } else {
      this.selectedItem.clientDocuments = null;
    }




  if(this.showCorporate){
    this.selectedItem.contactDetail.firstName = this.selectedItem.contactDetail.companyName;
    this.selectedItem.contactDetail.lastName =  "";
    this.selectedItem.clientType = AppConstants.CORPORATE_TYPE;
    this.selectedItem.contactDetail.registrationNo = this.selectedItem.contactDetail.identificationType;
  }





    if (this.isEditing) {
      ;
      if (!AppUtility.isEmpty(this.currentTab_)) {
        if (this.currentTab_ == "BI") {
          ;
          isValid = this.validateBasicInfo();

          if (isValid) {
            this.splash.show();
            this.listingService.updateClientBasicInfo(this.selectedItem).subscribe(
              data => {
                this.splash.hide();
                // this.clearFields(); //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');
              },
              error => {

                this.splash.hide();
                if (error.message) {
                  this.errorMessage = <any>error.message;
                }
                else {
                  this.errorMessage = <any>error;
                }
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }

        }
        else if (this.currentTab_ == "CON") {
          isValid = this.validateContactDetail();

          if (isValid) {
            this.splash.show();
            this.listingService.updateClientContatDetail(this.selectedItem).subscribe(
              data => {
                this.splash.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');
              },
              error => {
                this.splash.hide();
                if (error.message) {
                  this.errorMessage = <any>error.message;
                }
                else {
                  this.errorMessage = <any>error;
                }
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
        else if (this.currentTab_ == "SA") {
          isValid = this.validateSystemAccess();

          if (isValid) {
            this.splash.show();
            this.listingService.updateClientSystemAccess(this.selectedItem).subscribe(
              data => {
                this.splash.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              error => {
                this.splash.hide();
                if (error.message) {
                  this.errorMessage = <any>error.message;
                }
                else {
                  this.errorMessage = <any>error;
                }
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
        else if (this.currentTab_ == "JA") {
          isValid = this.validateJointAccount();
          if (isValid) {
            this.splash.show();
            this.listingService.updateClientJointAccount(this.selectedItem).subscribe(
              data => {
                this.splash.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              error => {
                this.splash.hide();
                if (error.message) {
                  this.errorMessage = <any>error.message;
                }
                else {
                  this.errorMessage = <any>error;
                }
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }

        else if (this.currentTab_ == "CRS") {
          isValid = this.validateCRS();
          if (isValid) {
            this.splash.show();
            this.listingService.updateClientExchanges(this.selectedItem).subscribe(
              data => {
                this.splash.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              error => {
                this.splash.hide();
                if (error.message) {
                  this.errorMessage = <any>error.message;
                }
                else {
                  this.errorMessage = <any>error;
                }
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
        else if (this.currentTab_ == "BEN") {
          isValid = this.validateBeneficiary();
          if (isValid) {
            this.splash.show();
            this.listingService.updateClientBeneficiary(this.selectedItem).subscribe(
              data => {
                this.splash.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              error => {
                this.splash.hide();
                if (error.message) {
                  this.errorMessage = <any>error.message;
                }
                else {
                  this.errorMessage = <any>error;
                }
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }

        }
        else if (this.currentTab_ == "BA") {
          isValid = this.validateBankAccount();
          if (isValid) {
            this.splash.show();
            this.listingService.updateClientBankAccount(this.selectedItem).subscribe(
              data => {
                this.splash.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              error => {
                this.splash.hide();
                if (error.message) {
                  this.errorMessage = <any>error.message;
                }
                else {
                  this.errorMessage = <any>error;
                }
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }

        }
        else if (this.currentTab_ == "DOC") {
          isValid = this.validateDocument();
          if (isValid) {
            this.splash.show();
            this.listingService.updateClientDocuments(this.selectedItem).subscribe(
              data => {
                this.splash.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              error => {
                this.splash.hide();
                if (error.message) {
                  this.errorMessage = <any>error.message;
                }
                else {
                  this.errorMessage = <any>error;
                }
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
        else if (this.currentTab_ == "AM") {
          isValid = this.validateAllowedMarkets();
          if (isValid) {
            this.splash.show();
            this.listingService.updateClientMarkets(this.selectedItem).subscribe(
              data => {
                this.splash.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

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
              }
            );
          }
        }
        else if (this.currentTab_ == "CU") {
          isValid = this.validateCustodians();
          if (isValid) {
            this.splash.show();
            this.listingService.updateClientCustodians(this.selectedItem).subscribe(
              data => {
                this.splash.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

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
              }
            );
          }
        }
      } else {
        isValid = false;
      }
    } else {

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

      } else {
        isValid = false;
      }




      if (isValid) {
        this.splash.show();
        console.log("Client details:" + this.selectedItem);
        this.listingService.saveInvestor(this.selectedItem).subscribe(data => {

          this.splash.hide();
          this.selectedItem.statusCode = data.statusCode;
          if (AppUtility.isEmpty(this.itemsList))
            this.itemsList = new wjcCore.CollectionView;
          this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
          this.dialogCmp.showAlartDialog('Success');
          if (AppUtility.isValidVariable(this.itemClientId) && this.showParticipantBasedGrid) {

            this.onGetInvestorByClient();
          }

        },
          error => {

            this.selectedItem.statusCode = (this.selectedItem.statusCode == AppConstants.INV_STATUS_DRAFT || this.selectedItem.statusCode == AppConstants.INV_STATUS_EMPTY || this.selectedItem.statusCode == AppConstants.INV_STATUS_REJECTED) ? AppConstants.INV_STATUS_SUBMITTED : this.selectedItem.statusCode;
            this.splash.hide();
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
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
    this.isShowInvestorForm = false;
    this.invSharedClientId = null;
    this.invCDCStatus = [];
    if (!AppUtility.isEmptyArray(cdcRecordForFilter)) {
      let a = 0;
      for (let i = 0; i < cdcRecordForFilter.length; i++) {

        if (cdcRecordForFilter[i].statusCode === AppConstants.INV_STATUS_PENDING) {

          this.invCDCStatus[a] = new InvCDCStatus();
          this.invCDCStatus[a].participant_Code = cdcRecordForFilter[i].participant.participantCode;
          this.invCDCStatus[a].ref_No = String(cdcRecordForFilter[i].clientId);
          a++;
        }

      }
    }
    this.listingService.getInvestorCDCStatuses(this.invCDCStatus).subscribe((restData: any) => {

      this.splash.hide();
      this.onSearchAction();

    }, (error) => {

      this.splash.hide();
      if (error.message) {
        this.errorMessage = <any>error.message;
      }
      else {
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
      //  this.clearJointAccountFields();
      this.selectedJointAccountItemFromGrid();
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
      // this.clearClientDocuemnt();
      this.selectedDocumentItemFromGrid();
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
      // this.clearBankAccountFields();
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
      this.selectedBeneficiaryItemFromGrid();
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
    // if (e.target.value.length > this.glCodeLength_) {
    // e.target.value = e.target.value.substring(0, this.glCodeLength_);
    this.glCode_ = e.target.value;
    // }
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
        for (let k = 0; k < this.itemsAllowedMarketList.items[j].marketList.length; k++) {
          if ((this.itemsAllowedMarketList.items[j].marketList[k].marketId == marketId)
            &&
            (this.itemsAllowedMarketList.items[j].exchange.exchangeId == exchangeId)) {
            if (state.target.checked)
              this.itemsAllowedMarketList.items[j].marketList[k].selected = true;
            else
              this.itemsAllowedMarketList.items[j].marketList[k].selected = false;
            break;
          }
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
    this.selectedAccTypeId = null;
    this.selectedIdentificationTypeId = null;
    this.selectedParticipantId = null;
    this.selectedCountryId = null;
    this.selectedResidenceStatus = null;
    this.selectedProfessionId = null;


    this.selectedIdentificationTypeId = data.contactDetail.identificationTypeId;
    this.selectedAccTypeId = data.accountTypeNew.accTypeId;
    this.populateAccountTypeInvestor();
    this.selectedParticipantId = data.participant.participantId;
    this.populateParticipants();

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
    
    if (data.agent !== null) {
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
    c.accountTypeNew.accTypeId = data.accountTypeNew.accTypeId;
    c.clientId = data.clientId;

    c.statusCode = data.statusCode;

    c.participant = new Participant;
    c.participant.participantId = data.participant.participantId;
    c.participant.participantCode = data.participant.participantCode;
    c.participant.participantName = data.participant.participantName;
    

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
    this.selectedResidenceStatus = Number(data.contactDetail.residenceStatus);
    this.populateResidenceStatusList();

    c.contactDetail.ntnNo = data.contactDetail.ntnNo == null ? "0" : data.contactDetail.ntnNo;
    c.contactDetail.identificationTypeId = data.contactDetail.identificationTypeId;
   

    c.contactDetail.identificationType = data.contactDetail.identificationType;
    c.contactDetail.registrationNo = data.contactDetail.registrationNo;
    c.contactDetail.professionId = data.contactDetail.professionId;
    this.selectedProfessionId = data.contactDetail.professionId;
    this.populateProfessionList();

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
    this.populateCountryList();

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

    if (data.agent !== null) {
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


    if (!AppUtility.isEmptyArray(data.clientExchange)) {
      this.fillClientExchangeFromJSON(this.selectedClientExchange, data.clientExchange[0]);
      c.clientExchange = [];
      c.clientExchange[0] = this.selectedClientExchange;
    }




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
              else if (element.statusCode === AppConstants.INV_STATUS_ACTIVE) {
                element.statusDesc = AppConstants.INV_ACTIVE;
              }
            });
            this.itemsList = new wjcCore.CollectionView(restData);
            this.splash.hide();

          },
          error => {
            this.splash.hide();
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (!AppUtility.isEmpty(this.searchInvestorTaxNumber) && AppUtility.isEmpty(this.searchInvestorName)) {
      this.listingService.getInvestorListBySearch(AppConstants.participantId, AppConstants.ALL_VAL, encodeURIComponent(this.searchInvestorTaxNumber))
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
              else if (element.statusCode === AppConstants.INV_STATUS_ACTIVE) {
                element.statusDesc = AppConstants.INV_ACTIVE;
              }
            });
            this.itemsList = new wjcCore.CollectionView(restData);
            this.splash.hide();
          },
          error => {
            this.splash.hide();
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
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
              else if (element.statusCode === AppConstants.INV_STATUS_ACTIVE) {
                element.statusDesc = AppConstants.INV_ACTIVE;
              }
            });
            this.splash.hide();
            this.itemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.splash.hide();
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (!AppUtility.isEmpty(this.searchInvestorTaxNumber) && !AppUtility.isEmpty(this.searchInvestorName)) {
      this.listingService.getInvestorListBySearch(AppConstants.participantId, encodeURIComponent(this.searchInvestorName), encodeURIComponent(this.searchInvestorTaxNumber),)
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
              else if (element.statusCode === AppConstants.INV_STATUS_ACTIVE) {
                element.statusDesc = AppConstants.INV_ACTIVE;
              }
            });
            this.splash.hide();
            this.itemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.splash.hide();
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
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
    this.splash.show();
    this.selectedLevies = null;
    this.listingService.getLeviesByClient(clientId)
      .subscribe(
        restData => {
          this.splash.hide();
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
    this.splash.show();
    this.listingService.getCommissionSlabList(AppConstants.participantId)
      .subscribe(
        restData => {
          this.splash.hide();
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
    this.splash.show();
    this.listingService.getParticipantBranchList(participantId)
      .subscribe(
        restData => {

          this.splash.hide();
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









  private populateAgentList(participantId: Number) {
     
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
            if(AppUtility.isValidVariable(this.selectedResidenceStatus)){
               setTimeout(() => {
                this.selectedItem.contactDetail.residenceStatus = this.selectedResidenceStatus;
               }, 150);
            }
            else{
              var rs: ResidenceStatus = new ResidenceStatus();
              rs.residenceStatusId = AppConstants.PLEASE_SELECT_VAL;
              rs.residenceStatusValue = AppConstants.PLEASE_SELECT_STR;
              this.residenceStatusList.unshift(rs);
             
    
                this.selectedItem.contactDetail.residenceStatus = this.selectedResidenceStatus;
              
            }
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

    this.splash.show();
    this.listingService.getAccountTypeInvestorList().subscribe(restData => {

      this.splash.hide();
      if (AppUtility.isEmpty(restData)) {
        this.accountTypeInvestorList = [];
      } else {
        this.accountTypeInvestorList = restData;
        debugger
        if(AppUtility.isValidVariable(this.selectedAccTypeId)){
          setTimeout(() => {
              this.selectedItem.accountTypeNew.accTypeId = this.selectedAccTypeId;
          }, 150);
        }
        else{
          var at: AccountType = new AccountType();
          at.accTypeId = AppConstants.PLEASE_SELECT_VAL;
          at.description = AppConstants.PLEASE_SELECT_STR;
          this.accountTypeInvestorList.unshift(at);
          setTimeout(() => {
            this.selectedItem.accountTypeNew.accTypeId = this.selectedAccTypeId;
        }, 150); 
        }
      }
    },
      error => { this.splash.hide(); this.errorMessage = <any>error.message });
  }


  private populateParticipants() {
    debugger
    this.splash.show();
    let tempArr: any = [];
    this.listingService.getParticipantListByExchagne(AppConstants.exchangeId).subscribe(restData => {

      this.splash.hide();

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

          if(AppUtility.isValidVariable(this.selectedParticipantId)){
            setTimeout(() => {
              this.selectedItem.participant.participantId = this.selectedParticipantId;
             }, 150);
          }
          else{
            var p: Participant = new Participant();
            p.participantId = AppConstants.PLEASE_SELECT_VAL;
            p.displayName_ = AppConstants.PLEASE_SELECT_STR;
            this.participantsList.unshift(p);
             setTimeout(() => {
              this.selectedItem.participant.participantId = this.selectedParticipantId;
             }, 150);
          }
      
         
      
      }

    },
      error => { this.splash.hide(); this.errorMessage = <any>error.message });
  }



  private populateExchangeList() {
    this.splash.show();
    this.listingService.getParticipantExchangeList(AppConstants.participantId)
      .subscribe(
        restData => {
          this.splash.hide();
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
    this.splash.show();
    this.listingService.getInvestorDocumentsTypeList()
      .subscribe(
        restData => {
          this.splash.hide();
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
    if (AppUtility.isEmpty(this.selectedItem.accountTypeNew)) {
      this.showJoint = false;
    }
    else if (this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
      this.showJoint = true;
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
              if (error.message) {
                this.errorMessage = <any>error.message;
              }
              else {
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
  //   this.splash.show();
  //   this.listingService.getIdentificationTypeList()
  //     .subscribe(
  //       restData => {
  //         this.splash.hide();
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
         
        this.identificationTypeList = restData;
        if(AppUtility.isValidVariable(this.selectedIdentificationTypeId)){
          setTimeout(() => {
            this.selectedItem.contactDetail.identificationTypeId = this.selectedIdentificationTypeId;
          }, 150);
        }
        else {
          var identificationType: IdentificationType = new IdentificationType();
          identificationType.identificationTypeId = AppConstants.PLEASE_SELECT_VAL;
          identificationType.identificationType = AppConstants.PLEASE_SELECT_STR;
          this.identificationTypeList.unshift(identificationType);
            this.selectedItem.contactDetail.identificationTypeId = this.selectedIdentificationTypeId;
        }
      
      },
      error => {
        this.splash.hide(); this.errorMessage = <any>error.message
          , () => {
          }
      });
  }
  





  private populateProfessionList() {

    this.splash.show();
    this.listingService.getProfessionList()
      .subscribe(
        restData => {
          this.splash.hide();
          this.professionList = restData;
          if(AppUtility.isValidVariable(this.selectedProfessionId)){
             setTimeout(() => {
               this.selectedItem.contactDetail.professionId = this.selectedProfessionId;
             }, 150);
          }
          else{
            var profession: Profession = new Profession();
            profession.professionId = AppConstants.PLEASE_SELECT_VAL;
            profession.professionDesc = AppConstants.PLEASE_SELECT_STR;
            this.professionList.unshift(profession);
            this.selectedItem.contactDetail.professionId = this.selectedProfessionId;
          }

         
        },
        error => {
          this.splash.hide(); this.errorMessage = <any>error.message
            , () => {
            }
        });
  }

  private populateIncomeSourceList() {
    this.splash.show();
    var incomeSource: IncomeSource = new IncomeSource();
    incomeSource.incomeSourceId = AppConstants.PLEASE_SELECT_VAL;
    incomeSource.incomeSourceDesc = AppConstants.PLEASE_SELECT_STR;
    this.incomeSourceList = [];
    this.incomeSourceList.unshift(incomeSource);
    this.listingService.getIncomeSourceList()
      .subscribe(
        restData => {
          this.splash.hide();
          this.incomeSourceList = restData;


          this.selectedItem.incomeSource.incomeSourceId = this.incomeSourceList[0].incomeSourceId;
          this.incomeSourceList.unshift(incomeSource);
        },
        error => { this.splash.hide(); this.errorMessage = <any>error.message; },
      );

  }

  private populateIndustryList() {
    this.splash.show();
    this.listingService.getIndustryList()
      .subscribe(
        restData => {
          this.splash.hide();
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
    this.splash.show();
    this.listingService.getCountryList()
      .subscribe(
        restData => {
          this.splash.hide();
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

            if (!AppUtility.isEmpty(restData)) {
              var exchangeMarket = new ExchangeMarket;
              exchangeMarket = this.itemsAllowedMarketList.addNew();
              exchangeMarket.exchange = new Exchange();
              exchangeMarket.exchange.exchangeId = exchangeId;
              exchangeMarket.exchange.exchangeName = exchangeName;
              exchangeMarket.marketList = restData;
              for (let i = 0; i < exchangeMarket.marketList.length; i++) {
                exchangeMarket.marketList[i].exchangeId = exchangeId;
              }
              this.itemsAllowedMarketList.commitNew();
              AppUtility.moveSelectionToLastItem(this.itemsAllowedMarketList);
              this.flexAllowedMarket.invalidate();
              if (this.isEditing)
                this.loadClientMarkets();
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
          this.selectedBankItemFromGrid();
        },
        error => {
          this.errorMessage = <any>error.message;
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
            if (this.itemsDocumentList.items.length > 0) {
              this.selectedDocumentItemFromGrid();
            }


          },
          (error) => {
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
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
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
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
            if (this.itemsBeneficiaryList.items.length > 0) {
              this.selectedBeneficiaryItemFromGrid();
            }


          },
          error => {
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
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
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
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
              this.splash.hide();
            }
          },
          error => {
            this.splash.hide();
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
              this.errorMessage = <any>error;
            }
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private loadClientMarkets() {
    this.clientMarket = [];
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsAllowedMarketList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientMarketList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            if (!AppUtility.isEmpty(restData)) {
              this.clientMarket = restData;
              if (!AppUtility.isEmpty(this.clientMarket)) {
                for (let i = 0; i < this.clientMarket.length; i++) {
                  for (let j = 0; j < this.itemsAllowedMarketList.itemCount; j++) {
                    for (let k = 0; k < this.itemsAllowedMarketList.items[j].marketList.length; k++) {
                      //this.itemsAllowedMarketList.items[j].marketList[k].selected = false;
                      if ((this.itemsAllowedMarketList.items[j].marketList[k].marketId == this.clientMarket[i].marketId)
                        &&
                        (this.itemsAllowedMarketList.items[j].exchange.exchangeId == this.clientMarket[i].exchangeId)
                        &&
                        (this.clientMarket[i].active == true)) {
                        this.itemsAllowedMarketList.items[j].marketList[k].selected = true;
                        // alert("Allowed Markets are ==> "+this.itemsAllowedMarketList.items[j].marketList[k].marketCode);
                      }
                    }
                  }
                }
              }
            }
          },
          error => {
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
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
            if (this.showJoint) {
              this.selectedJointAccountItemFromGrid();
            }

          },
          error => {
            if (error.message) {
              this.errorMessage = <any>error.message;
            }
            else {
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
            //  this.selectedBankItemFromGrid();
            if (AppUtility.isEmpty(restData)) {
              this.bankBranchList = [];
              this.selectedBankAccountItem.bankBranch.bankBranchId = null;
              this.selectedBankAccountItem.bankBranch.branchName = null;
            }
            else {
              this.bankBranchList = restData;

              if (!AppUtility.isEmptyArray(this.bankBranchList)) {
                if (!this.isEditing) {
                  this.selectedBankAccountItem.bankBranch.bankBranchId = this.bankBranchList[0].bankBranchId;
                  this.selectedBankAccountItem.bankBranch.branchName = this.bankBranchList[0].branchName;
                }
              }

            }
            this.bankBranchList.unshift(branch);

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
              var province: Provinces = new Provinces();
              province.provinceId = AppConstants.PLEASE_SELECT_VAL;
              province.provinceDesc = AppConstants.PLEASE_SELECT_STR;
              this.provinceList.unshift(province);

              setTimeout(() => {
                if (!this.isShowInvestorForm) {
                  this.selectedItem.contactDetail.provinceId = this.provinceList[0].provinceId;
                  this.selectedItem.contactDetail.province = this.provinceList[0].province;
                } else {
                  this.selectedItem.contactDetail.provinceId = this.selectedProvinceId;

                }
              }, 150);
            }
          },
          error => { this.errorMessage = <any>error.message; },
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
            //this.selectedItem.chartOfAccount = hld;
          }

        },
        error => this.errorMessage = <any>error.message);
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
        if(this.identificationTypeExactLength !== null && this.identificationTypeMinLength !== 1) {
          if(this.myForm.controls['identification_no'].value.length !== this.identificationTypeExactLength){
            return false;
          }
        }
        else if(this.identificationTypeExactLength !== null && this.identificationTypeMinLength === 1){
          if(this.myForm.controls['identification_no'].value.length > this.identificationTypeExactLength){
            return false;
          }
        }
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
        if(this.identificationTypeExactLength !== null && this.identificationTypeMinLength !== 1) {
          if(this.myForm.controls['identification_no'].value.length !== this.identificationTypeExactLength){
            return false;
          }
        }
        else if(this.identificationTypeExactLength !== null && this.identificationTypeMinLength === 1){
          if(this.myForm.controls['identification_no'].value.length > this.identificationTypeExactLength){
            return false;
          }
        }
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
        AppUtility.isEmpty(this.selectedItem.contactDetail.industryId) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationType) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationTypeId) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.residenceStatus) ||
        (AppUtility.isEmpty(this.selectedItem.clientCode) && this.showParticipantBasedGrid)) {
        return false;
      }
      else {

        this.selectedItem.contactDetail.gender = null;
        this.selectedItem.contactDetail.trustee = null;
        if(this.identificationTypeExactLength !== null && this.identificationTypeMinLength !== 1) {
          if(this.myForm.controls['identification_no'].value.length !== this.identificationTypeExactLength){
            return false;
          }
        }
        else if(this.identificationTypeExactLength !== null && this.identificationTypeMinLength === 1){
          if(this.myForm.controls['identification_no'].value.length > this.identificationTypeExactLength){
            return false;
          }
        }
        return true;
      }
    }
    else if (this.showJoint) {
       if (AppUtility.isEmpty(this.selectedItem.contactDetail.firstName) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.lastName) ||
        AppUtility.isEmpty(this.selectedItem.participant) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.taxNumber) ||
        AppUtility.isEmpty(this.selectedItem.participantBranch.branchId) ||
        AppUtility.isEmpty(this.selectedItem.accountTypeNew.accTypeId ||
          AppUtility.isEmpty(this.selectedItem.contactDetail.identificationType) ||
          AppUtility.isEmpty(this.selectedItem.contactDetail.identificationTypeId) ||
          AppUtility.isEmpty(this.selectedItem.contactDetail.professionId) || 
          AppUtility.isEmpty(this.selectedItem.contactDetail.residenceStatus) ||
          (AppUtility.isEmpty(this.selectedItem.clientCode) && this.showParticipantBasedGrid))) {
        return false;
      }
      else {
        if( AppUtility.isEmpty(this.selectedItem.contactDetail.professionId) || 
        AppUtility.isEmpty(this.selectedItem.contactDetail.residenceStatus) || AppUtility.isEmpty(this.selectedItem.clientCode) && this.showParticipantBasedGrid) {
          return false;
        }

        if(this.identificationTypeExactLength !== null && this.identificationTypeMinLength !== 1) {
          if(this.myForm.controls['identification_no'].value.length !== this.identificationTypeExactLength){
            return false;
          }
        }
        else if(this.identificationTypeExactLength !== null && this.identificationTypeMinLength === 1){
          if(this.myForm.controls['identification_no'].value.length > this.identificationTypeExactLength){
            return false;
          }
        }
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











  private validateSystemAccess(): boolean {
    if (this.selectedItem.onlineClient && !(<any>this.myForm).controls.password.valid) {
      if (this.currentTab_ != "SA") {
        this.dialogCmp.statusMsg = 'Password strength should be strong.';
        this.dialogCmp.showAlartDialog('Notification');
      }
      return false;
    }
    if (this.selectedItem.onlineClient && !this.isEditing) {
      if (AppUtility.isEmpty(this.selectedItem.user.userName) ||
        AppUtility.isEmpty(this.selectedItem.user.password) ||
        AppUtility.isEmpty(this.confirmPassword_) ||
        AppUtility.isEmpty(this.selectedItem.user.email)) {
        if (this.currentTab_ != "SA") {
          this.dialogCmp.statusMsg = 'Please fill all mandatory fields for User tab.';
          this.dialogCmp.showAlartDialog('Notification');
        }
        return false;
      } else if (this.selectedItem.user.password != this.confirmPassword_) {
        if (this.currentTab_ != "SA") {
          this.dialogCmp.statusMsg = 'Password and Confirm Password mismatch.';
          this.dialogCmp.showAlartDialog('Warning');
        }
        return false;
      } else {
        if (!AppUtility.validateEmail("" + this.selectedItem.user.email))
          return false;
      }
    }
    if (this.selectedItem.onlineClient && this.isEditing) {
      if (AppUtility.isEmpty(this.selectedItem.user.userName) ||
        AppUtility.isEmpty(this.selectedItem.user.email)) {
        if (this.currentTab_ != "SA") {
          this.dialogCmp.statusMsg = 'Please fill all mandatory fields for User tab.';
          this.dialogCmp.showAlartDialog('Notification');
        }
        return false;
      } else {
        if (!AppUtility.validateEmail("" + this.selectedItem.user.email))
          return false;
      }
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

  private validateAllowedMarkets(): boolean {
    for (let i = 0; i < this.itemsAllowedMarketList.itemCount; i++) {
      for (let j = 0; j < this.itemsAllowedMarketList.items[i].marketList.length; j++) {
        if (this.itemsAllowedMarketList.items[i].marketList[j].selected == true) {
          return true;
        }
      }
    }
    this.dialogCmp.statusMsg = "Please select some Markets from Market tab.";
    this.dialogCmp.showAlartDialog('Notification');

    return false;
  }

  private validateCustodians(): boolean {
    /*if(this.isEditing){
       for (let i = 0; i < this.itemsClientCustodianList.itemCount; i++) {
         for (let j = 0; j < this.itemsClientCustodianList.items[i].participantList.length; j++) {
           if (this.itemsClientCustodianList.items[i].participantList[j].selected == true) {
             return true;
           }
         }
       }

       alert("Please select some Custodians from Custodian.");
       return false;
    }*/
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
    if (this.isEditing) {
      if (AppUtility.isEmpty(this.itemsDocumentList) || this.itemsDocumentList.itemCount == 0) {
        this.dialogCmp.statusMsg = 'Please add some documents in Document tab.';
        this.dialogCmp.showAlartDialog('Notification');
        return false;
      }
    }
    return true;
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

      searchClientName: [''],
      searchClientCode: [''],
      active: [''],
      commissionSlab: [''],
      levyId: [''],
      participantBranch: ['', Validators.required],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      gender: ['', Validators.compose([Validators.required])],
      residenceStatus: ['', Validators.compose([Validators.required])],
      identificationTypeId: ['', Validators.compose([Validators.required])],
      registrationNo: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      dob: [''],
      professionId: ['' , Validators.compose([Validators.required])],
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

    this.splash.show();
    this.listingService.getAccountCategoryList()
      .subscribe(
        restData => {
          this.splash.hide();
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

  
  public beneficiaryMask = (event) => {
    if (event === "" || event === null || event === undefined) {
      this.bCnicValid = true;
      return;
    }
    else {
      this.bCnicValid = AppUtility.validateCNIC(event);
    }
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










}
