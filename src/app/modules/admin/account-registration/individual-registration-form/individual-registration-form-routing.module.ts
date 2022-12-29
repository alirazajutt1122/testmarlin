import {Route} from '@angular/router';
import {PersonalDataOfApplicantComponent} from "./personal-data-of-applicant/personal-data-of-applicant.component";
import {IndividualRegistrationFormComponent} from "./individual-registration-form.component";

export const IndividualRegistrationFormRoutingModule: Route[] = [
    {
        path: '',
        component: IndividualRegistrationFormComponent
    }
];
