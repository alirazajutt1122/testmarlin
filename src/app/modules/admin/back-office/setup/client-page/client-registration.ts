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

import { InvestorDividendDetail } from 'app/models/investor-dividend-details';
import { InvestorJointAccountDetail } from 'app/models/investor-joint-account';
import { InvestorSuccessorAccountDetail } from 'app/models/investor-successor-detail';
import { InvestorDocumentDepo } from 'app/models/investor-document-depo';
import { ResidenceStatus } from 'app/models/residenceStatus';
import { InvCDCStatus } from 'app/models/inv-cdc-status';
import { Market } from 'app/models/market';
import { LevieDetail } from 'app/models/levy-detail';

import { FastReflectionHelper } from 'igniteui-angular-core';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { elementAt } from 'rxjs-compat/operator/elementAt';
var downloadAPI = require('../../../../../scripts/download-document');
declare var jQuery: any;

@Component({
  selector: 'client-registration',
  templateUrl: './client-registration.html',
  encapsulation: ViewEncapsulation.None
})
export class ClientRegistration implements OnInit {

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
  selectedAccountItem: Client;


  beneficiarySelectedIndex: number = 0;
  bankSelectedIndex: number = 0;
  documentsSelectedIndex: number = 0;
  jointSelectedIndex: number = 0;

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
  selectedProfessionId: Number = null;

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
  public selectedCityId: number = null;
  public selectedProvinceId: number = null;
  public deleteClientExchangeAction: boolean = false;
  //public selectedProvinceId: number;
  //public selectedDistrictId: number;
  public selectedRelationId: number;
  public bCnicValid: Boolean = true;
  public clientCodeForInvReg: String = "";
  public statusCodeForInvReg: String = "";
  public itemClientId: Number = null;
  public isDisabledUpdate: boolean = false;
  public isDisabledFields: boolean = false;


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

  @ViewChild('beneficiaryDeleteDlg', { static: false }) beneficiaryDeleteDlg: wjcInput.Popup;
  @ViewChild('bankDeleteDlg', { static: false }) bankDeleteDlg: wjcInput.Popup;
  @ViewChild('documentDeleteDlg', { static: false }) documentDeleteDlg: wjcInput.Popup;
  @ViewChild('jointDeleteDlg', { static: false }) jointDeleteDlg: wjcInput.Popup;

  @ViewChild('active1') active1: ElementRef;
  @ViewChild('clientType') clientType: ElementRef;
  @ViewChild('accountType') accountType: ElementRef;
  @ViewChild('participant') participant: ElementRef;
  @ViewChild('taxNumberField') taxNumberField: wjcInput.InputMask;
  @ViewChild('countryCombo') countryCombo: wjcInput.ComboBox;
  @ViewChild('statesCombo') statesCombo: wjcInput.ComboBox;






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
  public selectedAgentId: Number = null;
  public beneficiaryDeleteMsg: String = "";
  public bankDeleteMsg: String = "";
  public documentDeleteMsg: String = "";
  public jointDeleteMsg: String = "";

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
  isDisabledButtons: boolean = false;
  disabledTradConfigFields: boolean = false;

  public statusDraft: String = "";
  public statusSubmitted: String = "";
  public statusRejected: String = "";
  public statusRegistered: String = "";
  public statusActive: String = "";
  public statusPending: String = "";
  public isDisabledUpdateReject: boolean = false;
  public isDisabledSubmit: boolean = false;
  public isDisabledSendDepo: boolean = true;
  public isDisabledTradConfig: boolean = true;
  public isDisabledCreateAccount: boolean = false;
  public isEditFields : boolean = false;
  public selectedIdentificationTypeId : number = null;


