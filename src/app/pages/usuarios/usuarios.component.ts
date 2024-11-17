import { Component, OnInit } from '@angular/core';
import { PageService } from '../services/page.service';
import { UsuarioModel } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioModel[] = [];
  storedData = localStorage.getItem('currentUser');
  usuario: UsuarioModel = {};

  constructor(private usuarioSvc: PageService) {
    if (this.storedData) {
      // Parseamos el string a un objeto
      const user = JSON.parse(this.storedData);
      this.usuario = user;
      console.log(user.email);  // Acceder a la propiedad 'email' del objeto
    } else {
      console.error('No se encontró el usuario en localStorage');
    }
  }

  ngOnInit() {
    this.usuarioSvc.getUsuarios().subscribe((res: any) => {
      this.usuarios = res;

      // Filtramos los usuarios para eliminar al usuario logueado
      this.usuarios = this.usuarios.filter((user: UsuarioModel) => user.email !== this.usuario.email);
    });
  }

  borrarUsuario(usuario: UsuarioModel, i: number) {
    Swal.fire({
      icon: 'question',
      title: '¿Está seguro?',
      text: `¿Está seguro de eliminar a ${usuario.nombre}?`,
      showConfirmButton: true,
      showCancelButton: true
    }).then((res) => {
      if (res.value) {
        this.usuarios.splice(i, 1);
        this.usuarioSvc.borrarUsuario(usuario.id).subscribe();
      }
    });
  }

}
