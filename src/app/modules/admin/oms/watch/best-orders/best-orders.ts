import { Component, ViewEncapsulation, ViewChild, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';
import { BestOrderPriceCombine } from 'app/models/best-order-price-combine';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { AuthService2 } from 'app/services/auth2.service';
import { TranslateService } from '@ngx-translate/core';
import { BestOrderMain } from 'app/models/best-order-main';
import { Exchange } from 'app/models/exchange';
import { Market } from 'app/models/market';


@Component({
  selector: '[best-orders]',
  templateUrl: './best-orders.html',
  encapsulation: ViewEncapsulation.None,
})

export class BestOrders {
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
  securityCode: string = '';
  totalBuy: number = 0;
  totalSell: number = 0;
  claims: any;
  lang:any

  @ViewChild('flexGridBuy',{ static: false }) flexGridBuy: wjcGrid.FlexGrid;
  @ViewChild('flexGridSell',{ static: false }) flexGridSell: wjcGrid.FlexGrid;
  @ViewChild('cmbExchange',{ static: false }) cmbExchange: wjcInput.ComboBox;
  @ViewChild('cmbMarket',{ static: false }) cmbMarket: wjcInput.ComboBox;

  constructor(private appUtility: AppUtility, private listingService: ListingService,
    private _fb: FormBuilder, private orderService: OrderService, private authService: AuthService2,private translate: TranslateService) {
    this.isSubmitted = false;
    this.claims = authService.claims;

    this.authService.socket.on('best_orders', (dataBO) => { this.updateBestOrdersData(dataBO); });
    // this.socket.emit('symbol', this.securityCode);
        //_______________________________for ngx_translate_________________________________________

        this.lang=localStorage.getItem("lang");
        if(this.lang==null){ this.lang='en'}
        this.translate.use(this.lang)
        //______________________________for ngx_translate__________________________________________
  }

  updateBestOrdersData(data) {
    this.clearFields();
    AppUtility.printConsole('Best Orders(mine): ' + JSON.stringify(data));
    let resData: BestOrderMain = data;
    AppUtility.printConsole('resultant(mine): ' + resData.symbol);
    if (resData.symbol.toLowerCase() === this.securityCode.toLowerCase()) {
      AppUtility.printConsole('buy(mine): ' + resData.buy_orders.length);
      AppUtility.printConsole('sell(mine): ' + resData.sell_orders.length);
      let loopcounter = 0;
      if (resData.buy_orders.length > resData.sell_orders.length)
        loopcounter = resData.buy_orders.length;
      else
        loopcounter = resData.sell_orders.length;

      for (let k = 0; k < loopcounter; k++) {
        let oBOPCombine = new BestOrderPriceCombine();

        if (k < resData.buy_orders.length) {
          oBOPCombine.volume_buy = resData.buy_orders[k].volume;
          oBOPCombine.price_buy = resData.buy_orders[k].price;
          this.totalBuy += resData.buy_orders[k].volume;
        }

        if (k < resData.sell_orders.length) {
          oBOPCombine.volume_sell = resData.sell_orders[k].volume;
          oBOPCombine.price_sell = resData.sell_orders[k].price;
          this.totalSell += resData.sell_orders[k].volume;
        }

        this.combineData[k] = oBOPCombine;
      }
      AppUtility.printConsole('combine data(mine): ' + JSON.stringify(this.combineData));
      this.statsdata = this.combineData;

      /*  working backup @ 20/Jan/2017 1520 - AiK
      AppUtility.printConsole('buy(mine): ' + resData.buy_orders.length);
      if (resData.buy_orders.length > 0) {
        for (let i = 0; i < resData.buy_orders.length; i++) {
          this.totalBuy += resData.buy_orders[i].volume;
        }
        this.buyData = resData.buy_orders;
      }
      AppUtility.printConsole('sell(mine): ' + resData.sell_orders.length);
      if (resData.sell_orders.length > 0) {
        for (let i = 0; i < resData.sell_orders.length; i++) {
          this.totalSell += resData.sell_orders[i].volume;
        }
        this.sellData = resData.sell_orders;
      }
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

  clearFields() {
    this.combineData = this.statsdata = this.buyData = this.sellData = [];
    this.totalBuy = this.totalSell = 0;
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
