const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
let pagination = localStorage.getItem('pagination')
let firstFetch = true

const savePagToLocalStorage = (pag) => {
  localStorage.setItem('pagination', pag.toString())
}

if(typeof pagination !== "string") {
  savePagToLocalStorage(0)
  pagination = '0'
}

  
let filters = {
  limit : 10,
  pagination : parseInt(pagination),
  offset: 5
}
console.log('pagination', pagination);


console.log(filters);

let isLoading = false;

/* git commit -m 'Re
solviendo el primer problema, analizar api, iniciar en el producto 5 */

const API = `https://api.escuelajs.co/api/v1/products?`;
/*  https://api.escuelajs.co/api/v1/products?offset=0&limit=10 */


const getData = (api) => {
  let nextPage = filters.pagination
  if (!firstFetch) {
   nextPage = filters.pagination += 1
  }
  let nextOffset = nextPage == 0 ? 5 : (filters.limit * nextPage) + 5
  let queryUpdate = {...filters, pagination:nextPage, offset: nextOffset}
  const queryParams = `${api}${new URLSearchParams(queryUpdate).toString()}` ;
  console.log(queryParams);
  
  fetch(queryParams)
    .then((response) => response.json())
    .then((response) => {      
      
      let products = response;
      let output = products
        .map((product, i) => {
          // template
          return `
            <li>
              Nro: ${i + 1} - Name Product: ${product.title} - id: ${product.id}
            </li>
          `;
        }).join("");

      let newItem = document.createElement("section");
      newItem.classList.add("Item");
      newItem.innerHTML = output;
      $app.appendChild(newItem);
      if (firstFetch) {
        firstFetch = false
      }else{
        savePagToLocalStorage(queryUpdate.pagination)
      }      
    })
    .catch((error) => {
      console.log(error);
      isLoading = false;
    });
};

const loadData = () => {
  getData(API);
};

const intersectionObserver = new IntersectionObserver((entries) => {
    console.log(entries);
    if (entries[0].isIntersecting) {      
      loadData();
    }

    // logic...
  },
  {
    // rootMargin: '0px 0px 100% 0px',
    root: null, // Observa la ventana completa
    rootMargin: "100px", // Cargar antes de llegar completamente
    threshold: 1.0, // Cuando el div de carga es completamente visible
  }
);


  intersectionObserver.observe($observe);


