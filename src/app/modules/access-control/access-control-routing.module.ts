import {Route} from '@angular/router';
import { RolePrivsPage } from './privilege/role-privs-page';
import { RolePage } from './role/role-page';
import { UserPage } from './user-management/user-page';



export const AccessControlRoutingModule: Route[] = [
    {
        path: 'user-page',
        component:UserPage,
    },
    {
        path: 'role-page',
        component:RolePage,
    },
    {
        path: 'role-privs-page',
        component:RolePrivsPage,
    },
   
    
    
];
