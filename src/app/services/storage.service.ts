import { Injectable } from '@angular/core';
import {AppConstants}  from '../app.utility'; 

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    MARKETWATCH_DASHBOARD_SYMBOLS:string=AppConstants.loginName+'_MW_DashboardSymbols'; 
    MARKETWATCH_EQUITY_SYMBOLS:string=AppConstants.loginName+'_MW_EquitySymbols'; 
    MARKETWATCH_BOND_SYMBOLS:string=AppConstants.loginName+'_MW_BondSymbols'; 

    write(key: string, value: any) {
        if (value) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }

    read<T>(key: string): T {
        let value: string = localStorage.getItem(key);

        if (value && value != "undefined" && value != "null") {
            return <T>JSON.parse(value);
        }

        return null;
    }

    //Dashboard market watch symbols 
    saveDashboardMarketWatchSymbols(data:any) {
        this.write(this.MARKETWATCH_DASHBOARD_SYMBOLS, data);
    }

    getDasbhoardMarketWatchSymbols():any {
        return this.read(this.MARKETWATCH_DASHBOARD_SYMBOLS)
    }

    //Equity market watch symbols 
    saveEquityMarketWatchSymbols(data:any) {
        this.write(this.MARKETWATCH_EQUITY_SYMBOLS, data);
    }

    getEquityMarketWatchSymbols():any {
        return this.read(this.MARKETWATCH_EQUITY_SYMBOLS)
    }

    //Bond market watch symbols 
    saveBondMarketWatchSymbols(data:any) {
        this.write(this.MARKETWATCH_BOND_SYMBOLS, data);
    }

    getBondMarketWatchSymbols():any {
        return this.read(this.MARKETWATCH_BOND_SYMBOLS)
    }

}