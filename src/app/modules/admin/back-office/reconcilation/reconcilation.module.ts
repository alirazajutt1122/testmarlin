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
import { ReconcilationRoutingModule } from './reconcilation-routing.module';
import { CdcClientAssets } from './client-assets-segregation/cdc-client-assets-segregation';
import { CdcReconcilation } from './cdc/cdc-reconcilation';
import { ClientsCash } from './clients-cash/clients-cash';




@NgModule({
  declarations: [
    CdcClientAssets,
    CdcReconcilation,
    ClientsCash
  ],
  imports: [
    RouterModule.forChild(ReconcilationRoutingModule),
    CommonModule,
    WjCoreModule,
    WjInputModule,
    WjGridModule,
    WjGridFilterModule,
    WjGridDetailModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    
  ],
})
export class ReconcilationModule { }