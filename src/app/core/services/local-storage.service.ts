import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {

    sessionInitial = 'bollettiniNotariliUser';

    constructor(private storage: Storage) { }

    setEncryptedLocalStorage(key: string, data: any): any {
        if (data && key) {
            const keyName = this.sessionInitial + '-' + key.trim();
            window.localStorage.setItem(keyName, data);
        }
    }

    getDecryptedLocalStorage(key: string): any {
        if (key) {
            const keyName = this.sessionInitial + '-' + key.trim();
            return window.localStorage.getItem(keyName);
        }
    }

    removeEncryptedLocalStorage(key: string): void {
        if (key) {
            const keyName = this.sessionInitial + '-' + key.trim();
            window.localStorage.removeItem(keyName);
        }
    }

    setIonicStorage(key: string, data: any): any {
        if (data && key) {
            const keyName = this.sessionInitial + '-' + key.trim();
            this.storage.set(keyName, data);
        }
    }

    getIonicStorage(key: string): Observable<any> {
        if (key) {
            const keyName = this.sessionInitial + '-' + key.trim();
            return from(this.storage.get(keyName));
        }
    }

    removeIonicStorage(key: string): void {
        if (key) {
            const keyName = this.sessionInitial + '-' + key.trim();
            this.storage.remove(keyName);
        }
    }


}
