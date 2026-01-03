document.addEventListener("DOMContentLoaded", () => {

  let rallyCount = 0;

  const rallyContainer = document.getElementById("rallyContainer");
  const rallyList = document.getElementById("rallyList");
  const resultBox = document.getElementById("resultBox");

  document.getElementById("addRally").onclick = () => {
    rallyCount++;
    createRallyCreator(rallyCount);
    updateRallyList();
  };

  function createRallyCreator(number) {
    const rally = document.createElement("div");
    rally.className = "rally";

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
      <div class="t-box" data-name="${name}">
        <strong>${name}</strong>
        <label>Minutes</label>
        <input type="number" min="0" value="0" class="min">
        <label>Seconds</label>
        <input type="number" min="0" value="0" class="sec">
      </div>
    `;
  }

  function updateRallyList() {
    rallyList.innerHTML = "";

    document.querySelectorAll(".rally").forEach(rally => {
      const name = rally.querySelector(".rally-header input").value;

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

  document.getElementById("calculate").onclick = calculate;

  function calculate() {
    resultBox.textContent = "";

    const rallies = Array.from(document.querySelectorAll(".rally"));
    const rows = Array.from(document.querySelectorAll(".target-row"));

    const groups = {};

    rallies.forEach((rally, i) => {
      const target = rows[i].querySelector("select").value;
      if (target === "No target") return;

      const box = rally.querySelector(`.t-box[data-name="${target}"]`);
      const min = Number(box.querySelector(".min").value);
      const sec = Number(box.querySelector(".sec").value);
      const total = min * 60 + sec;

      if (!groups[target]) groups[target] = [];
      groups[target].push({
        name: rally.querySelector(".rally-header input").value,
        total
      });
    });

    const nowUTC = new Date();

    Object.values(groups).forEach(group => {
      const max = Math.max(...group.map(g => g.total));

      group.forEach(g => {
        const diff = max - g.total;
        const time = new Date(nowUTC.getTime() + diff * 1000);
        resultBox.textContent += `${g.name} → ${formatUTC(time)}\n`;
      });
    });
  }

  function formatUTC(date) {
    return [
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    ].map(v => String(v).padStart(2, "0")).join(":");
  }

});
