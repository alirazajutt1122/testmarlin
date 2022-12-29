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
import { VaultRoutingModule } from './vault-routing.module';
import { StockDepositWithdrawCmp } from './stock-deposit-withdraw/stock-deposit-withdraw';
import { StockReceiptRpt } from './Reports/stock-receipt/stock-receipt-rpt';
import { StockActivityRpt } from './Reports/stock-activity/stock-activity-rpt';
import { StockActivityPledgeReleaseRpt } from './Reports/stock-activity-pledge-release/stock-activity-pledge-release-rpt';
import { ShareHoldingRpt } from './Reports/share-holding/share-holding-rpt';
import { ClientPreSettlementDeliveryRpt } from './Reports/client-pre-settlement-delivery/client-pre-settlement-delivery-rpt';




@NgModule({
  declarations: [
    StockDepositWithdrawCmp,
    StockReceiptRpt,
    StockActivityRpt,
    StockActivityPledgeReleaseRpt,
    ShareHoldingRpt,
    ClientPreSettlementDeliveryRpt
  ],
  imports: [
    RouterModule.forChild(VaultRoutingModule),
    CommonModule,
    WjCoreModule,
    WjInputModule,
    WjGridModule,
    WjGridFilterModule,
    WjGridDetailModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxExtendedPdfViewerModule
  ],
})
export class VaultModule { }
