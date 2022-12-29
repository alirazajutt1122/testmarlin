import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-financial-info-form',
    templateUrl: './financial-info-form.component.html',
})
export class FinancialInfoFormComponent implements OnInit {

    @Input() financialInfoFormGroup: FormGroup;


    constructor(private _formBuilder: FormBuilder) {
        this.financialInfoFormGroup = this._formBuilder.group({});

    }

    ngOnInit(): void {
    }
}
