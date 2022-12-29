import { Route } from '@angular/router';
import { ActualPortfolioComponent } from './actual-portfolio.component';
import { PortfolioComponent } from './portfolio.component';


export const PortfolioRoutingModule: Route[] = [

    {
        path: 'virtual-portfolio',
        component: PortfolioComponent
    },
    {
        path : 'actual-portfolio',
        component : ActualPortfolioComponent
    }
];