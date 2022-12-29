import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { SharedModule } from 'app/shared.module';


import { DialogCmp } from './modules/admin/back-office/user-site/dialog/dialog.component';

@NgModule({
  imports: [CommonModule, WjInputModule,SharedModule],
  declarations: [],
  exports: []
})
export class MarlinCommonModule {
}
