const state = {
  editedId: "",
  product: [],
};

//initialization and render
initialization();

// default state
function initialization() {
  window.onload = render;
  homeButton();
  addHero();
}
// Render Data from mongoDB
async function render() {
  const main = document.querySelector("main");

  const response = await fetch("/heroes");
  if (!response.ok) {
    console.log("Server Error");
    return;
  }
  const data = await response.json();

  //Save data from the default state
  state.product = data;
  content = "";
  totalDMG = 0;

  for (product of data) {
    if (state.editedId === product._id) {
      content += ` <div class="heroesList">
              <input type="text" id="nameE" name="name" value="${product.name}">
              <input type="text" id="dmgE" name="dmg" value="${product.dmg}">
              <button id="done">Done</button>
              </div>`;
    } else {
      content += ` <div class="heroesList">
              <h3 class="heroName">${product.name}</h3>
              <p class="heroDmg">${product.dmg}</p>
              <button class="editButton" data-productid=${product._id}>EDIT</button>
              <button class="deleteButton" data-productid=${product._id}>DELETE</button>
              </div>`;
    }

    totalDMG += product.dmg;
  }
  main.innerHTML = content;

  if (main.childElementCount > 0) {
    const footer = document.querySelector("footer");
    footer.innerHTML = `<h5>Total damage: ${totalDMG}</h5>`;
  }

  if (state.editedId != "") {
    const done = document.querySelector("#done");
    done.onclick = async function () {
      const nameE = document.getElementById("nameE").value;
      const dmgE = Number(document.getElementById("dmgE").value);
      const body = {
        name: nameE,
        dmg: dmgE,
      };
      const response = await fetch(`/heroes/${state.editedId}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!response.ok) {
        console.log("Server Error");
        return;
      }

      const data = await response.json();
      state.editedId = "";
      render();
    };
  }
  deleteButton();
  editButton();
}
// Home Button
function homeButton() {
  const home = document.querySelector("#home");
  home.onclick = function (event) {
    event.preventDefault();
    render();
  };
}
// Add Hero Button
function addHero() {
  const addhero = document.querySelector("#addHero");
  const footer = document.querySelector("footer");

  addhero.addEventListener("click", function (event) {
    event.preventDefault();

    const main = document.querySelector("main");
    main.innerHTML = "";
    footer.innerHTML = "";

    main.innerHTML = `<form id="heroCreate">
    <div class="top">
      <label for="name">Name</label
      ><input
        type="text"
        id="name"
        name="name"
        autocomplete="off"
        required
      />
    </div>
    <div class="bottom">
      <label for="dmg">Damage</label
      ><input
        type="text"
        id="dmg"
        name="dmg"
        autocomplete="off"
        required
      />
    </div>
    <div id="createDiv">
      <input type="submit" value="Create" id="create" />
    </div> 
    <p class="green">Successful!</p>
  </form>`;

    const heroCreate = document.querySelector("#heroCreate");

    heroCreate.onsubmit = async function (event) {
      event.preventDefault();

      const name = event.target.elements.name.value;
      const dmg = Number(event.target.elements.dmg.value);

      const response = await fetch("/heroes", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          dmg: dmg,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) {
        console.log("Server Error");
        return;
      }
      const data = await response.json();

      const greenSuccess = document.querySelector(".green");

      greenSuccess.classList.add("noHide");
      setTimeout(function () {
        greenSuccess.classList.remove("noHide");
      }, 1500);

      heroCreate.reset();
    };
  });
}
// Delete Button
function deleteButton() {
  const deleteButton = document.querySelectorAll(".deleteButton");

  for (const elem of deleteButton) {
    elem.onclick = async function (event) {
      const id = event.target.dataset.productid;

      const response = await fetch(`/heroes/${id}`, {
        method: "DELETE",
      });

      if (!response) {
        console.log("Server Error");
        return;
      }
      const data = await response.json();
      console.log(data);

      render();
    };
  }
}
// Edit Button
function editButton() {
  const editButton = document.querySelectorAll(".editButton");

  for (const elem of editButton) {
    elem.onclick = async function (event) {
      const id = event.target.dataset.productid;

      state.editedId = id;

      const response = await fetch(`/heroes/${id}`);

      if (!response) {
        console.log("Server Error");
        return;
      }
      const data = await response.json();
      //It's working too but i found another way to update a single data
      console.log(data);
      render();
    };
  }
}
