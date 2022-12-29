'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { SettlementCalendar } from 'app/models/settlement-calendar';
import { SettlementType } from 'app/models/settlement-type';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';



declare var jQuery: any;

@Component({

    selector: 'settlement-page',
    templateUrl: './settlement-page.html',

    encapsulation: ViewEncapsulation.None,
})

export class SettlementPage implements OnInit {
    public showLoader: boolean = false;

    public myForm: FormGroup;

    settlementCalendarList: wjcCore.CollectionView;
    selectedItem: SettlementCalendar;
    errorMessage: string;

    public static searchButtonEnabled = 'btn btn-success btn-sm'
    public static searchButtonDisabled = 'btn btn-success btn-sm disabled'
    public hideForm = false;
    public status: string = '';
    public exchangeId: Number;
    public settlemnentStatus: String;
    public buttonClass = SettlementPage.searchButtonEnabled;
    exchangesList: any[];
    transactionTypeList: any[];
    searchCriteriaList: any[];
    private _pageSize = 0;
    //claims: any;
    lang: any


    @ViewChild('settlementGrid') settlementGrid: wjcGrid.FlexGrid;
    @ViewChild('tradeDate') tradeDate: wjcInput.InputDate;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;


    constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, 
        private translate: TranslateService, private loader : FuseLoaderScreenService) {
        this.clearFields();
        this.hideForm = false;
        //this.claims = authService.claims;
        this.settlementCalendarList = new wjcCore.CollectionView();

        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        if (this.lang == 'pt') {
            AppConstants.PLEASE_SELECT_STR = "Selecione";
        }
        //______________________________for ng2translate__________________________________________
    }


    ngOnInit() {
        // populate exchangesList
        this.populateExchangeList();

        if (this.lang=='en'){
            this.searchCriteriaList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL },
            { "name": "Processed", "code": "P" }, { "name": "Un-Processed", "code": "U" }];
            }
    
            if (this.lang=='pt'){
                this.searchCriteriaList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL },
                { "name": "Processada", "code": "P" }, { "name": "Não Processado", "code": "U" }];
                }

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

        this.selectedItem = new SettlementCalendar();
        this.selectedItem.active = false;
        this.selectedItem.processed = false;
        this.selectedItem.endDate = new Date();
        this.selectedItem.settlementDate = new Date();
        this.selectedItem.startDate = new Date();
        this.selectedItem.settlementType = new SettlementType();
        this.selectedItem.settlementType.settlementTypeId = null;
        this.selectedItem.settlementType.active = false;
        this.selectedItem.settlementType.settlementDays = null;
        this.selectedItem.settlementType.settlementDesc = '';
        this.selectedItem.settlementType.settlementType = '';
        this.selectedItem.settlementType.tradeDays = null;
        this.selectedItem.settlementTypeList = [];
        this.selectedItem.exchange = new Exchange();
        if (!AppUtility.isEmptyArray(this.exchangesList)) {
            this.selectedItem.exchange.exchangeId = this.exchangesList[0].exchangeId;
            this.selectedItem.exchange.exchangeName = this.exchangesList[0].exchangeName;
            this.selectedItem.exchange.exchangeCode = this.exchangesList[0].exchangeCode;
            this.selectedItem.exchange.contactDetail = this.exchangesList[0].contactDetail;
        }
    }

    public onSearchTransaction(selectedStatus, tradeDate, exchangeId): void {
        if (AppUtility.isEmpty(selectedStatus)) {
            //alert("Please select status");
            this.dialogCmp.statusMsg = "Please select status";
            if(this.lang=='pt'){this.dialogCmp.statusMsg = "Por favor, selecione o estado";}
            this.dialogCmp.showAlartDialog('Warning');
            this.settlementCalendarList = new wjcCore.CollectionView();
            this.settlementGrid.refresh();
        }
        else if (AppUtility.isEmpty(exchangeId)) {
            this.dialogCmp.statusMsg = "Please select exchange";
            if(this.lang=='pt'){this.dialogCmp.statusMsg = "Por favor, selecione a troca";}
            this.dialogCmp.showAlartDialog('Warning');
            //alert("Please select exchange");
            this.settlementCalendarList = new wjcCore.CollectionView();
            this.settlementGrid.refresh();
        }
        else {
            this.loader.show();
            if (AppUtility.isEmpty(selectedStatus)) {
                this.buttonClass = SettlementPage.searchButtonDisabled;
            }
            if (AppUtility.isEmpty(exchangeId)) {
                this.buttonClass = SettlementPage.searchButtonDisabled;
            }
            else {
                this.listingService.getSettlementCalenderBy_ExchangeId_Status_TradeDate(AppConstants.participantId, exchangeId, tradeDate, selectedStatus)
                    .subscribe(
                        restData => {
                            this.loader.hide();
                            if (AppUtility.isEmptyArray(restData)) {
                                this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                                this.settlementCalendarList = new wjcCore.CollectionView();
                                this.settlementGrid.refresh();
                                this.dialogCmp.statusMsg = this.errorMessage;
                                this.dialogCmp.showAlartDialog('Error');
                                //alert(this.errorMessage);
                            } else {
                                this.settlementCalendarList = new wjcCore.CollectionView(restData);
                                // Select the newly added item
                                AppUtility.moveSelectionToLastItem(this.settlementCalendarList);
                                this._pageSize = 0;
                            }
                        },
                        error => {
                            this.loader.hide();
                            if(error.message){
                                this.errorMessage = error.message;
                            }
                            else{
                                this.errorMessage = error;
                            }
                            
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');
                            // alert(this.errorMessage);
                        });

                if (selectedStatus == "P") {
                    this.status = "P";
                }
                else {
                    this.status = "U";
                }
            }
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

    public onPostAction(selectedStatus) {
        debugger
        this._selectedStatus = selectedStatus
        if (this.settlementCalendarList.itemCount < 1) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            this.settlementCalendarList = new wjcCore.CollectionView();
            this.settlementGrid.refresh();
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
            // alert(this.errorMessage);
        }
        else {
            var confirmStr;
            if (selectedStatus == "P") {
                this._msg = AppConstants.MSG_RECORD_PROCESSED;

                // confirmStr = confirm("Are you sure you want to Process all records?");
                this.dialogCmp.statusMsg = "Are you sure you want to Process all records?";
                if(this.lang=='pt'){this.dialogCmp.statusMsg = "Tem certeza de que deseja Processar todos os registros?";}
                this.dialogCmp.showAlartDialog('Confirmation');
            }
            else {
                this._msg = AppConstants.MSG_RECORD_REVERSED;
                // confirmStr = confirm("Are you sure you want to Reverse all records?");
                this.dialogCmp.statusMsg = "Are you sure you want to Reverse all records?";
                if(this.lang=='pt'){this.dialogCmp.statusMsg = "Tem certeza de que deseja Reverter todos os registros?";}
                this.dialogCmp.showAlartDialog('Confirmation');
            }
        }
    }

    public onExchangeChangeEvent(exId) {
        if (AppUtility.isValidVariable(this.exchangesList)) {
            for (let i = 0; i < this.exchangesList.length; i++) {
                if (this.exchangesList[i].exchangeId === exId) {
                    this.selectedItem.exchange.exchangeName = this.exchangesList[i].exchangeName;
                    this.selectedItem.exchange.exchangeCode = this.exchangesList[i].exchangeCode;
                }
            }
        }
      
    }

    public onStatusChangeEvent(exId) {
        // if (AppUtility.isEmpty(exId)) {
        //     this.buttonClass = SettlementPage.searchButtonDisabled;
        // } else {
        //     if (!AppUtility.isEmpty(this.selectedItem.exchange.exchangeId))
        //         this.buttonClass = SettlementPage.searchButtonEnabled;
        // }
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
                    this.exchangesList = restData;
                    let exch: Exchange = new Exchange();
                    exch.exchangeId = AppConstants.PLEASE_SELECT_VAL;
                    exch.exchangeName = AppConstants.PLEASE_SELECT_STR;
                    this.exchangesList.unshift(exch)
                },
                error => {
                    this.loader.hide();
                    if(error.message){
                        this.errorMessage = error.message;
                    }
                    else{
                        this.errorMessage = error;
                    }
                });
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            tradeDate: [''],
            exchangeName: [''],
        });
    }

    public getNotification(btnClicked) {
        debugger
        if (btnClicked == 'Success')
            this.hideModal();

        else if (btnClicked == 'Yes') {
            var items: String[] = [];
            for (var i = 0; i < this.settlementCalendarList.itemCount; i++) {
                items.push(this.settlementCalendarList.items[i].settlementCalendarId);
                console.log("--------------" + items[i]);
            }

            this.exchangeId = this.selectedItem.exchange.exchangeId;
            if (this._selectedStatus == "P")
                this.settlemnentStatus = 'U'
            else
                this.settlemnentStatus = 'P'
            this.loader.show();
            this.listingService.updateSettlementStatus(items, this._selectedStatus, AppConstants.participantId).subscribe(
                data => {
                    this.loader.hide();
                    console.log("update>>>>>" + data);
                    this.dialogCmp.statusMsg = this._msg;
                    this.dialogCmp.showAlartDialog('Success');
                    //alert(msg);
                    this.settlementCalendarList = new wjcCore.CollectionView();
                    this.settlementGrid.refresh();
                },
                error => {
                    if(error.message){
                        this.errorMessage = error.message;
                    }
                    else{
                        this.errorMessage = error;
                    }
                    this.loader.hide();
                    this.dialogCmp.statusMsg = this.errorMessage;
                    this.dialogCmp.showAlartDialog('Error');
                    // alert(this.errorMessage);
                    AppUtility.printConsole(this.settlemnentStatus + ", " + this.tradeDate.text + ", " + this.exchangeId);
                    this.onSearchTransaction(this.settlemnentStatus, this.tradeDate.text, this.exchangeId);
                }
            );
        }
    }
}