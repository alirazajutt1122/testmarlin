import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AccountRegistrationService } from "../account-registration.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {InitialRequest} from "../Initial-Forms/initial-registration/initial-request"
@Component({
    selector: 'individual-registration-form',
    templateUrl: './individual-registration-form.component.html',
    encapsulation: ViewEncapsulation.None
})
export class IndividualRegistrationFormComponent implements OnInit {

    initialRequest: InitialRequest;
    public isLinear = true;
    public isDrafted = true;
    public isApprovedByNCCPL = false;
    public submittedData: any = {};
    public filesDataObj: any = {};
    public savedValuesObj: any = {};
    public UIN: any = "";
    personalDataOfApplicantFormGroup: FormGroup;
    attorneyFormGroup: FormGroup;
    nominationFormGroup: FormGroup;
    declarationIndFormGroup: FormGroup;
    public BackUrl: string = "";

    private subscription: Subscription = new Subscription();
    private currentParticipient = { participantId: null, participantName: '' };
    legalStatusCheckboxes = [
        { name: 'SMC' },
        { name: 'Partnership' },
        { name: 'pvt Ltd' },
    ];
    businessPremisesCheckboxes = [
        { name: 'Owned' },
        { name: 'Rented' },
        { name: 'Mortgaged' },
    ];


