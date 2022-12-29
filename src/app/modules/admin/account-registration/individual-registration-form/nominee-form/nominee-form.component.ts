import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountRegistrationService} from "../../account-registration.service";

@Component({
    selector: 'app-nominee-form',
    templateUrl: './nominee-form.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NomineeFormComponent implements OnInit {

    @Input() nominationFormGroup: FormGroup;
    @Input() savedFiles: any;
    @Output() fileChange = new EventEmitter();
    @Input() isApprovedByNCCPL: boolean = false;

    public filesObj: any = {};
    public identificationArr: any[] = [{uinId: "null", uinCode: "", uinDesc: ""},];
    public fileUploaderArr: any[] = [];
    public lttStatusArr: any[] = [{label: "Yes", value: "Y"}, {label: "No", value: "N"}];
    public relationArr: any[] = [{relativeId: "", relativeCode: "", relativeDesc: ""}];
    public docTypeArr: any[] = [{documentTypeId: "", documentTypeCode: "", documentTypeDesc: ""}];
    public fileObjTemp = {
        base64: "",
        name: "",
        type: "",
        size: 0,
        docType: null
    };
    public tempBase64: any = "";
    public docType: any = "";
    public cnicFrontObj: any = {};
    public empAddProofObj: any = {};
    public signatureProofObj: any = {};
    public zakatDeclationObj: any = {};
    public cnicBackObj: any = {};
    public addrProofObj: any = {};
    public cnicFrontBase64: any = "";
    public cnicBackBase64: any = "";
    public addrProofBase64: any = "";
    public empAddrProofBase64: any = "";
    public signProofBase64: any = "";
    public zakatDeclarationBase64: any = "";
    public zakatDocId: any = null;
    public cnicFrontDocId: any = null;
    public cnicBackDocId: any = null;
    public addrProofDocId: any = null;
    public empAddProofDocId: any = null;
    public signatureProofDocId: any = null;

    constructor(private _formBuilder: FormBuilder, private regService: AccountRegistrationService) {
        this.nominationFormGroup = this._formBuilder.group({});
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.savedFiles = changes.savedFiles.currentValue;
        this.getFiles();
    }

    ngOnInit(): void {
        this.getUINTypes();
        this.getRelations();
        this.getDocTypes();
    }

    getFiles() {
        this.filesObj = this.savedFiles;
        this.cnicFrontObj = this.filesObj.CNIC_FRONT;
        this.cnicBackObj = this.filesObj.CNIC_BACK;
        this.addrProofObj = this.filesObj.ADD_PROOF;
        this.empAddProofObj = this.filesObj.EMP_ADD_PROOF;
        this.signatureProofObj = this.filesObj.SIGNATURE_PROOF;
        this.zakatDeclationObj = this.filesObj.ZAKAAT_DECLARATION;

        this.cnicFrontBase64 = ((this.filesObj || {}).CNIC_FRONT || {}).base64;
        this.cnicBackBase64 = ((this.filesObj || {}).CNIC_BACK || {}).base64;
        this.addrProofBase64 = ((this.filesObj || {}).ADD_PROOF || {}).base64;
        this.empAddrProofBase64 = ((this.filesObj || {}).EMP_ADD_PROOF || {}).base64;
        this.signProofBase64 = ((this.filesObj || {}).SIGNATURE_PROOF || {}).base64;
        this.zakatDeclarationBase64 = ((this.filesObj || {}).ZAKAAT_DECLARATION || {}).base64;
    }

    getUINTypes() {
        this.regService.getUINtype().subscribe((data: any) => {
            this.identificationArr = data;
        });
    }

    getDocTypes() {
        this.regService.getDocumentTypes().subscribe((data: any) => {
            this.docTypeArr = data;
        });
    }

    getRelations() {
        this.regService.getNCCPLRelations().subscribe((data: any) => {
            this.relationArr = data;
        });
    }

    onSelectDoc(docTypeId: any) {
        this.setUploaderObj(docTypeId)
    }

    setUploaderObj(fileTypeId: any) {
        switch (fileTypeId) {
            case 1:
                this.updateFileUploadArr(fileTypeId, "cnicFrontObj", "cnicFrontBase64", "CINC Front Page");
                this.cnicFrontDocId = fileTypeId;
                break;
            case 2:
                this.updateFileUploadArr(fileTypeId, "cnicBackObj", "cnicBackBase64", "CINC Back Page");
                this.cnicBackDocId = fileTypeId;
                break;
            case 3:
                this.updateFileUploadArr(fileTypeId, "addrProofObj", "addrProofBase64", "Address Proof");
                this.addrProofDocId = fileTypeId;
                break;
            case 4:
                this.updateFileUploadArr(fileTypeId, "empAddProofObj", "empAddrProofBase64", "Proof of Employer Address");
                this.empAddProofDocId = fileTypeId;
                break;
            case 5:
                this.updateFileUploadArr(fileTypeId, "signatureProofObj", "signProofBase64", "Signature Proof");
                this.signatureProofDocId = fileTypeId;
                break;
            case 6:
                this.updateFileUploadArr(fileTypeId, "zakatDeclationObj", "zakatDeclarationBase64", "Zakaat Declaration Form");
                this.zakatDocId = fileTypeId;
                break;
            default:
                break;
        }
    }

    updateFileUploadArr(fileTypeId: any, fileTypeObj: any, fileTypeBase64: any, name: any) {
        let obj = {
            fileTypeObj,
            fileTypeBase64,
            name,
            id: fileTypeId,
        }
        let isExist = this.fileUploaderArr.findIndex((file: any) => file.id == fileTypeId);
        if (isExist == -1) {
            this.fileUploaderArr.push(obj);
        }
    }

    getRelevantBase64(baseKey: any) {
        switch (baseKey) {
            case 'cnicFrontBase64':
                return this.cnicFrontBase64;
            case 'cnicBackBase64':
                return this.cnicBackBase64;
            case 'addrProofBase64':
                return this.addrProofBase64;
            case 'empAddrProofBase64':
                return this.empAddrProofBase64;
            case 'signProofBase64':
                return this.signProofBase64;
            case 'zakatDeclarationBase64':
                return this.zakatDeclarationBase64;
        }
    }

    onFileSelected(element: any, fileTypeObj: any, fileTypeBase64: any,) {
        let file = element.files[0];
        this.getRelevantFileType(fileTypeObj, file);
        this.convertImgToBase64(file);
        setTimeout(() => {
            this.getRelevantFileType(fileTypeBase64, this.tempBase64);
            console.log('Base64File', this.tempBase64)
        }, 500);
    }

    triggerInputFile(eleId: any) {
        let elemnt = document.getElementById(eleId);
        elemnt?.click()
    }

    convertImgToBase64(file: any) {
        let reader = new FileReader();
        let vm = this;
        reader.onloadend = () => {
            vm.tempBase64 = reader.result;
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
        reader.readAsDataURL(file);
    }

    uploadImages() {
        let cnicFrontObj = Object.assign({}, this.fileObjTemp);
        cnicFrontObj.name = this.cnicFrontObj?.name;
        cnicFrontObj.size = this.cnicFrontObj?.size;
        cnicFrontObj.type = this.cnicFrontObj?.type;
        cnicFrontObj.docType = this.cnicFrontDocId;

        let cnicBackObj = Object.assign({}, this.fileObjTemp);

        cnicBackObj.name = this.cnicBackObj?.name;
        cnicBackObj.size = this.cnicBackObj?.size;
        cnicBackObj.type = this.cnicBackObj?.type;
        cnicBackObj.docType = this.cnicBackDocId;

        let addrProofObj = Object.assign({}, this.fileObjTemp);

        addrProofObj.name = this.addrProofObj?.name;
        addrProofObj.size = this.addrProofObj?.size;
        addrProofObj.type = this.addrProofObj?.type;
        addrProofObj.docType = this.addrProofDocId;


        let empAddProofObj = Object.assign({}, this.fileObjTemp);

        empAddProofObj.name = this.empAddProofObj?.name;
        empAddProofObj.size = this.empAddProofObj?.size;
        empAddProofObj.type = this.empAddProofObj?.type;
        empAddProofObj.docType = this.empAddProofDocId;

        let signatureProofObj = Object.assign({}, this.fileObjTemp);

        signatureProofObj.name = this.signatureProofObj?.name;
        signatureProofObj.size = this.signatureProofObj?.size;
        signatureProofObj.type = this.signatureProofObj?.type;
        signatureProofObj.docType = this.signatureProofDocId;

        let zakatDeclationObj = Object.assign({}, this.fileObjTemp);

        zakatDeclationObj.name = this.zakatDeclationObj?.name;
        zakatDeclationObj.size = this.zakatDeclationObj?.size;
        zakatDeclationObj.type = this.zakatDeclationObj?.type;
        zakatDeclationObj.docType = this.zakatDocId;


        cnicFrontObj.base64 = this.cnicFrontBase64 || "";
        cnicBackObj.base64 = this.cnicBackBase64 || "";
        addrProofObj.base64 = this.addrProofBase64 || "";
        empAddProofObj.base64 = this.empAddrProofBase64 || "";
        signatureProofObj.base64 = this.signProofBase64 || "";
        zakatDeclationObj.base64 = this.zakatDeclarationBase64 || "";
        this.filesObj = {};
        this.filesObj = {
            CNIC_FRONT: cnicFrontObj,
            CNIC_BACK: cnicBackObj,
            ADD_PROOF: addrProofObj,
            EMP_ADD_PROOF: empAddProofObj,
            SIGNATURE_PROOF: signatureProofObj,
            ZAKAAT_DECLARATION: zakatDeclationObj,
        }

        this.fileChange.emit(this.filesObj);
    }

    getRelevantFileType(key: any, file: any) {
        switch (key) {
            case 'cnicFrontObj':
                return this.cnicFrontObj = file;
            case 'cnicFrontBase64':
                return this.cnicFrontBase64 = file;
            case 'cnicBackObj':
                return this.cnicBackObj = file;
            case 'cnicBackBase64':
                return this.cnicBackBase64 = file;
            case 'addrProofBase64':
                return this.addrProofBase64 = file;
            case 'addrProofObj':
                return this.addrProofObj = file;
            case 'empAddProofObj':
                return this.empAddProofObj = file;
            case 'signatureProofObj':
                return this.signatureProofObj = file;
            case 'zakatDeclationObj':
                return this.zakatDeclationObj = file;
            case 'empAddrProofBase64':
                return this.empAddrProofBase64 = file;
            case 'signProofBase64':
                return this.signProofBase64 = file;
            case 'zakatDeclarationBase64':
                return this.zakatDeclarationBase64 = file;
        }
    }
}
