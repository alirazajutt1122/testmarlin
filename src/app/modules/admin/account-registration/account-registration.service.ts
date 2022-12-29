import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RestService} from "../../../services/api/rest.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AccountRegistrationService {

    private dataSource = new BehaviorSubject({});

    constructor(
        private _restService: RestService,) {
    }

    getAllActiveParticipants() {
        return this._restService.get(true, 'account-registration/active-participants');
    }

    getNCCPLRelations() {
        return this._restService.get(true, 'nccplData/relations');
    }

    getUINtype() {
        return this._restService.get(true, 'nccplData/UINtypes');
    }

    getUserFromMarlinPortalByUserId(id: number) {
        return this._restService.get(true, 'account-registration/portalUser/' + id);
    }

    saveBasicClientData(obj: any) {
        return this._restService.post(true, 'nccplData/saveBasicClientData', obj);
    }

    public verifyOTP(obj: any): any {
        return this._restService.post(true, 'nccplData/verifyOTPFromNccpl', obj);
    }

    updatedDataSelection(data: any) {
        this.dataSource.next(data);
    }

    saveDetailedClientData(obj: any) {
        return this._restService.post(true, 'nccplData/saveDetailedClientData', obj);
    }

    getSavedDetailedClientData(uin: any) {
        return this._restService.get(true, 'nccplData/getSavedDetailedClientData/' + uin);
    }

    getSavedClientRequestByUIN(uin: any) {
        return this._restService.get(true, 'nccplData/getSavedClientRequestByUIN/' + uin);
    }

    getBusinessTypes() {
        return this._restService.get(true, 'account-registration/businessTypes');
    }

    getOccupations() {
        return this._restService.get(true, 'nccplData/occupations');
    }

    getMeritalStatuses() {
        return this._restService.get(true, 'account-registration/maritalStatus');
    }

    getCitiesData(countryId: any, provinceId: any) {
        return this._restService.get(true, 'nccplData/cities/country/' + countryId + '/province/' + provinceId);
    }

    getNccplCountries() {
        return this._restService.get(true, 'nccplData/countries/');
    }

    getIncomeByAccountType(accountType: any) {
        return this._restService.get(true, 'nccplData/getIncomeByAccountType/' + accountType);
    }

    getRemittances() {
        return this._restService.get(true, 'nccplData/remittances');
    }

    getDocumentTypes() {
        return this._restService.get(true, 'nccplData/documentTypes');
    }

    getProvincesData(countryId: any) {
        return this._restService.get(true, 'nccplData/provinces/country/' + countryId);
    }

}
