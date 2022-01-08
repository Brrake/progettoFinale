import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../jwt-auth/auth/auth.service';
import { TokenStorageService } from '../../jwt-auth/auth/token-storage.service';
import { AuthLoginInfo } from '../../jwt-auth/auth/login-info';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;
  public username$: String;
  public userLoggedId$: String;
  public userId: number;


  constructor(private authService: AuthService, public tokenStorage: TokenStorageService) {
    const username = sessionStorage.getItem('usernameLogged');
    this.username$ = username;
    const UserId = sessionStorage.getItem('customer_id');
    this.userLoggedId$ = UserId;
    var userIdString = sessionStorage.getItem("customer_id"); ///Get value as string
    this.userId = parseInt(userIdString)//Returns userId in number
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.authService.getUserIdByUsername(this.username$).subscribe(response => {
        this.tokenStorage.saveUserId(response.id)
      }
      )
    }

  }

  onSubmit() {
        this.loginInfo = new AuthLoginInfo(
      this.form.username,
      this.form.password);


    this.authService.attemptAuth(this.loginInfo).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        window.sessionStorage.setItem('usernameLogged', this.form.username)
        this.isLoginFailed = false;
        this.isLoggedIn = true;

      },
      error => {

        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
    );
    this.reloadPage();
  }

  reloadPage() {
    window.location.reload();
  }
  logout() {
    this.tokenStorage.signOut();
    this.reloadPage();
  }
}

