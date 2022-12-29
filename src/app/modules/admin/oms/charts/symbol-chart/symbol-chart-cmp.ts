import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from 'app/app.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { SecurityTradeChartComponent } from '../security-trade-chart/security-trade-chart';

import * as wjcInput from '@grapecity/wijmo.input';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { Market } from 'app/models/market';
import { TranslateService } from '@ngx-translate/core';



@Component({
    selector: 'symbol-chart',
    templateUrl: 'symbol-chart.html'
})
export class SymbolChartCmp implements OnInit {
    @ViewChild('chart',{ static: false }) chart: SecurityTradeChartComponent;
    @ViewChild('cmbExchange',{ static: false }) cmbExchange: wjcInput.ComboBox;
    @ViewChild('cmbMarket',{ static: false }) cmbMarket: wjcInput.ComboBox;

    public myForm: FormGroup;
    isSubmitted: boolean = false;

    exchanges: any[];
    markets: any[];

    exchangeId: number= 0;
    exchangeCode: string = '';
    marketId: number = 0;
    marketCode: string = '';
    securityCode: string = '';

    errorMsg: string = '';
    isMarketDisabled: boolean = true;
    lang:any

    // --------------------------------------------------------------------------

    constructor(private appState: AppState, private listingSvc: ListingService, private _fb: FormBuilder,private translate: TranslateService)
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
        this.appState.showLoader = true;
        this.listingSvc.getExchangeList().subscribe(
        restData =>
        {
            this.appState.showLoader = false;
            if ( AppUtility.isValidVariable(restData))
            {
                this.exchanges = restData;
                let exchange: Exchange = new Exchange (0, AppConstants.PLEASE_SELECT_STR);
                this.exchanges.unshift(exchange);
                this.exchangeCode = this.exchanges[0].exchangeCode;
            }
        },
        error =>  {
            this.appState.showLoader = false;
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

    // --------------------------------------------------------------------------

    loadMarkets(exchangeId: number)
    {
        this.markets = [];
        this.marketId = 0;
        this.isMarketDisabled = true;

        if ( !AppUtility.isValidVariable(this.exchangeId) && this.exchangeId <= 0 )
            return;

        this.appState.showLoader = true;
        this.listingSvc.getMarketListByExchange(exchangeId).subscribe(
            restData =>
            {
                this.appState.showLoader = false;
                if ( AppUtility.isValidVariable(restData))
                {
                    this.isMarketDisabled = false;
                    this.markets = <any> restData;
                    let market: Market = new Market (0, AppConstants.PLEASE_SELECT_STR);
                    this.markets.unshift(market);
                    this.marketId = this.markets[0].marketId;
                }
            },
            error =>  {
                this.appState.showLoader = false;
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
        this.isSubmitted = true;
        if ( AppUtility.isValidVariable(this.securityCode) && this.securityCode.length > 0 )
        {
            this.chart.security = this.securityCode = this.securityCode.toUpperCase();
        }

        this.chart.exchange = this.exchangeCode = this.cmbExchange.text;
        this.chart.market = this.marketCode = this.cmbMarket.text;

        this.appState.showLoader = true;
        this.chart.refresh(1);
        this.appState.showLoader = false;
    }


}
