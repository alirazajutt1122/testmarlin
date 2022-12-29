import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.css']
})
export class DeclarationComponent implements OnInit {

  @Input() declarationFormGroup : FormGroup; 

  

  constructor(private _formBuilder: FormBuilder) { 
    this.declarationFormGroup = this._formBuilder.group({}); 

  }

  ngOnInit(): void {
  }

}
