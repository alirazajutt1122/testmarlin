'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';

import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { FiscalYear } from 'app/models/fiscal-year';
import { Participant } from 'app/models/participant';
import { ComboItem } from 'app/models/combo-item';

declare var jQuery: any;

@Component({

  selector: 'fiscal-year',
  templateUrl: './fiscal-year.html',
  encapsulation: ViewEncapsulation.None,
})
export class FiscalYearCmp implements OnInit {
  public myForm: FormGroup;

  claims: any;

  dateFormat: string = AppConstants.DATE_FORMAT;

  minDate: Date = new Date("1900-01-01");
  itemsList: wjcCore.CollectionView;
  data: any;
  selectedItem: FiscalYear;
  errorMessage: string;

  public statusDisabled: boolean = false;
  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;

  public statusList: any[];
  public status: string = null;
  private _pageSize = 0;

  @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
  @ViewChild('inputStartDate') inputStartDate: wjcInput.InputDate;
  @ViewChild('code') code: wjcInput.InputMask;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;

  constructor(private appState: AppState, public userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    this.initForm();
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.claims = this.userService.claims;
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }


  ngOnInit() {

    // Add Form Validations
    this.addFromValidations();
    this.populateFiscalYearList();


  }

  ngAfterViewInit() {

    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      self.code.focus();
      if (self.isEditing) {
        //alert("start date: "+ self.flexGrid.collectionView.currentItem.startDate); 
        self.inputStartDate.text = self.flexGrid.collectionView.currentItem.startDate;
        self.inputStartDate.value = self.flexGrid.collectionView.currentItem.startDate;
      }
      (<wjcCore.CollectionView>self.flexGrid.collectionView).editItem(self.flexGrid.collectionView.currentItem);
    });
  }

  /*********************************
 *      Public & Action Methods
 *********************************/
  initForm() {
    this.data = [];
    this.itemsList = new wjcCore.CollectionView();
    this.selectedItem = new FiscalYear();
    this.selectedItem.startDate = new Date().toString();
    this.selectedItem.yearClosed = AppConstants.YEAR_CLOSED_CURRENT;

  }
  public clearFields() {
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

    this.selectedItem.fiscalCode = '';

  }

  updateFieldsAfterAdd() {
    if (AppUtility.isValidVariable(this.data) && this.data.length > 0) {
      let count = this.data.length;
      this.data[count] = this.selectedItem;
    } else {
      this.data[0] = this.selectedItem;
    }

  }

  updateEndDate() {

    if (!this.isEditing) {
      AppUtility.printConsole("In updateEndDate");
      this.minDate = this.getMinDate();
      AppUtility.printConsole("Min date 1: " + this.minDate);

      if (AppUtility.isValidVariable(this.data) && this.data.length > 0) {
        this.selectedItem.startDate = this.minDate.toString();
        this.selectedItem.yearClosed = AppConstants.YEAR_CLOSED_NEW;
      } else {
        this.selectedItem.startDate = new Date().toString();
        this.selectedItem.yearClosed = AppConstants.YEAR_CLOSED_CURRENT;
      }
      let startDate = new Date(this.inputStartDate.text);
      let endDate = new Date(startDate.setMonth(startDate.getMonth() + 12));
      endDate.setDate(endDate.getDate() - 1);
      this.selectedItem.endDate = endDate.toString();

      //this.inputStartDate.invalidate() ;
    }
    AppUtility.printConsole("End Date: " + this.selectedItem.endDate);
  }

  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    if (this._pageSize != value) {
      this._pageSize = value;
      if (this.flexGrid) {
        (<wjcCore.IPagedCollectionView>this.flexGrid.collectionView).pageSize = value;
      }
    }
  }


  public onCancelAction() {
    //this.clearFields();
    this.itemsList.cancelEdit();
    (<wjcCore.CollectionView>this.flexGrid.collectionView).cancelEdit();
    this.hideForm = false;
  }

  public onNewAction() {
    this.myForm.markAsPristine();
    this.isSubmitted = false;
    this.hideForm = true;
    this.selectedItem = JSON.parse(JSON.stringify(new FiscalYear()));
    this.clearFields();
    this.selectedItem.fiscalYearId = null;
    this.updateEndDate();
    this.isEditing = false;
  }

  public onEditAction() {
    this.myForm.markAsPristine();
    this.isSubmitted = false;
    if (!AppUtility.isEmpty(this.itemsList.currentItem)) {
      this.selectedItem = new FiscalYear();
      this.hideForm = true;
      this.isEditing = true;
      this.status = null;
      this.minDate = null;
      this.selectedItem = JSON.parse(JSON.stringify(this.itemsList.currentItem));
      this.minDate = new Date(this.selectedItem.startDate.toString());
      this.fillFiscalYearFromSelectedItem(this.itemsList.currentItem);

      //this.itemsList.editItem(this.selectedItem);
      AppUtility.printConsole("Min data: " + this.minDate);
      this.showModal();

    }
  }

  public showModal() {
    jQuery("#add_new").modal("show");
  }

  public onSaveAction(model: any, isValid: boolean) {
    AppUtility.printConsole("onSave Action, isValid: " + isValid);
    this.isSubmitted = true;
    this.selectedItem.startDate = wjcCore.Globalize.format(new Date(this.selectedItem.startDate.toString()), this.dateFormat);
    this.selectedItem.endDate = wjcCore.Globalize.format(new Date(this.selectedItem.endDate.toString()), this.dateFormat);

    if (isValid) {
      this.loader.show();
      if (this.isEditing) {
        AppUtility.printConsole("Edit ..." + this.status);
        if (this.status != null) {
          this.selectedItem.yearClosed = this.status;
        } else {
          this.selectedItem.yearClosed = FiscalYear.getYearClosed(this.selectedItem.status);
        }
        this.selectedItem.participant = new Participant();
        this.selectedItem.participant.participantId = AppConstants.participantId;
        AppUtility.printConsole("Fiscal Year:" + JSON.stringify(this.selectedItem));
        if (this.userService.isAuhtorized(this.userService.EB_FINANCIALS_FISCAL_YEAR_CLOSE)) {
          this.listingService.updateFiscalYear(this.selectedItem).subscribe(
            data => {
              this.loader.hide();
              //this.fillFiscalYearFromJson(this.selectedItem, data, true);
              this.itemsList.commitEdit();
              //this.flexGrid.refresh();
              this.populateFiscalYearList();
              this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
              this.dialogCmp.showAlartDialog('Success');
            },
            error => {
              this.loader.hide();
              this.errorMessage = error.message;
              this.hideForm = true;
              this.itemsList.cancelEdit();
              this.dialogCmp.statusMsg = this.errorMessage;
              this.dialogCmp.showAlartDialog('Error');
            }
          );
        }
      }
      else {
        AppUtility.printConsole("New  ...");
        //console.log("POST>>>>" + this.selectedItem.participant.participantId);
        if (AppUtility.isValidVariable(this.data) && this.data.length > 0) {
          this.selectedItem.yearClosed = AppConstants.YEAR_CLOSED_NEW;
        } else {
          this.selectedItem.yearClosed = AppConstants.YEAR_CLOSED_CURRENT;
        }
        this.selectedItem.participant = new Participant();
        this.selectedItem.participant.participantId = AppConstants.participantId;
        AppUtility.printConsole("Fiscal Year:" + this.selectedItem);
        if (this.userService.isAuhtorized(this.userService.EB_FINANCIALS_FISCAL_YEAR_NEW)) {
          this.listingService.saveFiscalYear(this.selectedItem).subscribe(
            data => {
              this.loader.hide();
              if (AppUtility.isEmpty(this.itemsList))
                this.itemsList = new wjcCore.CollectionView;

              let item = this.itemsList.addNew();
              //this.fillFiscalYearFromJson(item, data);
              this.itemsList.commitNew();
              //this.updateFieldsAfterAdd(); 
              this.populateFiscalYearList();
              // Select the newly added item
              AppUtility.moveSelectionToLastItem(this.itemsList);

              console.log(data);
              // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
              this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
              this.dialogCmp.showAlartDialog('Success');

            },
            err => {
              this.loader.hide();
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

  private fillFiscalYearFromJson(st: FiscalYear, data: any, isEdit: boolean = false) {
    //st = new FiscalYear(); 
    if (!AppUtility.isEmpty(data)) {
      AppUtility.printConsole("data from server: " + JSON.stringify(data));
      st.fiscalYearId = data.fiscalYearId;
      st.fiscalCode = data.fiscalCode;
      st.startDate = data.startDate;
      st.endDate = data.endDate;
      st.yearClosed = data.yearClosed;
      st.status = FiscalYear.getYearClosedStr(data.yearClosed);
      st.participant = data.participant;
    }

    // this.itemsList.currentItem = st;
    // this.flexGrid.refresh();
  }

  private fillFiscalYearFromSelectedItem(data) {
    if (!AppUtility.isEmpty(data)) {
      this.selectedItem.fiscalYearId = data.fiscalYearId;
      this.selectedItem.fiscalCode = data.fiscalCode;
      this.selectedItem.startDate = data.startDate, this.dateFormat;
      this.selectedItem.endDate = data.endDate;
      this.selectedItem.yearClosed = data.yearClosed;

      this.populateStatusList(data.yearClosed);

    }
  }

  private populateFiscalYearList() {
    this.loader.show();
    AppUtility.printConsole("Getting list...");
    if (this.userService.isAuhtorized(this.userService.EB_FINANCIALS_FISCAL_YEAR_VIEW)) {
      this.listingService.getFiscalYearList(AppConstants.participantId)
        .subscribe(
          restData => {
            this.loader.hide();
            if (AppUtility.isEmptyArray(restData)) {
              this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            } else {

              this.updateData(restData);
            }
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
          });
    }
  }

  updateData(data) {
    this.data = data;
    this.itemsList = new wjcCore.CollectionView(data);

    for (let i = 0; i < data.length; i++) {
      this.itemsList[i] = data[i];
      this.itemsList[i].startDate = wjcCore.Globalize.format(new Date(this.itemsList[i].startDate), this.dateFormat);
      this.itemsList[i].endDate = wjcCore.Globalize.format(new Date(this.itemsList[i].endDate), this.dateFormat);
      this.itemsList[i].status = FiscalYear.getYearClosedStr(data[i].yearClosed);

    }

  }

  getMinDate(): Date {
    let endDate: Date;
    if (AppUtility.isValidVariable(this.data) && !AppUtility.isEmpty(this.data)) {
      for (let i = 0; i < this.data.length; i++) {

        if (this.minDate.getTime() < new Date(this.data[i].endDate).getTime()) {
          this.minDate = new Date(this.data[i].endDate.toString());
          endDate = new Date(this.data[i].endDate.toString());
          this.minDate.setDate(endDate.getDate() + 1);
        }
      }
    }

    return this.minDate;
  }
  private addFromValidations() {
    this.myForm = this._fb.group({
      code: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      startDate: ['', Validators.compose([Validators.required])],
      endDate: ['', Validators.compose([Validators.required])],
      status: [''],
    });
  }

  private populateStatusList(currentStatus) {
    this.statusList = [];
    let i: number = 0;
    let cmbItem: ComboItem = new ComboItem(AppConstants.PLEASE_SELECT_STR, null);
    this.statusList[i] = cmbItem;
    if (currentStatus == AppConstants.YEAR_CLOSED_CURRENT) {
      if (!this.checkTemporaryClose()) {
        cmbItem = new ComboItem(AppConstants.YEAR_CLOSED_TEMP_STR, AppConstants.YEAR_CLOSED_TEMP);
        i = i + 1;
        this.statusList[i] = cmbItem;

        cmbItem = new ComboItem(AppConstants.YEAR_CLOSED_PERMANENT_STR, AppConstants.YEAR_CLOSED_PERMANENT);
        i = i + 1;
        this.statusList[i] = cmbItem;
        this.statusDisabled = false;
      } else {
        this.statusDisabled = true;
      }
    }
    else if (currentStatus == AppConstants.YEAR_CLOSED_TEMP) {

      cmbItem = new ComboItem(AppConstants.YEAR_CLOSED_PERMANENT_STR, AppConstants.YEAR_CLOSED_PERMANENT);
      i = i + 1;
      this.statusList[i] = cmbItem;
      this.statusDisabled = false;

    }

    // check next available 
    if (!this.checkNextAvailable()) {
      this.statusDisabled = true;
    } else {
      this.statusDisabled = false;
    }

    if (this.statusList.length == 1) {
      this.statusDisabled = true;
    }
  }

  private checkTemporaryClose(): boolean {
    let tempCloseFound: boolean = false;
    if (AppUtility.isValidVariable(this.itemsList)) {
      for (let i = 0; i < this.itemsList.items.length; i++) {
        if (this.itemsList.items[i].yearClosed == AppConstants.YEAR_CLOSED_TEMP) {
          tempCloseFound = true;
        }

      }
    }
    return tempCloseFound;
  }

  private checkNextAvailable(): boolean {
    let nextAvailable: boolean = false;
    if (AppUtility.isValidVariable(this.itemsList)) {
      for (let i = 0; i < this.itemsList.items.length; i++) {
        if (new Date(this.itemsList.items[i].endDate).getTime() > new Date(this.selectedItem.endDate.toString()).getTime()
          && (this.itemsList.items[i].status == AppConstants.YEAR_CLOSED_NEW_STR ||
            this.itemsList.items[i].status == AppConstants.YEAR_CLOSED_CURRENT_STR)) {
          nextAvailable = true;
        }

      }
    }
    AppUtility.printConsole("next new : " + nextAvailable);
    return nextAvailable;
  }

  public hideModal() {
    jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }

}