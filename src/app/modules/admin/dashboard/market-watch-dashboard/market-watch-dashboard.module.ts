import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgApexchartsModule} from "ng-apexcharts";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
// import {MatFormFieldModule} from "@angular/material/form-field";
// import {FuseAlertModule} from "../../../../@fuse/components/alert";
// import {FuseCardModule} from "../../../../@fuse/components/card";
// import {LanguagesModule} from "../../../layout/common/languages/languages.module";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
// import {TrendingModule} from "../../admin/dashboard/trending/trending.module";
import { TranslocoRootModule } from 'app/transloco/transloco-root.module';



import { TrendingModule } from '../trending/trending.module';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';
import { FuseCardModule } from '@fuse/components/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FuseAlertModule } from '@fuse/components/alert';
import { MarketWatchDashboardCmp } from './market-watch-dashboard';
import { OrderNewModule } from '../../oms/order/order.module';


@NgModule({
    declarations: [
        MarketWatchDashboardCmp,


    ],
    exports: [
        MarketWatchDashboardCmp,
    ],
    imports: [
        CommonModule,
        NgApexchartsModule,
        MatIconModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        FuseAlertModule,
        FuseCardModule,
        LanguagesModule,
        ReactiveFormsModule,
        RouterModule,
        MatCheckboxModule,
        MatButtonModule,
        MatProgressBarModule,
        TrendingModule,

        OrderNewModule,

        TranslocoRootModule,
        LanguagesModule,
    ],


})
export class MarketWatchDashboardModule { }
