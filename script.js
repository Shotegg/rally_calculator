function calculate(block) {
  const minutes = Number(block.querySelector(".minutes").value || 0);
  const seconds = Number(block.querySelector(".seconds").value || 0);

  const total = minutes * 60 + seconds;
  block.querySelector(".total").textContent = total;
}

// real-time calculation
document.addEventListener("input", (e) => {
  const block = e.target.closest(".t-block");
  if (block) calculate(block);
});

// clone button
document.getElementById("add").onclick = () => {
  const first = document.querySelector(".t-block");
  const clone = first.cloneNode(true);

  clone.querySelectorAll("input").forEach(i => i.value = 0);
  clone.querySelector(".total").textContent = "0";

  document.getElementById("container").appendChild(clone);
};
