'use strict';

import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { CollectionView, SortDescription,IPagedCollectionView,} from '@grapecity/wijmo';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Alert } from 'app/models/alert';
import { Expression } from 'app/models/expression';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { ListingService } from 'app/services-oms/listing-oms.service';
import { OrderService } from 'app/services-oms/order-oms.service';
import { AlertMessage } from 'app/models/alert-message';
import { ComboItem } from 'app/models/combo-item';




declare var jQuery: any;

@Component({
    selector: 'configure-alerts',
    templateUrl: './configure-alerts.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ConfigureAlertComponent implements OnInit {
    public myForm: FormGroup;

    itemsList: wjcCore.CollectionView;
    selectedItem: Alert;
    e1: Expression;
    e2: Expression;

    parametresList: any[];
    operatorList: any[];
    symbolExangeMarketList: any[];
    conditionList: any[];
    alertList: any[];
    errorMessage: string;

    public isParentDisabled: boolean;
    public hideForm = false;
    public isSubmitted: boolean;

    public value1RateError: boolean;
    public value2RateError: boolean;
    public maxValue1: number;
    public maxValue2: number;

    public minValue1: number;
    public minValue2: number;

    public value1: number;
    public value2: number;

    public showSecondCondition: Boolean;
    _pageSize = 0;
    claims: any;
    lang:any

    @ViewChild('flex',{ static: false }) flex: wjcGrid.FlexGrid;
    @ViewChild('symbol',{ static: false }) symbol: wjcInput.ComboBox;
    @ViewChild('value1',{ static: true }) value1Control: wjcInput.InputNumber;
    @ViewChild('value2',{ static: false }) value2Control: wjcInput.InputNumber;
    @ViewChild('dialogCmp',{ static: false }) dialogCmp: DialogCmp;

    // --------------------------------------------------------------------------------

    constructor(private appState: AppState, private listingService: ListingService, private orderService: OrderService,
        private _fb: FormBuilder,private translate: TranslateService , public userService: AuthService) {
        this.clearFields();
        this.claims = this.userService.claims;
        this.hideForm = false;
        this.isSubmitted = false;
    
    //_______________________________for ngx_translate_________________________________________

    this.lang=localStorage.getItem("lang");
    if(this.lang==null){ this.lang='en'}
    this.translate.use(this.lang)
    
    //______________________________for ngx_translate__________________________________________
    if (this.lang=='en'){
        this.parametresList = [
            {
                'id': AppConstants.PLEASE_SELECT_VAL,
                'name': AppConstants.PLEASE_SELECT_STR
            },
            {
                'id': 'TRADED_VOLUME',
                'name': 'Traded Volume'
            },
            {
                'id': 'PRICE',
                'name': 'Traded Price'
            },
            {
                'id': 'TRADED_VALUE',
                'name': 'Traded Value'
            },
            {
                'id': 'PRICE_CHANGE',
                'name': 'Price Change'
            },
            {
                'id': 'PERCENTAGE_CHANGE',
                'name': '% Change'
            }];
    }
    else if (this.lang=='po'){
        this.parametresList = [
            {
                'id': AppConstants.PLEASE_SELECT_VAL,
                'name': AppConstants.PLEASE_SELECT_STR
            },
            {
                'id': 'TRADED_VOLUME',
                'name': 'Volume Negociado'
            },
            {
                'id': 'PRICE',
                'name': 'Preço Negociado'
            },
            {
                'id': 'TRADED_VALUE',
                'name': 'Valor Negociado'
            },
            {
                'id': 'PRICE_CHANGE',
                'name': 'Mudança De Preço'
            },
            {
                'id': 'PERCENTAGE_CHANGE',
                'name': '% Mudar'
            }];
     }
        

        this.operatorList = [
            {
                'id': AppConstants.PLEASE_SELECT_VAL,
                'abbreviation': AppConstants.PLEASE_SELECT_STR
            },
            {
                'abbreviation': '<',
                'id': '<'
            },
            {
                'abbreviation': '>',
                'id': '>'
            },
            {
                'abbreviation': '>=',
                'id': '>='
            },
            {
                'abbreviation': '<=',
                'id': '<='
            },
            {
                'abbreviation': '=',
                'id': '='
            },
            {
                'abbreviation': '<>',
                'id': '<>'
            }];
    if (this.lang=='en'){
        this.conditionList = [
            {
                'id': AppConstants.PLEASE_SELECT_VAL,
                'name': AppConstants.PLEASE_SELECT_STR
            },
            {
                'id': 'AND',
                'name': 'AND'
            },
            {
                'id': 'OR',
                'name': 'OR'
            }];
        }
    else if (this.lang=='po'){ 
        this.conditionList = [
            {
                'id': AppConstants.PLEASE_SELECT_VAL,
                'name': AppConstants.PLEASE_SELECT_STR
            },
            {
                'id': 'AND',
                'name': 'E'
            },
            {
                'id': 'OR',
                'name': 'OU'
            }];
    }
    }

    // --------------------------------------------------------------------------------

    ngOnInit() {
        this.populateSymbolExangeMarketList(AppConstants.participantId);

        // Add Form Validations
        this.addFromValidations();

        // Add alerts on flex grid
        this.populateAlertsList(this.claims.sub);
    }

    // --------------------------------------------------------------------------------

    public clearFields() {
        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }

        if (AppUtility.isValidVariable(this.itemsList)) {
            this.itemsList.cancelEdit();
            this.itemsList.cancelNew();
        }

        this.hideForm = false;
        this.isSubmitted = false;
        this.value1RateError = false;
        this.value2RateError = false;
        this.showSecondCondition = false;

        this.maxValue1 = 999999.9999;
        this.maxValue2 = 999999.9999;

        this.minValue1 = 0.01;
        this.minValue2 = 0.01;

        this.value1 = 0;
        this.value2 = 0;

        this.e1 = new Expression();
        this.e1.condition = '';
        this.e1.operator = '';
        this.e1.parameter = '';
        this.e1.value = this.minValue1;

        this.e2 = new Expression();
        this.e2.condition = '';
        this.e2.operator = '';
        this.e2.parameter = '';
        this.e2.value = this.minValue2;

        this.selectedItem = new Alert();
        this.selectedItem.expression = '';
        this.selectedItem.postfix_expression = '';
        this.selectedItem.message = '';
        this.selectedItem.name = '';
        this.selectedItem.id = -1;
        this.selectedItem.persistance = true;

        this.selectedItem.exchange = '';
        this.selectedItem.market = '';
        this.selectedItem.symbol = '';
        this.selectedItem.symbolMarkerExchange = '';
        this.selectedItem.user = '2';
    }

    // --------------------------------------------------------------------------------

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
    
    // --------------------------------------------------------------------------------

    public onSymbolChange() {
        // this.selectedItem.market = '';
        // this.selectedItem.exchange = '';
        // this.selectedItem.symbol = '';
        // this.selectedItem.symbolMarkerExchange = '';
        this.splitSymbolExchangeMarket();
    }

    // --------------------------------------------------------------------------------

    splitSymbolExchangeMarket() {
        let strArr : any[];
        if (this.symbol.selectedValue != null && this.symbol.selectedValue.length > 0) {
            strArr = AppUtility.isSplitSymbolMarketExchange(this.symbol.selectedValue);
            
            this.selectedItem.symbol = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
            this.selectedItem.market = (typeof strArr[1] === 'undefined') ? '' : strArr[1];
            this.selectedItem.exchange = (typeof strArr[2] === 'undefined') ? '' : strArr[2];
            
            
            this.selectedItem.symbolMarkerExchange = this.symbol.selectedValue;
           

        }
    }

    // --------------------------------------------------------------------------------

    public onCancelAction() {
        this.clearFields();
        this.hideForm = false;
        this.hideModal();
    }

    // --------------------------------------------------------------------------------

    public onNewAction() {
        this.symbol.selectedValue = '';
        this.clearFields();
        this.isParentDisabled = false;
        this.hideForm = true;
    }

    // --------------------------------------------------------------------------------

    public onEditDetailAction() {
        if (!AppUtility.isEmpty(this.itemsList.currentItem)) {
            this.clearFields();
            this.isParentDisabled = true;
            this.selectedItem = this.itemsList.currentItem;
            this.populateSymbolExangeMarket();
            this.populateExpression();
            this.itemsList.editItem(this.selectedItem);
            this.value1 = this.e1.value.valueOf();
            this.value2 = this.e2.value.valueOf();
        }
    }

    // --------------------------------------------------------------------------------

    public onEditDetailDelete() {
        this.dialogCmp.statusMsg = AppConstants.MSG_CONFIRM_RECORD_DELETION;
        this.dialogCmp.showAlartDialog('Confirmation');


        
        // let _confirm: boolean = confirm(AppConstants.MSG_CONFIRM_RECORD_DELETION);
        // if (!_confirm)
        // {
        //     return;
        // }
        // this.selectedItem.expression = this.itemsList.currentItem.expression;
        // this.selectedItem.message = this.itemsList.currentItem.message;
        // this.selectedItem.name = this.itemsList.currentItem.name;
        // this.selectedItem.id = this.itemsList.currentItem.id;
        // this.populateSymbolExangeMarket();
        // this.populateExpression();
        // let temp = this.toJSON(false, this.selectedItem);

        // let alertMessage: AlertMessage = new AlertMessage();
        // this.orderService.deleteAlert(temp, AppConstants.username).subscribe(
        //     data =>
        //     {
        //         this.itemsList.remove(this.itemsList.currentItem);
        //         this.itemsList.refresh();
        //     },
        //     error =>
        //     {
        //         alertMessage.message = AppUtility.ucFirstLetter(
        //             AppUtility.removeQuotesFromStartAndEndOfString(JSON.parse(JSON.stringify(error))._body));
        //         if (alertMessage.message.length > 0)
        //         {
        //             alertMessage.type = 'danger';
        //             this.dialogCmp.statusMsg = 'No Error Received from server.';
        //             this.dialogCmp.showAlartDialog('Error');
        //         }
        //         else
        //         {
        //             alertMessage.type = 'success';
        //             this.dialogCmp.statusMsg = 'Error Message from Database' + JSON.stringify(alertMessage);
        //             this.dialogCmp.showAlartDialog('Error');
        //         }
        //     });
    }

    // --------------------------------------------------------------------------------

    public MakeExpression() {
        this.onConditionChange(this.e1.condition);
        if (this.e1.condition === '' || this.e1.condition == null) {
            this.selectedItem.expression = this.e1.parameter.toString() + ' ' +
                this.e1.operator.toString() + ' ' +
                this.e1.value.toString() + ' ';
        }
        else {
            this.selectedItem.expression = this.e1.parameter.toString() + ' ' +
                this.e1.operator.toString() + ' ' +
                this.e1.value.toString() + ' ' +
                this.e1.condition.toString() + ' ' +
                this.e2.parameter.toString() + ' ' +
                this.e2.operator.toString() + ' ' +
                this.e2.value.toString() + ' ';
        }
    }

    // --------------------------------------------------------------------------------

    public populateExpression() {
        let strArr = this.itemsList.currentItem.expression.split(' ');
        this.e1.parameter = String((typeof strArr[0] === 'undefined') ? '' : strArr[0]);
        this.e1.operator = (typeof strArr[0] === 'undefined') ? '' : strArr[1];
        this.e1.value = Number((typeof strArr[0] === 'undefined') ? '' : strArr[2]);
        this.e1.condition = (typeof strArr[0] === 'undefined') ? '' : strArr[3];
        this.e2.parameter = (typeof strArr[0] === 'undefined') ? '' : strArr[4];
        this.e2.operator = (typeof strArr[0] === 'undefined') ? '' : strArr[5];
        this.e2.value = Number((typeof strArr[0] === 'undefined') ? '' : strArr[6]);
    }

    // --------------------------------------------------------------------------------

    public populateSymbolExangeMarket() {
        if (AppUtility.isValidVariable(this.symbolExangeMarketList)) {
            for (let i: number = 0; i < this.symbolExangeMarketList.length; i++) {
                if (this.symbolExangeMarketList[i].exchangeCode === this.itemsList.currentItem.exchange
                    && this.symbolExangeMarketList[i].marketCode === this.itemsList.currentItem.market
                    && this.symbolExangeMarketList[i].securityCode === this.itemsList.currentItem.symbol) {
                    this.selectedItem.symbolMarkerExchange = this.symbolExangeMarketList[i].displayName_;

                    // assigning the Exchange object.
                    this.selectedItem.exchange = this.symbolExangeMarketList[i].exchangeCode;

                    // assigning the Market object
                    this.selectedItem.market = this.symbolExangeMarketList[i].marketCode;

                    // assigning the Security object
                    this.selectedItem.symbol = this.symbolExangeMarketList[i].securityCode;
                }
            }
        }
    }

    // --------------------------------------------------------------------------------

    public onValueChange1(value1: Number) {
        if (value1.valueOf() < this.minValue1 || value1.valueOf() > this.maxValue1 ||
            (this.e1.parameter === 'TRADED_VOLUME' && value1.valueOf() % 1 !== 0))
            this.value1RateError = true;
        else
            this.value1RateError = false;
    }

    // --------------------------------------------------------------------------------

    public onValueChange2(value2: Number) {
        if (value2.valueOf() < this.minValue2 || value2.valueOf() > this.maxValue2 ||
            (this.e2.parameter === 'TRADED_VOLUME' && value2.valueOf() % 1 !== 0))
            this.value2RateError = true;
        else
            this.value2RateError = false;
    }

    // --------------------------------------------------------------------------------

    public onParameter1Change(stId) {
        if (stId === 'PERCENTAGE_CHANGE') {
            this.value1Control.format = 'n2';
            this.maxValue1 = 100;
            this.minValue1 = 0.01;
            if (this.value1 !== 0)
                this.e1.value = this.value1;
            else
                this.e1.value = 0.01;
            this.value1Control.min = 0.01;
        }
        else if (stId === 'TRADED_VOLUME') {
            this.value1Control.format = 'n';
            this.maxValue1 = 999999;
            this.minValue1 = 1;
            if (this.value1 !== 0)
                this.e1.value = this.value1;
            else
                this.e1.value = 1;
            this.value1Control.min = 1;
        }
        else {
            this.value1Control.format = 'n4';
            this.maxValue1 = 999999.9999;
            this.minValue1 = 0.0001;
            if (this.value1 !== 0)
                this.e1.value = this.value1;
            else
                this.e1.value = 0.0001;
            this.value1Control.min = 0.0001;
        }

        this.onValueChange1(this.e1.value);
        this.value1 = 0;
    }

    // --------------------------------------------------------------------------------

    public onParameter2Change(stId) {
        if (stId === 'PERCENTAGE_CHANGE') {
            if (AppUtility.isValidVariable(this.value2Control) && typeof this.value2Control !== 'undefined')
                this.value2Control.format = 'n2';
            this.maxValue2 = 100;
            this.minValue2 = 0.01;
            if (this.value2 !== 0)
                this.e2.value = this.value2;
            else
                this.e2.value = 0.01;
        }
        else if (stId === 'TRADED_VOLUME') {
            if (AppUtility.isValidVariable(this.value2Control) && typeof this.value2Control !== 'undefined')
                this.value2Control.format = 'n';
            if (this.value2 !== 0)
                this.e2.value = this.value2;
            else
                this.e2.value = 1;
            this.maxValue2 = 999999;
            this.minValue2 = 1;
        }
        else {
            if (AppUtility.isValidVariable(this.value2Control) && typeof this.value2Control !== 'undefined')
                this.value2Control.format = 'n4';
            this.maxValue2 = 999999.9999;
            this.minValue2 = 0.0001;

            if (this.value2 !== 0)
                this.e2.value = this.value2;
            else
                this.e2.value = 0.0001;
        }

        this.onValueChange2(this.e2.value);
        this.value2 = 0;
    }


    // --------------------------------------------------------------------------------

    public hideModal() {
        jQuery('#add_new').modal('hide');
    }

    // --------------------------------------------------------------------------------

    public toJSON(save: boolean, alert: Alert): any {
        let temp = {
            'exchange': this.selectedItem.exchange,
            'expression': this.selectedItem.expression,
            'alert_id': alert.id,
            'market': this.selectedItem.market,
            'message': this.selectedItem.message,
            'name': this.selectedItem.name,
            'persistance': this.selectedItem.persistance,
            'post_fix_expression': this.selectedItem.postfix_expression,
            'symbol': this.selectedItem.symbol,
            'username': AppConstants.username,
            'symbolMarkerExchange': this.selectedItem.symbolMarkerExchange
        };

        if (!save)
            temp.alert_id = this.selectedItem.id.valueOf();
        return temp;
    }

    // --------------------------------------------------------------------------------

    public isUnique(alert: Alert): boolean {
        let _check: boolean = true;
        if (AppUtility.isValidVariable(this.itemsList)) {
            for (let i: number = 0; i < this.itemsList.items.length; i++) {
                if (!(this.isParentDisabled && i === this.itemsList.currentPosition)) {
                    if (this.itemsList.items[i].exchange === this.selectedItem.exchange &&
                        this.itemsList.items[i].market === this.selectedItem.market &&
                        this.itemsList.items[i].symbol === this.selectedItem.symbol &&
                        this.itemsList.items[i].expression === this.selectedItem.expression &&
                        this.itemsList.items[i].name === this.selectedItem.name &&
                        this.itemsList.items[i].message === this.selectedItem.message &&
                        this.itemsList.items[i].persistance === this.selectedItem.persistance)
                        _check = false;
                }
            }
        }

        return _check;
    }

    // --------------------------------------------------------------------------------

    public onSaveAction(model: any, isValid: boolean) {
        
        if (!this.value1RateError && !this.value2RateError) {
            this.isSubmitted = true;
            if (isValid) {
                this.appState.showLoader = true;
                if (this.isUnique(this.selectedItem)) {
                    // if edit is not selected
                    if (!this.isParentDisabled) {
                        let alertMessage: AlertMessage = new AlertMessage();
                        let temp = this.toJSON(true, this.selectedItem);
                        this.orderService.saveAlert(temp, AppConstants.username).subscribe(
                            data => {
                                this.appState.showLoader = false;
                                this.populateAlertsList(this.claims.sub);
                             
                                // Select the newly added item
                                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
                                this.dialogCmp.showAlartDialog('Success');
                            },
                            error => {
                       
                                this.appState.showLoader = false;
                                alertMessage.message = AppUtility.ucFirstLetter(
                                    AppUtility.removeQuotesFromStartAndEndOfString(JSON.parse(JSON.stringify(error))._body));
                                if (alertMessage.message.length > 0) {
                                    alertMessage.type = 'danger';
                                    this.dialogCmp.statusMsg = 'No Error Received from server.';
                                    if (this.lang=='po'){
                                        this.dialogCmp.statusMsg = 'Nenhum erro recebido do servidor.';
                                       }
                                    this.dialogCmp.showAlartDialog('Error');
                                }
                                else {
                                    alertMessage.type = 'success';
                                    this.dialogCmp.statusMsg = 'Error Message from Database' + JSON.stringify(alertMessage);
                                    if (this.lang=='po'){
                                        this.dialogCmp.statusMsg = 'Mensagem de erro do banco de dados' + JSON.stringify(alertMessage);
                                       }
                                    this.dialogCmp.showAlartDialog('Error');
                                }
                            });
                    }
                    else {
                        // if edit is selected
                        let alertMessage: AlertMessage = new AlertMessage();
                        let temp = this.toJSON(false, this.selectedItem);
                        this.orderService.updateAlert(temp, AppConstants.username).subscribe(
                            data => {
                                this.appState.showLoader = false;
                                // success
                                AppUtility.printConsole('this.selectedItem: ' + JSON.stringify(this.selectedItem));
                                AppUtility.printConsole('temp ' + JSON.stringify(temp));
                                this.fillAlertsFromJson(this.selectedItem, temp, data._body);
                                this.itemsList.commitEdit();
                                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                                this.dialogCmp.showAlartDialog('Success');
                                this.flex.refresh();
                            },
                            error => {
                                this.appState.showLoader = false;
                                alertMessage.message = AppUtility.ucFirstLetter(
                                    AppUtility.removeQuotesFromStartAndEndOfString(JSON.parse(JSON.stringify(error))._body));
                                if (alertMessage.message.length > 0) {
                                    alertMessage.type = 'danger';
                                    this.dialogCmp.statusMsg = 'No Error Received from server.';
                                    if (this.lang=='po'){
                                        this.dialogCmp.statusMsg = 'Nenhum erro recebido do servidor.';
                                       }
                                    this.dialogCmp.showAlartDialog('Error');
                                }
                                else {
                                    alertMessage.type = 'success';
                                    this.dialogCmp.statusMsg = 'Error Message from Database' + JSON.stringify(alertMessage);
                                    if (this.lang=='po'){
                                        this.dialogCmp.statusMsg = 'Mensagem de erro do banco de dados' + JSON.stringify(alertMessage);
                                       }
                                    this.dialogCmp.showAlartDialog('Error');
                                }
                            });
                    }
                }
                else {
                    this.dialogCmp.statusMsg = 'Alert already exists';
                    if (this.lang=='po'){
                        this.dialogCmp.statusMsg = 'O alerta já existe';
                       }
                    this.dialogCmp.showAlartDialog('Notification');
                }

            }
        }

    }

    // --------------------------------------------------------------------------------

    public onConditionChange(stId) {
        if ('' === stId || stId === AppConstants.PLEASE_SELECT_VAL) {
            this.showSecondCondition = false;
            const ctrlCondition: FormControl = (<any>this.myForm).controls.condition;
            ctrlCondition.setValidators(null);
            ctrlCondition.updateValueAndValidity();

            const ctrlParameter2: FormControl = (<any>this.myForm).controls.parameter2;
            ctrlParameter2.setValidators(null);
            ctrlParameter2.updateValueAndValidity();

            const ctrlOperator2: FormControl = (<any>this.myForm).controls.operator2;
            ctrlOperator2.setValidators(null);
            ctrlOperator2.updateValueAndValidity();

            const ctrlValue2: FormControl = (<any>this.myForm).controls.value2;
            ctrlValue2.setValidators(null);
            ctrlValue2.updateValueAndValidity();
        }
        else {
            this.showSecondCondition = true;

            const ctrlCondition: FormControl = (<any>this.myForm).controls.condition;
            ctrlCondition.setValidators(Validators.required);
            ctrlCondition.updateValueAndValidity();

            const ctrlParameter2: FormControl = (<any>this.myForm).controls.parameter2;
            ctrlParameter2.setValidators(Validators.required);
            ctrlParameter2.updateValueAndValidity();

            const ctrlOperator2: FormControl = (<any>this.myForm).controls.operator2;
            ctrlOperator2.setValidators(Validators.required);
            ctrlOperator2.updateValueAndValidity();

            const ctrlValue2: FormControl = (<any>this.myForm).controls.value2;
            ctrlValue2.setValidators(Validators.required);
            ctrlValue2.updateValueAndValidity();
        }
    }

    // --------------------------------------------------------------------------------

    public onPersistanceChangeEvent(p: boolean) {
        this.selectedItem.persistance = p;
    }

    // --------------------------------------------------------------------------------

    fillAlertsFromJson(st: Alert, data: any, id: string) {
        if (!AppUtility.isEmpty(data)) {
            st.expression = data.expression;
            // st.postfix_expression = data.postfix_expression;
            st.postfix_expression = '';
            st.message = data.message;
            st.name = data.name;
            st.id = Number(id);
            st.persistance = data.persistance;
            st.exchange = data.exchange;
            st.market = data.market;
            st.symbol = data.symbol;
            st.symbolMarkerExchange = data.symbolMarkerExchange;
            st.symbolMarketExchange = data.symbolMarkerExchange;
            st.user = data.user;
        }
    }

    // --------------------------------------------------------------------------------

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

    // --------------------------------------------------------------------------------

    populateSymbolExangeMarketList(_participantId: number) {
        this.listingService.getParticipantSecurityExchanges(_participantId)
            .subscribe(restData => {
                if (AppUtility.isValidVariable(restData)) {
                    this.updateSymbolList(restData);
                }
            },
            error => {
                this.errorMessage = <any>error;
            });
    }

    // --------------------------------------------------------------------------------

    addFromValidations() {
        this.myForm = this._fb.group({
            name: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            exchangeName: [''],
            marketName: [''],
            symbol: ['', Validators.compose([Validators.required])],
            parameter1: ['', Validators.compose([Validators.required])],
            operator1: ['', Validators.compose([Validators.required])],
            value1: [''],
            condition: ['', Validators.compose([Validators.required])],
            parameter2: ['', Validators.compose([Validators.required])],
            operator2: ['', Validators.compose([Validators.required])],
            value2: [''],
            message: ['', Validators.compose([Validators.required])]
        });
    }

    // --------------------------------------------------------------------------------

    populateAlertsList(_userName: String) {
      
        this.appState.showLoader = true;
        this.orderService.getAlerts(_userName).subscribe(
            restData => {
                this.appState.showLoader = false;
                if (AppUtility.isEmptyArray(restData) || restData === null) {
                    this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                    this.dialogCmp.statusMsg = this.errorMessage;
                    this.dialogCmp.showAlartDialog('Error');
                }
                else {
                    this.itemsList = new wjcCore.CollectionView(restData);
                    console.log(this.itemsList);
                }
            },
            error => {
                if(error.message){
                    this.errorMessage = error.message;
                } else {
                    this.errorMessage = error;
                }
                this.appState.showLoader = false;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
            });
    }

    // --------------------------------------------------------------------------------

    public getNotification(btnClicked) {
        if (btnClicked === 'Success') {
            this.onNewAction();
            this.hideModal();
        }
        else if (btnClicked === 'Yes') {
            this.selectedItem.expression = this.itemsList.currentItem.expression;
            this.selectedItem.message = this.itemsList.currentItem.message;
            this.selectedItem.name = this.itemsList.currentItem.name;
            this.selectedItem.id = this.itemsList.currentItem.id;
            this.populateSymbolExangeMarket();
            this.populateExpression();
            let temp = this.toJSON(false, this.selectedItem);

            let alertMessage: AlertMessage = new AlertMessage();
            this.orderService.deleteAlert(temp, AppConstants.username).subscribe(
                data => {
                    this.itemsList.remove(this.itemsList.currentItem);
                    this.itemsList.refresh();

                    this.dialogCmp.statusMsg = 'Record deleted successfully.';
                    if (this.lang=='po'){
                        this.dialogCmp.statusMsg = 'Registro excluído com sucesso';
                       }
                    this.dialogCmp.showAlartDialog('Success');
                },
                error => {
                    alertMessage.message = AppUtility.ucFirstLetter(
                        AppUtility.removeQuotesFromStartAndEndOfString(JSON.parse(JSON.stringify(error))._body));
                    if (alertMessage.message.length > 0) {
                        alertMessage.type = 'danger';
                        this.dialogCmp.statusMsg = 'No Error Received from server.';
                        if (this.lang=='po'){
                            this.dialogCmp.statusMsg = 'Nenhum erro recebido do servidor';
                           }
                        this.dialogCmp.showAlartDialog('Error');
                    }
                    else {
                        alertMessage.type = 'success';
                        this.dialogCmp.statusMsg = 'Error Message from Database' + JSON.stringify(alertMessage);
                        if (this.lang=='po'){
                            this.dialogCmp.statusMsg = 'Mensagem de erro do banco de dados' + JSON.stringify(alertMessage);
                           }
                        this.dialogCmp.showAlartDialog('Error');
                    }
                });
        }
    }
}
