'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { ParticipantBranch } from 'app/models/participant-branches';
import { Params, ReportParams } from 'app/models/report-params';
import { Security } from 'app/models/security';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { ReportService } from 'app/services/report.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { CollectionView, SortDescription, IPagedCollectionView, } from '@grapecity/wijmo';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { SecurityDailyIndicator } from 'app/models/security-daily-indicator';
import { Market } from 'app/models/market';

declare var jQuery: any;

@Component({
  selector: 'security-daily-indicator-page',
  templateUrl: './security-daily-indicator-page.html',
})

export class SecurityDailyIndicatorPage implements OnInit {

  public myForm: FormGroup;

  securityDailyIndicatorDetailList: wjcCore.CollectionView;
  selectedSecurityDailyIndicator: SecurityDailyIndicator;

  errorMessage: string;

  exchangeList: any[];
  searchExchangeList: any[];

  marketList: any[];
  searchMarketList: any[];

  securityList: any[];
  searchSecurityList: any[];

  //claims: any;

  public showForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  public searchExchangeId: number;
  public searchMarketId: number;
  public searchSecurityId: number;
  public searchStatsDate: Date;

  selectedIndex: number = 0;
  private _pageSize = 0;

  public marketId: number;
  public securityId: number;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('cmbMarketId') cmbMarketId: wjcInput.ComboBox;
  @ViewChild('cmbSecurityId') cmbSecurityId: wjcInput.ComboBox;
  @ViewChild('cmbExchangeId') cmbExchangeId: wjcInput.ComboBox;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;
  exchangeId: any;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2,private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.clearFields();
    //this.claims = authService.claims;
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
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

