import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcInput from '@grapecity/wijmo.input';
import * as wjcGridXlsx from '@grapecity/wijmo.grid.xlsx';
import * as pdf from '@grapecity/wijmo.pdf';
import * as gridPdf from '@grapecity/wijmo.grid.pdf';




import { data } from 'autoprefixer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppUtility } from './../../../../../../app.utility';
import { Component, ViewChild , OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AppConstants } from "app/app.utility";
import { ListingService } from "app/services/listing.service";
import { DialogCmp } from '../../../user-site/dialog/dialog.component';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen/loader-screen.service';
import { ComboItem } from 'app/models/combo-item';



@Component({
    selector : 'coupon-payment-detail-rpt',
    templateUrl : './coupon-payment-rpt.html'
})
export class CouponPaymentDetailRpt implements OnInit{
    
    scaleMode = gridPdf.ScaleMode.ActualSize;
    orientation = pdf.PdfPageOrientation.Landscape;
    exportMode = gridPdf.ExportMode.All;

    includeColumnHeader: boolean = true;

    dateFormat = AppConstants.DATE_FORMAT;
    fromDate : Date;
    toDate : Date;
    lang: any;
    symbol : any;
    symbolExchangeMktList : any[];
    clientList : any[];
    errorMessage : string;
    exhangeId : number = 0;
    form : FormGroup;
    pdf : boolean;
    couponPaymentDetailList : any[];


    @ViewChild('dialogCmp') dialogCmp: DialogCmp;
    @ViewChild('flexGrid', { static: false }) flexGrid: wjcGrid.FlexGrid;

    constructor(private translate: TranslateService , private listingService : ListingService , private loader : FuseLoaderScreenService , public _fb :FormBuilder){
          //_______________________________for ngx_translate_________________________________________

      this.lang=localStorage.getItem("lang");
      if(this.lang==null){ this.lang='en'}
      this.translate.use(this.lang)
      //______________________________for ngx_translate__________________________________________

    }

    ngOnInit(): void {
        this.init();
        this.loadSymbolMarketExchangeList();
        this.getClientList();
        this.addFormValidations();
    }

    init(){
        this.symbol = null;
        this.couponPaymentDetailList = [];
        this.symbolExchangeMktList = [];
        this.clientList = [];
        this.fromDate = new Date();
        this.toDate = new Date();
    }

    addFormValidations(){
        this.form = this._fb.group({
            security : ['',Validators.compose([Validators.required])],
            clientCode : ['',Validators.compose([Validators.required])],
            fromDate : ['',Validators.compose([Validators.required])],
            toDate : ['',Validators.compose([Validators.required])]
        })
    }

    loadSymbolMarketExchangeList(){

        if(AppUtility.isValidVariable(AppConstants.participantId)){
            this.loader.show();
            this.listingService.getParticipantSecurityExchanges(AppConstants.participantId).subscribe(resData => {
    
                this.loader.hide();
                if(!AppUtility.isEmptyArray(resData)){
                   this.updateSecurityList(resData);
                } else {
                   this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                   this.dialogCmp.statusMsg = this.errorMessage;
                   this.dialogCmp.showAlartDialog('Error');
                }
            }, error => {
                this.loader.hide();
                if(error.message){
                    this.errorMessage = error.message;
                } else {
                    this.errorMessage = error;
                }

                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');

            })
        }
    }

    
    onSecurityChange(security){
        this.splitSymbolExchMkt(security);
    }

    splitSymbolExchMkt(security) {

          let strArr: any[];
  
           if(AppUtility.isValidVariable(security) && security !== AppConstants.ALL_VAL) {
            strArr = AppUtility.isSplitSymbolMarketExchange(security);
            this.symbol = (typeof strArr[0] === 'undefined') ? '' : strArr[0];
           } else {
            this.symbol = AppConstants.ALL_VAL;
           }
       
      }
  

