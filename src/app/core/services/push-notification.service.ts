import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationService {

    pushOptions: PushOptions = {
        android: {},
        ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
        },
        windows: {},
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        }
    };
    constructor(
      private push: Push,
      private authService: AuthService
    ) {
        // to check if we have permission
        
    }

    initPushConfig(){
        this.push.hasPermission()
        .then((res) => {
            console.log('res');
            if (res.isEnabled) {
                console.log('We have permission to send push notifications');
                this.initPushNotification();
            } else {
                console.log('We do not have permission to send push notifications');
            }
        })
        .catch(err => {
            console.log('err', err);
        });
    }

    /**
     * To initialize push notifications
     */
    initPushNotification(): void {
        const pushObject: PushObject = this.push.init(this.pushOptions);

        pushObject.on('notification').subscribe((notification: any) => {
            console.log('Received a notification', notification);
        });

        pushObject.on('registration').subscribe((registration: any) => {
            console.log('Device registered', registration);
            if ( registration && registration.registrationId ) {
              this.authService.deviceRegId.next(registration.registrationId);
            }
        });

        pushObject.on('error').subscribe(error => {
          console.error('Error with Push plugin', error);
        });
    }

}
