import { ComboItem } from './combo-item';
// import { AppConstants } from '../app.utility';
import { AppConstants } from 'app/app.utility';

export class ReportParams {

    params: Params;
    constructor() {
        this.params = new Params();
    }

    setParams(params: Params) {
        this.params = params;
    }
}

export class Params {

    PARTICIPANT_ID: Number;
    START_DATE: Date;
    END_DATE: Date;
    TRADE_DATE: Date;
    IDS: Number[];
    TRANS_IDS: String[];
    NAMES: String[];
    ANNOUNCEMENT_PERIODS: String[];
    ANNOUNCEMENT_YEAR_END: String[];
    VOUCHER_NO: Number;
    EXCHANGE_ID: Number;
    MARKET_ID: Number;
    TRANSACTION_TYPE_ID: Number;
    CLIENT_ID: Number;
    FROM_ACCOUNT: String;
    TO_ACCOUNT: String;
    SECURITY_ID: Number;
    CUSTODIAN_ID: Number;
    DATE: Date;
    TYPE: string;

    VOUCHER_TYPE_ID: number;
    POSTED: number;
    HEAD_LEVEL: number;
    CLIENT: number;
    BALANCE: string;
    VOUCHER_TYPE: string;
    PARTICIPANT_BRANCH_ID: Number;
    SETTLEMENT_TYPE: string;
    SETTLEMENT_DATE: Date;

    VOLUME: Number;
    LEVIES_MASTER_ID: Number;

    AGENT_ID: Number;
    STATUS_ID: number;
    lang: string;

    constructor() {
        this.DATE = new Date();
        this.START_DATE = new Date();
        this.END_DATE = new Date();
        this.TRADE_DATE = new Date();
        this.SETTLEMENT_DATE = new Date();
        this.EXCHANGE_ID = null;
        this.MARKET_ID = null;
        this.SECURITY_ID = -1; // All case 
        this.LEVIES_MASTER_ID = -1;  // All case 
        this.PARTICIPANT_BRANCH_ID = -1; // All case 
        this.AGENT_ID = -1; // All case 
        this.VOLUME = 0;
        this.STATUS_ID = -1;//All case
        this.lang = localStorage.getItem('lang')
    }

    getSummaryDetailOptions() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Summary', 'Detail'];
                break;
            case 'pt':
                optionsArr = ['Resumo', 'Detalhe'];
                break;
            default:
                optionsArr = ['Summary', 'Detail'];
        }

        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

    getMarketOptions() {

        let optionsArr = ['REG', 'FUT'];
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.ALL_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

    getReportFormatOptions() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Format-1', 'Format-2'];
                break;
            case 'pt':
                optionsArr = ['Formato-1', 'Formato-2'];
                break;
            default:
                optionsArr = ['Format-1', 'Format-2'];
        }
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }
    getReportFormatOptionsTrial() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Format-1', 'Format-2', 'Format-2A', 'SECP-Format', 'MarlinSECP-Format'];
                break;
            case 'pt':
                optionsArr = ['Formato-1', 'Formato-2', 'Formato-2A','SECP-Formato', 'MarlinSECP-Formato'];
                break;
            default:
                optionsArr = ['Format-1', 'Format-2', 'Format-2A', 'SECP-Format', 'MarlinSECP-Format'];
        }
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

    getReportFormatTypeOptions() {

        let optionsArr = ['PDF', 'CSV'];
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

    getAHReportFormatOptions() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Format-1', 'Format-2', 'PSX-Format'];
                break;
            case 'pt':
                optionsArr = ['Formato-1', 'Formato-2', 'PSX-Formato'];
                break;
            default:
                optionsArr = ['Format-1', 'Summary', 'PSX-Format'];
        }
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

    getAMDReportFormatOptions() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Format-1', 'Format-2', 'Format-1-Summary'];
                break;
            case 'pt':
                optionsArr = ['Formato-1', 'Formato-2', 'Formato-1-Resumo'];
                break;
            default:
                optionsArr = ['Format-1', 'Summary', 'Format-1-Summary'];
        }
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

    getAgentReportFormatOptions() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Format-1', 'Summary', 'Detail'];
                break;
            case 'pt':
                optionsArr = ['Formato-1', 'Resumo', 'Detalhe'];
                break;
            default:
                optionsArr = ['Format-1', 'Summary', 'Detail'];
        }
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

    getClientAgingReportFormatOptions() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Credit', 'Debit'];
                break;
            case 'pt':
                optionsArr = ['Crédito', 'Débito'];
                break;
            default:
                optionsArr = ['Credit', 'Debit'];
        }
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

    getReportFormatOptionsForShareHolding() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Client-Wise', 'Security-Wise', 'Security-Wise-Summary'];
                break;
            case 'pt':
                optionsArr = ['Com Relacao ao Cliente', 'Seguranca', 'Seguranca-Resumo'];
                break;
            default:
                optionsArr = ['Client-Wise', 'Security-Wise', 'Security-Wise-Summary'];
        }
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

    getReportFormatOptionsForPledgeRelease() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Client Wise', 'Security Wise'];
                break;
            case 'pt':
                optionsArr = ['Com Relacao ao Cliente', 'Seguranca'];
                break;
            default:
                optionsArr = ['Client Wise', 'Security Wise'];
        }
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

    getReportFormatOptionsForClientCashBalance() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Clients Cash Balance', 'Debit Analysis'];
                break;
            case 'pt':
                optionsArr = ['Saldo de Caixa do Cliente', 'Análise de Débito'];
                break;
            default:
                optionsArr = ['Clients Cash Balance', 'Debit Analysis'];

        }
        let optionsList = [];
        let valueArray = ['Clients Cash Balance','Debit Analysis'];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], valueArray[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);
        return optionsList;
    }

    getNetHoldingTypeForShareHolding() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['All', 'Negative', 'Positive'];
                break;
            case 'pt':
                optionsArr = ['Tudo', 'Negativa', 'Positiva'];
                break;
            default:
                optionsArr = ['All', 'Negative', 'Positive'];
        }
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }
        let obj = new ComboItem('All', 'All');
        return optionsList;
    }

    getSettlementReportOptions() {
        let optionsArr = ['Participant Delivery Obligations', 'Client Delivery Obligations', 'Participant Money Obligations', 'Client Money Obligations'];
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], i.toString());
            optionsList[i] = cmbItem;
        }
        return optionsList;
    }

    getHeadLevelOptions(headlevel: number) {
        let optionsList = [];
        let count: number = 1;
        let cmbItem: ComboItem;

        for (let i = 0; i < headlevel; i++) {
            cmbItem = new ComboItem(count.toString(), count.toString());
            count++;
            optionsList[i] = cmbItem;
        }
        return optionsList;
    }

    getLeviesReportOptions() {

        let optionsArr
        switch (this.lang) {
            case 'en':
                optionsArr = ['Participant', 'Exchange'];
                break;
            case 'pt':
                optionsArr = ['Participante', 'Intercambio'];
                break;
            default:
                optionsArr = ['Participant', 'Exchange'];
        }
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }
    getCompliencReportName() {

        //let optionsArr = ['Account Opening DP', 'PEP / Foreign','Category Shuffling'];
        let optionsArr = ['Account Opening DP', 'PEP / Foreign'];
        let optionsList = [];
        let cmbItem: ComboItem;
        for (let i = 0; i < optionsArr.length; i++) {
            cmbItem = new ComboItem(optionsArr[i], optionsArr[i]);
            optionsList[i] = cmbItem;
        }

        let obj = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
        optionsList.unshift(obj);

        return optionsList;
    }

}