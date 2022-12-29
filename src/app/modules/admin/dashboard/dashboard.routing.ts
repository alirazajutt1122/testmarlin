import { Route } from '@angular/router';
import { DashboardComponent } from "./dashboard.component";
import { DashboardResolvers } from "./dashboard.resolvers";

export const dashboardRoutes: Route[] = [
    {
        path: '',
        component: DashboardComponent,
        resolve: {
            data: DashboardResolvers
        }
    }
];
