import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RestService} from "../../../services/api/rest.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NewsAdvertisementService {

    private dataSource = new BehaviorSubject({});

    constructor(
        private _restService: RestService,) {
    }

    getAssetClass() {
        return this._restService.get(true, 'asset-class/');
    }

    getNewsandAdvertisements(){
        return this._restService.get(true, 'news-advertisement/');
    }

    saveNewsAnnouncmentData(obj: any){
        return this._restService.post(true, 'news-advertisement/', obj);
    }



}