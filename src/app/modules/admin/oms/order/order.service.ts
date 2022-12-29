import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ShareOrderService {

    public sharedExchange = new Subject<any>();
    public sharedMarket = new Subject<string>();
    public sharedSymbol = new Subject<string>();

    public sharedOrderData = new Subject<string>();
    public sharedOrderConfirmationData = new Subject<string>();

  constructor() { }

  public getExchange(): Observable<string> {
    return this.sharedExchange.asObservable();
  }


  public getMarket(): Observable<string> {
    return this.sharedMarket.asObservable();
  }

  public getSymbol(): Observable<string> {
    return this.sharedSymbol.asObservable();
  }

  public getOrderData(): Observable<string> {
    return this.sharedOrderData.asObservable();
  }

  public getOrderConfirmationData(): Observable<any> {
    return this.sharedOrderConfirmationData.asObservable();
  }


  public setExchange(data): void {
    this.sharedExchange.next(data);
  }

  public setMarket(data): void {
    this.sharedMarket.next(data);
  }

  public setSymbol(data): void {
    this.sharedSymbol.next(data);
  }

  public setOrderData(data): void {
    this.sharedOrderData.next(data);
  }


  public setOrderConfirmationMessages = (data) => {
    
         this.sharedOrderConfirmationData.next(data);
  }




}
