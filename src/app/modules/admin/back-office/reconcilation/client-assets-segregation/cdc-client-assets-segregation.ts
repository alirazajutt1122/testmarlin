'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcGridPDF from "@grapecity/wijmo.grid.pdf";
import { Migrator } from 'app/models/migrator';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { AppState } from 'app/app.service';
import { ListingService } from 'app/services/listing.service';
import { AuthService2 } from 'app/services/auth2.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { TranslateService } from '@ngx-translate/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';




declare var jQuery: any;
let downloadAPI = require('./../../../../../scripts/download-document');

@Component({
  selector: 'cdc-client-assets-segregation',
  templateUrl: './cdc-client-assets-segregation.html',
})

export class CdcClientAssets implements OnInit {
  public myForm: FormGroup;
  errorMessage: string;
  //claims: any;
  public oCDCMigrator: Migrator;
  public debit: boolean = true;
  public loaded_records: number = 0;
  public error_records: number = 0;
  public fileSizeExceed = false;
  public IsFileAttached: boolean = false;
  public file_srcs: string[] = [];
  public fileName_: string = '';
  public fileContentType_: string = '';
  public fileInput_: any;
  public CdcReconcilationArray: wjcCore.CollectionView;
  public settlementDate: Date = new Date();
  public transDate: Date = new Date();

  public reportHeaderline1: String = 'Report Header Line 1';
  public reportHeaderline2: String = 'Report Header Line 2';
  public reportHeaderline3: String = 'Report Header Line 3';

  companyLogoBase64_: String = ""; // logo file address.
  companyLogoContentType: String = "";
  companyLogoName: String = "";
  selectedFileName:any
  private _groupBy = '';


  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  @ViewChild('flexDetail') flexDetail: wjcGrid.FlexGrid;
  lang: string;

  constructor(private appState: AppState, private changeDetectorRef: ChangeDetectorRef, private listingService: ListingService, private _fb: FormBuilder, public userService: AuthService2, private translate: TranslateService,private loader : FuseLoaderScreenService) {
    //this.claims = authService.claims;
    this.oCDCMigrator = new Migrator();
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________
  }

  ngOnInit() {
    this.clearFields();
    this.addFromValidations();
    this.getParticipantParams();
    this.getParticiantLogo();
  }

