const $app = document.getElementById("app");
const $observe = document.getElementById("observe");

localStorage.setItem("pagination", "0");
let pagination = localStorage.getItem("pagination");
let firstFetch = true;

const savePagToLocalStorage = (pag) => {
  localStorage.setItem("pagination", pag.toString());
};

if (typeof pagination !== "string") {
  savePagToLocalStorage(0);
  pagination = "0";
}

let filters = {
  limit: 10,
  pagination: parseInt(pagination),
  offset: 5,
};
console.log("pagination", pagination);

console.log(filters);

let isLoading = false;

/* git commit -m 'Re
solviendo el primer problema, analizar api, iniciar en el producto 5 */

const API = `https://api.escuelajs.co/api/v1/products?`;
/*  https://api.escuelajs.co/api/v1/products?offset=0&limit=10 */


const getQueryParams = (api) => {
  let nextPage = filters.pagination;
    if (!firstFetch) {
      nextPage = filters.pagination += 1;
    }
    let nextOffset = nextPage == 0 ? 5 : filters.limit * nextPage + 5;
    let queryUpdate = { ...filters, pagination: nextPage, offset: nextOffset };
    return [`${api}${new URLSearchParams(queryUpdate).toString()}`, queryUpdate.pagination];
}

const getData = async (api) => {
  try {    
    const [queryParams, querypagination] = getQueryParams(api)
    console.log("....queryParams", queryParams);

    const res = await fetch(queryParams);
    const response = await res.json();
    let products = response;
    console.log(products);

    let output = products
      .map((product) => {
        // template
        return `
            <article class="Card">
              <img src="${product.images[0]}" description="Imagen del producto ${product.title}" onerror="this.onerror=null;this.src='https://i.imgur.com/hXa5HC2.jpeg';" />
              <h2>
                ${product.title}
                <small>$ ${product.price}</small>
              </h2>
            </article>
          `;
      })
      .join("");

    let newItem = document.createElement("section");
    newItem.classList.add("Items");
    newItem.innerHTML = output;
    $app.appendChild(newItem);
    if (firstFetch) {
      firstFetch = false;
    } else {
      savePagToLocalStorage(querypagination);
    }
  } catch (error) {
    console.log(error);
  }
};

const loadData = () => {
  getData(API);
};

const intersectionObserver = new IntersectionObserver(
  (entries) => {
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
