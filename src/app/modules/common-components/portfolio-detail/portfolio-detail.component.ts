import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, Inject,
  OnInit, TemplateRef, ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, Subject } from "rxjs";
import { UserService } from "../../../core/user/user.service";
import { takeUntil } from "rxjs/operators";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { fuseAnimations } from "@fuse/animations";
import { TradingPortalService } from 'app/modules/admin/trading-portal/trading-portal.service';
import { ToastrService } from "ngx-toastr";
import { Navigation } from "../../../core/navigation/navigation.types";
import { AuthService } from 'app/core/auth/auth.service';
import { MatTableDataSource } from "@angular/material/table";
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SymbolAddDialogComponent } from '../symbol-add-dialog/symbol-add-dialog.component';
import { PortfolioDetailComponentService } from '../portfolio-detail/portfolio-detail.component.service';
import { AppConstants } from 'app/app.utility';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ChartComponent,
} from "ng-apexcharts";

export type radialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: String[];
  plotOptions: ApexPlotOptions;

};

@Component({
  selector: 'portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class PortfolioDetailComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<radialChartOptions>;
  equityBarPercent = new BehaviorSubject<String>("0%");
  equityColor: String = AppConstants.equityColor
  equityPLColor: String = "#FFFFFF"
  sellColor = AppConstants.sellColor
  buyColor = AppConstants.buyColor

  bondsBarPercent = new BehaviorSubject<String>("0%");
  bondColor: String = AppConstants.bondsColor
  bondsPLColor: String = "#FFFFFF"

  etfBarPercent = new BehaviorSubject<String>("0%");
  etfColor: String = AppConstants.etfColor
  etfPLColor: String = "#FFFFFF"


  userid: Number;
  profitColor = AppConstants.buyColor
  lossColor = AppConstants.sellColor

  equityTotalValue = new BehaviorSubject<any>('0000.00');
  equityCurrentValue = new BehaviorSubject<any>('0000.00');
  equityVolume = new BehaviorSubject<any>('0');
  equityNetProfitLoss = new BehaviorSubject<any>('0');
  equityProfit: Boolean = false
  equityLoss: Boolean = false

  bondsTotalValue = new BehaviorSubject<any>('0000.00');
  bondsCurrentValue = new BehaviorSubject<any>('0000.00');
  bondsVolume = new BehaviorSubject<any>('0');
  bondsNetProfitLoss = new BehaviorSubject<any>('0');
  bondsProfit: Boolean = false
  bondsLoss: Boolean = false

  etfTotalValue = new BehaviorSubject<any>('0000.00');
  etfCurrentValue = new BehaviorSubject<any>('0000.00');
  etfVolume = new BehaviorSubject<any>('0');
  etfNetProfitLoss = new BehaviorSubject<any>('0');
  etfProfit: Boolean = false
  etfLoss: Boolean = false

  loading = true
  NoDataFound = false

  constructor(
    public matDialogRef: MatDialogRef<SymbolAddDialogComponent>,
    private _userService: UserService,
    private tradingPortalService: TradingPortalService,
    private toast: ToastrService,
    private _authService: AuthService,
    private sanitizer: DomSanitizer,
    private _router: Router,
    private _portfolioService: PortfolioDetailComponentService,
  ) {
    let user = JSON.parse(localStorage.getItem('user'));
    this.userid = user.id;

    this.chartOptions = {
      series: [1,2,3],
      chart: {
        height: 350,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "16px",
              offsetY: 150
            },
            value: {
              show: false,
              fontSize: "16px",
              color: '#F44336',
              offsetY: 160,
            },
            total: {
              show: false,
              label: "Total",
              formatter: function (w) {
                return "249";
              }
            }
          }
        }
      },
      labels: ["Equities", "Bonds", "ETF"],
      colors: [AppConstants.equityColor, AppConstants.bondsColor, AppConstants.etfColor]
    };

  }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.getUserTradeDetail()
  }

  onCloseDialog() {
    this.matDialogRef.close();
  }

  getUserTradeDetail() {
    let equityVolume = 0
    let bondsVolume = 0
    let etfVolume = 0

    this._portfolioService.getUserTrade(this.userid).subscribe((res) => {
      

      let equityCount = 0
      let bondsCount = 0
      let etfCount = 0
      let TotalSymbols = res.length

      res?.map((data) => {

        if (data.assetClass.assetCode == AppConstants.ASSET_CODE_EQUITIES) {
          equityCount += 1
        }
        else if (data.assetClass.assetCode == AppConstants.ASSET_CODE_BONDS) {
          bondsCount += 1
        }
        else if (data.assetClass.assetCode == AppConstants.ASSET_CODE_ETF) {
          etfCount += 1
        }
      })

      //.........................Percentage Calculation......................
      let equityPercentage = (TotalSymbols == 0) ? 0 : Number(equityCount) / Number(TotalSymbols) * 100

      this.equityBarPercent.next(equityPercentage + "%")

      let bondsPercentage = (TotalSymbols == 0) ? 0 : Number(bondsCount) / Number(TotalSymbols) * 100
      this.bondsBarPercent.next(bondsPercentage + "%")

      let etfPercentage = (TotalSymbols == 0) ? 0 : Number(etfCount) / Number(TotalSymbols) * 100
      this.etfBarPercent.next(etfPercentage + "%")

    
      if (equityPercentage == 0 && bondsPercentage == 0 && etfPercentage == 0 ) {
        this.loading = false
        this.NoDataFound = true
      }

      if (equityPercentage != 0 || bondsPercentage != 0 || etfPercentage != 0 ) {
        this.loading = false
      }

      this.chartOptions.series = [equityPercentage,  bondsPercentage , etfPercentage]

    })

    this._userService.getUserTradeHoldings(this.userid).subscribe((res) => {
      
      console.log(res)
      let equityMarketValue = 0
      let equityTotalCost = 0
      let equityNetProfitLoss = 0

      let bondsMarketValue = 0
      let bondsTotalCost = 0
      let bondsNetProfitLoss = 0

      let etfMarketValue = 0
      let etfTotalCost = 0
      let etfNetProfitLoss = 0

      res?.map((data) => {
        
        if (data.assetClass.assetCode == AppConstants.ASSET_CODE_EQUITIES) {

          equityMarketValue += Number(data.holding * data.securityStatsDTO?.currentPrice)
          equityTotalCost += Number(data.totalCost)
          equityVolume += Number(data.holding)
        }
        else if (data.assetClass.assetCode == AppConstants.ASSET_CODE_BONDS) {
          bondsMarketValue += Number(data.holding * data.securityStatsDTO?.currentPrice)
          bondsTotalCost += Number(data.totalCost)
          bondsVolume += Number(data.holding)
        }
        else if (data.assetClass.assetCode == AppConstants.ASSET_CODE_ETF) {
          etfMarketValue += Number(data.holding * data.securityStatsDTO?.currentPrice)
          etfTotalCost += Number(data.totalCost)
          etfVolume += Number(data.holding)
        }
  
      })
      //.........................Asset Class Volumes......................
      this.equityVolume.next(equityVolume)
      this.bondsVolume.next(bondsVolume)
      this.etfVolume.next(etfVolume)

      //.........................AssetClasss Total/Current/Net-Profit/Loss.....................
      //.................................equity..............................................
      equityTotalCost = this.roundDownSignificantDigits(equityTotalCost, 3)
      if (equityTotalCost == 0) this.equityTotalValue.next("0000.00")
      else this.equityTotalValue.next(equityTotalCost)

      equityMarketValue = this.roundDownSignificantDigits(equityMarketValue, 3)
      if (equityMarketValue == 0) this.equityCurrentValue.next("0000.00")
      else this.equityCurrentValue.next(equityMarketValue)

      equityNetProfitLoss = equityMarketValue - equityTotalCost
      equityNetProfitLoss = this.roundDownSignificantDigits(equityNetProfitLoss, 3)
      this.equityNetProfitLoss.next(equityNetProfitLoss)

      if (equityNetProfitLoss >= 0) {
        this.equityProfit = true
        this.equityLoss = false
        this.equityPLColor = AppConstants.buyColor
      }
      else {
        this.equityLoss = true
        this.equityProfit = false
        this.equityPLColor = AppConstants.sellColor
      }

      //.................................bonds..............................................
      bondsTotalCost = this.roundDownSignificantDigits(bondsTotalCost, 3)
      if (bondsTotalCost == 0) this.bondsTotalValue.next("0000.00")
      else this.bondsTotalValue.next(bondsTotalCost)

      bondsMarketValue = this.roundDownSignificantDigits(bondsMarketValue, 3)
      if (bondsMarketValue == 0) this.bondsCurrentValue.next("0000.00")
      else this.bondsCurrentValue.next(bondsMarketValue)

      bondsNetProfitLoss = bondsMarketValue - bondsTotalCost
      bondsNetProfitLoss = this.roundDownSignificantDigits(bondsNetProfitLoss, 3)
      this.bondsNetProfitLoss.next(bondsNetProfitLoss)

      if (bondsNetProfitLoss >= 0) {
        this.bondsProfit = true
        this.bondsLoss = false
        this.bondsPLColor = AppConstants.buyColor
      }
      else {
        this.bondsLoss = true
        this.bondsProfit = false
        this.bondsPLColor = AppConstants.sellColor
      }

      //.................................etf..............................................
      etfTotalCost = this.roundDownSignificantDigits(etfTotalCost, 3)
      if (etfTotalCost == 0) this.etfTotalValue.next("0000.00")
      else this.etfTotalValue.next(etfTotalCost)

      etfMarketValue = this.roundDownSignificantDigits(etfMarketValue, 3)
      if (etfMarketValue == 0) this.etfCurrentValue.next("0000.00")
      else this.etfCurrentValue.next(etfMarketValue)

      etfNetProfitLoss = etfMarketValue - etfTotalCost
      etfNetProfitLoss = this.roundDownSignificantDigits(etfNetProfitLoss, 3)
      this.etfNetProfitLoss.next(etfNetProfitLoss)

      if (etfNetProfitLoss >= 0) {
        this.etfProfit = true
        this.etfLoss = false
        this.etfPLColor = AppConstants.buyColor
      }
      else {
        this.etfLoss = true
        this.etfProfit = false
        this.etfPLColor = AppConstants.sellColor
      }

    })
  }

  roundDownSignificantDigits(number, decimals) {
    let significantDigits = (parseInt(number.toExponential().split('e-')[1])) || 0;
    let decimalsUpdated = (decimals || 0) + significantDigits - 1;
    decimals = Math.min(decimalsUpdated, number.toString().length);

    return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
  }

}
