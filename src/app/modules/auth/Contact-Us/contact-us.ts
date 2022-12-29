import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { contactUs } from 'app/models/contactUs';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'contact-us',
    templateUrl: './contact-us.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class ContactUsComponent implements OnInit {

    contactUsForm: FormGroup;
    selectedItem: contactUs

    constructor(
        private auth_service: AuthService,
        private _formBuilder: FormBuilder,
        private splash: FuseLoaderScreenService,
        private toast: ToastrService,
    ) { }

    ngOnInit() {
        this.clearFields()
    }
    clearFields() {
        this.selectedItem = new contactUs()
        this.formFields()
    }

    formFields() {
        this.contactUsForm = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            subject: [''],
            emailAddress: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required]
        });
    }

    onSubmit() {
        debugger
        if (this.contactUsForm.valid) {

            this.splash.show();
            this.contactUsForm.disable();

            let formData = this.contactUsForm.getRawValue();
            // this.selectedItem

            this.auth_service.contactUs(formData).subscribe((res) => {
                this.contactUsForm.enable();
                this.splash.hide();
                this.toast.success('Query sent successfully', 'Success');
            }, (error) => {
                this.splash.hide();
                this.contactUsForm.enable();
                this.toast.error('Something went wrong, Please try again later', 'Error');

            })
        }
        else {
            this.toast.error('Please Fill missing Fields', 'Error')
        }
    }

}