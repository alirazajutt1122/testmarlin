import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subject } from "rxjs";


import { DomSanitizer } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from '../reports.service';
import { fuseAnimations } from '@fuse/animations';
import { AppConstants } from 'app/app.utility';

@Component({
    selector: 'virtual-trade-history-report',
    templateUrl: './virtual-trade-history-report.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class VirtualTradeHistoryReportComponent implements OnInit, OnDestroy {

    selectedAssetClass: string = 'equities';
    menu: string[] = ['Name', 'Volume', 'Price', 'Value', 'TradeDateTime', 'TransactionType'];
    userTradeDataSource: MatTableDataSource<any> = new MatTableDataSource();
    userId: Number;

    equitySymbols$ = new BehaviorSubject<any>([]);
    cryptoSymbols$ = new BehaviorSubject<any>([]);
    commoditySymbols$ = new BehaviorSubject<any>([]);
    realEstateSymbols$ = new BehaviorSubject<any>([]);

    constructor(
        private _router: Router,
        private _reportService: ReportsService,
        private sanitizer: DomSanitizer,
    ) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userId = user.id;
    }

    ngOnInit(): void {
        this.tradeHistoryList()
    }

    ngOnDestroy(): void {
    }


    onClickSymbol(element) {
        this._router.navigate([`/trading-portal/trading-graph/${element.securityStatsDTO[0].exchangeCode}/${element.securityStatsDTO[0].marketCode}/${element.securityCode}`])
    }

    tradeHistoryList() {
        let equitySymbols = []
        let cryptoSymbols = []
        let commoditySymbols = []
        let realEstateSymbols = []

        this._reportService.getUserTrade(this.userId).subscribe((res => {
            res.map((data => {
                let objectURL = 'data:image/png;base64,' + data.securityStatsDTO[0]?.securityImage;
                data.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);

                if (data.buySell == "S") {
                    data.buySell = 'Sell'
                    data.color = AppConstants.sellColor
                }
                else {
                    data.buySell = 'Buy'
                    data.color = AppConstants.buyColor
                }
                if (data.assetClass.assetCode == "EQTY") {
                    equitySymbols.push(data)
                }
                else if (data.assetClass.assetCode == "CRYPTO") {
                    cryptoSymbols.push(data)
                }
                else if (data.assetClass.assetCode == "CMDTY") {
                    commoditySymbols.push(data)
                }
                else if (data.assetClass.assetCode == "REALES") {
                    realEstateSymbols.push(data)
                }
            }))
            this.equitySymbols$.next(equitySymbols)
            this.cryptoSymbols$.next(cryptoSymbols)
            this.commoditySymbols$.next(commoditySymbols)
            this.realEstateSymbols$.next(realEstateSymbols)

            this.assetClassSelected(this.selectedAssetClass)
            console.log(res)
        }))
    }

    assetClassSelected(assetClass: any) {
        this.selectedAssetClass = assetClass

        if (this.selectedAssetClass == 'equities') {
            this.userTradeDataSource.data = this.equitySymbols$.value
        }
        else if (this.selectedAssetClass == 'crypto') {
            this.userTradeDataSource.data = this.cryptoSymbols$.value
        }
        else if (this.selectedAssetClass == 'commodities') {
            this.userTradeDataSource.data = this.commoditySymbols$.value
        }
        else if (this.selectedAssetClass == 'realestate') {
            this.userTradeDataSource.data = this.realEstateSymbols$.value
        }
    }

}
