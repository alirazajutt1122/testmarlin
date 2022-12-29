import { Route } from '@angular/router';
import {BackOfficeComponent} from "./back-office.component";

export const BackOfficeRouting: Route[] = [
    {
        path: '',
        component: BackOfficeComponent,
    },
    {
        path: 'equities',
        loadChildren: () => import('app/modules/admin/back-office/equities/equities.module').then(m => m.EquitiesModule)
    },
    {
        path: 'vault',
        loadChildren: () => import('app/modules/admin/back-office/vault/vault.module').then(m => m.VaultModule)
    },
    {
        path: 'setup',
        loadChildren: () => import('app/modules/admin/back-office/setup/setup.module').then(m => m.SetupModule)
    },
    {
        path: 'financials',
        loadChildren: () => import('app/modules/admin/back-office/financials/financials.module').then(m => m.FinancialModule)
    },
    {
        path: 'migrator',
        loadChildren: () => import('app/modules/admin/back-office/migrator/migrator.module').then(m => m.MigratorModule)
    },
    {
        path: 'reconcilation',
        loadChildren: () => import('app/modules/admin/back-office/reconcilation/reconcilation.module').then(m => m.ReconcilationModule)
    }
];
