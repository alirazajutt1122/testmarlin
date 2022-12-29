import { TransactionDetail } from './../models/transaction-detail';

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { AuthService2 } from './auth2.service';

import { AppConstants, AppUtility } from '../app.utility';
import { map ,catchError } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class TransactionService
{
    private baseUrl: string = AppConstants.apiBaseUrl;

    // -----------------------------------------------------

    constructor(private http: HttpClient, private authService: AuthService2)
    {

    }

    // -----------------------------------------------------

    public getTransactionsByBroker(participantId: Number, transactionStatus: String, transactionDate: Date): Observable<TransactionDetail[]>
    {
        let formatted = new DatePipe('en-US').transform(transactionDate, 'yyyy-MM-dd');
        let url = this.baseUrl + 'participants/' + participantId + '/transactions/trans-date/' + formatted + '/status/' + transactionStatus;

        let Httpheaders = new HttpHeaders();
      Httpheaders = Httpheaders.append('Authorization', 'Bearer ' + this.authService.token);

        
        return this.http.get<any>(url, { headers: Httpheaders })
             .pipe(map(res => AppUtility.isEmpty(res) ? null : res),
              catchError ( error => Observable.throw(error)));
        
        
    }
}

