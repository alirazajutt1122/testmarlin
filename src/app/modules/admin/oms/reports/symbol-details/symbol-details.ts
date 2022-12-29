import { Component, ViewEncapsulation, ViewChild, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen/loader-screen.service';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { BestMarket } from 'app/models/best-market';
import { Exchange } from 'app/models/exchange';
import { Market } from 'app/models/market';
import { SecurityMarketDetails } from 'app/models/security-market-details';
import { Symbol } from 'app/models/symbol';
import { SymbolDetail } from 'app/models/symbol-detail';
import { SymbolStats } from 'app/models/symbol-stats';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';



@Component({
  selector: 'symbol-details',
  templateUrl: './symbol-details.html',

  encapsulation: ViewEncapsulation.None,
})

export class SymbolDetails {

  public myForm: FormGroup;
  public isSubmitted: boolean;

  symbol: Symbol;
  symbolDetail: SymbolDetail;
  symbolStats: SymbolStats;
  bestMarket: BestMarket;

  exchanges: any[];
  markets: any[];
  symbols: any[];
  cmbItem: Object;
  exchange: string = '';
  market: string = '';

  exchangeId: number = 0;
  marketId: number = 0;
  exchangeCode: string = '';
  marketCode: string = '';
  securityCode: string = '';

  errorMessage: string = '';
  securityMarketDetails: SecurityMarketDetails;

  isMarketDisabled: boolean = true;
  isBondMarket: boolean = false;
  lang:any

  @ViewChild('cmbExchange',{ static: false }) cmbExchange: wjcInput.ComboBox;
  @ViewChild('cmbMarket',{ static: false }) cmbMarket: wjcInput.ComboBox;
    errorMsg: any;

  constructor(private appState: AppState, public authService: AuthService, private dataService: DataServiceOMS, private orderService: OrderService, private listingSvc: ListingService,
    private listingService: ListingService, private _fb: FormBuilder,private translate: TranslateService, private splash: FuseLoaderScreenService,) {

    this.isSubmitted = false;
    this.securityMarketDetails = new SecurityMarketDetails();
    this.clearFields();

    // Best Market Data Handling
    this.authService.socket.on('best_market', (dataBM) => { this.updateBestMarketData(dataBM); });
    // Symbol Stats Data Handling
    this.authService.socket.on('symbol_stat', (dataSS) => { this.updateSymbolStatsData(dataSS); });
    // Announcement update
    this.authService.socket.on('announcement', (dataAnn) => { this.updateAnnouncement(dataAnn); });
        //_______________________________for ngx_translate_________________________________________

        this.lang=localStorage.getItem("lang");
        if(this.lang==null){ this.lang='en'}
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
  }

  ngOnInit() {

    // Add form Validations
    this.addFromValidations();
    // Getting Exchanges
    this.loadExchanges();

  }

  updateAnnouncement(data) {

    this.symbolDetail.announcement.message = data;
  }

  updateBestMarketData(data) {

    this.bestMarket.updateBestMarketData(data);
  }
  updateSymbolStatsData(data) {



    if (this.symbolDetail.code === data.symbol) {
      this.symbolStats.updateSymbolStats(data);
    }
  }
  onExchangeChange(value): void {
    AppUtility.printConsole('selected exchange: ' + value);
    this.exchangeId = value;
    this.marketId = 0;
    this.loadMarkets(value);
  }
  loadExchanges() {
    this.splash.show();
    this.listingService.getExchangeList()
      .subscribe(restData => {

        if (AppUtility.isValidVariable(restData)) {
          this.exchanges = restData;
          var exchange: Exchange = new Exchange(0, AppConstants.PLEASE_SELECT_STR);
          this.exchanges.unshift(exchange);
          this.exchangeId = (AppConstants.exchangeId === null) ? this.exchanges[0].exchangeId : AppConstants.exchangeId;
        }
      },
        error => {
        this.splash.hide();
          this.errorMessage = <any>error;
        });
  }

  loadMarkets(exchangeId: number) {
    this.markets = [];
    this.marketId = 0;
    this.isMarketDisabled = true;
    if (this.exchangeId > 0) {
     this.splash.show();
      this.listingService.getMarketListByExchange(exchangeId)
        //.map(res => AppUtility.printConsole(res))
        .subscribe(restData => {
            this.splash.hide();
          if (AppUtility.isValidVariable(restData)) {
            // AppUtility.printConsole("Response: "+ restData);
            this.isMarketDisabled = false;
            this.updateMarketData(restData);
          }
        },
          error => {   this.splash.hide(); this.errorMessage = <any>error });
    }
  }



public getSecurityMarket = (event) => {
  this.marketId = event;
  this.getExchangeMarketSecuritiesList(this.exchangeId , this.marketId);
}




  updateMarketData(markets) {
    this.markets = [];
    this.marketId = 0;
    let a = 0;
    for (let i = 0; i < markets.length; i++) {
      if ((markets[i].marketType.description !== AppConstants.MARKET_TYPE_BOND)) {
        this.markets[a] = markets[i];
        a++;
      }
    }
    if (this.markets.length > 0) {
    //  let market: Market = new Market(0, AppConstants.PLEASE_SELECT_STR);
    //   this.markets.unshift(market);
       this.marketId = this.markets[0].marketId;
      this.getExchangeMarketSecuritiesList(this.exchangeId , this.marketId);
    }
  }




  getExchangeMarketSecuritiesList(exchangeId , marketId) {
    this.listingSvc.getExchangeMarketSecuritiesList(exchangeId, marketId).subscribe(
        data => {
            this.splash.hide();
            if (data == null){  return; }
            this.symbols = data;
            let symbol : Symbol = new Symbol(AppConstants.PLEASE_SELECT_VAL , AppConstants.PLEASE_SELECT_STR)
            this.symbols.unshift(symbol);
            this.securityCode = this.symbols[0].symbol;

        },
        error => {
            this.splash.hide();
            this.errorMsg = <any>error;
        });
}




  getMarketType(marketId): string {
    let marketType: string = '';
    let market: Market;
    if (AppUtility.isValidVariable(this.markets)) {
      for (let i = 0; i < this.markets.length; i++) {
        market = <Market>this.markets[i];
        if (market.marketId === marketId) {
          marketType = market.marketType.description.toString();
          break;
        }
      }
    }
    return marketType;
  }
  onSymbolFocusOut() {
    this.securityCode = this.securityCode.toUpperCase();
  }
  onSubmit(model: any, isValid: boolean) {
    // Get symbol stats
    this.clearFields();

    this.isSubmitted = true;
    if (isValid) {
      this.symbolDetail = new SymbolDetail();
      this.symbolStats = new SymbolStats();
      this.bestMarket = new BestMarket();

      this.exchangeCode = this.cmbExchange.text;
      this.marketCode = this.cmbMarket.text;
      this.securityCode = this.securityCode.toUpperCase();

      this.authService.socket.emit('symbol_sub', { 'exchange': this.exchangeCode, 'market': this.marketCode, 'symbol': this.securityCode });

      if (this.exchangeId > 0 && this.marketId > 0 && this.securityCode.trim().length > 0) {
        this.splash.show();
        this.orderService.getBestMarketAndSymbolStats(this.exchangeCode, this.marketCode, this.securityCode)
          .subscribe(data => {
            this.splash.hide();
            if (AppUtility.isValidVariable(data)) {

              //AppUtility.printConsole("Data Received: "+ data);
              this.updateSymbolDetails(data);

            }
          },
            error => {  this.splash.hide(); this.errorMessage = <any>error });

        // Get bond details
        if (this.getMarketType(this.marketId) === AppConstants.MARKET_TYPE_BOND) {
          this.getBondDetails();
          this.isBondMarket = true;
        } else {
          this.isBondMarket = false;
        }

      }
    }
  }

  getBondDetails() {
    this.securityMarketDetails = new SecurityMarketDetails();
    let securityId: number = this.dataService.getSecurityId(this.exchangeId, this.marketId, this.securityCode);

    this.splash.show();
    this.listingService.getSymbolMarket(this.exchangeId, this.marketId, securityId)
      .subscribe(data => {
        this.splash.hide();
        if (AppUtility.isValidVariable(data)) {

          this.updateSecurityDetails(data);
          //this.updateSymbolDetails(data);

        }
      },
        error => {
            this.splash.hide();
          this.errorMessage = <any>error;
        });

  }
  updateSecurityDetails(data) {
    this.securityMarketDetails.updateSecurityMarketData(data);
  }

  print(): void {
    window.print();
  };

  updateSymbolDetails(data) {
    if (AppUtility.isValidVariable(data.symbol_summary.symbol)) {
      this.symbolDetail.setDetails(data.symbol_summary.symbol);
    }
    if (AppUtility.isValidVariable(data.best_market)) {
      this.bestMarket.updateBestMarketData(data.best_market);
    }
    if (AppUtility.isValidVariable(data.symbol_summary.stats)) {
      this.symbolStats.updateSymbolStats(data.symbol_summary.stats);
    }
    AppUtility.printConsole(this.symbolStats);
  }

  clearFields() {
    this.symbol = new Symbol();
    this.symbolDetail = new SymbolDetail();
    this.symbolStats = new SymbolStats();
    this.bestMarket = new BestMarket();
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
      marketId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
      securityCode: ['', Validators.compose([Validators.required])],

    });
  }

}
