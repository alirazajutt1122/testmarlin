import { Component, ViewEncapsulation, ViewChild, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';

import { TranslateService } from '@ngx-translate/core';

import { io } from "socket.io-client";
import { BestOrderPriceCombine } from 'app/models/best-order-price-combine';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { AuthService2 } from 'app/services/auth2.service';
import { BestPriceMain } from 'app/models/best-price-main';
import { Exchange } from 'app/models/exchange';
import { Market } from 'app/models/market';
import { environment } from 'environments/environment';


@Component({
  selector: '[best-price]',
  templateUrl: './best-price.html',
  encapsulation: ViewEncapsulation.None,
})

export class BestPrice {
  public myForm: FormGroup;
  isSubmitted: boolean = false;
  exchanges: any[];
  markets: any[];
  exchange: string = '';
  exchangeId: number = 0;
  exchangeCode: string = '';
  marketId: number = 0;
  marketCode: string = '';
  errorMessage: string = '';
  buyData: any[] = [];
  sellData: any[] = [];
  combineData: BestOrderPriceCombine[] = [];
  statsdata: any[] = [];
  tempData: any[] = [];
  securityCode: string = '';
  claims: any;
  lang:any

  socket = io(environment.socketUrl);

  @ViewChild('flexGridBuy',{ static: false }) flexGridBuy: wjcGrid.FlexGrid;
  @ViewChild('flexGridSell',{ static: false }) flexGridSell: wjcGrid.FlexGrid;
  @ViewChild('cmbExchange',{ static: false }) cmbExchange: wjcInput.ComboBox;
  @ViewChild('cmbMarket',{ static: false }) cmbMarket: wjcInput.ComboBox;

  constructor(private appUtility: AppUtility, private listingService: ListingService,
    private _fb: FormBuilder, private orderService: OrderService, private authService: AuthService2,private translate: TranslateService) {
    this.isSubmitted = false;
    this.claims = authService.claims;
    this.authService.socket.on('best_prices', (dataBP) => { this.updateBestPriceData(dataBP); });
     //_______________________________for ngx_translate_________________________________________

     this.lang=localStorage.getItem("lang");
     if(this.lang==null){ this.lang='en'}
     this.translate.use(this.lang)
     //______________________________for ngx_translate__________________________________________
  }

  updateBestPriceData(data) {
    this.clearFields();
    AppUtility.printConsole('Best Price(mine): ' + JSON.stringify(data));
    let resData: BestPriceMain = data;
    AppUtility.printConsole('resultant(mine): ' + resData.symbol);
    if (resData.symbol.toLowerCase() === this.securityCode.toLowerCase()) {
      AppUtility.printConsole('buy(mine): ' + resData.buy_prices.length);
      AppUtility.printConsole('sell(mine): ' + resData.sell_prices.length);
      let loopcounter = 0;
      if (resData.buy_prices.length > resData.sell_prices.length)
        loopcounter = resData.buy_prices.length;
      else
        loopcounter = resData.sell_prices.length;

      for (let k = 0; k < loopcounter; k++) {
        let oBOPCombine = new BestOrderPriceCombine();

        if (k < resData.buy_prices.length) {
          oBOPCombine.count_buy = resData.buy_prices[k].count;
          oBOPCombine.volume_buy = resData.buy_prices[k].volume;
          oBOPCombine.price_buy = resData.buy_prices[k].price;
        }

        if (k < resData.sell_prices.length) {
          oBOPCombine.count_sell = resData.sell_prices[k].count;
          oBOPCombine.volume_sell = resData.sell_prices[k].volume;
          oBOPCombine.price_sell = resData.sell_prices[k].price;
        }

        this.combineData[k] = oBOPCombine;
      }
      AppUtility.printConsole('combine data(mine): ' + JSON.stringify(this.combineData));
      this.statsdata = this.combineData;

      /*  working backup @ 20/Jan/2017 1726 - AiK
      AppUtility.printConsole('buy(mine):  ' + resData.buy_prices.length);
      this.buyData = resData.buy_prices;
      AppUtility.printConsole('sell(mine): ' + resData.sell_prices.length);
      this.sellData = resData.sell_prices;
      */
    }
  }

  ngOnInit() {
    this.addFromValidations();
    this.loadExchanges();
  }

  onExchangeChange(value): void {
    AppUtility.printConsole('selected exchange: ' + value);
    this.exchangeId = value;
    this.exchangeCode = this.cmbExchange.text;
    this.markets = <any>[];
    this.clearFields();
    if (value !== 0) {
      this.loadMarkets(value);
    }
  }

  loadExchanges() {
    this.listingService.getExchangeList()
      .subscribe(restData => {
        if (AppUtility.isValidVariable(restData)) {
          this.exchanges = restData;
          let exchange: Exchange = new Exchange(0, AppConstants.PLEASE_SELECT_STR);
          this.exchanges.unshift(exchange);
          this.exchangeId = this.exchanges[0].exchangeId;
        }
      },
      error => this.errorMessage = <any>error);
  }

  loadMarkets(exchangeId: number) {
    AppUtility.printConsole('in loadMarkets method, selected exchange id is ' + exchangeId);
    this.listingService.getMarketListByExchange(exchangeId)
      .subscribe(resData => {
        if (AppUtility.isValidVariable(resData)) {
          this.markets = resData;
          console.log(resData);
          let mkt: Market = new Market(0, AppConstants.PLEASE_SELECT_STR);
          this.markets.unshift(mkt);
          this.marketId = this.markets[0].marketId;
        }
      },
      error => this.errorMessage = <any>error);
  }

  onSubmit() {
    this.isSubmitted = true;
    AppUtility.printConsole('In onSubmit method');
    this.clearFields();
    this.authService.socket.emit('symbol', this.securityCode);
  }

  clearFields() {
    this.combineData = this.statsdata = this.buyData = this.sellData = [];
  }

  onSymbolFocusOut() {
    this.securityCode = this.securityCode.toUpperCase();
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      exchange: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
      market: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
      securityCode: ['', Validators.compose([Validators.required])],
    });
  }
}
