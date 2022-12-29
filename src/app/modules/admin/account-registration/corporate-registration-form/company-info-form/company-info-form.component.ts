import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-company-info-form',
    templateUrl: './company-info-form.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CompanyInfoFormComponent implements OnInit {

    @Input() companyInfoFormGroup: FormGroup;
    public companyTypes: any[];

    constructor(private _formBuilder: FormBuilder) {
        this.companyInfoFormGroup = this._formBuilder.group({});
        this.companyTypes = [{type: "Public", id: 1}, {type: "Private", id: 2},
            {type: "Partnership", id: 3}, {type: "Proprietorship", id: 4},
            {type: "If others, please specify", id: 5}
        ]
    }

    ngOnInit(): void {
    }

}
