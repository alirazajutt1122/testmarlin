import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-authorized-trader-form',
  templateUrl: './authorized-trader-form.component.html',
  styleUrls: ['./authorized-trader-form.component.css']
})
export class AuthorizedTraderFormComponent implements OnInit {

  @Input() authorizedTraderFormGroup : FormGroup; 

  

  constructor(private _formBuilder: FormBuilder) { 
    this.authorizedTraderFormGroup = this._formBuilder.group({}); 

  }

  ngOnInit(): void {
  }

}
