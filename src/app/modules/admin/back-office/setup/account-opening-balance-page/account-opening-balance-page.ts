'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AccountOpeningBalance } from 'app/models/account-opening-balance';
import { ChartOfAccount } from 'app/models/chart-of-account';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { DialogCmp } from '../../user-site/dialog/dialog.component';



declare var jQuery: any;

@Component({

    selector: 'account-opening-balance-page',
    templateUrl: './account-opening-balance-page.html',
})
export class AccountOpeningBalancePage implements OnInit {

    public myForm: FormGroup;
    selectedItem: AccountOpeningBalance;
    errorMessage: string;
    //claims: any;
    chartOfAccountList: any[];
    public showPage: boolean = true;
    public sendingJson: any;
    public debit: boolean = true;
    openingBalanceError: boolean = false;

    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    lang: string;

    constructor(private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2,private translate: TranslateService,private loader : FuseLoaderScreenService) {
        //this.claims = authService.claims;
        // this.ShowPage(AppConstants.participantId);
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________

    }
    public post: boolean = false;
    ngOnInit() {
        this.clearFields();
        this.addFromValidations();
        this.populateChartOfAccountList();
    }

    /*********************************
   *      Public & Action Methods
   *********************************/
    public onChartOfAccountChange(coaId: number) {
        if (coaId == AppConstants.PLEASE_SELECT_VAL)
            this.selectedItem.openingBalance = 1;
        else
            this.getOpeningBalance(coaId);
    }

    public onOpeningBalanceChange(bal: number) {
        if (bal < 0)
            this.openingBalanceError = true;
        else
            this.openingBalanceError = false;
    }

    public hideModal() {
        jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
    }

    public onDebitCreditChangeEvent(st: boolean) {
        this.debit = st;
    }

    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }
        this.openingBalanceError = false;
        this.selectedItem = new AccountOpeningBalance();
        this.selectedItem.accountOpeningBalanceId = null;
        this.selectedItem.closingBalance = 0;
        this.selectedItem.debitCredit = '';
        this.selectedItem.openingBalance = 1;
        this.debit = true;
        this.selectedItem.chartOfAccount = new ChartOfAccount();
        if (!AppUtility.isEmptyArray(this.chartOfAccountList)) {
            this.selectedItem.chartOfAccount.glCodeDisplayName_ = this.chartOfAccountList[0].glCodeDisplayName_;
            this.selectedItem.chartOfAccount.chartOfAccountId = this.chartOfAccountList[0].chartOfAccountId;
        }
        if (AppUtility.isValidVariable(this.myForm)) {
            const ctrl_: FormControl = (<any>this.myForm).controls.chartOfAccount;
            ctrl_.setValidators(null);
            ctrl_.updateValueAndValidity();
        }
    }
    public onSaveAction(model: any, isValid: boolean) {
       
        if (isValid && !this.openingBalanceError) {
            this.loader.show();
            if (this.post) {
                this.listingService.saveFiscalYearBalance(this.toJSON()).subscribe(
                    data => {
                        this.loader.hide();
                        this.clearFields();
                        this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
                        this.dialogCmp.showAlartDialog('Success');
                    },
                    err => {
                        this.errorMessage = err;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
            } else {
                this.listingService.updateFiscalYearBalance(this.toJSON()).subscribe(
                    data => {
                        this.loader.hide();
                        this.clearFields();
                        this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                        this.dialogCmp.showAlartDialog('Success');
                    },
                    err => {
                        this.loader.hide();
                        this.errorMessage = err;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });

            }
        }
    }

    public toJSON() {
        if (this.post) {
            this.sendingJson = {
                "fiscalYearBalanceId": null,
                "participantId_": AppConstants.participantId,
                "closingBal": null,
                "openingBal": null,
                "debitCredit_": "",
                "chartOfAccount": {
                    "chartOfAccountId": this.selectedItem.chartOfAccount.chartOfAccountId,
                    "participant": {
                        "participantId": AppConstants.participantId,
                    }
                },
                "fiscalYear": null
            }
        }
        this.sendingJson.openingBal = this.selectedItem.openingBalance;
        this.sendingJson.participantId_ = AppConstants.participantId;
        if (this.debit) this.sendingJson.debitCredit_ = 'Debit'; else this.sendingJson.debitCredit_ = 'Credit';

        console.log(this.sendingJson);
        return this.sendingJson;
        // return {
        //     "closingBal": null,
        //     "openingBal": this.selectedItem.openingBalance,
        //     "chartOfAccount": {
        //         "chartOfAccountId": this.selectedItem.chartOfAccount.chartOfAccountId,
        //         "participant": {
        //             "participantId": AppConstants.participantId,
        //         }
        //     }
        // }
    }

    public FinalSave() {
        if (AppUtility.isValidVariable(this.myForm)) {
            const ctrl_: FormControl = (<any>this.myForm).controls.chartOfAccount;
            ctrl_.setValidators(Validators.required);
            ctrl_.updateValueAndValidity();
        }
    }

    /***************************************
   *          Private Methods
   **************************************/

    private ShowPage(participantId: number) {
        this.listingService.getOpeningBalanceDefiningPriviledge(participantId)
            .subscribe(restData => {
                if (!AppUtility.isValidVariable(restData)) {
                    this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                    this.showPage = false;
                } else {
                    let temp: any = restData;
                    if (temp == 0)
                        this.showPage = false;
                    else
                        this.showPage = true;
                }
            },
                error => this.errorMessage = <any>error)
    }

    private getOpeningBalance(coaId: number) {
        this.loader.show();
        this.listingService.getOpeningBalanceForChartOfAccount(AppConstants.participantId, coaId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (!AppUtility.isValidVariable(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.selectedItem.openingBalance = 0;
                        this.sendingJson = null;
                        this.post = true;
                    } else {
                        let temp: any = restData;
                        console.log(JSON.stringify(restData));
                        this.sendingJson = temp;
                        this.selectedItem.openingBalance = temp.openingBal;
                        if (temp.debitCredit_ == 'Debit')
                            this.debit = true;
                        else
                            this.debit = false;
                        this.post = false;
                    }
                },
                error => {
                    this.loader.hide();
                    this.errorMessage = <any>error
                });
    }

    private populateChartOfAccountList() {
        this.loader.show();
        this.listingService.getChartOfAccountList(AppConstants.participantId, true)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.chartOfAccountList = restData;
                    var vt: ChartOfAccount = new ChartOfAccount();
                    vt.chartOfAccountId = AppConstants.PLEASE_SELECT_VAL;
                    vt.glCodeDisplayName_ = AppConstants.PLEASE_SELECT_STR;
                    this.chartOfAccountList.unshift(vt);
                },
                error => {
                    this.loader.hide();
                    this.errorMessage = <any>error
                });
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            chartOfAccount: [''],
            openingBalance: ['', Validators.compose([Validators.required])]
        });
    }

    public getNotification(btnClicked) {
        if (btnClicked == 'Success')
            this.hideModal();
    }

}