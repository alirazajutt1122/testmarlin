'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';


declare var jQuery: any;

@Component({

  selector: 'cheque-clearance-page',
  templateUrl: './cheque-clearance-page.html',

  encapsulation: ViewEncapsulation.None,
})

export class ChequeClearancePage implements OnInit {

  itemsList: wjcCore.CollectionView;
  errorMessage: string;

  today: Date = new Date();
  private _pageSize = 0;
  //claims: any;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('fromDate') fromDate: wjcInput.InputDate;
  @ViewChild('toDate') toDate: wjcInput.InputDate;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;


  constructor(private appState: AppState, private listingService: ListingService, public userService: AuthService2, private translate: TranslateService,private loader : FuseLoaderScreenService) {
    //this.claims = authService.claims;
    this.itemsList = new wjcCore.CollectionView();
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }


  ngOnInit() {
  }

  /*********************************
 *      Public & Action Methods
 *********************************/

  public onSearchTransaction(fromDate, toDate): void {
    if (fromDate > toDate) {
      this.dialogCmp.statusMsg = "From Date should be less or equal than To Date.";
      this.dialogCmp.showAlartDialog('Warning');

      this.itemsList = new wjcCore.CollectionView();
      this.flex.refresh();
    }
    else {
      // Populate Grid data..    
      this.populateVoucherList(fromDate, toDate);
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

  private _selectedStatus: any;
  private _items: string[] = [];
  private _msg: string = '';

  public onPostAction(selectedStatus) {
    this._selectedStatus = selectedStatus;
    if (this.itemsList.itemCount < 1) {
      this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
      this.itemsList = new wjcCore.CollectionView();
      this.flex.refresh();
      this.dialogCmp.statusMsg = this.errorMessage;
      this.dialogCmp.showAlartDialog('Error');

    }
    else {
      var confirmStr;
      this._msg = AppConstants.MSG_RECORD_CLEARED;
      if (this._selectedStatus == "CLEARED") {
        // confirmStr = confirm("Are you sure you want to Clear all cheque(s)?");
        this.dialogCmp.statusMsg = "Are you sure you want to Clear all cheque(s)?";
        this.dialogCmp.showAlartDialog('Confirmation');
      }
    }
  }


  /***************************************
 *          Private Methods
 **************************************/

  private populateVoucherList(fromDate: Date, tromDate: Date) {
    this.loader.show();
    this.listingService.getVoucherListByBrokerDate(AppConstants.participantId, fromDate, tromDate)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
            this.itemsList = new wjcCore.CollectionView();
            this.flex.refresh();
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');

          } else {
            this.itemsList = new wjcCore.CollectionView(restData);
            // Select the newly added item
            AppUtility.moveSelectionToLastItem(this.itemsList);
            this._pageSize = 0;
          }
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        });
  }

  public hideModal() {
    jQuery('#add_new').modal('hide');   // hiding the modal on save/updating the record
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();

    else if (btnClicked == 'Yes') {
      for (var i = 0; i < this.itemsList.itemCount; i++) {
        this._items.push(this.itemsList.items[i].voucherMasterId);
        console.log("--------------" + this._items[i]);
      }

      this.listingService.updateVoucherStatus(this._items, this._selectedStatus).subscribe(
        data => {
          this.dialogCmp.statusMsg = this._msg;
          this.dialogCmp.showAlartDialog('Success');
          this.itemsList = new wjcCore.CollectionView();
          this.flex.refresh();
        },
        err => {
          this.errorMessage = err.message;
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        });
    }
  }
}