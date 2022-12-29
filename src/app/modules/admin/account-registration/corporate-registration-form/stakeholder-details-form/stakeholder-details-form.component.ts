import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-stakeholder-details-form',
    templateUrl: './stakeholder-details-form.component.html',
})
export class StakeholderDetailsFormComponent implements OnInit {


    @Input() stackholderDetailFormGroup: FormGroup;
    @Input() businessPremisesCheckboxes: any;


    constructor(private _formBuilder: FormBuilder) {
        this.stackholderDetailFormGroup = this._formBuilder.group({});
        this.businessPremisesCheckboxes = [];

    }

    ngOnInit(): void {
    }

}
