// Importamos los módulos necesarios para el servicio
import { Injectable } from '@angular/core'; // Decorador para inyectar este servicio en cualquier componente
import { environment } from '../../../environments/environment'; // Importamos las configuraciones del entorno, que contiene la URL del backend
import { HttpClient } from '@angular/common/http'; // HttpClient permite hacer solicitudes HTTP
import { map } from 'rxjs/operators'; // map transforma los datos recibidos en las respuestas HTTP
import { UsuarioModel } from '../../models/usuario.model'; // Modelo de datos del usuario

// Definimos la constante URL que apunta al backend, obtenida desde el archivo de entorno
const URL = environment.urlServer;

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación
})
export class PageService {

  constructor(private http: HttpClient) { } // Inyectamos HttpClient para realizar solicitudes HTTP

  // Método para crear un usuario en el backend
  crearUsuario(usuario: UsuarioModel) {
    // Hacemos una solicitud POST al endpoint del backend y enviamos el objeto usuario
    return this.http.post(`${URL}/usuarios.json`, usuario).pipe(
      map((res: any) => {
        // Extraemos el ID de la respuesta y lo asignamos al usuario
        usuario.id = res.name;
        return usuario; // Devolvemos el usuario con su nuevo ID
      })
    );
  }

  // Método para actualizar un usuario en el backend
  actualizarUsuario(usuario: UsuarioModel) {
    // Creamos una copia del usuario para evitar modificar el objeto original
    const usuarioTemp = { ...usuario };
    delete usuarioTemp.id; // Eliminamos la propiedad 'id' ya que no se debe enviar en la actualización

    // Hacemos una solicitud PUT al endpoint, especificando el ID del usuario
    return this.http.put(`${URL}/usuarios/${usuario.id}.json`, usuarioTemp);
  }

  // Método para obtener todos los usuarios
  getUsuarios() {
    return this.http.get(`${URL}/usuarios.json`).pipe(
      map(this.arreglo) // Transformamos la respuesta en un array de usuarios usando el método privado 'arreglo'
    );
  }

  // Método privado que transforma el objeto de usuarios en un array de objetos UsuarioModel
  private arreglo(usuariosObj: any): UsuarioModel[] {
    const usuarios: UsuarioModel[] = [];
    if (usuariosObj === null) {
      return usuarios; // Devuelve un array vacío si no hay usuarios en la base de datos
    }

    // Recorremos cada entrada en el objeto recibido y le asignamos un ID
    for (let registro in usuariosObj) {
      usuariosObj[registro].id = registro;
      usuarios.push(usuariosObj[registro]);
    }
    return usuarios; // Devolvemos el array de usuarios
  }

  // Método para obtener un usuario específico por ID
  getUsuario(id: string) {
    return this.http.get(`${URL}/usuarios/${id}.json`);
  }

  // Método para borrar un usuario por ID
  borrarUsuario(id: any) {
    return this.http.delete(`${URL}/usuarios/${id}.json`);
  }

  // Método para verificar si un correo ya está registrado
  verificarEmail(email: any) {
    return this.getUsuarios().pipe(
      map((usuarios: UsuarioModel[]) => {
        // Comprobamos si alguno de los usuarios tiene el mismo correo
        return usuarios.some(usuario => usuario.email === email);
      })
    );
  }
}
