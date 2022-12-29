
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Order } from '../models/Order';
import { ChangeOrder } from '../models/Order-change';
import { CancelOrder } from '../models/Order-cancel';
import { OrderConfirmation } from '../models/order-confirmation';
import { AuthService2 } from 'app/services/auth2.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { RestService } from 'app/services/api/rest.service';


////////////////////////////////////////////////////////////////////////

@Injectable()
export class OrderService
{
   static token: string;
  // ---------------------------------------------------------------

  constructor(private http: HttpClient, private appUtility: AppUtility, private authService: AuthService2, public _restService : RestService)
  {
    OrderService.token = sessionStorage.getItem('token');
  }

  // ---------------------------------------------------------------


setToken( tkn: string) {
  
  OrderService.token = tkn ; 
   
}

  postBuySellOrder(obj: any){
    return this._restService.post(true, 'userTrade/', obj);
}
getSecurityStats(exchangeCode:String, symbolCode:String){
    return this._restService.get(true, 'security/symbol/stats/exch/'+ exchangeCode +'/'+ symbolCode +'/limit'+'/1');
}
getSecurityImage(exchangeCode:String, symbolCode:String){
    return this._restService.get(true, 'security/symbol/image/'+ exchangeCode +'/'+ symbolCode );
}
getMarketStatus(exchangeCode:String, marketCode:String){
    return this._restService.get(true, 'exchange-market-securities/exchanges/'+ exchangeCode +'/markets/'+ marketCode );
}
getBuySellPercentage(exchangeCode:String, symbolCode:String,hours:Number){
    return this._restService.get(true, 'userTrade/getUserTradeSentiments/exch/'+ exchangeCode +'/sec/'+ symbolCode +'/hourInt/'+hours );
}
getUserTradeHoldings(userId:Number){
    return this._restService.get(true, 'userTrade/holding/'+userId);
}




public submitQuoteOrder(quote): any
{
  let url = AppConstants.omsBaseUrl + 'transactions/quote';
  let Httpheaders = new HttpHeaders();
  Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);
  return this.http.post(url, quote, { headers: Httpheaders });

}





  public getBestMarketAndSymbolStats(exchangeCode: string, marketCode: string, symbol: string): any
  {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/markets/' + marketCode + '/symbols/' + encodeURIComponent(symbol) + '/details';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getTickerSymbols(exchangeCode): any
  {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/topstocks';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getSymbolTrades(exchangeCode: string, marketCode: string, symbol: string): any
  {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/markets/' + marketCode + '/symbols/' + encodeURIComponent(symbol) + '/history';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getExchangeStats(exchangecode): any
  {
    let url: string = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangecode + '/stats';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getClientMarginDetails(brokercode: string, exchangecode: string, clientcode: string, user: string): any
  {
    let url: string = AppConstants.omsBaseUrl + 'risk/clients/exchanges/' + exchangecode + '/brokers/' + brokercode + '/users/' + user + '/clients/' + encodeURIComponent(clientcode) + '/balance/';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getMarketSummary(exchangecode: string, marketcode: string): any
  {
    let url: string = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangecode + '/markets/' + marketcode + '/summary';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getSectorStats(exchangecode: string): any
  {
    let url: string = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangecode + '/sectors/stats';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getOrder(users, orderNo: string): any
  {
    let url: string = AppConstants.omsBaseUrl + 'transactions/orders/' + orderNo;

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.post(url, users, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getOrders(users): any
  {
    let url = AppConstants.omsBaseUrl + 'transactions/orders';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.post(url, users, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getExecutedOrders(users): any
  {
    
    let url: string = AppConstants.omsBaseUrl + 'transactions/trades';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.post(url, users, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getEventLog(users): any
  {
    let url: string = AppConstants.omsBaseUrl + 'transactions/eventlog';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.post(url, users, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getBestOrders(exchangeCode, marketCode, symbol): any
  {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/markets/' + marketCode + '/symbols/' + encodeURIComponent(symbol) + '/bestorders';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getBestPrices(exchangeCode, marketCode, symbol): any
  {
    let url = AppConstants.omsBaseUrl + 'reports/exchanges/' + exchangeCode + '/markets/' + marketCode + '/symbols/' + encodeURIComponent(symbol) + '/bestprices';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public getAlerts(userCode: String): any
  {
    let url: string = AppConstants.omsBaseUrl + 'users/' + userCode + '/alerts/';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.get(url, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public saveAlert(alert, username: String): any
  {
    let url: string = AppConstants.omsBaseUrl + 'users/' + username + '/alerts';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.post(url, alert, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public updateAlert(alert, username: String): any
  {
    let url: string = AppConstants.omsBaseUrl + 'users/' + username + '/alerts';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.put(url, alert, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public deleteAlert(alert, username: String): any
  {
    let url: string = AppConstants.omsBaseUrl + 'users/' + username + '/alerts';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.delete(url, { headers: Httpheaders, body: alert });
  }

  // ---------------------------------------------------------------

  public submitOrder(order: Order): any
  {
  
    let url = AppConstants.omsBaseUrl + 'transactions/';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.post(url, order, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

  public cancelOrder(cancelOrder: CancelOrder): any
  {
    let url: string = AppConstants.omsBaseUrl + 'transactions/';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.delete(url, { headers: Httpheaders, body: cancelOrder });
  }

  // ---------------------------------------------------------------

  public changeOrder(changeOrder: ChangeOrder): any
  {
    let url: string = AppConstants.omsBaseUrl + 'transactions/';

    let Httpheaders = new HttpHeaders();
    Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + OrderService.token);

    return this.http.put(url, changeOrder, { headers: Httpheaders });
  }

  // ---------------------------------------------------------------

}

