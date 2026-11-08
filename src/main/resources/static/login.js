const loginForm = document.querySelector("#loginForm");
const loginSubmit = document.querySelector("#loginSubmit");
const csrfInput = document.querySelector("#csrfToken");
const setupError = document.querySelector("#loginSetupError");
const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("#passwordToggle");

const query = new URLSearchParams(window.location.search);
if (query.has("error")) document.querySelector("#loginError").hidden = false;
if (query.has("logout")) document.querySelector("#loginNotice").hidden = false;

passwordToggle.addEventListener("click", () => {
  const willShow = passwordInput.type === "password";
  passwordInput.type = willShow ? "text" : "password";
  passwordToggle.textContent = willShow ? "Ocultar" : "Mostrar";
  passwordToggle.setAttribute("aria-label", willShow ? "Ocultar senha" : "Mostrar senha");
  passwordToggle.setAttribute("aria-pressed", String(willShow));
});

async function prepareLogin() {
  try {
    const response = await fetch("/api/csrf", {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Falha ao obter o token CSRF.");
    const csrf = await response.json();
    csrfInput.name = csrf.parameterName || "_csrf";
    csrfInput.value = csrf.token;
    loginSubmit.disabled = false;
    loginSubmit.innerHTML = 'Entrar no AutoStock <span aria-hidden="true">→</span>';
  } catch {
    setupError.hidden = false;
    loginSubmit.disabled = true;
  }
}

loginForm.addEventListener("submit", (event) => {
  if (!csrfInput.value) {
    event.preventDefault();
    setupError.hidden = false;
  }
});

prepareLogin();
