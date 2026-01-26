export const TARGETS = ["Turret1", "Turret2", "Turret3", "Turret4", "Castle"];
export const NO_TARGET = "No target";

export function formatUTC(d) {
  return [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
    .map(v => String(v).padStart(2, "0"))
    .join(":");
}

export function getRallyName(rally) {
  return rally.querySelector(".rally-header input").value;
}

export function getRallyTarget(rally) {
  return rally.dataset.target || NO_TARGET;
}

export function setRallyTarget(rally, target) {
  rally.dataset.target = target;
}

export function isRallyEnabled(rally) {
  return rally.dataset.enabled !== "false";
}

export function setRallyEnabled(rally, enabled) {
  rally.dataset.enabled = enabled ? "true" : "false";
}

export function getRallyBuffer(rally) {
  const input = rally.querySelector(".buffer");
  const value = Number(input?.value ?? 0);
  return Number.isFinite(value) ? value : 0;
}

export function setRallyBuffer(rally, value) {
  const input = rally.querySelector(".buffer");
  if (!input) return;
  input.value = Number.isFinite(Number(value)) ? value : 0;
}
