// pour différancier la page confirmation et panier
const page = document.location.href;
//----------------------------------------------------------------
// Récupération des produits de l'api
//----------------------------------------------------------------
if (page.match("cart")) {
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {
      console.log(objetProduits);
      affichagePanier(objetProduits);
  })
  .catch((err) => {
      document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
      console.log("erreur 404, sur ressource api: " + err);
  });
} else {
  console.log("sur page confirmation");
}
//--------------------------------------------------------------
// Fonction détermine les conditions d'affichage des produits du panier
//--------------------------------------------------------------
function affichagePanier(index) {
  let panier = JSON.parse(localStorage.getItem("panierStocké"));
   if (panier && panier.length != 0) {
    for (let choix of panier) {
      console.log(choix);
      for (let g = 0, h = index.length; g < h; g++) {
        if (choix._id === index[g]._id) {
          choix.name = index[g].name;
          choix.prix = index[g].price;
          choix.image = index[g].imageUrl;
          choix.description = index[g].description;
          choix.alt = index[g].altTxt;
        }
      }
    }
    affiche(panier);
  } else {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
  }
  modifQuantité();
  suppression();
}
//--------------------------------------------------------------
//Fonction d'affichage d'un panier (tableau)
//--------------------------------------------------------------
function affiche(indexé) {
  let zonePanier = document.querySelector("#cart__items");
  // on créait les affichages des produits du panier via un map et introduction de dataset dans le code
  zonePanier.innerHTML += indexé.map((choix) => 
  `<article class="cart__item" data-id="${choix._id}" data-couleur="${choix.couleur}" data-quantité="${choix.quantité}" data-prix="${choix.prix}"> 
    <div class="cart__item__img">
      <img src="${choix.image}" alt="${choix.alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${choix.name}</h2>
        <span>couleur : ${choix.couleur}</span>
        <p data-prix="${choix.prix}">${choix.prix} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choix.quantité}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${choix._id}" data-couleur="${choix.couleur}">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
    ).join(""); //on remplace les virgules de jonctions des objets du tableau par un vide
  // reste à l'écoute des modifications de quantité pour l'affichage et actualiser les données
  totalProduit();
}
//--------------------------------------------------------------
// fonction modifQuantité on modifie dynamiquement les quantités du panier
//--------------------------------------------------------------
function modifQuantité() {
  const cart = document.querySelectorAll(".cart__item");
  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
      let panier = JSON.parse(localStorage.getItem("panierStocké"));
      for (article of panier)
        if (
          article._id === cart.dataset.id &&
          cart.dataset.couleur === article.couleur
        ) {
          article.quantité = eq.target.value;
          localStorage.panierStocké = JSON.stringify(panier);
          cart.dataset.quantité = eq.target.value;
          totalProduit();
        }
    });
  });
}
//--------------------------------------------------------------
// fonction supression on supprime un article dynamiquement du panier et donc de l'affichage
//--------------------------------------------------------------
function suppression() {
  const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
  cartdelete.forEach((cartdelete) => {
    cartdelete.addEventListener("click", () => {
      // appel de la ressource du local storage
      let panier = JSON.parse(localStorage.getItem("panierStocké"));
      for (let d = 0, c = panier.length; d < c; d++)
        if (
          panier[d]._id === cartdelete.dataset.id &&
          panier[d].couleur === cartdelete.dataset.couleur
        ) {
          const num = [d];
          let nouveauPanier = JSON.parse(localStorage.getItem("panierStocké"));
          nouveauPanier.splice(num, 1);
          if (nouveauPanier && nouveauPanier.length == 0) {
            document.querySelector("#totalQuantity").innerHTML = "0";
            document.querySelector("#totalPrice").innerHTML = "0";
            document.querySelector("h1").innerHTML =
              "Vous n'avez pas d'article dans votre panier";
          }
          // on renvoit le nouveau panier converti dans le local storage et on joue la fonction
          localStorage.panierStocké = JSON.stringify(nouveauPanier);
          totalProduit(); 
          return location.reload();
        }
    });
  });
}
//--------------------------------------------------------------
// fonction ajout nombre total produit et coût total
//--------------------------------------------------------------
function totalProduit() {
  let totalArticle = 0;
  let totalPrix = 0;
  const cart = document.querySelectorAll(".cart__item");
  cart.forEach((cart) => {
    totalArticle += JSON.parse(cart.dataset.quantité);
    totalPrix += cart.dataset.quantité * cart.dataset.prix;
  });
  document.getElementById("totalQuantity").textContent = totalArticle;
  document.getElementById("totalPrice").textContent = totalPrix;
}
//--------------------------------------------------------------
//  formulaire
//--------------------------------------------------------------
// les données du client seront stockées dans ce tableau pour la commande sur page panier
if (page.match("cart")) {
  var contactClient = {};
  localStorage.contactClient = JSON.stringify(contactClient);
  var prenom = document.querySelector("#firstName");
  prenom.classList.add("regex_texte");
  var nom = document.querySelector("#lastName");
  nom.classList.add("regex_texte");
  var ville = document.querySelector("#city");
  ville.classList.add("regex_texte");
  var adresse = document.querySelector("#address");
  adresse.classList.add("regex_adresse");
  var email = document.querySelector("#email");
  email.classList.add("regex_email");
  var regexTexte = document.querySelectorAll(".regex_texte");
  document.querySelector("#email").setAttribute("type", "text");
}
//--------------------------------------------------------------
//regex 
//--------------------------------------------------------------
// /^ début regex qui valide les caratères a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 31 caratères (nombre de caractère maximum sur carte identité) {1,31} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
let regexLettre = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
// /^ début regex qui valide les caratères chiffre lettre et caratères spéciaux a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ aussi les espaces blancs et tiret \s- comprit entre 1 et 60 caratères (nombre de caractère maximum sur carte identité) {1,60} et on termine la regex $/i en indiquant que les éléments selectionnés ne sont pas sensible à la casse
let regexChiffreLettre = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
let regValideEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
let regMatchEmail = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
//--------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex
//--------------------------------------------------------------
if (page.match("cart")) {
  regexTexte.forEach((regexTexte) =>
    regexTexte.addEventListener("input", (e) => {
      valeur = e.target.value;
      let regNormal = valeur.search(regexLettre);
      if (regNormal === 0) {
        contactClient.firstName = prenom.value;
        contactClient.lastName = nom.value;
        contactClient.city = ville.value;
      }
      if (
        contactClient.city !== "" &&
        contactClient.lastName !== "" &&
        contactClient.firstName !== "" &&
        regNormal === 0
      ) {
        contactClient.regexNormal = 3;
      } else {
        contactClient.regexNormal = 0;
      }
      localStorage.contactClient = JSON.stringify(contactClient);
      couleurRegex(regNormal, valeur, regexTexte);
      valideClic();
    })
  );
}
//------------------------------------
// le champ écouté via la regex regexLettre fera réagir, grâce à texteInfo, la zone concernée
//------------------------------------
texteInfo(regexLettre, "#firstNameErrorMsg", prenom);
texteInfo(regexLettre, "#lastNameErrorMsg", nom);
texteInfo(regexLettre, "#cityErrorMsg", ville);
//--------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex
//--------------------------------------------------------------
if (page.match("cart")) {
  let regexAdresse = document.querySelector(".regex_adresse");
  regexAdresse.addEventListener("input", (e) => {
    valeur = e.target.value;
    let regAdresse = valeur.search(regexChiffreLettre);
    if (regAdresse == 0) {
      contactClient.address = adresse.value;
    }
    if (contactClient.address !== "" && regAdresse === 0) {
      contactClient.regexAdresse = 1;
    } else {
      contactClient.regexAdresse = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    couleurRegex(regAdresse, valeur, regexAdresse);
    valideClic();
  });
}
//------------------------------------
// le champ écouté via la regex regexChiffreLettre fera réagir, grâce à texteInfo, la zone concernée
//------------------------------------
texteInfo(regexChiffreLettre, "#addressErrorMsg", adresse);
//--------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ce champ est ok d'après les regex
//--------------------------------------------------------------
if (page.match("cart")) {
  let regexEmail = document.querySelector(".regex_email");
  regexEmail.addEventListener("input", (e) => {
    valeur = e.target.value;
    let regMatch = valeur.match(regMatchEmail);
    let regValide = valeur.search(regValideEmail);
    if (regValide === 0 && regMatch !== null) {
      contactClient.email = email.value;
      contactClient.regexEmail = 1;
    } else {
      contactClient.regexEmail = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    couleurRegex(regValide, valeur, regexEmail);
    valideClic();
  });
}
//------------------------------------
// texte sous champ email
//------------------------------------
if (page.match("cart")) {
  email.addEventListener("input", (e) => {
    valeur = e.target.value;
    let regMatch = valeur.match(regMatchEmail);
    let regValide = valeur.search(regValideEmail);
    if (valeur === "" && regMatch === null) {
      document.querySelector("#emailErrorMsg").textContent = "Veuillez renseigner votre email.";
      document.querySelector("#emailErrorMsg").style.color = "white";
    } else if ( regValide !== 0) {
      document.querySelector("#emailErrorMsg").innerHTML = "Caractère non valide";
      document.querySelector("#emailErrorMsg").style.color = "white";
    } else if (valeur != "" && regMatch == null) {
      document.querySelector("#emailErrorMsg").innerHTML = "Caratères acceptés pour ce champ. Forme email pas encore conforme";
      document.querySelector("#emailErrorMsg").style.color = "white";
    } else {
      document.querySelector("#emailErrorMsg").innerHTML = "Forme email conforme.";
      document.querySelector("#emailErrorMsg").style.color = "white";
    }
  });
}
//--------------------------------------------------------------
// fonction couleurRegex qui modifira la couleur de l'input par remplissage tapé, aide visuelle et accessibilité
//--------------------------------------------------------------
let valeurEcoute = "";
function couleurRegex(regSearch, valeurEcoute, inputAction) {
  if (valeurEcoute === "" && regSearch != 0) {
    inputAction.style.backgroundColor = "white";
    inputAction.style.color = "black";
  } else if (valeurEcoute !== "" && regSearch != 0) {
    inputAction.style.backgroundColor = "rgb(220, 50, 50)";
    inputAction.style.color = "white";
  } else {
    inputAction.style.backgroundColor = "rgb(0, 138, 0)";
    inputAction.style.color = "white";
  }
}
//--------------------------------------------------------------
// fonction d'affichage individuel des paragraphes sous input sauf pour l'input email
//--------------------------------------------------------------
function texteInfo(regex, pointage, zoneEcoute) {
      if (page.match("cart")) {
      zoneEcoute.addEventListener("input", (e) => {
      valeur = e.target.value;
      index = valeur.search(regex);
      if (valeur === "" && index != 0) {
        document.querySelector(pointage).textContent = "Veuillez renseigner ce champ.";
        document.querySelector(pointage).style.color = "white";
      } else if (valeur !== "" && index != 0) {
        document.querySelector(pointage).innerHTML = "Reformulez cette donnée";
        document.querySelector(pointage).style.color = "white";
      } else {
      document.querySelector(pointage).innerHTML = "Caratères acceptés pour ce champ.";
      document.querySelector(pointage).style.color = "white";
      }
    });
  }
}
//--------------------------------------------------------------
// Fonction de validation/d'accés au clic du bouton du formulaire
//--------------------------------------------------------------
let commande = document.querySelector("#order");
function valideClic() {
  let contactRef = JSON.parse(localStorage.getItem("contactClient"));
  let somme =
    contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  if (somme === 5) {
    commande.removeAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Commander !");
  } else {
    commande.setAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Remplir le formulaire");
  }
}
//----------------------------------------------------------------
// Envoi de la commande
//----------------------------------------------------------------
if (page.match("cart")) {
  commande.addEventListener("click", (e) => {
    // empeche de recharger la page on prévient le reload du bouton
    e.preventDefault();
    valideClic();
    envoiPaquet();
  });
}
//----------------------------------------------------------------
// fonction récupérations des id puis mis dans un tableau
//----------------------------------------------------------------
// définition du panier quine comportera que les id des produits choisi du local storage
let panierId = [];
function tableauId() {
// appel des ressources
let panier = JSON.parse(localStorage.getItem("panierStocké"));
// récupération des id produit dans panierId
if (panier && panier.length > 0) {
  for (let indice of panier) {
    panierId.push(indice._id);
  }
} else {
  console.log("le panier est vide");
  document.querySelector("#order").setAttribute("value", "Panier vide!");
}
}
//----------------------------------------------------------------
// fonction récupération des donnée client et panier avant transformation
//----------------------------------------------------------------
let contactRef;
let commandeFinale;
function paquet() {
  contactRef = JSON.parse(localStorage.getItem("contactClient"));
  commandeFinale = {
    contact: {
      firstName: contactRef.firstName,
      lastName: contactRef.lastName,
      address: contactRef.address,
      city: contactRef.city,
      email: contactRef.email,
    },
    products: panierId,
  };
}
//----------------------------------------------------------------
// fonction sur la validation de l'envoi
//----------------------------------------------------------------
function envoiPaquet() {
  tableauId();
  paquet();
  console.log(commandeFinale);
  let somme = contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  if (panierId.length != 0 && somme === 5) {
    // envoi à la ressource api
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandeFinale),
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
      })
      .catch(function (err) {
        console.log(err);
        alert("erreur");
      });
  }
}
//------------------------------------------------------------
// fonction affichage autoinvoquée du numéro de commande et vide du storage lorsque l'on est sur la page confirmation
//------------------------------------------------------------
(function Commande() {
  if (page.match("confirmation")) {
    sessionStorage.clear();
    localStorage.clear();
    let numCom = new URLSearchParams(document.location.search).get("commande");
    document.querySelector("#orderId").innerHTML = `<br>${numCom}<br>Merci pour votre achat`;
    console.log("valeur de l'orderId venant de l'url: " + numCom);
    //réinitialisation du numero de commande
    numCom = undefined;
  } else {
    console.log("sur page cart");
  }
})();