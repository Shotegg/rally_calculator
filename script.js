import {
  createRallyCreator,
  enableDrag,
  openFirst,
  openOnly,
  updateRallyList
} from "./ui.js";
import { calculateAgainstEnemy, calculateAll } from "./calc.js";
import { loadFromStorage, saveToStorage } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    activeType: "ally",
    counters: { ally: 0, enemy: 0 }
  };

  const containers = {
    ally: document.getElementById("allyContainer"),
    enemy: document.getElementById("enemyContainer")
  };

  const app = {
    state,
    containers,
    rallyList: document.getElementById("rallyList"),
    resultBox: document.getElementById("resultBox")
  };

  initTabs(app);
  initAddButton(app);
  initSearch(app);
  initCalculate(app);
  initCopyButton(app);

  loadFromStorage(app, {
    createRallyCreator,
    updateRallyList,
    calculateAgainstEnemy,
    openOnly,
    enableDrag
  });

  document.addEventListener("input", () => saveToStorage(app));
  document.addEventListener("click", () => saveToStorage(app));
});

function initTabs(app) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {
      app.state.activeType = tab.dataset.type;

      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      app.containers.ally.classList.toggle(
        "hidden",
        app.state.activeType !== "ally"
      );
      app.containers.enemy.classList.toggle(
        "hidden",
        app.state.activeType !== "enemy"
      );

      updateRallyList(app, calculateAgainstEnemy);
    };
  });
}

function initAddButton(app) {
  document.getElementById("addRally").onclick = () => {
    app.state.counters[app.state.activeType]++;
    createRallyCreator(
      app,
      app.state.activeType,
      app.state.counters[app.state.activeType],
      {
        openOnly,
        enableDrag,
        onUpdateList: () => updateRallyList(app, calculateAgainstEnemy)
      }
    );
    openFirst(app, app.state.activeType);
    updateRallyList(app, calculateAgainstEnemy);
  };
}

function initSearch(app) {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    const val = searchInput.value.toLowerCase();
    if (!val) return;

    const rally = [...app.containers[app.state.activeType].querySelectorAll(".rally")]
      .find(r => r.querySelector(".rally-header input").value.toLowerCase().includes(val));

    if (rally) {
      app.containers[app.state.activeType].prepend(rally);
      openOnly(app, rally, app.state.activeType);
      updateRallyList(app, calculateAgainstEnemy);
    }
  });
}

function initCalculate(app) {
  document.getElementById("calculate").onclick = () => {
    calculateAll(app);
  };
}

function initCopyButton(app) {
  const btn = document.getElementById("copyResult");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const text = app.resultBox.textContent.trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      btn.textContent = "Copied";
    }

    setTimeout(() => {
      btn.textContent = "Copy";
    }, 1200);
  });
}
