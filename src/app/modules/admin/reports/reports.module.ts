import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { ReportsRouting } from './reports.routing';
import { MatButtonModule } from "@angular/material/button";
import { FuseLoadingBarModule } from "../../../../@fuse/components/loading-bar";
import { VirtualTradeHistoryReportComponent } from './virtual-trade-hostory-report/virtual-trade-history-report.component';
import { MatTableModule } from '@angular/material/table';
 

@NgModule({
    declarations: [
        ReportsComponent,
        
        VirtualTradeHistoryReportComponent
    ],
    imports: [
        RouterModule.forChild(ReportsRouting),
        CommonModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        FuseLoadingBarModule,
        MatTableModule
    ]
})
export class ReportsModule {
}