import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

import { MatDialog } from "@angular/material/dialog";
import { PortfolioDetailComponent } from 'app/modules/common-components/portfolio-detail/portfolio-detail.component';
import { AppConstants } from 'app/app.utility';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen/loader-screen.service';
import { environment } from 'environments/environment';
import * as io from 'socket.io-client';
import { AuthService } from 'app/core/auth/auth.service';



@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user'
})
export class UserComponent implements OnInit, OnDestroy {
    @Input() showAvatar: boolean = true;
    user: User;
    currentValue$ = new BehaviorSubject<number>(0);
    totalValue$ = new BehaviorSubject<number>(0);
    netPL$ = new BehaviorSubject<number>(0);
    profit: boolean = false
    loss: boolean = false
    profitColor = AppConstants.buyColor
    lossColor = AppConstants.sellColor
    data: any = { email: '' }

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    socket = io(environment.socketUrl, { 'forceNew': true });
    constructor(
        private _router: Router,
        private _userService: UserService,
        private _matDialog: MatDialog,
        private splash: FuseLoaderScreenService,
        private auth_service: AuthService

    ) {
        let user: User = JSON.parse(localStorage.getItem('user'));
        let user1 = JSON.parse(localStorage.getItem('user'));
        this.user = user;
        this.data.email = user1.userName
    }

    ngOnInit(): void {

        this._userService.userHoldings(this.user.id)
        this._userService.currentValue$$().subscribe(res => this.currentValue$.next(res))
        this._userService.totalValue$$().subscribe(res => this.totalValue$.next(res))
        this._userService.netPL$$().subscribe(res => this.netPL$.next(res))
        this._userService.loss$$().subscribe(res => this.loss = res)
        this._userService.profit$$().subscribe(res => this.profit = res)


    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    updateUserStatus(status: string): void {
        if (!this.user) {
            return;
        }
        this._userService.update({
            ...this.user,
            status
        }).subscribe();
    }

    signOut(): void {
        this.splash.show();
        this._router.navigate(['/sign-in']);
        sessionStorage.removeItem('token');
        localStorage.removeItem('MarlinToken');
        localStorage.removeItem('user');
        localStorage.removeItem('lang');
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.auth_service.signOutForStats(this.data).subscribe()
    }

    // userHoldings(userId: any) {
    //     this._userService.getUserTradeHoldings(userId).subscribe((res) => {
    //         let totalMarketVal = 0
    //         let totalCostVal = 0
    //         let netPL = 0
    //         for (let i = 0; i < res.length; i++) {

    //             if (res[i].holding > 0) {
    //                 totalMarketVal += Number(res[i].holding * res[i].securityStatsDTO.currentPrice)
    //                 totalCostVal += Number(res[i].totalCost)
    //             }
    //         }

    //         totalMarketVal = Number(totalMarketVal.toFixed(2))
    //         totalCostVal = Number(totalCostVal.toFixed(2))

    //         netPL = totalMarketVal - totalCostVal
    //         netPL = Number(netPL.toFixed(2))

    //         if (netPL >= 0) {
    //             this.profit = true
    //             this.loss = false
    //         }
    //         else {
    //             this.loss = true
    //             this.profit = false
    //         }
    //         console.log
    //         this.currentValue$.next(totalMarketVal);
    //         this.totalValue$.next(totalCostVal);
    //         this.netPL$.next(netPL);
    //     })
    // }


    refresh() {
        // this.userHoldings(this.user.id)
    }

    portfolioDetail() {
        // this.userHoldings(this.user.id)
        this._matDialog.open(PortfolioDetailComponent, {
            autoFocus: false,
            position: { top: '50px', right: '0px' },
            panelClass: 'portfolio-dialogue-container'
            

        }).afterClosed().subscribe((data) => {


        })
    }

}
