'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Exchange } from 'app/models/exchange';
import { PublicHoliday } from 'app/models/public-holiday';
import { WeeklyOffDay } from 'app/models/weekly-off-day';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';


declare var jQuery: any;

@Component({
  selector: 'holidays-page',
  templateUrl: './holidays-page.html',
})

export class HolidaysPage implements OnInit {
  public myForm: FormGroup;

  itemsList: wjcCore.CollectionView;
  selectedItem: PublicHoliday;

  errorMessage: string;

  exchangeList: any[];
  weekDaysList: any[];
  selectedweeklyOffDay: any[];

  today: Date = new Date();

  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;
  public selectedExchangeId: number;
  selectedIndex: number = 0;

  private _pageSize = 0;
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('weekOffDays') weekOffDays: wjcInput.MultiSelect;
  @ViewChild('holidayDate') holidayDate: wjcInput.InputDate;

  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;

  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService, private loader: FuseLoaderScreenService) {
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

  ngOnInit() {
    // Poppulate Exchange
    this.populateExchangeList();

    this.weeklyOffDaysLookup();
    // Add form Validations
    this.addFromValidations();
  }

  public ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function () {
      self.holidayDate.focus();
    });
  }



  /*********************************
   *      Public & Action Methods
   *********************************/

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
    if (AppUtility.isEmpty(this.selectedExchangeId)) {
      this.dialogCmp.statusMsg = 'Please select Exchange.';
      this.dialogCmp.showAlartDialog('Warning');
    } else {
      this.clearFields();
      this.hideForm = true;
    }
  }

  public onEditAction() {
    this.clearFields();
    this.selectedIndex = this.flex.selection.row;
    this.selectedItem = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(this.selectedItem)) {

      var hDate = new Date(Date.parse(this.itemsList.currentItem.holidayDate));
      this.today.setHours(0, 0, 0, 0);
      if (this.today > hDate) {
        this.dialogCmp.statusMsg = 'Can not edit pervious date holiday!';
        this.dialogCmp.showAlartDialog('Warning');
      } else {
        // this.clearFields();
        this.hideForm = true;
        this.isEditing = true;
        // this.selectedItem = this.itemsList.currentItem;
        // this.itemsList.editItem(this.selectedItem);
      }
    }
  }

  public clearFields() {

    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.itemsList)) {
      this.itemsList.cancelEdit();
      this.itemsList.cancelNew();
    }


    // if (!AppUtility.isEmpty(this.weekOffDays))
    //   this.weekOffDays.checkedItems = [];

    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;

    this.selectedItem = new PublicHoliday();
    this.selectedItem.publicHolidayId = null;
    this.selectedItem.reason = '';
    this.selectedItem.active = true;
    this.selectedItem.holidayDate = new Date();

    this.selectedItem.exchange = new Exchange();
    this.selectedItem.exchange.exchangeId = null;
    this.selectedItem.exchange.exchangeCode = '';

    if (!AppUtility.isEmptyArray(this.exchangeList)) {
      this.selectedItem.exchange.exchangeCode = this.exchangeList[0].exchangeCode;
      this.selectedItem.exchange.exchangeId = this.exchangeList[0].exchangeId;
      

    }
  }

  onExchangeChange(selectedId): void {
    this.selectedExchangeId = selectedId;
    if (!AppUtility.isEmpty(this.selectedExchangeId)) {

      if (!AppUtility.isEmpty(this.weekOffDays))
        this.weekOffDays.checkedItems = [];

      this.populatePublicHolidayDetail(this.selectedExchangeId);
      this.populateWeeklyOffDays(this.selectedExchangeId);
    } else {
      this.itemsList = new wjcCore.CollectionView();
    }
  }

  /******************************
   * Save / Update Action weekly
   ******************************/
  public saveWeekDaysAction() {
    if (AppUtility.isEmpty(this.selectedExchangeId)) {
      this.dialogCmp.statusMsg = 'Please select Exchange.';
      this.dialogCmp.showAlartDialog('Warning');
    } else {
      var wof: WeeklyOffDay = new WeeklyOffDay();
      wof.exchange = new Exchange();
      wof.exchange.exchangeId = this.selectedExchangeId;
      wof.weekDays = this.weekOffDays.checkedItems;
      this.listingService.saveWeeklyOffDays(wof).subscribe(
        data => {
          this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
          this.dialogCmp.showAlartDialog('Success');
        },
        err => {
          this.errorMessage = err.message;
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        }
      );
    }
  }
  /***
   * Save / Update Action holiday
   */
  public onSaveAction(model: any, isValid: boolean) {
    if (AppUtility.isEmpty(this.selectedExchangeId)) {
      this.dialogCmp.statusMsg = 'Please select Exchange';
      this.dialogCmp.showAlartDialog('Warning');
    } else {
      this.isSubmitted = true;
      this.selectedItem.exchange.exchangeId = this.selectedExchangeId;
      if (isValid) {
        this.loader.show();
        if (this.isEditing) {
          this.listingService.updatePublicHolidayList(this.toJson()).subscribe(
            data => {
              this.loader.hide();
              this.fillPublicHolidayFromJson(this.selectedItem, data);
              this.flex.rows[this.selectedIndex].dataItem = this.selectedItem;
              this.itemsList.commitEdit();
              // this.clearFields();
              this.flex.invalidate();
              this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
              this.dialogCmp.showAlartDialog('Success');
            },
            err => {
              this.loader.hide();
              this.errorMessage = err.message;
              this.hideForm = true;
              this.dialogCmp.statusMsg = this.errorMessage;
              this.dialogCmp.showAlartDialog('Error');

            }
          );
        }
        else {
          this.listingService.savePublicHolidayList(this.toJson()).subscribe(
            data => {
              this.loader.hide();
              if (AppUtility.isEmpty(this.itemsList))
                this.itemsList = new wjcCore.CollectionView;

              this.selectedItem = this.itemsList.addNew();
              this.fillPublicHolidayFromJson(this.selectedItem, data);
              this.itemsList.commitNew();
              // Select the newly added item
              AppUtility.moveSelectionToLastItem(this.itemsList);

              // this.clearFields();
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

  private toJson(): any {
    if (this.isEditing)
      return {
        "publicHolidayId": this.selectedItem.publicHolidayId,
        "active": this.selectedItem.active,
        "reason": this.selectedItem.reason,
        "holidayDate": AppUtility.formatDate(this.selectedItem.holidayDate),
        "exchange": {
          "exchangeId": this.selectedItem.exchange.exchangeId,
          "exchangeCode": this.selectedItem.exchange.exchangeCode
        }
      }
    else
      return {
        "holidayDate": AppUtility.formatDate(this.selectedItem.holidayDate),
        "publicHolidayId": null,
        "active": this.selectedItem.active,
        "reason": this.selectedItem.reason,
        "exchange": {
          "exchangeCode": null,
          "exchangeName": "",
          "exchangeId": this.selectedItem.exchange.exchangeId
        }
      }
  }

  private fillPublicHolidayFromJson(ph: PublicHoliday, data: any) {
    ph.publicHolidayId = data.publicHolidayId;
    ph.reason = data.reason;
    ph.holidayDate = new Date(data.holidayDate);
    ph.active = data.active;

    if (AppUtility.isEmpty(ph.exchange)) {
      ph.exchange = new Exchange();
    }
    ph.exchange.exchangeId = data.exchange.exchangeId;
    ph.exchange.exchangeCode = data.exchange.exchangeCode;
  }


  private weeklyOffDaysLookup() {
    this.loader.show();
    this.listingService.getWeekDaysLookup()
      .subscribe(
        restData => {
          this.loader.hide();
          this.weekDaysList = restData;
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message });
  }

  private populateWeeklyOffDays(exchangeId: Number) {
    this.loader.show();
    this.listingService.getWeeklyOffByExchange(exchangeId)
      .subscribe(
        restData => {
          this.loader.hide();
          this.selectedweeklyOffDay = restData;

          if (!AppUtility.isEmptyArray(this.selectedweeklyOffDay)) {
            for (let i = 0; i < this.weekDaysList.length; i++) {
              for (let j = 0; j < this.selectedweeklyOffDay.length; j++) {
                if (this.weekDaysList[i].weekDay == this.selectedweeklyOffDay[j].weekDay) {
                  this.weekDaysList[i].selected = true;
                  this.weekDaysList[i].$checked = true;
                }
              }
            }

            if (AppUtility.isValidVariable(this.weekOffDays) && !this.weekOffDays.containsFocus())
              this.weekOffDays.refresh();
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message });
  }
  private populatePublicHolidayDetail(exchangeId: Number) {
    this.loader.show();
    this.listingService.getPublicHolidaysByExchange(exchangeId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            this.itemsList = new wjcCore.CollectionView();
          } else {
            this.itemsList = new wjcCore.CollectionView(restData);
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message });
  }

  private populateExchangeList() {
    this.loader.show();
    this.listingService.getExchangeList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.exchangeList = restData;

          var exchange: Exchange = new Exchange();
          exchange.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          exchange.exchangeCode = AppConstants.PLEASE_SELECT_STR;
          this.exchangeList.unshift(exchange);

          this.selectedItem.exchange.exchangeId = this.exchangeList[0].exchangeId;
     
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message });
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      reason: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      holidayDate: [''],
      //active: [''],
    });
  }

  public hideModal() {
    jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }

}