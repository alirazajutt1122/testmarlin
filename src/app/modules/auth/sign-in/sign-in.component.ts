import { Component, ElementRef, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen/loader-screen.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen/splash-screen.service';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthService2 } from 'app/services/auth2.service';
import { ToastrService } from "ngx-toastr";
import { AppConstants, AppUtility } from 'app/app.utility';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { adminNavigation, defaultNavigation } from 'app/mock-api/common/navigation/data';
import { cloneDeep } from 'lodash-es';
import { OrderService } from 'app/services-oms/order-oms.service';
import { RestService } from 'app/services/api/rest.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})


export class AuthSignInComponent implements OnInit, OnChanges {



    @ViewChild('signInNgForm') signInNgForm: NgForm;
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;
    @ViewChild('email') fieldName: ElementRef;
    @ViewChild('passwordField') fieldNamePassword: ElementRef;

    pi;
    virtualTradingId = "VirtualTrading"

    outPutProp: any;
    signInForm: FormGroup;
    forgotPasswordForm: FormGroup;
    formType: string = 'signIn';
    signUpForm: FormGroup;
    allCountries;
    allExchanges;
    langs = this.transloco.getAvailableLangs();
    activelang = this.transloco.getActiveLang();
    currentLang: any;
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _adminNavigation: FuseNavigationItem[] = adminNavigation;
    selectedExchange: any;
    selectedCountry: any;
    dialingCountryCode: any
    modelPostionX: any
    modelPostionY: any
    topPos: any
    mainPage = 'signin'
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _authService2: AuthService2,
        private _orderService: OrderService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private toast: ToastrService,
        private transloco: TranslocoService,
        private splash: FuseLoaderScreenService,
        private _fuseMockApiService: FuseMockApiService,
        public _restService : RestService
    ) {

        this.currentLang = localStorage.getItem("lang")
        if (this.currentLang != null) {
            this.transloco.setActiveLang(this.currentLang)
            this.activelang = this.transloco.getActiveLang();
        }
    }

    ngOnChanges(): void {

        this.onMobileNumError()
    }

    ngOnInit(): void {
        this.splash.hide();
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: ['']
        });

        this.signUpForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            mobile: ['', [Validators.required, Validators.pattern("^[1-9][0-9]*$"), Validators.minLength(8), Validators.maxLength(11)]],
            countryId: ['', Validators.required],
            exchangeId: ['', Validators.required],
            agreements: [true],
            countryCode: [''],
        });

        this.forgotPasswordForm = this._formBuilder.group({
            userName: ['', [Validators.required, Validators.email]],
        })

        this.getAllCountries();
        this.getAllExchanges();
        this.getMessageFromAuthSharedModule();


    }

    registerHandlers(): void {
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {
                return [200, { default: cloneDeep(this._defaultNavigation) }]
            });
    }

    adminRegisterHandlers(): void {
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {
                return [200, { default: cloneDeep(this._adminNavigation) }]
            });
    }

    public recieveMessageFromAuthShared = (event) => {
        this.outPutProp = event;
        if (event === 'signIn' && this.formType === 'signIn') {
            this.toast.error('Please Sign In', 'Error');
            this.fieldName.nativeElement.focus();
            this.formType = event;
            window.scrollTo(0, 0);
        }
        else {
            this.toast.error('Please Sign In', 'Error');
            this.formType = event;
            window.scrollTo(0, 0);
        }
    }

    getMessageFromAuthSharedModule = () => {

        this._authService.sharedMessage.subscribe((message) => {
            this.formType = message;
            window.scrollTo(0, 0);
        });
    }

    signIn(): void {
        this.splash.show();
        this.currentLang = this.transloco.getActiveLang()
        localStorage.setItem('lang', this.currentLang)
        if (this.signInForm.invalid) {
            this.splash.hide();
            return;
        }
        this.signInForm.disable();
        this.login(this.signInForm.value)

    }

    signUp() {

        if (this.signUpForm.invalid) {
            if (this.currentLang == 'pt') {
                this.toast.error('Por favor, preencha os campos ausentes', 'Erro')
            } else
                this.toast.error('Please Fill missing Fields', 'Error')
            return;
        }
        if (!this.signUpForm.get('agreements').value) {
            if (this.currentLang == 'pt') {
                this.toast.error('Aceite o Contrato e os Termos', 'Erro')
            } else
                this.toast.error('Please Accept Agreement and Terms', 'Error')
            return;
        }

        let formData = this.signUpForm.getRawValue();
        formData.mobile = this.dialingCountryCode + formData.mobile
        const data = {
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            password: formData.password,
            countryId: formData.countryId,
            exchangeId: formData.exchangeId
        };
        if (formData.password != formData.confirmPassword) {
            if (this.currentLang == 'pt') {
                this.toast.error('A senha e a senha de confirmação não coincidem', 'Erro')
            } else
                this.toast.error('The password and confirmation password do not match', 'Error')
            return;
        }
        this.signUpForm.disable();

        this._authService.signUp(data)
            .subscribe((response) => {

                this.formType = 'signIn';
                this.signInForm.setValue({ email: data.email, password: data.password, rememberMe: "" })
                this.login(this.signInForm.value)
                this.signUpForm.reset();
                this.signUpForm.enable();

            }, (error) => {

                this.splash.hide();
                this.signUpForm.enable();
                let Conflict

                if (error.message != undefined && error.status != undefined) {

                    if (error.message.match("NEXUSPSX.USERS_EMAIL_UNIQ") != "") {
                        Conflict = "NEXUSPSX.USERS_EMAIL_UNIQ"
                    }
                    // Re-enable the form

                    if (error.status === 404) {
                        if (this.currentLang == 'pt') {
                            this.toast.error('Erro do Servidor Interno', 'Erro');
                        } else
                            this.toast.error('Internal Server Error', 'Error');

                    } else if (error.message == 'Sorry for the inconvenience. Please contact at the support.') {
                        if (this.currentLang == 'pt') {
                            this.toast.error('E-mail ou Telefone já existe.', 'Erro');
                        } else
                            this.toast.error('Email or Phone Already exist.', 'Error');

                    } else if (Conflict == "NEXUSPSX.USERS_EMAIL_UNIQ") {
                        if (this.currentLang == 'pt') {
                            this.toast.error('Email já existe.', 'Erro');
                        } else
                            this.toast.error('Email Already exist.', 'Error');
                    }
                    else {
                        if (this.currentLang == 'pt') {
                            this.toast.error('Alguma coisa deu errado. Por favor tente outra vez.', 'Erro');
                        } else
                            this.toast.error('Something went wrong, please try again.', 'Error');
                    }
                }

                if (error === 'Email already exists already exist.') {
                    if (this.currentLang == 'pt') {
                        this.toast.error('E-mail  já existe.', 'Erro');
                    } else
                        this.toast.error('Email already exist.', 'Error');

                }

            }
            );
    }

    sendResetLink(): void {
        // Return if the form is invalid
        if (this.forgotPasswordForm.invalid) {
            this.toast.error('Please Fill Missing Fields', 'Error');
            return;
        }
        this.forgotPasswordForm.disable();
        const data = {
            userName: this.forgotPasswordForm.get('userName').value,
            password: '',
        }
        this._authService.forgotPassword(data)
            .subscribe((response) => {

                this.forgotPasswordForm.enable();
                this.forgotPasswordNgForm.resetForm();
                this.toast.success('Password reset sent! You\'ll receive an email if you are registered on our system.', 'Success');
            }, (response) => {
                this.forgotPasswordForm.enable();
                this.toast.error('Email does not found! Are you sure you are already a member?', 'Error')
            }
            );
    }

    getAllCountries() {
        this._authService.getAllCountries().subscribe((res => {
            this.allCountries = res;

            const index = this.allCountries.findIndex(a => {
                return a.countryCode === AppConstants.DEFAULT_COUNTRY_CODE;
            });

            this.selectedCountry = this.allCountries[index].countryId
            this.dialingCountryCode = this.allCountries[index].dialingCode

        }))
    }

    getAllExchanges() {
        this._authService.getAllExchanges().subscribe((res => {
            this.allExchanges = res;
            this.selectedExchange = this.allExchanges[0].exchangeId
        }))
    }


    onClickPortfolio() {

    }
    onClickSideBar() {

    }

    setActiveLang(lang: any) {
        this.transloco.setActiveLang(lang);
        this.activelang = lang
        localStorage.setItem("lang", lang)
    }

    login(obj) {
        this._authService.signIn(obj).subscribe((resp) => {

            this._authService2.setToken(resp.token);
            this._orderService.setToken(resp.token);
            this._restService.setUserToken(resp.token)
            sessionStorage.setItem("exchangeId", resp.exchangeId.toString());
            AppConstants.exchangeId = resp.exchangeId; 
            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
            const adminURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/admin-redirect';
            // .............................................................................................................
            if (AppConstants.userType === 'MARLIN ADMIN') {
                this._router.navigateByUrl(adminURL);
                console.log("MARLIN ADMIN")
                this.adminRegisterHandlers()
                this.splash.hide();

            }
            else if (AppConstants.userType === 'PARTICIPANT') {
                console.log("Participant")
                this._router.navigateByUrl(redirectURL);
                this.registerHandlers()
                this.splash.hide();

            }
            else {
                console.log("XYZ")
                this._router.navigateByUrl(redirectURL);
                this.registerHandlers()
                this.splash.hide();
            }
            // .............................................................................................................


            // this._router.navigateByUrl(redirectURL);

            if (this.currentLang == 'pt') {
                this.toast.success('Login Com Sucesso', 'Sucesso');
            } else
                this.toast.success('Successfully Login', 'Success');

        }, (response) => {
            this.splash.hide();
            this.signInForm.enable();
            if (this.currentLang == 'pt') {
                this.toast.error('E-mail ou Senha Incorretos', 'Erro');
            } else
                this.toast.error('Wrong Email or Password', 'Error');
        }
        );
    }

    countryChanged(event) {

        const index = this.allCountries.findIndex(a => {
            return a.countryId == event;
        });
        this.dialingCountryCode = this.allCountries[index].dialingCode

    }

    clearSignupFields() {
        this.dialingCountryCode = ''
        this.selectedCountry = ""
        this.selectedExchange = ""
        this.getAllCountries()
        this.getAllExchanges()
    }


    gettingPostion(id: string) {
        const element = document.getElementById(id).getBoundingClientRect();

        this.modelPostionX = 0
        this.modelPostionY = 0

        let posleft = element.left
        let postop = element.top

        if (id === "VirtualTrading") {
            this.modelPostionX = posleft + 348 + "px"
            this.modelPostionY = postop - 10 + "px"
        } else if (id === "AssetClass") {
            this.modelPostionX = posleft + 405 + "px"
            this.modelPostionY = postop - 10 + "px"
        } else if (id === "WatchList") {
            this.modelPostionX = posleft + 460 + "px"
            this.modelPostionY = postop - 10 + "px"
        } else if (id === "RealMarket") {
            this.modelPostionX = posleft + 420 + "px"
            this.modelPostionY = postop - 10 + "px"
        } else if (id === "Graph") {
            this.modelPostionX = posleft + 360 + "px"
            this.modelPostionY = postop - 10 + "px"
        } else if (id === "Portfolio") {
            this.modelPostionX = posleft + 310 + "px"
            this.modelPostionY = postop + "px"
        }
    }

    onMobileNumError() {
        const element = document.getElementById("mobileNum").getBoundingClientRect();
        this.topPos = 0
        let postop = element.top
        this.topPos = postop + "px"
    }

    nevigate(pageRoute) {
        // this._router.navigateByUrl(pageRoute);
        this.mainPage = pageRoute
    }

}
