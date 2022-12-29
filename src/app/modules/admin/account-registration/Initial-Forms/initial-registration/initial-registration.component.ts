import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AccountRegistrationService} from "../../account-registration.service";
import {ActivatedRoute} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {User} from "../../../../../../app/core/user/user.types";

@Component({
    selector: 'initial-registration',
    templateUrl: './initial-registration.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InitialRegistrationComponent implements OnInit, OnDestroy {
    accountForm: FormGroup;
    user: User; 
    public initialRegFormGroup: FormGroup;
    public identificationTypes: any[];
    public relationTypes: any[];
    public relationProofBase64: any;
    public IBANProofBase64: any;
    public tempBase64: any;
    public IBANProofObj: any;
    public relationProofObj: any;
    private currentParticipant = {participantId: null, participantName: ''};
    public BackUrl: string = '';
    private subscription: Subscription = new Subscription();
    public name1 = ""
    public currentDate = new Date();
    allActiveParticipants: any;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private accountRegistrationService: AccountRegistrationService,
        private route: ActivatedRoute,
        private toast: ToastrService,
        private cd: ChangeDetectorRef
    ) {

         
        this.user = JSON.parse(localStorage.getItem("user"));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
         
        this.initialRegFormGroup = this._formBuilder.group({
            participantId: ['', Validators.required],
            clientName: [this.user.name, Validators.required],
            cnicIssueDate: [
                new Date().toISOString().slice(0, 10),
                Validators.required,
            ],
            email: [this.user.email, Validators.email],
            ibanNumber: ['', Validators.required],
            identificationType: [1, Validators.required],
            mobileNumber: [this.user.mobileNumber, Validators.required],
            relativeCnic: [''],
            relationWithMobileNo: [1, Validators.required],
            residentialStatus: ['01'],
            relationProofDummy: [],
            uin: ['', [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
        });
        this.identificationTypes = [{uinId: null, uinCode: '', uinDesc: ''}];
        this.relationTypes = [
            {relativeId: null, relativeCode: '', relativeDesc: ''},
        ];
        
         
        this.getActiveParticipants();
        this.processIdentificationTypes();
        this.processRelationTypes();
        //this.getRecipientData();

    }

    ngAfterViewInit() {
        //this.processIdentificationTypes();
        //this.processRelationTypes();
        //this.getRecipientData();

    }
   
    onIdentificationChange(val: any) {
        this.updateValidations("email", val);
        this.updateValidations("mobileNumber", val);
    }

    onRelationChange(val: any) {
        this.updateValidations("relativeCnic", val);
        this.updateValidations("relationProofDummy", val);
    }

    updateValidations(formValue: any, val: any) {
        if ((formValue == "email" && val == 3) || (formValue == "mobileNumber" && val == 1) || (formValue == "relativeCnic" && val != 1) || (formValue == "relationProofDummy" && val != 1)) {
            this.initialRegFormGroup.controls[formValue].setValidators([Validators.required]);
        } else {
            this.initialRegFormGroup.controls[formValue].clearValidators();
        }
        this.initialRegFormGroup.controls[formValue].updateValueAndValidity();
    }

    onRelationProofSelected(element: any) {
        let file = element.files[0];
        this.relationProofObj = file;
        this.convertImgToBase64(file);
        setTimeout(() => {
            this.relationProofBase64 = this.tempBase64;
        }, 500);
    }

    onIBANProofSelected(element: any) {
        let file = element.files[0];

        this.IBANProofObj = file;
        this.convertImgToBase64(file);
        this.IBANProofBase64 = this.tempBase64;
        console.log('IBANProofBase64', this.IBANProofBase64);
        this.cd.markForCheck();
        setTimeout(() => {
        }, 500);
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

    getActiveParticipants() {

         
        this.accountRegistrationService.getAllActiveParticipants().subscribe((data) => {
            this.allActiveParticipants = data;
        });
    }

    processIdentificationTypes() {
        this.accountRegistrationService.getUINtype().subscribe((data: any) => {
            this.identificationTypes = data;
        });
    }

    processRelationTypes() {
        this.accountRegistrationService.getNCCPLRelations().subscribe((data: any) => {
            this.relationTypes = data;
        });
    }

    submit(formData) {
        if (formData.valid) {
            let data = this.initialRegFormGroup.value;
            data.ibanProofDocName = this.IBANProofObj?.name;
            data.ibanProofDocContentType = this.IBANProofObj?.type;
            data.ibanProofDocSize = this.IBANProofObj?.size;
            data.ibanProof = this.IBANProofBase64;

            data.relationshipProofDocName = this.relationProofObj?.name;
            data.relationshipProofDocContentType = this.relationProofObj?.type;
            data.relationshipProofDocSize = this.relationProofObj?.size;
            data.relationshipProof = this.relationProofBase64;
            data.participantId = this.initialRegFormGroup.get('participantId')?.value,

                this.accountRegistrationService.saveBasicClientData(data).subscribe(
                    (res: any) => {
                        this.toast.success('Data Submitted successfully', 'Success');
                        this.IBANProofBase64 = "";
                        this.relationProofBase64 = "";
                    },
                    (er) => {
                        this.toast.error('Record already exists' , 'Error');
                    }
                );
        } else {
            this.toast.error('Please Complete Form to continue', ' Error')
        }

    }

    getRecipientData() {
        this.currentParticipant.participantId =
            this.route.snapshot.params['participantId'];
        this.currentParticipant.participantName =
            this.route.snapshot.queryParams['name'];
        let userID: number = +this.route.snapshot.params['participantId'];
        this.accountRegistrationService.getUserFromMarlinPortalByUserId(userID).subscribe(data => {
            let userData: any = data;
            this.initialRegFormGroup.get('clientName')?.setValue(userData?.name);
            this.initialRegFormGroup.get('mobileNumber')?.setValue(userData?.mobile);
            this.initialRegFormGroup.get('email')?.setValue(userData?.email);
        })
        this.setBackUrl(this.currentParticipant);
    }

    setBackUrl(data: any) {
        this.currentParticipant = data;
        this.BackUrl =
            "/home/" +
            this.currentParticipant.participantId +
            "?name=" +
            this.currentParticipant.participantName;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
