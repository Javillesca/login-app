import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// ======================================================== //
import Swal from 'sweetalert2';
// ======================================================== //
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logup',
  templateUrl: './logup.component.html',
  styleUrls: ['./logup.component.css']
})
export class LogupComponent implements OnInit {

  user: UserModel;
  remember: boolean;

  constructor( private authService: AuthService,
               private router: Router ) { }

  ngOnInit(): void {
    this.user = new UserModel();
    this.remember = false;
  }

  onSubmit(form: NgForm) {
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

    this.authService.onSignUp(this.user).subscribe(data => {
      console.log(data);
      Swal.close();
      this.router.navigateByUrl('/home');
    }, (dataError) => {
      console.log(dataError.error.error.message);
      let msg: string;
      if ( dataError.error.error.message === 'EMAIL_EXISTS' ) {
        msg = 'El usuario ya existe, inicia sesión para continuar.';
      } else {
        msg = 'Error al intentar crearse la cuenta, intentelo de nuevo';
      }
      Swal.fire({
        allowOutsideClick: false,
        title: 'Error al crear usuario',
        text: msg,
        icon: 'error'
      });
    });
  }

}
