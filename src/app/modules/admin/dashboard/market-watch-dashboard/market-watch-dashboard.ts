import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ApexOptions } from "ng-apexcharts";
import { ActivatedRoute, Router } from "@angular/router";

import { DomSanitizer } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
// import { WebSocketService } from "../../../services/socket/web-socket.service";

import { TranslocoService } from '@ngneat/transloco';
import { isInteger } from 'lodash';
import { UserService } from 'app/core/user/user.service';

import { TradingDashboardBuySellComponent } from 'app/modules/admin/trading-portal/trading-dashboard/trading-dashboard-buysell/trading-dashboard-buysell.component';
import { MatDialog } from "@angular/material/dialog";
import { FuseLoaderScreenService } from '@fuse/services/splash-screen/loader-screen.service';

import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';
import { WebSocketService } from 'app/services/socket/web-socket.service';
import { AppConstants, AssetClass } from 'app/app.utility';
import { AppState } from 'app/app.service';
import { NewOrderAll } from '../../oms/order/new-order-all/new-order-all';
import { OrderNewNav } from '../../oms/order/order-new/order-new-nav';
import { DashboardService } from '../dashboard.service';
import { SymbolAddDialogComponentService } from 'app/modules/common-components/symbol-add-dialog/symbol-add-dialog.component.service';


