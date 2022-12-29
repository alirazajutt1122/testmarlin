import {Injectable} from '@angular/core';
import {cloneDeep} from 'lodash-es';
import {FuseNavigationItem} from '@fuse/components/navigation';
import {FuseMockApiService} from '@fuse/lib/mock-api';
import {defaultNavigation} from 'app/mock-api/common/navigation/data';
import {adminNavigation} from 'app/mock-api/common/navigation/data';
import { AuthService2 } from 'app/services/auth2.service';
import { AppConstants } from 'app/app.utility';

@Injectable({
    providedIn: 'any'
})
export class NavigationMockApi {
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _adminNavigation: FuseNavigationItem[] = adminNavigation;

    constructor(private _fuseMockApiService: FuseMockApiService,private userService: AuthService2,) {
        if (AppConstants.userType === 'MARLIN ADMIN') {
            this.adminRegisterHandlers()
          }
          else {
            this.registerHandlers()
          }
    }

    registerHandlers(): void {
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {
                return [200, {default: cloneDeep(this._defaultNavigation)}]
            });
    }
    adminRegisterHandlers(): void {
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {
                return [200, {default: cloneDeep(this._adminNavigation)}]
            });
    }
}
