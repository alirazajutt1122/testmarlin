import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';
import { authSignInRoutes } from 'app/modules/auth/sign-in/sign-in.routing';

import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {NgApexchartsModule} from "ng-apexcharts";
import {AuthSharedModule} from "../market-watch-public/market-watch-public.module";
import {MatSelectModule} from "@angular/material/select";

import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from 'app/transloco/transloco-root.module';
import {LanguagesModule} from "../../../layout/common/languages/languages.module";
import { AboutUsComponent } from '../About-Us/about-us';
import { ContactUsComponent } from '../Contact-Us/contact-us';
import { FAQsComponent } from '../FAQs/faqs';
import {MatExpansionModule} from '@angular/material/expansion';





@NgModule({
    declarations: [
        AuthSignInComponent,
        AboutUsComponent,
        ContactUsComponent,
        FAQsComponent
    ],
    exports: [
        AuthSignInComponent
    ],
    imports: [
        RouterModule.forChild(authSignInRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule,
        MatMenuModule,
        MatDividerModule,
        MatButtonToggleModule,
        MatTableModule,
        MatSortModule,
        NgApexchartsModule,
        AuthSharedModule,
        MatSelectModule,
        MatIconModule,
        HttpClientModule,
        TranslocoRootModule,
        LanguagesModule,
        MatExpansionModule,
    
        

    ]
})
export class AuthSignInModule
{
}
