import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';



@Injectable({
    providedIn: 'root'
})
export class RestService {
    //userToken: User;
    static userToken: string;
    private baseUrl = environment.BASE_API_URL;
    // private marlinPreviousUrl = environment.baseUrlForPreviousMarlin;

    constructor(private http: HttpClient) {
    }

    
    public setUserToken(token): void {
        RestService.userToken = token;
        sessionStorage.setItem("MarlinToken", RestService.userToken);
        localStorage.setItem('MarlinToken' , RestService.userToken);
    }

    public get(flag: boolean, action: string, params = {}, headerType = ''): Observable<any> {
        //const url = !flag ? this.baseUrl : this.marlinPreviousUrl;
        const headers = new Headers();
        //headers.append('Authorization', 'Bearer ' + this.userToken);
        return this.http.get(`${this.baseUrl}${action}`, {
            params,
            headers: this._getHeader(headerType)
        }).pipe(retry(0), catchError(e => this.authErrorCatch(e)));
    }

    public post(flag: boolean, action: string, params = {}, headerType = ''): Observable<any> {
         
        //const url = !flag ? this.baseUrl : this.marlinPreviousUrl;
        return this.http.post(`${this.baseUrl}${action}`, params, {headers: this._getHeader(headerType)}).pipe(catchError(e =>
            this.authErrorCatch(e)));
    }

    public postDepo(flag: boolean, action: string, params = {}, headerType = ''): Observable<any> {
         
        //const url = !flag ? this.baseUrl : this.marlinPreviousUrl;
        return this.http.post(`${action}`, params, {headers: this._getHeaderDepo(headerType)}).pipe(catchError(e =>
            this.authErrorCatch(e)));
    }

    public put(flag: boolean, action: string, params = {}): Observable<any> {
        //const url = !flag ? this.baseUrl : this.marlinPreviousUrl;
        return this.http.put(`${this.baseUrl}${action}`, params, {
            headers: this._getHeader()
        }).pipe(catchError(e => this.authErrorCatch(e)));
    }

    public delete(flag: boolean, action: string, params = {}): Observable<any> {
        //const url = !flag ? this.baseUrl : this.marlinPreviousUrl;
        return this.http.delete(`${this.baseUrl}${action}`, {
            params,
            headers: this._getHeader()
        }).pipe(catchError(e => this.authErrorCatch(e)));
    }

    private authErrorCatch(e): Observable<never> {
         
        return throwError(e.error.message?e.error.message:e.error);
    }

    private _getHeader(headerType?): HttpHeaders {
         
        if (RestService.userToken == null)
        RestService.userToken = localStorage.getItem("MarlinToken")



        if (RestService.userToken && !headerType) {

            return new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(RestService.userToken)}`
            });
        }
        return new HttpHeaders({
            'Content-Type': headerType || 'application/json',
            'Accept': headerType || 'application/json'
        });
    }




    private _getHeaderDepo(headerType?): HttpHeaders {
       
        

            return new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic YWRtaW46YWRtaW4qMDE=`
            });
      
        
    }
}








 





