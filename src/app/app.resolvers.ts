import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {NavigationService} from 'app/core/navigation/navigation.service';
import {UserService} from 'app/core/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {

    constructor(
        private _navigationService: NavigationService,
        private _userService: UserService,
    ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return forkJoin([
            this._navigationService.get(),
        ]);
    }
}
