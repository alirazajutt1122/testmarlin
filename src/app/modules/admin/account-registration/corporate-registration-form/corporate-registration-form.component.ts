import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-corporate-registration-form',
    templateUrl: './corporate-registration-form.component.html',
})
export class CorporateRegistrationFormComponent implements OnInit {

    isLinear = true;
    public submittedData: any = {};
    companyInfoFormGroup: FormGroup;
    customerOrCompanyDetailFormGroup: FormGroup;
    authorizedEmployeeInfoFormGroup: FormGroup;
    stackholderDetailFormGroup: FormGroup;
    bankReferenceDetailFormGroup: FormGroup;
    financialInfoFormGroup: FormGroup;
    collateralDetailFormGroup: FormGroup;
    marginDepositFormGroup: FormGroup;
    authorizedTraderFormGroup: FormGroup;
    declarationFormGroup: FormGroup;

    legalStatusCheckboxes = [
        {name: "SMC"},
        {name: "Partnership"},
        {name: "pvt Ltd"}
    ];
    businessPremisesCheckboxes = [
        {name: "Owned"},
        {name: "Rented"},
        {name: "Mortgaged"}
    ];

    constructor(private _formBuilder: FormBuilder) {
        this.companyInfoFormGroup = this._formBuilder.group({
            companyName: ['', Validators.required],
            companyType: ['', Validators.required],
            registeredAddress: ['', Validators.required],
            taxIdNumber: ['', Validators.required],
            companyRegNum: ['', Validators.required],
            companyRegProof: ['',],
        });
        this.customerOrCompanyDetailFormGroup = this._formBuilder.group({
            name: ['', Validators.required],
            buisinessRegNum: ['', Validators.required],
            residentialStatus: ['', Validators.required],
            mailingAddress: ['', Validators.required],
            operationsDate: ['', Validators.required],
            numOfEmployees: ['', Validators.required],
            telephoneNum: ['', Validators.required],
            emailID: ['', Validators.required],
            legalStatus: this._formBuilder.array(this.legalStatusCheckboxes),
            dateOfIncorporation: ['', Validators.required],
            countryOfIncorporation: ['', Validators.required],
            permanentAddress: ['', Validators.required],
            yearsOfExperience: ['', Validators.required],
            businessPremises: this._formBuilder.array(this.businessPremisesCheckboxes),
            faxNumber: ['', Validators.required],
            websiteAdd: ['', Validators.required],
            companyCategory: ['', Validators.required],
        });

        this.authorizedEmployeeInfoFormGroup = this._formBuilder.group({
            nameEmployeeOne: ['', Validators.required],
            positionEmployeeOne: ['', Validators.required],
            emailAddEmployeeOne: ['', Validators.required],
            phoneNumEmployeeOne: ['', Validators.required],
            faxNumEmployeeOne: ['', Validators.required],
            nameEmployeeTwo: ['', Validators.required],
            positionEmployeeTwo: ['', Validators.required],
            emailAddEmployeeTwo: ['', Validators.required],
            phoneNumEmployeeTwo: ['', Validators.required],
            addressEmployeeTwo: ['', Validators.required],
            businessType: ['', Validators.required],

        });

        this.stackholderDetailFormGroup = this._formBuilder.group({
            nameNo1: [''],
            nationalityNo1: [''],
            dobNo1: [''],
            telephoneNo1: [''],
            yearsInBusinessNo1: [''],
            CNICNo1: [''],
            passportNo1: [''],
            genderNo1: [''],
            cellNo1: [''],
            residentialAddressNo1: [''],
            businessPremisesNo1: this._formBuilder.array(this.businessPremisesCheckboxes),

            nameNo2: [''],
            nationalityNo2: [''],
            dobNo2: [''],
            telephoneNo2: [''],
            yearsInBusinessNo2: [''],
            CNICNo2: [''],
            passportNo2: [''],
            genderNo2: [''],
            cellNo2: [''],
            residentialAddressNo2: [''],
            businessPremisesNo2: this._formBuilder.array(this.businessPremisesCheckboxes),

            nameNo3: [''],
            nationalityNo3: [''],
            dobNo3: [''],
            telephoneNo3: [''],
            yearsInBusinessNo3: [''],
            CNICNo3: [''],
            passportNo3: [''],
            genderNo3: [''],
            cellNo3: [''],
            residentialAddressNo3: [''],
            businessPremisesNo3: this._formBuilder.array(this.businessPremisesCheckboxes),
        });

        this.bankReferenceDetailFormGroup = this._formBuilder.group({
            bankName1: [''],
            accountNo1: [''],
            contactName1: [''],
            registeredBranchAddress1: [''],
            phoneNo1: [''],

            bankName2: [''],
            accountNo2: [''],
            contactName2: [''],
            registeredBranchAddress2: [''],
            phoneNo2: [''],
        });

        this.financialInfoFormGroup = this._formBuilder.group({
            companyTotalAssets: [''],
            annualNetIncome: [''],
            companyTotalLiablilites: [''],
            everBankrupted: [''],
            subjectedToLitigation: [''],

        });

        this.collateralDetailFormGroup = this._formBuilder.group({
            srNo1: [''],
            scriptName1: [''],
            symbol1: [''],
            volume1: [''],

        });
        this.marginDepositFormGroup = this._formBuilder.group({
            marginPercentage: [''],

        });
        this.authorizedTraderFormGroup = this._formBuilder.group({
            brokerName: [''],
            traderName: [''],

        });

        this.declarationFormGroup = this._formBuilder.group({
            authorizedSignatoryName1: [''],
            signature1: [''],
            date1: [''],
            authorizedPersonSignature: [''],
            authorizedPersonThumbImpression: [''],
            place: [''],


        });
        this.getSavedValues();

    }


