import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = 'AIzaSyCIdkGyP5SsgeqXScLjrSegbMVzsPDiC3c';
  private userToken: string;
  // logup
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient,
               private router: Router ) {
    this.readToken();
  }

  onLogin( user: UserModel): any {

    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map(data => {
        console.log(data);
        this._saveToken(data['idToken'], data['expiresIn']);
        return data;
      })
    );

  }

  onLogout( url: string): void {

    localStorage.removeItem('TOKEN');
    this.router.navigateByUrl('/' + url);

  }

  onSignUp( user: UserModel ): any {

    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }signUp?key=${this.apiKey}`,
      authData
    ).pipe(
      map(data => {
        this._saveToken(data['idToken'], data['expiresIn']);
        return data;
      })
    );

  }

  private _saveToken( idToken: string, expiresIn: number ): void {

    this.userToken = idToken;
    localStorage.setItem('TOKEN', idToken);
    const sesion = new Date();
    sesion.setSeconds(expiresIn);

    localStorage.setItem('expiresIn', sesion.getTime().toString());

  }

  readToken(): string {

    if ( localStorage.getItem('TOKEN') ) {
      this.userToken = localStorage.getItem('TOKEN');
    } else {
      this.userToken = '';
    }

    return this.userToken;

  }

  authStatus(): boolean {

    if ( this.userToken.length > 2 ) {
      return false;
    }
    const expiresIn = Number(localStorage.getItem('expiresIn'));
    const expiresDate = new Date();
    expiresDate.setTime(expiresIn);

    if ( expiresDate > new Date() || this.userToken.length < 2 ) {
      return true;
    } else {
      return false;
    }

  }


}

