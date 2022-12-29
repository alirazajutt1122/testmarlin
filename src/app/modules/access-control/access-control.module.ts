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
import { AccessControlRoutingModule } from './access-control-routing.module';
import { UserPage } from './user-management/user-page';
import { RolePage } from './role/role-page';
import { RolePrivsPage } from './privilege/role-privs-page';


@NgModule({
  declarations: [
    UserPage,
    RolePage,
    RolePrivsPage
  ],
  imports: [
    RouterModule.forChild(AccessControlRoutingModule),
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
export class AccessControlModule { }
