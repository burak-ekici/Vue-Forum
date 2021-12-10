import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, query, where, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA3ZtSkk2XRzjMTcfWCF07-NzwIjspIBMQ",
    authDomain: "vueforum-36077.firebaseapp.com",
    projectId: "vueforum-36077",
    storageBucket: "vueforum-36077.appspot.com",
    messagingSenderId: "177804394586",
    appId: "1:177804394586:web:0e01ce758f987944175863"
};

// pour debugger si erreur
if(!firebaseConfig.apiKey) throw new Error("Missing firebase : apiKey")
if(!firebaseConfig.authDomain) throw new Error("Missing firebase : authDomain")
if(!firebaseConfig.projectId) throw new Error("Missing firebase : projectId")
if(!firebaseConfig.storageBucket) throw new Error("Missing firebase : storageBucket")
if(!firebaseConfig.messagingSenderId) throw new Error("Missing firebase : messagingSenderId")
if(!firebaseConfig.appId) throw new Error("Missing firebase : appId")

const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp);

export default  db ;


// model de requete firebase 
// GET

// const threadRef= doc(db,'threads', params) // renvoie une ref de firebase
// db => const db = getFirestore(firebaseApp); ligne 23,*
// 'threads' => nom de la collection dans firestore ,
// params => where params, va chercher les docs qui ont le nom donné dans params   va chercher la doc mais ne le recupere pas ,il faut utiliser getDocs() 

// const threadSnap = await getDoc(threadRef)   // recupere le document selectionné par threadRef sous forme d'objet
// const thread = threadSnap.data()  // on recupere la valeur

// onSnapshot(doc(db,'threads', id) ou threadRef, callbackFunction)

// Get on Snapshot

// async fetchAllCategories(context){
//   const categories = [];
//   // recupere tous les threads de firebase
//   const AllCategories = await getDocs(collection(db, "categories"))
//   AllCategories.forEach(document=> {
//       const item = {id : document.id , ...document.data()}
//       context.commit('setItem', {resource : 'categories' , item})
//       categories.push(document.data())
//       onSnapshot(doc(db,'categories',document.id),(el)=>{
//           const item = {id : el.id , ...el.data()}
//           context.commit('setItem', {resource : 'categories' , item})
//           const index = categories.indexOf(el.data())
//           if(index != -1){
//               categories.push(el.data())
//           }else{
//               categories[index] = el.data()
//           }
//       })
//   })
//   return categories;

