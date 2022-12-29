import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountRegistrationService} from "../../account-registration.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'already-have-otp',
    templateUrl: './already-have-otp.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlreadyHaveOtpComponent implements OnInit {
    alreadyHaveOtp: FormGroup;
    private currentParticipient = {participantId: null, participantName: ''};
    public OTPObj = {requestType: "V", uin: "", otp: ""};
    public currentUrl: string = "";


    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private accountRegistrationService: AccountRegistrationService,
        private toaster: ToastrService,
        private route: ActivatedRoute,
        private _router: Router,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Create the form
        this.alreadyHaveOtp = this._formBuilder.group({
            uin: ['', Validators.required],
            otp: ['', Validators.required]
        });
        // this.getRecipientData();
    }


    verifyOtp() {

        if (this.alreadyHaveOtp.invalid) {
            this.toaster.error('Please Fill All Fields', 'Error')
            return;
        }
        let data = this.alreadyHaveOtp.value;
        this.OTPObj.uin = data.uin;
        this.OTPObj.otp = data.otp;

        this.accountRegistrationService.verifyOTP(this.OTPObj).subscribe(
            (res: any) => {
                let keys = Object.keys(res);
                keys.forEach((keyValue) => {
                    let msg = "";
                    if (keyValue == "KYCService") {
                        msg = res.KYCService.data.Message.split("=");
                        this.toaster.warning(msg[1]);
                        // return;
                    } else if (keyValue == "OTPService") {
                        msg = res.OTPService.data.Message.split("=");
                        //this.toaster.success(msg[1]);
                        // let url =
                        //     "/individual-registration" ;
                        // window.location.href = url;
                       this._router.navigate(["individual-registration"] , { state: { UIN: this.OTPObj.uin } })
                    }
                });
            },
            (error) => {
                this.toaster.error('Invalid UIN / OTP', 'Error');
            }
        );
    }


    getRecipientData() {
        let participient = localStorage.getItem("participient");
        if (participient == null || participient?.length == 0) {

            this.currentParticipient.participantId =
                this.route.snapshot.params['participantId'].split("?")[0];
            this.currentParticipient.participantName =
                this.route.snapshot.params['participantId'].split("=")[1];

            localStorage.setItem("participient", JSON.stringify(this.currentParticipient))
        } else {
            this.currentParticipient = JSON.parse(participient);
        }
        this.accountRegistrationService.updatedDataSelection(this.currentParticipient);
        this.currentUrl =
            "/initial-reg/" +
            this.currentParticipient.participantId +
            "?name=" +
            this.currentParticipient.participantName;

    }

}
