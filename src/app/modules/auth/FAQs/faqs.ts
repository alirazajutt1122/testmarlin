import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Output, EventEmitter } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

@Component({
    selector: 'faqs',
    templateUrl: './faqs.html',

})
export class FAQsComponent implements OnInit, OnChanges {

    @Output() pageRouteValue = new EventEmitter<string>();
    @Input() parentLang = '';
    lang: any
    panelOpenState = false;
    searchText = '';
    text = `somedummy text here`
    textArr: any
    constructor(
        private splash: FuseLoaderScreenService,
        private auth_service: AuthService,
        private toast: ToastrService,
    ) {
        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
    }
    ngOnChanges() {
        this.lang = this.parentLang
        this.getFAQsdata()
    }

    ngOnInit() {
    }


    nevigate(pageRoute) {
        this.pageRouteValue.emit(pageRoute);
    }

    search(event) {
        const value = event.target.value.toLowerCase();
    }

    getFAQsdata() {
        this.splash.show();

        this.auth_service.faqs(this.lang).subscribe(res => {
            this.splash.hide();
            this.textArr = res
        }, (error) => {
            this.splash.hide();
            this.toast.error('Something went wrong', 'Error');
        })
    }



}