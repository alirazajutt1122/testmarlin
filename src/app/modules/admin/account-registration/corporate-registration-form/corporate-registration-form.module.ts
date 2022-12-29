import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {CorporateRegistrationFormRoutingModule} from "./corporate-registration-form-routing.module";
import {CorporateRegistrationFormComponent} from './corporate-registration-form.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {InstructionsComponent} from "./instructions/instructions.component";
import {MatListModule} from "@angular/material/list";
import {AuthorizedTraderFormComponent} from "./authorized-trader-form/authorized-trader-form.component";
import {MarginDepositFormComponent} from "./margin-deposit-form/margin-deposit-form.component";
import {CollateralDetailFormComponent} from "./collateral-detail-form/collateral-detail-form.component";
import {FinancialInfoFormComponent} from "./financial-info-form/financial-info-form.component";
import {BankReferenceDetailsFormComponent} from "./bank-reference-details-form/bank-reference-details-form.component";
import {StakeholderDetailsFormComponent} from "./stakeholder-details-form/stakeholder-details-form.component";
import {AuthorizedEmployeeInfoComponent} from "./authorized-employee-info/authorized-employee-info.component";
import {CompanyInfoFormComponent} from "./company-info-form/company-info-form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {DeclarationComponent} from "./declaration/declaration.component";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FuseCardModule} from "../../../../../@fuse/components/card";
import {MatDialogModule} from "@angular/material/dialog";
import {
    CustomerOrCompanyDetailFormComponent
} from "./cutomer-or-company-detail-form/customer-or-company-detail-form.component";


@NgModule({
    declarations: [
        CorporateRegistrationFormComponent,
        InstructionsComponent,
        AuthorizedTraderFormComponent,
        MarginDepositFormComponent,
        CollateralDetailFormComponent,
        FinancialInfoFormComponent,
        BankReferenceDetailsFormComponent,
        StakeholderDetailsFormComponent,
        AuthorizedEmployeeInfoComponent,
        CustomerOrCompanyDetailFormComponent,
        CompanyInfoFormComponent,
        DeclarationComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(CorporateRegistrationFormRoutingModule),
        MatStepperModule,
        MatButtonModule,
        MatListModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        MatStepperModule,
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
export class CorporateRegistrationFormModule {
}
