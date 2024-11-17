import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  usuario = new UsuarioModel();
  showPassword: boolean = false;

  

  constructor(private authSvc:AuthService){

    localStorage.removeItem('currentUser');

  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(forma:NgForm){
   
      this.usuario = forma.value
      this.authSvc.login(this.usuario)

   }

}
