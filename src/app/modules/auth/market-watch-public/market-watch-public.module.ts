import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSharedComponent } from './market-watch-public.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FuseAlertModule} from "../../../../@fuse/components/alert";
import {FuseCardModule} from "../../../../@fuse/components/card";
import {LanguagesModule} from "../../../layout/common/languages/languages.module";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {TrendingModule} from "../../admin/dashboard/trending/trending.module";
import { TranslocoRootModule } from 'app/transloco/transloco-root.module';
import { TruncatePipe } from './truncate.pipe';
import { OrderNewModule } from 'app/modules/admin/oms/order/order.module';

import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';


import { AlertModule } from 'ngx-bootstrap/alert';
import { MarlinCommonModule } from 'app/common.module';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from 'app/services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { DataServiceOMS } from 'app/services-oms/data-oms.service';



@NgModule({
    declarations: [
        AuthSharedComponent,
        TruncatePipe,

    ],
    exports: [
        AuthSharedComponent,

    ],
    imports: [
        CommonModule,
        NgApexchartsModule,
        MatIconModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        FuseAlertModule,
        FuseCardModule,
        LanguagesModule,
        ReactiveFormsModule,
        RouterModule,
        MatCheckboxModule,
        MatButtonModule,
        MatProgressBarModule,
        TrendingModule,



        TranslocoRootModule,
        LanguagesModule,
    ],


})
export class AuthSharedModule { }
