import { Component, ViewEncapsulation, ViewChild, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';

import { TranslateService } from '@ngx-translate/core';

import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { Exchange } from 'app/models/exchange';
import { Market } from 'app/models/market';
import { MarkSumm } from 'app/models/mark-summ';
import { DialogCmpWatch } from '../../dialog-component';
import { AuthService2 } from 'app/services/auth2.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen/splash-screen.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen/loader-screen.service';




@Component({
  selector: '[market-summary]',
  templateUrl: './market-summary.html',
  encapsulation: ViewEncapsulation.None,
})

export class MarketSummary {
  public myForm: FormGroup;
  isSubmitted: boolean = false;
  exchanges: any[];
  markets: any[];
  selectedMarket: any[];
  exchangeData: any[];
  exchange: string = '';
  exchangeId: number = 0;
  exchangeCode: string = '';
  marketId: number = 0;
  marketCode: string = '';
  errorMessage: string = '';
  msdata: any[] = [];
  claims: any;
  lang:any

  @ViewChild('flexGrid',{ static: false }) flexGrid: wjcGrid.FlexGrid;
  @ViewChild('cmbExchange',{ static: true }) cmbExchange: wjcInput.ComboBox;
  @ViewChild('cmbMarket',{ static: false }) cmbMarket: wjcInput.ComboBox;
  @ViewChild('dialogCmp',{ static: false }) dialogCmp: DialogCmpWatch;

  constructor(private appState: AppState,   private listingService: ListingService,
    private _fb: FormBuilder, private orderService: OrderService, private authService: AuthService2, private translate: TranslateService , private splash: FuseLoaderScreenService,) {
    this.isSubmitted = false;
    this.claims = authService.claims;


        //_______________________________for ngx_translate_________________________________________

        this.lang=localStorage.getItem("lang");
        if(this.lang==null){ this.lang='en'}
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
  }

  ngOnInit() {
    this.addFromValidations();
    this.loadExchanges();

  }

  onExchangeChange(value): void {

    this.exchangeId = value;
    this.exchangeCode = this.cmbExchange.getDisplayText(this.cmbExchange.selectedIndex);
    this.markets = <any>[];
    this.msdata = [];
    if (value !== 0) {
      this.loadMarkets(value);
    }
  }

  loadExchanges() {
    this.splash.show();
    this.listingService.getExchangeList()
      .subscribe(restData => {
        this.splash.hide();
        if (AppUtility.isValidVariable(restData)) {
          this.exchanges = restData;
          let exchange: Exchange = new Exchange(0, AppConstants.PLEASE_SELECT_STR);
           this.exchanges.unshift(exchange);
        this.exchangeId = (AppConstants.exchangeId === null) ? this.exchanges[0].exchangeId : AppConstants.exchangeId;
        }
      },
        error => {
            this.splash.hide();
          this.errorMessage = <any>error
        });
  }

  loadMarkets(exchangeId: number) {

    this.splash.show();
    this.listingService.getMarketListByExchange(exchangeId)
      .subscribe(resData => {
        this.splash.hide();
        if (AppUtility.isValidVariable(resData)) {
          this.markets = resData;

          if(this.markets.length < 0)
          {
           console.log(resData);
          let mkt: Market = new Market(0, AppConstants.PLEASE_SELECT_STR);
          this.markets.unshift(mkt);
          }


          this.marketId = this.markets[0].marketId;
        }
      },
        error => {
            this.splash.hide();
          this.errorMessage = <any>error
        });
  }

  onSubmit(model: any, isValid: boolean) {

    this.marketCode = this.cmbMarket.text;
    this.getMarketByMarketCode(this.marketCode);
    this.getMarketSummary(this.exchangeCode, this.marketCode);
    this.getExchangeData(this.exchangeCode);

    /*  comment for testing
  this.isSubmitted = true;
  if (isValid) {
    this.marketCode = this.cmbMarket.text;
    this.getMarketSummary(this.exchange, this.marketCode);
  }
  */
  }

  getMarketSummary(eC: string, mC: string) {
    this.splash.show();
    AppUtility.printConsole('in getMarketSummary method, Exchange Code: ' + eC + ', Market Code: ' + mC);
    this.msdata = [];
    this.orderService.getMarketSummary(eC, mC).subscribe(resdata => {
        this.splash.hide();
      AppUtility.printConsole('resdata: ' + resdata);
      let tempData: any = resdata;
      AppUtility.printConsole('tempdata: ' + tempData);
      if (tempData != null && tempData.length > 0)
        this.formatResultData(tempData);
      else {
        this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
        this.dialogCmp.showAlartDialog('Error');
      }
    },
      error => {
        this.splash.hide();
        this.errorMessage = error;
        this.dialogCmp.statusMsg = this.errorMessage;
        this.dialogCmp.showAlartDialog('Error');
      }
    );
  }

  private formatResultData(_msData) {
    AppUtility.printConsole('length of array: ' + _msData.length);
    let oMarketSummary: MarkSumm[] = [];
    for (let i = 0; i < _msData.length; i++) {
      let objTemp: MarkSumm = new MarkSumm();
      objTemp.security = String(_msData[i].stats.symbol);
      objTemp.quantity = Number(_msData[i].stats.total_size_traded);
      objTemp.value = Number(_msData[i].stats.total_value_traded);
      objTemp.previousclose = Number(_msData[i].stats.last_day_close_price);
      objTemp.high = Number(_msData[i].stats.high);
      objTemp.low = Number(_msData[i].stats.low);
      objTemp.open = Number(_msData[i].stats.open);
      objTemp.close = Number(_msData[i].stats.close);
      objTemp.average = Number(_msData[i].stats.average_price);
      objTemp.trades = Number(_msData[i].stats.total_no_of_trades);
      oMarketSummary[i] = objTemp;
    }
    // this.itemsList = new wjcCore.CollectionView(oMarketSummary);
    this.msdata = oMarketSummary;
    // this.initGrid(this.flexGrid);
    // this.itemsList.groupDescriptions.clear();
    // if (oMarketSummary.length > 0)
    //   this.CalculateTotals(oMarketSummary);
  }

  private CalculateTotals(_ArrMS: MarkSumm[]) {
    let sVol: number = 0;
    let sVal: number = 0;
    let sTra: number = 0;
    for (let i = 0; i < _ArrMS.length; i++) {
      sVol += _ArrMS[i].quantity;
      sVal += _ArrMS[i].value;
      sTra += _ArrMS[i].trades;
    }
    let objTemp: MarkSumm = new MarkSumm();
    objTemp.security = 'Total';
    objTemp.quantity = sVol;
    objTemp.value = sVal;
    objTemp.trades = sTra;
    _ArrMS[_ArrMS.length] = objTemp;

    this.msdata = _ArrMS;
  }

  // add a footer row to the grid
  public initGrid(s: wjcGrid.FlexGrid) {
    AppUtility.printConsole('initGrid called');
    // create a GroupRow to show aggregates automatically
    let row = new wjcGrid.GroupRow();
    // add the new GroupRow to the grid's 'columnFooters' panel
    s.columnFooters.rows.push(row);
    // add a sigma to the header to show that this is a summary row
    s.bottomLeftCells.setCellData(0, 0, '\u03A3');
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      exchange: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
      market: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
    });
  }

  public getNotification(btnClicked) {
  }

  public getExchangeData(exchangeCode: string) {
    this.splash.show();
    var colPreviousclose = this.flexGrid.columns.getColumn('previousclose');
    var colHigh = this.flexGrid.columns.getColumn('high');
    var colLow = this.flexGrid.columns.getColumn('low');
    var colOpen = this.flexGrid.columns.getColumn('open');
    var colClose = this.flexGrid.columns.getColumn('close');
    var colAverage = this.flexGrid.columns.getColumn('average');

    this.listingService.getExchangeByExchangeCode(exchangeCode)
      .subscribe(restData => {
        this.splash.hide();
        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
          this.exchangeData = restData;
          setTimeout(() => { }, 250);

          if (this.exchangeData["bondPricingMechanism"] == 2 && this.selectedMarket[0].marketType.description == AppConstants.MARKET_TYPE_BOND) {
            colPreviousclose.header = 'Previous Close %';
            colClose.header = 'Close %';
            colOpen.header = 'Open %';
            colAverage.header = 'Average %';
            colHigh.header = 'High %';
            colLow.header = 'Low %';
          }
          else {
            colPreviousclose.header = 'Previous Close';
            colClose.header = 'Close';
            colOpen.header = 'Open';
            colAverage.header = 'Average';
            colHigh.header = 'High';
            colLow.header = 'Low';
          }
        } else {
          this.exchangeData = [];
          colPreviousclose.header = 'Previous Close';
          colClose.header = 'Close';
          colOpen.header = 'Open';
          colAverage.header = 'Average';
          colHigh.header = 'High';
          colLow.header = 'Low';
        }
      },
        error => {  this.splash.hide(); this.errorMessage = <any>error });
  }

  public getMarketByMarketCode(marketCode: string) {
    this.splash.show();
    this.selectedMarket = [];
    this.listingService.getMarketByMarketCode(marketCode)
      .subscribe(restData => {
        this.splash.hide();
        if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
          this.selectedMarket = restData;
        } else {
          this.selectedMarket = [];
        }
      },
        error => {  this.splash.hide(); this.errorMessage = <any>error });
  }
}
