import { defineRule, Form, Field, ErrorMessage, configure } from "vee-validate";
import { required, email, min, max } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import db from "@/config/firebase";
import { query, getDocs, collection, where } from "firebase/firestore";

export default (app) => {   // premier parametre , le nom de la regle ,le second une fonction qui renvoie true ou false, si false , on peux definir le message d erreur plus bas
  defineRule("required", required); //defineRule permet de definir un rule globalement, on peux l'utiliser dans les component , le premeir argument est le nom de la rule, le second => la function
  defineRule("email", email);
  defineRule("min", min);
  defineRule("max", max);
  defineRule("unique", async (value , args) => { // valeur que vee-validate transmet via l'input
    let firebaseTable, tableRow;
    if(Array.isArray(args)){
      [firebaseTable , tableRow] = args
    }else{
      ({firebaseTable , tableRow} = args)
    }
    const q = query(collection(db,firebaseTable), where(tableRow, '==', value))
    const userdoc = await getDocs(q);
    return userdoc.empty      //empty est une methode firebase, on aurait pue dire !userdoc.exists() / renvoie true or false
    // on veux qu'elle soit vide donc true, car le pseudo est donc disponible
  });

  configure({
    generateMessage: localize("en", {
      messages: {
        required: "{field} is required",
        email: "{field} must be a valid Email",
        min: "{field} must be 0:{min} characters long",
        unique:'{field} is already taken',
      },
    }),
  });

  app.component("VeeForm", Form);
  app.component("VeeField", Field);
  app.component("VeeErrorMessage", ErrorMessage);
};
