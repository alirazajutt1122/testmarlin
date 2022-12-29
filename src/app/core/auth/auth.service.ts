import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
//import { UserService } from 'app/core/user/user.service';
import { RestService } from "../../services/api/rest.service";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import HmacSHA256 from "crypto-js/hmac-sha256";
import { Country, User } from "../user/user.types";

import * as io from 'socket.io-client';

import jwt_decode from "jwt-decode";
// let jwtDecode = require('jwt-decode');
import { ToastrService } from "ngx-toastr";
import { AppConstants, AppUtility } from 'app/app.utility';
import { AuthService2 } from 'app/services/auth2.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { debounce } from 'lodash';
import { Exchange } from 'app/models/exchange';
import { WebSocketService } from 'app/services/socket/web-socket.service';

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly _secret: any;
    private _authenticated: boolean = false;
    private authSharedData$: BehaviorSubject<any> = new BehaviorSubject(null);


    private message = new BehaviorSubject('signIn');
    sharedMessage = this.message.asObservable();

    token: string;
    claims: any;
    public static claims2: any;
    socket: any;
    public loginUserDetails: any = null;

    private loggedIn = false;

    constructor(
        private _httpClient: HttpClient,
        private _restService: RestService,
        private toast: ToastrService,
        private loader: FuseLoaderScreenService,
        private webSocket : WebSocketService
    ) {
        this._secret = 'YOUR_VERY_CONFIDENTIAL_SECRET_FOR_SIGNING_JWT_TOKENS!!!';
        let token = sessionStorage.getItem('token');
        if (token && !AppUtility.isEmpty(token)) {
            let model = { token: token };
            this.processToken(model);
        }

        let user = localStorage.getItem('user');
        if (user && !AppUtility.isEmpty(user)) {
            let u = { response: user }

        }

        // 7 Dec 2022, Muhammad Hassan 
        if ( sessionStorage.getItem("exchangeId") !== undefined && sessionStorage.getItem("exchangeId")!= null ) {
            AppConstants.exchangeId = Number(sessionStorage.getItem("exchangeId")) ; 
        }

    }

    nextMessage(message: string) {
        this.message.next(message)
    }

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    forgotPassword(user): Observable<any> {
        return this._restService.post(false, '/vtrade/forgot-password', user);
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    initializeAppConstants() {
        
        AppConstants.participantId = this.claims?.participant.id;
        AppConstants.participantCode = this.claims?.participant.code;
        AppConstants.loggedinBrokerCode = this.claims?.participant.code;
        AppConstants.exchangeCode = (this.claims?.participant.exchangeCode === null) ? AppConstants.exchangeCode : this.claims?.participant.exchangeCode;
        AppConstants.exchangeId = (this.claims?.participant.exchangeId === null) ? AppConstants.exchangeId : this.claims?.participant.exchangeId;
        AppConstants.username = this.claims?.sub;
        AppConstants.loginName = this.claims?.user.loginName;
        AppConstants.userType = this.claims?.user.userType;
        AppConstants.userId = this.claims?.user.id;
        AppConstants.claims2 = this.claims;


        let splitName = this.claims?.user.loginName;
        const myArray = splitName.split(" ");
        AppConstants.INV_USERNAME = this.claims?.sub;
        AppConstants.INV_FIRST_NAME = myArray[0];
        AppConstants.INV_LAST_NAME = myArray[1];
        AppConstants.INV_MOBILE_NUMBER = this.claims?.user.mobile;
        AppConstants.INV_EMAIL = this.claims?.sub;
        AppConstants.INV_COUNTRY_ID = this.claims?.user.countryId;

       

    

        this.webSocket.createConnection();


        let tT = localStorage.getItem('tradeType');
        if (AppConstants.participantId === null) {
            AppConstants.tradeType = 'vTrade';
            localStorage.setItem('tradeType', 'vTrade');
        }
        if (AppConstants.participantId !== null && (tT === null || tT === '' || tT === undefined)) {
            AppConstants.tradeType = 'gTrade';
            localStorage.setItem('tradeType', 'gTrade');
        }

    }

    signIn(credentials): Observable<User> {
        return this._restService.post(false, 'marlin-authentication/login/', credentials).pipe(
            switchMap((response: User) => {

                response.avatar = 'assets/images/marlin-dashboard/world.png'
                response.status = 'online';
                this._authenticated = true;
                localStorage.setItem('user', JSON.stringify(response));
                sessionStorage.setItem('token', this.token);

                this.processToken(response);


                return of(response);
            })
        );
    }






    signInUsingToken(): Observable<any> {
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>
                of(false)
            ),
            switchMap((response: any) => {
                this.accessToken = response.accessToken;
                this._authenticated = true;
                return of(true);
            })
        );
    }

    processToken(res): boolean {

        if (res.token) {
            this.token = res.token;
            this.claims = jwt_decode(this.token);
            AppUtility.printConsole('token received: ' + JSON.stringify(this.claims));
            AppConstants.forcePasswordChange = res.forcePasswordChange;
            AppConstants.passwordStrength = res.passwordStrength;
            AppConstants.claims2 = this.claims;
            sessionStorage.setItem('token', this.token);
            this.initializeAppConstants();
            this.loggedIn = true;
            AppConstants.Loggedin = this.loggedIn

            this.socket = io.Socket;
        } else {
            this.loggedIn = false;
            AppConstants.Loggedin = this.loggedIn
        }

        return this.loggedIn;
    }

    signOut(): Observable<any> {
        localStorage.clear();
        this._authenticated = false;
        return of(true);
    }

    signUp(user): Observable<any> {
        return this._restService.post(false, 'vtrade/register', user);
    }

    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }
        if (!this.accessToken) {
            return of(false);
        }
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }
        return this.signInUsingToken();
    }

    getAllCountries(): Observable<Country> {
        return this._restService.get(false, 'vtrade/countries').pipe(map(response => response as Country));
    }

    getAllExchanges(): Observable<Exchange> {
        return this._restService.get(false, 'exchanges/').pipe(map(response => response as Exchange));
    }

    private static _base64url(source: any): string {
        let encodedSource = Base64.stringify(source);
        encodedSource = encodedSource.replace(/=+$/, '');
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');
        return encodedSource;
    }



    // SignIn Page Latest Trending Data
    getLatestTrendingData(exchangeCode) {
        this.loader.show();
        return this._restService.get(false, 'security/recent/best-market/symbols/exch/' + exchangeCode + '/' + AppConstants.TOP_TRADED_SYMBOLS_COUNT).pipe(
            tap((response: any) => {
                this.loader.hide();
                this.authSharedData$.next(response);
            }, (e) => {
                this.loader.hide();
                this.toast.error('Something Went Wrong', 'Error')
            })
        );
    }
    // SignIn Page Latest Trendind Data

    trendingSymbolAssetClassWise(exchangeCode, assetClassId: number, count) {
        let str = "security/recent/best-market/symbols/exch/" + exchangeCode + "/asset/" + assetClassId + "/" + count
        return this._restService.get(false, str);
    }



    get getAuthSharedData$(): Observable<any> {
        return this.authSharedData$.asObservable();

    }

    getBestMarketTrendingData(exchangeCode) {
        return this._restService.get(false, 'security/recent/best-market/symbols/exch/' + exchangeCode + '/' + AppConstants.TOP_TRADED_SYMBOLS_COUNT);
    }

    contactUs(payLoad) {
        return this._restService.post(false, 'email/sendContactUsEmail', payLoad);
    }

    pages(identifier: string, lang: string) {
        let str = 'pages/identifier/' + identifier + '/lang/' + lang
        return this._restService.get(false, str);
    }

    faqs(lang: string) {
        let str = 'faqs/lang/' + lang
        return this._restService.get(false, str);
    }

    signOutForStats(userName): Observable<any> {
        return this._restService.post(false, 'marlin-authentication/logout/', userName);
    }




}
