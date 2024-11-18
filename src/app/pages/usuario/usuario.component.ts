import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { PageService } from '../services/page.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuario = new UsuarioModel();
  id: any;
  isEditing: boolean = false;
  
  // Campo para la nueva contraseña al editar
  newPassword: string = '';

  constructor(private usuarioSvc: PageService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== 'nuevo') {
      this.isEditing = true;
      this.usuarioSvc.getUsuario(this.id).subscribe((res: any) => {
        this.usuario = res;
        this.usuario.password = this.usuario.password || ''; // Asegura que el campo password no sea undefined
        this.usuario.id = this.id;
      });
    }
  }

guardar(forma: NgForm) {
  console.log('Valor de newPassword:', this.newPassword);  // Verificar el valor de newPassword

  Swal.fire({
    icon: 'info',
    title: 'ESPERE',
    text: 'Guardando información',
    allowOutsideClick: false
  });

  Swal.showLoading();

  // **Paso 1: Verificar si estamos creando un usuario**
  if (!this.isEditing) {
    if (!this.newPassword.trim()) {
      console.log('Contraseña vacía al crear usuario');  // Mostrar el mensaje si la contraseña está vacía
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña es obligatoria al crear un nuevo usuario.'
      });
      return; // Salir de la función si no hay contraseña
    } else {
      console.log('Contraseña a encriptar:', this.newPassword.trim());
      const saltRounds = 10;
      this.usuario.password = bcrypt.hashSync(this.newPassword.trim(), saltRounds); // Encriptar la contraseña
    }
  } else {
    // **Paso 2: Si estamos editando, solo actualizamos la contraseña si fue modificada**
    if (this.newPassword.trim()) {
      console.log('Contraseña a encriptar al editar:', this.newPassword.trim());
      const saltRounds = 10;
      this.usuario.password = bcrypt.hashSync(this.newPassword.trim(), saltRounds); // Encriptar la nueva contraseña
    }
  }

  // **Paso 3: Verificación del correo electrónico (solo cuando se crea un nuevo usuario)**
  if (!this.isEditing) {
    this.usuarioSvc.verificarEmail(this.usuario.email).subscribe((existe: boolean) => {
        if (existe) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El usuario con este correo electrónico ya existe.'
          });
        } else {
          this.usuarioSvc.crearUsuario(this.usuario).subscribe(
            res => {
              Swal.fire({
                icon: 'success',
                title: 'ÉXITO',
                text: 'El usuario se creó correctamente.'
              });
            });
        }
      });
  } else {
    // **Paso 4: Si estamos editando, solo actualizamos el usuario**
    this.usuarioSvc.actualizarUsuario(this.usuario).subscribe(
      res => {
        Swal.fire({
          icon: 'success',
          title: this.usuario.nombre,
          text: 'El usuario se actualizó correctamente.'
        });
      });
  }
}

  
}
