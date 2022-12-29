import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map,catchError } from 'rxjs/operators';

import { SymbolStats } from './../models/symbol-stats';
import { Index } from './../models/index-model';

import { AppConstants } from '../app.utility';
import { AppUtility } from '../app.utility';
import { AuthService2 } from 'app/services/auth2.service';

@Injectable()
export class OmsReportService {
  // ----------------------------------------------------------------------------

  constructor(private http: HttpClient, private authService: AuthService2) {

  }

  // ----------------------------------------------------------------------------

  public getSymbolTradesHistory(exchangeCode: string, marketCode: string, symbol: string): Observable<SymbolStats[]> {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/markets/'
      + marketCode + '/symbols/' + encodeURIComponent(symbol) + '/history';

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
          // if (item.last_trade_time == null || item.last_trade_time === undefined)
          // {
          //   console.log('last trade time not found');
          //   continue;
          // }

          let trade = new SymbolStats();
          trade.open = Number(item.open);
          trade.high = Number(item.high);
          trade.low = Number(item.low);
          trade.close = Number(item.close);
          trade.last_trade_size = Number(item.last_trade_size);
          trade.last_trade_time = new Date(item.last_trade_time);
          trade.last_trade_price = Number(item.last_trade_price);

          trades.push(trade);
        }

        return trades;
      }),
      catchError(error => Observable.throw(error)));
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
          return res;
      }),
      catchError(error => Observable.throw(error)));
  }

}
