import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// ======================================================== //
import Swal from 'sweetalert2';
// ======================================================== //
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserModel;
  remember: boolean;

  constructor( private authService: AuthService,
               private router: Router ) {
  }

  ngOnInit(): void {
    this.user = new UserModel();
    this.remember = false;

    if ( localStorage.getItem('email') ) {
      this.user.email =  localStorage.getItem('email');
      this.remember = true;
    } else {
      this.remember = false;
    }
  }

  onLogin(form: NgForm): void {
    if ( form.invalid ) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Conectando...',
      icon: 'info'
    });
    Swal.showLoading();

    if ( this.remember ) {
      localStorage.setItem('email', this.user.email);
    }

    this.authService.onLogin(this.user).subscribe(data => {
      console.log(data);
      Swal.close();
      this.router.navigateByUrl('/home');
    }, (dataError) => {
      let msg: string;
      if (dataError.error.error.message === 'INVALID_PASSWORD' ||
          dataError.error.error.message === 'EMAIL_NOT_FOUND') {
        msg = 'Los datos introducidos no son correctos.';
      } else {
        msg = 'Error al intentar iniciar sesión, intentelo de nuevo.';
      }
      Swal.fire({
        allowOutsideClick: false,
        title: 'Error al iniciar sesión',
        text: msg,
        icon: 'error'
      });
    });
  }

}
