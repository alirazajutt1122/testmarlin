'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { ChartOfAccount } from 'app/models/chart-of-account';
import { GLFamily } from 'app/models/gl-family';
import { GLParams } from 'app/models/gl-params';
import { Participant } from 'app/models/participant';
import { SecpAccount } from 'app/models/secp-account';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { DialogCmp } from '../../user-site/dialog/dialog.component';


declare var jQuery: any;

@Component({
  selector: 'chart-of-account',
  templateUrl: './chart-of-account.html',
  encapsulation: ViewEncapsulation.None,
})
export class ChartOfAccountCmp implements OnInit {
  public myForm: FormGroup;
  private _isResized = false;

  //claims: any;

  dateFormat: string = AppConstants.DATE_FORMAT;

  itemsList: any[] = [];
  data: any;
  parentItem: ChartOfAccount;
  selectedItem: ChartOfAccount;
  errorMessage: string;
  crSecondaryCode: String = '';
  dbSecondaryCode: String = '';
  crSecpAccountId: number = null;
  dbSecpAccountId: number = null;
  childItemsCheckList = [];
  public hideForm = false;
  public isSubmitted: boolean;
  public isEditing: boolean = false;
  public headLevelLength: number = 0;

  codeMinLengthCheck: boolean = false;
  codeMaxLengthCheck: boolean = false;

  private _pageSize = 0;


  map = {};
  node: any;
  roots = [];
  nodes = [];

  glParams: GLParams;
  headLevelDetails: any[] = [];
  secpAccountList: any[];

  @ViewChild('flexGrid') flexGrid: wjcGrid.FlexGrid;
  @ViewChild('inputCode') inputCode: wjcInput.InputMask;
  @ViewChild('inputParentCode') inputParentCode: wjcInput.InputMask;
  @ViewChild('inputDesc') inputDesc: wjcInput.InputMask;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  lang: string;

  constructor(private appState: AppState, public userService: AuthService2, private listingService: ListingService, private _fb: FormBuilder, private translate: TranslateService,private loader : FuseLoaderScreenService) {
    this.initForm();
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    //this.claims = this.authService.claims;
    window.addEventListener('resize', () => {
      console.log('resize');
      this._isResized = true;
    });

    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________

  }

  /***************************************
  Flexgrid cell multiple line / row resize
  **************************************/
  initialized(flexGrid) {
    console.log('gridInitialized');
    setTimeout(() => {
      flexGrid.autoSizeRows();
    }, 100);
  }

  loadedRows(flexGrid) {
    console.log('gridLoadedRows');
    if (flexGrid.isInitialized) {
      flexGrid.autoSizeRows();
    }
  }

  cellEditEnded(flexGrid, e) {
    console.log('cellEditEnded');
    flexGrid.autoSizeRow(e.row);
  }

  resizedColumn(flexGrid, e) {
    console.log('resizedColumn');
    flexGrid.autoSizeRows();
  }

  updatedLayout(flexGrid) {
    console.log('updatedLayout');
    if (this._isResized) {
      this._isResized = false;
      console.log('Resize on updatedLayout');
      flexGrid.autoSizeRows();
    }
  }
  /***************************************
  Flexgrid cell multiple line / row resize
  **************************************/

  ngOnInit() {

    // Add Form Validations
    this.addFromValidations();
    this.populateChartOfAccountList();
    this.getGLParams();
    this.getHeadLevelDetails();
    this.populateSecpAccountList();
  }

