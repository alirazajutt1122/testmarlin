import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrendingComponent} from './trending.component';
import {FuseCardModule} from "../../../../../@fuse/components/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {NgApexchartsModule} from "ng-apexcharts";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {RouterModule} from "@angular/router";

import {HttpClientModule} from '@angular/common/http';
import {TranslocoRootModule} from 'app/transloco/transloco-root.module';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';


@NgModule({
    declarations: [
        TrendingComponent
    ],
    imports: [
        CommonModule,
        FuseCardModule,
        MatProgressBarModule,
        MatButtonModule,
        MatDividerModule,
        NgApexchartsModule,
        MatIconModule,
        MatMenuModule,
        RouterModule,
        HttpClientModule,
        TranslocoRootModule,
        LanguagesModule
    ],
    exports: [
        TrendingComponent
    ]
})
export class TrendingModule {
}
