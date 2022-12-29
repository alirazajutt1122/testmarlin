'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Agent } from 'app/models/agent';
import { Bank } from 'app/models/bank';
import { BankBranch } from 'app/models/bank-branches';
import { Beneficiary } from 'app/models/beneficiary';
import { ChartOfAccount } from 'app/models/chart-of-account';
import { City } from 'app/models/city';
import { Client } from 'app/models/client';
import { ClientAppliedLevy } from 'app/models/client-applied-levy';
import { ClientBankAccount } from 'app/models/client-bank-account';
import { ClientCustodian } from 'app/models/client-custodian';
import { ClientDocument } from 'app/models/client-document';
import { ClientExchange } from 'app/models/client-exchange';
import { ClientJointAccount } from 'app/models/client-joint-account';
import { ClientLevieMaster } from 'app/models/client-levy-master';
import { ClientMarket } from 'app/models/client-market';
import { CommissionSlabMaster } from 'app/models/commission-slab-master';
import { ContactDetail } from 'app/models/contact-detail';
import { Country } from 'app/models/country';
import { Exchange } from 'app/models/exchange';
import { ExchangeMarket } from 'app/models/exchange-market';
import { IdentificationType } from 'app/models/identification-type';
 
import { IncomeSource } from 'app/models/income-source';
import { Industry } from 'app/models/industry';
import { Participant } from 'app/models/participant';
import { ParticipantBranch } from 'app/models/participant-branches';
import { ParticipantExchange } from 'app/models/participant-exchanges';
import { Profession } from 'app/models/profession';
import { Provinces } from 'app/models/Province';
import { Relation } from 'app/models/relation';
import { User } from 'app/models/user';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { PasswordStrengthMeasurer } from 'app/util/PasswordStrengthMeasurer';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { CollectionView, SortDescription, IPagedCollectionView, } from '@grapecity/wijmo';
import { DocumentType } from 'app/models/document-type';
import { PasswordValidators } from 'ng2-validators';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

var downloadAPI = require('../../../../../scripts/download-document');
import { AccountCategory } from 'app/models/account-category';
import { AccountType } from 'app/models/account-type';
import { ClientRegistration } from './client-registration';
import { InvCDCStatus } from 'app/models/inv-cdc-status';

declare var jQuery: any;
// import 'slim_scroll/jquery.slimscroll.js';


@Component({
  selector: 'client-page',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './client-page.html',
})
export class ClientPage implements OnInit {
  public myForm: FormGroup;

 

  public bankDetailForm: FormGroup;
  public beneficiaryForm: FormGroup;
  public jointAccountForm: FormGroup;
  public clientExchangeForm: FormGroup;
  public documentForm: FormGroup;
  public allowedMarketForm: FormGroup;
  public clientCustodianForm: FormGroup;
  itemsList: wjcCore.CollectionView;
 

  selectedItem: Client;
  selectedBankAccountItem: ClientBankAccount;
  selectedJointAccountItem: ClientJointAccount;
  selectedClientDocument: ClientDocument;
  selectedClientExchange: ClientExchange;
  errorMessage: string;
  selectedIndex: number = 0;

  commissionSlabList: any[];
  participantBranchList: any[];
  agentList: any[];
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

  public searchClientCode: string = "";
  public searchClientName: string = "";
  public glCodeLength_: number = 25;
  public incomeSourcee: string = "";

  public showIndividual = false;
  public showCorporate = false;
  public showJoint = false;
  public showOnlineAccess = false;

  public glCode_: String = "";
  public coaCode_: String = "";
  private clientControlChartOfAccountCode_: String = "";
  public coaId_: Number;
  private _pageSize = 0;
  public confirmPassword_: String = "";
  public currentTab_ = "BI";

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
  public accountTypeInvestorList : any[];
  public sharedClientId : Number = null;
  public invCDCStatus : any[];

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
 

 
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  @ViewChild('active1') active1: ElementRef;

  @ViewChild(ClientRegistration) clientRegistration : ClientRegistration;
  lang: string;
  public isNewActionForm : boolean = false;

 
  constructor(private appState: AppState, private changeDetectorRef: ChangeDetectorRef, private listingService: ListingService, private _fb: FormBuilder, 
    public userService: AuthService2, private translate: TranslateService, public loader: FuseLoaderScreenService) {
   
    
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

    //_______________________________for ngx_translate_________________________________________
    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________

  }

  ngOnInit() {
    this.populateProfessionList();
    this.onSearchAction();
  }

  ngAfterViewInit() {
 
  }
 
