
import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { AuthService2 } from 'app/services/auth2.service';

declare var jQuery: any;
//import 'slim_scroll/jquery.slimscroll.js';

@Component({
  selector: 'dashboard-admin',
  templateUrl: './dashboard-admin.template.html',
  encapsulation: ViewEncapsulation.None
})

export class AdminDashboard implements OnInit, AfterViewInit {

  constructor(private authService: AuthService2,private splash: FuseLoaderScreenService,) {
    this.splash.hide();
   }
  
  // ----------------------------------------------------

  ngOnInit() { }

  // ----------------------------------------------------

  ngAfterViewInit() { }
}
