import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {fuseAnimations} from '@fuse/animations';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {User} from "../../../../core/user/user.types";

@Component({
    selector: 'app-trading-registration',
    templateUrl: './trading-registration.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class TradingRegistrationComponent implements OnInit, OnDestroy {
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    currentUser: User;
    registrationProcess: ({ answer: string; step: string; id: string })[] = [
        {
            'id': '1',
            'step': '- Get Verified',
            'answer': 'Start with providing your following details for verfication: \n' +
                '\n' +
                'CNIC/NICOP/POC number\n' +
                'IBAN\n' +
                'Email Address\n' +
                'Mobile number\n' +
                'On submission of the details a One Time Password (OTP) will be sent on your mobile number which you will have to enter in the form to get yourself verified..'
        },
        {
            'id': '2',
            'step': '- Fill the Online Form',
            'answer': 'After getting verified now you will have to fill the form electronically and agree to the terms and conditions.'
        },
        {
            'id': '3',
            'step': '- Attach Documents',
            'answer': 'Once you have finished with filling up the form, now start  attaching scanned copies of supporting documents listed below and then submit the form.'
        },
        {
            'id': '4',
            'step': '- Acknowledgement',
            'answer': 'Now you just sit back and you will get notification about account activation through email or SMS.'
        },
    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(private _fuseMediaWatcherService: FuseMediaWatcherService,
                private _fuseConfirmationService: FuseConfirmationService) {
    }

    ngOnInit(): void {

        this.currentUser = JSON.parse(localStorage.getItem('user'));
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onNewRegistration(): void {
        window.open(`http://192.168.36.61:4200/initial-reg/${this.currentUser.userId}`, '_blank');
    }

    onAlreadyOTP(): void {
        window.open(`http://192.168.36.61:4200/home/${this.currentUser.userId}`, '_blank');
    }

}
