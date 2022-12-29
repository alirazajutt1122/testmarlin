import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { LayoutComponent } from 'app/layout/layout.component';
import { OrderNewModule } from 'app/modules/admin/oms/order/order.module';
import { NegotiationModule } from 'app/modules/admin/oms/negotiation/negotiation.module';
import { SharedModule } from 'app/shared/shared.module';
import {ClassyLayoutModule} from "./layouts/classy/classy.module";
import {EmptyLayoutModule} from "./layouts/empty/empty.module";
import { RepoModule } from 'app/modules/admin/oms/repo/repo.module';


const layoutModules = [
    ClassyLayoutModule,
];

@NgModule({
    declarations: [
        LayoutComponent,

    ],
    imports: [
        MatIconModule,
        MatTooltipModule,
        FuseDrawerModule,
        SharedModule,
        ...layoutModules,
        EmptyLayoutModule,
        OrderNewModule, 
        NegotiationModule ,
        RepoModule
       
    ],
    exports     : [
        LayoutComponent,
        ...layoutModules,

    ]
})
export class LayoutModule
{
}
