'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';

import { ExchangeMarketSecurity } from '../models/exch-mark-security';
import { ListingService } from '../services/listing.service';
import { AppUtility, AppConstants } from '../app.utility';
import { Exchange } from '../models/exchange';
import { Market } from '../models/market';
import { Security } from '../models/security';
import { SettlementType } from '../models/settlement-type';
import { SecurityState } from '../models/security-state';
import { SecurityType } from '../models/security-type';
import { BondPaymentSchedual } from '../models/bond-payment-schedual';
import { AuthService2 } from 'app/services/auth2.service';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AppState } from '../app.service';
import { TranslateService } from '@ngx-translate/core';

import { CollectionView, SortDescription,IPagedCollectionView,} from '@grapecity/wijmo';

declare var jQuery: any;

@Component({
  selector: 'exch-mark-security-page',
  templateUrl:'./exch-mark-security-page.html' 
  
})

export class ExchangeMarketSecurityPage implements OnInit {

  public myForm: FormGroup;

  exchangeMarketSecurityDetailList: wjcCore.CollectionView;
  selectedExchangeMarketSecurity: ExchangeMarketSecurity;

  errorMessage: string;

  exchangeList: any[];
  searchExchangeList: any[];

  marketList: any[];
  searchMarketList: any[];

  securityList: any[];
  searchSecurityList: any[];

  settlementTypeList: any[];
  securityStateList: any[];
  bondPaymentSchedualList: any[];

  //claims: any;

  public showForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  public searchExchangeId: number;
  public searchMarketId: number;
  public searchSecurityId: number;
  public showBondPaymentSchedual: boolean;
  selectedIndex: number = 0;
  private _pageSize = 0;
  private issueDate_: Date = null;
  private maturityDate_: Date = null;
  private frequencyCode_: string = "";
  private faceValue_: number = 0;
  private couponRate_: number = 0;
  public marketId: number;
  public securityId: number;

  lang:string = ""; 

