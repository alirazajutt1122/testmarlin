import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { RestService } from "../../services/api/rest.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private allSecurities$: BehaviorSubject<any> = new BehaviorSubject(null);
    private allExchangeMarketSecurities$: BehaviorSubject<any> = new BehaviorSubject(null);


    private _highestChange$: BehaviorSubject<any> = new BehaviorSubject(null);
    highestChangeData$ = this._highestChange$.asObservable();


    private _highestBidChange$: BehaviorSubject<any> = new BehaviorSubject(null);
    highestBidChangeData$ = this._highestBidChange$.asObservable();


    private _lowestBidChange$: BehaviorSubject<any> = new BehaviorSubject(null);
    lowestBidChangeData$ = this._lowestBidChange$.asObservable();


    private openOrClose$ = new BehaviorSubject<any>({});
    selectedOC$ = this.openOrClose$.asObservable();

    currentValue$ = new Subject();
    totalValue$ = new Subject();
    netPL$ = new Subject();
    profit$: BehaviorSubject<any> = new BehaviorSubject(null);
    loss$: BehaviorSubject<any> = new BehaviorSubject(null);



    constructor(private _httpClient: HttpClient,
        private _restService: RestService,
        private toast: ToastrService) {

    }

    sendHighestChangeData(data) {
        this._highestChange$.next(data);

    }

    sendHighestBidData(data) {
        this._highestBidChange$.next(data);
    }

    sendLowestBidData(data) {
        this._lowestBidChange$.next(data);
    }



    setOC(data) {
        this.openOrClose$.next(data);
    }

    set user(value: User) {
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    get(userId): Observable<User> {
        return this._restService.get(false, `userTrade/user/${userId}`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    getAllSecurities() {
        return this._restService.get(false, 'securities/').pipe(
            tap((response: any) => {

                this.allSecurities$.next(response);
            }, (e) => {
                this.toast.error('Something Went Wrong', 'Error')
            })
        );
    }

    getAllSecuritiesOrderBook() {
        return this._restService.get(false, 'securities/');
    }



    getAllExchangeMarketSecurities() {
        return this._restService.get(false, 'vtrade/allExchangeMarketSecurities/');
    }


    getExchangeMarketSecurities() {
        return this._restService.get(false, 'vtrade/allExchangeMarketSecurities/').pipe(
            tap((response: any) => {
                this.allExchangeMarketSecurities$.next(response);
            }, (e) => {
                this.toast.error('Something Went Wrong', 'Error')
            })
        );
    }


    get getAllSecuritiesData$(): Observable<any> {
        return this.allSecurities$.asObservable();
    }

    get getAllExchangeMarketSecuritiesData$(): Observable<any> {
        return this.allExchangeMarketSecurities$.asObservable();
    }

    getUserTradeHoldings(userId: any) {
        return this._restService.get(true, 'userTrade/holding/' + userId)
    }

    // ................................................Portfolio Data..................................................................
    userHoldings(userId: any) {
        this.getUserTradeHoldings(userId).subscribe((res) => {

            let totalMarketVal : number = 0;
            let totalCostVal : number = 0;
            let netPL : number = 0;
            for (let i = 0; i < res.length; i++) {
                 
                if (res[i].holding > 0 && res[i].securityStatsDTO != null) {
                    
                    totalMarketVal += Number(res[i].holding * res[i].securityStatsDTO?.currentPrice)
                    totalCostVal += Number(res[i].totalCost)

                }
            }
            totalMarketVal = this.roundDownSignificantDigits(totalMarketVal,3)
            totalCostVal = this.roundDownSignificantDigits(totalCostVal,3)

            netPL = totalMarketVal - totalCostVal
            netPL = this.roundDownSignificantDigits(netPL,3)

            if (netPL >= 0) {
                this.profit$.next(true)
                this.loss$.next(false)

            }
            else {
                this.loss$.next(true)
                this.profit$.next(false)

            }

             this.currentValue$.next(totalMarketVal);
            this.totalValue$.next(totalCostVal);
            this.netPL$.next(netPL);

        })
    }

    currentValue$$(): Observable<any> {
        return this.currentValue$.asObservable()
    }
    totalValue$$(): Observable<any> {
        return this.totalValue$.asObservable()
    }
    netPL$$(): Observable<any> {
        return this.netPL$.asObservable()
    }
    loss$$(): Observable<any> {
        return this.loss$.asObservable()
    }
    profit$$(): Observable<any> {
        return this.profit$.asObservable()
    }
    // ................................................Portfolio Data..................................................................
    roundDownSignificantDigits(number, decimals) {
        let significantDigits = (parseInt(number.toExponential().split('e-')[1])) || 0;
        let decimalsUpdated = (decimals || 0) + significantDigits - 1;
        decimals = Math.min(decimalsUpdated, number.toString().length);

        return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
    }


}
