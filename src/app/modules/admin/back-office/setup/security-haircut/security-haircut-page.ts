'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { ParticipantSecurityParams } from 'app/models/participant-security-params';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { ComboItem } from 'app/models/combo-item';

declare var jQuery: any;

@Component({

    selector: 'security-haircut-page',
    templateUrl: './security-haircut-page.html',
})
export class SecurityHaircutPage implements OnInit {
    public myForm: FormGroup;

    itemsList: wjcCore.CollectionView;

    selectedItem: ParticipantSecurityParams;
    errorMessage: string;
    //claims: any;

    public isSubmitted: boolean;
    public isEditing: boolean;
    public searchButtonClass: String;
    public symbolExangeMarketList: any[] = [];
    public rawSymbolList: any[] = [];
    public exchangeNameList: any[];
    public searchExchangeId: number;
    public defaultSecurityHaircut: boolean;

    public symbolMarkerExchange: String = ''
    public market: String = '';
    public _symbol: String = '';
    public _exchange: String = '';
    public exchangeMarketSecurityId: number = -1;

    private _pageSize = 0;

    @ViewChild('symbol') symbol: wjcInput.ComboBox;
    @ViewChild('flex') flex: wjcGrid.FlexGrid;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    lang: string;

    constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2,private translate: TranslateService,private loader : FuseLoaderScreenService) {
        this.isSubmitted = false;
        this.isEditing = false;
        //this.claims = authService.claims;
        this.itemsList = new wjcCore.CollectionView();
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
      
    }

    ngOnInit() {
        this.populateExchangeList();
        this.populateSymbolExangeMarketList(AppConstants.participantId);
        this.clearFields();
        this.addFromValidations();
    }

    ngAfterViewInit() {
        var self = this;
        $('#add_new').on('shown.bs.modal', function (e) {
            self.symbol.focus();
        });
    }

    /*********************************
   *      Public & Action Methods
   *********************************/


    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }
        if (AppUtility.isValidVariable(this.itemsList)) {
            this.itemsList.cancelEdit();
            this.itemsList.cancelNew();
        }
        this.defaultSecurityHaircut = false;

        this.isSubmitted = false;
        this.isEditing = false;
        this.searchButtonClass = 'btn btn-success btn-sm disabled';

        this.symbolMarkerExchange = '';
        this.market = '';
        this._symbol = '';
        this._exchange = '';

        this.selectedItem = new ParticipantSecurityParams();
        this.selectedItem.haircut = 0;
        this.selectedItem.participantSecurityParamsId = null;

        this.selectedItem.exchange = new Exchange();
        if (!AppUtility.isEmptyArray(this.exchangeNameList)) {
            this.selectedItem.exchange.exchangeId = this.exchangeNameList[0].exchangeId;
            this.searchExchangeId = this.exchangeNameList[0].exchangeId;
            this.selectedItem.exchange.exchangeCode = this.exchangeNameList[0].exchangeCode;
        }
    }

    get pageSize(): number {
        return this._pageSize;
    }

    set pageSize(value: number) {
        if (this._pageSize != value) {
            this._pageSize = value;
            if (this.flex) {
                (<IPagedCollectionView><unknown>this.flex.collectionView).pageSize = value;
            }
        }
    }

    public onCancelAction() {
        this.clearFields();
    }

    public onNewAction() {
        this.symbol.selectedValue = '';
        this.clearFields();
    }

    public onEditAction() {
        if (!AppUtility.isEmpty(this.itemsList.currentItem)) {
            this.clearFields();
            this.isEditing = true;
            this.selectedItem.haircut = this.itemsList.currentItem.haircut;
            this.populateSymbolExangeMarket();
            this.itemsList.editItem(this.itemsList.currentItem);
        }
    }

    public onSearchAction() {
        this.populateParticipantSecurityParamsList(this.searchExchangeId);
    }

    public FinalSave() {
    }

    public onExchangeChange(selectedExchangeId): void {
        if (selectedExchangeId == null) {
            this.searchButtonClass = 'btn btn-success btn-sm disabled';
        }
        else {
            this.searchButtonClass = 'btn btn-success btn-sm';
        }
    }

    private toJSON(): any {
        if (this.isEditing) {
            this.itemsList.currentItem.haircut = this.selectedItem.haircut;
            return this.itemsList.currentItem;
        }
        else {
            return {
                "participantSecurityParamsId": null,
                "haircut": this.selectedItem.haircut,
                "exchangeMarketSecurity": {
                    "exchangeMarketSecurityId": this.exchangeMarketSecurityId,
                    "displayName_": this.symbolMarkerExchange
                },
                "participant": {
                    "participantId": AppConstants.participantId
                }
            }
        }
    }

    private populateToGridOnSave(data: any): any {
        return [{
            "participantSecurityParamsId": data.participantSecurityParamsId,
            "haircut": data.haircut,
            "exchangeMarketSecurity": this.getExchangeMarketSecurity(data.exchangeMarketSecurity.exchangeMarketSecurityId),
            "participant": {
                "participantId": AppConstants.participantId
            }
        }];
    }

    private getExchangeMarketSecurity(exMarSecId: number) {
        for (let i: number = 0; i < this.rawSymbolList.length; i++) {
            if (this.rawSymbolList[i].exchangeMarketSecurityId == exMarSecId)
                return this.rawSymbolList[i];
        }
    }
    public onSymbolChange() {
        this.market = '';
        this._exchange = '';
        this._symbol = '';
        this.symbolMarkerExchange = '';
        this.splitSymbolExchangeMarket();
    }

    private splitSymbolExchangeMarket() {
        var strArr: any[];
        
        if (this.symbol.selectedValue != null && this.symbol.selectedValue.length > 0
            && this.symbol.selectedValue.indexOf(AppConstants.LABEL_SEPARATOR2) >= 0) {

            this.symbolMarkerExchange = this.symbol.selectedValue;
            this.getExchangeMarketSecurityId(this.symbol.selectedValue);

// ............................spliting...........................................
            const symbolMarketExchangeArr = this.symbol.selectedValue.split(")");
            const text = symbolMarketExchangeArr[0]
            const symbol_MarketExchangeArr = text.split("(");
            this._symbol = (typeof symbol_MarketExchangeArr[0] === 'undefined') ? '' : symbol_MarketExchangeArr[0];
            const market_exchange = symbol_MarketExchangeArr[1]
// ............................spliting...........................................

            let strArr = market_exchange.split(AppConstants.LABEL_SEPARATOR2);
            // this._symbol = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
            this.market = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
            this._exchange = (typeof strArr[1] === 'undefined') ? '' : strArr[1];
        }
    }

    private getExchangeMarketSecurityId(value: any) {
        if (!AppUtility.isEmptyArray(this.symbolExangeMarketList)) {
            for (let i = 0; i < this.symbolExangeMarketList.length; i++) {
                if (value == this.symbolExangeMarketList[i].value) {
                    this.exchangeMarketSecurityId = this.symbolExangeMarketList[i].id;
                }
            }
        }
    }

    public onDefaultSecurityHaircutChange(numberOfRecordsInGrid: Number) {
        
        if (numberOfRecordsInGrid.valueOf() < 0 || numberOfRecordsInGrid.valueOf() > 100)
            this.defaultSecurityHaircut = true;
        else {
            this.defaultSecurityHaircut = false;
        }
    }

    public onSaveAction(model: any, isValid: boolean) {
        this.myForm
        this.isSubmitted = true;
        
        if (isValid && !this.defaultSecurityHaircut) {
            this.loader.show();
            if (this.isEditing) {
                this.listingService.updateParticipantSecurityParams(this.toJSON()).subscribe(
                    data => {
                        this.loader.hide();
                        this.itemsList.commitEdit();
                        // this.clearFields();
                        this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                        this.dialogCmp.showAlartDialog('Success');
                        this.flex.refresh();
                    },
                    err => {
                        this.loader.hide();
                        this.errorMessage = err.message;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
            }
            else {
                this.listingService.saveParticipantSecurityParams(this.toJSON()).subscribe(
                    data => {
                        this.loader.hide();
                        // this.clearFields();
                        this.itemsList = new wjcCore.CollectionView(this.populateToGridOnSave(data));
                        this.itemsList.refresh();
                        this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
                        this.dialogCmp.showAlartDialog('Success');
                    },
                    err => {
                        this.loader.hide();
                        this.errorMessage = err.message;
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    });
            }
        }
    }


    /***************************************
   *          Private Methods
   **************************************/
    private populateExchangeList() {
        this.loader.show();
        this.listingService.getExchangeList()
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.exchangeNameList = restData;
                    let cs: Exchange = new Exchange();
                    cs.exchangeId = AppConstants.PLEASE_SELECT_VAL;
                    cs.exchangeCode = AppConstants.PLEASE_SELECT_STR;
                    this.exchangeNameList.unshift(cs);
                    this.searchExchangeId = (AppConstants.exchangeId === null) ? this.exchangeNameList[0].exchangeId : AppConstants.exchangeId;
                    this.onExchangeChange(this.searchExchangeId)
                },
                error => {
                    this.loader.hide();
                    this.errorMessage = <any>error.message;
                });
    }

    private populateParticipantSecurityParamsList(exchangeId: number) {
        this.loader.show();
        this.listingService.getParticipantSecurityParams(AppConstants.participantId, exchangeId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                        this.itemsList = new wjcCore.CollectionView();
                        this.dialogCmp.statusMsg = this.errorMessage;
                        this.dialogCmp.showAlartDialog('Error');
                    }
                    else {
                        console.log(JSON.stringify(restData));
                        this.itemsList = new wjcCore.CollectionView(restData);
                    }
                },
                error => {
                    this.loader.hide();
                    this.errorMessage = <any>error.message;
                });
    }

    updateSymbolList(data): void {
        let symbolList: any[] = [];
        if (AppUtility.isValidVariable(data) && !AppUtility.isEmpty(data)) {
            for (let i = 0; i < data.length; i++) {
                symbolList[i] = data[i];
                symbolList[i].id = data[i].exchangeMarketSecurityId;
                symbolList[i].value = data[i].displayName_;
            }
        }
        let cmbItem: ComboItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, '');
        symbolList.unshift(cmbItem);
        this.symbolExangeMarketList = symbolList;
    }

    private populateSymbolExangeMarketList(_participantId: number) {
        this.loader.show();
        // this.listingService.getParticipantSecurityExchangesByMarket(_participantId,'REGULAR')
        //  this.listingService.getParticipantSecurityExchanges(_participantId) //  defect id: 893 @ 30/Mar/2017 - AiK
        //  discuss with Danish & Khurram sb, we need to fetch base market securities, defect id: 761 @ 14/Apr/2017 - AiK
        this.listingService.getParticipantSecurityExchangesByBaseMarket(_participantId)
            .subscribe(restData => {
                this.loader.hide();
                if (AppUtility.isValidVariable(restData)) {
                    this.rawSymbolList = restData;
                    this.updateSymbolList(restData);
                }
            },
                error => {
                    this.loader.hide();
                    this.errorMessage = <any>error.message;
                });
    }

    public populateSymbolExangeMarket() {
        if (AppUtility.isValidVariable(this.symbolExangeMarketList)) {
            for (let i: number = 0; i < this.symbolExangeMarketList.length; i++) {
                if (this.symbolExangeMarketList[i].exchangeCode == this.itemsList.currentItem.exchangeMarketSecurity.exchangeCode
                    && this.symbolExangeMarketList[i].marketCode == this.itemsList.currentItem.exchangeMarketSecurity.marketCode
                    && this.symbolExangeMarketList[i].securityCode == this.itemsList.currentItem.exchangeMarketSecurity.securityCode) {
                    this.symbolMarkerExchange = this.symbolExangeMarketList[i].displayName_;

                    // assigning the Exchange object.
                    this._exchange = this.symbolExangeMarketList[i].exchangeCode;

                    // assigning the Market object
                    this.market = this.symbolExangeMarketList[i].marketCode;

                    // assigning the Security object
                    this._symbol = this.symbolExangeMarketList[i].securityCode;
                }
            }
        }
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            symbol: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternStringSymbolMarketExchange)])],
            defaultSecurityHaircut: ['']
        });
    }

    public hideModal() {
        jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
    }

    public getNotification(btnClicked) {
        if (btnClicked == 'Success')
            this.hideModal();
    }

}