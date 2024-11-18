export class UsuarioModel{
    id?: string;
    nombre?: string;
    email?:string;
    password?:string;
    estado?:boolean;

    constructor(){
        this.estado=true;
    }
}