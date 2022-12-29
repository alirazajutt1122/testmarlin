import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { AppConstants } from 'app/app.utility';
import {Observable} from 'rxjs';
import {AuthService} from "../../../core/auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthResolvers implements Resolve<any> {

    constructor(private authService: AuthService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        return this.authService.getLatestTrendingData(AppConstants.exchangeCode);
    }
}
