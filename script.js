document.addEventListener("DOMContentLoaded", () => {

  let rallyCount = 0;

  const rallyContainer = document.getElementById("rallyContainer");
  const rallyList = document.getElementById("rallyList");
  const addRallyBtn = document.getElementById("addRally");

  addRallyBtn.onclick = () => {
    rallyCount++;
    createRallyCreator(rallyCount);
    updateRallyList();
  };

  function createRallyCreator(number) {
    const rally = document.createElement("div");
    rally.className = "rally";
    rally.dataset.id = number;

    rally.innerHTML = `
      <div class="rally-header">
        <input type="text" value="Rally Creator ${number}">
        <button class="delete">✖</button>
      </div>

      <div class="t-grid">
        ${createTBox("T1")}
        ${createTBox("T2")}
        ${createTBox("T3")}
        ${createTBox("T4")}
        ${createTBox("Castle")}
      </div>
    `;

    rallyContainer.appendChild(rally);

    rally.querySelector(".delete").onclick = () => {
      rally.remove();
      updateRallyList();
    };

    rally.querySelector("input").addEventListener("input", updateRallyList);
  }

  function createTBox(name) {
    return `
      <div class="t-box">
        <strong>${name}</strong>
        <label>Minutes</label>
        <input type="number" min="0" value="0">
        <label>Seconds</label>
        <input type="number" min="0" value="0">
      </div>
    `;
  }

  function updateRallyList() {
    rallyList.innerHTML = "";

    document.querySelectorAll(".rally").forEach((rally, index) => {
      const name = rally.querySelector("input").value;

      const row = document.createElement("div");
      row.className = "target-row";

      row.innerHTML = `
        <span>${name}</span>
        <select>
          <option>No target</option>
          <option>T1</option>
          <option>T2</option>
          <option>T3</option>
          <option>T4</option>
          <option>Castle</option>
        </select>
      `;

      rallyList.appendChild(row);
    });
  }

  document.getElementById("calculate").onclick = () => {
    alert("Next step: calculation logic 😎");
  };

});
