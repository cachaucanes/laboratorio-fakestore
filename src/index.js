import './styles.css';

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

const API = `https://api.escuelajs.co/api/v1/products?`;

const getQueryParams = (api) => {
  let nextPage = filters.pagination;
  if (!firstFetch) {
    nextPage = filters.pagination += 1;
  }
  let nextOffset = nextPage == 0 ? 5 : filters.limit * nextPage + 5;
  let queryUpdate = { ...filters, pagination: nextPage, offset: nextOffset };
  return [
    `${api}${new URLSearchParams(queryUpdate).toString()}`,
    queryUpdate.pagination,
  ];
};

const messageAllProducts = () => {
  const output = `
              <p>
                Todos los productos Obtenidos
              </p>
          `;
  let newItem = document.createElement("div");
  newItem.classList.add("AlertMessage");
  newItem.innerHTML = output;
  $app.appendChild(newItem);
  intersectionObserver.unobserve($observe)
};

const getData = async (api) => {
  try {
    const [queryParams, querypagination] = getQueryParams(api);  

    const res = await fetch(queryParams);
    const response = await res.json();
    let products = response;

    if(querypagination > 0 && !products.length){
      messageAllProducts()
    }

    let output = products
      .map((product) => {
        // template
        return `
            <article class="Card">
              <img src="${product.images[0]}" alt="${product.title}" onerror="this.onerror=null;this.src='https://i.imgur.com/hXa5HC2.jpeg';" />
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
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    // rootMargin: '0px 0px 100% 0px',
    root: null, // Observa la ventana completa
    rootMargin: "100px", // Cargar antes de llegar completamente
    threshold: 1.0, // Cuando el div de carga es completamente visible
  }
);

intersectionObserver.observe($observe);
