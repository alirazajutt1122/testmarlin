

import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen/loader-screen.service';

import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { Market } from 'app/models/market';
import { Symbol } from 'app/models/symbol';
import { TradingDashboardGraphComponent } from 'app/modules/admin/trading-portal/trading-dashboard/trading-dashboard-graph/trading-dashboard-graph.component';
import { ListingService } from 'app/services-oms/listing-oms.service';





////////////////////////////////////////////////////////////////

@Component({
    selector: 'security-chart-all',
    templateUrl: './security-chart-all.html'
})
export class SecurityChartAll implements OnInit{

    @ViewChild('chart',{ static: false }) securityChart : TradingDashboardGraphComponent;
    @ViewChild('cmbExchange',{ static: false }) cmbExchange: wjcInput.ComboBox;
    @ViewChild('cmbMarket',{ static: false }) cmbMarket: wjcInput.ComboBox;

    public myForm: FormGroup;
    isSubmitted: boolean = false;

    exchanges: any[];
    markets: any[];
    symbols : any[];

    exchangeId: number= 0;
    exchangeCode: string = '';
    marketId: number = 0;
    marketCode: string = '';
    securityCode: string = '';

    errorMsg: string = '';
    isMarketDisabled: boolean = true;
    lang:any
    symbol: string = '';
    item: { exchange: string; market: string; symbolCode: string; };

    // --------------------------------------------------------------------------

    constructor(private appState: AppState, private listingSvc: ListingService, private _fb: FormBuilder,
        private translate: TranslateService, private splash: FuseLoaderScreenService,  )
    {
    //_______________________________for ngx_translate_________________________________________

    this.lang=localStorage.getItem("lang");
    if(this.lang==null){ this.lang='en'}
    this.translate.use(this.lang)
    //______________________________for ngx_translate__________________________________________
    }

    // --------------------------------------------------------------------------

    ngOnInit()
    {
        this.myForm = this._fb.group(
        {
            exchangeId: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
            marketId: ['', Validators.compose([Validators.required,  Validators.pattern(AppConstants.validatePatternNonZeroNumeric)])],
            securityCode: ['', Validators.compose([Validators.required])],
        });

        this.loadExchanges();
    }

    // --------------------------------------------------------------------------

    loadExchanges(){
       this.splash.show();
        this.listingSvc.getExchangeList().subscribe(
        restData =>
        {
            this.splash.hide();
            if ( AppUtility.isValidVariable(restData))
            {
                this.exchanges = restData;
                let exchange: Exchange = new Exchange (0, AppConstants.PLEASE_SELECT_STR);
                this.exchanges.unshift(exchange);
                this.exchangeId = (AppConstants.exchangeId === null) ? this.exchanges[0].exchangeId : AppConstants.exchangeId;
            }
        },
        error =>  {
            this.splash.hide();
            this.errorMsg = <any>error;
        });
    }

    // --------------------------------------------------------------------------

    onExchangeChange(value): void
    {
        this.exchangeId = value;
        this.marketId  = 0 ;
        this.loadMarkets(value);
    }


    onMarketChange(value): void
    {
        this.marketId = value;
        this.securityCode  = "" ;
        this.getExchangeMarketSecuritiesList(this.exchangeId , this.marketId);
    }


    // --------------------------------------------------------------------------

    loadMarkets(exchangeId: number)
    {
        this.markets = [];
        this.marketId = 0;
        this.isMarketDisabled = true;

        if ( !AppUtility.isValidVariable(this.exchangeId) && this.exchangeId <= 0 )
            return;

            this.splash.show();
        this.listingSvc.getMarketListByExchange(exchangeId).subscribe(
            restData =>
            {
                this.splash.hide();
                if ( AppUtility.isValidVariable(restData))
                {
                    this.isMarketDisabled = false;
                    this.markets = <any> restData;
                    // let market: Market = new Market (0, AppConstants.PLEASE_SELECT_STR);
                    // this.markets.unshift(market);
                    this.marketId = this.markets[0].marketId;
                    this.getExchangeMarketSecuritiesList(this.exchangeId , this.marketId);
                }
            },
            error =>  {
                this.splash.hide();
                this.errorMsg = <any>error;
            });
    }



    getExchangeMarketSecuritiesList(exchangeId , marketId) {
        this.listingSvc.getExchangeMarketSecuritiesList(exchangeId, marketId).subscribe(
            data => {
                this.splash.hide();
                if (data == null){  return; }
                this.symbols = data;
                this.symbol = this.symbols[0].symbol;

            },
            error => {
                this.splash.hide();
                this.errorMsg = <any>error;
            });
    }

    // --------------------------------------------------------------------------

    onSymbolFocusOut()
    {
        if ( AppUtility.isValidVariable(this.securityCode))
        {
            this.securityCode = this.securityCode.toUpperCase();
        }
    }

    // --------------------------------------------------------------------------

    onSubmit(model: any, isValid: boolean)
    {
        this.splash.show();
        this.isSubmitted = true;
        this.item = {"exchange" : this.cmbExchange.text , "market" : this.cmbMarket.text , "symbolCode" : this.securityCode};
       this.securityChart.settingAllData();
        this.securityChart.initializeAppConstants();
        this.splash.hide();

        // this.isSubmitted = true;
        // if ( AppUtility.isValidVariable(this.securityCode) && this.securityCode.length > 0 )
        // {
        //     this.chart.security = this.securityCode = this.securityCode.toUpperCase();
        // }

        // this.chart.exchange = this.exchangeCode = this.cmbExchange.text;
        // this.chart.market = this.marketCode = this.cmbMarket.text;

        // this.appState.showLoader = true;
        // this.chart.refresh(1);
        // this.appState.showLoader = false;
    }

}
