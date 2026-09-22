/* =========================================================
   STOCKLY V5 — PART 2
   DATA + CORE ENGINE + NAVIGATION
   ========================================================= */

const PRODUCT_KEY = "stockly_products";
const TRANSACTION_KEY = "stockly_transactions";
const PARTY_KEY = "stockly_parties";
const DARK_KEY = "stockly_dark";
const MEETING_KEY = "stockly_meetings";


let products = [];
let transactions = [];
let parties = [];
let meetings = [];


/* ================= DATA LOADING ================= */

function loadData() {

  try {
    products =
      JSON.parse(
        localStorage.getItem(PRODUCT_KEY)
      ) || [];

    if (!Array.isArray(products)) products = [];

  } catch (error) {
    products = [];
  }


  try {
    transactions =
      JSON.parse(
        localStorage.getItem(TRANSACTION_KEY)
      ) || [];

    if (!Array.isArray(transactions)) transactions = [];

  } catch (error) {
    transactions = [];
  }


  try {
    parties =
      JSON.parse(
        localStorage.getItem(PARTY_KEY)
      ) || [];

    if (!Array.isArray(parties)) parties = [];

  } catch (error) {
    parties = [];
  }

  try {
    meetings = JSON.parse(localStorage.getItem(MEETING_KEY)) || [];
    if (!Array.isArray(meetings)) meetings = [];
  } catch (error) {
    meetings = [];
  }

}


/* ================= DATA SAVING ================= */

function saveProducts() {

  localStorage.setItem(
    PRODUCT_KEY,
    JSON.stringify(products)
  );

}


function saveTransactions() {

  localStorage.setItem(
    TRANSACTION_KEY,
    JSON.stringify(transactions)
  );

}


function saveParties() {

  localStorage.setItem(
    PARTY_KEY,
    JSON.stringify(parties)
  );

}

function saveMeetings() {
  localStorage.setItem(MEETING_KEY, JSON.stringify(meetings));
}


/* ================= ID GENERATOR ================= */

function makeId(prefix = "id") {

  return (
    prefix +
    "_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 8)
  );

}


/* ================= MONEY ================= */

function money(value) {

  const number =
    Number(value) || 0;

  return "₹" +
    number.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2
      }
    );

}


/* ================= NUMBER ================= */

function num(value) {

  const number =
    parseFloat(value);

  return Number.isFinite(number)
    ? number
    : 0;

}


/* ================= ESCAPE HTML ================= */

function esc(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* ================= DATE ================= */

function formatDate(date) {

  const d =
    new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "";
  }

  return d.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


/* ================= TOAST ================= */

let toastTimer;


function toast(message) {

  const box =
    document.getElementById("toast");

  if (!box) return;

  box.textContent =
    message;

  box.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(
      () => {
        box.classList.remove("show");
      },
      2200
    );

}


/* ================= PAGE NAVIGATION ================= */

function page(name) {

  document
    .querySelectorAll(".page")
    .forEach(
      section => {

        section.classList.remove(
          "active"
        );

      }
    );


  const target =
    document.getElementById(name);

  if (target) {

    target.classList.add(
      "active"
    );

  }


  document
    .querySelectorAll(".nav-btn")
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.page === name
        );

      }
    );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  refreshPage(name);

}


/* ================= PAGE REFRESH ================= */

function refreshPage(name) {

  if (name === "home") {

    renderDashboard();

  }


  if (name === "products") {

    renderProducts();

  }


  if (name === "parties") {

    renderParties();

  }


  if (name === "sales") {

    renderSales();

  }


  if (name === "invoices") {

    renderInvoices();

  }


  if (name === "purchases") {

    renderPurchases();

  }


  if (name === "reports") {

    renderReports();

  }

  if (name === "roughbook") {

    renderMeetings();

  }

}


/* ================= MODAL ================= */

function showModal(title, html) {

  const overlay =
    document.getElementById(
      "modalOverlay"
    );

  const titleBox =
    document.getElementById(
      "modalTitle"
    );

  const body =
    document.getElementById(
      "modalBody"
    );


  if (!overlay || !titleBox || !body) {
    return;
  }


  titleBox.textContent =
    title;

  body.innerHTML =
    html;

  overlay.classList.add(
    "show"
  );

  document.body.classList.add(
    "modal-open"
  );

}


