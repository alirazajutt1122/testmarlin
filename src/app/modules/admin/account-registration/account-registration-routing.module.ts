import {Route} from '@angular/router';
import {AccountRegistrationComponent} from "./account-registration.component";

export const AccountRegistrationRoutingModule: Route[] = [
    {
        path: '',
        component: AccountRegistrationComponent,
    }, {
        path: 'individual-registration',
        loadChildren: () => import('app/modules/admin/account-registration/individual-registration-form/individual-registration-form.module').then(m => m.IndividualRegistrationFormModule)
    },
    {
        path: 'corporate-registration',
        loadChildren: () => import('app/modules/admin/account-registration/corporate-registration-form/corporate-registration-form.module').then(m => m.CorporateRegistrationFormModule)
    }
];
