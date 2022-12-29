import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {User} from "../../../../core/user/user.types";

import SwiperCore, {Autoplay, Pagination, Navigation} from "swiper";

SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
    selector: 'stock-market',
    templateUrl: './stock-market.component.html',
    styleUrls: ['./stock-market.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class StockMarketComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    currentUser: User;

    constructor(
        private _router: Router) {
    }

    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('user'));
    }

    becomeAnInvestor(): void {
        window.open(`http://192.168.36.61:4200/initial-reg/${this.currentUser.userId}`, '_blank');
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


}
