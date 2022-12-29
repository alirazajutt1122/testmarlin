import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, Input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { Chart, dispose, init } from "klinecharts";
import { filter, takeUntil } from "rxjs/operators";
import { TradingPortalService } from "../../trading-portal.service";
import { FuseMediaWatcherService } from "../../../../../../@fuse/services/media-watcher";
import { BehaviorSubject, from, Subject } from "rxjs";
import { TradingGraphKline } from "../../trading-portal-types/trading-graph.types";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router"
import { MatDialog } from "@angular/material/dialog";
import { TradingDashboardBuySellComponent } from '../trading-dashboard-buysell/trading-dashboard-buysell.component';
import { AppConstants, AppUtility } from "../../../../../app.utility"
import { TradingDashboardService } from "../trading'dashboard.service"
import { DomSanitizer } from '@angular/platform-browser';
import { upperCase, upperFirst } from 'lodash';
import { UserService } from 'app/core/user/user.service';
import { formatDate } from '@angular/common';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { WebSocketService } from 'app/services/socket/web-socket.service';
import { ShareOrderService } from 'app/modules/admin/oms/order/order.service';
import { NewOrderAll } from 'app/modules/admin/oms/order/new-order-all/new-order-all';

@Component({
    selector: 'trading-dashboard-graph',
    templateUrl: './trading-dashboard-graph.component.html',
    styleUrls: ['../trading-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradingDashboardGraphComponent implements OnInit, AfterViewInit {
    mainTechnicalIndicatorTypes = ['MA', 'EMA', 'SAR'];
    subTechnicalIndicatorTypes = ['VOL', 'MACD', 'KDJ', 'RSI', 'SMA', 'EMA', 'MA', 'BBI', 'BOLL'];
    graphIntervals = ['1m', '5m', '30m', '1H', '6H', '1D', '1W'];

    chartTypes = [
        { key: 'candle_solid', text: 'Candle Solid' },
        { key: 'candle_stroke', text: 'Candle Stroke' },
        { key: 'candle_up_stroke', text: 'Candle Up Stroke' },
        { key: 'candle_down_stroke', text: 'Candle Down Stroke' },
        { key: 'ohlc', text: 'OHLC' },
        { key: 'area', text: 'Area' }
    ];

    shapes = [
        { key: 'priceLine', text: 'Price Line' },
        { key: 'priceChannelLine', text: 'Price Channel Line' },
        { key: 'parallelStraightLine', text: 'Parallel Straight Line' },
        { key: 'fibonacciLine', text: 'Fibonacci Line' },
        { key: 'rect', text: 'Rect' },
        { key: 'circle', text: 'Circle' }
    ];

    view: string;
    interval: string;
    technicalIndicator: string;
    drawingText: string;
    graphData: TradingGraphKline;
    exchangeId: string;
    symbolCode: string;
    marketCode: string;
    @Input() item;
    index: number = 0;
    private kLineChart: Chart;
    private paneId: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    symbolDetail = {
        exchangeCode: "",
        symbolCode: "",
        marketCode: "",
    }
    buyColor: String
    sellColor: String
    buyColorBar: String
    sellColorBar: String
    currentMarketPrice = new BehaviorSubject<String>("");
    change = new BehaviorSubject<number>(0);
    changePercent = new BehaviorSubject<number>(0);
    securityImage = new BehaviorSubject<any>("");
    assetClass = new BehaviorSubject<String>("Not Defined");
    marketStatus = new BehaviorSubject<String>("Unknown");
    symbolBoughtPercent = new BehaviorSubject<String>("0%");
    symbolSoldPercent = new BehaviorSubject<String>("0%");
    symbolBoughtPercentBar = new BehaviorSubject<String>("");
    symbolSoldPercentBar = new BehaviorSubject<String>("");
    buyPercent: String = "30%"
    sellPercent: String = "70%"
    hours: Number = 24
    colorOnChange = new BehaviorSubject<String>("");
    activeColor: any;
    userId: any;

    marketCap: any
    shares = 0
    freeFloat = 0
    freeFloatPer: any
    cashDivident = 0
    bonusShares = 0
    rightShares = 0
    earningPerShare = 0
    financialResultDate: any
    sharedOrderData: any;


    @ViewChild('newOrderAll') newOrderAll : NewOrderAll;


    constructor(
        private tradingPortalService: TradingPortalService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private route: ActivatedRoute,
        private _matDialog: MatDialog,
        private tradingDashBoardService: TradingDashboardService,
        private sanitizer: DomSanitizer,
        private _userService: UserService,
        private dashboardService : DashboardService,
        private router: Router, public socket : WebSocketService,
        public sharedOrderService: ShareOrderService,) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userId = user.id;
    }

    ngOnInit(): void {

        this.view = 'candle_solid';
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if (event) this.settingAllData();
            });
        this.initializeAppConstants()
        this.getOrderDataShared();

    }

    ngAfterViewInit(): void {
        this.kLineChart = init('technical-indicator-k-line');
        this.settingAllData();
        this.symbolDetail.exchangeCode = this.exchangeId
        this.symbolDetail.marketCode = this.marketCode
        this.symbolDetail.symbolCode = this.symbolCode

        this.sharedOrderService.setExchange(this.symbolDetail.exchangeCode);
        this.sharedOrderService.setMarket(this.symbolDetail.marketCode);
        this.sharedOrderService.setSymbol(this.symbolDetail.symbolCode);

        this.socket.fetchFromChannel("best_orders" , {"exchange" :  this.symbolDetail.exchangeCode , "market" :  this.symbolDetail.marketCode  , "symbol" : this.symbolDetail.symbolCode});

    }








 getOrderDataShared=()=>{
    this.dashboardService.getOrderData().subscribe((res:any)=>{
        this.sharedOrderData = res;
        
   })
 }



  showModalForOrder=(side:string)=>{
    this.newOrderAll.show(this.sharedOrderData , side , AppConstants.ASSET_CLASS_EQUITIES);
 }










    settingAllData() {

        if (this.item) {

             this.exchangeId = this.item.exchange;
            this.marketCode = this.item.market;
            this.symbolCode = this.item.symbolCode;
        } else {
            this.exchangeId = this.route.snapshot.params['exchange'];
            this.marketCode = this.route.snapshot.params['marketCode'];
            this.symbolCode = this.route.snapshot.params['symbolCode'];
        }

        this.tradingPortalService.getKlineGraphDataDynamic(this.exchangeId, this.symbolCode, 1000).pipe(
            takeUntil(this._unsubscribeAll)).subscribe((data) => {

                if (this.index === 0) {
                    this.kLineChart.createTechnicalIndicator({ name: 'VOL', calcParams: [] }, false);
                    this.setLanguage();
                    this.setChartType('area');
                }
                this.index++;
                const d = data.reverse();
                this.kLineChart.applyNewData(d);
                this.kLineChart.zoomAtDataIndex(20, 50);
                this.kLineChart.scrollToRealTime(1000);
                this.kLineChart.isZoomEnabled();
                this.kLineChart.setZoomEnabled(true);
            });
        this.symbolDetailService()
        // ..........................................Dummy Profile..........................................
        this.marketCap = this.randomNumber(1000000, 70000000)
        this.marketCap = this.roundDownSignificantDigits(this.marketCap, 4)
        this.marketCap = this.numberWithCommas(this.marketCap)

        this.shares = this.randomNumber(100, 100000)
        this.shares = this.roundDownSignificantDigits(this.shares, 0)
        this.shares = this.numberWithCommas(this.shares)

        this.freeFloatPer = this.randomNumber(0, 100)
        this.freeFloatPer = this.roundDownSignificantDigits(this.freeFloatPer, 3) + '%'

        this.freeFloat = this.randomNumber(100000, 10000000)
        this.freeFloat = this.roundDownSignificantDigits(this.freeFloat, 0)
        this.freeFloat = this.numberWithCommas(this.freeFloat)

        this.cashDivident = this.randomNumber(764434, 7644345)
        this.cashDivident = this.roundDownSignificantDigits(this.cashDivident, 0)
        this.cashDivident = this.numberWithCommas(this.cashDivident)

        this.bonusShares = this.randomNumber(100, 1000)
        this.bonusShares = this.roundDownSignificantDigits(this.bonusShares, 0)
        this.bonusShares = this.numberWithCommas(this.bonusShares)

        this.rightShares = this.randomNumber(100, 200)
        this.rightShares = this.roundDownSignificantDigits(this.rightShares, 0)
        this.rightShares = this.numberWithCommas(this.rightShares)

        this.earningPerShare = this.randomNumber(0, 80)
        this.earningPerShare = this.roundDownSignificantDigits(this.earningPerShare, 0)
        this.earningPerShare = this.numberWithCommas(this.earningPerShare)

        this.financialResultDate = this.randomDate(new Date(2022, 0, 1), new Date())
        this.financialResultDate = formatDate(this.financialResultDate, 'yyyy-MM-dd', 'en-US')

    }

    setLanguage() {
        this.kLineChart.setStyleOptions({
            candle: {
                tooltip: {
                    labels: ['Tenure: ', 'Open: ', 'Close: ', 'High: ', 'Low: ', 'Volume: ']
                }
            }
        });
    }

    initializeAppConstants() {
        this.buyColor = AppConstants.buyColor
        this.sellColor = AppConstants.sellColor
        this.buyColorBar = AppConstants.buyColor
        this.sellColorBar = AppConstants.sellColor
    }

    symbolDetailService() {
        this.tradingDashBoardService.getSecurityStats(this.exchangeId, this.symbolCode).subscribe((res) => {
            let currentPrice = res[0].currentPrice
            let change = Number(res[0].change)
            let changePer = change / currentPrice * 100
            changePer = this.roundDownSignificantDigits(changePer, 4)

            if (change < 0) {
                this.colorOnChange.next(AppConstants.sellColor)
            }
            else if (change > 0) {
                this.colorOnChange.next(AppConstants.buyColor)
            }
            else this.colorOnChange.next("#FFFFFF")


            this.currentMarketPrice.next(currentPrice);
            this.change.next(change);
            this.changePercent.next(changePer)
        })

        this.tradingDashBoardService.getSecurityImage(this.exchangeId, this.symbolCode).subscribe((res) => {


            let img;
            if(AppUtility.isValidVariable(res.securityStatsDTO))
            {
                img = (res.securityStatsDTO.imgUrl == null) ? 'assets/img/settlement.png' : res.securityStatsDTO.imgUrl;
            }
            if(!AppUtility.isValidVariable(res.securityStatsDTO))
            {
                img = 'assets/img/settlement.png';
            }

            let assetCls = res.assetClass.assetName
            this.assetClass.next(assetCls)
            this.securityImage.next(img)
        })

        this.tradingDashBoardService.getMarketStatus(this.exchangeId, this.marketCode).subscribe((res) => {

            let Status = res.marketState.desc
            this.marketStatus.next(this.convertFirstLetterToUpperCase(Status))

            if (Status == "Market is open") {
                this.activeColor = AppConstants.buyColor
            }
            else this.activeColor = AppConstants.sellColor
        })

        this.getBuySellPercetage(this.exchangeId, this.symbolCode, this.hours)

    }

    getBuySellPercetage(exchangeId, symbolCode, hours) {
        this.tradingDashBoardService.getBuySellPercentage(exchangeId, symbolCode, hours).subscribe((res) => {
            let bought = 0
            let sold = 0
            let Total = res.length
            if (Total == 0) {
                this.symbolBoughtPercentBar.next("100%")
                this.symbolSoldPercentBar.next("0%")
                this.symbolBoughtPercent.next("0%")
                this.symbolSoldPercent.next("0%")
                this.buyColorBar = "#808080"
            }
            else {
                res?.forEach(element => {
                    if (element.buySell == "B") {
                        bought += 1
                    }
                    else if (element.buySell == "S") {
                        sold += 1
                    }
                });
                this.buyColorBar = AppConstants.buyColor
                let boughtPercent = bought / Total * 100
                boughtPercent = this.roundDownSignificantDigits(boughtPercent, 2)
                this.buyPercent = boughtPercent.toString() + "%"

                let soldPercent = sold / Total * 100
                soldPercent = this.roundDownSignificantDigits(soldPercent, 2)
                this.sellPercent = soldPercent.toString() + "%"

                this.symbolBoughtPercent.next(this.buyPercent)
                this.symbolSoldPercent.next(this.sellPercent)
                this.symbolBoughtPercentBar.next(this.buyPercent)
                this.symbolSoldPercentBar.next(this.sellPercent)
            }
        })

    }

    convertFirstLetterToUpperCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    setShapeType(shapeName: string) {
        this.drawingText = shapeName;
        this.kLineChart.createShape(shapeName);
    }

    removeAllShape() {
        this.kLineChart.removeShape();
    }

    setCandleTechnicalIndicator(type) {
        this.kLineChart.createTechnicalIndicator(type, false, { id: 'candle_pane' });
    }

    setSubTechnicalIndicator(type) {
        this.technicalIndicator = type;
        this.kLineChart.createTechnicalIndicator(type, false, { id: this.paneId, height: 40 });
    }

    setChartType(type) {
        this.view = type;
        this.kLineChart.setStyleOptions({
            candle: {
                type
            }
        });
        this._changeDetectorRef.detectChanges();
    }

    setIntervalsGraph(interval) {
        this.interval = interval;
    }

    ngOnDestroy(): void {
        dispose('technical-indicator-k-line')
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    buySellDialogue(buySell: any) {
        this._matDialog.open(TradingDashboardBuySellComponent, {
            autoFocus: false,
            position: { top: '8%' },
            width: "400px",
            data: {
                action: buySell,
                symbolDetail: this.symbolDetail,
                symbolCode: this.symbolCode,
                marketCode: this.marketCode,
                exchangeCode: this.exchangeId,
                price: this.currentMarketPrice.value

            },

        }).afterClosed().subscribe((data) => {
            setTimeout(() => {
                this.getBuySellPercetage(this.exchangeId, this.symbolCode, this.hours)
            }, 1000);

        })
    }

    randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    roundDownSignificantDigits(number, decimals) {
        let significantDigits = (parseInt(number.toExponential().split('e-')[1])) || 0;
        let decimalsUpdated = (decimals || 0) + significantDigits - 1;
        decimals = Math.min(decimalsUpdated, number.toString().length);

        return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
    }

}