    updateSecurityList(data){
       
       
        if(AppUtility.isValidVariable(data)){
            this.symbolExchangeMktList = data;
            for(let i = 0 ; i < data.length ; ++i){
                this.symbolExchangeMktList[i].value = this.symbolExchangeMktList[i].displayName_; 
            }
        } 

        const cmbItem =  { displayName_ : AppConstants.ALL_STR , value : AppConstants.ALL_VAL };
        this.symbolExchangeMktList.unshift(cmbItem);

    }

    getClientList(){
        this.loader.show();
        this.clientList = [];
        if(AppUtility.isValidVariable(AppConstants.participantId)){
            this.listingService.getClientListByExchangeBroker(AppConstants.exchangeId,AppConstants.participantId,true,true).subscribe((resData) => {
                this.loader.hide();
                if(!AppUtility.isEmptyArray(resData)){
                    this.clientList = resData;
                    let cmbItem = { displayValue_ : AppConstants.ALL_STR , clientCode : AppConstants.ALL_VAL };
                    this.clientList.unshift(cmbItem);

                } else {
                    this.errorMessage = AppConstants.MSG_NO_DATA_FOUND;
                    this.dialogCmp.statusMsg = this.errorMessage;
                    this.dialogCmp.showAlartDialog('Error');
                }
            }, error => {
                this.loader.hide();
                if(error.message){
                    this.errorMessage = error.message;
                } else {
                    this.errorMessage = error;
                }

                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
            })

        }
    }

    getCouponPaymentDetail(value,isValid){
        this.couponPaymentDetailList = [];
        const date = value.toDate.toLocaleDateString();
        if(isValid){
           const couponPayload = {
              Date : date,
              Participant_Code : AppConstants.participantCode
           }
           this.listingService.getCouponPaymentDetail(couponPayload).subscribe((resData) => {
              if(!AppUtility.isEmptyArray(resData)){
                 this.filterCouponPaymentDetailList(resData,value);
              } else{
                this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
                this.dialogCmp.showAlartDialog('Error');
              }
           }, error => {
               if(error.message){
                this.dialogCmp.statusMsg = error.message;
              } else {
                this.dialogCmp.statusMsg = error;
              }
              this.dialogCmp.showAlartDialog('Error');
           })
        }
    }


    filterCouponPaymentDetailList(data,selectedValues){
       if(AppUtility.isValidVariable(data)){
           if(selectedValues.security === AppConstants.ALL_VAL && selectedValues.clientCode === AppConstants.ALL_VAL){
              this.couponPaymentDetailList = data;
              return;
           }
           
           this.couponPaymentDetailList = data.filter((coupon) => {
               return this.symbol === coupon.symbol || selectedValues.clientCode === coupon.accountCode;
           })
           
           if(AppUtility.isEmptyArray(this.couponPaymentDetailList)){
              this.dialogCmp.statusMsg = AppConstants.MSG_NO_DATA_FOUND;
              this.dialogCmp.showAlartDialog('Error');
              return;
           }


       }
    }

    exportExcel() {
        wjcGridXlsx.FlexGridXlsxConverter.save(this.flexGrid, { includeColumnHeaders: this.includeColumnHeader, includeCellStyles: false }, 'Coupon Payment Detail.xlsx');
    }




    exportPDF() {
        gridPdf.FlexGridPdfConverter.export(this.flexGrid, 'Coupon Payment Detail' + new Date().toLocaleString() + '.pdf', {
            maxPages: 10,
            exportMode: this.exportMode,
            scaleMode: this.scaleMode,
            documentOptions: {
                pageSettings: {
                    layout: this.orientation
                },
                header: {
                    declarative: {
                        text: '\t&[Page]\\&[Pages]'
                    }
                },
                footer: {
                    declarative: {
                        text: '\t&[Page]\\&[Pages]'
                    }
                }
            },
            styles: {
                cellStyle: {
                    backgroundColor: '#ffffff',
                    borderColor: '#c6c6c6'
                },
                altCellStyle: {
                    backgroundColor: '#f9f9f9'
                },
                groupCellStyle: {
                    backgroundColor: '#dddddd'
                },
                headerCellStyle: {
                    backgroundColor: '#eaeaea'
                }
            }
        });
    }


}