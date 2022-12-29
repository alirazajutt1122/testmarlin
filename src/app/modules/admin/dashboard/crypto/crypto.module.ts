import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CryptoComponent} from './crypto.component';
import {FuseCardModule} from "../../../../../@fuse/components/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {NgApexchartsModule} from "ng-apexcharts";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {RouterModule} from "@angular/router";


@NgModule({
    declarations: [
        CryptoComponent
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
        RouterModule
    ],
    exports: [
        CryptoComponent
    ]
})
export class CryptoModule {
}
