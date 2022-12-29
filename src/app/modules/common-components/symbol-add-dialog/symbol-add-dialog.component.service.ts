import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RestService} from "../../../services/api/rest.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SymbolAddDialogComponentService {

    private dataSource = new BehaviorSubject({});

    constructor(
        private _restService: RestService,) {
    }

    getFavourites(userID:Number,exchangeCode) {
        return this._restService.get(true, 'favourites/'+userID+'/'+exchangeCode);
    }

    deleteFavourite(userID:Number,symbolID:Number) {
        return this._restService.post(true, 'favourites/'+userID+'/'+symbolID);
    }

    saveFavourite(symbol:Object) {
        return this._restService.post(true, 'favourites',symbol);
    }

    getRibbons(userID:Number ,exchangeCode:any) {
        return this._restService.get(true, 'ribbon/'+userID+'/'+exchangeCode);
    }

    saveRibbon(ribbon:Object) {
        return this._restService.post(true, 'ribbon/',ribbon);
    }

    deleteRibbon(userID:Number,ribbonID:Number) {
        return this._restService.post(true, 'ribbon/'+userID+'/'+ribbonID);
    }

    



   

}