    constructor(
        private _formBuilder: FormBuilder,
        private accountRegistrationService: AccountRegistrationService,
        private route: ActivatedRoute,
        private toast: ToastrService,
        private _router: Router,) {

        let nav = this._router.getCurrentNavigation();

        if (nav != null && nav !== undefined && nav.extras && nav.extras.state && nav.extras.state.UIN) {
            this.UIN = nav.extras.state.UIN ;
        }

        this.personalDataOfApplicantFormGroup = this._formBuilder.group({
            SALUTATION: ['mr', Validators.required],
            clientName: [''],
            dateOfApply: [new Date().toISOString().slice(0, 10), Validators.required],
            ACCOUNT_TYPE: ["NKA", Validators.required],
            UIN: [this.UIN, [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
            RELATIONSHIP: ["F", Validators.required],
            FATHER_HUSBAND_NAME: ['', Validators.required],
            NATIONALITY: ['', Validators.required],
            MARITAL_STATUS: ['', Validators.required],
            DATE_OF_EXPIRY: [''],
            LIFETIME: ['N'],
            DATE_OF_BIRTH: ['', Validators.required],
            MAILING_ADDRESS_1: ['', Validators.required],
            MAILING_ADDRESS_2: ['', Validators.required],
            MAILING_ADDRESS_3: ['', Validators.required],
            COUNTRY: ['', Validators.required],
            PROVINCE_STATE: ['', Validators.required],
            CITY_TOWN_VILLAGE: ['', Validators.required],
            OTHERPROVINCE_STATE: ['',],
            OTHERCITY_TOWN_VILLAGE: ['',],
            TELEPHONE_OFFICE: [''],
            TELEPHONE_RESIDENCE: [''],
            FAX: [''],
            PERMANENT_ADDRESS_1: ['', Validators.required],
            PERMANENT_ADDRESS_2: ['', Validators.required],
            PERMANENT_ADDRESS_3: ['', Validators.required],
            PERMANENT_COUNTRY: ['', Validators.required],
            PERMANENT_PROVINCE: ['', Validators.required],
            PERMANENT_CITY_TOWN: ['', Validators.required],
            PERMANENT_OTHERPROVINCE: ['',],
            PERMANENT_OTHERCITY_TOWN: ['',],
            PERMANENT_TELEPHONE_OFFICE: [''],
            PERMANENT_TELEPHONE_RESIDENCE: [''],
            PERMANENT_CELL_NO: ['', Validators.required],
            PERMANENT_EMAIL: ['', [Validators.required, Validators.email]],
            PERMANENT_FAX: [''],
            GROSS_ANNUAL_INCOME: ['', Validators.required],
            SOURCE_OF_INCOME: ['', Validators.required],
            clientOccupation: ['', Validators.required],
            OTHER_OCCUPATION: ['',],
            JOB_TITLE: ['', Validators.required],
            Department: ['', Validators.required],
            EMPLOYER_NAME: ['', Validators.required],
            EMPLOYER_ADDRESS: ['', Validators.required],
            ZAKAT_STATUS: ['', Validators.required],
            RELATIVE_NAME: ['',],
            BANK_NAME: ['', Validators.required],
            Remittance: ['', Validators.required],
        });


        this.attorneyFormGroup = this._formBuilder.group({
            Salutation_ATR: ['',],
            CLIENT_NAME_ATR: ['',],
            IDENTIFICATION_ATR: ['',],
            CNIC_ATR: [''],
            CNIC_EXPIRY_DATE_ATR: [''],
            CNIC_LIFETIME_ATR: [''],
            Mobile_ATR: [''],
            Email_ATR: ['', Validators.email],
            Mailing_ADDRESS_ATR_1: [''],
            Mailing_ADDRESS_ATR_2: [''],
            Mailing_ADDRESS_ATR_3: [''],
            Mailing_Country_ATR: [''],
            Mailing_Province_ATR: [''],
            Other_Mailing_Prov_ATR: [''],
            Mailing_CITY_ATR: [''],
            Other_Mailing_CITY_ATR: [''],
            Landline_ATR: [''],
            FAX_ATR: [''],
        });

        this.nominationFormGroup = this._formBuilder.group({
            NAME: ['', Validators.required],
            CNIC_EXPIRY_DATE: ['', Validators.required],
            IDENTIFICATION_TYPE: ['', Validators.required],
            RELATIONSHIP: ['', Validators.required],
            CNIC: [''],
            CNIC_LIFETIME: ['N'],
        });

        this.declarationIndFormGroup = this._formBuilder.group({
            isAgree: [false, Validators.required],
        });
    }

    ngOnInit(): void {
        this.getAllFormattedDates();
        this.processBusinessTypes();
        this.getAccountInitialData();
        //this.getRecipientData();
    }

    getAccountInitialData() {

        this.accountRegistrationService.getSavedClientRequestByUIN(this.UIN).subscribe((data: any) => {
            this.initialRequest = data;
        },
            (er: any) => {
                //this.toast.error("Could not fetch data from draft.", 'Error');
            }
        );

    }

    getRecipientData() {

        this.currentParticipient.participantId =
            this.route.snapshot.params['participantId'];
        this.currentParticipient.participantName =
            this.route.snapshot.queryParams['name'];
        this.accountRegistrationService.updatedDataSelection(this.currentParticipient);
        this.UIN = this.route.snapshot.queryParams['uin'];
        this.isDrafted = this.route.snapshot.queryParams['isDrafted'] == "false" ? false : true;
        this.personalDataOfApplicantFormGroup.patchValue({ UIN: this.UIN });
        this.setBackUrl();
        this.processSavedDetailedClientData(this.UIN);
    }

    setBackUrl() {
        this.BackUrl =
            "/home/" +
            this.currentParticipient.participantId +
            "?name=" +
            this.currentParticipient.participantName;
    }

    goBack() {
        this._router.navigate([this.BackUrl]);
        // window.location.href = this.BackUrl;
    }

    processBusinessTypes() {
        this.accountRegistrationService.getBusinessTypes().subscribe((data: any) => {
            console.log(data);
        });
    }

    processSavedDetailedClientData(uin: any) {
        this.accountRegistrationService.getSavedDetailedClientData(uin).subscribe((data: any) => {
            this.savedValuesObj = data;
            this.getSavedValues();
            this.toast.success("Draft data loaded", 'Success');
        },
            (er: any) => {
                //this.toast.error("Could not fetch data from draft.", 'Error');
            }
        );
    }

    updateAttorneyValidations(uin: any) {
        let keys = Object.keys(this.attorneyFormGroup.value);
        keys.forEach((formValue) => {
            if (this.personalDataOfApplicantFormGroup.value.ACCOUNT_TYPE != "SKA") {
                if (uin.length > 0 && formValue != "CNIC_ATR" && formValue != "FAX_ATR" && formValue != "Other_Mailing_Prov_ATR" && formValue != "Other_Mailing_CITY_ATR") {
                    this.attorneyFormGroup.controls[formValue].setValidators([Validators.required]);
                } else {
                    this.attorneyFormGroup.controls[formValue].clearValidators();
                }
                this.attorneyFormGroup.controls[formValue].updateValueAndValidity();
            } else {
                this.attorneyFormGroup.controls[formValue].clearValidators();
                this.attorneyFormGroup.controls[formValue].updateValueAndValidity();
            }
        });

    }

    onAccountTypeChanged(event: any) {
        this.updateAttorneyValidations(this.personalDataOfApplicantFormGroup.value.UIN);
    }

    getAllFormattedDates() {
        this.changeDateFormat('clientNccplDataBO', 'DATE_OF_EXPIRY');
        this.changeDateFormat('clientAttorneyBO', 'CNIC_EXPIRY_DATE_ATR');
        this.changeDateFormat('clientNomineeInfo', 'CNIC_EXPIRY_DATE');
    }

    changeDateFormat(formKey: any, dateKey: any) {
        let currentFormGroup = this.getRelevantFormGroup(formKey);
        this.subscription = currentFormGroup
            .get(dateKey)
            ?.valueChanges.subscribe((currentDate: any) => {
                let formattedDate = this.setDateFormate(currentDate);
                currentFormGroup.patchValue(
                    { [dateKey]: formattedDate },
                    { emitEvent: false }
                );
            });
    }

    setDateFormate(currDate: any) {
        return new Date(currDate).toISOString().slice(0, 10);
    }

    submit(stepper: any, isDraft: any) {
        this.submittedData.isDraft = isDraft;
        this.accountRegistrationService.saveDetailedClientData(this.submittedData).subscribe((res: any) => {
            if (isDraft) {
                this.toast.success('Draft successfully Saved');
            } else {
                this.toast.success('Data Submitted successfully');
            }
        }, er => {
            this.toast.error('Ooops! Something went wrong.');
        });
        // stepper.reset();
    }

    saveDataAsDraft(stepper: any, formGroup: any) {
        if (formGroup.valid) {
            this.setSubmittedData();
            this.submit(stepper, true);
        }
    }

    saveDataOnNext(groupName: string) {
        this.setSubmittedData();
    }

    setSubmittedData() {

        let clientMailingAddress = {
            ADDRESS_1: this.personalDataOfApplicantFormGroup.value.MAILING_ADDRESS_1,
            ADDRESS_2: this.personalDataOfApplicantFormGroup.value.MAILING_ADDRESS_2,
            ADDRESS_3: this.personalDataOfApplicantFormGroup.value.MAILING_ADDRESS_3,
            COUNTRY: this.personalDataOfApplicantFormGroup.value.COUNTRY,
            PROVINCE_STATE: this.personalDataOfApplicantFormGroup.value.PROVINCE_STATE,
            CITY_TOWN_VILLAGE: this.personalDataOfApplicantFormGroup.value.CITY_TOWN_VILLAGE,
            OTHER_PROVINCE_STATE: this.personalDataOfApplicantFormGroup.value.OTHERPROVINCE_STATE,
            OTHER_CITY_TOWN_VILLAGE: this.personalDataOfApplicantFormGroup.value.OTHERCITY_TOWN_VILLAGE,
            TELEPHONE_OFFICE: this.personalDataOfApplicantFormGroup.value.TELEPHONE_OFFICE,
            TELEPHONE_RESIDENCE: this.personalDataOfApplicantFormGroup.value.TELEPHONE_RESIDENCE,
            FAX: this.personalDataOfApplicantFormGroup.value.FAX,
        }

        let clientPermanentAddress = {
            ADDRESS_1: this.personalDataOfApplicantFormGroup.value.PERMANENT_ADDRESS_1,
            ADDRESS_2: this.personalDataOfApplicantFormGroup.value.PERMANENT_ADDRESS_2,
            ADDRESS_3: this.personalDataOfApplicantFormGroup.value.PERMANENT_ADDRESS_3,
            CITY_TOWN_VILLAGE: this.personalDataOfApplicantFormGroup.value.PERMANENT_CITY_TOWN,
            OTHER_PROVINCE_STATE: this.personalDataOfApplicantFormGroup.value.PERMANENT_OTHERPROVINCE,
            OTHER_CITY_TOWN_VILLAGE: this.personalDataOfApplicantFormGroup.value.PERMANENT_OTHERCITY_TOWN,
            TELEPHONE_OFFICE: this.personalDataOfApplicantFormGroup.value.PERMANENT_TELEPHONE_OFFICE,
            TELEPHONE_RESIDENCE: this.personalDataOfApplicantFormGroup.value.PERMANENT_TELEPHONE_RESIDENCE,
            CELL_NUMBER: this.personalDataOfApplicantFormGroup.value.PERMANENT_CELL_NO,
            EMAIL: this.personalDataOfApplicantFormGroup.value.PERMANENT_EMAIL,
            FAX: this.personalDataOfApplicantFormGroup.value.PERMANENT_FAX,
            PROVINCE_STATE: this.personalDataOfApplicantFormGroup.value.PERMANENT_PROVINCE,
            COUNTRY: this.personalDataOfApplicantFormGroup.value.PERMANENT_COUNTRY

        }

        let clientAttorneyAddress = {
            EMAIL: this.attorneyFormGroup.value.Email_ATR,
            ADDRESS_1: this.attorneyFormGroup.value.Mailing_ADDRESS_ATR_1,
            ADDRESS_2: this.attorneyFormGroup.value.Mailing_ADDRESS_ATR_2,
            ADDRESS_3: this.attorneyFormGroup.value.Mailing_ADDRESS_ATR_3,
            COUNTRY: this.attorneyFormGroup.value.Mailing_Country_ATR,
            PROVINCE_STATE: this.attorneyFormGroup.value.Mailing_Province_ATR,
            OTHER_PROVINCE_STATE: this.attorneyFormGroup.value.Other_Mailing_Prov_ATR,
            CITY_TOWN_VILLAGE: this.attorneyFormGroup.value.Mailing_CITY_ATR,
            OTHER_CITY_TOWN_VILLAGE: this.attorneyFormGroup.value.Other_Mailing_CITY_ATR,
            TELEPHONE_RESIDENCE: this.attorneyFormGroup.value.Landline_ATR,
            FAX: this.attorneyFormGroup.value.FAX_ATR,
            CELL_NUMBER: this.attorneyFormGroup.value.Mobile_ATR,
            // TELEPHONE_OFFICE //missing
        }

        let clientAddressInfo = {
            clientMailingAddress,
            clientPermanentAddress,
            clientAttorneyAddress
        }
        this.submittedData = {
            clientNccplDataBO: this.personalDataOfApplicantFormGroup.value,
            clientAttorneyBO: this.attorneyFormGroup.value,
            clientNomineeInfo: this.nominationFormGroup.value,
            declarationIndFormGroup: this.declarationIndFormGroup.value,
            participantId: this.initialRequest.participantId,
            clientAddressInfo,
            clientIntialRequestId: this.initialRequest.clientRequestId,
            filesDataObj: this.filesDataObj,
            TERMS_CONDITIONS: this.declarationIndFormGroup.value.isAgree,
            REQUEST_DATE: new Date().toISOString().slice(0, 10),
        };
        return this.submittedData;
    }

    getSavedValues() {
        this.setSubmittedData();
        let setSavedValues: any = {};
        setSavedValues.clientNccplDataBO = Object.assign({}, this.savedValuesObj.clientNccplDataBO);
        setSavedValues.clientNomineeInfo = Object.assign({}, this.savedValuesObj.clientNomineeInfo);

        setSavedValues.clientNccplDataBO.MAILING_ADDRESS_1 = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).ADDRESS_1;
        setSavedValues.clientNccplDataBO.MAILING_ADDRESS_2 = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).ADDRESS_2;
        setSavedValues.clientNccplDataBO.MAILING_ADDRESS_3 = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).ADDRESS_3;
        setSavedValues.clientNccplDataBO.COUNTRY = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).COUNTRY;
        setSavedValues.clientNccplDataBO.PROVINCE_STATE = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).PROVINCE_STATE;
        setSavedValues.clientNccplDataBO.CITY_TOWN_VILLAGE = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).CITY_TOWN_VILLAGE;
        setSavedValues.clientNccplDataBO.OTHERPROVINCE_STATE = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).OTHER_PROVINCE_STATE;
        setSavedValues.clientNccplDataBO.OTHERCITY_TOWN_VILLAGE = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).OTHER_CITY_TOWN_VILLAGE;
        setSavedValues.clientNccplDataBO.TELEPHONE_OFFICE = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).TELEPHONE_OFFICE;
        setSavedValues.clientNccplDataBO.TELEPHONE_RESIDENCE = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).TELEPHONE_RESIDENCE;
        setSavedValues.clientNccplDataBO.FAX = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientMailingAddress || {}).FAX;

        setSavedValues.clientNccplDataBO.PERMANENT_ADDRESS_1 = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).ADDRESS_1;
        setSavedValues.clientNccplDataBO.PERMANENT_ADDRESS_2 = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).ADDRESS_2;
        setSavedValues.clientNccplDataBO.PERMANENT_ADDRESS_3 = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).ADDRESS_3;
        setSavedValues.clientNccplDataBO.PERMANENT_COUNTRY = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).COUNTRY;
        setSavedValues.clientNccplDataBO.PERMANENT_PROVINCE = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).PROVINCE_STATE;
        setSavedValues.clientNccplDataBO.PERMANENT_CITY_TOWN = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).CITY_TOWN_VILLAGE;
        setSavedValues.clientNccplDataBO.PERMANENT_OTHERPROVINCE = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).OTHER_PROVINCE_STATE;
        setSavedValues.clientNccplDataBO.PERMANENT_OTHERCITY_TOWN = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).OTHER_CITY_TOWN_VILLAGE;
        setSavedValues.clientNccplDataBO.PERMANENT_TELEPHONE_OFFICE = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).TELEPHONE_OFFICE;
        setSavedValues.clientNccplDataBO.PERMANENT_TELEPHONE_RESIDENCE = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).TELEPHONE_RESIDENCE;
        setSavedValues.clientNccplDataBO.PERMANENT_FAX = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).FAX;
        setSavedValues.clientNccplDataBO.PERMANENT_EMAIL = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).EMAIL;
        setSavedValues.clientNccplDataBO.PERMANENT_CELL_NO = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientPermanentAddress || {}).CELL_NUMBER;

        setSavedValues.clientAttorneyBO = Object.assign({}, this.savedValuesObj.clientAttorneyBO);
        setSavedValues.clientAttorneyBO.Mailing_ADDRESS_ATR_1 = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).ADDRESS_1;
        setSavedValues.clientAttorneyBO.Mailing_ADDRESS_ATR_2 = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).ADDRESS_2;
        setSavedValues.clientAttorneyBO.Mailing_ADDRESS_ATR_3 = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).ADDRESS_3;
        setSavedValues.clientAttorneyBO.Email_ATR = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).EMAIL;
        setSavedValues.clientAttorneyBO.Mailing_Country_ATR = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).COUNTRY;
        setSavedValues.clientAttorneyBO.Mailing_Province_ATR = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).PROVINCE_STATE;
        setSavedValues.clientAttorneyBO.Other_Mailing_Prov_ATR = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).OTHER_PROVINCE_STATE;
        setSavedValues.clientAttorneyBO.Mailing_CITY_ATR = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).CITY_TOWN_VILLAGE;
        setSavedValues.clientAttorneyBO.Other_Mailing_CITY_ATR = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).OTHER_CITY_TOWN_VILLAGE;
        setSavedValues.clientAttorneyBO.Landline_ATR = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).TELEPHONE_RESIDENCE;
        setSavedValues.clientAttorneyBO.FAX_ATR = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).FAX;
        setSavedValues.clientAttorneyBO.Mobile_ATR = (((this.savedValuesObj || {}).clientAddressInfo || {}).clientAttorneyAddress || {}).CELL_NUMBER;

        this.filesDataObj = Object.assign({}, this.savedValuesObj.filesDataObj);

        let keys = Object.keys(setSavedValues);
        keys.forEach((key) => {
            let storedValues = setSavedValues[key];
            this.getRelevantFormGroup(key).patchValue(storedValues);
        });

        this.setSubmittedData();
        this.isApprovedByNCCPL = (((this.savedValuesObj || {}).clientNccplDataBO || {}).IS_APPROVED || false);
        this.personalDataOfApplicantFormGroup.patchValue({ clientName: this.savedValuesObj.clientName });
    }

    getRelevantFormGroup(key: string) {
        switch (key) {
            case 'clientNccplDataBO':
                return this.personalDataOfApplicantFormGroup;
            case 'clientAttorneyBO':
                return this.attorneyFormGroup;
            case 'clientNomineeInfo':
                return this.nominationFormGroup;
            case 'declarationIndFormGroup':
                return this.declarationIndFormGroup;
            default:
                return this.submittedData;
        }
    }

    getAllFiles(files: any) {
        this.filesDataObj = files;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
