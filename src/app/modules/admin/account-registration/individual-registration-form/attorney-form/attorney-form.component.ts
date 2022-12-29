import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountRegistrationService} from "../../account-registration.service";

@Component({
    selector: 'app-attorney-form',
    templateUrl: './attorney-form.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AttorneyFormComponent implements OnInit {

    @Input() attorneyFormGroup: FormGroup;
    @Output() uinChange = new EventEmitter();
    @Input() isApprovedByNCCPL: boolean = false;

    public salutationArr: any[] = [{label: "Mr.", value: "mr"}, {label: "Mrs.", value: "mrs"}, {
        label: "Ms.",
        value: "ms"
    }];
    public identificationArr: any[] = [{uinId: "null", uinCode: "", uinDesc: ""},];
    public lttStatusArr: any[] = [{label: "Yes", value: "Y"}, {label: "No", value: "N"}];
    public countries: any[] = [{countryId: 1, countryCode: '000', countryName: 'Pakistan'}];
    public cities: any[] = [{cityId: 1, cityCode: '000', cityName: 'Lahore'}];
    public provinces: any[] = [{provinceId: 3, provinceCode: '000', provinceDesc: 'Punjab'}];


    constructor(private _formBuilder: FormBuilder, private regService: AccountRegistrationService) {
        this.attorneyFormGroup = this._formBuilder.group({});
    }


    ngOnInit(): void {
        this.getUINTypes();
        this.getNccplCountryList();
        setTimeout(() => {
            this.onCountryChange(this.attorneyFormGroup.value.Mailing_Country_ATR);
            this.onProvinceChange(this.attorneyFormGroup.value.Mailing_Province_ATR);
        }, 1000);
    }

    onUINKeyUp(event: any) {
        this.uinChange.emit(event.target.value);
    }

    getUINTypes() {
        this.regService.getUINtype().subscribe((data: any) => {
            this.identificationArr = data;
        });
    }

    public getNccplCountryList() {
        this.regService.getNccplCountries().subscribe((data: any) => {
            this.provinces = [];
            this.cities = [];
            this.countries = data;
        });
    }

    public getNccplProvincesList(countryId: any) {
        this.regService.getProvincesData(countryId).subscribe((data: any) => {
            this.cities = [];
            this.provinces = data;
        });
    }

    public getNccplCitiesList(countryId: any, provinceId: any) {
        this.regService.getCitiesData(countryId, provinceId).subscribe((data: any) => {
            this.cities = data;
        });
    }

    onCountryChange(contryId: any) {
        this.getNccplProvincesList(contryId);
    }

    onProvinceChange(provinceId: any) {
        this.getNccplCitiesList(this.attorneyFormGroup.value.Mailing_Country_ATR, provinceId);
    }

}
