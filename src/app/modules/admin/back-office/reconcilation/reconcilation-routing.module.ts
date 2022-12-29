import {Route} from '@angular/router';
import { CdcReconcilation } from './cdc/cdc-reconcilation';
import { CdcClientAssets } from './client-assets-segregation/cdc-client-assets-segregation';
import { ClientsCash } from './clients-cash/clients-cash';




export const ReconcilationRoutingModule: Route[] = [
    {
        path: 'cdc-client-assets-segregation',
        component:CdcClientAssets,
    },
    {
        path: 'cdc-reconcilation',
        component:CdcReconcilation,
    },
    {
        path: 'clients-cash',
        component:ClientsCash,
    },
  
    
    
];