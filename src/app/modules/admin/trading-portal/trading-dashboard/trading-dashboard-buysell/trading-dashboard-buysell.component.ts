import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, Inject, Injector, Input,
    OnChanges,
    OnInit,
    ViewEncapsulation
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { TradingDashboardService } from '../trading\'dashboard.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuySellConfirmationDialog } from './confirmation-dialogue.component';
import { TradingDashboardGraphComponent } from '../trading-dashboard-graph/trading-dashboard-graph.component';
import { AppConstants } from "../../../../../app.utility"
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject, Subject } from 'rxjs';

export interface DialogData {
    buysellTitle: string;
    symbolCode: string;
    price: any;
    quantity: any;
    amount: any;

}

@Component({
    selector: 'trading-dashboard-buysell',
    templateUrl: './trading-dashboard-buysell.component.html',
    styleUrls: ['../trading-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})


export class TradingDashboardBuySellComponent implements OnInit, OnChanges {

    public buysellForm: FormGroup;
    @Input() symbolDetails: any;
    @Input() symbolCode: any;
    @Input() buysell: any;

    data = {
        userId: Number,
        avgPrice: 0,
        tradeValue: "",
        earning: 0,
        response: "null",
        securityCode: "",
        price: 0,
        quantity: 0,
        buySell: "B",
        marketCode: "",
        exchangeCode: ""
    }
    amount: Number
    title: String = ""
    buttonTitle: String = ""
    buyWindow: Boolean
    buyColor: String;
    sellColor: String;
    userId: any
    holdingList = new BehaviorSubject<Array<any>>([]);

    constructor(
        private toast: ToastrService,
        private _fb: FormBuilder,
        private tradingService: TradingDashboardService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<TradingDashboardGraphComponent>,
        private _userService: UserService,
        @Inject(MAT_DIALOG_DATA) public buysellData: any,
    ) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.data.userId = user.id;
        this.userId = user.id;
        this.checkBuySell(this.buysellData.action)
    }

    ngOnInit(): void {
        this.addFormValidations()
        this.initializeAppConstants()
        this.getHoldingList()
    }
    ngOnChanges() {
        this.buysellForm?.controls['securityCode'].setValue(this.buysellData.symbolCode);
    }

    initializeAppConstants() {
        this.buyColor = AppConstants.buyColor
        this.sellColor = AppConstants.sellColor
    }

    private addFormValidations() {
        this.buysellForm = this._fb.group({
            securityCode: [this.buysellData.symbolCode, Validators.required],
            price: [this.buysellData.price, [Validators.required, Validators.pattern(/^(\d*\.)?\d+$/)]],
            quantity: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            amount: ['0'],
        });
    }
    get f() {
        return this.buysellForm.controls;
    }
    getErrorMessage(field: string) {
        if (this.buysellForm.get(field).status) {
            return 'You must enter a number';
        }
    }

    submit() {

        this.data.securityCode = this.buysellData.symbolCode
        this.data.price = this.buysellForm.value.price
        this.data.quantity = this.buysellForm.value.quantity
        this.data.marketCode = this.buysellData.marketCode
        this.data.exchangeCode = this.buysellData.exchangeCode
        // ...........................................................AvgBuyPrice(In case of Buy)...................................
        let include = false
        let isFound = false
        let element
        let currentVolume

        if (this.data.buySell == "B") {
            include = this.holdingList.value.some(res => res.securityCode === this.data.securityCode);

            if (include) {
                element = this.holdingList.value.find(res => res.securityCode === this.data.securityCode)
                this.data.avgPrice = element.averageBuyPrice
                currentVolume = element.holding
                isFound = true
            }
            if (!isFound) {
                this.data.avgPrice = this.data.price
            } else {
                let res = ((currentVolume * this.data.avgPrice) + (this.data.quantity * this.data.price)) / (this.data.quantity + currentVolume)
                this.data.avgPrice = res
            }
        }
        // ...........................................................earning(In case of Sell).............................................
        if (this.data.buySell == "S") {
            include = this.holdingList.value.some(res => res.securityCode === this.data.securityCode);

            if (include) {
                element = this.holdingList.value.find(res => res.securityCode === this.data.securityCode)

                let earning = (this.data.price - element.averageBuyPrice) * this.data.quantity;
                this.data.earning = earning
            }
        }
        // ...........................................................Post Trade.............................................
        this.tradingService.postBuySellOrder(this.data).subscribe((res) => {
            if (res.response = true) {
                this.toast.success("", res.message)
                this._userService.userHoldings(this.data.userId)
            }
        },
            (er) => {
                this.toast.error('Something Went Wrong', 'Error');
            });

    }

    
    amountCalculation() {
        this.amount = this.buysellForm.value.price * this.buysellForm.value.quantity
    }

    checkBuySell(input: any) {
        if (input == 'B') {
            this.title = 'BUY'
            this.buttonTitle = "Buy"
            this.buyWindow = true
            this.data.buySell = "B"
        }
        else if (input == 'S') {
            this.title = 'SELL'
            this.buttonTitle = "Sell"
            this.buyWindow = false
            this.data.buySell = "S"
        }
    }

    openDialog() {
        if (!this.buysellForm.valid) {
            this.buysellForm.markAllAsTouched();
        }
        if (this.buysellForm.valid) {
            const dialogRef = this.dialog.open(BuySellConfirmationDialog, {
                width: '400px',
                data: {
                    buysellTitle: this.buttonTitle,
                    symbolCode: this.buysellForm.value.securityCode,
                    price: this.buysellForm.value.price,
                    quantity: this.buysellForm.value.quantity,
                    amount: this.amount
                },
            });


            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.submit()
                    this.onCloseDialog()
                }
            });
        }
    }
    onCloseDialog() {
        this.dialogRef.close();
    }

    getHoldingList() {
        let holdingList = []
        this.tradingService.getUserTradeHoldings(this.userId).subscribe((res => {
            res.map((a) => {
                if (a.holding > 0) {
                    holdingList.push(a)
                }
            })
            this.holdingList.next(holdingList)
        }))
    }

}


