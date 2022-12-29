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
import { SymbolAddDialogComponentService } from './symbol-add-dialog.component.service';
import { AppConstants } from 'app/app.utility';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';

@Component({
    selector: 'confirmation',
    templateUrl: './symbol-add-dialog.component.html',
    styleUrls: ['./symbol-add-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class SymbolAddDialogComponent implements OnInit {
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
    @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;
    labelsFilter: any;
    filteredSecurities: any;
    securities: any[] = [];
    navigation: Navigation;
    isScreenSmall: boolean;
    onAddPopup: string[] = ['Symbol', 'Bid', 'Ask', 'Change', 'Favourites'];
    selectedCategory: string = "Equities"
    symbolsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    equitySymbolsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    watchlistSymbolsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    watchlistSymbols = new BehaviorSubject<any>("");
    watchList: Boolean = false
    userid: Number;
    favourites: any = []
    equitySymbols: any = []
    originalEquityArray: any = []
    originalBondArray: any = []
    originalEtfArray: any = []
    originalWatchlistArray: any = []

    selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES
    isSingleClick: Boolean = true;
    watchListArrayLength = new BehaviorSubject<any>(0);
    equityListArrayLength = new BehaviorSubject<any>(0);
    cryptoListArrayLength: Number = 0
    commoditiesListArrayLength: Number = 0
    realEstateListArrayLength: Number = 0
    bondListArrayLength = new BehaviorSubject<any>(0);
    etfsListArrayLength = new BehaviorSubject<any>(0);

    bondDataSource: MatTableDataSource<any> = new MatTableDataSource();
    etfDataSource: MatTableDataSource<any> = new MatTableDataSource();

    constructor(
        public matDialogRef: MatDialogRef<SymbolAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private tradingPortalService: TradingPortalService,
        private toast: ToastrService,
        private _authService: AuthService,
        private sanitizer: DomSanitizer,
        private _router: Router,
        private _symbolService: SymbolAddDialogComponentService,
        private splash: FuseLoaderScreenService,
        private dashboardService: DashboardService,
    ) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userid = user.id;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {

        this._symbolService.getFavourites(this.userid, AppConstants.exchangeCode)
            .subscribe((data) => {
                data.map(a => {
                    let objectURL = 'data:image/png;base64,' + a.securityImage;
                    a.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                    a.bidPrice = a.bestMarketDTO[0].bidPrice
                    a.offerPrice = a.bestMarketDTO[0].offerPrice
                });
                this.watchlistSymbolsDataSource.data = data
                this.watchListArrayLength.next(this.watchlistSymbolsDataSource.data.length)
            })


        this.securities.length = 0;
        this.securities = [...this._data.allPreviousSymbols];
        this.getAllTradingSymbols()
    }

    search(event) {
        const value = event.target.value.toLowerCase();
        // this.filteredSecurities = this.originalArray.filter(security => security.securityDescription.toLowerCase().includes(value));
        // this.symbolsDataSource.data = this.filteredSecurities
        if (this.selectedAssetClass === AppConstants.ASSET_CLASS_EQUITIES) {
            this.filteredSecurities = this.originalEquityArray.filter(security => security.securityDescription.toLowerCase().includes(value));
            this.equitySymbolsDataSource.data = this.filteredSecurities
        }
        else if (this.selectedAssetClass === AppConstants.ASSET_CLASS_BONDS) {
            this.filteredSecurities = this.originalBondArray.filter(security => security.securityDescription.toLowerCase().includes(value));
            this.bondDataSource.data = this.filteredSecurities
        }
        else if (this.selectedAssetClass === AppConstants.ASSET_CLASS_ETF) {
            this.filteredSecurities = this.originalEtfArray.filter(security => security.securityDescription.toLowerCase().includes(value));
            this.etfDataSource.data = this.filteredSecurities
        }
        else if (this.selectedAssetClass === "watchlist") {
            this.filteredSecurities = this.originalWatchlistArray.filter(security => security.securityDescription.toLowerCase().includes(value));
            this.watchlistSymbolsDataSource.data = this.filteredSecurities
        }
    }

    //.....................................................button clicks..............................................
    onCloseDialog() {
        this.matDialogRef.close();
    }
    onAddButton() {
        !this.securities.length ? this.toast.info('Please Select Security', 'Information') :
            this.matDialogRef.close({ 'markedSecurities': this.securities })
    }
    equitySymbol() {
        this.selectedCategory = "Equities"
        this.selectedAssetClass = AppConstants.ASSET_CLASS_EQUITIES
        this.watchList = false
    }
    bondSymbol() {
        this.selectedCategory = "Bonds"
        this.selectedAssetClass = AppConstants.ASSET_CLASS_BONDS
        this.watchList = false
    }
    etfSymbol() {
        this.selectedCategory = "ETFs"
        this.selectedAssetClass = AppConstants.ASSET_CLASS_ETF
        this.watchList = false
    }
    watchListSymbol() {
        this.selectedCategory = "Watch List"
        this.selectedAssetClass = 'watchlist'
        this.watchList = true
        this.getWatchListSymbols()
    }

    addToWatchList(element: any) {
        this.saveToWatchList(element)
    }
    removeFromWatchList(element: any) {
        this.deleteFromWatchList(this.userid, element)
    }
    onClickInfo(element) {
        this._router.navigate([`/trading-portal/trading-graph/${element.exchangeCode}/${element.marketCode}/${element.securityCode}`])
        this.matDialogRef.close();
    }

    callForSnglClick(element) {
        debugger
        this.isSingleClick = true;
        setTimeout(() => {
            if (this.isSingleClick) {
                const requiredDataLength = 1;
                this.tradingPortalService.getKlineGraphDataDynamic(element.exchangeCode, element.securityCode, requiredDataLength).pipe(
                    takeUntil(this._unsubscribeAll)).subscribe((data) => {
                        element.securityTradedData = data[0]
                    });
                this.securities.push(element);
                this.matDialogRef.close({ 'markedSecurities': this.securities })
            }
        }, 250)
    }

    callForDblClick(element) {
        this.isSingleClick = false;

        const requiredDataLength = 1;
        this.tradingPortalService.getKlineGraphDataDynamic(element.exchangeCode, element.securityCode, requiredDataLength).pipe(
            takeUntil(this._unsubscribeAll)).subscribe((data) => {
                element.securityTradedData = data[0]
            });
        this.securities.push(element);
        this.matDialogRef.close({ 'markedSecurities': this.securities })

    }

    //.....................................................calling services..............................................

    getTrendingSymbol(assetClassId: number) {
        this.splash.show()
        this._authService.trendingSymbolAssetClassWise(AppConstants.exchangeCode, assetClassId, AppConstants.TOP_TRADED_SYMBOLS_COUNT_UNLIMITED)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.splash.hide()
                this._symbolService.getFavourites(this.userid, AppConstants.exchangeCode).subscribe((res) => {
                    this.watchlistSymbolsDataSource.data = res

                    data.map(a => {
                        debugger
                        let objectURL = 'data:image/png;base64,' + a.securityImage;
                        a.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                        a.dir = a.securityStatsDTO?.change.startsWith('-') ? 'down' : a.dir = 'up';
                        //...............................................For Favourite Star.................................................
                        let include = this.watchlistSymbolsDataSource.data.some(res => res.securityCode === a.securityCode);
                        if (include) {
                            a.favourite = "true"
                        }
                        //..............................................................................................................
                    });

                    this.splash.hide()
                    if (assetClassId === AppConstants.ASSET_CLASS_ID_EQUITIES) {
                        this.originalEquityArray = data
                        this.equitySymbolsDataSource.data = data
                        this.equityListArrayLength.next(this.equitySymbolsDataSource.data.length)
                    }
                    else if (assetClassId === AppConstants.ASSET_CLASS_ID_BONDS) {
                        this.originalBondArray = data
                        this.bondDataSource.data = data
                        this.bondListArrayLength.next(this.bondDataSource.data.length)
                    }
                    else if (assetClassId === AppConstants.ASSET_CLASS_ID_ETFS) {
                        this.originalEtfArray = data
                        this.etfDataSource.data = data
                        this.etfsListArrayLength.next(this.etfDataSource.data.length)
                    }

                    // this.symbolsDataSource.data = this.equitySymbolsDataSource.data
                    // this.originalArray = this.symbolsDataSource.data
                }), (error => {
                    this.splash.hide()
                    this.toast.error('Something Went Wrong', 'Error')
                })

            }, (error => {
                this.splash.hide()
                this.toast.error('Something Went Wrong', 'Error')
            }));
    }

    getWatchListSymbols() {
        this.splash.show()
        this._symbolService.getFavourites(this.userid, AppConstants.exchangeCode).subscribe((data) => {
            data.map(a => {
                let objectURL = 'data:image/png;base64,' + a.securityImage;
                a.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                a.bidPrice = a.bestMarketDTO[0].bidPrice
                a.offerPrice = a.bestMarketDTO[0].offerPrice
                a.dir = a.securityStatsDTO[0]?.change.startsWith('-') ? 'down' : a.dir = 'up';
                a.securityStatsDTO.change = a.securityStatsDTO[0]?.change
            });
            this.splash.hide()
            this.watchlistSymbols.next(data)
            this.watchlistSymbolsDataSource.data = data
            this.originalWatchlistArray = data
            // this.originalArray = this.watchlistSymbolsDataSource.data
            this.watchListArrayLength.next(this.watchlistSymbolsDataSource.data.length)
            // this.symbolsDataSource.data = this.watchlistSymbolsDataSource.data

        }, (error => {
            this.splash.hide()
            this.toast.error('Something Went Wrong', 'Error')
        }));
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
                this.watchListArrayLength.next(this.watchListArrayLength.value + 1)
                this.toast.success(res)
            }
        }, (error => {
            this.toast.error("Something went wrong", 'Error')
        }));

        // this.symbolsDataSource.data.map((res) => { if (res.securityCode == data.securityCode) { res.favourite = true } })
        // this.symbolsDataSource._updateChangeSubscription();
        if (this.selectedAssetClass === AppConstants.ASSET_CLASS_EQUITIES) {
            this.equitySymbolsDataSource.data.map((res) => { if (res.securityCode == data.securityCode) { res.favourite = true } })
            this.equitySymbolsDataSource._updateChangeSubscription();
        }
        else if (this.selectedAssetClass === AppConstants.ASSET_CLASS_BONDS) {
            this.bondDataSource.data.map((res) => { if (res.securityCode == data.securityCode) { res.favourite = true } })
            this.bondDataSource._updateChangeSubscription();
        }
        else if (this.selectedAssetClass === AppConstants.ASSET_CLASS_ETF) {
            this.etfDataSource.data.map((res) => { if (res.securityCode == data.securityCode) { res.favourite = true } })
            this.etfDataSource._updateChangeSubscription();
        }

    }

    deleteFromWatchList(userid: Number, element: any) {
        let symbolid = element?.id
        debugger
        if (element?.favourite) {
            this._symbolService.getFavourites(this.userid, AppConstants.exchangeCode).subscribe((data) => {
                data.map(a => {
                    let include = false
                    if (a.securityCode === element.securityCode) include = true
                    if (include) {
                        symbolid = a.id
                        this._symbolService.deleteFavourite(userid, symbolid).subscribe(() => {
                            this.watchListArrayLength.next(this.watchListArrayLength.value - 1)
                            this.toast.success('Symbol Removed from Favourite List')
                        }, (error => {
                            this.toast.error('Something Went Wrong', 'Error')
                        }));
                    }
                });
            })
            if (this.selectedAssetClass === AppConstants.ASSET_CLASS_EQUITIES) {
                this.equitySymbolsDataSource.data.map((res) => { if (res.securityCode == element.securityCode) { res.favourite = false } })
                this.equitySymbolsDataSource._updateChangeSubscription();
            }
            else if (this.selectedAssetClass === AppConstants.ASSET_CLASS_BONDS) {
                this.bondDataSource.data.map((res) => { if (res.securityCode == element.securityCode) { res.favourite = false } })
                this.bondDataSource._updateChangeSubscription();
            }
            else if (this.selectedAssetClass === AppConstants.ASSET_CLASS_ETF) {
                this.etfDataSource.data.map((res) => { if (res.securityCode == element.securityCode) { res.favourite = false } })
                this.etfDataSource._updateChangeSubscription();
            }
        }

        else {
            this._symbolService.deleteFavourite(userid, symbolid).subscribe(() => {
                let index = this.watchlistSymbolsDataSource.data.indexOf(element)
                let numberOfElementToRemove = 1;
                if (index !== -1) { this.watchlistSymbolsDataSource.data.splice(index, numberOfElementToRemove) }
                // this.symbolsDataSource.data = this.watchlistSymbolsDataSource.data

                this.watchlistSymbolsDataSource._updateChangeSubscription();
                this.watchListArrayLength.next(this.watchListArrayLength.value - 1)
                this.toast.success('Symbol Removed from Favourite List')

                if (element.assetClass.assetId === AppConstants.ASSET_CLASS_ID_EQUITIES) {
                    this.equitySymbolsDataSource.data.map((res) => { if (res.securityCode == element.securityCode) { res.favourite = false } })
                    this.equitySymbolsDataSource._updateChangeSubscription();
                }
                else if (element.assetClass.assetId === AppConstants.ASSET_CLASS_ID_BONDS) {
                    this.bondDataSource.data.map((res) => { if (res.securityCode == element.securityCode) { res.favourite = false } })
                    this.bondDataSource._updateChangeSubscription();
                }
                else if (element.assetClass.assetId === AppConstants.ASSET_CLASS_ID_ETFS) {
                    this.etfDataSource.data.map((res) => { if (res.securityCode == element.securityCode) { res.favourite = false } })
                    this.etfDataSource._updateChangeSubscription();
                }
            }, (error => {
                this.toast.error('Something Went Wrong', 'Error')
            }));
        }
    }

    getAllTradingSymbols() {
        this.getTrendingSymbol(AppConstants.ASSET_CLASS_ID_EQUITIES)
        this.getTrendingSymbol(AppConstants.ASSET_CLASS_ID_BONDS)
        this.getTrendingSymbol(AppConstants.ASSET_CLASS_ID_ETFS)
    }

}

