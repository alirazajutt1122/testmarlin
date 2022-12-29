import { NgModule } from '@angular/core';
import { FuseSplashScreenService } from '@fuse/services/splash-screen/splash-screen.service';
import { FuseLoaderScreenService } from './loader-screen.service';

@NgModule({
    providers: [
        FuseSplashScreenService,
        FuseLoaderScreenService
    ]
})
export class FuseSplashScreenModule
{
    /**
     * Constructor
     */
    constructor(private _fuseSplashScreenService: FuseSplashScreenService)
    {
    }
}
