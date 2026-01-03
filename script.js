function enableDrag(rally) {
  const handle = rally.querySelector(".drag-handle");

  let allowDrag = false;

  handle.addEventListener("mousedown", () => {
    allowDrag = true;
  });

  document.addEventListener("mouseup", () => {
    allowDrag = false;
  });

  rally.addEventListener("dragstart", (e) => {
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
