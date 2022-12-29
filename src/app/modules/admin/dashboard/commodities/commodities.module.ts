import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CommoditiesComponent} from './commodities.component';
import {FuseCardModule} from "../../../../../@fuse/components/card";


@NgModule({
    declarations: [
        CommoditiesComponent
    ],
    imports: [
        CommonModule,
        FuseCardModule
    ], exports: [
        CommoditiesComponent
    ]
})
export class CommoditiesModule {
}
