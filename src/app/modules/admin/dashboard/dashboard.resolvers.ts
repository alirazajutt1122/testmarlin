import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {DashboardService} from "./dashboard.service";
import {AuthService} from "../../../core/auth/auth.service";
import { AppConstants } from 'app/app.utility';

@Injectable({
    providedIn: 'root'
})
export class DashboardResolvers implements Resolve<any> {
    constructor(private _dashboardService: DashboardService, private authService: AuthService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.authService.getLatestTrendingData(AppConstants.exchangeCode);
    }
}