  /*********************************
   *      Public & Action Methods
   *********************************/



  public onNewActionShowForm = () => {  
    this.isNewActionForm = true;
    this.clientRegistration.clearFields();
    this.clientRegistration.showIndividual = false;
    this.clientRegistration.showJoint = false;
    this.clientRegistration.showCorporate = false;
    this.clientRegistration.isDisabledTradConfig = true;
    this.clientRegistration.isDisabledSubmit = false;
    this.clientRegistration.isDisabledSendDepo = true;
    this.clientRegistration.isDisabledFields = false;
    this.clientRegistration.InvestorClientId = null;
    this.clientRegistration.selectedItem.clientId = null;
    this.clientRegistration.BIAnchorTag.nativeElement.click();
    this.clientRegistration.currentTab_ = "BI";
    this.clientRegistration.documentForm.controls['fileUpload'].enable();
    this.clientRegistration.itemsBeneficiaryList = new wjcCore.CollectionView();
    this.clientRegistration.itemsBanAccountList = new wjcCore.CollectionView();
    this.clientRegistration.itemsJointAccountList = new wjcCore.CollectionView();
    this.clientRegistration.itemsDocumentList = new wjcCore.CollectionView();
    this.clientRegistration.populateParticipantBranchList(AppConstants.participantId);
    this.clientRegistration.populateAgentList(AppConstants.participantId);
    this.clientRegistration.populateBankList(AppConstants.participantId, true);
 
  }





  public onRefreshCDCStatus = () => {
    this.loader.show();
    let cdcRecordForFilter = this.itemsList.items;

    this.invCDCStatus = []; 
    if(!AppUtility.isEmptyArray(cdcRecordForFilter)){
      let a = 0;
      for(let i=0; i<cdcRecordForFilter.length; i++) {
       
        if(cdcRecordForFilter[i].statusCode === AppConstants.INV_STATUS_PENDING) {
       
          this.invCDCStatus[a] = new InvCDCStatus();
          this.invCDCStatus[a].participant_Code = cdcRecordForFilter[i].participant.participantCode;
          this.invCDCStatus[a].ref_No = String(cdcRecordForFilter[i].clientId) + "C";
          a++;
        }
      
      }
    }
   this.listingService.getInvestorCDCStatusesForClients(this.invCDCStatus).subscribe((restData : any)=> {
    this.onSearchAction();
    this.isNewActionForm = false;
    this.loader.hide();
    
    
   }, (error) => {
     
    this.loader.hide();
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

 
 
  private populateProfessionList() {
     
    this.professionList = [];
    this.listingService.getProfessionList()
      .subscribe(
        restData => {
          this.professionList = restData;
        },
        error => {
          this.errorMessage = <any>error.message
            , () => {
            }
        });
  }
 

 

 

  public onSearchAction() {
    this.populateItemGrid();
  }

 
 

 

  

  public onGetClientClientId = () => {
    debugger
    this.selectedIndex = this.flex.selection.row;
    var item = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    this.sharedClientId = item.clientId;
    this.isNewActionForm = true;
    if(this.sharedClientId !== null) {
      this.clientRegistration.onGetClientByID(this.sharedClientId);
    }
  }



 
 

  public getNotification(btnClicked) {

    if (btnClicked == 'Success') {
    }

  }
 

 
 
 
  private populateItemGrid() {
  debugger
  this.loader.show();
    if (AppUtility.isEmpty(this.searchClientCode) && AppUtility.isEmpty(this.searchClientName)) {
      this.listingService.getClientListByBroker(AppConstants.participantId, false)
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
            this.loader.hide();
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
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (!AppUtility.isEmpty(this.searchClientCode) && AppUtility.isEmpty(this.searchClientName)) {
      this.listingService.getClientListByBrokerAndClientCode(AppConstants.participantId, encodeURIComponent(this.searchClientCode))
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
            this.loader.hide();
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
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (AppUtility.isEmpty(this.searchClientCode) && !AppUtility.isEmpty(this.searchClientName)) {
      this.listingService.getClientListByBrokerAndClientName(AppConstants.participantId, encodeURIComponent(this.searchClientName))
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
            this.loader.hide();
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
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (!AppUtility.isEmpty(this.searchClientCode) && !AppUtility.isEmpty(this.searchClientName)) {
      this.listingService.getClientListByBrokerAndClientCodeAndClientName(AppConstants.participantId, encodeURIComponent(this.searchClientCode), encodeURIComponent(this.searchClientName))
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
            this.loader.hide();
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
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    }
  }
 

 
 

 
 

 

  

 
 
}
