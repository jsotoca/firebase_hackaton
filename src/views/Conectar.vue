<template>
    <div class="container">
        <div class="row d-flex justify-content-center">
            <div class="col-5">
               <div class="mt-2" v-if="!conectado">
                        
                        <button type="button" value="CONECTARSE" @click="conectarse" class="btn btn-primary btn-block form-control">CONECTARSE CON GOGOLE</button>
                    </div>
                    <div class="mt-2 mb-2" v-else>
                        <div class="card">
                            <img class="card-img-top img-fluid" :src="usuario.foto">
                            <div class="card-body">
                                <h4 class="card-title">Bienvenido {{usuario.nombre}}</h4>
                            </div>
                        </div>
                    </div>
                    <input  id="salir" type="button" value="DESCONECTARSE" @click="desconectarse" class="btn btn-danger btn-block form-control mt-2">
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
    name: 'conectar',
    data(){
        return{
            conectado : false,
            usuario: {nombre: '',foto: ''}
        }
    },
    methods:{
        // autentificarse con google y popup
        conectarse(){
            const auth = firebase.auth();
            const provider = new firebase.auth.GoogleAuthProvider();
            const promesa = auth.signInWithPopup(provider)
            .then(resultado =>{
                console.log(resultado.user);
                this.conectado = true;
                this.usuario.nombre = resultado.user.displayName.toString();
                this.usuario.foto = resultado.user.photoURL.toString();
                this.registrarse(resultado.user);
            })
            .catch(error =>{
                console.log(error);
            });
        },
        registrarse(user){
            var usuario = {
                uid: user.uid,
                nombres: user.displayName,
                telefono: (this.phoneNumber!=null)? this.phoneNumber : 'N/A',
                email: user.email,
                imagen: user.photoURL
            }
            var bd = firebase.firestore();
            bd.collection("contactos").doc(user.uid).set(usuario)
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        },
        desconectarse(){
            const auth = firebase.auth();
            const promesa = auth.signOut()
            .then(resultado =>{
                console.log('desconectando...');
                this.conectado = false;
            })
            .catch(error =>{
                console.log(error);
            })
        }
    },
    created(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('conectado');
                this.conectado = true;
                this.usuario.nombre = user.displayName.toString();
                this.usuario.foto = user.photoURL.toString();
            } else {
                console.log('desconectado');
            }
        });
    }
}
</script>
