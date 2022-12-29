import * as wjcCore from 'wijmo/wijmo';
import { Exchange } from './exchange';
import { Security } from './security';
import { Participant } from './participant';
import { Client } from './client';
import { ComboItem } from './combo-item';
import { AppConstants } from '../app.utility';
import { AppUtility } from '../app.utility';

export class StockPledgeRelease {
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
    pledgeBalance: number = 0;
    quantity: number = 0;
    remarks: string = '';
    PledgeCode: string='';

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
        this.pledgeBalance = 0;
        this.transDate = wjcCore.Globalize.format(new Date(), AppConstants.DATE_FORMAT);

    }

    static getEntryTypeDesc(type): string {
        let desc: string = '';
        // AppUtility.printConsole(" type::: "+type); 
        if (type == AppConstants.ENTRY_TYPE_PLEDGE) {
            desc = 'Pledge';
        } else if (type == AppConstants.ENTRY_TYPE_RELEASE) {
            desc = 'Release';
        }
        return desc;

    }
    static getStatusList(): any[] {

        let statusArr = ['New', 'Posted'];
        let statusCmbList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < statusArr.length; i++) {
            cmbItem = new ComboItem(statusArr[i], statusArr[i]);
            statusCmbList[i] = cmbItem;
        }
        // let obj = new ComboItem('', '');
        // statusCmbList.unshift(obj);

        return statusCmbList;
    }

    static getEntryTypesList(): any[] {

        let typesLabelArr = ['Pledge', 'Release'];
        let typesValueArr = ['P', 'R'];
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
