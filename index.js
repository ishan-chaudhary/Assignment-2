var editRow = null;
let localDataStorage = localStorage.getItem("data");
if (!localDataStorage) localStorage.setItem("data", JSON.stringify([]));

window.onload = function () {
  loadExistingData();
  let form = document.getElementById("list-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let mode = form.getAttribute("data-mode");
    if (mode == "add") {
      addRowHandler();
    } else if (mode == "edit") {
      editRowHandler();
    }
  });
};

function addRowHandler() {
  let itemName = document.getElementById("item-name");
  let quantity = document.getElementById("quantity").value;
  let list = document.getElementsByClassName("list-container")[0];
  let index = JSON.parse(localStorage.getItem("data")).length;
  let listRow = createNewRow(itemName.innerText, quantity, index);
  list.appendChild(listRow);
  let data = JSON.parse(localStorage.getItem("data"));
  data.push({ name: itemName.innerText, quantity: quantity });
  localStorage.removeItem("data");
  localStorage.setItem("data", JSON.stringify(data));
  itemName.innerText = "";
}

function editEnableHandler(listRow) {
  let form = document.getElementById("list-form");
  editRow = listRow;
  form.setAttribute("data-mode", "edit");
  let index = this.getAttribute("data-index");
  let data = JSON.parse(localStorage.getItem("data"));
  let itemName = document.getElementById("item-name");
  let quantity = document.getElementById("quantity").value;

  itemName.innerText = data[index].name;
  quantity.value = data[index].quantity;
}

function editRowHandler() {
  if (editRow) {
    let itemName = document.getElementById("item-name");
    let quantity = document.getElementById("quantity").value;
    let itemNameRow = editRow.childNodes[0];
    itemNameRow.innerText = itemName.innerText;
    let form = document.getElementById("list-form");
    form.setAttribute("data-mode", "add");
    itemName.innerText = "";
    editRow = null;
  } else {
    alert("Internal Server Error");
  }
}

function loadExistingData() {
  let data = JSON.parse(localStorage.getItem("data"));
  let list = document.getElementsByClassName("list-container")[0];
  let index = 0;
  for (let i in data) {
    let listRow = createNewRow(data[i].name, data[i].quantity, index);
    list.appendChild(listRow);
    index++;
  }
}

function createNewRow(name, quantity, index) {
  let listRow = document.createElement("div");
  listRow.setAttribute("class", "list-row");

  let itemNameRow = document.createElement("div");
  itemNameRow.setAttribute("class", "item-name");
  itemNameRow.setAttribute("id", "item-name-" + index);
  itemNameRow.innerText = name;

  let editButton = document.createElement("button");
  editButton.setAttribute("class", "btn-edit");
  editButton.setAttribute("type", "button");
  editButton.setAttribute("data-index", index);
  editButton.innerText = "Edit";

  editButton.addEventListener(
    "click",
    editEnableHandler.bind(editButton, listRow)
  );

  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "btn-danger");
  deleteButton.innerText = "Delete";

  editButton.setAttribute("data-index", index);
  deleteButton.setAttribute("data-index", index);

  deleteButton.addEventListener(
    "click",
    deleteHandler.bind(deleteButton, listRow)
  );

  listRow.appendChild(itemNameRow);
  listRow.appendChild(editButton);
  listRow.appendChild(deleteButton);
  return listRow;
}

function deleteHandler(listRow) {
  let list = document.getElementsByClassName("list-container")[0];
  list.removeChild(listRow);
  let data = JSON.parse(localStorage.getItem("data"));
  let index = this.getAttribute("data-index");
  let finalArray = data.filter(function (el, i) {
    return i != index;
  });
  localStorage.removeItem("data");
  localStorage.setItem("data", JSON.stringify(finalArray));
}
