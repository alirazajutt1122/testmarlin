import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SymbolAddDialogComponentService } from 'app/modules/common-components/symbol-add-dialog/symbol-add-dialog.component.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PortfolioService } from './portfolio.service';
import { MatDialog } from '@angular/material/dialog';
import { TradingDashboardBuySellComponent } from '../trading-portal/trading-dashboard/trading-dashboard-buysell/trading-dashboard-buysell.component';
import { AppConstants } from 'app/app.utility';
import { TradingDashboardService } from '../trading-portal/trading-dashboard/trading\'dashboard.service';
import { fuseAnimations } from "../../../../@fuse/animations";
import { NewOrderAll } from '../oms/order/new-order-all/new-order-all';
import { DashboardService } from '../dashboard/dashboard.service';



@Component({
    selector: 'portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})

export class PortfolioComponent implements OnInit {


    @ViewChild('newOrderAll') newOrderAll : NewOrderAll;

    userid: Number;
    userHoldingSymbolsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    selectedAssetClass: string = 'equities';
    equitySymbols$ = new BehaviorSubject<any>([]);
    cryptoSymbols$ = new BehaviorSubject<any>([]);
    commoditySymbols$ = new BehaviorSubject<any>([]);
    realEstateSymbols$ = new BehaviorSubject<any>([]);
    holdingList = new BehaviorSubject<Array<any>>([]);

    totalValue$ = new BehaviorSubject<any>("0000");
    volume$ = new BehaviorSubject<any>("0000");
    currentValue$ = new BehaviorSubject<any>("0000");
    netPL$ = new BehaviorSubject<any>("0000");
    DayPL$ = new BehaviorSubject<any>("0000");
    TotalPL$ = new BehaviorSubject<any>("0000");

    equityMarketValue = 0
    equityTotalCost = 0
    equityNetProfitLoss = 0
    equityVolume = 0
    equityDayPL = 0
    equityTotalPL = 0

    cryptoMarketValue = 0
    cryptoTotalCost = 0
    cryptoNetProfitLoss = 0
    cryptoVolume = 0
    cryptoDayPL = 0
    cryptoTotalPL = 0

    commodityMarketValue = 0
    commodityTotalCost = 0
    commodityNetProfitLoss = 0
    commodityVolume = 0
    commodityDayPL = 0
    commodityTotalPL = 0

    realEstateMarketValue = 0
    realEstateTotalCost = 0
    realEstateNetProfitLoss = 0
    realEstateVolume = 0
    realEstateDayPL = 0
    realEstateTotalPL = 0
    sharedOrderData: any;

    menu: string[] = ['Name', 'Volume', 'AveragePrice', 'CurrentPrice', 'MarketValue', 'DayP/L', 'TotalP/L', 'LastPurchaseDate', 'BuySell'];
    Profit: boolean;
    Loss: boolean;
    DayProfit: boolean;
    DayLoss: boolean;
    TotalProfit: boolean;
    TotalLoss: boolean;
    PLColor: String;
    DayPLColor: String;
    TotalPLColor: String;
    profit = AppConstants.buyColor
    loss = AppConstants.sellColor

    constructor(
        private _portfolioService: PortfolioService,
        private sanitizer: DomSanitizer,
        private _matDialog: MatDialog,
        private _router: Router,
        private tradingService: TradingDashboardService,
        private dashboardService : DashboardService,
    ) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userid = user.id;
        this.getuserHoldings()
    }

    ngOnInit(): void {

    }

    getuserHoldings() {
        let equitySymbols = []
        let cryptoSymbols = []
        let commoditySymbols = []
        let realEstateSymbols = []

        this.equityMarketValue = 0
        this.equityTotalCost = 0
        this.equityNetProfitLoss = 0
        this.equityVolume = 0
        this.equityDayPL = 0
        this.equityTotalPL = 0

        this.cryptoMarketValue = 0
        this.cryptoTotalCost = 0
        this.cryptoNetProfitLoss = 0
        this.cryptoVolume = 0
        this.cryptoDayPL = 0
        this.cryptoTotalPL = 0

        this.commodityMarketValue = 0
        this.commodityTotalCost = 0
        this.commodityNetProfitLoss = 0
        this.commodityVolume = 0
        this.commodityDayPL = 0
        this.commodityTotalPL = 0

        this.realEstateMarketValue = 0
        this.realEstateTotalCost = 0
        this.realEstateNetProfitLoss = 0
        this.realEstateVolume = 0
        this.realEstateDayPL = 0
        this.realEstateTotalPL = 0

        this._portfolioService.getUserTradeHoldings(this.userid).subscribe((res) => {
            console.log(res)
            res.map(a => {
                let objectURL = 'data:image/png;base64,' + a.securityStatsDTO?.securityImage;
                a.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);

                a.marketValue = a.securityStatsDTO?.currentPrice * a.holding
                a.marketValue = this.roundDownSignificantDigits(a.marketValue,3)


                a.TotalCost = a.averageBuyPrice * a.holding
                a.lastPurchaseDate = a.securityStatsDTO.lastTradeTime
                console.log(a.DayPL)
                
                //..........................................DayP/L........................................................................................
                a.DayPL = (Number(a.securityStatsDTO.currentPrice) - Number(a.securityStatsDTO.lastDayClosePrice)) * Number(a.holding)
                a.DayPL = this.roundDownSignificantDigits(a.DayPL,3)
                if (a.DayPL >= 0) a.DayPL = "+" + a.DayPL
                a.DayPLDir = a.DayPL.toString().startsWith('-') ? 'down' : a.DayPLDir = 'up';

                //..........................................TotalP/L........................................................................................
                a.totalPL = (Number(a.securityStatsDTO.currentPrice) - Number(a.averageBuyPrice)) * Number(a.holding)
                a.totalPL = this.roundDownSignificantDigits(a.totalPL,3)
                if (a.totalPL >= 0) a.totalPL = "+" + a.totalPL
                a.totalPLDir = a.totalPL.toString().startsWith('-') ? 'down' : a.totalPLDir = 'up';

                

                if (a.assetClass.assetCode == "EQTY") {
                    equitySymbols.push(a)
                    this.equityMarketValue += Number(a.holding * a.securityStatsDTO.currentPrice)
                    this.equityTotalCost += Number(a.totalCost)
                    this.equityVolume += Number(a.holding)
                    this.equityDayPL += Number(a.DayPL)
                    this.equityTotalPL += Number(a.totalPL)
                }
                else if (a.assetClass.assetCode == "CRYPTO") {
                    cryptoSymbols.push(a)
                    this.cryptoMarketValue += Number(a.holding * a.securityStatsDTO.currentPrice)
                    this.cryptoTotalCost += Number(a.totalCost)
                    this.cryptoVolume += Number(a.holding)
                    this.cryptoDayPL += Number(a.DayPL)
                    this.cryptoTotalPL += Number(a.totalPL)
                }
                else if (a.assetClass.assetCode == "CMDTY") {
                    commoditySymbols.push(a)
                    this.commodityMarketValue += Number(a.holding * a.securityStatsDTO.currentPrice)
                    this.commodityTotalCost += Number(a.totalCost)
                    this.commodityVolume += Number(a.holding)
                    this.commodityDayPL += Number(a.DayPL)
                    this.commodityTotalPL += Number(a.totalPL)
                }
                else if (a.assetClass.assetCode == "REALES") {
                    realEstateSymbols.push(a)
                    this.realEstateMarketValue += Number(a.holding * a.securityStatsDTO.currentPrice)
                    this.realEstateTotalCost += Number(a.totalCost)
                    this.realEstateVolume += Number(a.holding)
                    this.realEstateDayPL += Number(a.DayPL)
                    this.realEstateTotalPL += Number(a.totalPL)
                }
            });

            this.equitySymbols$.next(equitySymbols)
            this.cryptoSymbols$.next(cryptoSymbols)
            this.commoditySymbols$.next(commoditySymbols)
            this.realEstateSymbols$.next(realEstateSymbols)

            // this.userHoldingSymbolsDataSource.data = this.equitySymbols$.value

            // .............................................................equity...................................................
            this.equityTotalCost = this.roundDownSignificantDigits(this.equityTotalCost,3)
            // this.totalValue$.next(this.equityTotalCost)

            this.equityMarketValue = this.roundDownSignificantDigits(this.equityMarketValue,3)
            // this.currentValue$.next(this.equityMarketValue)

            this.equityNetProfitLoss = this.equityMarketValue - this.equityTotalCost
            this.equityNetProfitLoss = this.roundDownSignificantDigits(this.equityNetProfitLoss,3)
            // this.netPL$.next(this.equityNetProfitLoss)
            // this.volume$.next(this.equityVolume)
            this.equityDayPL = this.roundDownSignificantDigits(this.equityDayPL,3)
            this.equityTotalPL = this.roundDownSignificantDigits(this.equityTotalPL,3)

            // .............................................................crypto.....................................................
            this.cryptoTotalCost = this.roundDownSignificantDigits(this.cryptoTotalCost,3)
            this.cryptoMarketValue = this.roundDownSignificantDigits(this.cryptoMarketValue,3)
            this.cryptoNetProfitLoss = this.cryptoMarketValue - this.cryptoTotalCost
            this.cryptoNetProfitLoss = this.roundDownSignificantDigits(this.cryptoNetProfitLoss,3)
            this.cryptoDayPL = this.roundDownSignificantDigits(this.cryptoDayPL,3)
            this.cryptoTotalPL = this.roundDownSignificantDigits(this.cryptoTotalPL,3)

            // .............................................................Commodity.....................................................
            this.commodityTotalCost = this.roundDownSignificantDigits(this.commodityTotalCost,3)
            this.commodityMarketValue = this.roundDownSignificantDigits(this.commodityMarketValue,3)
            this.commodityNetProfitLoss = this.commodityMarketValue - this.commodityTotalCost
            this.commodityNetProfitLoss = this.roundDownSignificantDigits(this.commodityNetProfitLoss,3)
            this.commodityDayPL = this.roundDownSignificantDigits(this.commodityDayPL,3)
            this.commodityTotalPL = this.roundDownSignificantDigits(this.commodityTotalPL,3)

            // .............................................................Real Estate.....................................................
            this.realEstateTotalCost = this.roundDownSignificantDigits(this.realEstateTotalCost,3)
            this.realEstateMarketValue = this.roundDownSignificantDigits(this.realEstateMarketValue,3)
            this.realEstateNetProfitLoss = this.realEstateMarketValue - this.realEstateTotalCost
            this.realEstateNetProfitLoss = this.roundDownSignificantDigits(this.realEstateNetProfitLoss,3)
            this.realEstateDayPL = this.roundDownSignificantDigits(this.realEstateDayPL,3)
            this.realEstateTotalPL = this.roundDownSignificantDigits(this.realEstateTotalPL,3)

            // ..................................................................................................
            this.assetClassSelected(this.selectedAssetClass)
        })
    }

    assetClassSelected(assetClass: any) {
        this.selectedAssetClass = assetClass
        // ...................................................Equities..................................................................................
        if (this.selectedAssetClass == 'equities') {
            this.userHoldingSymbolsDataSource.data = this.equitySymbols$.value
            this.totalValue$.next(this.equityTotalCost)
            this.currentValue$.next(this.equityMarketValue)
            this.netPL$.next(this.equityNetProfitLoss)
            this.volume$.next(this.equityVolume)
            this.DayPL$.next(this.equityDayPL)
            this.TotalPL$.next(this.equityTotalPL)
            // ...................................................Net Profit/Loss............................................
            if (this.equityNetProfitLoss >= 0) {
                this.Profit = true
                this.Loss = false
                this.PLColor = AppConstants.buyColor
            }
            else {
                this.Loss = true
                this.Profit = false
                this.PLColor = AppConstants.sellColor
            }
            // ...................................................Day Profit/Loss............................................
            if (this.equityDayPL >= 0) {
                this.DayProfit = true
                this.DayLoss = false
                this.DayPLColor = AppConstants.buyColor
            }
            else {
                this.DayLoss = true
                this.DayProfit = false
                this.DayPLColor = AppConstants.sellColor
            }
            // ...................................................Total Profit/Loss............................................
            if (this.equityTotalPL >= 0) {
                this.TotalProfit = true
                this.TotalLoss = false
                this.TotalPLColor = AppConstants.buyColor
            }
            else {
                this.TotalLoss = true
                this.TotalProfit = false
                this.TotalPLColor = AppConstants.sellColor
            }
        }
        // ...................................................Crypto..................................................................................
        else if (this.selectedAssetClass == 'crypto') {
            this.userHoldingSymbolsDataSource.data = this.cryptoSymbols$.value
            this.totalValue$.next(this.cryptoTotalCost)
            this.currentValue$.next(this.cryptoMarketValue)
            this.netPL$.next(this.cryptoNetProfitLoss)
            this.volume$.next(this.cryptoVolume)
            this.DayPL$.next(this.cryptoDayPL)
            this.TotalPL$.next(this.cryptoTotalPL)
            // ...................................................Net Profit/Loss............................................
            if (this.cryptoNetProfitLoss >= 0) {
                this.Profit = true
                this.Loss = false
                this.PLColor = AppConstants.buyColor
            }
            else {
                this.Loss = true
                this.Profit = false
                this.PLColor = AppConstants.sellColor
            }
            // ...................................................Day Profit/Loss............................................
            if (this.cryptoDayPL >= 0) {
                this.DayProfit = true
                this.DayLoss = false
                this.DayPLColor = AppConstants.buyColor
            }
            else {
                this.DayLoss = true
                this.DayProfit = false
                this.DayPLColor = AppConstants.sellColor
            }
            // ...................................................Total Profit/Loss............................................
            if (this.cryptoTotalPL >= 0) {
                this.TotalProfit = true
                this.TotalLoss = false
                this.TotalPLColor = AppConstants.buyColor
            }
            else {
                this.TotalLoss = true
                this.TotalProfit = false
                this.TotalPLColor = AppConstants.sellColor
            }
        }
        // ...................................................Commodities..................................................................................
        else if (this.selectedAssetClass == 'commodities') {
            this.userHoldingSymbolsDataSource.data = this.commoditySymbols$.value
            this.totalValue$.next(this.commodityTotalCost)
            this.currentValue$.next(this.commodityMarketValue)
            this.netPL$.next(this.commodityNetProfitLoss)
            this.volume$.next(this.commodityVolume)
            this.DayPL$.next(this.commodityDayPL)
            this.TotalPL$.next(this.commodityTotalPL)
            // ...................................................Net Profit/Loss............................................
            if (this.commodityNetProfitLoss >= 0) {
                this.Profit = true
                this.Loss = false
                this.PLColor = AppConstants.buyColor
            }
            else {
                this.Loss = true
                this.Profit = false
                this.PLColor = AppConstants.sellColor
            }
            // ...................................................Day Profit/Loss............................................
            if (this.commodityDayPL >= 0) {
                this.DayProfit = true
                this.DayLoss = false
                this.DayPLColor = AppConstants.buyColor
            }
            else {
                this.DayLoss = true
                this.DayProfit = false
                this.DayPLColor = AppConstants.sellColor
            }
            // ...................................................Total Profit/Loss............................................
            if (this.commodityTotalPL >= 0) {
                this.TotalProfit = true
                this.TotalLoss = false
                this.TotalPLColor = AppConstants.buyColor
            }
            else {
                this.TotalLoss = true
                this.TotalProfit = false
                this.TotalPLColor = AppConstants.sellColor
            }
        }
        // ...................................................RealEstate..................................................................................
        else if (this.selectedAssetClass == 'realestate') {
            this.userHoldingSymbolsDataSource.data = this.realEstateSymbols$.value
            this.totalValue$.next(this.realEstateTotalCost)
            this.currentValue$.next(this.realEstateMarketValue)
            this.netPL$.next(this.realEstateNetProfitLoss)
            this.volume$.next(this.realEstateVolume)
            this.DayPL$.next(this.realEstateDayPL)
            this.TotalPL$.next(this.realEstateTotalPL)
            // ...................................................Net Profit/Loss............................................
            if (this.realEstateNetProfitLoss >= 0) {
                this.Profit = true
                this.Loss = false
                this.PLColor = AppConstants.buyColor
            }
            else {
                this.Loss = true
                this.Profit = false
                this.PLColor = AppConstants.sellColor
            }
            // ...................................................Day Profit/Loss............................................
            if (this.realEstateDayPL >= 0) {
                this.DayProfit = true
                this.DayLoss = false
                this.DayPLColor = AppConstants.buyColor
            }
            else {
                this.DayLoss = true
                this.DayProfit = false
                this.DayPLColor = AppConstants.sellColor
            }
            // ...................................................Total Profit/Loss............................................
            if (this.realEstateTotalPL >= 0) {
                this.TotalProfit = true
                this.TotalLoss = false
                this.TotalPLColor = AppConstants.buyColor
            }
            else {
                this.TotalLoss = true
                this.TotalProfit = false
                this.TotalPLColor = AppConstants.sellColor
            }
        }
    }


    buySellDialogue(buySell: any, transaction: any) {
        this._matDialog.open(TradingDashboardBuySellComponent, {
            autoFocus: false,
            position: { top: '8%' },
            width: "400px",
            data: {
                action: buySell,
                symbolCode: transaction.securityCode,
                marketCode: transaction.securityStatsDTO.marketCode,
                exchangeCode: transaction.exchangeCode,
                price: transaction.securityStatsDTO.currentPrice

            },

        }).afterClosed().subscribe((data) => {
            setTimeout(() => {
                this.getuserHoldings()
            }, 500);

        });
    }

    onClickSymbol(element) {
        this._router.navigate([`/trading-portal/trading-graph/${element.exchangeCode}/${element.securityStatsDTO.marketCode}/${element.securityCode}`])
    }

    getHoldingList() {
        let holdingList = []
        this.tradingService.getUserTradeHoldings(this.userid).subscribe((res => {
            res.map((a) => {
                if (a.holding > 0) {
                    holdingList.push(a)
                }
            })
            this.holdingList.next(holdingList)
        }))
    }

    roundDownSignificantDigits(number, decimals) {
        let significantDigits = (parseInt(number.toExponential().split('e-')[1])) || 0;
        let decimalsUpdated = (decimals || 0) +  significantDigits - 1;
        decimals = Math.min(decimalsUpdated, number.toString().length);
      
        return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
      }



      getOrderDataShared=()=>{
        this.dashboardService.getOrderData().subscribe((res:any)=>{
            this.sharedOrderData = res;
       })
     }
    


      showModalForOrder=(element, side:string , assetClass)=>{
        this.newOrderAll.show(element , side , assetClass);
     }






}