  @ViewChild('flex',{ static: false }) flex: wjcGrid.FlexGrid;
  @ViewChild('cmbMarketId',{ static: false }) cmbMarketId: wjcInput.ComboBox;
  @ViewChild('cmbSecurityId',{ static: false }) cmbSecurityId: wjcInput.ComboBox;
  @ViewChild('exchangeId',{ static: false }) exchangeId: wjcInput.ComboBox;
  @ViewChild('dialogCmp',{ static: false }) dialogCmp: DialogCmp;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, private translate: TranslateService, public userService: AuthService2) {
    this.clearFields();
    //this.claims = authService.claims;
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.showBondPaymentSchedual = false;
    this.issueDate_ = new Date();
    this.maturityDate_ = new Date();
    this.frequencyCode_ = "";
    this.faceValue_ = 0;
    this.couponRate_ = 0;

    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }

  public hideModal() {
    jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  }

  ngOnInit() {
    // Poppulate Search Exchange
    this.populateSearchExchangeList();

    // Poppulate Exchange
    this.populateExchangeList();

    // Poppulate Search Market
    this.populateSearchMarketList();

    // Poppulate Market
    //this.populateMarketList(null);

    // Poppulate Search Security
    this.populateSearchSecurityList();

    // Poppulate Security
    // this.populateSecurityList(-1);

    // Poppulate SettlementType
    this.populateSettlementTypeList();

    // Poppulate SecurityState
    this.populateSecurityStateList();

    // Add form Validations
    this.addFromValidations();
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.selectedExchangeMarketSecurity.marketId = self.marketId;
      self.selectedExchangeMarketSecurity.securityId = self.securityId;
      self.cmbSecurityId.selectedValue = self.securityId;
      self.exchangeId.focus();
    });
  }

  // add a footer row to the grid
  private initGrid(s: wjcGrid.FlexGrid) {
    // AppUtility.printConsole('initGrid called');
    // // create a GroupRow to show aggregates automatically
    // let row = new wjGrid.GroupRow();
    // // add the new GroupRow to the grid's 'columnFooters' panel
    // s.columnFooters.rows.push(row);
    // // add a sigma to the header to show that this is a summary row
    // s.bottomLeftCells.setCellData(0, 0, '\u03A3');
  }

  // ngAfterViewChecked() {    
  //  // this.cmbSecurityId.selectedValue = this.securityId;
  // }


  /*********************************
   *      Public & Action Methods
   *********************************/

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
  }

  public onNewAction() {
    this.clearFields();
    this.securityList = null;
    this.marketList = null;
    this.cmbMarketId.invalidate();
    this.marketId = null;
    this.securityId = null;
    this.showForm = true;
  }

  public onEditAction() {
    this.clearFields();
    this.selectedIndex = this.flex.selection.row;
    this.selectedExchangeMarketSecurity = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.exchangeMarketSecurityDetailList)) {

      this.showForm = true;
      this.isEditing = true;

      this.marketId = this.selectedExchangeMarketSecurity.marketId.valueOf();
      this.populateMarketList(this.selectedExchangeMarketSecurity.exchangeId);
      this.selectedExchangeMarketSecurity.marketId = this.marketId;
      this.cmbMarketId.invalidate();

      this.securityId = this.selectedExchangeMarketSecurity.securityId.valueOf();
      this.populateSecurityList(this.marketId);
      this.selectedExchangeMarketSecurity.securityId = this.securityId;
      this.cmbSecurityId.invalidate();
    }
  }

  public clearFields() {

    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }
    if (AppUtility.isValidVariable(this.exchangeMarketSecurityDetailList)) {
      this.exchangeMarketSecurityDetailList.cancelEdit();
      this.exchangeMarketSecurityDetailList.cancelNew();
    }
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;

    this.showBondPaymentSchedual = false;
    this.issueDate_ = new Date();
    this.maturityDate_ = new Date();
    this.frequencyCode_ = "";
    this.faceValue_ = 0;
    this.couponRate_ = 0;
    this.bondPaymentSchedualList = [];

    this.selectedExchangeMarketSecurity = new ExchangeMarketSecurity();
    this.selectedExchangeMarketSecurity.exchangeMarketSecurityId = null;
    this.selectedExchangeMarketSecurity.boardLot = 1;
    this.selectedExchangeMarketSecurity.lowerCircuitBreakerLimit = 0.0001;
    this.selectedExchangeMarketSecurity.lowerCircuitPercent = 1;
    this.selectedExchangeMarketSecurity.lowerOrderValueLimit = 0.0001;
    this.selectedExchangeMarketSecurity.lowerOrderVolumeLimit = 1;
    this.selectedExchangeMarketSecurity.lowerValueAlertLimit = 0.0001;
    this.selectedExchangeMarketSecurity.lowerVolumeAlertLimit = 1;
    this.selectedExchangeMarketSecurity.marketConfigOverride = 0;
    this.selectedExchangeMarketSecurity.state = null;
    this.selectedExchangeMarketSecurity.stateStr = "";
    this.selectedExchangeMarketSecurity.tickSize = 0.0001;
    this.selectedExchangeMarketSecurity.upperCircuitBreakerLimit = 0.0001;
    this.selectedExchangeMarketSecurity.upperCircuitPercent = 1;
    this.selectedExchangeMarketSecurity.upperOrderValueLimit = 0.0001;
    this.selectedExchangeMarketSecurity.upperOrderVolumeLimit = 1;
    this.selectedExchangeMarketSecurity.upperValueAlertLimit = 0.0001;
    this.selectedExchangeMarketSecurity.upperVolumeAlertLimit = 1;
    this.selectedExchangeMarketSecurity.exchangeId = null;
    this.selectedExchangeMarketSecurity.exchangeCode = "";
    this.selectedExchangeMarketSecurity.marketId = null;
    this.selectedExchangeMarketSecurity.marketCode = "";
    this.selectedExchangeMarketSecurity.exchangeMarketId = null;
    this.selectedExchangeMarketSecurity.securityId = null;
    this.selectedExchangeMarketSecurity.securityCode = "";
    this.selectedExchangeMarketSecurity.securityName = "";
    this.selectedExchangeMarketSecurity.settlementTypeId = null;
    this.selectedExchangeMarketSecurity.settlementType = "";
    this.selectedExchangeMarketSecurity.displayName_ = "";
  }

  public onGeneratePaymentSchedualAction() {
    if (AppUtility.isEmpty(this.selectedExchangeMarketSecurity.securityId)) {
      this.bondPaymentSchedualList = [];
      return;
    }
    this.appState.showLoader = true;
    this.listingService.generateBondPaymentSchedual(this.selectedExchangeMarketSecurity.securityId)
      .subscribe(
        restData => {
          this.appState.showLoader = false;
          this.bondPaymentSchedualList = restData;
          this.dialogCmp.statusMsg = AppConstants.MSG_PAYMENT_SCHEDULE_GENERATED;
          this.dialogCmp.showAlartDialog('LocalSuccess');
        },
        error => {
          this.appState.showLoader = false;
          this.errorMessage = <any>error
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        });
  }

  onSearchEvent(selectedId, exchangeChange: boolean, marketChange: boolean, securityChange: boolean): void {
    if (exchangeChange) {
      this.searchExchangeId = selectedId;
    } else if (marketChange) {
      this.searchMarketId = selectedId;
    } else if (securityChange) {
      this.searchSecurityId = selectedId;
    }
     
    if (!AppUtility.isEmpty(this.searchExchangeId) && !AppUtility.isEmpty(this.searchMarketId)) {
      this.populateExchangeMarketSecurityDetail();
    } else {
      this.exchangeMarketSecurityDetailList = new wjcCore.CollectionView();
    }
  }

  onExchangeChangeEvent(selectedId): void {
    if (!AppUtility.isEmpty(selectedId))
      this.populateMarketList(selectedId);
  }

  onMarketChangeEvent(): void {
    if (!AppUtility.isEmpty(this.cmbMarketId.selectedValue)) {
      this.populateSecurityList(this.cmbMarketId.selectedValue);
    }
    else {
      this.securityList = null;
    }
  }

  onSecurityChangeEvent(selectedId): void {
    this.issueDate_ = new Date();
    this.maturityDate_ = new Date();
    this.frequencyCode_ = null;
    this.faceValue_ = 0;
    this.couponRate_ = 0;
    this.bondPaymentSchedualList = [];
    if (!AppUtility.isEmpty(selectedId)) {
      this.appState.showLoader = true;
      this.listingService.getSecurityById(selectedId)
        .subscribe(
          restData => {
            this.appState.showLoader = false;
            var sec: any;
            sec = restData;
            var se: Security = new Security();
            se.securityType = new SecurityType();
            se.securityType.securityTypeId = sec.securityType.securityTypeId;

            if (se.securityType.securityTypeId == AppConstants.SECURITY_TYPE_BOND) {
              this.showBondPaymentSchedual = true;
              this.issueDate_ = sec.securityFisDetail.issueDate;
              this.maturityDate_ = sec.securityFisDetail.maturityDate;
              this.frequencyCode_ = sec.securityFisDetail.couponFrequency.frequencyCode;
              this.faceValue_ = sec.faceValue;
              this.couponRate_ = sec.securityFisDetail.couponRate;
              if (!AppUtility.isEmpty(this.selectedExchangeMarketSecurity.exchangeId) && !AppUtility.isEmpty(this.selectedExchangeMarketSecurity.marketId)) {
                this.appState.showLoader = true;
                this.listingService.getBondPaymentSchedual(this.selectedExchangeMarketSecurity.exchangeId, this.selectedExchangeMarketSecurity.marketId, selectedId)
                  .subscribe(
                    restData => {
                      this.appState.showLoader = false;
                      this.bondPaymentSchedualList = restData;
                    },
                    error => {
                      this.appState.showLoader = false;
                      this.errorMessage = <any>error
                      this.dialogCmp.statusMsg = this.errorMessage;
                      this.dialogCmp.showAlartDialog('Error');
                    });
              }
            } else {

              this.showBondPaymentSchedual = false;
            }
          },
          error => {
            this.appState.showLoader = false;
            this.errorMessage = <any>error
            this.showBondPaymentSchedual = false;
          });

    } else {
      this.showBondPaymentSchedual = false;
    }
  }
  /***
   * Save / Update Action
   */
  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      if (this.selectedExchangeMarketSecurity.upperCircuitBreakerLimit < this.selectedExchangeMarketSecurity.lowerCircuitBreakerLimit) {
        this.dialogCmp.statusMsg = "Upper C.B should be greater or equal to Lower C.B";
        this.dialogCmp.showAlartDialog('Error');
        return;
      } else if (this.selectedExchangeMarketSecurity.upperOrderValueLimit < this.selectedExchangeMarketSecurity.lowerOrderValueLimit) {
        this.dialogCmp.statusMsg = "Upper Ord. Value should be greater or equal to Lower Ord. Value";
        this.dialogCmp.showAlartDialog('Error');
        return;
      } else if (this.selectedExchangeMarketSecurity.upperOrderVolumeLimit < this.selectedExchangeMarketSecurity.lowerOrderVolumeLimit) {
        this.dialogCmp.statusMsg = "Upper Ord. Quantity should be greater or equal to Lower Ord. Quantity";
        this.dialogCmp.showAlartDialog('Error');
        return;
      }
      console.log(this.selectedExchangeMarketSecurity);
      this.selectedExchangeMarketSecurity.bondPaymentSchedual = this.bondPaymentSchedualList;
      this.appState.showLoader = true;
      if (this.isEditing) {
        this.listingService.updateExchangeMarketSecurity(this.selectedExchangeMarketSecurity).subscribe(
          data => {
            this.appState.showLoader = false;
            this.flex.rows[this.selectedIndex].dataItem = this.selectedExchangeMarketSecurity;
            this.populateExchangeMarketSecurityDetail();
            this.exchangeMarketSecurityDetailList.commitEdit();
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.flex.invalidate();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.appState.showLoader = false;
            this.dialogCmp.statusMsg = err;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
      else {
        this.listingService.saveExchangeMarketSecurity(this.selectedExchangeMarketSecurity).subscribe(
          data => {
            this.appState.showLoader = false;
            if (AppUtility.isEmpty(this.exchangeMarketSecurityDetailList))
              this.exchangeMarketSecurityDetailList = new wjcCore.CollectionView;
            this.populateExchangeMarketSecurityDetail();
            AppUtility.moveSelectionToLastItem(this.exchangeMarketSecurityDetailList);
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.appState.showLoader = false;
            this.dialogCmp.statusMsg = err;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
    }
  }


  /***************************************
   *          Private Methods
   **************************************/
  private fillExchangeMarketSecurityFromJson(s: ExchangeMarketSecurity, data: any) {
    s.exchangeMarketSecurityId = data.exchangeMarketSecurityId;
    s.boardLot = data.boardLot;
    s.lowerCircuitBreakerLimit = data.lowerCircuitBreakerLimit;
    s.lowerCircuitPercent = data.lowerCircuitPercent;
    s.lowerOrderValueLimit = data.lowerOrderValueLimit;
    s.lowerOrderVolumeLimit = data.lowerOrderVolumeLimit;
    s.lowerValueAlertLimit = data.lowerValueAlertLimit;
    s.lowerVolumeAlertLimit = data.lowerVolumeAlertLimit;
    s.marketConfigOverride = data.marketConfigOverride;
    s.state = data.state;
    s.stateStr = data.stateStr;
    s.tickSize = data.tickSize;
    s.upperCircuitBreakerLimit = data.upperCircuitBreakerLimit;
    s.upperCircuitPercent = data.upperCircuitPercent;
    s.upperOrderValueLimit = data.upperOrderValueLimit;
    s.upperOrderVolumeLimit = data.upperOrderVolumeLimit;
    s.upperValueAlertLimit = data.upperValueAlertLimit;
    s.upperVolumeAlertLimit = data.upperVolumeAlertLimit;
    s.exchangeId = data.exchangeId;
    s.exchangeCode = data.exchangeCode;
    s.marketId = data.marketId;
    s.marketCode = data.marketCode;
    s.exchangeMarketId = data.exchangeMarketId;
    s.securityId = data.securityId;
    s.securityCode = data.securityCode;
    s.securityName = data.securityName;
    s.settlementTypeId = data.settlementTypeId;
    s.settlementType = data.settlementType;
    s.displayName_ = data.displayName_;
  }

  private populateExchangeMarketSecurityDetail() {
    this.appState.showLoader = true;
    this.listingService.getExchangeMarketSecuritiesByParam(this.searchExchangeId, this.searchMarketId, this.searchSecurityId)
      .subscribe(
        restData => {
          this.appState.showLoader = false;
          this.exchangeMarketSecurityDetailList = new wjcCore.CollectionView(restData);
        },
        error => {
          this.appState.showLoader = false;
          this.errorMessage = <any>error
        });
  }

  private populateSearchExchangeList() {
    this.appState.showLoader = true;
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.appState.showLoader = false;
          this.searchExchangeList = restData;
          var ex: Exchange = new Exchange();
          ex.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          ex.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          this.searchExchangeList.unshift(ex);
          this.searchExchangeId = this.searchExchangeList[0].exchangeId;

          if ( this.searchExchangeList.length > 0 ) {
            this.searchExchangeId = this.searchExchangeList[1].exchangeId; 
          }

        },
        error => {
          this.appState.showLoader = false;
          this.errorMessage = <any>error
        });
  }

  private populateExchangeList() {
    this.appState.showLoader = true;
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.appState.showLoader = false;
          this.exchangeList = restData;
          var ex: Exchange = new Exchange();

          ex.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          ex.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          this.exchangeList.unshift(ex);
          this.selectedExchangeMarketSecurity.exchangeId = this.exchangeList[0].exchangeId;
          this.exchangeId = this.exchangeList[0].exchangeId; 
       
          if ( this.exchangeList.length > 0 ) {
            this.exchangeId = this.exchangeList[1].exchangeId; 
          }


        },
        error => {
          this.appState.showLoader = false;
          this.errorMessage = <any>error
        });
  }

  private populateSearchMarketList() {
    this.appState.showLoader = true;
     
    this.listingService.getActiveMarketList()
      .subscribe(
        restData => {
          this.appState.showLoader = false;
          this.searchMarketList = restData;
          var m: Market = new Market();
          m.marketId = AppConstants.ALL_VAL;
          m.marketCode = AppConstants.ALL_STR;
          this.searchMarketList.unshift(m);
          this.searchMarketId = this.searchMarketList[0].marketId;

          if ( this.searchMarketList.length > 0 ) {
            this.searchMarketId = this.searchMarketList[1].marketId; 
          }
        },
        error => {
          this.appState.showLoader = false;
          this.errorMessage = <any>error
        });
  }

  private populateMarketList(exchangeId: number) {
    if (AppUtility.isEmpty(exchangeId)) {
      this.marketList = null;
      var m: Market = new Market();
      m.marketId = AppConstants.PLEASE_SELECT_VAL;
      m.marketCode = AppConstants.PLEASE_SELECT_STR;
      this.marketList.unshift(m);
      //this.selectedExchangeMarketSecurity.marketId = this.marketList[0].marketId;
    }
    else {
      this.appState.showLoader = true;
      this.listingService.getMarketListByExchange(exchangeId)
        .subscribe(
          restData => {
            this.appState.showLoader = false;
            this.marketList = restData;
            var m: Market = new Market();
            m.marketId = AppConstants.PLEASE_SELECT_VAL;
            m.marketCode = AppConstants.PLEASE_SELECT_STR;
            this.marketList.unshift(m);
            //this.selectedExchangeMarketSecurity.marketId = this.marketList[0].marketId;
          },
          error => {
            this.appState.showLoader = false;
            this.errorMessage = <any>error
          });
    }
  }

  private populateSearchSecurityList() {
    this.appState.showLoader = true;
    this.listingService.getSecurityList()
      .subscribe(
        restData => {
          this.appState.showLoader = false;
          this.searchSecurityList = restData;
          var sec: Security = new Security();
          sec.securityId = AppConstants.ALL_VAL;
          sec.symbol = AppConstants.ALL_STR;
          this.searchSecurityList.unshift(sec);
          this.searchSecurityId = this.searchSecurityList[0].securityId;
        },
        error => {
          this.appState.showLoader = false;
          this.errorMessage = <any>error
        });
  }

  private populateSecurityList(marketId: number) {
    this.appState.showLoader = true;
    if (!AppUtility.isEmpty(marketId)) {
      this.listingService.getSecurityByMarketType(marketId)
        .subscribe(
          restData => {
            this.appState.showLoader = false;
            this.securityList = restData;
            var sec: Security = new Security();
            sec.securityId = AppConstants.PLEASE_SELECT_VAL;
            sec.symbol = AppConstants.PLEASE_SELECT_STR;
            this.securityList.unshift(sec);
          },
          error => {
            this.appState.showLoader = false;
            this.errorMessage = <any>error
          });
    }
    else
      this.securityList = null;
  }

  private populateSettlementTypeList() {
    this.appState.showLoader = true;
    this.listingService.getActiveSettlementTypesList()
      .subscribe(
        restData => {
          this.appState.showLoader = false;
          this.settlementTypeList = restData;
          var st: SettlementType = new SettlementType();
          st.settlementTypeId = AppConstants.PLEASE_SELECT_VAL;
          st.settlementType = AppConstants.PLEASE_SELECT_STR;
          this.settlementTypeList.unshift(st);
          this.selectedExchangeMarketSecurity.settlementTypeId = this.settlementTypeList[0].settlementTypeId;
        },
        error => {
          this.appState.showLoader = false;
          this.errorMessage = <any>error
        });
  }

  private populateSecurityStateList() {
    this.appState.showLoader = true;
    this.listingService.getSecurityStates()
      .subscribe(
        restData => {
          this.appState.showLoader = false;
          this.securityStateList = restData;
          var ss: SecurityState = new SecurityState();
          ss.stateId = AppConstants.PLEASE_SELECT_VAL;
          ss.state = AppConstants.PLEASE_SELECT_STR;
          this.securityStateList.unshift(ss);
          this.selectedExchangeMarketSecurity.state = this.securityStateList[0].stateId;
        },
        error => {
          this.appState.showLoader = false;
          this.errorMessage = <any>error
        });
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      searchExchangeId: [''],
      exchangeId: ['', Validators.compose([Validators.required])],
      marketId: ['', Validators.compose([Validators.required])],
      searchMarketId: [''],
      securityId: ['', Validators.compose([Validators.required])],
      searchSecurityId: [''],
      settlementTypeId: ['', Validators.compose([Validators.required])],
      stateId: ['', Validators.compose([Validators.required])],
      tickSize: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      boardLot: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)])],
      upperCircuitBreakerLimit: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      lowerCircuitBreakerLimit: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      upperOrderValueLimit: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      lowerOrderValueLimit: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      upperOrderVolumeLimit: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)])],
      lowerOrderVolumeLimit: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNumeric)])]
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }

}