import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsuarioModel } from '../../models/usuario.model';
import * as bcrypt from 'bcryptjs'; 
import Swal from 'sweetalert2';  
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private apiUrl = environment.urlServer;

  
  constructor(private http: HttpClient, private router: Router) { }

  
  login(usuario: UsuarioModel) {
    
    // Realiza una consulta HTTP al servidor para obtener los datos del usuario con el email ingresado
    this.http.get<{ [key: string]: UsuarioModel }>(`${this.apiUrl}/usuarios.json?orderBy="email"&equalTo="${usuario.email}"`)
      .subscribe((res: { [key: string]: UsuarioModel }) => {
        // Si se encuentra un usuario, res contendrá los datos, si no, será un objeto vacío
        const user = Object.values(res)[0]; // Extrae el primer usuario encontrado (si existe)

        if (user) {  // Si se encontró el usuario en la base de datos
          // Verifica si el usuario está inactivo (estado = false)
          if (user.estado === false ) {
            
            Swal.fire('ERROR', 'El usuario esta inactivo en el sistema', 'error'); // Muestra alerta si el usuario está inactivo
            return;  // Sale de la función si el usuario está inactivo
          }
          // Si el email del usuario coincide con el proporcionado
          if (user.email === usuario.email) {
            // Compara la contraseña ingresada con la almacenada en el sistema
            const passwordToCompare = usuario.password ?? '';  // Usa la contraseña ingresada
            const storedPassword = user.password ?? '';  // La contraseña almacenada en la base de datos
            const isMatch = bcrypt.compareSync(passwordToCompare, storedPassword);  // Compara las contraseñas usando bcrypt

            if (isMatch) {  // Si las contraseñas coinciden
              console.log('Login exitoso');

              // Almacena la información del usuario (sin la contraseña) en el localStorage
              const usuarioTemp = {
                ...user
              }
              delete usuarioTemp.password;  // Elimina la contraseña antes de almacenarlo
              localStorage.setItem('currentUser', JSON.stringify(usuarioTemp));  // Guarda el usuario logueado en el localStorage

              // Redirige al panel de administración
              this.router.navigate(['/admin-panel']);
            } else {
              console.error('Contraseña incorrecta');
              Swal.fire('ERROR', 'Revise su email ó contraseña que estén bien escritos', 'error'); // Alerta si las contraseñas no coinciden
            }
          } else {
            console.error('El email no coincide');
            Swal.fire('ERROR', 'Revise su email ó contraseña que estén bien escritos', 'error'); // Alerta si el email no coincide
          }
        } else {  // Si no se encontró el usuario
          console.error('Usuario no encontrado');
          Swal.fire('ERROR', 'Revise su email ó contraseña que estén bien escritos', 'error'); // Alerta si el usuario no existe
        }
      });
  }

  
}
