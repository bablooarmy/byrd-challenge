import { Directive, NgZone } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';
import { LoginService } from './login.service';

@Directive({
  selector: '[appSessionManagement]'
})
export class SessionManagementDirective {

  private sessionExpirePeriod: number = 0.3;//minutes
  private _tokenRenewedTime: Date;
  private _sessionOutFromTime: Date;
  private _sessionBackTime: Date;
  private sessionInterval: any;
  private sessionExtendInterval: any;

  constructor(private _ngZone: NgZone, private persistenceService: PersistenceService, private loginService: LoginService) { }

  ngOnInit() {

    this.extendSession().then(res => {
      this.initiateSessionManagement();
    });
  }

  doLogin() {
    this.extendSession();
  }

  async extendSession() {
    const loginResponse = await this.loginService.doLogin().toPromise();
    if (loginResponse && loginResponse[0] && loginResponse[0].token) {
      this.persistenceService.set("access_token", loginResponse[0].token, { type: StorageType.SESSION });
      this.tokenRenewedTime = new Date();
    }
  }

  isUserLoggedIn(): boolean {
    return this.persistenceService.get("access_token", StorageType.SESSION);
  }

  set sessionOutFromTime(date: Date) {
    this._sessionOutFromTime = date;
  }

  get sessionOutFromTime(): Date {
    return this._sessionOutFromTime;
  }

  set sessionBackTime(date: Date) {
    this._sessionBackTime = date;
  }

  get sessionBackTime(): Date {
    return this._sessionBackTime;
  }

  set tokenRenewedTime(date: Date) {
    this._tokenRenewedTime = date;
  }

  get tokenRenewedTime(): Date {
    return this._tokenRenewedTime;
  }

  initiateSessionManagement() {
    this._ngZone.runOutsideAngular(() => {
      const mouseOutListener = () => {
        this.validateSessionExpire(
          () => {
            this._ngZone.run(() => {
              this.persistenceService.remove("access_token", StorageType.SESSION);
            });
          },
          () => {
            this._ngZone.run(() => {
              this.clearSessionExtendValidateInterval();
            });
          },
          () => {
            return this._ngZone.run(() => {
              return this.isUserLoggedIn();
            });
          }
        );
      };

      const mouseOverListener = () => {
        this.initiateSessionTime(() => {
          return this._ngZone.run(() => {
            return this.sessionExpirePeriod;
          });
        },
          () => {
            this._ngZone.run(() => {
              this.clearSessionValidateInterval();
            });
          },
          () => {
            return this._ngZone.run(() => {
              return this.extendSession();
            });
          },
          () => {
            return this._ngZone.run(() => {
              return this.isUserLoggedIn();
            });
          }
        );
      };

      document.addEventListener("mouseout", mouseOutListener);
      document.addEventListener("mouseover", mouseOverListener);

    });
  }



  validateSessionExpire(
    sessionExpiredCallBack: () => void,
    clearIntervalCallBack: () => void,
    isUserLoggedInCallBack: () => boolean
  ) {

    if (isUserLoggedInCallBack()) {
      clearIntervalCallBack();
      this.sessionOutFromTime = new Date();
      this.sessionInterval = window.setInterval(() => {
        if (this.sessionExpirePeriod) {
          const curTime = new Date();
          let sessionExpireTime = this.sessionExpirePeriod * 60 * 1000;
          const userOutOfSessionTime = this.sessionOutFromTime.getTime() + sessionExpireTime;
          console.log("session out time now " + new Date(userOutOfSessionTime));
          if (curTime.getTime() > userOutOfSessionTime) {
            console.log("session expired at " + new Date(userOutOfSessionTime));
            window.clearInterval(this.sessionInterval);
            sessionExpiredCallBack();
          }
        }
      }, 10);
    }

  }

  initiateSessionTime(
    getSessionExpirePeriodTime: () => number,
    clearIntervalCallBack: () => void,
    sessionExtendedCallBack: () => Promise<any>,
    isUserLoggedInCallBack: () => boolean
  ) {
    if (isUserLoggedInCallBack()) {
      clearIntervalCallBack();
      this.sessionExpirePeriod = getSessionExpirePeriodTime();
      this.sessionBackTime = new Date();
      this.clearSessionValidateInterval();
      console.log("session back at " + new Date(this.sessionBackTime.getTime()));
      this.sessionExtendInterval = window.setInterval(() => {
        if (this.sessionExpirePeriod && this.tokenRenewedTime) {
          let curTime = new Date();
          let sessionExpireTime = this.sessionExpirePeriod * 60 * 1000;
          let timeFromTokenLastRenewal = this.tokenRenewedTime.getTime() + sessionExpireTime;
          console.log("time from last renewal of token " + new Date(timeFromTokenLastRenewal));
          if (curTime.getTime() > timeFromTokenLastRenewal) {
            window.clearInterval(this.sessionExtendInterval);
            sessionExtendedCallBack().then(res => {
              console.log("session extended at " + new Date(timeFromTokenLastRenewal));
              this.initiateSessionTime(getSessionExpirePeriodTime, clearInterval, sessionExtendedCallBack, isUserLoggedInCallBack);
            });
          }
        }
      }, 10);
    }

  }

  clearSessionValidateInterval() {
    if (this.sessionInterval) {
      window.clearInterval(this.sessionInterval);
    }
  }

  clearSessionExtendValidateInterval() {
    if (this.sessionExtendInterval) {
      window.clearInterval(this.sessionExtendInterval);
    }
  }


}