@Component({
    selector: 'market-watch-dashboard',
    templateUrl: './market-watch-dashboard.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MarketWatchDashboardCmp implements OnInit, OnDestroy {

    @Input() dashboard: boolean;
    @Output() outPutProp = new EventEmitter<any>();
    showAlert: boolean = false;
    public loadComponent: boolean = false;

    public orderNew: OrderNewNav;

    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    equitiesTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    bondsTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    etfTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    cryptoTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    commoditiesTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    realestateTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    favouritesTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();

    watchlistChartOptions: ApexOptions = {};
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    recentTransactionsTableColumns: string[] = ['Name', 'Favourites', 'bidVolume', 'Bid', 'Ask', 'askVolume', 'Turnover', 'Price', 'Change', 'Graph', 'Actions'];
    formType: string;
    selectedAssetClass = AppConstants.SELECTED_ASSET_CLASS

    langs = this.transloco.getAvailableLangs();
    activelang = this.transloco.getActiveLang();
    currentLang: any;

    propertiesData = [
        { src: 'assets/images/properties/lhr-smt-ct.png' },
        { src: 'assets/images/properties/dha.png' },
        { src: 'assets/images/properties/al-kabir-town.png' },
        { src: 'assets/images/properties/behria-town.png' },
        { src: 'assets/images/properties/new-metro-city.png' },
    ]
    highestChangeData: any;
    highestBidData: any;
    tradeType: string;
    userid: Number;
    watchlistSymbols: any = [];
    equitySymbols: any = []
    bondSymbols: any = []
    etfSymbols: any = []
    assetClass: AssetClass
    marketCodeColor = AppConstants.MARKET_CODE_COLOR



    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private sanitizer: DomSanitizer,
        private toast: ToastrService,
        private appState: AppState,
        private socket: WebSocketService,
        private transloco: TranslocoService,
        private _userService: UserService,
        private _matDialog: MatDialog,
        private splash: FuseLoaderScreenService,
        private dashboardService: DashboardService,
        private _symbolService: SymbolAddDialogComponentService,

    ) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userid = user.id;


        this.currentLang = localStorage.getItem("lang")
        if (this.currentLang != null) {
            this.transloco.setActiveLang(this.currentLang)
            this.activelang = this.transloco.getActiveLang();
        }
        if (this.selectedAssetClass !== "favourites") {
            this.dashboardService.setSelectedAssedClass(this.selectedAssetClass)
        }



    }

    ngOnInit(): void {
        this.dashboardService.WatchListSymbols$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.watchlistSymbols = data;
            });

        this.getWatchListSymbols()
        this.getAssetWiseTrendingSymbols(AppConstants.ASSET_CLASS_ID_EQUITIES);
        // this.onFetchingData();
        this.onFetchingStatsData();
        this.onFetchingBestMarketData()
        this.tradeType = AppConstants.tradeType;
        this.splash.hide();

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    buyAndSellFromAuth = () => {
        //  this._authService.nextMessage('signIn');
        this.outPutProp.emit("signIn");
    }

    private _prepareChartData(): void {
        this.watchlistChartOptions = {
            chart: {
                animations: {
                    enabled: true
                },
                width: '100%',
                height: '100%',
                type: 'area',
                sparkline: {
                    enabled: true
                }
            },
            colors: ['#A0AEC0'],
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            tooltip: {
                enabled: false
            },
        };
    }


    getAssetWiseTrendingSymbols(assetClassId:number) {

        this._authService.trendingSymbolAssetClassWise(AppConstants.exchangeCode,assetClassId, AppConstants.TOP_TRADED_SYMBOLS_COUNT).subscribe((data) => {

            this._symbolService.getFavourites(this.userid, AppConstants.exchangeCode).subscribe((res) => {
                this.watchlistSymbols = res
                data.map(a => {
                    //...............................................For Favourite Star.................................................
                    let include = this.watchlistSymbols.some(res => res.securityCode === a.securityCode);
                    if (include) {
                        a.favourite = true
                    }
                    else {
                        a.favourite = false
                    }
                    //..............................................................................................................
                });
               
            })

            data.map(a => {
               
                a.src = (a.securityStatsDTO.imgUrl == null) ? 'assets/img/settlement.png' : a.securityStatsDTO.imgUrl;
                a.cprice = a.securityStatsDTO?.currentPrice

                a.turnOver = a.securityStatsDTO?.totalTradedQuantity


                a.change = a.securityStatsDTO?.change
                a.changePercentage = a.securityStatsDTO?.changePerc

                if (Number(a.change) > 0) {
                    a.change = "+" + a.change
                    a.changePercentage = "+" + a.changePercentage
                }

                a.bid = a.bidPrice
                a.bidVolume = a.bidQuantity
                a.ask = a.offerPrice
                a.askVolume = a.offerQuantity
                a.ldcp = a.securityStatsDTO?.lastDayClosePrice
                if (Number(a.cprice) == 0) {
                    a.cprice = a.ldcp
                }
             
                a.dir = a.securityStatsDTO?.change.startsWith('-') ? 'down' : a.dir = 'up';
                a.data.map(ele => {
                    ele.y = ele.currentPrice;
                    ele.x = new Date(ele.entryDatetime).getHours();
                })
                a.series = [{
                    'data': [...a.data]
                }]

            });

            if (this.selectedAssetClass === 'equities') {
                this.equitiesTransactionsDataSource.data = data
            }
            else if (this.selectedAssetClass === 'bonds') {
                this.bondsTransactionsDataSource.data = data
            }
            else if (this.selectedAssetClass === 'etf') {
                this.etfTransactionsDataSource.data = data
            }
           
            this.recentTransactionsDataSource.data = data;


            let arr: any = [];
            let arrBid: any = [];
            let arrBidMin: any = [];
            let bid: any = [];
            let a: any = [];
            data.forEach(element => {
                if (element.bidPrice !== null && element.bidPrice !== "") {
                    bid.push(parseFloat(element.bidPrice));
                    let maxBidChange = Math.max(...bid);
                    let minBidChange = Math.min(...bid);
                    if (parseFloat(element.bidPrice) === maxBidChange) {
                        arrBid.pop();
                        arrBid.push(element);
                    }
                    if (parseFloat(element.bidPrice) === minBidChange) {
                        arrBidMin.pop();
                        arrBidMin.push(element);
                    }
                }

                if (element.securityStatsDTO !== null && element.securityStatsDTO !== undefined) {
                    a.push(parseInt(element.securityStatsDTO.change));
                    var maxChange = (Math.max(...a));
                    if (parseInt(element.securityStatsDTO?.change) === maxChange) {
                        arr.push(element);
                    }
                }
            });

            this.highestBidData = arrBid[0];
            this.highestChangeData = arr[0];
            this._userService.sendHighestChangeData(arr[0]);
            this._userService.sendHighestBidData(arrBid[0]);
            this._userService.sendLowestBidData(arrBidMin[0]);
            this._prepareChartData();



        }, (error => {
           // this.toast.error('Something Went Wrong', 'Error')
        }));
    }





    buySellDialogue(buySell: any, transaction: any) {
        if (this.dashboard) {
            this._matDialog.open(TradingDashboardBuySellComponent, {
                autoFocus: false,
                position: { top: '8%' },
                width: "400px",
                data: {
                    action: buySell,
                    symbolCode: transaction.securityCode,
                    marketCode: transaction.marketCode,
                    exchangeCode: transaction.exchangeCode,
                    price: transaction.data[transaction.data.length - 1].currentPrice
                },

            }).afterClosed().subscribe((data) => {

            });
        }
        else {
            this.outPutProp.emit("signIn");
        }
    }

    onFetchingData() {
        this.socket.onFetchDataFromChannel('hot_symbols').subscribe((data) => {
            let newData = [];
            newData.push(data);
            newData[0].map((el) => {
                el.src = `assets/images/symbols/trg${Math.floor(Math.random() * 5) + 1}.png`;
                el.dir = el.net_change.startsWith('-') ? 'down' : el.dir = 'up';
                el.series = [{
                    name: "Price",
                    data: [
                        {
                            "x": "15:48",
                            "y": Math.floor(Math.random() * 140) + 1
                        },
                        {
                            "x": "15:49",
                            "y": Math.floor(Math.random() * 140) + 1
                        },
                        {
                            "x": "15:54",
                            "y": Math.floor(Math.random() * 140) + 1
                        },
                        {
                            "x": "15:48",
                            "y": Math.floor(Math.random() * 140) + 1
                        },
                        {
                            "x": "15:49",
                            "y": Math.floor(Math.random() * 140) + 1
                        },
                        {
                            "x": "15:54",
                            "y": Math.floor(Math.random() * 140) + 1
                        },
                    ]
                }]
                el.bidPrice = '';
                el.bidPrice = 0;
                el.securityCode = el.symbol;
                el.securityDescription = el.symbol;
                el.securityStatsDTO = { 'change': el.net_change };
            })
            const slicedArray = newData[0].length > AppConstants.TOP_TRADED_SYMBOLS_COUNT ? newData[0].slice(0, AppConstants.TOP_TRADED_SYMBOLS_COUNT) : newData[0];
            this.recentTransactionsDataSource.data.length = 0;
            this.recentTransactionsDataSource.data = slicedArray;
            this.recentTransactionsDataSource._updateChangeSubscription();

        }, error => {
          //  this.toast.error('Something Went Wrong', 'Error')
        })
    }

    onFetchingBestMarketData() {
        this.socket.onFetchDataFromChannel('best_market').subscribe((data) => {
            let newData = [];
            newData.push(data);

            newData.map((a) => {

                a.bid = a.buy.price
                a.bidVolume = a.buy.volume

                a.ask = a.sell.price
                a.askVolume = a.sell.volume


                this.equitiesTransactionsDataSource.data.map((b) => {
                    if (b.securityCode == a.symbol) {
                        b.bid = a.bid
                        b.bidVolume = Number(a.bidVolume)

                        b.ask = a.ask
                        b.askVolume = Number(a.askVolume)
                    }
                })
                this.bondsTransactionsDataSource.data.map((b) => {
                    if (b.securityCode == a.symbol) {
                        b.bid = a.bid
                        b.bidVolume = Number(a.bidVolume)

                        b.ask = a.ask
                        b.askVolume = Number(a.askVolume)
                    }
                })

            })
        }, error => {
          //  this.toast.error('Something Went Wrong', 'Error')
        })
    }

    onFetchingStatsData() {
        this.socket.onFetchDataFromChannel('symbol_stat').subscribe((data) => {
            let newData = [];
            newData.push(data);

            newData.map((a) => {
                a.cprice = a.last_trade_price
                a.ldcp = a.last_day_close_price
                a.turnOver = a.turn_over
                a.change = a.net_change
                a.changePercentage = a.net_change_percentage
                a.dir = a.net_change.startsWith('-') ? 'down' : a.dir = 'up';

                this.equitiesTransactionsDataSource.data.map((b) => {
                    if (b.securityCode == a.symbol) {
                        b.cprice = a.cprice
                        b.ldcp = a.ldcp
                        b.turnOver = a.turnOver
                        b.change = a.change
                        b.changePercentage = a.changePercentage
                        b.dir = a.dir
                        if (Number(b.change) > 0) {
                            b.change = "+" + b.change
                            b.changePercentage = "+" + b.changePercentage
                        }
                    }
                })
                this.bondsTransactionsDataSource.data.map((b) => {
                    if (b.securityCode == a.symbol) {
                        b.cprice = a.cprice
                        b.ldcp = a.ldcp
                        b.turnOver = a.turnOver
                        b.change = a.change
                        b.changePercentage = a.changePercentage
                        b.dir = a.dir
                        if (Number(b.change) > 0) {
                            b.change = "+" + b.change
                            b.changePercentage = "+" + b.changePercentage
                        }
                    }
                })

            })
        }, error => {
          //  this.toast.error('Something Went Wrong', 'Error')
        })
    }







    onClickSymbol(transaction) {

        if (this.dashboard) {
            this.dashboardService.setOrderData(transaction);
            this._router.navigate([`/trading-portal/trading-graph/${transaction.exchangeCode}/${transaction.marketCode}/${transaction.securityCode}`])
        }
        else {
            this.outPutProp.emit("signIn");
        }
    }

    addToWatchList(element: any) {
        this.saveToWatchList(element)
    }

    saveToWatchList(obj: any) {
        let data: any = {}
        data.userId = this.userid
        data.exchangeCode = obj.exchangeCode
        data.marketCode = obj.marketCode
        data.securityCode = obj.securityCode

        this._symbolService.saveFavourite(data).subscribe((response) => {

            let res = response.message
            if (res == "Symbol Already Exist in Favourite List") {
                this.toast.info('Symbol Already Exist in Favourite List')
            }
            else if (res == "Symbol Added to Favourite List") {
                // this.watchListArrayLength.next(this.watchListArrayLength.value + 1)
                this.toast.success(res)
            }
        }, (error => {
            this.toast.error("Something went wrong", 'Error')
        }));
        this.equitiesTransactionsDataSource.data.map((res) => { if (res.securityCode == data.securityCode) { res.favourite = true } })
        this.equitiesTransactionsDataSource._updateChangeSubscription();

        this.bondsTransactionsDataSource.data.map((res) => { if (res.securityCode == data.securityCode) { res.favourite = true } })
        this.bondsTransactionsDataSource._updateChangeSubscription();

        this.etfTransactionsDataSource.data.map((res) => { if (res.securityCode == data.securityCode) { res.favourite = true } })
        this.etfTransactionsDataSource._updateChangeSubscription();

    }

    removeFromWatchList(element: any) {
        this.deleteFromWatchList(this.userid, element)
    }

    deleteFromWatchList(userid: Number, element: any) {
        let symbolid = element?.id

        if (element?.favourite) {
            this._symbolService.getFavourites(this.userid, AppConstants.exchangeCode).subscribe((data) => {
                data.map(a => {
                    let include = false
                    if (a.securityCode === element.securityCode) include = true
                    if (include) {
                        symbolid = a.id
                        this._symbolService.deleteFavourite(userid, symbolid).subscribe(() => {
                            // this.watchListArrayLength.next(this.watchListArrayLength.value - 1)
                            this.toast.success('Symbol Removed from Favourite List')
                        }, (error => {
                          //  this.toast.error('Something Went Wrong', 'Error')
                        }));
                    }
                });
            })
            this.equitiesTransactionsDataSource.data.map((res) => { if (res.securityCode == element.securityCode) { res.favourite = false } })
            this.equitiesTransactionsDataSource._updateChangeSubscription();

            this.bondsTransactionsDataSource.data.map((res) => { if (res.securityCode == element.securityCode) { res.favourite = false } })
            this.bondsTransactionsDataSource._updateChangeSubscription();
        }
        else {
            this._symbolService.deleteFavourite(userid, symbolid).subscribe(() => {
                let index = this.favouritesTransactionsDataSource.data.indexOf(element)
                let numberOfElementToRemove = 1;
                if (index !== -1) { this.favouritesTransactionsDataSource.data.splice(index, numberOfElementToRemove) }
                this.favouritesTransactionsDataSource._updateChangeSubscription();

                this.toast.success('Symbol Removed from Favourite List')

            }, (error => {
              //  this.toast.error('Something Went Wrong', 'Error')
            }));
        }

    }

    getWatchListSymbols() {
        this.splash.show()
        this._symbolService.getFavourites(this.userid, AppConstants.exchangeCode).subscribe((data) => {
            this.splash.hide()
            data.map(a => {
                let objectURL = 'data:image/png;base64,' + a.securityImage;
                // a.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                // a.bidPrice = a.bestMarketDTO[0].bidPrice
                // a.offerPrice = a.bestMarketDTO[0].offerPrice
                // a.dir = a.securityStatsDTO[0]?.change.startsWith('-') ? 'down' : a.dir = 'up';
                // a.securityStatsDTO.change = a.securityStatsDTO[0]?.change
                let firstIndex = 0
                a.src = (a.securityStatsDTO[firstIndex].imgUrl == null) ? 'assets/img/settlement.png' : a.securityStatsDTO[firstIndex].imgUrl;
                a.cprice = a.securityStatsDTO[firstIndex].currentPrice
                a.turnOver = a.securityStatsDTO[firstIndex].totalTradedQuantity

                a.change = a.securityStatsDTO[firstIndex].change
                a.changePercentage = a.securityStatsDTO[firstIndex].changePerc

                if (Number(a.change) > 0) {
                    a.change = "+" + a.change
                    a.changePercentage = "+" + a.changePercentage
                }

                a.bid = a.bestMarketDTO[firstIndex].bidPrice
                a.bidVolume = a.bestMarketDTO[firstIndex].bidQuantity
                a.ask = a.bestMarketDTO[firstIndex].offerPrice
                a.askVolume = a.bestMarketDTO[firstIndex].offerQuantity
                a.ldcp = a.securityStatsDTO[firstIndex].lastDayClosePrice
                if (Number(a.cprice) == 0) {
                    a.cprice = a.ldcp
                }

                a.dir = a.securityStatsDTO[firstIndex].change.startsWith('-') ? 'down' : a.dir = 'up';

                a.data.map(ele => {
                    ele.y = ele.currentPrice;
                    ele.x = new Date(ele.entryDatetime).getHours();
                })
                a.series = [{
                    'data': [...a.data]
                }]

            });

            this.favouritesTransactionsDataSource.data = data

        }, (error => {
            this.splash.hide()
          //  this.toast.error('Something Went Wrong', 'Error')
        }));
    }


    selectAssetClass(assetClass) {


        if (assetClass === AppConstants.ASSET_CLASS_EQUITIES) {
            this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES;
            this.getAssetWiseTrendingSymbols(AppConstants.ASSET_CLASS_ID_EQUITIES)
            AppConstants.SELECTED_ASSET_CLASS = this.selectedAssetClass
            this.dashboardService.setSelectedAssedClass(assetClass)
        }
        else if (assetClass === AppConstants.ASSET_CLASS_BONDS) {
            this.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS
            this.getAssetWiseTrendingSymbols(AppConstants.ASSET_CLASS_ID_BONDS)
            AppConstants.SELECTED_ASSET_CLASS = this.selectedAssetClass
            this.dashboardService.setSelectedAssedClass(assetClass)
        }
        else if (assetClass === AppConstants.ASSET_CLASS_ETF) {
            this.selectedAssetClass =  AppConstants.ASSET_CLASS_ETF;
            this.getAssetWiseTrendingSymbols(AppConstants.ASSET_CLASS_ID_ETFS)
            AppConstants.SELECTED_ASSET_CLASS = this.selectedAssetClass
            this.dashboardService.setSelectedAssedClass(assetClass)
        }
        else if (assetClass === 'favourites') {
            this.selectedAssetClass = 'favourites'

            this.getWatchListSymbols()
        }
    }



}
