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