    ngOnInit() {
    }

    submit(stepper: any) {
        console.log("submittedData: ", this.submittedData);
        stepper.reset();
        localStorage.clear();
    }

    saveDataOnNext(groupName: string) {
        localStorage.setItem(groupName, JSON.stringify(this.getRelevantFormGroup(groupName).value));
        this.setSubmittedData();
    }

    setSubmittedData() {
        this.submittedData = {
            companyInfoFormGroup: this.companyInfoFormGroup.value,
            customerOrCompanyDetailFormGroup: this.customerOrCompanyDetailFormGroup.value,
            authorizedEmployeeInfoFormGroup: this.authorizedEmployeeInfoFormGroup.value,
            stackholderDetailFormGroup: this.stackholderDetailFormGroup.value,
            bankReferenceDetailFormGroup: this.bankReferenceDetailFormGroup.value,
            financialInfoFormGroup: this.financialInfoFormGroup.value,
            collateralDetailFormGroup: this.collateralDetailFormGroup.value,
            marginDepositFormGroup: this.marginDepositFormGroup.value,
            authorizedTraderFormGroup: this.authorizedTraderFormGroup.value,
            declarationFormGroup: this.declarationFormGroup.value,
        }
        return this.submittedData;
    }

    getSavedValues() {

        this.setSubmittedData();
        let keys = Object.keys(this.submittedData);
        keys.forEach((key) => {
            if (!localStorage.getItem(key)) {
                //
            }
            let storageValues = JSON.parse(localStorage.getItem(key) || '{}');
            this.getRelevantFormGroup(key).patchValue(storageValues);
        });
        this.setSubmittedData();
    }

    getRelevantFormGroup(key: string) {
        switch (key) {
            case "companyInfoFormGroup":
                return this.companyInfoFormGroup;
            case "customerOrCompanyDetailFormGroup":
                return this.customerOrCompanyDetailFormGroup;
            case "authorizedEmployeeInfoFormGroup":
                return this.authorizedEmployeeInfoFormGroup;
            case "stackholderDetailFormGroup":
                return this.stackholderDetailFormGroup;
            case "bankReferenceDetailFormGroup":
                return this.bankReferenceDetailFormGroup;
            case "financialInfoFormGroup":
                return this.financialInfoFormGroup;
            case "collateralDetailFormGroup":
                return this.collateralDetailFormGroup;
            case "marginDepositFormGroup":
                return this.marginDepositFormGroup;
            case "authorizedTraderFormGroup":
                return this.authorizedTraderFormGroup;
            case "declarationFormGroup":
                return this.declarationFormGroup;
            default:
                return this.submittedData
        }
    }

}
