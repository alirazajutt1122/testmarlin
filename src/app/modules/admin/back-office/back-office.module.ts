import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BackOfficeComponent} from './back-office.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {BackOfficeRouting} from "./back-office.routing.module";
import {MatButtonModule} from "@angular/material/button";
import {FuseLoadingBarModule} from "../../../../@fuse/components/loading-bar";
import { EquitiesModule } from './equities/equities.module';
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from '@grapecity/wijmo.angular2.grid.detail';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VaultModule } from './vault/vault.module';
import { SetupModule } from './setup/setup.module';
import { FinancialModule } from './financials/financials.module';

@NgModule({
    declarations: [
        BackOfficeComponent,

    ],
    imports: [
        RouterModule.forChild(BackOfficeRouting),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        FuseLoadingBarModule,
        WjCoreModule,
        WjInputModule,
        WjGridModule,
        WjGridFilterModule,
        WjGridDetailModule,
        
        EquitiesModule,
        VaultModule,
        SetupModule,
        FinancialModule

    ]
})
export class BackOfficeModule {
}
