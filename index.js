var editRow = null;
let localDataStorage = localStorage.getItem("data");
if (!localDataStorage) localStorage.setItem("data", JSON.stringify({}));

var list = null;
var heading = null;
var button = null;
var form = null;
var itemName = null;
var quantity = null;

function onLoadFunction() {
  list = document.getElementsByClassName("list-container")[0];
  heading = document.getElementById("add-form-heading");
  button = document.getElementById("add-form-button");
  form = document.getElementById("list-form");
  itemName = document.getElementById("item-name");
  quantity = document.getElementById("quantity");

  loadExistingData();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let mode = form.getAttribute("data-mode");
    if (mode === "add") {
      addRowHandler();
    } else if (mode === "edit") {
      editRowHandler();
    }
  });

  function addRowHandler() {
    let data = JSON.parse(localStorage.getItem("data"));

    if (data.hasOwnProperty(itemName.innerText)) {
      let quantityHolder = document.querySelector(
        ".circle[data-index=" + itemName.innerText + "]"
      );
      let newQuantity =
        Number(quantity.value) + Number(data[itemName.innerText]);
      quantityHolder.innerText = newQuantity;
      data[itemName.innerText] = newQuantity;
      localStorage.removeItem("data");
      localStorage.setItem("data", JSON.stringify(data));
    } else {
      if (itemName.innerText.length == 0 || quantity.value <= 0) {
        alert("Please enter valid quantity and name.");
        return;
      }

      data[itemName.innerText] = quantity.value;
      localStorage.removeItem("data");
      localStorage.setItem("data", JSON.stringify(data));

      let listRow = createNewRow(itemName.innerText, quantity.value);
      list.appendChild(listRow);
    }
    itemName.innerText = "";
    quantity.value = null;
  }

  function editEnableHandler(listRow) {
    editRow = listRow;
    let index = this.getAttribute("data-index");

    form.setAttribute("data-mode", "edit");
    form.setAttribute("data-index", index);

    listRow.childNodes[2].setAttribute("disabled", true);

    let data = JSON.parse(localStorage.getItem("data"));

    heading.innerText = "Edit Grocery Item";
    button.innerText = "Edit Item";

    itemName.innerText = index;
    quantity.value = data[index];
  }

  function editRowHandler() {
    if (editRow) {
      let itemNameRow = editRow.childNodes[0];
      let quantityHolder = itemNameRow.childNodes[1];

      editRow.childNodes[2].removeAttribute("disabled");
      quantityHolder.innerText = quantity.value;

      itemNameRow.innerHTML = itemName.innerText;

      itemNameRow.appendChild(quantityHolder);

      let index = form.getAttribute("data-index");

      form.setAttribute("data-mode", "add");

      let data = JSON.parse(localStorage.getItem("data"));
      data[index] = quantity.value;
      localStorage.removeItem("data");
      localStorage.setItem("data", JSON.stringify(data));

      itemName.innerText = "";
      editRow = null;
      quantity.value = null;
      heading.innerText = "Add Grocery Item";
      button.innerText = "Add Item";
    } else {
      alert("Internal Server Error");
    }
  }

  function loadExistingData() {
    let data = JSON.parse(localStorage.getItem("data"));
    let keys = Object.keys(data);
    for (let key of keys) {
      let listRow = createNewRow(key, data[key]);
      list.appendChild(listRow);
    }
  }

  function createNewRow(name, quantity) {
    let listRow = document.createElement("div");
    listRow.setAttribute("class", "list-row");

    let itemNameRow = document.createElement("div");
    itemNameRow.setAttribute("class", "item-name");
    itemNameRow.setAttribute("id", "item-name-" + name);
    itemNameRow.innerText = name;

    let quantityHolder = document.createElement("div");
    quantityHolder.setAttribute("class", "circle");
    quantityHolder.setAttribute("data-index", name);
    quantityHolder.innerText = quantity;
    itemNameRow.appendChild(quantityHolder);

    let editButton = document.createElement("button");
    editButton.setAttribute("class", "btn-edit");
    editButton.setAttribute("type", "button");
    editButton.setAttribute("data-index", name);
    editButton.innerText = "Edit";

    editButton.addEventListener(
      "click",
      editEnableHandler.bind(editButton, listRow)
    );

    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn-danger");
    deleteButton.innerText = "Delete";

    editButton.setAttribute("data-index", name);
    deleteButton.setAttribute("data-index", name);

    deleteButton.addEventListener(
      "click",
      deleteHandler.bind(deleteButton, listRow)
    );

    listRow.appendChild(itemNameRow);
    listRow.appendChild(editButton);
    listRow.appendChild(deleteButton);
    return listRow;
  }

  function removeFadeOut(el, speed) {
    var seconds = speed / 1000;
    el.style.transition = "opacity " + seconds + "s ease";

    el.style.opacity = 0;
    setTimeout(function () {
      el.parentNode.removeChild(el);
    }, speed);
  }

  function deleteHandler(listRow) {
    removeFadeOut(listRow, 500);
    let data = JSON.parse(localStorage.getItem("data"));
    let index = this.getAttribute("data-index");
    delete data[index];
    localStorage.removeItem("data");
    localStorage.setItem("data", JSON.stringify(data));
  }
}

onLoadFunction();
