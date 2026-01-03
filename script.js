document.addEventListener("DOMContentLoaded", () => {

  let rallyCount = 0;

  const rallyContainer = document.getElementById("rallyContainer");
  const rallyList = document.getElementById("rallyList");
  const resultBox = document.getElementById("resultBox");
  const search = document.getElementById("search");

  document.getElementById("addRally").onclick = () => {
    rallyCount++;
    createRallyCreator(rallyCount);
    openLast();
    updateRallyList();
  };

  function createRallyCreator(number) {
    const rally = document.createElement("div");
    rally.className = "rally";
    rally.draggable = true;

    rally.innerHTML = `
      <div class="rally-header">
        <input type="text" value="Rally Creator ${number}">
        <button class="delete">✖</button>
      </div>

      <div class="rally-content">
        <div class="t-grid">
          ${createTBox("T1")}
          ${createTBox("T2")}
          ${createTBox("T3")}
          ${createTBox("T4")}
          ${createTBox("Castle")}
        </div>
      </div>
    `;

    rallyContainer.appendChild(rally);

    rally.querySelector(".delete").onclick = () => {
      rally.remove();
      updateRallyList();
    };

    rally.querySelector(".rally-header").onclick = (e) => {
      if (e.target.tagName === "BUTTON") return;
      openOnly(rally);
    };

    rally.querySelector("input").addEventListener("input", updateRallyList);

    enableDrag(rally);
  }

  function createTBox(name) {
    return `
      <div class="t-box" data-name="${name}">
        <strong>${name}</strong>
        <label>Minutes</label>
        <input type="number" class="min" min="0" value="0">
        <label>Seconds</label>
        <input type="number" class="sec" min="0" value="0">
      </div>
    `;
  }

  function openOnly(rally) {
    document.querySelectorAll(".rally").forEach(r => r.classList.remove("open"));
    rally.classList.add("open");
  }

  function openLast() {
    const all = document.querySelectorAll(".rally");
    if (all.length) openOnly(all[all.length - 1]);
  }

  /* ---------- SEARCH ---------- */
  search.addEventListener("input", () => {
    const val = search.value.toLowerCase();
    if (!val) return;

    const rally = Array.from(document.querySelectorAll(".rally"))
      .find(r => r.querySelector("input").value.toLowerCase().includes(val));

    if (rally) {
      rallyContainer.prepend(rally);
      openOnly(rally);
      updateRallyList();
    }
  });

  /* ---------- DRAG & DROP ---------- */
  function enableDrag(rally) {
    rally.addEventListener("dragstart", () => rally.classList.add("dragging"));
    rally.addEventListener("dragend", () => {
      rally.classList.remove("dragging");
      updateRallyList();
    });
  }

  rallyContainer.addEventListener("dragover", e => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const after = [...rallyContainer.querySelectorAll(".rally:not(.dragging)")]
      .find(r => e.clientY < r.offsetTop + r.offsetHeight / 2);
    rallyContainer.insertBefore(dragging, after);
  });

  /* ---------- TARGET LIST ---------- */
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

  /* ---------- CALCULATE (ίδιο logic) ---------- */
  document.getElementById("calculate").onclick = () => {
    resultBox.textContent = "";
    const rallies = [...document.querySelectorAll(".rally")];
    const rows = [...document.querySelectorAll(".target-row")];
    const groups = {};

    rallies.forEach((rally, i) => {
      const target = rows[i].querySelector("select").value;
      if (target === "No target") return;

      const box = rally.querySelector(`.t-box[data-name="${target}"]`);
      const total = Number(box.querySelector(".min").value) * 60 +
                    Number(box.querySelector(".sec").value);

      if (!groups[target]) groups[target] = [];
      groups[target].push({
        name: rally.querySelector("input").value,
        total
      });
    });

    const now = new Date();

    Object.values(groups).forEach(group => {
      const max = Math.max(...group.map(g => g.total));
      group.forEach(g => {
        const t = new Date(now.getTime() + (max - g.total) * 1000);
        resultBox.textContent += `${g.name} → ${formatUTC(t)}\n`;
      });
    });
  };

  function formatUTC(d) {
    return [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
      .map(v => String(v).padStart(2, "0")).join(":");
  }

});
