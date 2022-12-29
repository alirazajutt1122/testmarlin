import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConstants } from 'app/app.utility';
import { SymbolAddDialogComponentService } from 'app/modules/common-components/symbol-add-dialog/symbol-add-dialog.component.service';
import { RestService } from 'app/services/api/rest.service';

@Injectable({
    providedIn: 'root'
})


export class DashboardService {

    public sharedData = new Subject<any>();

    private watchlistSymbols$ = new BehaviorSubject<Array<any>>([]);
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    xml: string;
    userid: any;
    private selectedAssetClass: BehaviorSubject<any> = new BehaviorSubject(AppConstants.ASSET_CLASS_EQUITIES);


    constructor(
        private _httpClient: HttpClient,
        private _symbolService: SymbolAddDialogComponentService,
        private _restService: RestService,) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userid = user.id;
        this.getWatchListSymbols()
    }

    setSelectedAssedClass(assetClass) {
        this.selectedAssetClass.next(assetClass)
    }

    get selectedAssetClass$(): Observable<any> {
        return this.selectedAssetClass.asObservable();
    }

    public getOrderData(): Observable<any> {
        return this.sharedData.asObservable();
    }

    public setOrderData(data): void {
        this.sharedData.next(data);
    }




    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    getRssFeed() {
        return this._httpClient.get("https://www.brecorder.com/feeds/latest-news", { responseType: 'text' })
    }

    getWatchListSymbols() {

        this._symbolService.getFavourites(this.userid, AppConstants.exchangeCode).subscribe((data) => {
            this.watchlistSymbols$.next(data)
        }, (error => {
        }));
    }

    get WatchListSymbols$(): Observable<any> {
        return this.watchlistSymbols$.asObservable();
    }

   
 


}