   public identificationTypeExactLength : Number = null;
   public identificationTypeMinLength :Number = 1;
   public idTypeBeneficiaryExactLength : Number = null;
   public idTypeBeneficiaryMinLength : Number = 1;
   public idTypejointExactLength : Number = null;
   public idTypeJointMinLength : Number = 1;

 

 
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








    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________


  }

  ngOnInit() {

    this.addFromValidations();
    this.populateParticipants();
    this.populateCountryList();
    this.populateAccountTypeInvestor();
    this.populateAccountCategoryList();
    this.populateResidenceStatusList();
    this.populateRelationList();
    this.populateDocumentTypes();
   // this.populateIdentificationTypeList();
    this.populateProfessionList();
    this.populateIndustryList();
    this.populateIncomeSourceList();
    this.populateClientControlAccount();
    this.loadLeveisByParticipant();
    this.populateCommissionSlabList();
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

    if (AppConstants.participantId === null) {
      this.onGetDraft();
    }

    


  }

  ngAfterViewInit() {
    this.onTabChangeEvent("BI");
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





  public updateBasicDetails=()=>{
     
    debugger
    let beneficiaryListTemp: any[] = [];
    if (!(AppUtility.isEmpty(this.itemsBeneficiaryList) || this.itemsBeneficiaryList.itemCount == 0)) {
      this.itemsBeneficiaryList.items.forEach(element => {
        beneficiaryListTemp.push(element);
      });
  
  beneficiaryListTemp.forEach(element => {
    element.id = null;
    element.clientId = null;
   });
  
    this.selectedItem.beneficiary = beneficiaryListTemp;
    } else {
      this.selectedItem.beneficiary = null;
    }

    
    if(this.selectedItem.commissionSlabMaster && this.selectedItem.commissionSlabMaster.commissionSlabId === null){
      this.selectedItem.commissionSlabMaster = null;
    }

    if(this.selectedItem.user && this.selectedItem.user.userId === null){
      this.selectedItem.user = null;
    }


    if(this.selectedItem.chartOfAccount && this.selectedItem.chartOfAccount.chartOfAccountId === null){
      this.selectedItem.chartOfAccount = null;
    }




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

    let isValid = this.validateBasicInfo();
   debugger
     if(isValid) {
      this.splash.show();
      this.selectedItem.incomeSource = null;
      this.listingService.updateClientBasicInfo(this.selectedItem).subscribe((res : any)=>{
        this.splash.hide();
       this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
       this.dialogCmp.showAlartDialog('Success');
      }, error => {
       this.splash.hide();
       if(error.message){
         this.errorMessage = error.message;
       }
       else
       {
         this.errorMessage = error;
       }
     
       this.dialogCmp.statusMsg = this.errorMessage;
       this.dialogCmp.showAlartDialog('Error');
      })
     }

     
  }


  public updateContactDetails=()=>{
     
    let isValid = this.validateContactDetail();
     if(isValid) {
      this.splash.show();
      this.listingService.updateClientContatDetail(this.selectedItem).subscribe((res : any)=>{
        this.splash.hide();
       this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
       this.dialogCmp.showAlartDialog('Success');
      }, error => {
       this.splash.hide();
       if(error.message){
         this.errorMessage = error.message;
       }
       else
       {
         this.errorMessage = error;
       }
     
       this.dialogCmp.statusMsg = this.errorMessage;
       this.dialogCmp.showAlartDialog('Error');
      })
     }
    
 }

 public updateJointAccountDetails=()=>{
   
  if (!(AppUtility.isEmpty(this.itemsJointAccountList) || this.itemsJointAccountList.itemCount == 0)) {
    this.selectedItem.jointAccount = [];
    for (let i = 0; i < this.itemsJointAccountList.items.length; i++) {
      this.selectedItem.jointAccount[i] = this.itemsJointAccountList.items[i];
    }
  } else {
    this.selectedItem.jointAccount = null;
  }

   this.selectedItem.jointAccount.forEach(element => {
      element.clientJointAccountId = null;
      element.clientId = null;
   })

    let isValid = this.validateJointAccount();
     if(isValid) {
      this.splash.show();
      this.listingService.updateClientJointAccount(this.selectedItem).subscribe((res : any)=>{
        this.splash.hide();
       this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
       this.dialogCmp.showAlartDialog('Success');
      }, error => {
       this.splash.hide();
       if(error.message){
         this.errorMessage = error.message;
       }
       else
       {
         this.errorMessage = error;
       }
     
       this.dialogCmp.statusMsg = this.errorMessage;
       this.dialogCmp.showAlartDialog('Error');
      })
     }
  
}

public updateBeneficiaryAccountDetails=()=>{
   
  let beneficiaryListTemp: any[] = [];
  if (!(AppUtility.isEmpty(this.itemsBeneficiaryList) || this.itemsBeneficiaryList.itemCount == 0)) {
    this.itemsBeneficiaryList.items.forEach(element => {
      beneficiaryListTemp.push(element);
    });

    beneficiaryListTemp.forEach(element => {
      element.id = null;
      element.clientId = null;
});

  this.selectedItem.beneficiary = beneficiaryListTemp;
  } else {
    this.selectedItem.beneficiary = null;
  }

  let isValid = this.validateBeneficiary();
  if(isValid) {
   this.splash.show();
   this.listingService.updateClientBeneficiary(this.selectedItem).subscribe((res : any)=>{
     this.splash.hide();
    this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
    this.dialogCmp.showAlartDialog('Success');
   }, error => {
    this.splash.hide();
    if(error.message){
      this.errorMessage = error.message;
    }
    else
    {
      this.errorMessage = error;
    }
  
    this.dialogCmp.statusMsg = this.errorMessage;
    this.dialogCmp.showAlartDialog('Error');
   })
  }
  
}

public updateBankAccountDetails=()=>{
   
  let bankListTemp: any[] = [];
  if (!(AppUtility.isEmpty(this.itemsBanAccountList) || this.itemsBanAccountList.itemCount == 0)) {
    this.itemsBanAccountList.items.forEach(element => {
      bankListTemp.push(element);
    });

    bankListTemp.forEach(element => {
          element.clientBankId = null;
          element.clientId = null;
    });

    this.selectedItem.bankAccount = bankListTemp;
  } else {
    this.selectedItem.bankAccount = null;
  }

  let isValid = this.validateBankAccount();
     if(isValid) {
      this.splash.show();
      this.listingService.updateClientBankAccount(this.selectedItem).subscribe((res : any)=>{
        this.splash.hide();
       this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
       this.dialogCmp.showAlartDialog('Success');
      }, error => {
       this.splash.hide();
       if(error.message){
         this.errorMessage = error.message;
       }
       else
       {
         this.errorMessage = error;
       }
     
       this.dialogCmp.statusMsg = this.errorMessage;
       this.dialogCmp.showAlartDialog('Error');
      })
     }
  
}

public updateDocumentAccountDetails=()=>{
   let documentsListTemp: any[] = [];
  if (!(AppUtility.isEmpty(this.itemsDocumentList) || this.itemsDocumentList.itemCount == 0)) {
    this.itemsDocumentList.items.forEach(element => {
      documentsListTemp.push(element);
    });

    documentsListTemp.forEach(element => {
      element.clientDocumentId = null;
      element.clientId = null;
});


    this.selectedItem.clientDocuments = documentsListTemp;
  } else {
    this.selectedItem.clientDocuments = null;
  }


  let isValid = this.validateDocument();
  if(isValid) {
   this.splash.show();
   this.listingService.updateClientDocuments(this.selectedItem).subscribe((res : any)=>{
     this.splash.hide();
    this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
    this.dialogCmp.showAlartDialog('Success');
   }, error => {
    this.splash.hide();
    if(error.message){
      this.errorMessage = error.message;
    }
    else
    {
      this.errorMessage = error;
    }
  
    this.dialogCmp.statusMsg = this.errorMessage;
    this.dialogCmp.showAlartDialog('Error');
   })
  }
  
}

public updateTradingConfDetails=()=>{
 // this.splash.show();
  
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


    this.selectedDepositoryItem.REF_No = this.selectedItem.clientId + "C";
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

      if (AppUtility.isValidVariable(this.itemsBanAccountList.items[0].bankBranch.bank.bankId)) {
        this.bankList.filter(element => {
          if (element.bankId === this.itemsBanAccountList.items[0].bankBranch.bank.bankId) {
            this.selectedDepositoryItem.AccountDividendDetail.Bank_Code = element.bankCode;
          }
        })
      }

      if (AppUtility.isValidVariable(this.itemsBanAccountList.items[0].bankBranch.bankBranchId)) {
        this.bankBranchList.filter(element => {
          if (element.bankBranchId === this.itemsBanAccountList.items[0].bankBranch.bankBranchId) {
            this.selectedDepositoryItem.AccountDividendDetail.Bank_Branch_Code = element.bankBranchCode;
          }
        })
      }


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
      this.isDisabledUpdateReject = true;
      this.isDisabledFields = true;
      this.isDisabledSendDepo = true;
      this.isEditFields = false;
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







  public changeStatusAfterSendDepository = () => {
    this.splash.show();
    let x = {
      clientId: this.selectedItem.clientId,
      statusCode: AppConstants.INV_STATUS_PENDING,
    };
    this.listingService.updateClientStatusCodeForClients(x).subscribe(
      restData => {
        this.splash.hide();
       console.log("Status Changed Response : " , restData);
      },
      error => { this.splash.hide(); 
        if(error.message){
          this.errorMessage = <any>error.message;
        }
        else
        {
          this.errorMessage = <any>error;
        } });

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





  public onCancelAction() {
    this.clearFields();
    this.showForm = false;
  }



  onNewPasswordChange(newValue) {
    this.changePasswordError = undefined;
    this.passwordStrength = this.measurer.measure(newValue);
  }

  public onNextAction() {
    
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
     
    this.bankSelectedIndex = this.bankAccountGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.bankAccountGrid.rows[this.bankSelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId)) {
      this.listingService.deleteSingleBankAccountClients(item.clientId, item.clientBankId).subscribe((res: any) => {
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
    else {
      this.itemsBanAccountList.remove(this.itemsBanAccountList.currentItem);
    }



  }

  public onDeleteBeneficiaryAction() {
      
    this.beneficiarySelectedIndex = this.beneficiaryGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.beneficiaryGrid.rows[this.beneficiarySelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId)) {
      this.listingService.deleteSingleBeneficiaryClients(item.clientId, item.id).subscribe((res: any) => {
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
    else {
      this.itemsBeneficiaryList.remove(this.itemsBeneficiaryList.currentItem);
    }

  }

  public onDeleteDocumentAction() {
    this.isSubmittedDocumentForm = false;
      
    this.documentsSelectedIndex = this.documentGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.documentGrid.rows[this.documentsSelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId)) {
      this.listingService.deleteSingleDocumentsClients(item.clientId, item.clientDocumentId).subscribe((res: any) => {
        this.itemsDocumentList.remove(this.itemsDocumentList.currentItem);
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
    else {
      this.itemsDocumentList.remove(this.itemsDocumentList.currentItem);
    }

  }

  public onDeleteJointAccountAction() {

     
    this.jointSelectedIndex = this.jointAccountGrid.selection.row;
    let item = JSON.parse(JSON.stringify(this.jointAccountGrid.rows[this.jointSelectedIndex].dataItem));
    if (AppUtility.isValidVariable(item.clientId)) {
      this.listingService.deleteSingleJointAccountClients(item.clientId, item.clientJointAccountId).subscribe((res: any) => {
        this.itemsJointAccountList.remove(this.itemsJointAccountList.currentItem);
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






  public onGetClientByID = (invClientId: Number) => {
    debugger
 
    this.selectedAccTypeId = null;
    this.selectedIdentificationTypeId = null;
    this.selectedAgentId = null;
    this.selectedParticipantBranchId = null;
    this.selectedProvinceId = null;
    this.selectedCityId = null;

    this.splash.show();
    this.clearFields();
    this.showJoint = false;

    this.isDisabledSubmit = false;
    this.isDisabledCreateAccount = false;
    this.isDisabledSendDepo = false;
    this.isEditFields = false;
    this.disabledTradConfigFields = false;
    this.isDisabledButtons = false;
    this.isDisabledFields = false;
    this.documentForm.controls['fileUpload'].enable();

    if (!AppUtility.isEmpty(invClientId)) {
      this.populateParticipants();
      this.populateCountryList();
      this.listingService.getClientById(AppConstants.participantId, invClientId).subscribe(
        restData => {
           
          this.splash.hide();
          if (AppUtility.isValidVariable(restData.clientId)) {
            this.InvestorClientId = restData.clientId;
            this.selectedItem.clientId = restData.clientId;
            this.populateAccountType();
            this.populateClientJointAccountGrid();
            this.populateClientBankAccountGrid();
            this.populateClientBeneficiaryGrid();
            this.populateClientDocuemntsGrid();
            this.populateClientExchangeGrid();
            this.populateClientLeveis(this.selectedItem.clientId);
             
            if (AppUtility.isValidVariable(restData.contactDetail.firstName) && AppUtility.isValidVariable(restData.contactDetail.lastName) && restData.clientType === "I") {
              this.selectedItem.chartOfAccount.glDesc = restData.contactDetail.firstName + " " + restData.contactDetail.lastName;
            }
            else if(AppUtility.isValidVariable(restData.contactDetail.companyName) && restData.clientType === "C") {
              this.selectedItem.chartOfAccount.glDesc = restData.contactDetail.companyName; 
            }


            if (AppUtility.isValidVariable(restData.clientCode)) {
              this.glCode_ = restData.clientCode;
            }

            if (restData.statusCode === AppConstants.INV_STATUS_REGISTERED) {
              this.isDisabledFields = true;
              this.documentForm.controls['fileUpload'].disable();
              
            }
            if (restData.statusCode === AppConstants.INV_STATUS_ACTIVE || restData.statusCode === AppConstants.INV_STATUS_SUBMITTED) {
              this.isEditFields = true;
            }
          

            if(restData.statusCode === AppConstants.INV_STATUS_REGISTERED){
              this.currentTab_ = 'AC';
               this.ACAnchorTag.nativeElement.click();
            }
            else{
              this.currentTab_ = 'BI';
              this.BIAnchorTag.nativeElement.click();
            }
           


            if ((restData.user != null && restData.user.userId != null) && (restData.user.exchange != null && restData.user.exchange.exchangeName != null)) {

              this.populateAllowedMarkets(restData.user.exchange.exchangeId, restData[0].user.exchange.exchangeName);
            }
            else {
               
              this.populateAllowedMarkets(AppConstants.exchangeId, AppConstants.exchangeCode);
            }
            this.showSelectForParticpantsBranch = false;
            this.fillClientFromJson(this.selectedItem, restData);
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
    }, 500);
    //  }

  }



  public selectedBankItemFromGrid = () => {
     
    if (AppUtility.isValidVariable(this.bankAccountGrid.selection)) {
      this.bankSelectedIndex = this.bankAccountGrid.selection.row;
      if (AppUtility.isValidVariable(this.bankAccountGrid.rows[this.bankSelectedIndex])) {
        let item = JSON.parse(JSON.stringify(this.bankAccountGrid.rows[this.bankSelectedIndex].dataItem));
        if (item) {
          if (AppUtility.isValidVariable(item.bankAccountNo) && AppUtility.isValidVariable(item.bankTitle)) {
            this.selectedBankAccountItem.bankAccountNo = item.bankAccountNo;
            this.selectedBankAccountItem.bankTitle = item.bankTitle;
          }

          if (AppUtility.isValidVariable(item.bankBranch.bank.bankId)) {
            setTimeout(() => {
              this.selectedBankAccountItem.bankBranch.bank.bankId = item.bankBranch.bank.bankId;
            }, 150);
          }

          if (AppUtility.isValidVariable(this.selectedBankAccountItem.bankBranch.bank.bankId)) {
            setTimeout(() => {
              this.selectedBankAccountItem.bankBranch.bankBranchId = item.bankBranch.bankBranchId;
            }, 400);
          }

        }
      }
    }


  }

  public selectedDocumentItemFromGrid = () => {
    if (AppUtility.isValidVariable(this.documentGrid)) {
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

      }, 500);
    }
  }


  public selectedJointAccountItemFromGrid = () => {
     
      setTimeout(() => {
        this.jointSelectedIndex = this.jointAccountGrid.selection.row;
        if (AppUtility.isValidVariable(this.jointAccountGrid.rows[this.jointSelectedIndex])) {
          let item = JSON.parse(JSON.stringify(this.jointAccountGrid.rows[this.jointSelectedIndex].dataItem));
          if (item) {
            this.selectedJointAccountItem.contactDetail.firstName = item.contactDetail.firstName;
            this.selectedJointAccountItem.contactDetail.lastName = item.contactDetail.lastName;
            this.selectedJointAccountItem.contactDetail.taxNumber = item.contactDetail.taxNumber;
            this.selectedJointAccountItem.contactDetail.identificationTypeId = item.contactDetail.identificationTypeId;
            this.selectedJointAccountItem.contactDetail.identificationType = item.contactDetail.identificationType;
          }
        }
      }, 500);

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
    this.selectedJointAccountItem.contactDetail.firstName = "";
    this.selectedJointAccountItem.contactDetail.middleName = null;
    this.selectedJointAccountItem.contactDetail.lastName = "";
    this.selectedJointAccountItem.contactDetail.fatherHusbandName = null;
    this.selectedJointAccountItem.contactDetail.gender = null;
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
    this.selectedIdentificationTypeId = null;
    this.selectedLevies = null;
    this.selectedAccTypeId = null;
    

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
    this.selectedItem.participant.participantId = AppConstants.participantId;
    this.selectedItem.participant.participantCode = "";
    this.selectedItem.participant.participantName = "";

    this.selectedItem.contactDetail = new ContactDetail();
    if (!AppUtility.isEmptyArray(this.countryList)) {
    //  this.selectedItem.contactDetail.country = '';
      this.selectedItem.contactDetail.countryId = AppConstants.INV_COUNTRY_ID;
    }
    this.selectedItem.contactDetail.cityId = null
    this.selectedItem.contactDetail.city = '';
    this.selectedCountryId = null;
    this.selectedProvinceId = null;
    this.selectedCityId = null;
   
 
    this.selectedItem.contactDetail.provinceId = null
    this.selectedItem.contactDetail.province = '';

  

    this.selectedRelationId = null;

    this.selectedItem.contactDetail = new ContactDetail;
    this.selectedItem.contactDetail.firstName = "";
    this.selectedItem.contactDetail.middleName = "";
    this.selectedItem.contactDetail.lastName = "";
    this.selectedItem.contactDetail.fatherHusbandName = "";
    this.selectedItem.contactDetail.ntnNo = "";
    this.selectedItem.contactDetail.gender = null;
    this.selectedItem.contactDetail.residenceStatus = null;
    this.selectedItem.contactDetail.identificationTypeId = null;
    this.selectedItem.contactDetail.identificationType = "";
    this.selectedItem.contactDetail.registrationNo = "";
    this.selectedItem.contactDetail.professionId = null;
    this.selectedItem.contactDetail.phone1 = "";
    this.selectedItem.contactDetail.cellNo = "";
    this.selectedItem.contactDetail.email = "";
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
 

    this.clearBeneficiaryFields();
    this.selectedItem.beneficiary = [];
    this.selectedBeneficiaryItem = new Beneficiary();
 

    this.selectedItem.appliedLevy = [];

    this.clearJointAccountFields();
    this.selectedItem.jointAccount = [];
   


    this.clearClientDocuemnt();
    this.selectedItem.clientDocuments = [];
 

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
    this.selectedLevies = [];
    if(AppUtility.isValidVariable(this.cmbLevy)){
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
    this.selectedItem.user = null;
    if (this.selectedItem.incomeSource.incomeSourceId === null) {
      this.selectedItem.incomeSource = null;
    }

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




    // Individual and joint account flag setup 
    if (this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
      this.selectedItem.clientType == AppConstants.ACCOUNT_TYPE_JOINT;
    } else {
      this.selectedItem.clientType == AppConstants.INDIVIDUAL_TYPE;
    }


    //==================Account Configuration Section 
    this.selectedItem.chartOfAccount.glCode = this.coaCode_;
    this.selectedItem.chartOfAccount.glCodeDisplayName_ = this.glCodeDisplayName_;
    this.selectedItem.chartOfAccount.headLevel = this.headLevel_;
    this.selectedItem.chartOfAccount.leaf = this.leaf_;
    this.selectedItem.chartOfAccount.parentChartOfAccountId = this.parentChartOfAccountId_;
    this.selectedItem.chartOfAccount.parentGlCode = this.parentGlCode_;
    this.selectedItem.chartOfAccount.parentGlDesc = this.parentGlDesc_;
    this.selectedItem.chartOfAccount.participant = this.chartOfAccountParticipant_;
    this.selectedItem.chartOfAccount.chartOfAccountId = this.chartofAccountId_;
    this.selectedItem.chartOfAccount.glFamily = this.glFamily_;


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



    this.selectedItem.clientExchange[0] = new ClientExchange();
    if (AppUtility.isValidVariable(this.selectedItem.participant.exchange)) {
      this.selectedItem.clientExchange[0].exchangeId = this.selectedItem.participant.exchange.exchangeId;
      this.selectedItem.clientExchange[0].exchangeName = this.selectedItem.participant.exchange.exchangeName;
    }
    else {
      this.selectedItem.clientExchange[0].exchangeId = AppConstants.exchangeId;
      this.selectedItem.clientExchange[0].exchangeName = AppConstants.exchangeCode;
    }
    this.selectedItem.clientExchange[0].clientId = this.selectedItem.clientId;
    this.selectedItem.clientExchange[0].clientExchangeId = this.selectedClientExchange.clientExchangeId;
    this.selectedItem.clientExchange[0].participantExchangeId = this.selectedClientExchange.participantExchangeId;
    this.selectedItem.clientExchange[0].margin = this.selectedClientExchange.margin;
    this.selectedItem.clientExchange[0].allowShortSell = this.selectedClientExchange.allowShortSell;
    this.selectedItem.clientExchange[0].bypassCrs = this.selectedClientExchange.bypassCrs;
    this.selectedItem.clientExchange[0].openPositionStatus = this.selectedClientExchange.openPositionStatus;


    //==================Account Configuration Section 




    this.splash.show();
    this.listingService.updateClient(this.selectedItem).subscribe((restData) => {
      this.splash.hide();
      this.updateClientStatus(clientIdTempForStatus);
     // this.isDisabledButtons = true;
     this.isEditFields = true;
      this.isDisabledCreateAccount = true;
      this.isDisabledFields = false;
      this.documentForm.controls['fileUpload'].enable();
      this.dialogCmp.statusMsg = AppConstants.MSG_CREATE_ACCOUNT;
      this.dialogCmp.showAlartDialog('LocalSuccess');

    }, (error) => {
      this.splash.hide();
      if (error.message) {
        this.errorMessage = error.message;
      }
      else {
        this.errorMessage = error;
      }

      this.dialogCmp.statusMsg = this.errorMessage;
      this.dialogCmp.showAlartDialog('Error');
    });
  }




  public updateClientStatus = (clientIdForStatus: Number) => {

    this.splash.show();

    let x = {
      clientId: clientIdForStatus,
      statusCode: AppConstants.INV_STATUS_ACTIVE,
    };
    this.listingService.updateClientStatusCodeForClients(x).subscribe((restData) => {

      this.splash.hide();
      console.log(restData);
 
    }, error => {
      this.splash.hide();

    })

  }





  public onSaveAction(model: any, isValid: boolean) {

    debugger
    let bankListTemp: any[] = [];
    let beneficiaryListTemp: any[] = [];
    let documentsListTemp: any[] = [];
    this.isSubmitted = true;

    this.selectedItem.accountCategory.accountCategoryId = AppConstants.ACCOUNT_CATEGORY_INVESTOR;
    this.selectedItem.statusCode = AppConstants.INV_STATUS_SUBMITTED;
    this.selectedItem.clientId = this.InvestorClientId;
    this.selectedItem.chartOfAccount = null;
    this.selectedItem.commissionSlabMaster = null;
    this.selectedItem.clientExchange = null;
    this.selectedItem.user = null;
    if (this.selectedItem.incomeSource !== null && this.selectedItem.incomeSource.incomeSourceId === null) {
      this.selectedItem.incomeSource = null;
    }

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


    if (this.selectedItem.beneficiary !== null) {
      if (this.selectedItem.beneficiary[0].client) {
        this.selectedItem.beneficiary.forEach(element => {
          element.client.clientCode = this.selectedItem.clientCode;
        })
      }

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

   
    if(this.showCorporate) {
         this.selectedItem.contactDetail.firstName = this.selectedItem.contactDetail.companyName;
         this.selectedItem.contactDetail.lastName = "";
         this.selectedItem.clientType = AppConstants.CORPORATE_TYPE;
         this.selectedItem.contactDetail.registrationNo = this.selectedItem.contactDetail.identificationType;
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
      isValid = this.validateDocument();
      if (isValid == false) {
        return;
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


    } else {
      isValid = false;
    }


    if (isValid) {
      this.splash.show();
      console.log("Client details:" + this.selectedItem);
      this.listingService.saveClient(this.selectedItem).subscribe(data => {
        this.splash.hide();
        this.isDisabledSubmit = true;
        if (AppUtility.isEmpty(this.itemsList))
          this.itemsList = new wjcCore.CollectionView;
        this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
        this.dialogCmp.showAlartDialog('Success');
        this.selectedItem.clientId = data.clientId;
        if (data.statusCode === AppConstants.INV_STATUS_SUBMITTED) {
          this.isEditFields = true;
          this.isDisabledSendDepo = false;
          this.isDisabledSubmit = true;
           
        }
        else if (data.statusCode === AppConstants.INV_STATUS_PENDING || data.statusCode === AppConstants.INV_STATUS_REGISTERED ||
          data.statusCode === AppConstants.INV_STATUS_ACTIVE) {
          this.isDisabledSendDepo = true;
          this.isDisabledSubmit = true;
        
          this.isDisabledFields = true;
          if (data.statusCode === AppConstants.INV_STATUS_REGISTERED || data.statusCode === AppConstants.INV_STATUS_ACTIVE) {
            this.isDisabledTradConfig = false;
            if(data.statusCode === AppConstants.INV_STATUS_REGISTERED){
                this.isDisabledFields = true;
                this.documentForm.controls['fileUpload'].disable();
            }
       
          }
        }
        else {
          this.isDisabledSendDepo = true;
          this.isDisabledSubmit = true;
        }



      },
        err => {
          this.splash.hide();
          if (err.message) {
            this.errorMessage = err.message;
          }
          else {
            this.errorMessage = err;
          }
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        }
      );
    }


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
    if(AppUtility.isValidVariable(slectedCountryId)){
      this.populateProvinceListByCountry(slectedCountryId);
    }
   
  }

  public onProvinceChangeEvent(selectedProvinceId): void {
    if(AppUtility.isValidVariable(selectedProvinceId)){
      this.populateCityListByProvince(selectedProvinceId);
    }
   
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

    this.selectedAgentId = null;
    this.selectedAccTypeId = null;
    this.selectedIdentificationTypeId = null;
    this.selectedParticipantBranchId = null;

 
    this.selectedAccTypeId = data.accountTypeNew.accTypeId;
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

    if (data.statusCode === AppConstants.INV_STATUS_SUBMITTED) {
      this.isDisabledSendDepo = false;
      this.isDisabledSubmit = true;
      this.isDisabledTradConfig = true;
    }
    else if (data.statusCode === AppConstants.INV_STATUS_PENDING || data.statusCode === AppConstants.INV_STATUS_REGISTERED || data.statusCode === AppConstants.INV_STATUS_ACTIVE) {
      this.isDisabledSendDepo = true;
      this.isDisabledSubmit = true;
    //  this.isDisabledFields = true;
      if (data.statusCode === AppConstants.INV_STATUS_REGISTERED || data.statusCode === AppConstants.INV_STATUS_ACTIVE) {
        this.isDisabledTradConfig = false;
         this.disabledTradConfigFields = false;
      
      }
      else {
         
        this.isDisabledTradConfig = true;
        this.isDisabledFields = true;
        this.documentForm.controls['fileUpload'].disable();
      }
    }
    else {
       
      this.isDisabledSendDepo = true;
      this.isDisabledSubmit = true;
      this.isDisabledTradConfig = true;
      this.isDisabledFields = true;
      this.documentForm.controls['fileUpload'].disable();
    }


  this.populateAccountTypeInvestor();
  
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
    c.accountTypeNew.accTypeId = data.accountType;
    c.clientId = data.clientId;
    c.statusCode = data.statusCode;



    c.participant = new Participant();
    c.participant.participantId = data.participant.participantId;
    c.participant.participantCode = data.participant.participantCode;
    c.participant.participantName = data.participant.participantName;

    this.populateParticipantBranchList(data.participant.participantId);
    this.populateAgentList(data.participant.participantId);
    this.populateBankList(data.participant.participantId, true);



    if (data.participant.exchange != null && data.participant.exchange.exchangeId) {
      c.participant.exchange = new Exchange();
      c.participant.exchange.exchangeId = data.participant.exchange.exchangeId;
      c.participant.exchange.exchangeCode = data.participant.exchange.exchangeCode;
      c.participant.exchange.exchangeName = data.participant.exchange.exchangeName;
    }


    if (data.chartOfAccount != null && data.chartOfAccount.chartOfAccountId != null) {
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

    if (AppUtility.isValidVariable(data.commissionSlabMaster)) {
      c.commissionSlabMaster = new CommissionSlabMaster();
      c.commissionSlabMaster.commissionSlabId = data.commissionSlabMaster.commissionSlabId;
    }


     
   
    c.appliedLevy = [];
    for (let i = 0; i < data.appliedLevy.length; i++) {
      c.appliedLevy[i] = new ClientAppliedLevy();
      c.appliedLevy[i].levyMasterId = data.appliedLevy[i].leviesMasterId;
      c.appliedLevy[i].clientAppliedLevyId = data.appliedLevy[i].clientAppliedLevyId;
      c.appliedLevy[i].clientId = data.appliedLevy[i].clientId;

      if (this.leviesList != null && this.leviesList.length > 0) {
        for (let j = 0; j < this.leviesList.length; j++) {
          if (c.appliedLevy[i].levyMasterId == this.leviesList[j].leviesMasterId) {
            this.leviesList[j].selected = true;
            this.leviesList[j].$checked = true;
          
          } else {
            this.leviesList[j].selected = false;
            this.leviesList[j].$checked = false;
          }
        }
      }
    }
   
    
    this.cmbLevy.refresh();



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

    let tempLevy = [];
    
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
                  tempLevy.push(this.leviesList[i]);
                }
              }
            }

            if (AppUtility.isValidVariable(this.cmbLevy) && !this.cmbLevy.containsFocus())
              this.cmbLevy.checkedItems = tempLevy;
              this.cmbLevy.refresh();
          }
          else{
            this.cmbLevy.checkedItems = [];
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




  public populateParticipantBranchList(participantId) {


    this.listingService.getParticipantBranchList(participantId)
      .subscribe(
        restData => {
          if (AppUtility.isEmpty(restData)) {
            this.participantBranchList = [];
          } else {
            this.participantBranchList = restData;
             
            setTimeout(() => {
                this.selectedItem.participantBranch.branchId = this.selectedParticipantBranchId;
            }, 250);
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









  public populateAgentList(participantId: Number) {
     
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
                this.selectedItem.agent.agentId = this.selectedAgentId;
            }, 250);
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
    debugger
    this.accountTypeInvestorList = [];
    this.listingService.getAccountTypeInvestorList().subscribe(restData => {
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

    let tempArr: any[] = [];
    this.listingService.getParticipantListByExchagne(AppConstants.exchangeId).subscribe(restData => {


      if (AppUtility.isEmpty(restData)) {
        this.participantsList = [];
     
      } else 
      {
        this.participantsList = restData;

        for (let i = 0; i < this.participantsList.length; i++) {
          if (this.participantsList[i].participantId == AppConstants.participantId) {
            tempArr.push(this.participantsList[i]);
          //  this.selectedItem.participant.participantId = AppConstants.participantId;
          }
        }

        this.participantsList = tempArr;
        var p: Participant = new Participant();
        p.participantId = AppConstants.PLEASE_SELECT_VAL;
        p.displayName_ = AppConstants.PLEASE_SELECT_STR;
      //  this.participantsList.unshift(p);
        setTimeout(() => {
          this.selectedItem.participant.participantId = AppConstants.participantId;
         }, 150);
      }

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
          this.errorMessage = <any>error.message;
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

  private populateIdentificationTypeList() {

    this.listingService.getIdentificationTypeList()
      .subscribe(
        restData => {

          this.identificationTypeList = restData;

          var identificationType: IdentificationType = new IdentificationType();
          identificationType.identificationTypeId = AppConstants.PLEASE_SELECT_VAL;
          identificationType.identificationType = AppConstants.PLEASE_SELECT_STR;
          this.identificationTypeList.unshift(identificationType);
          this.selectedItem.contactDetail.identificationTypeId = this.identificationTypeList[0].identificationTypeId;
        },
        error => {
          this.splash.hide(); this.errorMessage = <any>error.message
            , () => {
            }
        });
  }





public populateIdentificationTypesChange=(accountType : String)=>{
  this.identificationTypeList = [];
  this.listingService.getIdentificationTypeListBaseOnAccType(accountType)
  .subscribe(
    restData => {
      
      this.identificationTypeList = restData;
      if(AppUtility.isValidVariable(this.selectedIdentificationTypeId)){
        setTimeout(() => {
          this.selectedItem.contactDetail.identificationTypeId = this.selectedIdentificationTypeId;
        }, 250);
      }
      else {
        var identificationType: IdentificationType = new IdentificationType();
        identificationType.identificationTypeId = AppConstants.PLEASE_SELECT_VAL;
        identificationType.identificationType = AppConstants.PLEASE_SELECT_STR;
        this.identificationTypeList.unshift(identificationType);
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
          if (AppUtility.isEmpty(restData)) {
            this.countryList = [];
            this.selectedItem.contactDetail.countryId = null;
          }
          else {
            this.countryList = restData;
            var country: Country = new Country();
            country.countryId = AppConstants.PLEASE_SELECT_VAL;
            country.countryName = AppConstants.PLEASE_SELECT_STR;
            this.countryList.unshift(country);
            this.selectedItem.contactDetail.countryId = AppConstants.INV_COUNTRY_ID; 
          }
          setTimeout(() => {
            if (!AppUtility.isValidVariable(this.selectedCountryId)) {
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
            if(error.message){
              this.errorMessage = <any>error.message;
            }
            else
            {
              this.errorMessage = <any>error;
            }
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
                exchangeMarket.market = new Market();
                exchangeMarket.market = <Market>restData[i];
                exchangeMarket.market.selected = false;
                this.itemsAllowedMarketList.commitNew();
                AppUtility.moveSelectionToLastItem(this.itemsAllowedMarketList);
                this.loadClientMarkets();
                //exchangeMarket = new ExchangeMarket(); 

              }

              this.flexAllowedMarket.invalidate();
              console.log("Allowed markets:", exchangeMarket);

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
          });
    } else {
      // exchange id not provided
    }
  }

  public populateBankList(_participantid: Number, _active: Boolean) {
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
          this.errorMessage = <any>error.message;
        });
  }

  private populateClientDocuemntsGrid() {

    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsDocumentList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientDocumentsList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsDocumentList = new wjcCore.CollectionView(restData);
            if (this.itemsDocumentList.items.length > 0) {
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
      this.listingService.getClientBankAccountList(this.selectedItem.clientId)
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
      this.listingService.getClientBeneficiaryList(this.selectedItem.clientId)
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
             
            if (!AppUtility.isEmptyArray(restData)) {
              this.fillClientExchangeFromJSON(this.selectedClientExchange, restData[0]);
              this.selectedItem.clientExchange = [];
              this.selectedItem.clientExchange[0] = this.selectedClientExchange;
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
    
    this.clientCustodian = [];
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsClientCustodianList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientCustodian(this.selectedItem.clientId)
        .subscribe(
          restData => {
           

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
     
    this.clientMarket = [];
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsAllowedMarketList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientMarketList(this.selectedItem.clientId)
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
      this.listingService.getClientJointAccountList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsJointAccountList = new wjcCore.CollectionView(restData);
           
              setTimeout(() => {
                this.selectedJointAccountItemFromGrid();
              }, 150);
             
            
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
            setTimeout(() => {
              this.selectedBankItemFromGrid();
            }, 150);
            
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
                if (!AppUtility.isValidVariable(this.selectedCityId)) {
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
            this.errorMessage = <any>error.message;
          },
        );
    }
  }

  private populateProvinceListByCountry(countryId: Number) {

     
    this.provinceList = [];
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
              if(AppUtility.isValidVariable(this.selectedProvinceId)){
                setTimeout(() => {
                  this.selectedItem.contactDetail.provinceId = this.selectedProvinceId;
                }, 150);
              }
              else{
                var province: Provinces = new Provinces();
                province.provinceId = AppConstants.PLEASE_SELECT_VAL;
                province.provinceDesc = AppConstants.PLEASE_SELECT_STR;
                this.provinceList.unshift(province);
                setTimeout(() => {
                  this.selectedItem.contactDetail.provinceId = this.selectedProvinceId;
                }, 150);
              }
            
              
              
             
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
        error => this.errorMessage = <any>error.message);
  }

  private validateBasicInfo(): boolean {
      debugger
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
        (AppUtility.isEmpty(this.selectedItem.clientCode))) {
        return false;
      }
      else {
        this.selectedItem.contactDetail.companyName = "";
        this.selectedItem.contactDetail.contactPerson = "";
        this.selectedItem.contactDetail.industryId = null;
        this.selectedItem.contactDetail.registerationDate = null;
        this.selectedItem.contactDetail.registrationNo = null;
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
        (AppUtility.isEmpty(this.selectedItem.clientCode))) {
        return false;
      }
      else {
        this.selectedItem.contactDetail.contactPerson = "";
        this.selectedItem.contactDetail.industryId = null;
        this.selectedItem.contactDetail.registerationDate = null;
        this.selectedItem.contactDetail.registrationNo = null;
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
        
        (AppUtility.isEmpty(this.selectedItem.clientCode))) {
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
        AppUtility.isEmpty(this.selectedItem.contactDetail.residenceStatus) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.professionId) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.taxNumber) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationType) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationTypeId) ||
        AppUtility.isEmpty(this.selectedItem.participantBranch.branchId) ||
        AppUtility.isEmpty(this.selectedItem.accountTypeNew.accTypeId ||
          (AppUtility.isEmpty(this.selectedItem.clientCode)))
      ) {
        return false;
      }
      else {

        this.selectedItem.contactDetail.gender = null;
        this.selectedItem.contactDetail.trustee = null;
        this.selectedItem.contactDetail.contactPerson = "";
        this.selectedItem.contactDetail.industryId = null;
        this.selectedItem.contactDetail.registerationDate = null;
        this.selectedItem.contactDetail.registrationNo = null;
        this.selectedItem.contactDetail.trustee = null;
        this.selectedItem.contactDetail.companyName = "";
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

    
    return true;
  }

  private validateDocument(): boolean {

    if (AppUtility.isEmpty(this.itemsDocumentList) || this.itemsDocumentList.itemCount == 0) {
      this.dialogCmp.statusMsg = 'Please add some documents in Document tab.';
      this.dialogCmp.showAlartDialog('Notification');
      return false;
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
      glCode: ['', Validators.compose([Validators.required])],
      coaCode: [''],
      coaDesc: ['', Validators.compose([Validators.required])],
      searchClientName: [''],
      searchClientCode: [''],
      active: [''],
      commissionSlab: [''],
      commissionSlabId: ['', Validators.compose([Validators.required])],
      sendEmail: [''],
      sendSms: [''],
      levyId: ['', Validators.compose([Validators.required])],
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
    if (btnClicked == 'Success') {
      //  this.route.navigate(['/dashboard']);
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
          this.splash.hide();  
          if(error.message){
            this.errorMessage = <any>error.message;
          }
          else
          {
            this.errorMessage = <any>error;
          }
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


}