  ngAfterViewInit() {

    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      $("#myForm input[name=code]").attr("maxlength", self.headLevelLength);
      //$('#code').keyup(validateMaxLength);
      $('#code').keyup(hideLengthCheck);

      function hideLengthCheck() {
        self.codeMinLengthCheck = true;
        self.codeMaxLengthCheck = true;
      }
      // function validateMaxLength()
      // {            
      //         // var code = $("#myForm input[name=code]").val();
      //         // AppUtility.printConsole("text value: "+ code); 
      //         // if ( code.length > self.headLevelLength) {
      //         //   var newVal = code.substr(0, self.headLevelLength); 
      //         //   $("#myForm input[name=code]").val(newVal);
      //         // }
      //         //$('#code').val('bla');

      // }
      (<wjcCore.CollectionView>self.flexGrid.collectionView).editItem(self.flexGrid.collectionView.currentItem);
    });



  }

  /*********************************
 *      Public & Action Methods
 *********************************/
  initForm() {
    this.clearFields();
    this.data = [];
    this.itemsList = [];
    this.glParams = new GLParams();

  }
  public clearFields() {
    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }
    this.parentItem = new ChartOfAccount();
    this.selectedItem = new ChartOfAccount();
    this.hideForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.crSecondaryCode = '';
    this.dbSecondaryCode = '';
    this.crSecpAccountId = null;
    this.dbSecpAccountId = null;
  }

  updateFieldsAfterAdd(node) {

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
    AppUtility.printConsole("onCancelAction is called");
    (<wjcCore.CollectionView>this.flexGrid.collectionView).cancelEdit();
    this.hideForm = false;
  }

  public onNewAction() {
    debugger
    this.clearFields();
    let self = this;
    this.hideForm = true;
    this.isEditing = false;
    var rowIndex = this.flexGrid.selection.row;

    if (AppUtility.isValidVariable(this.flexGrid.rows[rowIndex])) {

      this.parentItem = this.flexGrid.rows[rowIndex].dataItem;
      AppUtility.printConsole("Parent item: " + JSON.stringify(this.parentItem));
      // check max head leve 
      let nextHeadlevel = this.parentItem.headLevel.valueOf() + 1;
      this.headLevelLength = this.getHeadLevelLength(nextHeadlevel);
      //this.setCodeMaxLength(this.headLevelLength); 
      AppUtility.printConsole("Head level length: " + this.headLevelLength);
      if (this.headLevelLength > 0 && this.checkMaxHeadLevel(nextHeadlevel)) {
        this.showModal();
      }
    }
  }

  private populateSecpAccountList() {
    debugger
    this.loader.show();
    AppUtility.printConsole("Getting SecpAccountList...");
    this.listingService.getSecpAccountList()
      .subscribe(
        restData => {
          debugger
          this.loader.hide();
          if (AppUtility.isEmptyArray(restData)) {
            this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          }
          else {
            this.secpAccountList = restData;
            for (var i = 0; i < this.secpAccountList.length; i++) {
              this.secpAccountList[i].description = this.secpAccountList[i].description + ' - ' + this.secpAccountList[i].accountCode;
            }
            if (!this.isEditing) {
              let c: SecpAccount = new SecpAccount();
              c.Id = AppConstants.PLEASE_SELECT_VAL;
              c.description = AppConstants.PLEASE_SELECT_STR;
              this.secpAccountList.unshift(c);
              this.selectedItem.dbSecpAccount = this.secpAccountList[0];
              this.selectedItem.crSecpAccount = this.secpAccountList[0];
            }
          }

        },
        error => {
          this.loader.hide();
          this.errorMessage = <any>error;
        });
  }

  public onDbSecpHeadChangeEvent(selectedDrSecpHead) {
    debugger
    /*if (AppUtility.isEmpty(selectedSecpAccountCode))
      this.selectedItem.secondaryCode = '';
    else
      this.selectedItem.secondaryCode = selectedSecpAccountCode;*/
    if (!AppUtility.isEmpty(selectedDrSecpHead)) {
      var dbSecpAccountObj: SecpAccount = new SecpAccount();
      for (dbSecpAccountObj of this.secpAccountList) {
        if (selectedDrSecpHead.Id != null) {
          if (dbSecpAccountObj.Id == selectedDrSecpHead.Id) {
            this.dbSecpAccountId = dbSecpAccountObj.Id;
            this.dbSecondaryCode = dbSecpAccountObj.accountCode;
            AppUtility.printConsole('debit secondaryCode: ' + this.dbSecondaryCode);
            break;
          }
        }
        else {
          if (dbSecpAccountObj.Id == selectedDrSecpHead) {
            this.dbSecpAccountId = dbSecpAccountObj.Id;
            this.dbSecondaryCode = dbSecpAccountObj.accountCode;
            AppUtility.printConsole('debit secondaryCode: ' + this.dbSecondaryCode);
            break;
          }
        }
      }
    }
    //debugger
    //this.selectedItem.secpHead = selectedSecpHead;
    //this.myForm.get('secpHead').setValue(selectedSecpHead); 
    /*if(!AppUtility.isEmpty(this.selectedItem.secondaryCode)) {
      this.myForm.get('secondarycode').setValue(this.selectedItem.secondaryCode);
    }*/
  }

  public onCrSecpHeadChangeEvent(selectedCrSecpHead) {
    debugger
    if (!AppUtility.isEmpty(selectedCrSecpHead)) {
      var crSecpAccountObj: SecpAccount = new SecpAccount();
      for (crSecpAccountObj of this.secpAccountList) {
        if (selectedCrSecpHead.Id != null) {
          if (crSecpAccountObj.Id == selectedCrSecpHead.Id) {
            this.crSecpAccountId = crSecpAccountObj.Id;
            this.crSecondaryCode = crSecpAccountObj.accountCode;
            AppUtility.printConsole('credit secondaryCode: ' + this.crSecondaryCode);
            break;
          }
        }
        else {
          if (crSecpAccountObj.Id == selectedCrSecpHead) {
            this.crSecpAccountId = crSecpAccountObj.Id;
            this.crSecondaryCode = crSecpAccountObj.accountCode;
            AppUtility.printConsole('credit secondaryCode: ' + this.crSecondaryCode);
            break;
          }
        }
      }
    }
  }

  public onEditAction() {
    debugger
    this.clearFields();
    this.hideForm = true;
    this.isEditing = true;
    let rowIndex = this.flexGrid.selection.row;
    let parentIndex = rowIndex - 1;
    let item = JSON.parse(JSON.stringify(this.flexGrid.rows[rowIndex].dataItem));
    this.parentItem = JSON.parse(JSON.stringify(this.flexGrid.rows[parentIndex].dataItem));
    //this.selectedItem.partialCode=this.flexGrid.rows[rowIndex].dataItem.glCode;
    AppUtility.printConsole("parent item: " + JSON.stringify(this.parentItem));
    if (!AppUtility.isEmpty(item)) {

      let headlevel = item.headLevel;
      this.headLevelLength = this.getHeadLevelLength(headlevel);
      if (this.headLevelLength > 0) {
        let endIndex = item.glCode.length;
        let startIndex = endIndex - this.headLevelLength;
        item.partialCode = item.glCode.substring(startIndex, endIndex);
        this.selectedItem = item;
        //AppUtility.printConsole("code: "+this.selectedItem.glCode+",start: "+startIndex+", endIndex: "+endIndex+", partialCode: "+ JSON.stringify(this.selectedItem.partialCode)); 
        if (!AppUtility.isEmpty(this.selectedItem.dbSecpAccount)) {
          this.dbSecpAccountId = this.selectedItem.dbSecpAccount.Id;
          this.dbSecondaryCode = this.selectedItem.dbSecpAccount.accountCode;
        }

        if (!AppUtility.isEmpty(this.selectedItem.crSecpAccount)) {
          this.crSecpAccountId = this.selectedItem.crSecpAccount.Id;
          this.crSecondaryCode = this.selectedItem.crSecpAccount.accountCode;
        }

        this.inputDesc.focus();

        this.showModal();
      }

    }
  }


  public showModal() {
    jQuery("#add_new").modal("show");
  }

  public onSaveAction(model: any, isValid: boolean) {
    debugger
    this.isSubmitted = true;
    AppUtility.printConsole("onSave Action, isValid: " + isValid + ", partialCode: '" + this.selectedItem.partialCode + "'");
    this.codeMinLengthCheck = true;
    this.codeMinLengthCheck = true;
    if (this.selectedItem.partialCode.toString().trim().length == 0) {
      this.selectedItem.partialCode = this.selectedItem.partialCode.toString().trim();
      isValid = false;
    } else {
      // check min length 
      if (this.selectedItem.partialCode.length < this.headLevelLength) {
        isValid = false;
        this.codeMinLengthCheck = false;
      } else {
        this.codeMinLengthCheck = true;
      }
      //check max length 
      if (this.selectedItem.partialCode.length > this.headLevelLength) {
        isValid = false;
        this.codeMaxLengthCheck = false;
      } else {
        this.codeMaxLengthCheck = true;
      }
    }
    if (isValid) {
      debugger
      this.selectedItem
      if (this.isEditing) {
        AppUtility.printConsole("Edit ...");

        this.fillDataToSelectedItem();
        AppUtility.printConsole("Chart of account: " + JSON.stringify(this.selectedItem));
        this.listingService.updateChartOfAccount(this.selectedItem).subscribe(
          data => {
            this.isSubmitted = false;
            //this.fillFormFromJSON(this.selectedItem, data, true);
            (<wjcCore.CollectionView>this.flexGrid.collectionView).commitEdit();
            AppUtility.printConsole("Data updated: " + data);
            this.populateChartOfAccountList();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
            this.dialogCmp.showAlartDialog('Success');
          },
          error => {
            this.errorMessage = error;
            this.hideForm = true;
            (<wjcCore.CollectionView>this.flexGrid.collectionView).cancelEdit();
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
      else {
        AppUtility.printConsole("New  ...");
        this.fillDataToSelectedItem();
        AppUtility.printConsole("Chart of account: " + this.selectedItem);
        this.listingService.saveChartOfAccount(this.selectedItem).subscribe(
          data => {
            this.isSubmitted = false;
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = [];
            //this.addNewDataItemToList(data); 
            this.populateChartOfAccountList();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');
          },
          err => {
            this.hideForm = true;
            this.errorMessage = err;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
    }
  }

  /***************************************
 *          Private Methods
 **************************************/

  private addNewDataItemToList(node) {

    // adding newly added item to list 
    if (AppUtility.isValidVariable(this.itemsList[this.map[node.parentChartOfAccountId]])) {
      this.itemsList[this.map[node.parentChartOfAccountId]].children.push(node);
    }

    this.flexGrid.invalidate();
    this.flexGrid.refresh();
  }
  private addEditDataItemToList(node) {
    // var rowIndex = this.flexGrid.selection.row;
    // this.parentItem = <ChartOfAccount> this.flexGrid.rows[rowIndex].dataItem;
  }
  private fillDataToSelectedItem() {
    debugger
    this.selectedItem.participant = new Participant();
    this.selectedItem.participant.participantId = AppConstants.participantId;

    if (!this.isEditing) { // New case 
      this.selectedItem.chartOfAccountId = null;
      this.selectedItem.parentChartOfAccountId = this.parentItem.chartOfAccountId;
      this.selectedItem.glFamily = new GLFamily();

      this.selectedItem.glFamily = this.parentItem.glFamily;
      this.selectedItem.headLevel = Number(this.parentItem.headLevel) + 1;
      this.selectedItem.glCode = this.parentItem.glCode.toString() + this.selectedItem.partialCode.toString();
      this.selectedItem.leaf = this.isLeafNode(this.selectedItem.headLevel);
      //this.selectedItem.ncb = this.parentItem.ncb.toString();
      //this.selectedItem.lcb = this.parentItem.lcb.toString();

    }
    var dbSecpAccountObj: SecpAccount = new SecpAccount();
    for (dbSecpAccountObj of this.secpAccountList) {
      if (dbSecpAccountObj.Id == this.dbSecpAccountId) {
        debugger
        this.selectedItem.dbSecpAccount = null
        // this.selectedItem.dbSecpAccount = new SecpAccount();
        // this.selectedItem.dbSecpAccount.Id = dbSecpAccountObj.Id;
        // this.selectedItem.dbSecpAccount.accountCode = dbSecpAccountObj.accountCode;
        // this.selectedItem.dbSecpAccount.description = dbSecpAccountObj.description;
        this.dbSecondaryCode = dbSecpAccountObj.accountCode;
        AppUtility.printConsole('debit secondaryCode: ' + this.dbSecondaryCode);
        break;
      }
    }

    var crSecpAccountObj: SecpAccount = new SecpAccount();
    for (crSecpAccountObj of this.secpAccountList) {
      if (crSecpAccountObj.Id == this.crSecpAccountId) {
        debugger
        this.selectedItem.crSecpAccount = null
        // this.selectedItem.crSecpAccount = new SecpAccount();
        // this.selectedItem.crSecpAccount.Id = crSecpAccountObj.Id;
        // this.selectedItem.crSecpAccount.accountCode = crSecpAccountObj.accountCode;
        // this.selectedItem.crSecpAccount.description = crSecpAccountObj.description;
        this.crSecondaryCode = crSecpAccountObj.accountCode;
        AppUtility.printConsole('credit secondaryCode: ' + this.crSecondaryCode);
        break;
      }
    }
  }
  private fillFormFromJSON(st: ChartOfAccount, data: any, isEdit: boolean = false) {
    //st = new FiscalYear(); 
    if (!AppUtility.isEmpty(data)) {
      //   st.fiscalYearId = data.fiscalYearId;
      //   st.fiscalCode = data.fiscalCode;
      //   st.startDate = new Date(data.startDate);
      //   st.endDate = new Date(data.endDate);
      //   st.yearClosed = data.yearClosed;
      //   st.status = new FiscalYear().getYearClosedStr(data.yearClosed);
      //   st.participant = data.participant; 
    }

    // this.flexGrid.collectionView.currentItem = st;
    // this.flexGrid.refresh();
  }

  private fillFormFromSelectedItem(data) {
    if (!AppUtility.isEmpty(data)) {
      //   this.selectedItem.fiscalYearId = data.fiscalYearId;
      //   this.selectedItem.fiscalCode = data.fiscalCode;
      //   this.selectedItem.startDate = new Date(wjcCore.Globalize.format(data.startDate, this.dateFormat));
      //   this.selectedItem.endDate = new Date(data.endDate);
      //   this.selectedItem.yearClosed = data.yearClosed;

      //   this.populateStatusList(data.yearClosed); 

      //   this.inputStartDate.refresh();
      //   this.inputStartDate.text=wjcCore.Globalize.format(data.startDate, this.dateFormat);
      //   this.inputStartDate.value=data.startDate;


    }
  }

  private populateChartOfAccountList() {
    this.loader.show();
    AppUtility.printConsole("Getting list...");
    this.listingService.getChartOfAccountList(AppConstants.participantId)
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
          this.errorMessage = <any>error;
        });
  }

  private getGLParams() {
    AppUtility.printConsole("Getting GL Params");
    this.listingService.getGLParams(AppConstants.participantId)
      .subscribe(
        restData => {
          if (AppUtility.isEmptyArray(restData)) {
            //this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            this.glParams = <GLParams>restData;
          }
        },
        error => {
          this.errorMessage = <any>error;
        });
  }
  private getHeadLevelDetails() {
    AppUtility.printConsole("Getting head level details");
    this.listingService.getHeadLevelDetails(AppConstants.participantId)
      .subscribe(
        restData => {
          if (AppUtility.isEmptyArray(restData)) {
            //this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
          } else {
            this.headLevelDetails = restData;
          }
        },
        error => {
          this.errorMessage = <any>error;
        });
  }
  updateData(nodes) {
    debugger
    let node;
    this.map = [];
    this.roots = [];
    this.nodes = nodes;

    for (var i = 0; i < nodes.length; i += 1) {
      node = nodes[i];
      
      node.glCodeDisplayName_ = node.glDesc + ' - [' + node.glCode + ']' ;
      
      node.children = [];
      this.map[node.chartOfAccountId] = i; // use map to look-up the parents
      if (node.parentChartOfAccountId != null && node.parentChartOfAccountId > 0) {
        //AppUtility.printConsole("Node: id:"+ node.chartOfAccountId+", parent:"+node.parentChartOfAccountId+", desc: "+node.glDesc);      
        //AppUtility.printConsole("parent node index: "+map[node.parentChartOfAccountId]); 
        if (AppUtility.isValidVariable(nodes[this.map[node.parentChartOfAccountId]])) {
          nodes[this.map[node.parentChartOfAccountId]].children.push(node);
        }
      } else {
        this.roots.push(node);
      }
    }
    AppUtility.printConsole(this.roots); // <-- there's tree 
    debugger
    this.itemsList = this.roots;


  }


  getChildItems(startIndex, parentId) {
    let childItems = [];
    let index = 0;
    for (let i = startIndex; i < this.data.length; i++) {
      if (this.data[startIndex].parentChartOfAccountId == parentId) {
        childItems[index] = this.data[i];
        index += 1;
      }

    } // For loop 
    return childItems;
  }
  updateChildItemsList(id) {

    let index = this.childItemsCheckList.length;
    this.childItemsCheckList[index] = id;
  }

  checkChildItemsList(id): boolean {

    for (let i = 0; i < this.childItemsCheckList.length; i++) {
      if (id == this.childItemsCheckList[i].chartOfAccountId) {
        return true;
      }
    }
    return false;
  }
  checkMaxHeadLevel(headLevel): boolean {
    if (!AppUtility.isValidVariable(this.glParams)) {
      this.dialogCmp.statusMsg = "Maximum head level is not defined in the system";
      this.dialogCmp.showAlartDialog('Notification');
      return false;
    }
    if (headLevel > this.glParams.coaLevels) {
      this.dialogCmp.statusMsg = "Maximum head level is " + this.glParams.coaLevels;
      this.dialogCmp.showAlartDialog('Notification');
      return false;
    } else {
      return true;
    }
  }
  getHeadLevelLength(headLevel): number {
    let headLevelLength: number = 0;
    if (!AppUtility.isValidVariable(this.headLevelDetails)) {
      this.dialogCmp.statusMsg = "Head level details not found in the system";
      this.dialogCmp.showAlartDialog('Warning');
    } else {
      for (let i = 0; i < this.headLevelDetails.length; i++) {
        if (this.headLevelDetails[i].headLevel == headLevel) {
          return this.headLevelDetails[i].codeLength;
        }
      }
    }
    if (headLevelLength == 0) {
      this.dialogCmp.statusMsg = "Code length is not defined for head level: " + headLevel;
      this.dialogCmp.showAlartDialog('Warning');
    }
    return headLevelLength;
  }

  isLeafNode(headLevel): boolean {
    let isLeaf: boolean = false;
    if (AppUtility.isValidVariable(this.headLevelDetails) && this.headLevelDetails.length > 0) {
      let lastIndex: number = this.headLevelDetails.length - 1;

      if (headLevel == this.headLevelDetails[lastIndex].headLevel) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  validateCode(c: FormControl) {
    return c.value > 0 && c.value < 100 ? null : { valid: false }
  };
  private addFromValidations() {
    this.myForm = this._fb.group({
      parentCode: [''],
      code: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      desc: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      ncb: [''],
      lcb: [''],
      // dbSecondarycode: [''],
      // dbSecphead: [''],
      // crSecondarycode: [''],
      // crSecphead: [''],
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

