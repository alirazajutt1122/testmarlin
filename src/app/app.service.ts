import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type InteralStateType = {
    [key: string]: any
};

@Injectable({
    providedIn: 'root'
  })

@Injectable()
export class AppState {
    _state: InteralStateType = {};
    public showLoader: boolean = false;




    constructor() {

    }





    get state() {
        return this._state = this._clone(this._state);
    }

    set state(value) {
        throw new Error('do not mutate the `.state` directly');
    }

    get(prop?: any) {
        const state = this.state;
        return state.hasOwnProperty(prop) ? state[prop] : state;
    }

    set(prop: string, value: any) {
        return this._state[prop] = value;
    }


    private _clone(object: InteralStateType) {
        return JSON.parse(JSON.stringify(object));
    }
}
