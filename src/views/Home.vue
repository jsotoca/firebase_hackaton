<template>
  <div class="home container-fluid">
    <div class="row">
      <div class="col-4">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">FORMULARIO DE REGISTRO</h4>
            <form id="formulario" @submit.prevent="guardarDatos">
              <div class="form-group">
                <label for="nombres">Ingresar Nombres: </label>
                <input v-model="nombres" type="text" class="form-control" pattern="[a-zA-Z ]+" title="Ingrese nombres validos. Solo 40 carácteres">
              </div>
              <div class="form-group">
                <label for="nombres">Ingresar Telefono: </label>
                <input v-model="telefono" type="text" class="form-control" pattern="[0-9]{9}" title="Ingrese un celular valido." >
              </div>
              <div class="form-group">
                <label for="nombres">Ingresar Email: </label>
                <input v-model="email" type="text" class="form-control" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Ingrese un email valido.">
              </div>
              <div class="form-group">
                <label for="nombres">Ingresar Foto: </label>
                <input id="fotito" type="file" class="form-control-file" accept="image/*" @change="capturarFoto" required>
              </div>
              <img class="mt-2 mb-2 img-fluid img-thumbnail" v-if="foto!=null" :src="foto" alt="foto" id="output_image">
              <div id="progreso" class="progress mb-2" style="visibility:hidden">
                <div  class="progress-bar progress-bar-striped progress-bar-animated" style="width:0%"></div>
              </div>
              <input type="submit" value="GUARDAR" class="btn btn-success btn-block">
            </form>
              <input v-model="imagen" type="text" id="descargado" hidden>
          </div>
        </div>
      </div>
      <div class="col-8">
        <table class="table table-dark table-stripped">
          <thead>
            <tr>
              <td>N°</td>
              <td>Nombres</td>
              <td>Telefono</td>
              <td>Email</td>
              <td>Imagen</td>
              <td>Opciones</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(contacto,index) of contactos" :key="index">
              <td>{{index+1}}</td>
              <td>{{contacto.nombres}}</td>
              <td>{{contacto.telefono}}</td>
              <td>{{contacto.email}}</td>
              <td><img :src="contacto.imagen" :alt="contacto.nombre"></td>
              <td>
                <button class="btn btn-warning btn-sm mr-2" @click="editarContacto(contacto.id)">Editar</button>
                <button class="btn btn-danger btn-sm" @click="eliminarContacto(contacto.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import firebase, { functions } from 'firebase';
export default {
  name: 'home',
  data(){
    return{
      nombres: '',
      telefono: '',
      email: '',
      imagen: '',
      foto: null,
      captura: null,
      contactos: []
    }
  },
  methods:{
    capturarFoto(event){
      this.foto = event.target.files[0];

      var reader = new FileReader();
      reader.onload = function()
      {
        var output = document.getElementById('output_image');
        output.src = reader.result;
      }
      reader.readAsDataURL(event.target.files[0]);

      console.log(this.foto);
    },
    guardarDatos(){
      document.getElementById('progreso').style.visibility = 'visible'; 
      var storageRef = firebase.storage().ref('contactos/'+this.foto.name);
      var tarea = storageRef.put(this.foto);
      tarea.then(snapshot => {
          storageRef.getDownloadURL().then((URL)=>{
            var db = firebase.firestore();
            db.collection('contactos').add({
                nombres: this.nombres,
                telefono: this.telefono,
                email: this.email,
                imagen: URL.toString()
            });
            this.limpiar();
        });
      });

      tarea.on('state_changed',
      function progress(snapshot){
        var porcentaje = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        document.getElementsByClassName('progress-bar').item(0).setAttribute('aria-valuenow',porcentaje);
        document.getElementsByClassName('progress-bar').item(0).setAttribute('style','width:'+Number(porcentaje)+'%');
        console.log(porcentaje);
      },
      function error(e){
        console.log(e);
      },
      function completed(snapshot){
        document.getElementById('progreso').style.visibility = 'hidden';
        document.getElementById("formulario").reset();
      }
      );
      this.foto = null;
      
    },
    editarContacto(index){
//       var bd = firebase.database().ref();
//       var consulta = bd.child('contactos').child(index);
//       consulta.on("value", function(snapshot) {
//   console.log(snapshot.val());
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });

      // database.ref('contactos').child(index)
      // .once('value')
      // .then(function(snapshot) {
      //   var value = snapshot.val();
      //   console.log('nombres:', value.nombres);
      //   resp.json(value.nombres);
      // })
      // .catch(next);
      // bd.collection('contactos').where('id','==',index).onSnapshot(
      //   coleccion =>{
      //       coleccion.forEach(documento => {
      //           this.cont = {};
      //           this.cont = documento.data();
      //           this.nombres = this.cont.nombres;
      //       });
      //   } 
      // );
    },
    eliminarContacto(index){
      var bd = firebase.firestore();
      bd.collection("contactos").doc(index).delete();
    },
    limpiar(){
      this.nombres = '';
      this.telefono = '';
      this.email = '';
      this.imagen = '';
      this.foto = null;
      this.captura = null;
      this.contactos = []
    }
  },
  created(){
    var bd = firebase.firestore();
    bd.collection('contactos').onSnapshot(
        coleccion =>{
            this.contactos = [];
            coleccion.forEach(documento => {
                this.contactos.push({
                    id: documento.id,
                    ...documento.data()
                });
            });
        } 
    );
  }
}
</script>

<style scoped>
  img{
    max-width:180px;
  }
</style>


