import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SymbolStats } from './../models/symbol-stats';
import { Index } from './../models/index-model';

import { AuthService2 } from './auth2.service';

import { AppConstants, AppUtility } from '../app.utility';
import { appConfig } from 'app/core/config/app.config';
import { map,catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class OmsReportService {
  // ----------------------------------------------------------------------------

  constructor(private http: HttpClient, private authService: AuthService2) {

  }

  // ----------------------------------------------------------------------------

  public getSymbolTradesHistoryByDays(exchangeMarketSecurityId: number, numberOfDays: number): Observable<SymbolStats[]> {
    let url = AppConstants.apiBaseUrl + 'reports/get-security-ohlc/exchangeMarketSecurityId/' + exchangeMarketSecurityId +
      '/historyDays/' + numberOfDays + '/';

      let Httpheaders = new HttpHeaders();
      Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get<any>(url, { headers: Httpheaders })
      .pipe(map(res => {
        let trades: SymbolStats[] = [];

        if (AppUtility.isEmpty(res))
          return trades;

        let json = res.json();
        if (!json)
          return trades;

        for (let item of json) {
          let trade = new SymbolStats();
          trade.open = Number(item.openPrice);
          trade.high = Number(item.highPrice);
          trade.low = Number(item.lowPrice);
          trade.close = Number(item.closePrice);
          trade.last_trade_size = Number(item.turnover);
          trade.last_trade_time = new Date(item.statsDate);
          trade.last_trade_price = Number(item.closePrice);

          trades.push(trade);
        }

        return trades;
      }),
      catchError(error => Observable.throw(error)));
  }


  // ----------------------------------------------------------------------------

  public getIndicesHistoryByDays(exchangeId: number, indexCode: string, numberOfDays: number): Observable<Index[]> {
    let url = AppConstants.apiBaseUrl + 'reports/get-indexes-code/exchange/' + exchangeId + '/indexCode/' + indexCode +
      '/historyDays/' + numberOfDays + '/';

      let Httpheaders = new HttpHeaders();
      Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get<any>(url, { headers: Httpheaders })
      .pipe(map(res => {
        let indices: Index[] = [];

        if (AppUtility.isEmpty(res))
          return indices;

        let json = res.json();
        if (!json)
          return indices;

        for (let item of json) {
          let index = new Index();
          index.open = Number(item.open);
          index.high = Number(item.high);
          index.low = Number(item.low);
          index.close = Number(item.close);
          index.trades = Number(item.trades);
          index.value = Number(item.value);
          index.volume = Number(item.volume);
          index.entryDatetime = new Date(item.entryDatetime);

          indices.push(index);
        }

        return indices;
      }),
      catchError(error => Observable.throw(error)));
  }

}
