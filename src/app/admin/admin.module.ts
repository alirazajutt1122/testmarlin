import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from '@grapecity/wijmo.angular2.grid.detail';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRouting } from './admin.routing';
import { AdminDashboard } from './dashboard-admin.component';
import { SharedModule } from 'app/shared.module';
import { FuseCardModule } from '@fuse/components/card';
import { MarketPage } from './market-page/market-page';
import { FISecurityPage } from './fixed-income-security-page';
import { SecurityPage } from './security-page/security-page';
import { ExchangePage } from './exchange-page/exchange-page';
import { EMAssociationPage } from './exch-mark-association-page/exch-mark-association-page';
import { WidgetModule } from 'app/layout/widget/widget.module';
import { ExchangeMarketSecurityPage } from './exch-mark-security-page';
import { SettlementType } from 'app/models/settlement-type';
import { SettlementCalendar } from 'app/models/settlement-calendar';
import { SettlementTypePage } from './settlement-type-page';
import { SettlementCalanderPage } from './settlement-calander-comp';
import { ParticipantPage } from './participant-page';
import { CountryPage } from './country/country-page';
import { CityPage } from './city/city-page';
import { HolidaysPage } from './holidays/holidays-page';
import { RegistrarPage } from './registrar/registrar-page';
import { ResetParticipantPage } from './reset/reset-participant-page';
import { SectorPage } from './sector/sector-page';
import { ClearHouseLeviesPage } from './clear-house-levies/clear-house-levies-page';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';

@NgModule({
    declarations: [
        AdminDashboard,
        SecurityPage,
        FISecurityPage,
        ExchangeMarketSecurityPage,
        MarketPage,
        ExchangePage,
        EMAssociationPage, 
        SettlementTypePage, 
        SettlementCalanderPage,
        ParticipantPage,
        CountryPage,
        CityPage,
        HolidaysPage,
        RegistrarPage,
        ResetParticipantPage,
        SectorPage,
        ClearHouseLeviesPage
    ],
    imports: [
        RouterModule.forChild(AdminRouting),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        WjCoreModule,
        WjInputModule,
        WjGridModule,
        WjGridFilterModule,
        WjGridDetailModule,
        SharedModule,
        FuseCardModule,
        WidgetModule
    ],
    providers : [
        
    ]
})
export class adminModule {
}
