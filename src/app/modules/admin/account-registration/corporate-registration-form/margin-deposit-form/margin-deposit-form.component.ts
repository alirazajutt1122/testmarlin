import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-margin-deposit-form',
  templateUrl: './margin-deposit-form.component.html',
  styleUrls: ['./margin-deposit-form.component.css']
})
export class MarginDepositFormComponent implements OnInit {

  @Input() marginDepositFormGroup : FormGroup; 

  

  constructor(private _formBuilder: FormBuilder) { 
    this.marginDepositFormGroup = this._formBuilder.group({}); 

  }

  ngOnInit(): void {
  }

}
