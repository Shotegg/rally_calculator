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
    rally.draggable = !("ontouchstart" in window);
    rally.dataset.type = type;

    rally.innerHTML = `
      <div class="rally-header">
        <div class="header-left">
          <span class="drag-handle">≡</span>
          <input type="text" value="${type === "ally" ? "Ally" : "Enemy"} Rally ${number}">
        </div>
        <div class="header-right">
          <button class="delete">✖</button>
        </div>
      </div>
    
      <div class="rally-content">
        <div class="t-grid">
          ${createTBox("Turret1")}
          ${createTBox("Turret2")}
          ${createTBox("Turret3")}
          ${createTBox("Turret4")}
          ${createTBox("Castle")}
        </div>
      </div>
    `;

    containers[type].prepend(rally);

    rally.querySelector(".delete").onclick = () => {
      rally.remove();
      updateRallyList();
    };

    const headerLeft = rally.querySelector(".header-left");
    const headerRight = rally.querySelector(".header-right");
    const nameInput = rally.querySelector(".rally-header input");
    
    /* ⬅️ ΑΡΙΣΤΕΡΑ: άνοιγμα + edit όνομα */
    headerLeft.onclick = () => {
      e.stopPropagation();
      openOnly(rally, type);
      nameInput.focus();
      nameInput.select();
    };
    
    /* ➡️ ΔΕΞΙΑ: άνοιγμα ΜΟΝΟ */
    headerRight.onclick = () => {
      e.stopPropagation();
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

  /* ---------- SEARCH ---------- */
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

    addSection("Allies");
    containers.ally.querySelectorAll(".rally").forEach(addRow);

    addSection("Enemies");
    containers.enemy.querySelectorAll(".rally").forEach(addRow);
  }

  function addSection(title) {
    const header = document.createElement("div");
    header.className = "list-section";
    header.textContent = title;
    rallyList.appendChild(header);
  }

  function addRow(rally) {
    const type = rally.dataset.type;
    const name = rally.querySelector("input").value;

    const row = document.createElement("div");
    row.className = "target-row";
    row.innerHTML = `
      <span>${name}</span>
      <select>
        <option>No target</option>
        <option>Turret1</option>
        <option>Turret2</option>
        <option>Turret3</option>
        <option>Turret4</option>
        <option>Castle</option>
      </select>
    `;

    if (type === "enemy") {
      const btn = document.createElement("button");
      btn.textContent = "▶ Ally timings";
      btn.onclick = () => calculateAgainstEnemy(rally, row);
      row.appendChild(btn);
    }

    rallyList.appendChild(row);
  }

  /* ---------- ENEMY VS ALLY CALC ---------- */
  function calculateAgainstEnemy(enemyRally, row) {
    const target = row.querySelector("select").value;
    if (target === "No target") return;

    const enemyBox = enemyRally.querySelector(`.t-box[data-name="${target}"]`);
    const enemyTime =
      Number(enemyBox.querySelector(".min").value) * 60 +
      Number(enemyBox.querySelector(".sec").value);

    resultBox.textContent = "";
    const now = new Date();

    containers.ally.querySelectorAll(".rally").forEach(ally => {
      const allyBox = ally.querySelector(`.t-box[data-name="${target}"]`);
      const allyTime =
        Number(allyBox.querySelector(".min").value) * 60 +
        Number(allyBox.querySelector(".sec").value);

      if (allyTime > enemyTime) return;

      const t = new Date(now.getTime() + (enemyTime - allyTime) * 1000);
      resultBox.textContent +=
        `${ally.querySelector("input").value} → ${formatUTC(t)}\n`;
    });
  }

  /* ---------- GLOBAL CALCULATE ---------- */
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

  function saveToStorage() {
    const data = [];
  
    document.querySelectorAll(".rally").forEach(rally => {
      const obj = {
        type: rally.dataset.type,
        name: rally.querySelector(".rally-header input").value,
        boxes: {}
      };
  
      rally.querySelectorAll(".t-box").forEach(box => {
        obj.boxes[box.dataset.name] = {
          min: box.querySelector(".min").value,
          sec: box.querySelector(".sec").value
        };
      });
  
      data.push(obj);
    });
  
    localStorage.setItem("rallies", JSON.stringify(data));
  }
  
  function loadFromStorage() {
    const data = JSON.parse(localStorage.getItem("rallies") || "[]");
  
    data.forEach(r => {
      counters[r.type]++;
      createRallyCreator(r.type, counters[r.type]);
  
      const rally = containers[r.type].querySelector(".rally");
  
      rally.querySelector(".rally-header input").value = r.name;
  
      Object.entries(r.boxes).forEach(([key, val]) => {
        const box = rally.querySelector(`.t-box[data-name="${key}"]`);
        box.querySelector(".min").value = val.min;
        box.querySelector(".sec").value = val.sec;
      });
    });
  
    updateRallyList();
  }
  
  loadFromStorage();
  
  document.addEventListener("input", saveToStorage);
  document.addEventListener("click", saveToStorage);
});

