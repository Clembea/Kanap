//--------------------------------------------------------------------------
// Récupération de l'id du produit via l' URL
//--------------------------------------------------------------------------
//la variable params récupère l'url de la page   
const params = new URLSearchParams(document.location.search);
// la variable id va récupérer la valeur du paramètre _id
const id = params.get("_id");
console.log(id); 
//--------------------------------------------------------------------------
// Récupération des produits de l'api et traitement des données (voir script.js)
//--------------------------------------------------------------------------
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {
    lesProduits(objetProduits);
  })
  .catch((err) => {
    document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur 404, sur ressource api: " + err);
  });
//------------------------------------------------------------------------
// Création d'objet articleClient
//------------------------------------------------------------------------
let articleClient = {};
articleClient._id = id;
//------------------------------------------------------------------------
// fonction d'affichage du produit de l'api
//------------------------------------------------------------------------
function lesProduits(produit) {
  let imageAlt = document.querySelector("article div.item__img");
  let titre = document.querySelector("#title");
  let prix = document.querySelector("#price");
  let description = document.querySelector("#description");
  let couleurOption = document.querySelector("#colors");
  for (let choix of produit) {
    if (id === choix._id) {
      imageAlt.innerHTML = `<img src="${choix.imageUrl}" alt="${choix.altTxt}">`;
      titre.textContent = `${choix.name}`;
      prix.textContent = `${choix.price}`;
      description.textContent = `${choix.description}`;
      for (let couleur of choix.colors) {
        couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
      }
    }
  }
  console.log("affichage effectué");
}
//------------------------------------------------------------------------
// choix couleur dynamique
//------------------------------------------------------------------------
let choixCouleur = document.querySelector("#colors");
choixCouleur.addEventListener("input", (ec) => {
  let couleurProduit;
  couleurProduit = ec.target.value;
  articleClient.couleur = couleurProduit;
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
  console.log(couleurProduit);
});
//-------------------------------------------------------------------------
// choix quantité dynamique
//------------------------------------------------------------------------
let choixQuantité = document.querySelector('input[id="quantity"]');
let quantitéProduit;
choixQuantité.addEventListener("input", (eq) => {
  quantitéProduit = eq.target.value;
  articleClient.quantité = quantitéProduit;
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
  console.log(quantitéProduit);
});
//------------------------------------------------------------------------
// conditions de validation du clic via le bouton ajouter au panier
//------------------------------------------------------------------------
let choixProduit = document.querySelector("#addToCart");
choixProduit.addEventListener("click", () => {
  if (
    articleClient.quantité < 1 ||
    articleClient.quantité > 100 ||
    articleClient.quantité === undefined ||
    articleClient.couleur === "" ||
    articleClient.couleur === undefined
  ) {
    alert("Pour valider le choix de cet article, veuillez renseigner une couleur, et/ou une quantité valide entre 1 et 100");
  } else {
    Panier();
    console.log("clic effectué");
    document.querySelector("#addToCart").style.color = "rgb(0, 205, 0)";
    document.querySelector("#addToCart").textContent = "Produit ajouté !";
  }
});
//------------------------------------------------------------------------
// Déclaration de tableaux utiles 
//------------------------------------------------------------------------
let choixProduitClient = [];
let produitsEnregistrés = [];
let produitsTemporaires = [];
let produitsAPousser = [];
//-------------------------------------------------------------------------
// fonction ajoutPremierProduit qui ajoute l'article choisi dans le tableau vierge
//-------------------------------------------------------------------------
function ajoutPremierProduit() {
  console.log(produitsEnregistrés);
  if (produitsEnregistrés === null) {
    choixProduitClient.push(articleClient);
    console.log(articleClient);
    return (localStorage.panierStocké = JSON.stringify(choixProduitClient));
  }
}
//-------------------------------------------------------------------------
// fonction ajoutAutreProduit qui ajoute l'article dans le tableau non vierge et fait un tri
//------------------------------------------------------------------------- 
function ajoutAutreProduit() {
  produitsAPousser = [];
  produitsTemporaires.push(articleClient);
  produitsAPousser = [...produitsEnregistrés, ...produitsTemporaires];
  produitsAPousser.sort(function triage(a, b) {
    if (a._id < b._id) return -1;
    if (a._id > b._id) return 1;
    if (a._id = b._id){
      if (a.couleur < b.couleur) return -1;
      if (a.couleur > b.couleur) return 1;
    }
    return 0;
  });
  produitsTemporaires = [];
  return (localStorage.panierStocké = JSON.stringify(produitsAPousser));
}
//--------------------------------------------------------------------
// fonction Panier qui ajuste la quantité si le produit est déja dans le tableau, sinon le rajoute si tableau il y a, ou créait le tableau avec un premier article choisi 
//--------------------------------------------------------------------
function Panier() {
  produitsEnregistrés = JSON.parse(localStorage.getItem("panierStocké"));
  if (produitsEnregistrés) {
    for (let choix of produitsEnregistrés) {
      if (choix._id === id && choix.couleur === articleClient.couleur) {
        alert("RAPPEL: Vous aviez déja choisit cet article.");
        let additionQuantité = parseInt(choix.quantité) + parseInt(quantitéProduit);
        choix.quantité = JSON.stringify(additionQuantité);
        return (localStorage.panierStocké = JSON.stringify(produitsEnregistrés));
      }
    }
    return ajoutAutreProduit();
  }
  return ajoutPremierProduit();
}