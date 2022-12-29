
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Order } from '../models/Order';
import { ChangeOrder } from '../models/Order-change';
import { CancelOrder } from '../models/Order-cancel';
import { OrderConfirmation } from '../models/order-confirmation';
import { AppConstants, AppUtility } from '../app.utility';
import { AuthService2 } from './auth2.service';

////////////////////////////////////////////////////////////////////////

@Injectable({
  providedIn: 'root'
})
export class OrderService
{
  // ---------------------------------------------------------------

  constructor(private http: HttpClient, private appUtility: AppUtility, private authService: AuthService2)
  {

  }

  // ---------------------------------------------------------------

  public getBestMarketAndSymbolStats(exchangeCode: string, marketCode: string, symbol: string): any
  {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/markets/' + marketCode + '/symbols/' + encodeURIComponent(symbol) + '/details';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getTickerSymbols(exchangeCode): any
  {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/topstocks';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getSymbolTrades(exchangeCode: string, marketCode: string, symbol: string): any
  {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/markets/' + marketCode + '/symbols/' + symbol + '/history';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getExchangeStats(exchangecode): any
  {
    let url: string = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangecode + '/stats';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getClientMarginDetails(brokercode: string, exchangecode: string, clientcode: string, user: string): any
  {
    let url: string = AppConstants.omsBaseUrl + 'risk/clients/exchanges/' + exchangecode + '/brokers/' + brokercode + '/users/' + user + '/clients/' + encodeURIComponent(clientcode) + '/balance/';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getMarketSummary(exchangecode: string, marketcode: string): any
  {
    let url: string = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangecode + '/markets/' + marketcode + '/summary';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getSectorStats(exchangecode: string): any
  {
    let url: string = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangecode + '/sectors/stats';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getOrder(users, orderNo: string): any
  {
    let url: string = AppConstants.omsBaseUrl + 'transactions/orders/' + orderNo;

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.post(url, users, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getOrders(users): any
  {
    let url = AppConstants.omsBaseUrl + 'transactions/orders';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.post(url, users, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getExecutedOrders(users): any
  {
    let url: string = AppConstants.omsBaseUrl + 'transactions/trades';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.post(url, users, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getEventLog(users): any
  {
    let url: string = AppConstants.omsBaseUrl + 'transactions/eventlog';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.post(url, users, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getBestOrders(exchangeCode, marketCode, symbol): any
  {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/markets/' + marketCode + '/symbols/' + symbol + '/bestorders';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getBestPrices(exchangeCode, marketCode, symbol): any
  {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/markets/' + marketCode + '/symbols/' + symbol + '/bestprices';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getAlerts(userCode: String): any
  {
    let url: string = AppConstants.omsBaseUrl + 'users/' + userCode + '/alerts/';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public saveAlert(alert, username: String): any
  {
    let url: string = AppConstants.omsBaseUrl + 'users/' + username + '/alerts';

    let Httpheaders = new HttpHeaders();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.post(url, alert, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public updateAlert(alert, username: String): any
  {
    let url: string = AppConstants.omsBaseUrl + 'users/' + username + '/alerts';

    let Httpheaders = new HttpHeaders();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.put(url, alert, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public deleteAlert(alert, username: String): any
  {
    let url: string = AppConstants.omsBaseUrl + 'users/' + username + '/alerts';

    let Httpheaders = new HttpHeaders();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.delete(url, { headers: Httpheaders, body: alert });
  }

  // ---------------------------------------------------------------

  public submitOrder(order: Order): any
  {
    let url = AppConstants.omsBaseUrl + 'transactions/';

    let Httpheaders = new HttpHeaders();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.post(url, order, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public cancelOrder(cancelOrder: CancelOrder): any
  {
    let url: string = AppConstants.omsBaseUrl + 'transactions/';

    let Httpheaders = new HttpHeaders();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.delete(url, { headers: Httpheaders, body: cancelOrder });
  }

  // ---------------------------------------------------------------

  public changeOrder(changeOrder: ChangeOrder): any
  {
    let url: string = AppConstants.omsBaseUrl + 'transactions/';

    let Httpheaders = new HttpHeaders();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

    return this.http.put(url, changeOrder, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

}

