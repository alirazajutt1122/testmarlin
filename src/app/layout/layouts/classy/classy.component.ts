import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from "@angular/material/dialog";
import {
    SymbolAddDialogComponent
} from "../../../modules/common-components/symbol-add-dialog/symbol-add-dialog.component";
import { DomSanitizer } from "@angular/platform-browser";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { SymbolAddDialogComponentService } from 'app/modules/common-components/symbol-add-dialog/symbol-add-dialog.component.service';
import { TradingPortalService } from 'app/modules/admin/trading-portal/trading-portal.service';
import { TradingDashboardService } from 'app/modules/admin/trading-portal/trading-dashboard/trading\'dashboard.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen/splash-screen.service';
import { AppConstants } from 'app/app.utility';
import { DashboardSidebar } from 'app/modules/admin/dashboard/right-sidebar/dashboard-sidebar';

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    styleUrls: ['./classy.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    userid: Number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    langs = this.translationService.getAvailableLangs();
    activelang = this.translationService.getActiveLang();
    currentLang: any;
    allSecurities: any[] = [];
    tradeType: boolean = false;
    tradeTypeDisabled: boolean = false;
    currentTradeType: string;
    claims: any;
    publicMenu = true
    @ViewChild(DashboardSidebar) dashboardSidebar: DashboardSidebar;

    constructor(
        private _activatedRoute: ActivatedRoute,
        public _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private translationService: TranslocoService,
        private _matDialog: MatDialog,
        private sanitizer: DomSanitizer,
        private toast: ToastrService,
        private _symbolService: SymbolAddDialogComponentService,
        private tradingPortalService: TradingPortalService,
        private tradingDashboardService: TradingDashboardService,
        private splash: FuseSplashScreenService

    ) {
        this.claims = AppConstants.claims2;
        if (this.claims.user.userType == "MARLIN ADMIN") {
            this.publicMenu = false
        }

        this.currentLang = localStorage.getItem("lang")
        if (this.currentLang != null) {
            this.translationService.setActiveLang(this.currentLang)
            this.activelang = this.translationService.getActiveLang();
        }

        this.currentTradeType = localStorage.getItem("tradeType");
        if (this.currentTradeType != undefined || this.currentTradeType != '' || this.currentTradeType != null) {

            if (this.currentTradeType === 'gTrade') {
                this.tradeType = true;
                AppConstants.tradeType = 'gTrade';
                AppConstants.tradeType = 'gTrade';
                localStorage.setItem('tradeType', 'gTrade');
            }
            if (this.currentTradeType === 'vTrade') {

                this.tradeType = false;
                AppConstants.tradeType = 'vTrade';
                AppConstants.tradeType = 'vTrade';
                localStorage.setItem('tradeType', 'vTrade');
            }
        }


        let user = JSON.parse(localStorage.getItem('user'));
        this.userid = user?.id;
        this.checkTradeType();
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }

    ngOnInit(): void {
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this._userService.getAllSecurities().subscribe((data) => {
        });

        this.getRibbonOnConstruct()





    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }








    public checkTradeType = () => {
        if (AppConstants.participantId === null) {
            this.tradeType = false;
            this.tradeTypeDisabled = true;
            AppConstants.tradeType = 'vTrade';
            AppConstants.tradeType = 'vTrade';
            localStorage.setItem('tradeType', 'vTrade');
        }
        else {
            this.tradeType = true;
            this.tradeTypeDisabled = false;
            AppConstants.tradeType = 'gTrade';
            AppConstants.tradeType = 'gTrade';
            localStorage.setItem('tradeType', 'gTrade');
        }
    }





    public onChangeTrade = (event) => {

        if (AppConstants.participantId !== null && event === false) {
            this.tradeType = true;
            this.tradeTypeDisabled = false;
            AppConstants.tradeType = 'vTrade';
            AppConstants.tradeType = 'vTrade';
            localStorage.setItem('tradeType', 'vTrade');

        }

        if (AppConstants.participantId !== null && event === true) {
            this.tradeType = false;
            this.tradeTypeDisabled = false;
            AppConstants.tradeType = 'gTrade';
            AppConstants.tradeType = 'gTrade';
            localStorage.setItem('tradeType', 'gTrade');
        }
    }












    public drawerCloseOpen = () => {
        this._userService.setOC(true);
    }













    toggleNavigation(name: string): void {
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);
        if (navigation) navigation.toggle();
    }

    setActiveLang(lang: any) {
        this.translationService.setActiveLang(lang)
        this.activelang = lang
        localStorage.setItem("lang", lang)
        window.location.reload();
    }

    onClickAddSymbols() {
        this._matDialog.open(SymbolAddDialogComponent, {
            autoFocus: false,
            position: { top: '5%' },
            data: { 'allPreviousSymbols': this.allSecurities }
        }).afterClosed().subscribe((data) => {
            data?.markedSecurities?.map((ele) => {
                
                if (ele.securityImage != null) {
                    let objectURL = 'data:image/png;base64,' + ele.securityImage;
                    ele.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                }
                else {
                    ele.src = "assets/images/marlin-dashboard/silver.png"
                }
                if (ele.assetClass == null) {
                    this.toast.error('Something Went Wrong With Asset Class', 'Error')
                }
                if (ele.assetClass.assetCode == AppConstants.ASSET_CODE_EQUITIES) {
                    ele.borderColor = AppConstants.equityColor
                }
                else if (ele.assetClass.assetCode == AppConstants.ASSET_CODE_BONDS) {
                    ele.borderColor = AppConstants.bondsColor
                }
                else if (ele.assetClass.assetCode == AppConstants.ASSET_CODE_ETF) {
                    ele.borderColor = AppConstants.etfColor
                }


                else if (ele.assetClass.assetCode == "CRYPTO") {
                    ele.borderColor = AppConstants.cryptoColor
                }
                else if (ele.assetClass.assetCode == "CMDTY") {
                    ele.borderColor = AppConstants.commoditiesColor
                }
                else if (ele.assetClass.assetCode == "REALES") {
                    ele.borderColor = AppConstants.realEstateColor
                }

                ele.lastTradePrice = ele.securityStatsDTO?.lastTradePrice
            })
            let last = data?.markedSecurities.length - 1
            let symbol = data?.markedSecurities[last].securityCode
            this._symbolService.getRibbons(this.userid, data?.markedSecurities[length].exchangeCode).subscribe((ribbon) => {

                let include = ribbon.some(ribbon => ribbon.securityCode === symbol);
                if (!include) {
                    if (data?.markedSecurities.length) {
                        this.allSecurities.push(data.markedSecurities[last])
                        this.saveRibbon(this.userid, data.markedSecurities[last])
                    }
                }
                else this.toast.warning('Ribbon already added', 'Alert')
            })
        })
    }

    onClickCard(security) {
        
        security?.securityTradedData?.close ?
            this._router.navigate([`/trading-portal/trading-graph/${security.exchangeCode}/${security.marketCode}/${security.securityCode}`]) :
            this.toast.warning('No Record Found Against this Symbol', 'No Data')
    }

    onRemoveSymbol(security) {
        const oldObj = this.allSecurities.find(ele => ele.securityCode === security.securityCode);
        const tempIndex = this.allSecurities.indexOf(oldObj);
        this.allSecurities.splice(tempIndex, 1);

        this._symbolService.getRibbons(this.userid, security.exchangeCode).subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                if (security.securityCode == data[i].securityCode) {
                    this._symbolService.deleteRibbon(this.userid, data[i].ribbId).subscribe(() => {
                    }, (error => {
                        this.toast.error('Something Went Wrong', 'Error')
                    }));
                }
            }
        })
    }

    saveRibbon(userid: Number, data: any) {
        let ribbon: any = {}
        ribbon.userId = userid
        ribbon.exchangeCode = data.exchangeCode
        ribbon.marketCode = data.marketCode
        ribbon.securityCode = data.securityCode
        this._symbolService.saveRibbon(ribbon).subscribe(() => {
        })
    }

    getRibbons() {
        this._symbolService.getRibbons(this.userid, AppConstants.exchangeCode).subscribe(data => {
        }, (error => {
            this.toast.error('Something Went Wrong', 'Error')
        }));
    }

    getRibbonOnConstruct() {
        this._symbolService.getRibbons(this.userid, AppConstants.exchangeCode).subscribe((data) => {


            data?.map((ele) => {
                if (ele.securityImage != null) {
                    let objectURL = 'data:image/png;base64,' + ele.securityImage;
                    ele.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                }
                if (ele.assetClass.assetCode == AppConstants.ASSET_CODE_EQUITIES) {
                    ele.borderColor = AppConstants.equityColor
                }
                else if (ele.assetClass.assetCode == AppConstants.ASSET_CODE_BONDS) {
                    ele.borderColor = AppConstants.bondsColor
                }
                else if (ele.assetClass.assetCode == AppConstants.ASSET_CODE_ETF) {
                    ele.borderColor = AppConstants.etfColor
                }
                else if (ele.assetClass.assetCode == "CRYPTO") {
                    ele.borderColor = AppConstants.cryptoColor
                }
                else if (ele.assetClass.assetCode == "CMDTY") {
                    ele.borderColor = AppConstants.commoditiesColor
                }
                else if (ele.assetClass.assetCode == "REALES") {
                    ele.borderColor = AppConstants.realEstateColor
                }
                ele.lastTradePrice = ele.securityStatsDTO?.lastTradePrice
                const requiredDataLength = 1;
                this.tradingPortalService.getKlineGraphDataDynamic(ele.exchangeCode, ele.securityCode, requiredDataLength)
                    .subscribe((Klinedata) => {
                        ele.securityTradedData = Klinedata[0]
                    });
            })
            this.allSecurities = data
        })
    }
}
