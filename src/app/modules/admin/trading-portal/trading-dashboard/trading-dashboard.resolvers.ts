import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {TradingPortalService} from "../trading-portal.service";

@Injectable({
    providedIn: 'root'
})

export class TradingDashboardResolvers implements Resolve<any> {
    constructor(private tradingPortalService: TradingPortalService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
         //  return;
           return this.tradingPortalService.getData();
    }
}
