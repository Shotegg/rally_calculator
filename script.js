document.addEventListener("DOMContentLoaded", () => {

  let activeType = "ally";
  let counters = { ally: 0, enemy: 0 };

  const containers = {
    ally: document.getElementById("allyContainer"),
    enemy: document.getElementById("enemyContainer")
  };

  const rallyList = document.getElementById("rallyList");
  const resultBox = document.getElementById("resultBox");
  const search = document.getElementById("search");

  /* ---------- TABS ---------- */
  document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {
      activeType = tab.dataset.type;

      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      containers.ally.classList.toggle("hidden", activeType !== "ally");
      containers.enemy.classList.toggle("hidden", activeType !== "enemy");

      updateRallyList();
    };
  });

  /* ---------- ADD ---------- */
  document.getElementById("addRally").onclick = () => {
    counters[activeType]++;
    createRallyCreator(activeType, counters[activeType]);
    openFirst(activeType);
    updateRallyList();
  };

  function createRallyCreator(type, number) {
    const rally = document.createElement("div");
    rally.className = "rally";
    rally.draggable = true;
    rally.dataset.type = type;

    rally.innerHTML = `
      <div class="rally-header">
        <span class="drag-handle">≡</span>
        <input type="text" value="${type === "ally" ? "Ally" : "Enemy"} Rally ${number}">
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

    containers[type].prepend(rally);

    rally.querySelector(".delete").onclick = () => {
      rally.remove();
      updateRallyList();
    };

    rally.querySelector(".rally-header").onclick = e => {
      if (e.target.tagName === "BUTTON") return;
      openOnly(rally, type);
    };

    rally.querySelector("input").addEventListener("input", updateRallyList);

    enableDrag(rally, containers[type]);
  }

  function createTBox(name) {
    return `
      <div class="t-box" data-name="${name}">
        <strong>${name}</strong>
        <input type="number" class="min" min="0" value="0">
        <input type="number" class="sec" min="0" value="0">
      </div>
    `;
  }

  function openOnly(target, type) {
    containers[type].querySelectorAll(".rally").forEach(r => r.classList.remove("open"));
    target.classList.add("open");
  }

  function openFirst(type) {
    const first = containers[type].querySelector(".rally");
    if (first) openOnly(first, type);
  }

  /* ---------- DRAG ---------- */
  function enableDrag(rally, container) {
    rally.addEventListener("dragstart", () => rally.classList.add("dragging"));
    rally.addEventListener("dragend", () => {
      rally.classList.remove("dragging");
      updateRallyList();
    });

    container.addEventListener("dragover", e => {
      e.preventDefault();
      const dragging = container.querySelector(".dragging");
      if (!dragging) return;

      const after = [...container.querySelectorAll(".rally:not(.dragging)")]
        .find(r => e.clientY < r.offsetTop + r.offsetHeight / 2);

      container.insertBefore(dragging, after);
    });
  }

  /* ---------- SEARCH (active tab only) ---------- */
  search.addEventListener("input", () => {
    const val = search.value.toLowerCase();
    if (!val) return;

    const rally = [...containers[activeType].querySelectorAll(".rally")]
      .find(r => r.querySelector("input").value.toLowerCase().includes(val));

    if (rally) {
      containers[activeType].prepend(rally);
      openOnly(rally, activeType);
      updateRallyList();
    }
  });

  /* ---------- TARGET LIST ---------- */
  function updateRallyList() {
    rallyList.innerHTML = "";

    ["ally", "enemy"].forEach(type => {
      containers[type].querySelectorAll(".rally").forEach(rally => {
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
    });
  }

  /* ---------- CALCULATE ---------- */
  document.getElementById("calculate").onclick = () => {
    resultBox.textContent = "";
    const rallies = [...document.querySelectorAll(".rally")];
    const rows = [...document.querySelectorAll(".target-row")];
    const groups = {};

    rallies.forEach((rally, i) => {
      const target = rows[i].querySelector("select").value;
      if (target === "No target") return;

      const box = rally.querySelector(`.t-box[data-name="${target}"]`);
      const total =
        Number(box.querySelector(".min").value) * 60 +
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
      .map(v => String(v).padStart(2, "0"))
      .join(":");
  }

});