    // Add form Validations
    this.addFromValidations();
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.selectedSecurityDailyIndicator.marketId = self.marketId;
      self.selectedSecurityDailyIndicator.securityId = self.securityId;
      self.cmbSecurityId.selectedValue = self.securityId;
      self.cmbExchangeId.focus();
    });
  }

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
    this.selectedSecurityDailyIndicator = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.securityDailyIndicatorDetailList)) {

      this.showForm = true;
      this.isEditing = true;
      //this.securityDailyIndicatorDetailList.editItem(this.selectedSecurityDailyIndicator);

      this.marketId = this.selectedSecurityDailyIndicator.marketId.valueOf();
      this.populateMarketList(this.selectedSecurityDailyIndicator.exchangeId);
      this.selectedSecurityDailyIndicator.marketId = this.marketId;
      this.cmbMarketId.invalidate();

      this.securityId = this.selectedSecurityDailyIndicator.securityId.valueOf();
      this.populateSecurityList(this.marketId);
      this.cmbSecurityId.invalidate();
    }
  }

  public clearFields() {

    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }
    if (AppUtility.isValidVariable(this.securityDailyIndicatorDetailList)) {
      this.securityDailyIndicatorDetailList.cancelEdit();
      this.securityDailyIndicatorDetailList.cancelNew();
    }
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;

    this.selectedSecurityDailyIndicator = new SecurityDailyIndicator();
    this.selectedSecurityDailyIndicator.securityDailyIndicatorId = null;
    this.selectedSecurityDailyIndicator.statsDate = new Date();
    this.selectedSecurityDailyIndicator.lowPrice = 0.0001;
    this.selectedSecurityDailyIndicator.openPrice = 0.0001;
    this.selectedSecurityDailyIndicator.highPrice = 0.0001;
    this.selectedSecurityDailyIndicator.closePrice = 0.0001;
    this.selectedSecurityDailyIndicator.varValue = 0.0001;
    this.selectedSecurityDailyIndicator.hhaRate = 0.0001;
    this.selectedSecurityDailyIndicator.averagePrice = 0;
    this.selectedSecurityDailyIndicator.changePrice = 0;
    this.selectedSecurityDailyIndicator.percentageChange = 0;
    this.selectedSecurityDailyIndicator.tradesCount = 0;
    this.selectedSecurityDailyIndicator.turnover = 0;
    this.selectedSecurityDailyIndicator.turnoverValue = 0;

    this.selectedSecurityDailyIndicator.exchangeId = null;
    this.selectedSecurityDailyIndicator.exchangeCode = "";
    this.selectedSecurityDailyIndicator.marketId = null;
    this.selectedSecurityDailyIndicator.marketCode = "";
    this.selectedSecurityDailyIndicator.exchangeMarketId = null;
    this.selectedSecurityDailyIndicator.securityId = null;
    this.selectedSecurityDailyIndicator.securityCode = "";
    this.selectedSecurityDailyIndicator.securityName = "";

  }

  onSearchExchangeChangeEvent(selectedId): void {
    if (!AppUtility.isEmpty(selectedId))
      this.populateSearchMarketList(selectedId);
    this.searchExchangeId = selectedId;
  }

  onSearchMarketChangeEvent(selectedId): void {
    if (!AppUtility.isEmpty(selectedId)) {
      this.populateSearchSecurityList(selectedId);
    }
    else {
      this.searchSecurityList = null;
    }
  }

  onSearchEvent(sExchangeId, sMarketId, sSecurityId, statsDate): void {
    if (!AppUtility.isEmpty(sExchangeId)) {
      this.searchExchangeId = sExchangeId;
    }
    if (!AppUtility.isEmpty(sMarketId)) {
      this.searchMarketId = sMarketId;
    }
    if (!AppUtility.isEmpty(sSecurityId))
      this.searchSecurityId = sSecurityId;
    else if (sSecurityId == null)
      this.searchSecurityId = -1;

    if (!AppUtility.isEmpty(this.searchExchangeId) && !AppUtility.isEmpty(this.searchMarketId)) {
      this.searchStatsDate = statsDate;
      this.populateSecurityDailyIndicatorDetail();
    } else {
      this.securityDailyIndicatorDetailList = new wjcCore.CollectionView();
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
  /***
   * Save / Update Action
   */
  public onSaveAction(model: any, isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {

      console.log(this.selectedSecurityDailyIndicator);

      this.loader.show();
      if (this.isEditing) {
        this.loader.hide();
        this.listingService.updateSecurityDailyIndicator(this.selectedSecurityDailyIndicator).subscribe(
          data => {
            this.flex.rows[this.selectedIndex].dataItem = this.selectedSecurityDailyIndicator;
            this.fillExchangeMarketSecurityFromJson(this.selectedSecurityDailyIndicator, data);
            this.securityDailyIndicatorDetailList.commitEdit();
            this.flex.invalidate();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
            this.dialogCmp.statusMsg = err;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
      else {
        this.listingService.saveSecurityDailyIndicator(this.selectedSecurityDailyIndicator).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.securityDailyIndicatorDetailList))
              this.securityDailyIndicatorDetailList = new wjcCore.CollectionView;

            this.selectedSecurityDailyIndicator = this.securityDailyIndicatorDetailList.addNew();
            this.fillExchangeMarketSecurityFromJson(this.selectedSecurityDailyIndicator, data);
            this.securityDailyIndicatorDetailList.commitNew();
            AppUtility.moveSelectionToLastItem(this.securityDailyIndicatorDetailList);
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.loader.hide();
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
  private fillExchangeMarketSecurityFromJson(s: SecurityDailyIndicator, data: any) {
    s.securityDailyIndicatorId = data.securityDailyIndicatorId;
    s.statsDate = data.statsDate;
    s.lowPrice = data.lowPrice;
    s.openPrice = data.openPrice;
    s.highPrice = data.highPrice;
    s.closePrice = data.closePrice;
    s.varValue = data.varValue;
    s.hhaRate = data.hhaRate;
    s.exchangeId = data.exchangeId;
    s.exchangeCode = data.exchangeCode;
    s.marketId = data.marketId;
    s.marketCode = data.marketCode;
    s.exchangeMarketId = data.exchangeMarketId;
    s.securityId = data.securityId;
    s.securityCode = data.securityCode;
    s.securityName = data.securityName;

    s.averagePrice = data.averagePrice;
    s.changePrice = data.changePrice;
    s.percentageChange = data.percentageChange;
    s.tradesCount = data.tradesCount;
    s.turnover = data.turnover;
    s.turnoverValue = data.turnoverValue;
  }

  private populateSecurityDailyIndicatorDetail() {
    this.loader.show();
    this.listingService.populateSecurityDailyIndicatorDetail(this.searchExchangeId, this.searchMarketId, this.searchSecurityId, this.searchStatsDate)
      .subscribe(
        restData => {
          this.loader.hide();
          this.securityDailyIndicatorDetailList = new wjcCore.CollectionView(restData);
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }

  private populateSearchExchangeList() {
    this.loader.show();
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.searchExchangeList = restData;
          var ex: Exchange = new Exchange();
          ex.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          ex.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          this.searchExchangeList.unshift(ex);
          // this.searchExchangeId = this.searchExchangeList[0].exchangeId;

          this.searchExchangeId = (AppConstants.exchangeId === null) ? this.searchExchangeList[0].exchangeId : AppConstants.exchangeId;
          this.onSearchExchangeChangeEvent(this.searchExchangeId)
        },
        error => {
          this.loader.show();
          this.errorMessage = <any>error.message
        });
  }

  private populateExchangeList() {
    this.loader.show();
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.exchangeList = restData;
          var ex: Exchange = new Exchange();
          ex.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          ex.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          this.exchangeList.unshift(ex);
          this.selectedSecurityDailyIndicator.exchangeId = this.exchangeList[0].exchangeId;

          // this.selectedSecurityDailyIndicator.exchangeId = (AppConstants.exchangeId === null) ? this.exchangeList[0].exchangeId : AppConstants.exchangeId;
          // this.exchangeId = (AppConstants.exchangeId === null) ? this.exchangeList[0].exchangeId : AppConstants.exchangeId;

          
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message
        });
  }

  private populateSearchMarketList(exchangeId: number) {
    this.loader.show();
    if (AppUtility.isEmpty(exchangeId)) {
      this.searchMarketList = null;
      var m: Market = new Market();
      m.marketId = AppConstants.PLEASE_SELECT_VAL;
      m.marketCode = AppConstants.PLEASE_SELECT_STR;
      this.searchMarketList.unshift(m);

    }
    else {
      this.listingService.getMarketListByExchange(exchangeId)
        .subscribe(
          restData => {
            this.loader.hide();
            this.searchMarketList = restData;
            var m: Market = new Market();
            m.marketId = AppConstants.PLEASE_SELECT_VAL;
            m.marketCode = AppConstants.PLEASE_SELECT_STR;
            this.searchMarketList.unshift(m);
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message
          });
    }
  }

  private populateSearchSecurityList(marketId: number) {
    this.loader.show();
    if (!AppUtility.isEmpty(marketId)) {
      this.listingService.getSecurityByExchangeMarket(this.searchExchangeId, marketId)
        .subscribe(
          restData => {
            this.loader.hide();
            this.searchSecurityList = restData;
            var sec: Security = new Security();
            sec.securityId = AppConstants.PLEASE_SELECT_VAL;
            sec.symbol = AppConstants.PLEASE_SELECT_STR;
            this.searchSecurityList.unshift(sec);
          },
          error => {
            this.loader.show();
            this.errorMessage = <any>error.message
          });
    }
    else
      this.searchSecurityList = null;
  }

  private populateMarketList(exchangeId: number) {
    this.loader.show();
    if (AppUtility.isEmpty(exchangeId)) {
      this.marketList = null;
      var m: Market = new Market();
      m.marketId = AppConstants.PLEASE_SELECT_VAL;
      m.marketCode = AppConstants.PLEASE_SELECT_STR;
      this.marketList.unshift(m);
    }
    else {
      this.listingService.getMarketListByExchange(exchangeId)
        .subscribe(
          restData => {
            this.loader.hide();
            this.marketList = restData;
            var m: Market = new Market();
            m.marketId = AppConstants.PLEASE_SELECT_VAL;
            m.marketCode = AppConstants.PLEASE_SELECT_STR;
            this.marketList.unshift(m);
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message
          });
    }
  }
  private populateSecurityList(marketId: number) {
    this.loader.show();
    if (!AppUtility.isEmpty(marketId)) {
      this.listingService.getSecurityByExchangeMarket(this.selectedSecurityDailyIndicator.exchangeId, marketId)
        .subscribe(
          restData => {
            this.loader.hide();
            this.securityList = restData;
            var sec: Security = new Security();
            sec.securityId = AppConstants.PLEASE_SELECT_VAL;
            sec.symbol = AppConstants.PLEASE_SELECT_STR;
            this.securityList.unshift(sec);
            this.selectedSecurityDailyIndicator.securityId = this.securityId;

          },
          error => {
            this.loader.show();
            this.errorMessage = <any>error.message
          });
    }
    else
      this.securityList = null;
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      searchExchangeId: [''],
      exchangeId: ['', Validators.compose([Validators.required])],
      marketId: ['', Validators.compose([Validators.required])],
      searchMarketId: [''],
      securityId: ['', Validators.compose([Validators.required])],
      searchSecurityId: [''],
      statsDate: [''],
      openPrice: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      highPrice: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      lowPrice: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      closePrice: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      varValue: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
      hhaRate: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }

}