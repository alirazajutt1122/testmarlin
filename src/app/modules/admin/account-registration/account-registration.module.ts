import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountRegistrationRoutingModule} from './account-registration-routing.module';
import {InitialRegistrationComponent} from './Initial-Forms/initial-registration/initial-registration.component';
import {RouterModule} from "@angular/router";
import {AccountRegistrationComponent} from './account-registration.component';
import {SharedModule} from "../../../shared/shared.module";
import {FuseAlertModule} from "../../../../@fuse/components/alert";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {FuseCardModule} from "../../../../@fuse/components/card";
import { AlreadyHaveOtpComponent } from './Initial-Forms/already-have-otp/already-have-otp.component';

@NgModule({
    declarations: [
        InitialRegistrationComponent,
        AccountRegistrationComponent,
        AlreadyHaveOtpComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(AccountRegistrationRoutingModule),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
        MatDatepickerModule,
        MatMomentDateModule,
        FuseCardModule
    ]
})
export class AccountRegistrationModule {
}
