import {
  NO_TARGET,
  getRallyName,
  getRallyTarget,
  isRallyEnabled,
  setRallyEnabled,
  setRallyTarget
} from "./helpers.js";

export function saveToStorage(app) {
  const data = [];

  document.querySelectorAll(".rally").forEach(rally => {
    const obj = {
      type: rally.dataset.type,
      name: getRallyName(rally),
      enabled: isRallyEnabled(rally),
      target: getRallyTarget(rally),
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

export function loadFromStorage(app, hooks) {
  const data = JSON.parse(localStorage.getItem("rallies") || "[]");

  data.forEach(r => {
    app.state.counters[r.type]++;
    hooks.createRallyCreator(app, r.type, app.state.counters[r.type], {
      openOnly: hooks.openOnly,
      enableDrag: hooks.enableDrag,
      onUpdateList: () => hooks.updateRallyList(app, hooks.calculateAgainstEnemy)
    });

    const rally = app.containers[r.type].querySelector(".rally");

    rally.querySelector(".rally-header input").value = r.name;
    setRallyEnabled(rally, r.enabled !== false);
    setRallyTarget(rally, r.target || NO_TARGET);

    Object.entries(r.boxes || {}).forEach(([key, val]) => {
      const box = rally.querySelector(`.t-box[data-name="${key}"]`);
      if (!box) return;
      box.querySelector(".min").value = val.min;
      box.querySelector(".sec").value = val.sec;
    });
  });

  hooks.updateRallyList(app, hooks.calculateAgainstEnemy);
}
