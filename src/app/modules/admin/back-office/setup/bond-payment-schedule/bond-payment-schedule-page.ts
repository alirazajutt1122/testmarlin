'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { Market } from 'app/models/market';
import { Security } from 'app/models/security';



declare var jQuery: any;

@Component({

    selector: 'bond-payment-schedule-page',
    templateUrl: './bond-payment-schedule-page.html',

    encapsulation: ViewEncapsulation.None,
})

export class BondPaymentSchedulePage implements OnInit {
    public showLoader: boolean = false;

    public myForm: FormGroup;

    settlementCalendarList: wjcCore.CollectionView;
    bondPaymentScheduleArr: wjcCore.CollectionView;
    errorMessage: string;

    public static searchButtonEnabled = 'btn btn-success btn-sm'
    public static searchButtonDisabled = 'btn btn-success btn-sm disabled'
    public hideForm = false;
    public status: string = '';
    public exchangeId: Number;
    public settlemnentStatus: String;
    public buttonClass = BondPaymentSchedulePage.searchButtonEnabled;
    exchangesList: any[];
    transactionTypeList: any[];
    searchCriteriaList: any[];
    private _pageSize = 0;
    //claims: any;
    lang: any
    public searchExchangeId: number;
    public searchMarketId: number;
    public searchSecurityId: number;
    searchExchangeList: any[];
    searchMarketList: any[];
    searchSecurityList: any[];
    generate: boolean = false


    @ViewChild('settlementGrid') settlementGrid: wjcGrid.FlexGrid;
    @ViewChild('tradeDate') tradeDate: wjcInput.InputDate;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;


    constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService, private loader: FuseLoaderScreenService) {
        this.clearFields();
        this.hideForm = false;
        //this.claims = authService.claims;

        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ng2translate__________________________________________
    }


    ngOnInit() {
        // populate exchangesList
        this.populateSearchExchangeList()

        // Add Form Validations
        this.addFromValidations();

    }

    /*********************************
   *      Public & Action Methods
   *********************************/
    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }
        this.hideForm = false;


        if (!AppUtility.isEmptyArray(this.exchangesList)) {

        }
    }

    onSearchEvent(sExchangeId, sMarketId, sSecurityId): void {
        if (!AppUtility.isEmpty(sExchangeId)) {
            this.searchExchangeId = sExchangeId;
        }
        if (!AppUtility.isEmpty(sMarketId)) {
            this.searchMarketId = sMarketId;
        }
        if (!AppUtility.isEmpty(sSecurityId))
            this.searchSecurityId = sSecurityId;
        else if (sSecurityId == null)
            this.searchSecurityId = -1;
        if (!AppUtility.isEmpty(this.searchExchangeId) && !AppUtility.isEmpty(this.searchMarketId)) {
            this.onView()
        } else {

        }
    }

    onGenerateEvent(sExchangeId, sMarketId, sSecurityId): void {
        if (!AppUtility.isEmpty(sExchangeId)) {
            this.searchExchangeId = sExchangeId;
        }
        if (!AppUtility.isEmpty(sMarketId)) {
            this.searchMarketId = sMarketId;
        }
        if (!AppUtility.isEmpty(sSecurityId))
            this.searchSecurityId = sSecurityId;
        else if (sSecurityId == null)
            this.searchSecurityId = -1;
        if (!AppUtility.isEmpty(this.searchExchangeId) && !AppUtility.isEmpty(this.searchMarketId)) {
            this.onGeneratePaymentSchedule()
        } else {

        }
    }

    get pageSize(): number {
        return this._pageSize;
    }

    set pageSize(value: number) {
        if (this._pageSize != value) {
            this._pageSize = value;
            if (this.settlementGrid) {
                (<wjcCore.IPagedCollectionView>this.settlementGrid.collectionView).pageSize = value;
            }
        }
    }

    public hideModal() {
        jQuery("#add_new").modal("hide");   //hiding the modal on save/updating the record
    }

    private _selectedStatus: string = ''
    private _msg: string = '';



    /***************************************
   *          Private Methods
   **************************************/
    onSearchExchangeChangeEvent(selectedId): void {
        if (!AppUtility.isEmpty(selectedId))
            this.populateSearchMarketList(selectedId);
        this.searchExchangeId = selectedId;
    }

    onSearchMarketChangeEvent(selectedId): void {
        if (!AppUtility.isEmpty(selectedId)) {
            this.populateSearchSecurityList(selectedId);
        }
        else {
            this.searchSecurityList = null;
        }
    }

    private populateSearchMarketList(exchangeId: number) {
        this.loader.show();
        if (AppUtility.isEmpty(exchangeId)) {
            this.searchMarketList = [];
            var m: Market = new Market();
            m.marketId = AppConstants.PLEASE_SELECT_VAL;
            m.marketCode = AppConstants.PLEASE_SELECT_STR;
            this.searchMarketList.unshift(m);

        }
        else {
            this.listingService.getMarketListByExchangeForBondPayment(exchangeId)
                .subscribe(
                    restData => {
                        this.searchMarketList = [];
                        if (restData != null) {
                            restData.map((a) => {
                                if (a.marketType.description == "BOND" || a.marketType.description == "DEBT") {
                                    this.searchMarketList.unshift(a);
                                }
                            })
                        }
                        this.loader.hide();
                        var m: Market = new Market();
                        m.marketId = AppConstants.PLEASE_SELECT_VAL;
                        m.marketCode = AppConstants.PLEASE_SELECT_STR;
                        this.searchMarketList.unshift(m);
                    },
                    error => {
                        this.loader.hide();
                        this.errorMessage = <any>error.message
                    });
        }
    }

    private populateSearchSecurityList(marketId: number) {
        this.loader.show();
        if (!AppUtility.isEmpty(marketId)) {
            this.listingService.getSecurityByExchangeMarket(this.searchExchangeId, marketId)
                .subscribe(
                    restData => {
                        this.loader.hide();
                        this.searchSecurityList = restData;
                        var sec: Security = new Security();
                        sec.securityId = AppConstants.PLEASE_SELECT_VAL;
                        sec.symbol = AppConstants.PLEASE_SELECT_STR;
                        this.searchSecurityList.unshift(sec);
                    },
                    error => {
                        this.loader.show();
                        this.errorMessage = <any>error.message
                    });
        }
        else
            this.searchSecurityList = null;
    }


    private populateSearchExchangeList() {
        this.loader.show();
        this.listingService.getExchangeList()
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.searchExchangeList = restData;
                    var ex: Exchange = new Exchange();
                    ex.exchangeId = AppConstants.PLEASE_SELECT_VAL;
                    ex.exchangeCode = AppConstants.PLEASE_SELECT_STR;
                    this.searchExchangeList.unshift(ex);
                    // this.searchExchangeId = this.searchExchangeList[0].exchangeId;

                    this.searchExchangeId = (AppConstants.exchangeId === null) ? this.searchExchangeList[0].exchangeId : AppConstants.exchangeId;
                    this.onSearchExchangeChangeEvent(this.searchExchangeId)
                },
                error => {
                    this.loader.show();
                    this.errorMessage = <any>error.message
                });
    }

    private populateBondPaymentSchedule() {
        this.loader.show();

    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            searchExchangeId: [''],
            searchSecurityId: [''],
            searchMarketId: [''],
        });
    }

    public getNotification(btnClicked) {
        if (btnClicked == 'Success')
            this.hideModal();
    }

    onView(): void {
        this.loader.show();
        this.generate = false
        this.bondPaymentScheduleArr = new wjcCore.CollectionView();
        this.listingService.getPaymentScheduleForSecurity(this.searchSecurityId, this.generate).subscribe((restData) => {
            restData.pop()
            if (restData.length) {
                setTimeout(() => {
                    this.bondPaymentScheduleArr = new wjcCore.CollectionView(restData);
                    this.loader.hide();
                }, 500);
            } else {
                this.dialogCmp.statusMsg = 'No Data Found';
                this.dialogCmp.showAlartDialog('Error');
            }
        }, (error) => {
            this.loader.hide();
            this.dialogCmp.statusMsg = 'Something Went Wrong';
            this.dialogCmp.showAlartDialog('Error');
        });
    }

    public onGeneratePaymentSchedule() {
        this.loader.show();
        this.generate = true
        this.bondPaymentScheduleArr = new wjcCore.CollectionView();
        this.listingService.getPaymentScheduleForSecurity(this.searchSecurityId, this.generate)
            .subscribe(
                (resData) => {
                    resData.pop()
                    this.loader.hide();
                    if (resData.length) {
                        setTimeout(() => {
                            this.bondPaymentScheduleArr = new wjcCore.CollectionView(resData);
                            this.loader.hide();
                        }, 500);
                    }
                }, (error) => {
                    this.loader.hide();
                    this.dialogCmp.statusMsg = 'Payment Schedule was not Generated: ';
                    this.dialogCmp.showAlartDialog('Error');
                });
    }
}