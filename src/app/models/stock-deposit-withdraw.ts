import * as wjcCore from '@grapecity/wijmo';
import { Exchange } from './exchange';
import { Security } from './security';
import { Participant } from './participant';
import { Client } from './client';
import { ComboItem } from './combo-item';
import { AppConstants } from '../app.utility';
import { AppUtility } from '../app.utility';
import { TranslateService } from '@ngx-translate/core';

export class StockDepositWithdraw {
    stockLedgerId: number;
    exchange: Exchange;
    security: Security;
    participant: Participant;
    custodian: Participant;
    client: Client;
    entryType: string;
    transDate: string;
    manual: boolean = true;
    posted: boolean = false;
    availableBalance: number = 0;
    quantity: number = 0;
    remarks: string = '';
    PledgeCode: string = '';
    lang: any
    deposit: string
    withdraw: string
    constructor() {
        this.exchange = new Exchange();
        this.security = new Security();
        this.security.securityId = null;
        this.participant = new Participant();
        this.custodian = new Participant();
        this.client = new Client();
        this.client.clientId = null;
        this.client.clientCode = '';
        this.entryType = null;
        this.availableBalance = 0;
        this.transDate = wjcCore.Globalize.format(new Date(), AppConstants.DATE_FORMAT);

        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }

        //______________________________for ngxtranslate__________________________________________

    }

    getEntryTypeDesc(type): string {
        let desc: string = '';

        switch (this.lang) {
            case 'en':
                if (type == AppConstants.ENTRY_TYPE_DEPOSIT) {
                    desc = 'Deposit';
                } else if (type == AppConstants.ENTRY_TYPE_WITHDRAW) {
                    desc = 'Withdraw';
                } else if (type == AppConstants.ENTRY_TYPE_PLEDGE) {
                    desc = 'Pledge';
                } else if (type == AppConstants.ENTRY_TYPE_RELEASE) {
                    desc = 'Release';
                }
                break;
            case 'pt':
                if (type == AppConstants.ENTRY_TYPE_DEPOSIT) {
                    desc = 'Depósito';
                } else if (type == AppConstants.ENTRY_TYPE_WITHDRAW) {
                    desc = 'Retirar';
                } else if (type == AppConstants.ENTRY_TYPE_PLEDGE) {
                    desc = 'Compromisso';
                } else if (type == AppConstants.ENTRY_TYPE_RELEASE) {
                    desc = 'Liberar';
                }
                break;
            default:
                if (type == AppConstants.ENTRY_TYPE_DEPOSIT) {
                    desc = 'Deposit';
                } else if (type == AppConstants.ENTRY_TYPE_WITHDRAW) {
                    desc = 'Withdraw';
                } else if (type == AppConstants.ENTRY_TYPE_PLEDGE) {
                    desc = 'Pledge';
                } else if (type == AppConstants.ENTRY_TYPE_RELEASE) {
                    desc = 'Release';
                }
        }
        // AppUtility.printConsole(" type::: "+type);

        return desc;

    }
    getStatusList(): any[] {
        let statusArr
        switch (this.lang) {
            case 'en':
                statusArr = ['New', 'Posted'];
                break;
            case 'pt':
                statusArr = ['Nova', 'Publicada'];
                break;
            default:
                statusArr = ['New', 'Posted'];
        }
        let statusCmbList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < statusArr.length; i++) {
            cmbItem = new ComboItem(statusArr[i], statusArr[i]);
            statusCmbList[i] = cmbItem;
        }
        // let obj = new ComboItem('', '';
        // statusCmbList.unshift(obj);

        return statusCmbList;
    }

    getEntryTypesList(): any[] {

        // debugger
        // this.translate.get(['Deposit', 'Withdraw'])
        //     .subscribe(translations => {
        //         debugger
        //         this.deposit = translations['Deposit'];
        //         this.withdraw = translations['Withdraw'];
        //     });


        // console.log(this.deposit)

        let typesLabelArr
        switch (this.lang) {
            case 'en':
                typesLabelArr = ['Deposit', 'Withdraw', 'Pledge', 'Release'];
                break;
            case 'pt':
                typesLabelArr = ['Depósito', 'Retirar', 'Compromisso', 'Liberar'];
                break;
            default:
                typesLabelArr = ['Deposit', 'Withdraw', 'Pledge', 'Release'];
        }
        let typesValueArr = ['D', 'W', 'P', 'R'];
        let typesCmbList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < typesLabelArr.length; i++) {
            cmbItem = new ComboItem(typesLabelArr[i], typesValueArr[i]);
            typesCmbList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        typesCmbList.unshift(obj);

        return typesCmbList;
    }

}
