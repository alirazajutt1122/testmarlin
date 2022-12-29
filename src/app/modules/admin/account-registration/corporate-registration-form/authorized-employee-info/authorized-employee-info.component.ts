import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-authorized-employee-info',
  templateUrl: './authorized-employee-info.component.html',
  styleUrls: ['./authorized-employee-info.component.css']
})
export class AuthorizedEmployeeInfoComponent implements OnInit {

  @Input() authorizedEmployeeInfoFormGroup : FormGroup; 
  public typeOfBusiness: any[];

  

  constructor(private _formBuilder: FormBuilder) { 
    this.authorizedEmployeeInfoFormGroup = this._formBuilder.group({});
    this.typeOfBusiness = [{type: "Manufacturing"}, {type: "Chemical"}, 
    {type: "Wholesale"}, {type: "Trade"}, 
    {type: "Auto"}, {type: "Retail"}, 
    {type: "Service Provider"}, {type: "If others, please specify "}, 
    
  ]
  }

  ngOnInit(): void {
  }

}
