//------------------------------------------------------------------------
// Récupération des produits de l'api
//------------------------------------------------------------------------ 
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {
    console.table(objetProduits);
    lesKanaps(objetProduits);
  })
  .catch((err) => {
    document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur 404, sur ressource api:" + err);
  });
//----------------------------------------------------------------------
// fonction d'affichage des produits de l'api sur la page index
//----------------------------------------------------------------------
function lesKanaps(index) {
  let zoneArticle = document.querySelector("#items");
  for (let article of index) {
    zoneArticle.innerHTML += `<a href="./product.html?_id=${article._id}">
    <article>
      <img src="${article.imageUrl}" alt="${article.altTxt}">
      <h3 class="productName">${article.name}</h3>
      <p class="productDescription">${article.description}</p>
    </article>
  </a>`;
  }
}