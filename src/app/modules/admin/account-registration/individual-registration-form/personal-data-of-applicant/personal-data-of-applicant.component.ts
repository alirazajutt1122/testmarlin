import {
    Component,
    Input,
    OnChanges,
    OnInit,
    Output,
    EventEmitter,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

import {AccountRegistrationService} from "../../account-registration.service";
import {User} from "../../../../../../app/core/user/user.types";

@Component({
    selector: 'personal-data-of-applicant',
    templateUrl: './personal-data-of-applicant.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PersonalDataOfApplicantComponent implements OnInit, OnChanges {
    @Input() personalDataOfApplicantFormGroup: FormGroup;
    @Input() isApprovedByNCCPL: boolean = false;
    @Input() UIN: String;
    @Output() accountTypeChange = new EventEmitter();

    clientRequestDetails: any = null;
    user: User; 
    participants: any[] ;
    public occupations: any[];
    public maritalStatuses: any[];
    public remittances: any[];
    public salutationArr: any[] = [{label: "Mr.", value: "mr"}, {label: "Mrs.", value: "mrs"}, {
        label: "Ms.",
        value: "ms"
    }];
    public relationArr: any[] = [{label: "Father", value: "F"}, {label: "Husband", value: "H"}];
    public accountNatureArr: any[] = [{label: "SKA-Sahulat", value: "SKA"}, {label: "NKA-Normal", value: "NKA"}];
    public lttStatusArr: any[] = [{label: "Yes", value: "Y"}, {label: "No", value: "N"}];
    public countries: any[] = [{countryId: 0, countryCode: '', countryName: ''}];
    public permanentCountries: any[] = [{countryId: 0, countryCode: '', countryName: ''}];
    public cities: any[] = [{cityId: 0, cityCode: '', cityName: ''}];
    public permanentCities: any[] = [{cityId: 0, cityCode: '', cityName: ''}];
    public provinces: any[] = [{provinceId: 0, provinceCode: '', provinceDesc: ''}];
    public permanentProvinces: any[] = [{provinceId: 0, provinceCode: '', provinceDesc: ''}];
    public grossAnnualIncomeArr: any[] = [{incomeDesc: "", incomeId: 0}];
    public zakatTypeArr: any[] = [
        {type: "Muslim Zakat Deductible", code: 5},
        {type: "Muslim Zakat Non-Deductible", code: 6},
        {type: "Not Applicable", code: 7},
    ];


    constructor(private _formBuilder: FormBuilder, private regService: AccountRegistrationService) {
        this.personalDataOfApplicantFormGroup = this._formBuilder.group({});
        this.occupations = [
            {occupationId: null, occupationCode: '', occupationDesc: ''},
        ];
        this.remittances = [
            {remittanceId: null, remittanceCode: '', remittanceDesc: ''},
        ];
        this.maritalStatuses = [
            {statusId: "S", statusCode: '000', statusDesc: 'Single'},
            {statusId: "M", statusCode: '000', statusDesc: 'Married'},
        ];

         
        this.user = JSON.parse(localStorage.getItem("user"));
    }

    onAccountValueChange(AccountValue: any) {
        this.accountTypeChange.emit(AccountValue.value);
    }

    public onFileSelected() {
    }

    ngOnInit(): void {
        this.getClientRequestDetails();
        this.processOccupations();
        this.getNccplCountryList();
        this.getNccplPermanentCountryList();
        this.getIncomeByAccountType();
        this.getRemittances();
        setTimeout(() => {
            this.onCountryChange(this.personalDataOfApplicantFormGroup.value.COUNTRY);
            this.onPermanentCountryChange(this.personalDataOfApplicantFormGroup.value.PERMANENT_COUNTRY);
            this.onProvinceChange(this.personalDataOfApplicantFormGroup.value.PROVINCE_STATE);
            this.onPermanentProvinceChange(this.personalDataOfApplicantFormGroup.value.PERMANENT_PROVINCE);
        }, 1000);
    }

    getClientName() {
         
        if (this.user != null) {
            return (this.user.name != null) ? this.user.name : "";
        } else return "";
    }

    getClientEmail() {
         
        if (this.user != null) {
            return (this.user.email != null) ? this.user.email : "";
        } else return "";
    }
  
    getClientRequestDetails() {
         
        this.regService.getSavedDetailedClientData(this.UIN).subscribe((data: any) => {
            this.clientRequestDetails = data;
        });
    }

    processOccupations() {
        this.regService.getOccupations().subscribe((data: any) => {
            this.occupations = data;
        });
    }

    processMeritalStatuses() {
        this.regService.getMeritalStatuses().subscribe((data: any) => {
            this.maritalStatuses = data;
        });
    }

    public getIncomeByAccountType() {
        this.regService.getIncomeByAccountType(this.personalDataOfApplicantFormGroup.value.ACCOUNT_TYPE).subscribe((data: any) => {
            this.grossAnnualIncomeArr = data;
        });
    }

    public getNccplCountryList() {
        this.regService.getNccplCountries().subscribe((data: any) => {
            this.countries = data;
        });
    }

    public getNccplPermanentCountryList() {
        this.regService.getNccplCountries().subscribe((data: any) => {
            this.permanentCountries = data;
        });
    }

    public getNccplProvincesList(countryId: any) {
        this.regService.getProvincesData(countryId).subscribe((data: any) => {
            this.provinces = data;
        });
    }

    public getNccplPermanentProvincesList(countryId: any) {
        this.regService.getProvincesData(countryId).subscribe((data: any) => {
            this.permanentProvinces = data;
        });
    }

    public getNccplCitiesList(countryId: any, provinceId: any) {
        this.regService.getCitiesData(countryId, provinceId).subscribe((data: any) => {
            this.cities = data;
        });
    }

    public getNccplPermanentCitiesList(countryId: any, provinceId: any) {
        this.regService.getCitiesData(countryId, provinceId).subscribe((data: any) => {
            this.permanentCities = data;
        });
    }

    onCountryChange(contryId: any) {
        this.provinces = [];
        this.cities = [];
        this.getNccplProvincesList(contryId);
    }

    onPermanentCountryChange(contryId: any) {
        this.permanentProvinces = [];
        this.permanentCities = [];
        this.getNccplPermanentProvincesList(contryId);
    }

    onProvinceChange(provinceId: any) {
        this.cities = [];
        this.getNccplCitiesList(this.personalDataOfApplicantFormGroup.value.COUNTRY, provinceId);
    }

    onPermanentProvinceChange(provinceId: any) {
        this.permanentCities = [];
        this.getNccplPermanentCitiesList(this.personalDataOfApplicantFormGroup.value.PERMANENT_COUNTRY, provinceId);
    }

    getRemittances() {
        this.regService.getRemittances().subscribe((data: any) => {
            this.remittances = data;
        });
    }

    /**
     * getExchangeParticpants
     */
     public getExchangeParticipants() {
        this.regService.getAllActiveParticipants().subscribe((data: any) => {
            this.participants = data;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
    }
}
