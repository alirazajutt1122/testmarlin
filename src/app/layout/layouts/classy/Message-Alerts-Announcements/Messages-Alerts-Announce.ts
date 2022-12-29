import { Component, EventEmitter, ElementRef, Output, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Popup } from '@grapecity/wijmo.input';






import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'app/app.config';
import { AppConstants, AppUtility } from 'app/app.utility';
import { AuthService } from 'app/services-oms/auth-oms.service';
import { PasswordStrengthMeasurer } from 'app/util/PasswordStrengthMeasurer';

declare var jQuery: any;
declare var Messenger: any;

/////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'messages-alerts-announcements',
  templateUrl: './Messages-Alerts-Announce.html',
  styleUrls : ['./Messages-Alerts-Announce.scss']
})
export class MessagesAlertsAnnouncements implements AfterViewInit {
  @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
  @Output() toggleChatEvent: EventEmitter<any> = new EventEmitter();
  @Output() toggleTopMenuEvent: EventEmitter<any> = new EventEmitter();

  $el: any;
  config: any;
  router: Router;

  loginName: string = '';
  userType: string = '';

  @ViewChild('changePasswordDlg',{ static: false }) changePasswordDlg: Popup;

  private changePasswordModel = { oldPassword: '', password: '', confirm_password: '' };
  private changePasswordError: string;
  private changePasswordSuccess: string;
  private disableChangePassword = false;

  private measurer: PasswordStrengthMeasurer = new PasswordStrengthMeasurer();
  private passwordStrength = 0;

  private newChatMessage: any;
  private errorMsg: string = '';
  public navImg:any
  public lsLang:any




  // ---------------------------------------------------------------

  constructor(el: ElementRef, config: AppConfig, router: Router, private authService: AuthService,private translate: TranslateService) {
    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();
    this.router = router;

    this.loginName = AppConstants.loginName;
    this.userType = AppConstants.userType;

    //  user's status is InActive now logout user.
    this.authService.socket.on('user_update', (data) => {
      AppUtility.printConsole('user_update:' + JSON.stringify(data));
      this.onUserUpdate(data);
    });

    this.authService.socket.on('alert', (data) => { this.onAlert(data); });


     //for ng2translate
     let lang=localStorage.getItem("lang");
     if(lang==null)
      {
        lang='en'
        localStorage.setItem("lang",lang)
      }
     this.translate.addLangs(['en','pt'])
     this.translate.use(lang)

    // Logic for converting image on language change

    this.lsLang=localStorage.getItem("lang")
    if(this.lsLang=="en"){
      this.navImg="assets/img/marlinNewLogo.png"
    }else if(this.lsLang=="pt"){
      this.navImg="assets/img/marlinNewLogo.png";
    }

  }

  // --------------------------------------------------------------------------------

     // method for ngxtranslate
     public changeLanguage(lang:any){

      localStorage.setItem("lang",lang)
      window.location.reload()
 }

  // --------------------------------------------------------------------------------



  onAlert(data) {
      console.log(JSON.stringify(data));
      let msgStr: string = '<b>Expression:</b> ' + data.expression + '<br><b>Message:</b> ' + data.message + '<br><b>Name:</b> ' + data.name;
      Messenger().post({
          message: msgStr,
          type: 'error',
          showCloseButton: true
      });
  }

  // ---------------------------------------------------------------

  toggleTopMenu(state): void {
    this.toggleTopMenuEvent.emit(state);
    if ('trading' === state)
      this.router.navigate(['/app/watch/dashboard-oms']);
    else if ('backoffice' === state)
      this.router.navigate(['/app/backoffice/dashboard-bbo']);
    else if ('research' === state)
      this.router.navigate(['/app/backoffice/dashboard-bbo']);
  }

  // ---------------------------------------------------------------

  toggleSidebar(state): void {
    this.toggleSidebarEvent.emit(state);
  }

  // ---------------------------------------------------------------

