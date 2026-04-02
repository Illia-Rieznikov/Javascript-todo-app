document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("statusMessage");
  const button = document.getElementById("startButton");

  console.log("ftodo starter script loaded.");

  button.addEventListener("click", () => {
    const now = new Date();
    status.textContent = `Button clicked at ${now.toLocaleTimeString()}. Ready to continue development.`;
    status.style.color = "#1d4ed8";
  });
});
