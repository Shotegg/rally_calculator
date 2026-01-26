import { NO_TARGET, formatUTC, getRallyName, isRallyEnabled } from "./helpers.js";

export function calculateAgainstEnemy(app, enemyRally, row) {
  if (!isRallyEnabled(enemyRally)) return;

  const target = row.querySelector("select").value;
  if (target === NO_TARGET) return;

  const enemyBox = enemyRally.querySelector(`.t-box[data-name="${target}"]`);
  const enemyTime =
    Number(enemyBox.querySelector(".min").value) * 60 +
    Number(enemyBox.querySelector(".sec").value);

  app.resultBox.textContent = "";
  const now = new Date();

  app.containers.ally.querySelectorAll(".rally").forEach(ally => {
    if (!isRallyEnabled(ally)) return;

    const allyBox = ally.querySelector(`.t-box[data-name="${target}"]`);
    const allyTime =
      Number(allyBox.querySelector(".min").value) * 60 +
      Number(allyBox.querySelector(".sec").value);

    if (allyTime > enemyTime) return;

    const t = new Date(now.getTime() + (enemyTime - allyTime) * 1000);
    app.resultBox.textContent += `${getRallyName(ally)} -> ${formatUTC(t)}\n`;
  });
}

export function calculateAll(app) {
  app.resultBox.textContent = "";
  const rallies = [...document.querySelectorAll(".rally")];
  const rows = [...document.querySelectorAll(".target-row")];
  const groups = {};

  rallies.forEach((rally, i) => {
    const target = rows[i]?.querySelector("select")?.value ?? NO_TARGET;
    if (target === NO_TARGET) return;
    if (!isRallyEnabled(rally)) return;

    const box = rally.querySelector(`.t-box[data-name="${target}"]`);
    const total =
      Number(box.querySelector(".min").value) * 60 +
      Number(box.querySelector(".sec").value);

    if (!groups[target]) groups[target] = [];
    groups[target].push({
      name: getRallyName(rally),
      total
    });
  });

  const now = new Date();

  Object.values(groups).forEach(group => {
    const max = Math.max(...group.map(g => g.total));
    group.forEach(g => {
      const t = new Date(now.getTime() + (max - g.total) * 1000);
      app.resultBox.textContent += `${g.name} -> ${formatUTC(t)}\n`;
    });
  });
}
