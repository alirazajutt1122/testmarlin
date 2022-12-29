import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RestService} from "../../../services/api/rest.service";
import {BackOfficeUser, User} from "../../../core/user/user.types";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class BackofficeService {

    constructor(
        private _httpClient: HttpClient,
        private _restService: RestService,) {
    }

    getMarlinPSXUser(): Observable<BackOfficeUser[]> {
        const currentUser: User = JSON.parse(localStorage.getItem('user'));
        if (!currentUser) return
        return this._restService.get(false, 'user/userSubscriptions/' + `${currentUser.userId}`).pipe(
            tap((user) => {
                return user;
            })
        );
    }

}
