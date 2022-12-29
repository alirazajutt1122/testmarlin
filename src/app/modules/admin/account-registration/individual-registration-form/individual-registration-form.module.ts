import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndividualRegistrationFormComponent} from './individual-registration-form.component';
import {PersonalDataOfApplicantComponent} from './personal-data-of-applicant/personal-data-of-applicant.component';
import {NomineeFormComponent} from './nominee-form/nominee-form.component';
import {AttorneyFormComponent} from './attorney-form/attorney-form.component';
import {MatStepperModule} from "@angular/material/stepper";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {RouterModule} from "@angular/router";
import {AccountRegistrationRoutingModule} from "../account-registration-routing.module";
import {IndividualRegistrationFormRoutingModule} from "./individual-registration-form-routing.module";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FuseCardModule} from "../../../../../@fuse/components/card";
import {DeclarationDialogueComponent} from "./declaration-dialog/declaration-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {DeclarationIndComponent} from "./declaration-ind/declaration-ind.component";
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
    declarations: [
        IndividualRegistrationFormComponent,
        PersonalDataOfApplicantComponent,
        NomineeFormComponent,
        AttorneyFormComponent,
        DeclarationDialogueComponent,
        DeclarationIndComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(IndividualRegistrationFormRoutingModule),
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatGridListModule,
        MatAutocompleteModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatDatepickerModule,
        MatIconModule,
        MatCheckboxModule,
        FuseCardModule,
        MatDialogModule

    ]
})
export class IndividualRegistrationFormModule {
}
