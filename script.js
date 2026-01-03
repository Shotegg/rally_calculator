document.addEventListener("DOMContentLoaded", () => {

  let rallyCount = 0;

  const rallyContainer = document.getElementById("rallyContainer");
  const rallyList = document.getElementById("rallyList");
  const addBtn = document.getElementById("addRally");
  const calculateBtn = document.getElementById("calculate");

  addBtn.onclick = () => {
    rallyCount++;
    createRallyCreator(rallyCount);
    openFirst();
    updateRallyList();
  };

  function createRallyCreator(number) {
    const rally = document.createElement("div");
    rally.className = "rally";
    rally.draggable = true;

    rally.innerHTML = `
      <div class="rally-header">
        <span class="drag-handle">≡</span>
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

    rallyContainer.prepend(rally);

    enableAccordion(rally);
    enableDelete(rally);
    enableDrag(rally);

    rally.querySelector("input").addEventListener("input", updateRallyList);
  }

  function createTBox(name) {
    return `
      <div class="t-box">
        <strong>${name}</strong><br>
        <input type="number" min="0" placeholder="min">
        <input type="number" min="0" placeholder="sec">
      </div>
    `;
  }

  function enableAccordion(rally) {
    rally.querySelector(".rally-header").onclick = (e) => {
      if (e.target.classList.contains("delete")) return;
      openOnly(rally);
    };
  }

  function openOnly(target) {
    document.querySelectorAll(".rally").forEach(r => {
      r.classList.toggle("collapsed", r !== target);
    });
  }

  function openFirst() {
    const first = document.querySelector(".rally");
    if (first) openOnly(first);
  }

  function enableDelete(rally) {
    rally.querySelector(".delete").onclick = () => {
      rally.remove();
      updateRallyList();
    };
  }

  function enableDrag(rally) {
    let allowDrag = false;
    const handle = rally.querySelector(".drag-handle");

    handle.addEventListener("mousedown", () => allowDrag = true);
    document.addEventListener("mouseup", () => allowDrag = false);

    rally.addEventListener("dragstart", e => {
      if (!allowDrag) {
        e.preventDefault();
        return;
      }
      rally.classList.add("dragging");
    });

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

  function updateRallyList() {
    rallyList.innerHTML = "";
    document.querySelectorAll(".rally").forEach(rally => {
      const name = rally.querySelector("input").value;

      const li = document.createElement("li");
      li.textContent = name;

      const select = document.createElement("select");
      ["no target", "T1", "T2", "T3", "T4", "Castle"].forEach(t => {
        const o = document.createElement("option");
        o.value = t;
        o.textContent = t;
        select.appendChild(o);
      });

      li.appendChild(select);
      rallyList.appendChild(li);
    });
  }

  calculateBtn.onclick = () => {
    document.getElementById("results").innerText =
      "Calculate logic will be added next.";
  };

});
