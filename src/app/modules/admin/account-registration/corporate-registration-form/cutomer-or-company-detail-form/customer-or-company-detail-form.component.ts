import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'customer-or-company-detail-form',
    templateUrl: './customer-or-company-detail-form.component.html',
})
export class CustomerOrCompanyDetailFormComponent implements OnInit {

    @Input() customerOrCompanyDetailFormGroup: FormGroup;
    @Input() legalStatusCheckboxes: any;
    @Input() businessPremisesCheckboxes: any;
    public companyCategories: any[];


    constructor(private _formBuilder: FormBuilder) {
        this.customerOrCompanyDetailFormGroup = this._formBuilder.group({});
        this.legalStatusCheckboxes = [];
        this.businessPremisesCheckboxes = [];
        this.companyCategories = [{category: "Mutual Fund"}, {category: "Investment Company"},
            {category: "Insurance Company"}, {category: "Joint Stock Company"},
            {category: "Leasing Company"}, {category: "Modaraba Management Company"},
            {category: "Trust/Charitable Company"}, {category: "Financial Company"},
            {category: "If others, please specify"}
        ]
    }

    ngOnInit(): void {
    }

}
