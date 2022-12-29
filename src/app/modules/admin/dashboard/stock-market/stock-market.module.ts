import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StockMarketComponent} from './stock-market.component';
import {FuseCardModule} from "../../../../../@fuse/components/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {NgApexchartsModule} from "ng-apexcharts";
import {MatIconModule} from "@angular/material/icon";
import {SwiperModule} from "swiper/angular";
import { LanguagesModule } from 'app/layout/common/languages/languages.module';
import { TranslocoRootModule } from 'app/transloco/transloco-root.module';


@NgModule({
    declarations: [StockMarketComponent],
    imports: [
        CommonModule,
        FuseCardModule,
        MatProgressBarModule,
        MatButtonModule,
        MatDividerModule,
        NgApexchartsModule,
        MatIconModule,
        SwiperModule,
        TranslocoRootModule,
        LanguagesModule
    ],
    exports: [
        StockMarketComponent
    ]
})
export class StockMarketModule {
}
