import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, TradingDashboardBuySellComponent } from './trading-dashboard-buysell.component';
import { AppConstants } from "../../../../../app.utility"

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-content-example-dialog.html',
})
export class BuySellConfirmationDialog {
    buySellColor:String=""
    confirmationMsg:String=""

    constructor(
        public dialogRef: MatDialogRef<TradingDashboardBuySellComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { 
        this.confirmation()
        this.confirmationMsg= data.buysellTitle + " " + data.quantity + " shares of " + data.symbolCode + " @ " + data.price + " per share ?"
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmation(){
        if(this.data.buysellTitle=="Buy"){
            this.buySellColor=AppConstants.buyColor
        }
        else if(this.data.buysellTitle=="Sell"){
            this.buySellColor=AppConstants.sellColor
        }
    }
}