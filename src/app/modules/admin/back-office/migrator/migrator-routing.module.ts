import {Route} from '@angular/router';
import { AuthGuard } from 'app/auth.guard';
import { AgentUploaderPage } from './agent/agent-uploader-page';
import { COAUploaderPage } from './chart-of-accounts/coa-uploader-page';
import { ClientsSetupUploaderPage } from './clients-setup/clients-setup-uploader-page';
import { ClientsUploaderPage } from './clients/clients-uploader-page';
import { ClosingRatesUploaderPage } from './closing-rates/closing-rates-uploader-page';
import { TransactionsUploaderPage } from './transactions/transactions-uploader-page';
import { CommissionSlabUploaderPage } from './commission-slab/commission-slab-uploader-page';
import { ExportFile } from './export-file/export-file';
import { FutureOpenTradeUploaderPage } from './future-open-trade/Future-Open-Trade-uploader-page';
import { VaultUploaderPage } from './vault/vault-uploader-page';
import { VoucherUploaderPage } from './voucher/voucher-uploader-page';
import { VarAndSecurityHaircut } from './var-and-security-haircut/var-and-security-haircut';
import { CapitalGaintaxUploaderPage } from './capital-gain-tax/capital-gain-tax-uploader-page';


export const MigratorRoutingModule: Route[] = [
    {
        path: 'clients-uploader-page',
        component:ClientsUploaderPage,
    },
    {
        path: 'clients-setup-uploader-page',
        component:ClientsSetupUploaderPage,
    },
    {
        path: 'coa-uploader-page',
        component:COAUploaderPage,
    },
    {
        path: 'transactions-uploader-page',
        component:TransactionsUploaderPage,
    },
    {
        path: 'closing-rates-uploader-page',
        component:ClosingRatesUploaderPage,
    },
    {
        path: 'agent-uploader-page',
        component:AgentUploaderPage,
    },
    {
        path: 'commission-slab-uploader-page',
        component:CommissionSlabUploaderPage,
    },
    {
        path: 'export-file',
        component:ExportFile,
    },
    {
        path: 'future-open-trade-uploader-page',
        component:FutureOpenTradeUploaderPage,
    },
    {
        path: 'vault-uploader-page',
        component:VaultUploaderPage,
    },
    {
        path: 'voucher-uploader-page',
        component:VoucherUploaderPage,
    },
    {
        path: 'var-and-security-haircut',
        component:VarAndSecurityHaircut,
    },
    {
        path: 'capital-gain-tax-uploader-page',
        component:CapitalGaintaxUploaderPage,
    },
  
];