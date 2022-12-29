import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'about-us',
    templateUrl: './about-us.html',

    encapsulation: ViewEncapsulation.None,
})
export class AboutUsComponent implements OnInit, OnChanges {

    identifier = 'ABOUT_US'
    lang: string;
    textArr: any
    @Input() parentLang = '';

    constructor(private splash: FuseLoaderScreenService,
        private auth_service: AuthService,
        private toast: ToastrService,

    ) {
        this.splash.hide();
        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
    }

    ngOnChanges() {
        this.lang = this.parentLang
        this.getAboutUsData()
    }

    ngOnInit() {
    }

    getAboutUsData() {
        this.splash.show();

        this.auth_service.pages(this.identifier, this.lang).subscribe(res => {
            this.splash.hide();
            this.textArr = res
        }, (error) => {
            this.splash.hide();
            this.toast.error('Something went wrong', 'Error');
        })
    }

}