function closeModal(event) {

  if (
    event &&
    event.target !==
      document.getElementById(
        "modalOverlay"
      )
  ) {
    return;
  }


  const overlay =
    document.getElementById(
      "modalOverlay"
    );

  if (!overlay) return;

  overlay.classList.remove(
    "show"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


/* ================= TOTAL STOCK ================= */

function getTotalStock() {

  return products.reduce(
    (total, product) =>
      total + num(product.stock),
    0
  );

}


/* ================= INVENTORY VALUE ================= */

function getInventoryValue() {

  return products.reduce(
    (total, product) =>
      total +
      (
        num(product.stock) *
        num(product.buyPrice)
      ),
    0
  );

}


/* ================= LOW STOCK ================= */

function isLowStock(product) {

  return (
    num(product.stock) <=
    num(product.minStock)
  );

}


function getLowStockProducts() {

  return products.filter(
    product =>
      isLowStock(product)
  );

}


/* ================= SALES TOTAL ================= */

function getSalesTotal() {

  return transactions
    .filter(
      transaction =>
        transaction.type === "sale"
    )
    .reduce(
      (total, transaction) =>
        total +
        num(transaction.total),
      0
    );

}


/* ================= PROFIT TOTAL ================= */

function getProfitTotal() {

  return transactions
    .filter(
      transaction =>
        transaction.type === "sale"
    )
    .reduce(
      (total, transaction) =>
        total +
        num(transaction.profit),
      0
    );

}


/* ================= CUSTOMER CREDIT ================= */

function getPartyBalance(partyId) {

  const party =
    parties.find(
      p => p.id === partyId
    );

  if (!party) return 0;


  let balance =
    num(party.openingBalance);


  transactions.forEach(
    transaction => {

      if (
        transaction.partyId !==
        partyId
      ) {
        return;
      }


      if (
        transaction.type ===
        "sale"
      ) {

        balance +=
          num(transaction.credit);

      }


      if (
        transaction.type ===
        "payment"
      ) {

        balance -=
          num(transaction.amount);

      }

    }
  );


  return balance;

}


/* ================= ALL CREDIT ================= */

function getTotalCredit() {

  return parties.reduce(
    (total, party) =>
      total +
      Math.max(
        0,
        getPartyBalance(party.id)
      ),
    0
  );

}


/* ================= STARTUP DATA ================= */

loadData();
/* =========================================================
   STOCKLY V5 — PART 3
   PRODUCT MANAGEMENT
   ========================================================= */


/* ================= PRODUCT MODAL ================= */

function openProduct(productId = null) {

  const editing =
    productId !== null;

  const product =
    editing
      ? products.find(
          p => p.id === productId
        )
      : null;


  if (editing && !product) {
    toast("Product not found");
    return;
  }


  showModal(
    editing
      ? "Edit Product"
      : "Add Product",

    `
      <form
        onsubmit="saveProduct(event, '${editing ? productId : ""}')"
      >

        <div class="field">

          <label>
            Product Name *
          </label>

          <input
            id="productName"
            required
            value="${esc(product?.name || "")}"
            placeholder="e.g. Coca Cola"
          >

        </div>


        <div class="field">

          <label>
            SKU / Product Code
          </label>

          <input
            id="productSku"
            value="${esc(product?.sku || "")}"
            placeholder="e.g. CC001"
          >

        </div>


        <div class="field">

          <label>
            Category
          </label>

          <input
            id="productCategory"
            value="${esc(product?.category || "")}"
            placeholder="e.g. Drinks"
          >

        </div>


        <div class="field">

          <label>
            Stock Quantity *
          </label>

          <input
            id="productStock"
            type="number"
            min="0"
            step="1"
            required
            value="${num(product?.stock)}"
            placeholder="0"
          >

        </div>


        <div class="field">

          <label>
            Minimum Stock
          </label>

          <input
            id="productMinStock"
            type="number"
            min="0"
            step="1"
            value="${num(product?.minStock)}"
            placeholder="5"
          >

        </div>


        <div class="field">

          <label>
            Buy Price (₹)
          </label>

          <input
            id="productBuyPrice"
            type="number"
            min="0"
            step="0.01"
            value="${num(product?.buyPrice)}"
            placeholder="0"
          >

        </div>


        <div class="field">

          <label>
            Sell Price (₹)
          </label>

          <input
            id="productSellPrice"
            type="number"
            min="0"
            step="0.01"
            value="${num(product?.sellPrice)}"
            placeholder="0"
          >

        </div>


        <button
          type="submit"
          class="save"
        >
          ${editing ? "Save Changes" : "Add Product"}
        </button>

      </form>
    `
  );

}


/* ================= SAVE PRODUCT ================= */

function saveProduct(event, productId) {

  event.preventDefault();


  const name =
    document
      .getElementById("productName")
      .value
      .trim();


  const sku =
    document
      .getElementById("productSku")
      .value
      .trim();


  const category =
    document
      .getElementById("productCategory")
      .value
      .trim();


  const stock =
    Math.max(
      0,
      num(
        document
          .getElementById("productStock")
          .value
      )
    );


  const minStock =
    Math.max(
      0,
      num(
        document
          .getElementById("productMinStock")
          .value
      )
    );


  const buyPrice =
    Math.max(
      0,
      num(
        document
          .getElementById("productBuyPrice")
          .value
      )
    );


  const sellPrice =
    Math.max(
      0,
      num(
        document
          .getElementById("productSellPrice")
          .value
      )
    );


  if (!name) {

    toast("Enter product name");

    return;

  }


  /* Prevent duplicate SKU */

  if (sku) {

    const duplicate =
      products.find(
        p =>
          p.sku &&
          p.sku.toLowerCase() ===
            sku.toLowerCase() &&
          p.id !== productId
      );


    if (duplicate) {

      toast("SKU already exists");

      return;

    }

  }


  if (productId) {

    const product =
      products.find(
        p => p.id === productId
      );


    if (!product) {

      toast("Product not found");

      return;

    }


    product.name =
      name;

    product.sku =
      sku;

    product.category =
      category;

    product.stock =
      stock;

    product.minStock =
      minStock;

    product.buyPrice =
      buyPrice;

    product.sellPrice =
      sellPrice;

    product.updatedAt =
      new Date().toISOString();


    toast("Product updated");

  } else {

    products.unshift({

      id:
        makeId("product"),

      name:
        name,

      sku:
        sku,

      category:
        category,

      stock:
        stock,

      minStock:
        minStock,

      buyPrice:
        buyPrice,

      sellPrice:
        sellPrice,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()

    });


    toast("Product added");

  }


  saveProducts();

  closeModal();

  renderProducts();

  renderDashboard();

}


/* ================= PRODUCT CARD ================= */

function productCard(product) {

  const low =
    isLowStock(product);


  return `

    <div class="product-card">

      <div class="product-top">

        <div>

          <h3>
            ${esc(product.name)}
          </h3>

          <p>
            ${esc(
              product.category ||
              "Uncategorized"
            )}
          </p>

        </div>


        <span
          class="stock-badge ${low ? "low" : "good"}"
        >
          ${low ? "Low Stock" : "In Stock"}
        </span>

      </div>


      <div class="product-details">

        <div>

          <span>
            Stock
          </span>

          <strong>
            ${num(product.stock)}
          </strong>

        </div>


        <div>

          <span>
            Min
          </span>

          <strong>
            ${num(product.minStock)}
          </strong>

        </div>


        <div>

          <span>
            Buy
          </span>

          <strong>
            ${money(product.buyPrice)}
          </strong>

        </div>


        <div>

          <span>
            Sell
          </span>

          <strong>
            ${money(product.sellPrice)}
          </strong>

        </div>

      </div>


      ${
        product.sku
          ? `
            <div
              style="
                margin-top:10px;
                font-size:12px;
                color:var(--muted);
              "
            >
              SKU: ${esc(product.sku)}
            </div>
          `
          : ""
      }


      <div class="product-actions">

        <button
          class="secondary"
          onclick="openProduct('${product.id}')"
        >
          ✏️ Edit
        </button>


        <button
          class="secondary"
          onclick="sellProductQuick('${product.id}')"
        >
          🧾 Sell
        </button>


        <button
          class="secondary"
          onclick="purchaseProductQuick('${product.id}')"
        >
          ＋ Stock
        </button>


        <button
          class="secondary"
          onclick="deleteProduct('${product.id}')"
        >
          🗑️
        </button>

      </div>

    </div>

  `;

}


/* ================= RENDER PRODUCTS ================= */

function renderProducts() {

  const list =
    document.getElementById(
      "productList"
    );

  if (!list) return;


  const searchBox =
    document.getElementById(
      "search"
    );


  const search =
    (
      searchBox?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const filtered =
    products.filter(
      product => {

        if (!search) {
          return true;
        }


        return (

          String(
            product.name || ""
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            product.sku || ""
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            product.category || ""
          )
            .toLowerCase()
            .includes(search)

        );

      }
    );


  if (!filtered.length) {

    list.innerHTML = `

      <div class="empty">

        <div
          style="
            font-size:40px;
            margin-bottom:10px;
          "
        >
          📦
        </div>

        <strong>
          ${
            search
              ? "No products found"
              : "No products yet"
          }
        </strong>

        <p>
          ${
            search
              ? "Try another search."
              : "Add your first product to get started."
          }
        </p>

      </div>

    `;

    return;

  }


  list.innerHTML =
    filtered
      .map(productCard)
      .join("");

}


/* ================= DELETE PRODUCT ================= */

function deleteProduct(productId) {

  const product =
    products.find(
      p => p.id === productId
    );


  if (!product) {

    toast("Product not found");

    return;

  }


  const used =
    transactions.some(
      transaction =>
        Array.isArray(
          transaction.items
        ) &&
        transaction.items.some(
          item =>
            item.productId ===
            productId
        )
    );


  const message =
    used
      ? `Delete "${product.name}"? Its old transaction history will remain.`
      : `Delete "${product.name}"?`;


  if (
    !confirm(message)
  ) {
    return;
  }


  products =
    products.filter(
      p => p.id !== productId
    );


  saveProducts();

  renderProducts();

  renderDashboard();

  toast("Product deleted");

}


/* ================= QUICK SELL ================= */

function sellProductQuick(productId) {

  openSale(productId);

}


/* ================= QUICK PURCHASE ================= */

function purchaseProductQuick(productId) {

  openPurchase(productId);

}


/* ================= PRODUCT FINDER ================= */

function findProduct(productId) {

  return products.find(
    p => p.id === productId
  );

}


/* ================= PRODUCT NAME ================= */

function productName(productId) {

  const product =
    findProduct(productId);

  return product
    ? product.name
    : "Unknown Product";

}


/* ================= STOCK CHANGE ================= */

function changeStock(
  productId,
  amount
) {

  const product =
    findProduct(productId);


  if (!product) {
    return false;
  }


  const newStock =
    num(product.stock) +
    num(amount);


  if (newStock < 0) {
    return false;
  }


  product.stock =
    newStock;


  product.updatedAt =
    new Date().toISOString();


  saveProducts();

  return true;

}
/* =========================================================
   STOCKLY V5 — PART 4
   PARTIES / CUSTOMERS
   ========================================================= */


/* ================= PARTY MODAL ================= */

function openParty(partyId = null) {

  const editing =
    partyId !== null;

  const party =
    editing
      ? parties.find(
          p => p.id === partyId
        )
      : null;


  if (editing && !party) {

    toast("Customer not found");

    return;

  }


  showModal(
    editing
      ? "Edit Customer"
      : "Add Customer",

    `
      <form
        onsubmit="saveParty(event, '${editing ? partyId : ""}')"
      >

        <div class="field">

          <label>
            Customer Name *
          </label>

          <input
            id="partyName"
            required
            value="${esc(party?.name || "")}"
            placeholder="e.g. Rahul Sharma"
          >

        </div>


        <div class="field">

          <label>
            Phone Number
          </label>

          <input
            id="partyPhone"
            type="tel"
            value="${esc(party?.phone || "")}"
            placeholder="e.g. 9876543210"
          >

        </div>


        <div class="field">

          <label>
            Address
          </label>

          <textarea
            id="partyAddress"
            rows="3"
            placeholder="Customer address"
          >${esc(party?.address || "")}</textarea>

        </div>


        <div class="field">

          <label>
            Opening Balance (₹)
          </label>

          <input
            id="partyOpening"
            type="number"
            step="0.01"
            min="0"
            value="${num(party?.openingBalance)}"
            placeholder="0"
          >

        </div>


        <button
          type="submit"
          class="save"
        >
          ${editing ? "Save Changes" : "Add Customer"}
        </button>

      </form>
    `
  );

}


/* ================= SAVE PARTY ================= */

function saveParty(event, partyId) {

  event.preventDefault();


  const name =
    document
      .getElementById("partyName")
      .value
      .trim();


  const phone =
    document
      .getElementById("partyPhone")
      .value
      .trim();


  const address =
    document
      .getElementById("partyAddress")
      .value
      .trim();


  const openingBalance =
    Math.max(
      0,
      num(
        document
          .getElementById("partyOpening")
          .value
      )
    );


  if (!name) {

    toast("Enter customer name");

    return;

  }


  if (partyId) {

    const party =
      parties.find(
        p => p.id === partyId
      );


    if (!party) {

      toast("Customer not found");

      return;

    }


    party.name =
      name;

    party.phone =
      phone;

    party.address =
      address;

    party.openingBalance =
      openingBalance;

    party.updatedAt =
      new Date().toISOString();


    toast("Customer updated");

  } else {

    parties.unshift({

      id:
        makeId("party"),

      name:
        name,

      phone:
        phone,

      address:
        address,

      openingBalance:
        openingBalance,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()

    });


    toast("Customer added");

  }


  saveParties();

  closeModal();

  renderParties();

  renderDashboard();

}


/* ================= PARTY CARD ================= */

function partyCard(party) {

  const balance =
    getPartyBalance(
      party.id
    );


  const positive =
    balance > 0;


  return `

    <div class="party-card">

      <div class="product-top">

        <div>

          <h3>
            ${esc(party.name)}
          </h3>

          <p>
            ${
              party.phone
                ? esc(party.phone)
                : "No phone number"
            }
          </p>

        </div>


        <span
          class="stock-badge ${
            positive
              ? "low"
              : "good"
          }"
        >
          ${
            positive
              ? "Due"
              : "Clear"
          }
        </span>

      </div>


      ${
        party.address
          ? `
            <p
              style="
                margin:10px 0;
                color:var(--muted);
                font-size:13px;
              "
            >
              📍 ${esc(party.address)}
            </p>
          `
          : ""
      }


      <div class="party-balance">

        <span>
          Outstanding Balance
        </span>

        <strong>
          ${money(Math.max(0, balance))}
        </strong>

      </div>


      <div class="product-actions">

        <button
          class="secondary"
          onclick="openParty('${party.id}')"
        >
          ✏️ Edit
        </button>


        <button
          class="secondary"
          onclick="openPartyHistory('${party.id}')"
        >
          📜 History
        </button>


        ${
          balance > 0
            ? `
              <button
                class="secondary"
                onclick="openPayment('${party.id}')"
              >
                💵 Receive
              </button>
            `
            : ""
        }


        <button
          class="secondary"
          onclick="deleteParty('${party.id}')"
        >
          🗑️
        </button>

      </div>

    </div>

  `;

}


/* ================= RENDER PARTIES ================= */

function renderParties() {

  const list =
    document.getElementById(
      "partyList"
    );

  if (!list) return;


  const searchBox =
    document.getElementById(
      "partySearch"
    );


  const search =
    (
      searchBox?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const filtered =
    parties.filter(
      party => {

        if (!search) {
          return true;
        }


        return (

          String(
            party.name || ""
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            party.phone || ""
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            party.address || ""
          )
            .toLowerCase()
            .includes(search)

        );

      }
    );


  if (!filtered.length) {

    list.innerHTML = `

      <div class="empty">

        <div
          style="
            font-size:40px;
            margin-bottom:10px;
          "
        >
          👥
        </div>

        <strong>
          ${
            search
              ? "No customers found"
              : "No customers yet"
          }
        </strong>

        <p>
          ${
            search
              ? "Try another search."
              : "Add your first customer to get started."
          }
        </p>

      </div>

    `;

    return;

  }


  list.innerHTML =
    filtered
      .map(partyCard)
      .join("");

}


/* ================= DELETE PARTY ================= */

function deleteParty(partyId) {

  const party =
    parties.find(
      p => p.id === partyId
    );


  if (!party) {

    toast("Customer not found");

    return;

  }


  const balance =
    getPartyBalance(
      partyId
    );


  if (balance > 0) {

    if (
      !confirm(
        `${party.name} has ${money(balance)} outstanding. Delete anyway?`
      )
    ) {
      return;
    }

  } else {

    if (
      !confirm(
        `Delete "${party.name}"?`
      )
    ) {
      return;
    }

  }


  /*
    Keep old transactions intact.
    Only remove the customer record.
  */

  parties =
    parties.filter(
      p => p.id !== partyId
    );


  saveParties();

  renderParties();

  renderDashboard();

  toast("Customer deleted");

}


/* ================= PARTY HISTORY ================= */

function openPartyHistory(partyId) {

  const party =
    parties.find(
      p => p.id === partyId
    );


  if (!party) {

    toast("Customer not found");

    return;

  }


  const history =
    transactions
      .filter(
        transaction =>
          transaction.partyId === partyId
      )
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );


  let html = `

    <div
      style="
        margin-bottom:15px;
        padding:14px;
        background:var(--soft);
        border-radius:14px;
      "
    >

      <strong>
        ${esc(party.name)}
      </strong>

      ${
        party.phone
          ? `
            <div
              style="
                margin-top:4px;
                color:var(--muted);
              "
            >
              ${esc(party.phone)}
            </div>
          `
          : ""
      }

      <div
        style="
          margin-top:10px;
          font-weight:800;
        "
      >
        Outstanding:
        ${money(
          Math.max(
            0,
            getPartyBalance(partyId)
          )
        )}
      </div>

    </div>

  `;


  if (!history.length) {

    html += `

      <div class="empty">

        <div
          style="
            font-size:35px;
            margin-bottom:8px;
          "
        >
          📜
        </div>

        <strong>
          No transactions
        </strong>

        <p>
          This customer has no transaction history yet.
        </p>

      </div>

    `;

  } else {

    history.forEach(
      transaction => {

        const isSale =
          transaction.type ===
          "sale";


        const isPayment =
          transaction.type ===
          "payment";


        html += `

          <div
            style="
              padding:13px 0;
              border-bottom:1px solid var(--border);
            "
          >

            <div
              style="
                display:flex;
                justify-content:space-between;
                gap:10px;
              "
            >

              <strong>
                ${
                  isSale
                    ? "🧾 Sale"
                    : isPayment
                      ? "💵 Payment"
                      : "Transaction"
                }
              </strong>

              <strong>
                ${
                  isPayment
                    ? "-" +
                      money(
                        transaction.amount
                      )
                    : money(
                        transaction.total
                      )
                }
              </strong>

            </div>


            <div
              style="
                margin-top:5px;
                font-size:12px;
                color:var(--muted);
              "
            >
              ${formatDate(transaction.date)}
              ${
                transaction.billNo
                  ? " · " +
                    esc(transaction.billNo)
                  : ""
              }
            </div>


            ${
              isSale &&
              transaction.credit > 0
                ? `
                  <div
                    style="
                      margin-top:5px;
                      font-size:12px;
                    "
                  >
                    Credit:
                    ${money(transaction.credit)}
                  </div>
                `
                : ""
            }

          </div>

        `;

      }
    );

  }


  showModal(
    "Customer History",
    html
  );

}


/* ================= RECEIVE PAYMENT ================= */

function openPayment(partyId) {

  const party =
    parties.find(
      p => p.id === partyId
    );


  if (!party) {

    toast("Customer not found");

    return;

  }


  const balance =
    Math.max(
      0,
      getPartyBalance(partyId)
    );


  if (balance <= 0) {

    toast("No outstanding balance");

    return;

  }


  showModal(
    "Receive Payment",

    `
      <form
        onsubmit="receivePayment(event, '${partyId}')"
      >

        <div
          style="
            padding:14px;
            background:var(--soft);
            border-radius:14px;
            margin-bottom:15px;
          "
        >

          <strong>
            ${esc(party.name)}
          </strong>

          <div
            style="
              margin-top:6px;
              color:var(--muted);
            "
          >
            Outstanding:
            <strong>
              ${money(balance)}
            </strong>
          </div>

        </div>


        <div class="field">

          <label>
            Amount Received (₹) *
          </label>

          <input
            id="paymentAmount"
            type="number"
            min="0.01"
            max="${balance}"
            step="0.01"
            required
            placeholder="Enter amount"
          >

        </div>


        <div class="field">

          <label>
            Payment Method
          </label>

          <select id="paymentMethod">

            <option value="Cash">
              Cash
            </option>

            <option value="UPI">
              UPI
            </option>

            <option value="Card">
              Card
            </option>

            <option value="Bank">
              Bank Transfer
            </option>

          </select>

        </div>


        <div class="field">

          <label>
            Note
          </label>

          <textarea
            id="paymentNote"
            rows="2"
            placeholder="Optional note"
          ></textarea>

        </div>


        <button
          class="save"
          type="submit"
        >
          Receive Payment
        </button>

      </form>
    `
  );

}


/* ================= SAVE PAYMENT ================= */

function receivePayment(
  event,
  partyId
) {

  event.preventDefault();


  const party =
    parties.find(
      p => p.id === partyId
    );


  if (!party) {

    toast("Customer not found");

    return;

  }


  const amount =
    num(
      document
        .getElementById(
          "paymentAmount"
        )
        .value
    );


  const method =
    document
      .getElementById(
        "paymentMethod"
      )
      .value;


  const note =
    document
      .getElementById(
        "paymentNote"
      )
      .value
      .trim();


  const balance =
    Math.max(
      0,
      getPartyBalance(partyId)
    );


  if (amount <= 0) {

    toast("Enter a valid amount");

    return;

  }


  if (amount > balance) {

    toast(
      "Payment cannot exceed outstanding balance"
    );

    return;

  }


  transactions.unshift({

    id:
      makeId("payment"),

    type:
      "payment",

    partyId:
      partyId,

    partyName:
      party.name,

    amount:
      amount,

    paymentMethod:
      method,

    note:
      note,

    date:
      new Date().toISOString()

  });


  saveTransactions();

  closeModal();

  renderParties();

  renderReports();

  renderDashboard();

  toast(
    `${money(amount)} received`
  );

}


/* ================= PARTY SELECT OPTIONS ================= */

function partyOptions(
  selectedId = ""
) {

  let html = `

    <option value="">
      Walk-in Customer
    </option>

  `;


  parties.forEach(
    party => {

      html += `

        <option
          value="${esc(party.id)}"
          ${
            party.id === selectedId
              ? "selected"
              : ""
          }
        >
          ${esc(party.name)}
          ${
            party.phone
              ? " · " +
                esc(party.phone)
              : ""
          }
        </option>

      `;

    }
  );


  return html;

}


/* ================= PARTY LOOKUP ================= */

function findParty(partyId) {

  return parties.find(
    p => p.id === partyId
  );

}
/* =========================================================
   STOCKLY V5 — PART 5
   SALES / BILLING SYSTEM
   ========================================================= */


/* =========================================================
   STOCKLY V5 — FIXED SALES + BILLING SYSTEM
   ========================================================= */

let saleItems = [];

/* ================= NEW SALE ================= */

function openSale(productId = null) {
  saleItems = [];

  if (productId) {
    const product = findProduct(productId);
    if (product) {
      saleItems.push({
        productId: product.id,
        quantity: 1,
        price: num(product.sellPrice)
      });
    }
  }

  showModal(
    "Make New Bill",
    `
      <form id="stocklySaleForm" onsubmit="return false" novalidate>
        <div class="field">
          <label>Customer / Party</label>
          <select id="saleCustomer" onchange="updateSalePayment()">
            ${partyOptions()}
          </select>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin:15px 0 10px;">
          <strong>Bill Items</strong>
          <button type="button" class="secondary" onclick="addSaleItem()">＋ Add Product</button>
        </div>

        <div id="saleItems"></div>

        <div class="field">
          <label>Discount (₹)</label>
          <input id="saleDiscount" type="number" min="0" step="0.01" value="0" oninput="updateSaleSummary()">
        </div>

        <div class="field">
          <label>Payment Method</label>
          <select id="salePayment" onchange="updateSalePayment()">
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Credit">Credit / Udhaar</option>
          </select>
        </div>

        <div id="creditNotice"></div>
        <div id="saleSummary" class="sale-summary"></div>

        <button type="button" class="save" onclick="stocklyCreateBill()">
          🧾 Create Bill & Invoice
        </button>
      </form>
    `
  );

  if (!saleItems.length) {
    addSaleItem();
  }

  renderSaleItems();
  updateSaleSummary();
  updateSalePayment();
}


/* ================= ADD SALE ITEM ================= */

function addSaleItem() {
  if (!Array.isArray(products) || !products.length) {
    toast("Add a product first");
    return;
  }

  const available = products.find(product =>
    !saleItems.some(item => item.productId === product.id)
  );

  if (!available) {
    toast("All products are already added");
    return;
  }

  saleItems.push({
    productId: available.id,
    quantity: 1,
    price: num(available.sellPrice)
  });

  renderSaleItems();
  updateSaleSummary();
}


/* ================= REMOVE SALE ITEM ================= */

function removeSaleItem(index) {
  if (index < 0 || index >= saleItems.length) return;

  saleItems.splice(index, 1);
  renderSaleItems();
  updateSaleSummary();
}


/* ================= CHANGE SALE PRODUCT ================= */

function changeSaleProduct(index, productId) {
  const product = findProduct(productId);
  if (!product || !saleItems[index]) return;

  const alreadyUsed = saleItems.some(
    (item, itemIndex) =>
      itemIndex !== index && item.productId === productId
  );

  if (alreadyUsed) {
    toast("Product already added");
    renderSaleItems();
    return;
  }

  saleItems[index].productId = product.id;
  saleItems[index].price = num(product.sellPrice);

  const stock = Math.floor(num(product.stock));
  saleItems[index].quantity =
    stock > 0
      ? Math.min(Math.max(1, Math.floor(num(saleItems[index].quantity))), stock)
      : 0;

  renderSaleItems();
  updateSaleSummary();
}


/* ================= CHANGE SALE QUANTITY ================= */

function changeSaleQuantity(index, value) {
  if (!saleItems[index]) return;

  const product = findProduct(saleItems[index].productId);
  let quantity = Math.floor(num(value));

  if (quantity < 1) quantity = 1;

  if (product) {
    const stock = Math.floor(num(product.stock));

    if (stock <= 0) {
      quantity = 0;
    } else if (quantity > stock) {
      quantity = stock;
      toast(`Only ${stock} available`);
    }
  }

  saleItems[index].quantity = quantity;
  renderSaleItems();
  updateSaleSummary();
}


/* ================= SALE PRICE ================= */

function changeSalePrice(index, value) {
  if (!saleItems[index]) return;

  saleItems[index].price = Math.max(0, num(value));
  updateSaleSummary();
}


/* ================= PRODUCT OPTIONS ================= */

function saleProductOptions(selectedId) {
  return products.map(product => `
    <option
      value="${esc(product.id)}"
      ${product.id === selectedId ? "selected" : ""}
    >
      ${esc(product.name)} · Stock: ${num(product.stock)}
    </option>
  `).join("");
}


/* ================= RENDER SALE ITEMS ================= */

function renderSaleItems() {
  const box = document.getElementById("saleItems");
  if (!box) return;

  if (!saleItems.length) {
    box.innerHTML = `
      <div class="empty">
        <p>No products added.</p>
      </div>
    `;
    return;
  }

  box.innerHTML = saleItems.map((item, index) => {
    const product = findProduct(item.productId);
    if (!product) return "";

    const stock = Math.floor(num(product.stock));

    return `
      <div style="padding:12px;margin-bottom:10px;border:1px solid var(--border);border-radius:14px;">

        <div class="field">
          <label>Product</label>
          <select onchange="changeSaleProduct(${index}, this.value)">
            ${saleProductOptions(item.productId)}
          </select>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">

          <div class="field">
            <label>Quantity</label>
            <input
              type="number"
              min="${stock > 0 ? 1 : 0}"
              max="${Math.max(0, stock)}"
              value="${num(item.quantity)}"
              onchange="changeSaleQuantity(${index}, this.value)"
            >
          </div>

          <div class="field">
            <label>Price (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value="${num(item.price)}"
              onchange="changeSalePrice(${index}, this.value)"
            >
          </div>

        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
          <strong>${money(num(item.quantity) * num(item.price))}</strong>

          <button
            type="button"
            class="secondary"
            onclick="removeSaleItem(${index})"
          >
            🗑️ Remove
          </button>
        </div>

      </div>
    `;
  }).join("");
}


/* ================= SALE CALCULATION ================= */

function calculateSale() {
  let subtotal = 0;
  let cost = 0;

  saleItems.forEach(item => {
    const product = findProduct(item.productId);
    if (!product) return;

    const quantity = Math.max(0, num(item.quantity));
    const price = Math.max(0, num(item.price));

    subtotal += quantity * price;
    cost += quantity * num(product.buyPrice);
  });

  const discount = Math.max(
    0,
    num(document.getElementById("saleDiscount")?.value)
  );

  const total = Math.max(0, subtotal - discount);
  const profit = total - cost;

  return { subtotal, discount, total, cost, profit };
}


/* ================= SALE SUMMARY ================= */

function updateSaleSummary() {
  const box = document.getElementById("saleSummary");
  if (!box) return;

  const data = calculateSale();

  box.innerHTML = `
    <div class="summary-row">
      <span>Subtotal</span>
      <strong>${money(data.subtotal)}</strong>
    </div>

    <div class="summary-row">
      <span>Discount</span>
      <strong>- ${money(data.discount)}</strong>
    </div>

    <div class="summary-row" style="font-size:18px;font-weight:800;">
      <span>Total</span>
      <strong>${money(data.total)}</strong>
    </div>

    <div class="summary-row">
      <span>Estimated Profit</span>
      <strong>${money(data.profit)}</strong>
    </div>
  `;
}


/* ================= PAYMENT CHANGE ================= */

function updateSalePayment() {
  const method = document.getElementById("salePayment")?.value;
  const notice = document.getElementById("creditNotice");
  if (!notice) return;

  if (method === "Credit") {
    const customer = document.getElementById("saleCustomer")?.value;

    notice.innerHTML = `
      <div style="padding:10px;margin-bottom:10px;border-radius:12px;background:var(--soft);font-size:13px;">
        ${customer
          ? "💳 This sale will be added to the customer's outstanding balance."
          : "⚠️ Select a customer for Credit / Udhaar sales."
        }
      </div>
    `;
  } else {
    notice.innerHTML = "";
  }
}


/* ================= SAVE SALE ================= */

function stocklyCreateBill() {
  try {
    const items = Array.isArray(saleItems) ? saleItems.slice() : [];

    if (!items.length) {
      alert("Stockly: Add at least one product.");
      return false;
    }

    const customerEl = document.getElementById("saleCustomer");
    const paymentEl = document.getElementById("salePayment");
    const discountEl = document.getElementById("saleDiscount");

    const customerId = customerEl ? customerEl.value : "";
    const paymentMethod = paymentEl ? paymentEl.value : "Cash";
    const discount = Math.max(0, num(discountEl ? discountEl.value : 0));

    if (paymentMethod === "Credit" && !customerId) {
      alert("Stockly: Select a customer for Credit / Udhaar.");
      return false;
    }

    const preparedItems = [];
    let subtotal = 0;
    let cost = 0;

    for (const item of items) {
      const product = findProduct(item.productId);
      if (!product) {
        alert("Stockly: Please select a valid product.");
        return false;
      }

      const quantity = Math.floor(num(item.quantity));
      let price = Math.max(0, num(item.price));

      /* If the sale row has no price, use the product selling price. */
      if (price <= 0) price = Math.max(0, num(product.sellPrice));

      const stock = Math.floor(num(product.stock));

      if (quantity < 1) {
        alert(`${product.name}: quantity must be at least 1.`);
        return false;
      }
      if (quantity > stock) {
        alert(`${product.name}: only ${stock} available.`);
        return false;
      }
      if (price <= 0) {
        alert(`${product.name}: set a selling price greater than ₹0 first.`);
        return false;
      }

      const lineTotal = quantity * price;
      subtotal += lineTotal;
      cost += quantity * num(product.buyPrice);

      preparedItems.push({
        productId: product.id,
        productName: product.name,
        quantity,
        price,
        buyPrice: num(product.buyPrice),
        total: lineTotal
      });
    }

    const safeDiscount = Math.min(discount, subtotal);
    const total = subtotal - safeDiscount;

    if (total <= 0) {
      alert("Stockly: Sale total must be greater than ₹0.");
      return false;
    }

    const party = customerId ? findParty(customerId) : null;
    const billNo = "INV-" + Date.now().toString().slice(-8);

    const sale = {
      id: makeId("sale"),
      type: "sale",
      billNo,
      partyId: customerId || "",
      customerId: customerId || "",
      customerName: party ? (party.name || "Customer") : "Walk-in Customer",
      customerPhone: party ? (party.phone || "") : "",
      customerAddress: party ? (party.address || "") : "",
      items: preparedItems,
      subtotal,
      discount: safeDiscount,
      total,
      cost,
      profit: total - cost,
      credit: paymentMethod === "Credit" ? total : 0,
      paymentMethod,
      date: new Date().toISOString()
    };

    /* Read the latest stored transaction list directly. */
    let storedTransactions = [];
    try {
      const raw = localStorage.getItem(TRANSACTION_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      storedTransactions = Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      storedTransactions = [];
    }

    /* Prevent accidental duplicate bill IDs. */
    storedTransactions = storedTransactions.filter(t => t && t.id !== sale.id);
    storedTransactions.unshift(sale);

    /* Save the bill FIRST. */
    localStorage.setItem(TRANSACTION_KEY, JSON.stringify(storedTransactions));

    /* Verify persistence immediately. */
    const verify = JSON.parse(localStorage.getItem(TRANSACTION_KEY) || "[]");
    if (!Array.isArray(verify) || !verify.some(t => t && t.id === sale.id)) {
      throw new Error("Browser storage did not save the bill");
    }

    /* Only after the bill is safely stored, reduce stock. */
    for (const item of preparedItems) {
      const changed = changeStock(item.productId, -item.quantity);
      if (!changed) {
        /* Restore the previous transaction list if stock update fails. */
        localStorage.setItem(TRANSACTION_KEY, JSON.stringify(storedTransactions.filter(t => t.id !== sale.id)));
        throw new Error(`Could not update stock for ${item.productName}`);
      }
    }

    /* Sync the in-memory state with storage. */
    transactions = storedTransactions;
    saveProducts();

    saleItems = [];
    renderProducts();
    renderSales();
    renderDashboard();
    renderReports();
    renderParties();
    page("sales");
    closeModal();

    toast(`✅ Bill ${billNo} created`);

    /* Open the invoice immediately, using the saved sale object. */
    setTimeout(() => openInvoice(sale.id), 100);

    return false;
  } catch (error) {
    console.error("Stockly billing error:", error);
    const message = error && error.message ? error.message : "Unknown error";
    alert("Stockly Bill Error:\n" + message);
    toast("❌ Bill failed: " + message);
    return false;
  }
}

/* Keep the old name available for any older button/form. */
function saveSale(event) {
  if (event && typeof event.preventDefault === "function") event.preventDefault();
  return stocklyCreateBill();
}

window.stocklyCreateBill = stocklyCreateBill;


/* ================= INVOICE ================= */

function openInvoice(saleId) {
  const sale = transactions.find(
    transaction =>
      transaction.id === saleId &&
      transaction.type === "sale"
  );

  if (!sale) {
    toast("Invoice not found");
    return;
  }

  const items = Array.isArray(sale.items) ? sale.items : [];

  const rows = items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #ddd;">
        ${esc(item.productName || "")}
      </td>
      <td style="padding:8px;text-align:center;border-bottom:1px solid #ddd;">
        ${num(item.quantity)}
      </td>
      <td style="padding:8px;text-align:right;border-bottom:1px solid #ddd;">
        ${money(item.price)}
      </td>
      <td style="padding:8px;text-align:right;border-bottom:1px solid #ddd;">
        ${money(item.total)}
      </td>
    </tr>
  `).join("");

  showModal(
    `Invoice ${sale.billNo || ""}`,
    `
      <div id="stocklyInvoice" style="background:#fff;color:#111;padding:18px;border-radius:14px;">

        <div style="text-align:center;border-bottom:2px solid #222;padding-bottom:12px;margin-bottom:14px;">
          <h2 style="margin:0;">STOCKLY</h2>
          <div style="font-size:13px;">Inventory Manager</div>
          <strong>TAX INVOICE / BILL</strong>
        </div>

        <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:15px;">
          <div>
            <strong>Invoice</strong><br>
            ${esc(sale.billNo || "")}
          </div>

          <div style="text-align:right;">
            <strong>Date</strong><br>
            ${formatDate(sale.date)}
          </div>
        </div>

        <div style="padding:10px;background:#f3f3f3;border-radius:10px;margin-bottom:15px;">
          <strong>Customer</strong><br>
          ${esc(sale.customerName || "Walk-in Customer")}
          ${sale.customerPhone ? `<br>${esc(sale.customerPhone)}` : ""}
          ${sale.customerAddress ? `<br>${esc(sale.customerAddress)}` : ""}
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead>
              <tr>
                <th style="text-align:left;padding:8px;border-bottom:2px solid #222;">Product</th>
                <th style="padding:8px;border-bottom:2px solid #222;">Qty</th>
                <th style="text-align:right;padding:8px;border-bottom:2px solid #222;">Price</th>
                <th style="text-align:right;padding:8px;border-bottom:2px solid #222;">Amount</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div style="margin-top:18px;border-top:1px solid #ccc;padding-top:10px;">
          <div class="summary-row">
            <span>Subtotal</span>
            <strong>${money(sale.subtotal)}</strong>
          </div>

          <div class="summary-row">
            <span>Discount</span>
            <strong>- ${money(sale.discount)}</strong>
          </div>

          <div class="summary-row" style="font-size:20px;font-weight:900;margin-top:8px;">
            <span>TOTAL</span>
            <strong>${money(sale.total)}</strong>
          </div>

          <div class="summary-row">
            <span>Payment</span>
            <strong>${esc(sale.paymentMethod || "Cash")}</strong>
          </div>

          ${
            num(sale.credit) > 0
              ? `
                <div class="summary-row" style="color:#b00020;">
                  <span>Balance Due</span>
                  <strong>${money(sale.credit)}</strong>
                </div>
              `
              : ""
          }
        </div>

        <div style="text-align:center;margin-top:20px;padding-top:12px;border-top:1px dashed #999;">
          Thank you for your business!
        </div>
      </div>

      <div style="display:flex;gap:10px;margin-top:12px;">
        <button type="button" class="save" onclick="printInvoice('${esc(sale.id)}')">
          🖨️ Print / Save PDF
        </button>

        <button type="button" class="secondary" onclick="closeModal()">
          Done
        </button>
      </div>
    `
  );
}


/* ================= PRINT INVOICE ================= */

function printInvoice(saleId) {
  const sale = transactions.find(
    transaction =>
      transaction.id === saleId &&
      transaction.type === "sale"
  );

  if (!sale) {
    toast("Invoice not found");
    return;
  }

  const items = Array.isArray(sale.items) ? sale.items : [];

  const rows = items.map(item => `
    <tr>
      <td>${esc(item.productName || "")}</td>
      <td>${num(item.quantity)}</td>
      <td>${money(item.price)}</td>
      <td>${money(item.total)}</td>
    </tr>
  `).join("");

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    toast("Allow pop-ups/print windows for invoices");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${esc(sale.billNo || "Stockly Invoice")}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:25px;color:#111}
        h1,h2{text-align:center}
        table{width:100%;border-collapse:collapse;margin-top:20px}
        th,td{border-bottom:1px solid #ccc;padding:8px;text-align:left}
        .total{text-align:right;font-size:20px;font-weight:bold;margin-top:20px}
      </style>
    </head>
    <body>
      <h1>STOCKLY</h1>
      <h2>INVOICE</h2>

      <p><strong>Invoice:</strong> ${esc(sale.billNo || "")}</p>
      <p><strong>Date:</strong> ${formatDate(sale.date)}</p>
      <p><strong>Customer:</strong> ${esc(sale.customerName || "Walk-in Customer")}</p>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="total">
        Subtotal: ${money(sale.subtotal)}<br>
        Discount: ${money(sale.discount)}<br>
        TOTAL: ${money(sale.total)}
      </div>

      <p><strong>Payment:</strong> ${esc(sale.paymentMethod || "Cash")}</p>

      <p style="text-align:center;margin-top:40px;">
        Thank you for your business!
      </p>
    </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 300);
}


/* ================= SALES LIST ================= */

function renderSales() {
  const list = document.getElementById("salesList");
  if (!list) return;

  const sales = (Array.isArray(transactions) ? transactions : [])
    .filter(transaction => transaction.type === "sale")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!sales.length) {
    list.innerHTML = `
      <div class="empty">
        <div style="font-size:40px;margin-bottom:10px;">🧾</div>
        <strong>No sales yet</strong>
        <p>Your bills will appear here.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = sales.map(sale => `
    <div class="product-card">

      <div class="product-top">
        <div>
          <h3>${esc(sale.billNo || "Sale")}</h3>
          <p>${esc(sale.customerName || "Walk-in Customer")}</p>
        </div>

        <span class="stock-badge good">
          ${esc(sale.paymentMethod || "Cash")}
        </span>
      </div>

      <div class="product-details">

        <div>
          <span>Date</span>
          <strong>${formatDate(sale.date)}</strong>
        </div>

        <div>
          <span>Items</span>
          <strong>${Array.isArray(sale.items) ? sale.items.length : 0}</strong>
        </div>

        <div>
          <span>Total</span>
          <strong>${money(sale.total)}</strong>
        </div>

      </div>

      ${
        num(sale.credit) > 0
          ? `
            <div style="margin-top:10px;font-weight:700;color:var(--red);">
              Balance Due: ${money(sale.credit)}
            </div>
          `
          : ""
      }

      <div style="display:flex;gap:8px;margin-top:12px;">
        <button
          type="button"
          class="save"
          onclick="openInvoice('${esc(sale.id)}')"
        >
          🧾 View Invoice
        </button>
      </div>

    </div>
  `).join("");
}



/* =========================================================
   STOCKLY V5 — PART 6
   PURCHASES + DASHBOARD + REPORTS
   ========================================================= */


/* ================= PURCHASE STATE ================= */

let purchaseItems = [];
let invoiceFilter = "all";


/* ================= OPEN PURCHASE ================= */

function openPurchase(productId = null) {
  purchaseItems = [];

  if (productId) {
    const product = findProduct(productId);
    if (product) {
      purchaseItems.push({
        productId: product.id,
        quantity: 1,
        price: num(product.buyPrice)
      });
    }
  }

  showModal(
    "New Purchase / Purchase Invoice",
    `
      <form id="stocklyPurchaseForm" novalidate>

        <div class="field">
          <label>Supplier Name</label>
          <input id="purchaseSupplier" placeholder="Supplier / distributor name">
        </div>

        <div class="field">
          <label>Supplier Phone</label>
          <input id="purchaseSupplierPhone" placeholder="Optional phone number">
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin:15px 0 10px;">
          <strong>Products</strong>
          <button type="button" class="secondary" onclick="addPurchaseItem()">＋ Add Product</button>
        </div>

        <div id="purchaseItems"></div>

        <div class="field">
          <label>Discount (₹)</label>
          <input id="purchaseDiscount" type="number" min="0" step="0.01" value="0" oninput="updatePurchaseSummary()">
        </div>

        <div class="field">
          <label>Payment Method</label>
          <select id="purchasePayment">
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Credit">Credit / Udhaar</option>
          </select>
        </div>

        <div class="field">
          <label>Note</label>
          <textarea id="purchaseNote" rows="2" placeholder="Optional note"></textarea>
        </div>

        <div id="purchaseSummary" class="sale-summary"></div>

        <button type="button" class="save" onclick="savePurchase()">
          🧾 Save Purchase & Create Invoice
        </button>

      </form>
    `
  );

  if (!purchaseItems.length) addPurchaseItem();
  renderPurchaseItems();
  updatePurchaseSummary();
}


/* ================= PURCHASE ITEM HELPERS ================= */

function addPurchaseItem() {
  if (!Array.isArray(products) || !products.length) {
    toast("Add a product first");
    return;
  }

  const available = products.find(product =>
    !purchaseItems.some(item => item.productId === product.id)
  );

  if (!available) {
    toast("All products are already added");
    return;
  }

  purchaseItems.push({
    productId: available.id,
    quantity: 1,
    price: num(available.buyPrice)
  });

  renderPurchaseItems();
  updatePurchaseSummary();
}

function removePurchaseItem(index) {
  if (index < 0 || index >= purchaseItems.length) return;
  purchaseItems.splice(index, 1);
  renderPurchaseItems();
  updatePurchaseSummary();
}

function changePurchaseProduct(index, productId) {
  const product = findProduct(productId);
  if (!product || !purchaseItems[index]) return;

  const duplicate = purchaseItems.some(
    (item, itemIndex) => itemIndex !== index && item.productId === productId
  );

  if (duplicate) {
    toast("Product already added");
    renderPurchaseItems();
    return;
  }

  purchaseItems[index].productId = product.id;
  purchaseItems[index].price = num(product.buyPrice);
  renderPurchaseItems();
  updatePurchaseSummary();
}

function changePurchaseQuantity(index, value) {
  if (!purchaseItems[index]) return;
  purchaseItems[index].quantity = Math.max(1, Math.floor(num(value)));
  renderPurchaseItems();
  updatePurchaseSummary();
}

function changePurchasePrice(index, value) {
  if (!purchaseItems[index]) return;
  purchaseItems[index].price = Math.max(0, num(value));
  updatePurchaseSummary();
}

function renderPurchaseItems() {
  const box = document.getElementById("purchaseItems");
  if (!box) return;

  if (!purchaseItems.length) {
    box.innerHTML = `<div class="empty"><p>No products added.</p></div>`;
    return;
  }

  box.innerHTML = purchaseItems.map((item, index) => `
    <div style="padding:12px;margin-bottom:10px;border:1px solid var(--border);border-radius:14px;">
      <div class="field">
        <label>Product</label>
        <select onchange="changePurchaseProduct(${index}, this.value)">
          ${products.map(product => `
            <option value="${esc(product.id)}" ${product.id === item.productId ? "selected" : ""}>
              ${esc(product.name)} · Stock: ${num(product.stock)}
            </option>
          `).join("")}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div class="field">
          <label>Quantity</label>
          <input type="number" min="1" step="1" value="${num(item.quantity)}" onchange="changePurchaseQuantity(${index}, this.value)">
        </div>
        <div class="field">
          <label>Buy Price (₹)</label>
          <input type="number" min="0" step="0.01" value="${num(item.price)}" onchange="changePurchasePrice(${index}, this.value)">
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>${money(num(item.quantity) * num(item.price))}</strong>
        <button type="button" class="secondary" onclick="removePurchaseItem(${index})">🗑️ Remove</button>
      </div>
    </div>
  `).join("");
}

function calculatePurchase() {
  let subtotal = 0;
  purchaseItems.forEach(item => {
    subtotal += Math.max(0, num(item.quantity)) * Math.max(0, num(item.price));
  });

  const discount = Math.max(0, num(document.getElementById("purchaseDiscount")?.value));
  const total = Math.max(0, subtotal - discount);
  return { subtotal, discount, total };
}

function updatePurchaseSummary() {
  const box = document.getElementById("purchaseSummary");
  if (!box) return;

  const data = calculatePurchase();

  box.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><strong>${money(data.subtotal)}</strong></div>
    <div class="summary-row"><span>Discount</span><strong>- ${money(data.discount)}</strong></div>
    <div class="summary-row" style="font-size:18px;font-weight:800;"><span>Total</span><strong>${money(data.total)}</strong></div>
  `;
}


/* ================= SAVE PURCHASE + AUTO INVOICE ================= */

function savePurchase(event) {
  if (event && typeof event.preventDefault === "function") event.preventDefault();

  try {
    if (!Array.isArray(purchaseItems) || !purchaseItems.length) {
      toast("Add at least one product");
      return false;
    }

    const supplier = document.getElementById("purchaseSupplier")?.value.trim() || "";
    const supplierPhone = document.getElementById("purchaseSupplierPhone")?.value.trim() || "";
    const paymentMethod = document.getElementById("purchasePayment")?.value || "Cash";
    const note = document.getElementById("purchaseNote")?.value.trim() || "";

    const preparedItems = [];

    for (const item of purchaseItems) {
      const product = findProduct(item.productId);
      if (!product) {
        toast("A selected product was not found");
        return false;
      }

      const quantity = Math.floor(num(item.quantity));
      const price = Math.max(0, num(item.price));

      if (quantity < 1) {
        toast(`${product.name}: quantity must be at least 1`);
        return false;
      }

      if (price <= 0) {
        toast(`${product.name}: purchase price must be greater than ₹0`);
        return false;
      }

      preparedItems.push({
        productId: product.id,
        productName: product.name,
        quantity,
        price,
        total: quantity * price
      });
    }

    const data = calculatePurchase();
    if (data.total <= 0) {
      toast("Purchase total must be greater than ₹0");
      return false;
    }

    const purchase = {
      id: makeId("purchase"),
      type: "purchase",
      billNo: "PUR-" + Date.now().toString().slice(-8),
      supplier,
      supplierPhone,
      items: preparedItems,
      subtotal: data.subtotal,
      discount: data.discount,
      total: data.total,
      paymentMethod,
      note,
      date: new Date().toISOString()
    };

    const previousTransactions = Array.isArray(transactions) ? [...transactions] : [];
    const previousProducts = JSON.stringify(products);

    transactions = previousTransactions;
    transactions.unshift(purchase);
    saveTransactions();

    const verify = JSON.parse(localStorage.getItem(TRANSACTION_KEY) || "[]");
    if (!Array.isArray(verify) || !verify.some(t => t && t.id === purchase.id)) {
      throw new Error("Purchase invoice could not be saved");
    }

    for (const item of preparedItems) {
      const product = findProduct(item.productId);
      if (!product) throw new Error(`Product missing: ${item.productName}`);

      product.stock = num(product.stock) + item.quantity;
      product.buyPrice = item.price;
      product.updatedAt = new Date().toISOString();
    }

    saveProducts();

    purchaseItems = [];
    renderProducts();
    renderPurchases();
    renderInvoices();
    renderDashboard();
    renderReports();
    closeModal();

    toast(`✅ Purchase ${purchase.billNo} created`);

    setTimeout(() => openPurchaseInvoice(purchase.id), 120);
    return false;

  } catch (error) {
    console.error("Stockly purchase error:", error);
    toast("❌ Purchase failed: " + (error?.message || "Unknown error"));
    return false;
  }
}


/* ================= PURCHASE LIST ================= */

function renderPurchases() {
  const list = document.getElementById("purchaseList");
  if (!list) return;

  const purchases = (Array.isArray(transactions) ? transactions : [])
    .filter(t => t.type === "purchase")
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  if (!purchases.length) {
    list.innerHTML = `
      <div class="empty">
        <div style="font-size:40px;margin-bottom:10px;">🛒</div>
        <strong>No purchases yet</strong>
        <p>Purchase invoices will appear here.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = purchases.map(purchase => `
    <div class="product-card">
      <div class="product-top">
        <div>
          <h3>${esc(purchase.billNo || "Purchase")}</h3>
          <p>${esc(purchase.supplier || "No supplier")}</p>
        </div>
        <span class="stock-badge good">${esc(purchase.paymentMethod || "Cash")}</span>
      </div>

      <div class="product-details">
        <div><span>Date</span><strong>${formatDate(purchase.date)}</strong></div>
        <div><span>Items</span><strong>${Array.isArray(purchase.items) ? purchase.items.length : 1}</strong></div>
        <div><span>Total</span><strong>${money(purchase.total)}</strong></div>
      </div>

      <button type="button" class="save" style="margin-top:12px;" onclick="openPurchaseInvoice('${esc(purchase.id)}')">
        🧾 View Purchase Invoice
      </button>
    </div>
  `).join("");
}


/* ================= PURCHASE INVOICE ================= */

function openPurchaseInvoice(purchaseId) {
  const purchase = transactions.find(t => t.id === purchaseId && t.type === "purchase");
  if (!purchase) {
    toast("Purchase invoice not found");
    return;
  }

  const items = Array.isArray(purchase.items)
    ? purchase.items
    : [{productName: purchase.productName || "Product", quantity: purchase.quantity || 0, price: purchase.price || 0, total: purchase.total || 0}];

  const rows = items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #ddd;">${esc(item.productName || "")}</td>
      <td style="padding:8px;text-align:center;border-bottom:1px solid #ddd;">${num(item.quantity)}</td>
      <td style="padding:8px;text-align:right;border-bottom:1px solid #ddd;">${money(item.price)}</td>
      <td style="padding:8px;text-align:right;border-bottom:1px solid #ddd;">${money(item.total)}</td>
    </tr>
  `).join("");

  showModal(
    `Purchase Invoice ${esc(purchase.billNo || "")}`,
    `
      <div id="stocklyPurchaseInvoice" style="background:#fff;color:#111;padding:18px;border-radius:14px;">
        <div style="text-align:center;border-bottom:2px solid #222;padding-bottom:12px;margin-bottom:14px;">
          <h2 style="margin:0;">STOCKLY</h2>
          <div style="font-size:13px;">Inventory Manager</div>
          <strong>PURCHASE INVOICE</strong>
        </div>

        <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:15px;">
          <div><strong>Invoice</strong><br>${esc(purchase.billNo || "")}</div>
          <div style="text-align:right;"><strong>Date</strong><br>${formatDate(purchase.date)}</div>
        </div>

        <div style="padding:10px;background:#f3f3f3;border-radius:10px;margin-bottom:15px;">
          <strong>Supplier</strong><br>
          ${esc(purchase.supplier || "No supplier")}
          ${purchase.supplierPhone ? `<br>${esc(purchase.supplierPhone)}` : ""}
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead><tr>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #222;">Product</th>
              <th style="padding:8px;border-bottom:2px solid #222;">Qty</th>
              <th style="text-align:right;padding:8px;border-bottom:2px solid #222;">Buy Price</th>
              <th style="text-align:right;padding:8px;border-bottom:2px solid #222;">Amount</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div style="margin-top:18px;border-top:1px solid #ccc;padding-top:10px;">
          <div class="summary-row"><span>Subtotal</span><strong>${money(purchase.subtotal)}</strong></div>
          <div class="summary-row"><span>Discount</span><strong>- ${money(purchase.discount)}</strong></div>
          <div class="summary-row" style="font-size:20px;font-weight:900;margin-top:8px;"><span>TOTAL</span><strong>${money(purchase.total)}</strong></div>
          <div class="summary-row"><span>Payment</span><strong>${esc(purchase.paymentMethod || "Cash")}</strong></div>
        </div>

        ${purchase.note ? `<div style="margin-top:12px;font-size:13px;"><strong>Note:</strong> ${esc(purchase.note)}</div>` : ""}

        <div style="text-align:center;margin-top:20px;padding-top:12px;border-top:1px dashed #999;">Purchase recorded successfully.</div>
      </div>

      <div style="display:flex;gap:10px;margin-top:12px;">
        <button type="button" class="save" onclick="printPurchaseInvoice('${esc(purchase.id)}')">🖨️ Print / Save PDF</button>
        <button type="button" class="secondary" onclick="closeModal()">Done</button>
      </div>
    `
  );
}

function printPurchaseInvoice(purchaseId) {
  const purchase = transactions.find(t => t.id === purchaseId && t.type === "purchase");
  if (!purchase) {
    toast("Purchase invoice not found");
    return;
  }

  const items = Array.isArray(purchase.items)
    ? purchase.items
    : [{productName: purchase.productName || "Product", quantity: purchase.quantity || 0, price: purchase.price || 0, total: purchase.total || 0}];

  const rows = items.map(item => `
    <tr><td>${esc(item.productName || "")}</td><td>${num(item.quantity)}</td><td>${money(item.price)}</td><td>${money(item.total)}</td></tr>
  `).join("");

  const win = window.open("", "_blank");
  if (!win) {
    toast("Allow the print window to open");
    return;
  }

  win.document.write(`
    <!DOCTYPE html><html><head><meta charset="UTF-8"><title>${esc(purchase.billNo || "Purchase Invoice")}</title>
    <style>body{font-family:Arial,sans-serif;padding:25px;color:#111}h1,h2{text-align:center}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border-bottom:1px solid #ccc;padding:8px;text-align:left}.total{text-align:right;font-size:20px;font-weight:bold;margin-top:20px}</style>
    </head><body>
    <h1>STOCKLY</h1><h2>PURCHASE INVOICE</h2>
    <p><strong>Invoice:</strong> ${esc(purchase.billNo || "")}</p>
    <p><strong>Date:</strong> ${formatDate(purchase.date)}</p>
    <p><strong>Supplier:</strong> ${esc(purchase.supplier || "No supplier")}</p>
    <table><thead><tr><th>Product</th><th>Qty</th><th>Buy Price</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="total">Subtotal: ${money(purchase.subtotal)}<br>Discount: ${money(purchase.discount)}<br>TOTAL: ${money(purchase.total)}</div>
    <p><strong>Payment:</strong> ${esc(purchase.paymentMethod || "Cash")}</p>
    <p style="text-align:center;margin-top:40px">Purchase recorded successfully.</p>
    </body></html>
  `);
  win.document.close();
  setTimeout(() => win.print(), 300);
}


/* ================= INVOICES HUB ================= */

function setInvoiceFilter(filter) {
  invoiceFilter = filter;
  renderInvoices();
}

function renderInvoices() {
  const list = document.getElementById("invoiceList");
  if (!list) return;

  const search = (document.getElementById("invoiceSearch")?.value || "").trim().toLowerCase();

  const all = (Array.isArray(transactions) ? transactions : [])
    .filter(t => t.type === "sale" || t.type === "purchase")
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  const filtered = all.filter(t => {
    if (invoiceFilter !== "all" && t.type !== invoiceFilter) return false;
    if (!search) return true;
    const haystack = [
      t.billNo,
      t.customerName,
      t.customerPhone,
      t.supplier,
      t.supplierPhone
    ].join(" ").toLowerCase();
    return haystack.includes(search);
  });

  [
    ["invoiceFilterAll", "all"],
    ["invoiceFilterSales", "sale"],
    ["invoiceFilterPurchases", "purchase"]
  ].forEach(([id, value]) => {
    const button = document.getElementById(id);
    if (button) {
      button.className = invoiceFilter === value ? "save" : "secondary";
    }
  });

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty">
        <div style="font-size:40px">🧾</div>
        <strong>No invoices found</strong>
        <p>Sales and purchase invoices will appear here automatically.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(invoice => {
    const isSale = invoice.type === "sale";
    const name = isSale
      ? (invoice.customerName || "Walk-in Customer")
      : (invoice.supplier || "No supplier");
    const items = Array.isArray(invoice.items) ? invoice.items.length : 1;

    return `
      <div class="product-card">
        <div class="product-top">
          <div>
            <h3>${esc(invoice.billNo || (isSale ? "Sale" : "Purchase"))}</h3>
            <p>${isSale ? "Sales Invoice · " : "Purchase Invoice · "}${esc(name)}</p>
          </div>
          <span class="stock-badge good">${isSale ? "SALE" : "PURCHASE"}</span>
        </div>

        <div class="product-details">
          <div><span>Date</span><strong>${formatDate(invoice.date)}</strong></div>
          <div><span>Items</span><strong>${items}</strong></div>
          <div><span>Total</span><strong>${money(invoice.total)}</strong></div>
        </div>

        <button type="button" class="save invoice-view-btn" style="margin-top:12px;" data-invoice-id="${esc(invoice.id)}" data-invoice-type="${isSale ? "sale" : "purchase"}">
          🧾 View Invoice
        </button>
      </div>
    `;
  }).join("");

  list.querySelectorAll(".invoice-view-btn").forEach(button => {
    button.addEventListener("click", () => {
      const invoiceId = button.dataset.invoiceId;
      const invoiceType = button.dataset.invoiceType;
      if (invoiceType === "purchase") {
        openPurchaseInvoice(invoiceId);
      } else {
        openInvoice(invoiceId);
      }
    });
  });
}


/* ================= DASHBOARD ================= */

function renderDashboard() {

  const totalStock =
    getTotalStock();


  const inventoryValue =
    getInventoryValue();


  const salesTotal =
    getSalesTotal();


  const profitTotal =
    getProfitTotal();


  const lowStockProducts =
    getLowStockProducts();


  const totalCredit =
    getTotalCredit();


  const productCount =
    products.length;


  const inventoryValueBox =
    document.getElementById(
      "inventoryValue"
    );


  if (inventoryValueBox) {

    inventoryValueBox.textContent =
      money(inventoryValue);

  }


  const productCountHero =
    document.getElementById(
      "productCountHero"
    );


  if (productCountHero) {

    productCountHero.textContent =
      `${productCount} product${
        productCount === 1
          ? ""
          : "s"
      }`;

  }


  const stockHero =
    document.getElementById(
      "stockHero"
    );


  if (stockHero) {

    stockHero.textContent =
      `${totalStock} item${
        totalStock === 1
          ? ""
          : "s"
      }`;

  }


  const revenue =
    document.getElementById(
      "revenue"
    );


  if (revenue) {

    revenue.textContent =
      money(salesTotal);

  }


  const profit =
    document.getElementById(
      "profit"
    );


  if (profit) {

    profit.textContent =
      money(profitTotal);

  }


  const stock =
    document.getElementById(
      "totalStock"
    );


  if (stock) {

    stock.textContent =
      totalStock;

  }


  const lowStock =
    document.getElementById(
      "lowStock"
    );


  if (lowStock) {

    lowStock.textContent =
      lowStockProducts.length;

  }


  renderLowStock();

}


/* ================= LOW STOCK LIST ================= */

function renderLowStock() {

  const list =
    document.getElementById(
      "lowStockList"
    );


  if (!list) return;


  const lowStockProducts =
    getLowStockProducts();


  if (!lowStockProducts.length) {

    list.innerHTML = `

      <div class="empty">

        <div
          style="
            font-size:32px;
            margin-bottom:8px;
          "
        >
          ✅
        </div>

        <strong>
          Everything looks good
        </strong>

        <p>
          No products are below their minimum stock.
        </p>

      </div>

    `;

    return;

  }


  list.innerHTML =
    lowStockProducts
      .map(
        product => `

          <div class="product-card">

            <div class="product-top">

              <div>

                <h3>
                  ${esc(
                    product.name
                  )}
                </h3>

                <p>
                  Minimum stock:
                  ${num(
                    product.minStock
                  )}
                </p>

              </div>


              <span
                class="stock-badge low"
              >
                ${num(
                  product.stock
                )} left
              </span>

            </div>


            <div class="product-actions">

              <button
                class="secondary"
                onclick="
                  purchaseProductQuick(
                    '${product.id}'
                  )
                "
              >
                ＋ Restock
              </button>


              <button
                class="secondary"
                onclick="
                  openProduct(
                    '${product.id}'
                  )
                "
              >
                ✏️ Edit
              </button>

            </div>

          </div>

        `
      )
      .join("");

}


/* ================= REPORTS ================= */

function renderReports() {

  const revenue =
    getSalesTotal();


  const profit =
    getProfitTotal();


  const inventory =
    getInventoryValue();


  const credit =
    getTotalCredit();


  const revenueBox =
    document.getElementById(
      "reportRevenue"
    );


  if (revenueBox) {

    revenueBox.textContent =
      money(revenue);

  }


  const profitBox =
    document.getElementById(
      "reportProfit"
    );


  if (profitBox) {

    profitBox.textContent =
      money(profit);

  }


  const inventoryBox =
    document.getElementById(
      "reportInventory"
    );


  if (inventoryBox) {

    inventoryBox.textContent =
      money(inventory);

  }


  const creditBox =
    document.getElementById(
      "reportCredit"
    );


  if (creditBox) {

    creditBox.textContent =
      money(credit);

  }


  renderTransactionHistory();

}


/* ================= TRANSACTION HISTORY ================= */

function renderTransactionHistory() {

  const list =
    document.getElementById(
      "transactionList"
    );


  if (!list) return;


  const history =
    transactions
      .slice()
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );


  if (!history.length) {

    list.innerHTML = `

      <div class="empty">

        <div
          style="
            font-size:40px;
            margin-bottom:10px;
          "
        >
          📊
        </div>

        <strong>
          No transactions yet
        </strong>

        <p>
          Sales, purchases and payments will appear here.
        </p>

      </div>

    `;

    return;

  }


  list.innerHTML =
    history
      .map(
        transaction => {

          let title =
            "Transaction";

          let subtitle =
            "";

          let amount =
            0;


          if (
            transaction.type ===
            "sale"
          ) {

            title =
              "🧾 Sale · " +
              (
                transaction.billNo ||
                "Bill"
              );

            subtitle =
              transaction.customerName ||
              "Walk-in Customer";

            amount =
              num(
                transaction.total
              );

          }


          if (
            transaction.type ===
            "purchase"
          ) {

            title =
              "🛒 Purchase";

            subtitle =
              transaction.productName ||
              "Product";

            amount =
              num(
                transaction.total
              );

          }


          if (
            transaction.type ===
            "payment"
          ) {

            title =
              "💵 Payment Received";

            subtitle =
              transaction.partyName ||
              "Customer";

            amount =
              num(
                transaction.amount
              );

          }


          return `

            <div class="product-card">

              <div class="product-top">

                <div>

                  <h3>
                    ${esc(title)}
                  </h3>

                  <p>
                    ${esc(subtitle)}
                  </p>

                </div>


                <strong>
                  ${money(amount)}
                </strong>

              </div>


              <div
                style="
                  margin-top:8px;
                  color:var(--muted);
                  font-size:12px;
                "
              >
                ${formatDate(
                  transaction.date
                )}

                ${
                  transaction.paymentMethod
                    ? " · " +
                      esc(
                        transaction.paymentMethod
                      )
                    : ""
                }

              </div>

            </div>

          `;

        }
      )
      .join("");

}
/* =========================================================
   STOCKLY V5 — PART 7
   DARK MODE + BACKUP + RESTORE + STARTUP
   ========================================================= */


/* ================= DARK MODE ================= */

function applyDarkMode() {

  const enabled =
    localStorage.getItem(
      DARK_KEY
    ) === "1";


  document.body.classList.toggle(
    "dark",
    enabled
  );


  const toggle =
    document.getElementById(
      "darkToggle"
    );


  if (toggle) {

    toggle.checked =
      enabled;

  }

}


/* ================= TOGGLE DARK MODE ================= */

function toggleDark() {

  const enabled =
    document.body.classList.toggle(
      "dark"
    );


  localStorage.setItem(
    DARK_KEY,
    enabled ? "1" : "0"
  );


  const toggle =
    document.getElementById(
      "darkToggle"
    );


  if (toggle) {

    toggle.checked =
      enabled;

  }

}


/* ================= BACKUP ================= */

function backupData() {

  const backup = {

    app:
      "Stockly",

    version:
      "V5",

    exportedAt:
      new Date().toISOString(),

    products:
      products,

    transactions:
      transactions,

    parties:
      parties,

    meetings:
      meetings

  };


  const json =
    JSON.stringify(
      backup,
      null,
      2
    );


  const blob =
    new Blob(
      [json],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  const date =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );


  link.href =
    url;


  link.download =
    `Stockly-V5-Backup-${date}.json`;


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  URL.revokeObjectURL(
    url
  );


  toast(
    "Backup downloaded successfully"
  );

}


/* ================= RESTORE ================= */

function restoreData(event) {

  const file =
    event.target.files[0];


  if (!file) return;


  const reader =
    new FileReader();


  reader.onload =
    function () {

      try {

        const data =
          JSON.parse(
            reader.result
          );


        if (
          !data ||
          !Array.isArray(
            data.products
          ) ||
          !Array.isArray(
            data.transactions
          ) ||
          !Array.isArray(
            data.parties
          )
        ) {

          throw new Error(
            "Invalid backup"
          );

        }


        const confirmed =
          confirm(
            "Restore this backup? Current Stockly data will be replaced."
          );


        if (!confirmed) {

          event.target.value =
            "";

          return;

        }


        products =
          data.products;


        transactions =
          data.transactions;


        parties =
          data.parties;

        meetings =
          Array.isArray(data.meetings)
            ? data.meetings
            : [];


        saveProducts();

        saveTransactions();

        saveParties();
        saveMeetings();


        event.target.value =
          "";


        toast(
          "Backup restored successfully"
        );


        setTimeout(
          () => {
            location.reload();
          },
          700
        );

      }

      catch (error) {

        console.error(
          error
        );


        toast(
          "Invalid Stockly backup file"
        );


        event.target.value =
          "";

      }

    };


  reader.readAsText(
    file
  );

}


/* ================= RESET DATA ================= */

function resetData() {

  const confirmed =
    confirm(
      "Delete ALL Stockly data? This cannot be undone."
    );


  if (!confirmed) {

    return;

  }


  const secondConfirm =
    confirm(
      "Are you absolutely sure? Products, sales, purchases and customers will be deleted."
    );


  if (!secondConfirm) {

    return;

  }


  localStorage.removeItem(
    PRODUCT_KEY
  );


  localStorage.removeItem(
    TRANSACTION_KEY
  );


  localStorage.removeItem(
    PARTY_KEY
  );

  localStorage.removeItem(
    MEETING_KEY
  );


  products = [];

  transactions = [];

  parties = [];
  meetings = [];


  toast(
    "All Stockly data has been reset"
  );


  setTimeout(
    () => {
      location.reload();
    },
    700
  );

}



/* ================= ROUGH BOOK / MEETINGS ================= */

function meetingStatus(meeting){
  const tasks = Array.isArray(meeting.tasks) ? meeting.tasks : [];
  if (!tasks.length) return "In Progress";
  return tasks.every(t => t.done) ? "Completed" : "In Progress";
}

function meetingInitial(name){
  const value = String(name || "Client").trim();
  return value ? value.charAt(0).toUpperCase() : "C";
}

function renderMeetings(){
  const list = document.getElementById("meetingList");
  if (!list) return;

  const search = (document.getElementById("meetingSearch")?.value || "").trim().toLowerCase();
  const rows = (Array.isArray(meetings) ? meetings : [])
    .slice()
    .sort((a,b) => new Date(b.dateTime || b.createdAt) - new Date(a.dateTime || a.createdAt))
    .filter(m => {
      if (!search) return true;
      return [m.clientName,m.company,m.title,m.notes].join(" ").toLowerCase().includes(search);
    });

  if (!rows.length){
    list.innerHTML = `<div class="empty"><div style="font-size:42px;margin-bottom:10px">✏️</div><strong>No meetings yet</strong><p>Create your first client meeting and keep every point in one place.</p></div>`;
    return;
  }

  list.innerHTML = rows.map(m => {
    const notesCount = Array.isArray(m.notesList) ? m.notesList.length : (m.notes ? 1 : 0);
    const tasksCount = Array.isArray(m.tasks) ? m.tasks.length : 0;
    const date = m.dateTime ? formatDate(m.dateTime) : formatDate(m.createdAt);
    const status = meetingStatus(m);
    return `
      <div class="rough-card">
        <div class="rough-card-top">
          <div style="display:flex;gap:11px;min-width:0">
            <div class="rough-avatar">${esc(meetingInitial(m.clientName))}</div>
            <div style="min-width:0">
              <h3 style="font-size:16px;margin-bottom:4px">${esc(m.clientName || "Client")}</h3>
              <p style="color:var(--muted);font-size:12px">${esc(m.title || "Client meeting")}${m.company ? " · " + esc(m.company) : ""}</p>
              ${m.meetingLink ? `<a class="rough-link" href="${esc(m.meetingLink)}" target="_blank" rel="noopener">🔗 Open meeting link</a>` : ""}
            </div>
          </div>
          <span class="rough-status">${esc(status)}</span>
        </div>
        <div class="rough-meta">
          <span class="rough-chip">📅 ${esc(date)}</span>
          <span class="rough-chip">📝 ${notesCount} note${notesCount === 1 ? "" : "s"}</span>
          <span class="rough-chip">☑️ ${tasksCount} follow-up${tasksCount === 1 ? "" : "s"}</span>
        </div>
        <button type="button" class="save" style="margin-top:12px" onclick="openMeeting('${esc(m.id)}')">Open Meeting</button>
      </div>`;
  }).join("");
}

function openMeetingForm(){
  showModal("Create New Meeting", `
    <form onsubmit="return saveMeeting(event)">
      <div class="field"><label>Client Name *</label><input id="meetingClient" required placeholder="e.g. ABC Traders"></div>
      <div class="field"><label>Company / Business</label><input id="meetingCompany" placeholder="e.g. ABC Traders Pvt. Ltd."></div>
      <div class="field"><label>Meeting Title *</label><input id="meetingTitle" required placeholder="e.g. Product requirement / Price discussion"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="field"><label>Date</label><input id="meetingDate" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
        <div class="field"><label>Time</label><input id="meetingTime" type="time" value="${new Date().toTimeString().slice(0,5)}"></div>
      </div>
      <div class="field"><label>Online Meeting Link (optional)</label><input id="meetingLink" type="url" placeholder="https://meet.google.com/..."></div>
      <div class="field"><label>First Notes</label><textarea id="meetingInitialNotes" rows="5" placeholder="Write the important points from the meeting..."></textarea></div>
      <button class="save" type="submit">Create Meeting</button>
    </form>`);
}

function saveMeeting(event){
  event.preventDefault();
  const clientName = document.getElementById("meetingClient")?.value.trim();
  const title = document.getElementById("meetingTitle")?.value.trim();
  if (!clientName || !title){ toast("Client name and meeting title are required"); return false; }

  const date = document.getElementById("meetingDate")?.value || new Date().toISOString().slice(0,10);
  const time = document.getElementById("meetingTime")?.value || "00:00";
  const initialNotes = document.getElementById("meetingInitialNotes")?.value.trim() || "";
  const meeting = {
    id: makeId("meeting"),
    clientName,
    company: document.getElementById("meetingCompany")?.value.trim() || "",
    title,
    dateTime: new Date(`${date}T${time}`).toISOString(),
    meetingLink: document.getElementById("meetingLink")?.value.trim() || "",
    notes: initialNotes,
    notesList: initialNotes ? [{id:makeId("note"),text:initialNotes,createdAt:new Date().toISOString()}] : [],
    tasks: [],
    drawing: "",
    createdAt: new Date().toISOString()
  };
  meetings.unshift(meeting);
  saveMeetings();
  closeModal();
  renderMeetings();
  toast("✅ Meeting saved");
  setTimeout(() => openMeeting(meeting.id), 120);
  return false;
}

function findMeeting(id){ return meetings.find(m => m.id === id); }

function openMeeting(id){
  const m = findMeeting(id);
  if (!m){ toast("Meeting not found"); return; }
  if (!Array.isArray(m.notesList)) m.notesList = m.notes ? [{id:makeId("note"),text:m.notes,createdAt:m.createdAt || new Date().toISOString()}] : [];
  if (!Array.isArray(m.tasks)) m.tasks = [];

  const notesHtml = m.notesList.length
    ? m.notesList.map(n => `<div class="rough-note">${esc(n.text)}</div>`).join("")
    : `<div class="empty"><p>No typed notes yet.</p></div>`;
  const tasksHtml = m.tasks.length
    ? m.tasks.map((t,i) => `<label class="rough-task ${t.done ? "done" : ""}"><input type="checkbox" ${t.done ? "checked" : ""} onchange="toggleMeetingTask('${esc(m.id)}',${i})"><span>${esc(t.text)}</span></label>`).join("")
    : `<div class="empty"><p>No follow-up tasks yet.</p></div>`;

  showModal(`${esc(m.clientName)} · Meeting`, `
    <div>
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:13px">
        <div class="rough-avatar">${esc(meetingInitial(m.clientName))}</div>
        <div><strong>${esc(m.clientName)}</strong><div style="font-size:12px;color:var(--muted)">${esc(m.company || m.title)}</div></div>
      </div>
      <div class="rough-meta" style="margin-bottom:14px">
        <span class="rough-chip">📅 ${esc(formatDate(m.dateTime))}</span>
        <span class="rough-chip">📝 ${m.notesList.length} notes</span>
        <span class="rough-chip">☑️ ${m.tasks.length} tasks</span>
      </div>
      ${m.meetingLink ? `<a class="save" style="display:block;text-align:center;text-decoration:none;margin-bottom:14px" href="${esc(m.meetingLink)}" target="_blank" rel="noopener">🔗 Open Online Meeting</a>` : ""}

      <div class="rough-toolbar">
        <button type="button" class="active" onclick="showMeetingTab('meetingNotesTab',this)">📝 Notes</button>
        <button type="button" onclick="showMeetingTab('meetingTasksTab',this)">☑️ Tasks</button>
        <button type="button" onclick="showMeetingTab('meetingDetailsTab',this)">ℹ️ Details</button>
      </div>

      <div id="meetingNotesTab">
        <div class="rough-toolbar">
          <button type="button" class="active" onclick="showMeetingEditor('typedEditor',this)">T Text</button>
          <button type="button" onclick="showMeetingEditor('drawEditor',this);initMeetingCanvas('${esc(m.id)}')">✏️ Handwriting</button>
        </div>
        <div id="typedEditor">
          ${notesHtml}
          <textarea id="newMeetingNote" rows="4" placeholder="Add another note..."></textarea>
          <button type="button" class="save" style="margin-top:10px" onclick="addMeetingNote('${esc(m.id)}')">＋ Save Note</button>
        </div>
        <div id="drawEditor" style="display:none">
          <div class="rough-canvas-wrap"><canvas id="meetingCanvas" class="rough-canvas"></canvas></div>
          <div class="rough-toolbar" style="margin-top:10px">
            <button type="button" onclick="clearMeetingCanvas()">↩ Clear</button>
            <button type="button" class="save" onclick="saveMeetingDrawing('${esc(m.id)}')">💾 Save Handwriting</button>
          </div>
        </div>
      </div>

      <div id="meetingTasksTab" style="display:none">
        ${tasksHtml}
        <div style="display:flex;gap:8px;margin-top:12px">
          <input id="newMeetingTask" placeholder="e.g. Send quotation on 24 Sep" style="flex:1">
          <button type="button" class="save" style="width:auto;padding:10px 14px" onclick="addMeetingTask('${esc(m.id)}')">＋ Add</button>
        </div>
      </div>

      <div id="meetingDetailsTab" style="display:none">
        <div class="rough-detail-grid">
          <div class="rough-mini"><span>Client</span><strong>${esc(m.clientName)}</strong></div>
          <div class="rough-mini"><span>Company</span><strong>${esc(m.company || "—")}</strong></div>
          <div class="rough-mini"><span>Meeting</span><strong>${esc(m.title)}</strong></div>
          <div class="rough-mini"><span>Status</span><strong>${esc(meetingStatus(m))}</strong></div>
        </div>
        <button type="button" class="secondary" style="margin-top:12px" onclick="deleteMeeting('${esc(m.id)}')">🗑️ Delete Meeting</button>
      </div>
    </div>`);
  if (m.drawing) setTimeout(() => loadMeetingDrawing(m.drawing), 80);
}

function showMeetingTab(id, button){
  ["meetingNotesTab","meetingTasksTab","meetingDetailsTab"].forEach(x => { const el=document.getElementById(x); if(el) el.style.display = x===id ? "block":"none"; });
  button.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
}

function showMeetingEditor(id, button){
  ["typedEditor","drawEditor"].forEach(x => { const el=document.getElementById(x); if(el) el.style.display = x===id ? "block":"none"; });
  button.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
}

function addMeetingNote(id){
  const m=findMeeting(id); const input=document.getElementById("newMeetingNote");
  if(!m || !input) return;
  const text=input.value.trim(); if(!text){toast("Write something first");return;}
  m.notesList = Array.isArray(m.notesList) ? m.notesList : [];
  m.notesList.push({id:makeId("note"),text,createdAt:new Date().toISOString()});
  m.notes = m.notesList.map(n=>n.text).join("\\n\\n");
  saveMeetings(); toast("✅ Note saved"); openMeeting(id); renderMeetings();
}

function addMeetingTask(id){
  const m=findMeeting(id); const input=document.getElementById("newMeetingTask");
  if(!m || !input) return;
  const text=input.value.trim(); if(!text){toast("Write a task first");return;}
  m.tasks = Array.isArray(m.tasks) ? m.tasks : [];
  m.tasks.push({id:makeId("task"),text,done:false});
  saveMeetings(); toast("✅ Follow-up added"); openMeeting(id); renderMeetings();
}

function toggleMeetingTask(id,index){
  const m=findMeeting(id); if(!m || !m.tasks[index]) return;
  m.tasks[index].done=!m.tasks[index].done; saveMeetings(); openMeeting(id); renderMeetings();
}

let meetingDrawingState = {canvas:null,ctx:null,drawing:false,lastX:0,lastY:0};
function initMeetingCanvas(id){
  const m=findMeeting(id), canvas=document.getElementById("meetingCanvas"); if(!m||!canvas)return;
  const ratio=Math.max(1,Math.min(2,window.devicePixelRatio||1));
  const rect=canvas.getBoundingClientRect(); canvas.width=Math.round(rect.width*ratio); canvas.height=Math.round(rect.height*ratio);
  const ctx=canvas.getContext("2d"); ctx.scale(ratio,ratio); ctx.lineWidth=2.2; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.strokeStyle="#173a69";
  meetingDrawingState={canvas,ctx,drawing:false,lastX:0,lastY:0};
  if(m.drawing) loadMeetingDrawing(m.drawing);
  const point=e=>{const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
  canvas.onpointerdown=e=>{e.preventDefault();const p=point(e);meetingDrawingState.drawing=true;meetingDrawingState.lastX=p.x;meetingDrawingState.lastY=p.y;canvas.setPointerCapture(e.pointerId)};
  canvas.onpointermove=e=>{if(!meetingDrawingState.drawing)return;const p=point(e);ctx.beginPath();ctx.moveTo(meetingDrawingState.lastX,meetingDrawingState.lastY);ctx.lineTo(p.x,p.y);ctx.stroke();meetingDrawingState.lastX=p.x;meetingDrawingState.lastY=p.y};
  canvas.onpointerup=()=>meetingDrawingState.drawing=false; canvas.onpointercancel=()=>meetingDrawingState.drawing=false;
}
function clearMeetingCanvas(){const c=meetingDrawingState.canvas,ctx=meetingDrawingState.ctx;if(!c||!ctx)return;ctx.clearRect(0,0,c.width,c.height)}
function saveMeetingDrawing(id){
  const m=findMeeting(id),c=meetingDrawingState.canvas; if(!m||!c){toast("Open the handwriting tab first");return}
  m.drawing=c.toDataURL("image/png"); saveMeetings(); toast("✅ Handwriting saved"); renderMeetings();
}
function loadMeetingDrawing(data){
  const c=meetingDrawingState.canvas,ctx=meetingDrawingState.ctx;if(!c||!ctx||!data)return;
  const img=new Image(); img.onload=()=>{ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.clientWidth,c.clientHeight)}; img.src=data;
}
function openQuickRoughNote(){
  showModal("Quick Rough Note",`
    <div class="field"><label>Client / Topic</label><input id="quickNoteTitle" placeholder="e.g. ABC Traders — price discussion"></div>
    <div class="field"><label>Note</label><textarea id="quickNoteText" rows="9" placeholder="Write anything quickly..."></textarea></div>
    <button type="button" class="save" onclick="saveQuickRoughNote()">💾 Save Note</button>`);
}
function saveQuickRoughNote(){
  const title=document.getElementById("quickNoteTitle")?.value.trim()||"Quick Note";
  const text=document.getElementById("quickNoteText")?.value.trim(); if(!text){toast("Write something first");return}
  const m={id:makeId("meeting"),clientName:title,company:"",title:"Quick Rough Note",dateTime:new Date().toISOString(),meetingLink:"",notes:text,notesList:[{id:makeId("note"),text,createdAt:new Date().toISOString()}],tasks:[],drawing:"",createdAt:new Date().toISOString()};
  meetings.unshift(m);saveMeetings();closeModal();renderMeetings();toast("✅ Rough note saved");
}
function deleteMeeting(id){
  const m=findMeeting(id); if(!m)return;
  if(!confirm(`Delete the meeting with ${m.clientName || "this client"}?`))return;
  meetings=meetings.filter(x=>x.id!==id);saveMeetings();closeModal();renderMeetings();toast("Meeting deleted");
}

/* ================= ESCAPE CLOSE ================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key ===
      "Escape"
    ) {

      const modal =
        document.getElementById(
          "modalOverlay"
        );


      if (
        modal &&
        modal.classList.contains(
          "show"
        )
      ) {

        closeModal();

      }

    }

  }
);


/* ================= RUNTIME ERROR REPORTER ================= */
window.__stocklyRuntimeReporter = true;
window.addEventListener("error", function (event) {
  console.error("Stockly runtime error:", event.error || event.message);
});
window.addEventListener("unhandledrejection", function (event) {
  console.error("Stockly promise error:", event.reason);
});


/* ================= STARTUP ================= */

function startStockly() {

  loadData();


  applyDarkMode();


  renderDashboard();

  renderProducts();

  renderParties();

  renderSales();

  renderPurchases();

  renderReports();

  renderMeetings();


  page("home");

}


/* ================= PAGE REFRESH ================= */

function refreshAll() {

  renderDashboard();

  renderProducts();

  renderParties();

  renderSales();

  renderPurchases();

  renderReports();

  renderMeetings();

}


/* ================= START APP ================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startStockly
  );

} else {

  startStockly();

}



// Make invoice actions explicitly available to dynamically rendered buttons.
window.openPurchaseInvoice = openPurchaseInvoice;
window.printPurchaseInvoice = printPurchaseInvoice;
window.openInvoice = openInvoice;
