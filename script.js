const addBtn = document.querySelector(".btn");
const clearAllBtn = document.querySelector("#clear");
const userInput = document.querySelector("#item-input");
const filterInput = document.querySelector("#filter");
const itemList = document.querySelector("#item-list");

let items = JSON.parse(localStorage.getItem("Items"));
console.log(items);
if (items !== null) {
  displayItems(items);
} else {
  items = [];
  hideElements();
}

addBtn.addEventListener("click", handleAddClick);
itemList.addEventListener("click", handleItemListClick);
clearAllBtn.addEventListener("click", handleClearAllClick);
filterInput.addEventListener("click", handleFilterInput);

function handleAddClick(e) {
  e.preventDefault();
  if (!isEdit) {
    // console.log(`isEdit: ${isEdit}`);
    // console.log("Add Button Clicked");
    // trim the input to remove whitespaces
    let item = userInput.value.trim();
    if (item === "") {
      alert("Item Cannot be Empty");
      return;
    }

    addItem(item);
    showElements();
  } else {
    // console.log(`Edit Button Clicked`);
    const editedItem = document.querySelector(".edit-mode");
    if (editedItem) updateItem(editedItem);
  }
}

function handleItemListClick(e) {
  if (e.target.tagName === "I" && !e.target.classList.contains("edit")) {
    const parent = e.target.parentElement;
    const grandParent = parent.parentElement;
    // console.log(parent);
    // console.log(grandParent);
    removeItem(grandParent);
  } else if (e.target.tagName === "I" && e.target.classList.contains("edit")) {
    // console.log(e.target);
    // console.log(`isEdit: ${isEdit}`);
    const parent = e.target.parentElement;
    const grandParent = parent.parentElement;

    isEdit = true;
    const editedItem = grandParent;
    editItem(editedItem);
  }
}
function handleClearAllClick(e) {
  clearAllItems();
}
function handleFilterInput(e) {
  let value = e.target.value.trim().toLowerCase();
  filterItems(value);
}

let isEdit = false;

// console.log(items);

// Adding Items
// addBtn.addEventListener("click", function (e) {
//   e.preventDefault();
//   if (!isEdit) {
//     // console.log(`isEdit: ${isEdit}`);
//     // console.log("Add Button Clicked");
//     // trim the input to remove whitespaces
//     let item = userInput.value.trim();
//     if (item === "") alert("Item Cannot be Empty");

//     addItem(item);
//     document.querySelector(".filter").style.display = "block";
//     clearAllBtn.style.display = "block";
//   } else {
//     // console.log(`Edit Button Clicked`);
//     const editedItem = document.querySelector(".edit-mode");
//     if (editedItem) updateItem(editedItem);
//   }
// });

// Removing Items
/* itemList.addEventListener("click", (e) => {
  if (e.target.tagName === "I" && !e.target.classList.contains("edit")) {
    const parent = e.target.parentElement;
    const grandParent = parent.parentElement;
    // console.log(parent);
    // console.log(grandParent);
    removeItem(grandParent);
  }
});
 */

// Editing Items
/* itemList.addEventListener("click", function (e) {
  if (e.target.tagName === "I" && e.target.classList.contains("edit")) {
    // console.log(e.target);
    // console.log(`isEdit: ${isEdit}`);
    const parent = e.target.parentElement;
    const grandParent = parent.parentElement;

    isEdit = true;
    const editedItem = grandParent;
    editItem(editedItem);
  }
}); */

// Removing All Items
/* clearAllBtn.addEventListener("click", function (e) {
  clearAllItems();
}); */

// Filtering Items
/* filterInput.addEventListener("input", function (e) {
  let value = e.target.value.trim().toLowerCase();
  filterItems(value);
}); */

// Functions
function hideElements() {
  document.querySelector(".filter").style.display = "none";
  clearAllBtn.style.display = "none";
}

function showElements() {
  document.querySelector(".filter").style.display = "block";
  clearAllBtn.style.display = "block";
}

function displayItems(items) {
  let output = "";
  items.forEach(function (item) {
    output += `
      <li>
          ${item}
          <button class="remove-item btn-link text-red">
            <i class="fa-solid fa-pen-to-square edit"></i>
            <i class="fa-solid fa-xmark"></i>
          </button>
      </li>
    `;
  });
  itemList.innerHTML = output;
}

function editItem(item) {
  if (isEdit) {
    console.log(`isEdit: ${isEdit}`);
    // items = items.filter((listItems) => listItems !== item.textContent.trim());
    // console.log("Items: ", items);
    // updateLocalStorage();

    userInput.value = item.textContent.trim();
    addBtn.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i> Update Item
  `;
    addBtn.style.backgroundColor = "green";
    item.classList.add("edit-mode");
  }
}

function updateItem(item) {
  const updatedText = userInput.value.trim();
  if (updatedText === "") {
    alert("Item cannot be empty");
    return;
  }
  const li = document.createElement("li");
  const text = document.createTextNode(updatedText);
  const button = document.createElement("button");
  button.className = "remove-item btn-link text-red";
  button.innerHTML = `
    <i class="fa-solid fa-pen-to-square edit"></i>
    <i class="fa-solid fa-xmark"></i>
  `;

  li.append(text, button);

  const index = items.indexOf(item.textContent.trim());

  itemList.replaceChild(li, item);

  items[index] = updatedText;

  updateLocalStorage();

  resetEditState();
}

function resetEditState() {
  userInput.value = "";
  isEdit = false;
  addBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
  addBtn.style.backgroundColor = "black";

  const editedItem = document.querySelector(".edit-mode");
  if (editedItem) editedItem.classList.remove("edit-mode");
}

function addItem(item) {
  if (item.length !== 0 && items.includes(item)) {
    alert("Item already exists");
    return;
  }
  const li = document.createElement("li");

  const text = document.createTextNode(item);

  const button = createButton("remove-item btn-link text-red");

  li.append(text, button);

  // console.log(li);

  itemList.appendChild(li);
  userInput.value = "";
  items.push(item);

  // Setting values in localStorage
  updateLocalStorage();
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;

  button.innerHTML = `<i class="fa-solid fa-pen-to-square edit"></i>
  <i class="fa-solid fa-xmark"></i>`;

  return button;
}

function clearAllItems() {
  itemList.innerHTML = "";
  items = [];

  hideElements();

  localStorage.removeItem("Items");
}

function filterItems(value) {
  // console.log(value);
  let arr = items.filter((item) => {
    return item.toLowerCase().includes(value);
  });
  // console.log(arr);
  // console.log(itemList);
  displayItems(arr);
}

function removeItem(item) {
  let index = items.indexOf(item.textContent.trim());
  console.log(index);
  if (index !== -1) {
    items.splice(index, 1);
    itemList.removeChild(item);
    // console.log(items);
    updateLocalStorage();
    if (items.length === 0) hideElements();
  } else {
    console.log("Index is -1");
  }
}

function updateLocalStorage() {
  localStorage.setItem("Items", JSON.stringify(items));
}
