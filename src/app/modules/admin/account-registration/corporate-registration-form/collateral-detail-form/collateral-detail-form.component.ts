import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-collateral-detail-form',
  templateUrl: './collateral-detail-form.component.html',
  styleUrls: ['./collateral-detail-form.component.css']
})
export class CollateralDetailFormComponent implements OnInit {

  @Input() collateralDetailFormGroup : FormGroup; 

  

  constructor(private _formBuilder: FormBuilder) { 
    this.collateralDetailFormGroup = this._formBuilder.group({}); 

  }

  ngOnInit(): void {
  }

}
