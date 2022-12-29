import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from 'app/transloco/transloco-root.module';
import { LanguagesModule } from "../../../layout/common/languages/languages.module";
import { DashboardBoComponent } from './dashboard-bo';
import { DashboardBoRoutes } from './dashboard-bo.routing';
import { DashboardBoClientComponent } from './dashboard-bo-client/dashboard-bo-client';
import { WjChartModule } from '@grapecity/wijmo.angular2.chart';
import { WjChartAnimationModule } from '@grapecity/wijmo.angular2.chart.animation';
import { TopBuyersComponent } from './top-buyers/top-buyers';
import { TranslateModule } from '@ngx-translate/core';
import { TopSellersComponent } from './top-sellers/top-sellers';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { MatTableModule } from '@angular/material/table';
import { CashObligationComponent } from './settlement-position/cash-obligation/cash-obligation';
import { DeliveryObligationComponent } from './settlement-position/delivery-obligation/delivery-obligation';
import { FuseCardModule } from '@fuse/components/card';
import { TopPerformersComponent } from './top-performers/top-performers';
import { SystemStatsComponent } from './system-stats/system-stats';
import { RejectedOrdersComponent } from './rejected-orders/rejected-orders';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
@NgModule({
    declarations: [
        DashboardBoComponent,
        DashboardBoClientComponent,
        TopBuyersComponent,
        TopSellersComponent,
        DeliveryObligationComponent,
        CashObligationComponent,
        TopPerformersComponent,
        SystemStatsComponent,
        RejectedOrdersComponent
    ],
    imports: [
        RouterModule.forChild(DashboardBoRoutes),
        HttpClientModule,
        TranslocoRootModule,
        LanguagesModule,
        WjChartModule,
        WjChartAnimationModule,
        TranslateModule,
        WjInputModule,
        MatTableModule,
        FuseCardModule,
        FormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        CommonModule


    ],
    providers: [
    ],
    exports: [

    ]
})
export class DashboardBoModule {
}
