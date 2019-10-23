export class User {
    public nombre: string;
    public uid: string;
    public email: string;

    constructor(nombre, uid, email) {
        this.nombre = nombre;
        this.uid = uid;
        this.email = email;
    }
}
