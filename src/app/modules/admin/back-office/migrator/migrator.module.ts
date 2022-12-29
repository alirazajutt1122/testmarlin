import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";

import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from '@grapecity/wijmo.angular2.grid.detail';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import 'bootstrap-slider/dist/bootstrap-slider.js';
import {MatSliderModule} from '@angular/material/slider';

import { MigratorRoutingModule } from './migrator-routing.module';
import { ClientsUploaderPage } from './clients/clients-uploader-page';
import { ClientsSetupUploaderPage } from './clients-setup/clients-setup-uploader-page';
import { COAUploaderPage } from './chart-of-accounts/coa-uploader-page';
import { TransactionsUploaderPage } from './transactions/transactions-uploader-page';
import { AgentUploaderPage } from './agent/agent-uploader-page';
import { ClosingRatesUploaderPage } from './closing-rates/closing-rates-uploader-page';
import { CommissionSlabUploaderPage } from './commission-slab/commission-slab-uploader-page';
import { ExportFile } from './export-file/export-file';
import { FutureOpenTradeUploaderPage } from './future-open-trade/Future-Open-Trade-uploader-page';
import { VaultUploaderPage } from './vault/vault-uploader-page';
import { VoucherUploaderPage } from './voucher/voucher-uploader-page';
import { VarAndSecurityHaircut } from './var-and-security-haircut/var-and-security-haircut';
import { CapitalGaintaxUploaderPage } from './capital-gain-tax/capital-gain-tax-uploader-page';


@NgModule({
  declarations: [
    ClientsUploaderPage,
    ClientsSetupUploaderPage,
    COAUploaderPage,
    TransactionsUploaderPage,
    AgentUploaderPage,
    ClosingRatesUploaderPage,
    CommissionSlabUploaderPage,
    ExportFile,
    FutureOpenTradeUploaderPage,
    VaultUploaderPage,
    VoucherUploaderPage,
    VarAndSecurityHaircut,
    CapitalGaintaxUploaderPage
  ],
  imports: [
    RouterModule.forChild(MigratorRoutingModule),
    CommonModule,
    WjCoreModule,
    WjInputModule,
    WjGridModule,
    WjGridFilterModule,
    WjGridDetailModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxExtendedPdfViewerModule,
    MatSliderModule
  ],
})
export class MigratorModule { }