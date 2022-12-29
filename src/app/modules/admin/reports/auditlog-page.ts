'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcGridXlsx from '@grapecity/wijmo.grid.xlsx';


import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { IPagedCollectionView, } from '@grapecity/wijmo';
import { DialogCmp } from 'app/modules/admin/back-office/user-site/dialog/dialog.component';

import { Bank } from 'app/models/bank';
import { Participant } from 'app/models/participant';
import { AuditLog } from 'app/models/auditlog';

declare var jQuery: any;

@Component({

  selector: 'auditlog',
  templateUrl: './auditlog-page.html',
})
export class AuditLogCmp implements OnInit {

  public myForm: FormGroup;

  public searchButtonClass: String;

  itemsList: wjcCore.CollectionView;
  selectedItem: AuditLog;
  errorMessage: string;
  //claims: any;
  selectedIndex: number = 0;

  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean;

  private _pageSize = 0;
  includeColumnHeader: boolean = true;

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  @ViewChild('flexGrid', { static: false }) flexGrid: wjcGrid.FlexGrid;

  lang: string;



  constructor(private appState: AppState, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService, private loader: FuseLoaderScreenService) {

    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;

    this.searchButtonClass = 'btn btn-success btn-sm';

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

    this.populateItemsList(AppConstants.participantId);

  }

  ngAfterViewInit() {
    var self = this;

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


  /***************************************
 *          Private Methods
 **************************************/


  private populateItemsList(_participantid: Number) {
    this.loader.show();
    this.loadItemsList([]); 
    this.listingService.getAuditLogList()
      .subscribe(
        restData => {
          this.loader.hide();
         
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            this.loadItemsList(restData);

          }
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
          console.log(this.errorMessage);
        });
  }

  loadItemsList(restData: any) {

    restData.forEach(function (item: AuditLog) {
      item.result = (item.eventType.toUpperCase() == 'LOGIN' && (item.result == null || item.result == '')) ? 'Successful' : item.result;
      item.logDateStr = new Date(item.logDateTime).toLocaleDateString('en-UK');
      item.logTimeStr = new Date(item.logDateTime).toLocaleTimeString();
    });
    
    console.log(restData);
    this.itemsList = new wjcCore.CollectionView(restData);

  }
  getAuditLogBySearchParams(fromDate: Date, toDate: Date) {

    this.loader.show();
    this.loadItemsList([]); 
    this.listingService.getAuditLogListBySearchParams(fromDate, toDate)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            this.loadItemsList(restData);

          }
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
        });
  }

  onSearchAction(logFromDate, logToDate): void {
     
    if (!AppUtility.isEmpty(logFromDate) && !AppUtility.isEmpty(logToDate)) {
      this.getAuditLogBySearchParams(logFromDate, logToDate);
    }
  }

  // -------------------------------------------------------------------------

  exportExcel() {
    wjcGridXlsx.FlexGridXlsxConverter.save(this.flexGrid, { includeColumnHeaders: this.includeColumnHeader, includeCellStyles: false }, 'auditlog-marlin.xlsx');
  }


  public getNotification(btnClicked) {
    if (btnClicked == 'Success')
      this.hideModal();
  }

}