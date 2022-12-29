'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ParticipantBranch } from 'app/models/participant-branches';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { Agent } from 'app/models/agent';
import { Participant } from 'app/models/participant';
import { ContactDetail } from 'app/models/contact-detail';
import { Country } from 'app/models/country';
import { IdentificationType } from 'app/models/identification-type';
import { Profession } from 'app/models/profession';
import { Industry } from 'app/models/industry';
import { City } from 'app/models/city';
declare var jQuery: any;

@Component({
    selector: 'agent-page',
    templateUrl:'./agent-page.html',

    encapsulation: ViewEncapsulation.None,
})

export class AgentPage implements OnInit {
    public myForm: FormGroup;

    itemsList: wjcCore.CollectionView;
    selectedItem: Agent;
    errorMessage: string;

    countryList: any[];
    cityList: any[];
    agentTypeList: any[];
    genderList: any[];
    identificationTypeList: any[];
    professionList: any[];
    participantBranchList: any[];
    industryList: any[];
    selectedIndex: number = 0;

    public cityId: number
    public hideForm = false;
    public showIndividual = false;
    public showCorporate = false;
    public isSubmitted: boolean;
    public isEditing: boolean;

    public minValue: Number = 0.0000;
    public maxValue: Number = 9999999999.9999;
    public overAll_perShare: String = "Overall";

    private _pageSize = 0;
    today: Date = new Date();

    //claims: any;

    @ViewChild('flex') flex: wjcGrid.FlexGrid;
    @ViewChild('commissionRate') commissionRate: wjcInput.InputNumber;
    @ViewChild('agentCode') agentCode: wjcInput.InputNumber;

    @ViewChild('cmbCityId') cmbCityId: wjcInput.ComboBox;
    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    lang: string;


    constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2,private translate: TranslateService,private loader : FuseLoaderScreenService) {
        this.clearFields();
        this.hideForm = false;
        this.isSubmitted = false;
        this.isEditing = false;
        //this.claims = authService.claims;
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
    }

    public hideModal() {
        jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
    }

    ngOnInit() {
        // Populate Agents data..    
        this.populateAgentsList();
        this.populateCountryList();
        this.populateParticipantBranchList();
        this.populateIdentificationTypeList();
        this.populateProfessionList();
        this.populateIndustryList();
        this.populateAgentTypeList();
        this.populateGender();

        // Add Form Validations
        this.addFromValidations();

    }

    ngAfterViewInit() {
        var self = this;
        $('#add_new').on('shown.bs.modal', function (e) {
            if (self.cityList.length > 1) {
                self.selectedItem.contactDetail.cityId = self.cityId;
            }
            self.agentCode.focus();
        });
    }
    /*********************************
   *      Public & Action Methods
   *********************************/

    public populateGender() {
        this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL },
        { "name": AppConstants.Male, "code": AppConstants.Male_Code }, { "name": AppConstants.Female, "code": AppConstants.Female_Code }]
    }

    public populateAgentTypeList() {
        this.agentTypeList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL },
        { "name": AppConstants.Individual, "code": AppConstants.Individual_Code }, { "name": AppConstants.Corporate, "code": AppConstants.Corporate_Code }]
    }


    public clearFields() {

        this.cityId = null;


        if (AppUtility.isValidVariable(this.myForm)) {
            this.myForm.markAsPristine();
        }

        if (AppUtility.isValidVariable(this.itemsList)) {
            this.itemsList.cancelEdit();
            this.itemsList.cancelNew();
        }
        this.hideForm = false;
        this.isSubmitted = false;
        this.isEditing = false;

        this.selectedItem = new Agent();
        this.selectedItem.agentId = null;
        this.selectedItem.agentCode = '';
        this.selectedItem.commissionRate = 0;
        this.selectedItem.commissionType = 'P';
        this.overAll_perShare = "Overall";

        this.selectedItem.agentType = '';
        this.showIndividual = false;
        this.showCorporate = false;

        this.selectedItem.active = true;
        this.selectedItem.branchId = null;

        this.selectedItem.participant = new Participant();
        this.selectedItem.participant.participantId = AppConstants.participantId;

        this.selectedItem.contactDetail = new ContactDetail();
        if (!AppUtility.isEmptyArray(this.countryList)) {
            this.selectedItem.contactDetail.country = this.countryList[0].country;
            this.selectedItem.contactDetail.countryId = this.countryList[0].countryId;
        }

        if (!AppUtility.isEmptyArray(this.cityList)) {
            this.selectedItem.contactDetail.city = this.cityList[0].city;
            this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
        }

        this.selectedItem.contactDetail.firstName = '';
        this.selectedItem.contactDetail.middleName = '';
        this.selectedItem.contactDetail.lastName = '';
        this.selectedItem.contactDetail.fatherHusbandName = '';
        this.selectedItem.contactDetail.gender = '';
        this.selectedItem.contactDetail.identificationTypeId = null;
        this.selectedItem.contactDetail.registrationNo = '';
        this.selectedItem.contactDetail.identificationType = '';
        this.selectedItem.contactDetail.professionId = null;
        this.selectedItem.contactDetail.phone1 = '';
        this.selectedItem.contactDetail.cellNo = '';
        this.selectedItem.contactDetail.email = '';
        this.selectedItem.contactDetail.dob = new Date();
        this.selectedItem.contactDetail.postalCode = '';
        this.selectedItem.contactDetail.address1 = '';
        this.selectedItem.contactDetail.companyName = '';
        this.selectedItem.contactDetail.industryId = null;
        this.selectedItem.contactDetail.fullName = '';

        this.minValue = 0.0000;
        this.maxValue = 100.0000;

        if (AppUtility.isValidVariable(this.agentTypeList) && !AppUtility.isEmpty(this.agentTypeList)) {
            this.selectedItem.agentType = this.agentTypeList[0].code;
        }

    }

    get pageSize(): number {
        return this._pageSize;
    }

    set pageSize(value: number) {
        if (this._pageSize != value) {
          this._pageSize = value;
          if (this.flex) {
            (<IPagedCollectionView><unknown>this.flex.collectionView).pageSize = value;
          }
        }
      }

    public onCancelAction() {
        this.clearFields();
        this.hideForm = false;
    }

    public onNewAction() {
        this.clearFields();
        this.hideForm = true;
    }

    public onEditAction() {
        this.clearFields();
        this.selectedIndex = this.flex.selection.row;
        this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
        if (!AppUtility.isEmpty(this.selectedItem)) {
            this.hideForm = true;
            this.isEditing = true;

            if (this.selectedItem.agentType == "I") {
                this.showIndividual = true;
                this.showCorporate = false;
            }
            else {
                this.showIndividual = false;
                this.showCorporate = true;
            }

            if (this.selectedItem.commissionType == 'F') {
                this.overAll_perShare = "Per Share";
            }
            else {
                this.overAll_perShare = "Overall";
            }

            this.cityId = this.selectedItem.contactDetail.cityId.valueOf();

            this.populateCityListByCountry(this.selectedItem.contactDetail.countryId);
            this.selectedItem.contactDetail.cityId = this.cityId;
            this.cmbCityId.invalidate();

        }
    }

    public onCommissionTypeChangeEvent(selectedCommissionType) {
        if (selectedCommissionType == 'F') {
            this.selectedItem.commissionType = 'F';
            this.minValue = 0.0000;
            this.maxValue = 9999999999.9999;
            this.overAll_perShare = "Per Share";
        }
        else {
            this.selectedItem.commissionType = 'P';
            this.minValue = 0.0000;
            this.maxValue = 100.0000;
            this.overAll_perShare = "Overall";
        }
        this.commissionRate.value = 0;
    }

    public onAgentTypeChangeEvent(selectedType) {
        if (AppUtility.isEmpty(selectedType)) {
            this.showIndividual = false;
            this.showCorporate = false;
            this.selectedItem.agentType = "";
            this.selectedItem.contactDetail.dob = new Date();
        }
        else if (selectedType == "I") {
            this.showIndividual = true;
            this.showCorporate = false;
            this.selectedItem.agentType = "I";
            //this.selectedItem.contactDetail.dob = new Date();
        }
        else {
            this.showIndividual = false;
            this.showCorporate = true;
            this.selectedItem.agentType = "C";
            this.selectedItem.contactDetail.dob = new Date();
        }
    }

    public onCountryChangeEvent(slectedCountryId): void {
        this.populateCityListByCountry(slectedCountryId);
    }

    public onSaveAction(model: any, isValid: boolean) {
        this.isSubmitted = true;

        if (
            AppUtility.regularExpressionvalidator('agentCode', model.agentCode, AppConstants.validatePatternString)
            &&
            AppUtility.regularExpressionvalidator('firstName', model.firstName, AppConstants.validatePatternString)
            &&
            AppUtility.regularExpressionvalidator('middleName', model.middleName, AppConstants.validatePatternString)
            &&
            AppUtility.regularExpressionvalidator('lastName', model.lastName, AppConstants.validatePatternString)
            &&
            AppUtility.regularExpressionvalidator('fatherHusbandName', model.fatherHusbandName, AppConstants.validatePatternString)
            &&
            AppUtility.regularExpressionvalidator('identificationType', model.identificationType, AppConstants.validatePatternString)
            &&
            AppUtility.regularExpressionvalidator('postalCode', model.postalCode, AppConstants.validatePatternStringPostalCode)
            &&
            AppUtility.regularExpressionvalidator('phone1', model.phone1, AppConstants.validatePatternNumeric)
            &&
            AppUtility.regularExpressionvalidator('email', model.email, AppConstants.validatePatternEmail)
            &&
            AppUtility.regularExpressionvalidator('cellNo', model.cellNo, AppConstants.validatePatternNumeric)
            &&
            AppUtility.regularExpressionvalidator('registrationNo', model.registrationNo, AppConstants.validatePatternString)
            &&
            AppUtility.regularExpressionvalidator('companyName', model.companyName, AppConstants.validatePatternString)
        ) {
            if (this.showIndividual) {

                if (AppUtility.isEmpty(this.selectedItem.contactDetail.firstName) || AppUtility.isEmpty(this.selectedItem.contactDetail.lastName) || AppUtility.isEmpty(this.selectedItem.contactDetail.gender) || AppUtility.isEmpty(this.selectedItem.contactDetail.identificationTypeId) || AppUtility.isEmpty(this.selectedItem.contactDetail.identificationType) || AppUtility.isEmpty(this.selectedItem.contactDetail.countryId) || AppUtility.isEmpty(this.selectedItem.contactDetail.cityId) || AppUtility.isEmpty(this.selectedItem.contactDetail.address1) || AppUtility.isEmpty(this.selectedItem.contactDetail.postalCode) || AppUtility.isEmpty(this.selectedItem.contactDetail.phone1) || AppUtility.isEmpty(this.selectedItem.contactDetail.countryId) || AppUtility.isEmpty(this.selectedItem.agentType) || AppUtility.isEmpty(this.selectedItem.branchId) || AppUtility.isEmpty(this.selectedItem.contactDetail.identificationTypeId) || AppUtility.isEmpty(this.selectedItem.contactDetail.email)) {
                    isValid = false;
                }
                else {
                    isValid = true;

                    this.selectedItem.contactDetail.companyName = null;
                    this.selectedItem.contactDetail.industryId = null;
                }
            }
            else if (this.showCorporate) {
                if (AppUtility.isEmpty(this.selectedItem.contactDetail.email) || AppUtility.isEmpty(this.selectedItem.contactDetail.companyName) || AppUtility.isEmpty(this.selectedItem.contactDetail.industryId) || AppUtility.isEmpty(this.selectedItem.contactDetail.registrationNo) || AppUtility.isEmpty(this.selectedItem.contactDetail.countryId) || AppUtility.isEmpty(this.selectedItem.contactDetail.cityId) || AppUtility.isEmpty(this.selectedItem.contactDetail.address1) || AppUtility.isEmpty(this.selectedItem.contactDetail.postalCode) || AppUtility.isEmpty(this.selectedItem.contactDetail.phone1) || AppUtility.isEmpty(this.selectedItem.contactDetail.countryId) || AppUtility.isEmpty(this.selectedItem.agentType) || AppUtility.isEmpty(this.selectedItem.branchId) || AppUtility.isEmpty(this.selectedItem.contactDetail.industryId)) {
                    isValid = false;
                }
                else {
                    isValid = true;

                    this.selectedItem.contactDetail.firstName = null;
                    this.selectedItem.contactDetail.middleName = null;
                    this.selectedItem.contactDetail.lastName = null;
                    this.selectedItem.contactDetail.fatherHusbandName = null;
                    this.selectedItem.contactDetail.gender = null;
                    this.selectedItem.contactDetail.identificationTypeId = null;
                    this.selectedItem.contactDetail.dob = new Date();
                    this.selectedItem.contactDetail.professionId = null;
                }
            }

            if (isValid) {
                if (this.isEditing) {
                    this.listingService.updateAgent(this.selectedItem).subscribe(
                        data => {
                            console.log("update>>>>>" + data);
                            this.fillAgentFromJson(this.selectedItem, data);
                            this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
                            this.itemsList.commitEdit();
                            // this.clearFields();
                            this.flex.invalidate();
                            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                            this.dialogCmp.showAlartDialog('Success');
                            // this.flex.refresh();
                        },
                        err => {
                            this.errorMessage = err.message;
                            this.hideForm = true;
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');

                        }
                    );
                }
                else {
                    console.log("====================" + this.selectedItem);
                    this.listingService.saveAgent(this.selectedItem).subscribe(
                        data => {
                            if (AppUtility.isEmpty(this.itemsList))
                                this.itemsList = new wjcCore.CollectionView;

                            console.log("save>>>>>" + data);
                            this.selectedItem = this.itemsList.addNew();
                            this.fillAgentFromJson(this.selectedItem, data);
                            this.itemsList.commitNew();

                            // Select the newly added item
                            AppUtility.moveSelectionToLastItem(this.itemsList);

                            // this.clearFields();
                            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
                            this.dialogCmp.showAlartDialog('Success');
                        },
                        err => {
                            this.hideForm = true;
                            this.errorMessage = err.message;
                            this.dialogCmp.statusMsg = this.errorMessage;
                            this.dialogCmp.showAlartDialog('Error');
                        }
                    );
                }
            }
        }
    }


    /***************************************
   *          Private Methods
   **************************************/

    private populateCountryList() {
        this.loader.show();
        this.listingService.getCountryList()
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.countryList = restData;

                    var country: Country = new Country();
                    country.countryId = AppConstants.PLEASE_SELECT_VAL;
                    country.countryName = AppConstants.PLEASE_SELECT_STR;
                    this.countryList.unshift(country);

                    this.selectedItem.contactDetail.countryId = this.countryList[0].countryId;
                    if (this.countryList[0].countryId != null)
                        this.populateCityListByCountry(this.countryList[0].countryId);
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    private populateCityListByCountry(countryId: Number) {
        console.log("---countryid===" + countryId);
        var city: City = new City();
        city.cityId = AppConstants.PLEASE_SELECT_VAL;
        city.cityName = AppConstants.PLEASE_SELECT_STR;

        const cityCombo: FormControl = (<any>this.myForm).controls.cityId;
        if (AppUtility.isEmpty(countryId)) {
            this.cityList = [];
            this.cityList.unshift(city);
            cityCombo.reset();
        } else {
            this.listingService.getCityListByCountry(countryId)
                .subscribe(
                    restData => {
                        if (AppUtility.isEmpty(restData)) {
                            this.cityList = [];
                            this.selectedItem.contactDetail.cityId = null;
                            this.selectedItem.contactDetail.city = null;
                        }
                        else {
                            this.cityList = restData;
                            if (!AppUtility.isEmptyArray(this.cityList)) {
                                if (!this.isEditing) {
                                    this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
                                    this.selectedItem.contactDetail.city = this.cityList[0].cityName;
                                }
                            }

                        }
                        this.cityList.unshift(city);
                    },
                    error => { this.errorMessage = <any>error.message; },
                    () => {
                        cityCombo.reset();
                    }
                );
        }
    }

    private populateParticipantBranchList() {
        this.loader.show();
        this.listingService.getParticipantBranchList(AppConstants.participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.participantBranchList = restData;

                    var participantBranch: ParticipantBranch = new ParticipantBranch();
                    participantBranch.branchId = AppConstants.PLEASE_SELECT_VAL;
                    participantBranch.branchCode = AppConstants.PLEASE_SELECT_STR;
                    this.participantBranchList.unshift(participantBranch);
                    this.selectedItem.branchId = this.participantBranchList[0].branchId;
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    private populateIdentificationTypeList() {
        this.loader.show();
        this.listingService.getIdentificationTypeList()
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.identificationTypeList = restData;

                    var identificationType: IdentificationType = new IdentificationType();
                    identificationType.identificationTypeId = AppConstants.PLEASE_SELECT_VAL;
                    identificationType.identificationType = AppConstants.PLEASE_SELECT_STR;
                    this.identificationTypeList.unshift(identificationType);
                    this.selectedItem.contactDetail.identificationTypeId = this.identificationTypeList[0].identificationTypeId;
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    private populateProfessionList() {
        this.loader.show();
        this.listingService.getProfessionList()
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.professionList = restData;

                    var profession: Profession = new Profession();
                    profession.professionId = AppConstants.PLEASE_SELECT_VAL;
                    profession.professionCode = AppConstants.PLEASE_SELECT_STR;
                    this.professionList.unshift(profession);
                    this.selectedItem.contactDetail.professionId = this.professionList[0].professionId;
                },
                error => { this.loader.hide(); this.errorMessage = <any>error.message });
    }

    private populateIndustryList() {
        this.loader.show();
        this.listingService.getIndustryList()
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.industryList = restData;

                    var industry: Industry = new Industry();
                    industry.industryId = AppConstants.PLEASE_SELECT_VAL;
                    industry.industryName = AppConstants.PLEASE_SELECT_STR;
                    this.industryList.unshift(industry);
                    this.selectedItem.contactDetail.industryId = this.industryList[0].industryId;
                },
                error => {
                    this.loader.hide(); this.errorMessage = <any>error.message
                        , () => {
                        }
                });
    }

    private fillAgentFromJson(ag: Agent, data: any) {
        if (!AppUtility.isEmpty(data)) {
            ag.agentId = data.agentId;
            ag.agentCode = data.agentCode;

            ag.participant = new Participant();
            ag.participant.participantId = AppConstants.participantId;
            ag.commissionRate = data.commissionRate;
            ag.commissionType = data.commissionType;
            ag.commissionTypeDisplay_ = data.commissionTypeDisplay_;
            ag.agentType = data.agentType;
            ag.branchId = data.branchId;
            ag.active = data.active;

            ag.contactDetail = new ContactDetail();
            ag.contactDetail.contactDetailId = data.contactDetail.contactDetailId;
            ag.contactDetail.country = data.contactDetail.country;
            ag.contactDetail.countryId = data.contactDetail.countryId;
            ag.contactDetail.city = data.contactDetail.city;
            ag.contactDetail.cityId = data.contactDetail.cityId;
            ag.contactDetail.address1 = data.contactDetail.address1;
            ag.contactDetail.postalCode = data.contactDetail.postalCode;
            ag.contactDetail.phone1 = data.contactDetail.phone1;
            ag.contactDetail.cellNo = data.contactDetail.cellNo;
            ag.contactDetail.email = data.contactDetail.email;
            ag.contactDetail.firstName = data.contactDetail.firstName;
            ag.contactDetail.lastName = data.contactDetail.lastName;
            ag.contactDetail.middleName = data.contactDetail.middleName;
            ag.contactDetail.fatherHusbandName = data.contactDetail.fatherHusbandName;
            ag.contactDetail.gender = data.contactDetail.gender;
            ag.contactDetail.identificationTypeId = data.contactDetail.identificationTypeId;
            ag.contactDetail.identificationType = data.contactDetail.identificationType;
            ag.contactDetail.registrationNo = data.contactDetail.registrationNo;
            ag.contactDetail.professionId = data.contactDetail.professionId;

            ag.contactDetail.companyName = data.contactDetail.companyName;
            ag.contactDetail.industryId = data.contactDetail.industryId;


            if (data.agentType == "I") {
                ag.contactDetail.fullName = data.contactDetail.firstName + " " + data.contactDetail.lastName;
                ag.contactDetail.dob = data.contactDetail.dob;
                this.showIndividual = true;
                this.showCorporate = false;
            }
            else {
                ag.contactDetail.fullName = data.contactDetail.companyName;
                ag.contactDetail.dob = null;
                this.showCorporate = true;
                this.showIndividual = false;
            }
        }
    }

    private populateAgentsList() {
        this.loader.show();
        this.listingService.getAgentsbyParticipant(AppConstants.participantId)
            .subscribe(
                restData => {
                    this.loader.hide();
                    if (AppUtility.isEmptyArray(restData)) {
                        this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                    } else {
                        this.itemsList = new wjcCore.CollectionView(restData);
                    }
                },
                error => {
                    this.loader.hide();
                    this.errorMessage = <any>error.message;
                });
    }

    private addFromValidations() {
        this.myForm = this._fb.group({
            agentCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            commissionRate: ['', Validators.compose([Validators.required])],
            agentType: ['', Validators.compose([Validators.required])],
            active: [''],
            //commissionType: [''],            
            firstName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            middleName: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternString)])],
            lastName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            fatherHusbandName: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternString)])],
            gender: ['', Validators.compose([Validators.required])],
            identificationTypeId: ['', Validators.compose([Validators.required])],
            registrationNo: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            identificationType: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            branchId: ['', Validators.compose([Validators.required])],
            dob: [''],
            professionId: [''],
            countryId: ['', Validators.compose([Validators.required])],
            cityId: ['', Validators.compose([Validators.required])],
            address: ['', Validators.compose([Validators.required])],
            postalCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternStringPostalCode)])],
            phone1: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternNumeric)])],
            email: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternEmail)])],
            industryId: ['', Validators.compose([Validators.required])],
            companyName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
            cellNo: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternNumeric)])],
        });
    }

    public getNotification(btnClicked) {
        if (btnClicked == 'Success')
            this.hideModal();
    }
}