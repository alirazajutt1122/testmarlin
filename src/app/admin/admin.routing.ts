import { Route } from '@angular/router';
import { CityPage } from './city/city-page';
import { ClearHouseLeviesPage } from './clear-house-levies/clear-house-levies-page';
import { CountryPage } from './country/country-page';
import { AdminDashboard } from './dashboard-admin.component';
import { EMAssociationPage } from './exch-mark-association-page/exch-mark-association-page';
import { ExchangeMarketSecurityPage } from './exch-mark-security-page';
import { ExchangePage } from './exchange-page/exchange-page';
import { FISecurityPage } from './fixed-income-security-page';
import { HolidaysPage } from './holidays/holidays-page';
import { MarketPage } from './market-page/market-page';
import { ParticipantPage } from './participant-page';
import { RegistrarPage } from './registrar/registrar-page';
import { ResetParticipantPage } from './reset/reset-participant-page';
import { SectorPage } from './sector/sector-page';
import { SecurityPage } from './security-page/security-page';
import { SettlementCalanderPage } from './settlement-calander-comp';
import { SettlementTypePage } from './settlement-type-page';



export const AdminRouting: Route[] = [
    {
        path: 'dashboard-admin',
        component: AdminDashboard,
    },
    {
        path: 'security-page',
        component: SecurityPage,
    },
    {
        path: 'fixed-income-security-page',
        component: FISecurityPage,
    },
    {
        path: 'market-page',
        component: MarketPage,
    },
    {
        path: 'exchange-page',
        component: ExchangePage,
    },
    {
        path: 'exch-mark-association-page',
        component: EMAssociationPage,
    }, 
    {
        path: 'exch-mark-security-page',
        component: ExchangeMarketSecurityPage,
    }, 
    {
        path: 'settlement-type-page',
        component: SettlementTypePage,
    }, 
    {
        path: 'settlement-calandar-page',
        component: SettlementCalanderPage,
    }, 
    {
        path: 'participant-page',
        component: ParticipantPage,
    }, 
    {
        path: 'country-page',
        component: CountryPage,
    }, 
    {
        path: 'city-page',
        component: CityPage,
    }, 
    {
        path: 'holidays-page',
        component: HolidaysPage,
    },
    {
        path: 'registrar-page',
        component: RegistrarPage,
    },
    {
        path: 'reset-participant-page',
        component: ResetParticipantPage,
    }, 
    {
        path: 'sector-page',
        component: SectorPage,
    },
    {
        path: 'clear-house-levies-page',
        component: ClearHouseLeviesPage,
    },

];
