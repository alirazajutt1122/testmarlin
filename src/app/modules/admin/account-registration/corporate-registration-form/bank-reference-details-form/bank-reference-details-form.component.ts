import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bank-reference-details-form',
  templateUrl: './bank-reference-details-form.component.html',
})
export class BankReferenceDetailsFormComponent implements OnInit {

  @Input() bankReferenceDetailFormGroup : FormGroup;



  constructor(private _formBuilder: FormBuilder) {
    this.bankReferenceDetailFormGroup = this._formBuilder.group({});

  }

  ngOnInit(): void {
  }

}