  public getParticiantLogo() {
    this.clearFields();
    this.loader.show();
    this.listingService.getParticipantLogoByParticipant(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            if (!AppUtility.isEmpty(restData)) {
              this.companyLogoBase64_ = restData.companyLogoBase64_;
              this.companyLogoContentType = restData.companyLogoContentType;
              this.companyLogoName = restData.companyLogoName;

              if (!AppUtility.isEmpty(restData.companyLogoBase64_)) {
                this.file_srcs.push(this.companyLogoBase64_.valueOf());
              }
            }
          }
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        });
  }

  public getParticipantParams() {
    this.clearFields();
    this.loader.show();
    this.listingService.getParticipantParamsByParticipant(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            if (!AppUtility.isEmpty(restData))
              this.fillApplicationSetupFromJson(restData);
          }
        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error.message;
          this.dialogCmp.statusMsg = this.errorMessage;
          this.dialogCmp.showAlartDialog('Error');
        });
  }

  fillApplicationSetupFromJson(data: any) {
    if (!AppUtility.isEmpty(data)) {
      for (let i: number = 0; i < data.length; i++) {
        switch (data[i].paramId) {
          case 1:
            this.reportHeaderline1 = data[i].paramValue;
            break;

          case 2:
            this.reportHeaderline2 = data[i].paramValue;
            break;

          case 3:
            this.reportHeaderline3 = data[i].paramValue;
            break;
          default:
            break;
        }
      }
    }
  }

  public initGrid(s: wjcGrid.FlexGrid) {
    AppUtility.printConsole('initGrid called');
    // create a GroupRow to show aggregates automatically
    let row = new wjcGrid.GroupRow();
    // add the new GroupRow to the grid's 'columnFooters' panel
    s.columnFooters.rows.push(row);
    // add a sigma to the header to show that this is a summary row
    s.bottomLeftCells.setCellData(0, 0, '\u03A3');
  }

  public clearFields() {
    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }
    this.loaded_records = 0;
    this.error_records = 0;
    this.fileSizeExceed = false;
    this.IsFileAttached = false;
    this.file_srcs = [];
    this.fileName_ = '';
    this.fileContentType_ = '';
    this.settlementDate = null;
    // if(!AppUtility.isEmpty(this.fileInput_)){
    //     this.fileInput_.value = '';
    //  }
  }

  public btnUpload(model: any, isValid: boolean) {
    // if (isValid) {

    if (this.file_srcs.length === 0) {
      this.IsFileAttached = true;
      this.loaded_records = this.error_records = 0;
      this.file_srcs = [];
      this.fileName_ = '';
      this.fileContentType_ = '';
      return;
    }
    this.loader.show();
    this.oCDCMigrator.date = this.transDate;
    this.oCDCMigrator.participantId = AppConstants.participantId;
    this.oCDCMigrator.requestFileBase64 = this.file_srcs[0];
    AppUtility.printConsole('btnUpload called: ' + JSON.stringify(this.oCDCMigrator));
    this.listingService.uploadClientsAssetsReconcilation(this.oCDCMigrator).subscribe(
      data => {
        this.loader.hide();
        AppUtility.printConsole('received data: ' + JSON.stringify(data));
        // this.formatResultData(data.cdcList);
        this.CdcReconcilationArray = data.cdcList;
        this.settlementDate = data.date;
      },
      err => {
        this.loader.hide();
        this.clearFields();
        this.errorMessage = err.message;
        this.file_srcs = [];
        if (!AppUtility.isEmpty(this.fileInput_)) {
          this.fileInput_.value = '';
        }
        this.dialogCmp.statusMsg = this.errorMessage;
        this.dialogCmp.showAlartDialog('Error');
      });
    // }
  }

  exportToPdf() {
    //  this.loader.show();
    //  wjcGridPDF.FlexGridPdfConverter.export(this.flexDetail, 'CDC-Client-Assets-Segregation.pdf');
    // this.loader.hide();
  }

  // public exportToPdf(){
  //     let doc = new wjcPDF.PdfDocument({
  //      ended: function (sender, args) {
  //         wjcPDF.saveBlob(args.blob, 'CDC-Reconcilation.pdf');
  //      }   
  //     });
  //    // doc.drawText("Ipsum.", 0, 30);
  //   wjcGridPDF.FlexGridPdfConverter.drawToPosition(this.flexDetail, doc, new wjcCore.Point(0, 10), null, null, {
  //     exportMode: wjcGridPDF.ExportMode.All,       
  //     maxPages: 10,
  //      styles: {
  //         cellStyle: {
  //            backgroundColor: '#ffffff',
  //            borderColor: '#c6c6c6'
  //         },
  //         headerCellStyle: {
  //            backgroundColor: '#eaeaea'
  //         }
  //      }
  //   });
  //   doc.end();
  //   }



  get groupBy(): string {
    return this._groupBy;
  }
  set groupBy(value: string) {
    if (this._groupBy != value) {
      this._groupBy = value;
      this._applyGroupBy();
    }
  }

  private _applyGroupBy() {
    if (this.flexDetail) {

      // get the collection view, start update
      var cv = this.flexDetail.collectionView;
      cv.beginUpdate();

      // clear existing groups
      cv.groupDescriptions.clear();

      // add new groups
      var groupNames = this.groupBy.split(','),
        groupDesc;
      if (groupNames.toString() != "") {
        for (var i = 0; i < groupNames.length; i++) {
          var propName = groupNames[i].toLowerCase();
          groupDesc = new wjcCore.PropertyGroupDescription(propName);
          cv.groupDescriptions.push(groupDesc);
        }
      }
      // done updating
      cv.endUpdate();
    }
  }

  // private _applyGroupBy() {
  //   var cv = this.CdcReconcilationArray;
  //   cv.beginUpdate();
  //   cv.groupDescriptions.clear();
  //   if (this.groupBy) {
  //     var groupNames = this.groupBy.split(',');
  //       for (var i = 0; i < groupNames.length; i++) {
  //           var groupName = groupNames[i];           
  //               var groupDesc = new wjcCore.PropertyGroupDescription(groupName);
  //               cv.groupDescriptions.push(groupDesc);           
  //        }
  //         cv.refresh();
  //     }
  //      cv.endUpdate();
  //   }



  fileChangeEvent(input) {
    AppUtility.printConsole('fileChangeEvent called');
    this.clearFields();
    this.file_srcs = [];
    if (!AppUtility.isEmpty(input.files[0])) {
      //  50 mb file size
      if (input.files[0].size > 50000000) {
        this.fileSizeExceed = true;
        return;
      } else {
        this.fileSizeExceed = false;
        this.fileContentType_ = input.files[0].type;
      }
    } else {
      this.file_srcs = [];
      return;
    }

    let fullPath = input.value;
    if (fullPath) {
      let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      let filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }
      this.fileName_ = filename;
    }
    let _validFileExtensions = ['.txt'];
    if (this.fileName_.length > 0) {
      let blnValid = false;
      for (let j = 0; j < _validFileExtensions.length; j++) {
        let sCurExtension = _validFileExtensions[j];
        if (this.fileName_.substr(this.fileName_.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          break;
        }
      }
      if (!blnValid) {
        let err: string = ('Sorry, ' + this.fileName_ + ' is invalid, allowed extension is: ' + _validFileExtensions.join(', ') + ' only.');
        this.dialogCmp.statusMsg = err;
        this.dialogCmp.showAlartDialog('Error');
        this.fileName_ = '';
        this.fileContentType_ = '';

        input.value = '';
        return;
      }
    }
    this.readFiles(input.files);
    this.fileInput_ = input;
    // this.selectedItem.documentContent = input;
    // this.selectedItem.documentContentType = this.fileContentType_;
    // this.selectedItem.documentName = this.fileName_;
  }

  readFiles(files, index = 0) {
    AppUtility.printConsole('readFiles called');
    // Create the file reader
    let reader = new FileReader();
    // If there is a file
    if (index in files) {
      // Start reading this file
      this.readFile(files[index], reader, (result) => {
        // After the callback fires do:
        this.file_srcs = [];
        // this.selectedItem.documentContent = result;
        this.file_srcs.push(result);
        this.readFiles(files, index + 1); // Read the next file;
      });
    } else {
      // When all files are done This forces a change detection
      this.changeDetectorRef.detectChanges();
    }
  }

  readFile(file, reader, callback) {
    AppUtility.printConsole('readFile called');
    // Set a callback funtion to fire after the file is fully loaded
    reader.onload = () => {
      // callback with the results
      callback(reader.result);
    };
    // Read the file
    reader.readAsDataURL(file);
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      fileUpload: ['', Validators.compose([Validators.required])],
      transDate: ['', Validators.compose([Validators.required])]

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