  toggleChat(): void {
    this.toggleChatEvent.emit(null);
    // jQuery('.chat-sidebar-container').toggleClass('chat-sidebar-opened');

    let $chatNotification = jQuery('#chat-notification');
    $chatNotification.addClass('animated fadeOut')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
        $chatNotification.addClass('hide');
      });
  }

  // ---------------------------------------------------------------

  onDashboardSearch(f): void {
    this.router.navigate(['/app', 'extra', 'search'], { queryParams: { search: f.value.search } });
  }

  // ---------------------------------------------------------------

  ngAfterViewInit(): void {

    jQuery('#errorDlg').modal('hide');

    jQuery('[has-ripple="true"]').click(function () {
      jQuery(this).toggleClass('clicked');
      jQuery('.menu').toggleClass('open');
    });

    jQuery('.menu-wrapper').click(function () {
      $(this).toggleClass('rounded_menu');
      // $(".menu-wrapper").find(".menu").toggleClass("open");
    });

    jQuery('.menu a').each(function (index) {
      let thismenuItem = jQuery(this);

      thismenuItem.click(function (event) {
        event.preventDefault();
        jQuery('.menuitem-wrapper').eq(index).addClass('spin');

        let timer = setTimeout(function () {
          jQuery('.menuitem-wrapper').eq(index).removeClass('spin');
          jQuery('.menu').removeClass('open');
          jQuery('.menu-btn').removeClass('clicked');
        }, 100);
      });
    });

    this.$el.find('.input-group-addon + .form-control').on('blur focus', function (e): void {
      jQuery(this).parents('.input-group')
      [e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
    });
  }

  // ---------------------------------------------------------------

  initChangePasswordDlg() {
    this.changePasswordSuccess = undefined;
    this.changePasswordError = undefined;
    this.changePasswordModel = { oldPassword: '', password: '', confirm_password: '' };
    this.disableChangePassword = false;
    this.passwordStrength = 0;
  }

  // ---------------------------------------------------------------

  onChangePassword() {
    this.initChangePasswordDlg();
    this.changePasswordDlg.show();
  }

  // ---------------------------------------------------------------

  onChangePasswordCancel() {
    this.changePasswordDlg.hide();
  }

  // ---------------------------------------------------------------

  onNewPasswordChange(newValue) {
    this.changePasswordError = undefined;
    this.passwordStrength = this.measurer.measure(newValue);
  }

  // ---------------------------------------------------------------

  onChangePasswordOK() {
    this.changePasswordDlg.isDisabled = this.disableChangePassword = true;

    this.authService.changePassword(this.changePasswordModel.oldPassword, this.changePasswordModel.password).subscribe(
      data => {
        this.changePasswordDlg.isDisabled = this.disableChangePassword = false;
        this.changePasswordSuccess = 'Your password is successfully changed.';
        setTimeout(() => {
          this.onChangePasswordCancel();
        }, 3000);
      },
      error => {
        this.changePasswordDlg.isDisabled = this.disableChangePassword = false;
        if (error.status === 0) {
          this.changePasswordError = 'Unable to connect to server';
        }
        else {
          this.changePasswordError = JSON.parse(error._body).message;
        }
      });
  }

  // ---------------------------------------------------------------

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --------------------------------------------------------------------

  onUserUpdate(data): void {
    this.errorMsg = 'user status is inactive, please contact your administrator.';
    this.authService.logout();

    jQuery('#errorDlg').modal('show');
  }

  // --------------------------------------------------------------------

  onNewChatMessage(newChatMessage: any) {
    this.newChatMessage = newChatMessage;

    // let $chatNotification = jQuery('#chat-notification');
    // $chatNotification.siblings('#toggle-chat').append('<i class="chat-notification-sing animated bounceIn"></i>');

    // let msgStr: string =
    //   "<h6 class='title'>\
    //     <span class='thumb-xs'>\
    //       <img src='assets/img/avatar.png' class='img-circle mr-xs pull-xs-left'>\
    //     </span>" + newChatMessage.name +
    //   "</h6>\
    //   <p class='text'>" + newChatMessage.text + '</p>';

    // Messenger().post({
    //     message: msgStr,
    //     type: 'info',
    //     showCloseButton: true
    // });

    let $chatNotification = jQuery('#chat-notification');
    if ($chatNotification.hasClass('hide'))
    {
      setTimeout(() => {
        $chatNotification.removeClass('hide').addClass('animated fadeIn')
          .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
            $chatNotification.removeClass('animated fadeIn');
            setTimeout(() => {
              $chatNotification.addClass('animated fadeOut')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
                  $chatNotification.addClass('hide');
                });
            }, 4000);
          });
        $chatNotification.siblings('#toggle-chat')
          .append('<i class="chat-notification-sing animated bounceIn"></i>');
      }, 1000);
    }

  }

  // --------------------------------------------------------------------

  onErrorOK()
  {
    this.router.navigate(['/login']);
  }

}
