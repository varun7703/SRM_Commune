import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptographyService {

  constructor() { }

  encText(text: string, password: string) {
    const conversionEncryptOutput = CryptoJS.AES.encrypt(text.trim(), password.trim()).toString();
    return conversionEncryptOutput;
  }

  decText(text: string, password: string) {
    const conversionDecryptOutput = CryptoJS.AES.decrypt(text.trim(), password.trim()).toString(CryptoJS.enc.Utf8);

    return conversionDecryptOutput;
  }

}
