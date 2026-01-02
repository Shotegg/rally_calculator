document.addEventListener("DOMContentLoaded", () => {

  let rallyCount = 0;

  const rallyContainer = document.getElementById("rallyContainer");
  const rallyList = document.getElementById("rallyList");
  const addRallyBtn = document.getElementById("addRally");
  const calculateBtn = document.getElementById("calculate");

  addRallyBtn.onclick = () => {
    rallyCount++;
    createRallyCreator(rallyCount);
    updateRallyList();
  };

  function createRallyCreator(number) {
    const rally = document.createElement("div");
    rally.className = "rally";

    rally.innerHTML = `
      <h3>
        <input type="text" value="Rally Creator ${number}">
      </h3>

      <div class="t-grid">
        ${createTBox("T1")}
        ${createTBox("T2")}
        ${createTBox("T3")}
        ${createTBox("T4")}
        ${createTBox("Castle")}
      </div>
    `;

    rallyContainer.appendChild(rally);

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
    document.querySelectorAll(".rally").forEach(rally => {
      const name = rally.querySelector("input").value;
      const li = document.createElement("li");
      li.textContent = name;
      rallyList.appendChild(li);
    });
  }

  calculateBtn.onclick = () => {
    alert("Calculate logic coming next 😉");
  };

});
