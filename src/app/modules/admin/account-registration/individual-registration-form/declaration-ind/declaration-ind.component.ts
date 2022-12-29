import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DeclarationDialogueComponent} from '../declaration-dialog/declaration-dialog.component';

@Component({
    selector: 'app-declaration-ind',
    templateUrl: './declaration-ind.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DeclarationIndComponent implements OnInit {

    @Input() declarationIndFormGroup: FormGroup;


    constructor(private _formBuilder: FormBuilder, public dialog: MatDialog) {
        this.declarationIndFormGroup = this._formBuilder.group({});

    }

    ngOnInit(): void {
    }

    openDialog(): void {
        this.dialog.open(DeclarationDialogueComponent);
    }

}
