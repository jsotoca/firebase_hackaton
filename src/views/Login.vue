<template>
    <div class="container">
        <div class="row d-flex justify-content-center">
            <div class="col-5">
                <form id="login">
                    <div class="form-group">
                        <label for="usuario">Ingresar usuario</label>
                        <input type="text" name="usuario" id="usuario" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="clave">Ingresar contraseña</label>
                        <input type="password" name="clave" id="clave" class="form-control">
                    </div>
                    <div class="mt-2" v-if="!conectado">
                        
                        <button type="button" value="CONECTARSE" @click="conectarse" class="btn btn-primary btn-block form-control">CONECTARSE</button>
                        <button type="button" value="REGISTRARSE" @click="registrarse" class="btn btn-success btn-block form-control">DESCONECTARSE</button>
                    </div>
                    <div class="mt-2" v-else>
                        <input id="salir" type="button" value="DESCONECTARSE" @click="desconectarse" class="btn btn-danger btn-block form-control">
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
    name: 'Login',
    data(){
        return{
            conectado: false
        }
    },
    methods:{
        conectarse(){
            const auth = firebase.auth();
            var usuario = document.getElementById('usuario').value;
            var clave = document.getElementById('clave').value;
            const promesa = auth.signInWithEmailAndPassword(usuario,clave)
            .then(estado =>{
                console.log('conectando...');
                this.conectado = true;
            })
            .catch(e =>{
                console.log(e);
            });
        },
        registrarse(){
            const auth = firebase.auth();
            var usuario = document.getElementById('usuario').value;
            var clave = document.getElementById('clave').value;
            const promesa = auth.createUserWithEmailAndPassword(usuario,clave)
            .catch(e =>{
                console.log(e);
            });
        },
        desconectarse(){
            const auth = firebase.auth();
            var promesa = auth.signOut()
            .then(estado =>{
                console.log('desconectando...');
                this.conectado = false;
            })
            .catch(e =>{
                console.log(e);
            });
        }

    }
}
</script>

