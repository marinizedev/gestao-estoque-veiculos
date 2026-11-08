/* ==========================================================================
   CONFIGURAÇÃO, ESTADO E ELEMENTOS
   ========================================================================== */
const API = {
  marcas: "/api/marcas",
  modelos: "/api/modelos",
  veiculos: "/api/veiculos",
};

const $ = (selector) => document.querySelector(selector);

const state = {
  marcas: [],
  modelos: [],
  veiculos: [],
  visibleVehicles: [],
  dialogMode: null,
  editingId: null,
};

const formDialog = $("#formDialog");
const confirmDialog = $("#confirmDialog");

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const integer = new Intl.NumberFormat("pt-BR");

/* Fotos ilustrativas usadas na vitrine */
const showcasePhotos = [
  {
    src: "/assets/vehicles/showroom-sedan.jpg",
    alt: "Foto ilustrativa de um sedã esportivo vermelho",
  },
  {
    src: "/assets/vehicles/showroom-suv.jpg",
    alt: "Foto ilustrativa de um SUV escuro em ambiente interno",
  },
  {
    src: "/assets/vehicles/showroom-coupe.jpg",
    alt: "Foto ilustrativa de um cupê esportivo em showroom",
  },
];


/* ==========================================================================
   SEGURANÇA E API
   ========================================================================== */

/* --- Token CSRF --- */
async function buscarTokenCsrf() {
  const response = await fetch("/api/csrf", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Sua sessão expirou. Entre novamente para continuar."
        : "Não foi possível obter a proteção CSRF. Atualize a página e tente novamente."
    );
  }

  return response.json();
}

/* --- Requisições --- */
async function api(url, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  // Métodos que alteram dados exigem o token CSRF
  if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    const csrf = await buscarTokenCsrf();
    headers[csrf.headerName] = csrf.token;
  }

  const response = await fetch(url, {
    ...options,
    method,
    credentials: "same-origin",
    headers,
  });

  if (response.status === 204) return null;

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      response.status === 401
        ? "Sua sessão expirou. Entre novamente para continuar."
        : data?.mensagem ||
          data?.message ||
          (data?.erros ? Object.values(data.erros).join(" ") : null) ||
          `Erro ${response.status} ao comunicar com a API.`;

    throw new Error(message);
  }

  return data;
}


/* ==========================================================================
   UTILITÁRIOS
   ========================================================================== */

/* --- Escape de HTML --- */
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

/* --- Notificações --- */
function toast(message, type = "success") {
  const node = document.createElement("div");
  node.className = `toast ${type}`;
  node.textContent = message;

  $("#toastRegion").append(node);
  setTimeout(() => node.remove(), 4200);
}

/* --- Status do veículo --- */
function statusLabel(status) {
  return ({
    DISPONIVEL: "Disponível",
    VENDIDO: "Vendido",
    DESCONTINUADO: "Descontinuado",
  })[status] || status || "—";
}

function statusClass(status) {
  return ({
    DISPONIVEL: "status-available",
    VENDIDO: "status-sold",
    DESCONTINUADO: "status-discontinued",
  })[status] || "status-discontinued";
}

/* --- Ícone do veículo --- */
function vehicleIcon() {
  return `
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="m3.5 19 2.2-6.2a2.8 2.8 0 0 1 2.6-1.8h15.4a2.8 2.8 0 0 1 2.6 1.8l2.2 6.2v6h-4v-2H7.5v2h-4z"/>
      <path d="M5.5 18.8h21l-1.6-4.4a1 1 0 0 0-.94-.68H8.05a1 1 0 0 0-.94.68z"/>
      <circle cx="8.5" cy="20.5" r="1.1"/>
      <circle cx="23.5" cy="20.5" r="1.1"/>
    </svg>`;
}


/* ==========================================================================
   VITRINE
   ========================================================================== */
function renderShowcase(rows) {
  // Os 3 veículos disponíveis mais novos (desempate pelo maior preço)
  const available = rows
    .filter((vehicle) => vehicle.status === "DISPONIVEL")
    .sort(
      (a, b) =>
        Number(b.anoFabricacao || 0) - Number(a.anoFabricacao || 0) ||
        Number(b.preco || 0) - Number(a.preco || 0)
    )
    .slice(0, 3);

  const container = $("#showroomGrid");

  if (!available.length) {
    container.innerHTML = `
      <div class="showroom-empty">
        <span class="showroom-empty-icon" aria-hidden="true">⌁</span>
        <strong>Sua vitrine começa com o próximo veículo.</strong>
        <span>Cadastre um veículo disponível para apresentá-lo aqui.</span>
        <button class="button button-primary" type="button" data-add-showcase>
          Adicionar veículo <span aria-hidden="true">→</span>
        </button>
      </div>`;
    return;
  }

  container.innerHTML = available
    .map((vehicle, index) => {
      // Foto pela posição do card: 1º = sedan, 2º = suv, 3º = coupe
      const photo = showcasePhotos[index % showcasePhotos.length];
      const year = vehicle.anoFabricacao ?? "Ano não informado";
      const mileage = `${integer.format(Number(vehicle.quilometragem || 0))} km`;

      return `
        <article class="showroom-card">
          <div class="showroom-photo-wrap">
            <img class="showroom-photo" src="${photo.src}" alt="${photo.alt}" loading="lazy">
            <span class="showroom-photo-label">FOTO ILUSTRATIVA</span>
            <span class="showroom-status"><i></i> Disponível</span>
          </div>
          <div class="showroom-card-body">
            <div class="showroom-vehicle-kicker">${esc(vehicle.marca || "Marca não informada")} <span>•</span> ${esc(year)}</div>
            <h3>${esc(vehicle.modelo || "Modelo não informado")}</h3>
            <div class="showroom-meta">
              <span><i aria-hidden="true">◷</i> ${esc(mileage)}</span>
              <span>${esc(vehicle.cor || "Cor não informada")}</span>
            </div>
            <div class="showroom-card-footer">
              <strong>${money.format(Number(vehicle.preco || 0))}</strong>
              <button type="button" class="showroom-card-button" data-showcase-search="${esc(vehicle.modelo || "")}" aria-label="Ver ${esc(vehicle.modelo || "veículo")} no inventário">
                Ver cadastro <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </article>`;
    })
    .join("");
}


/* ==========================================================================
   ESTATÍSTICAS E ANALYTICS
   ========================================================================== */
function updateStats() {
  const rows = state.veiculos;
  const available = rows.filter((vehicle) => vehicle.status === "DISPONIVEL");
  const sold = rows.filter((vehicle) => vehicle.status === "VENDIDO");

  // Cards principais
  $("#statTotal").textContent = integer.format(rows.length);
  $("#statAvailable").textContent = integer.format(available.length);
  $("#statSold").textContent = integer.format(sold.length);

  const availableSum = available.reduce((sum, vehicle) => sum + Number(vehicle.preco || 0), 0);
  $("#statValue").textContent = money.format(availableSum);

  $("#totalTrack").style.width = rows.length
    ? `${Math.max(15, Math.min(100, (available.length / rows.length) * 100))}%`
    : "0%";

  // Insights
  $("#avgAvailablePrice").textContent = money.format(
    available.length ? availableSum / available.length : 0
  );

  const avgMileage = rows.length
    ? rows.reduce((sum, vehicle) => sum + Number(vehicle.quilometragem || 0), 0) / rows.length
    : 0;
  $("#avgMileage").textContent = `${integer.format(Math.round(avgMileage))} km`;

  const brandCount = new Set(
    rows.map((vehicle) => String(vehicle.marca || "").trim()).filter(Boolean)
  ).size;
  $("#brandCount").textContent = integer.format(brandCount);

  renderAnalytics(rows);
  renderShowcase(rows);
}

function renderAnalytics(rows) {
  const total = rows.length;

  // --- Distribuição por situação ---
  const counts = { DISPONIVEL: 0, VENDIDO: 0, DESCONTINUADO: 0 };
  rows.forEach((vehicle) => {
    if (Object.hasOwn(counts, vehicle.status)) counts[vehicle.status] += 1;
  });

  const percent = (status) => (total ? (counts[status] / total) * 100 : 0);

  $("#statusAnalytics").innerHTML = `
    <div class="status-track" aria-label="Distribuição do estoque por situação">
      <span class="status-segment segment-available" style="width:${percent("DISPONIVEL")}%"></span>
      <span class="status-segment segment-sold" style="width:${percent("VENDIDO")}%"></span>
      <span class="status-segment segment-discontinued" style="width:${percent("DESCONTINUADO")}%"></span>
    </div>
    <div class="status-legend">
      <div class="legend-item">
        <i class="legend-dot legend-available"></i>
        <span>Disponíveis<strong>${counts.DISPONIVEL} · ${percent("DISPONIVEL").toFixed(0)}%</strong></span>
      </div>
      <div class="legend-item">
        <i class="legend-dot legend-sold"></i>
        <span>Vendidos<strong>${counts.VENDIDO} · ${percent("VENDIDO").toFixed(0)}%</strong></span>
      </div>
      <div class="legend-item">
        <i class="legend-dot legend-discontinued"></i>
        <span>Descontinuados<strong>${counts.DESCONTINUADO} · ${percent("DESCONTINUADO").toFixed(0)}%</strong></span>
      </div>
    </div>`;

  // --- Top 5 marcas ---
  const byBrand = new Map();
  rows.forEach((vehicle) => {
    const name = String(vehicle.marca || "Sem marca");
    byBrand.set(name, (byBrand.get(name) || 0) + 1);
  });

  const brands = [...byBrand.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"))
    .slice(0, 5);

  const max = brands.length ? brands[0][1] : 1;

  $("#brandAnalytics").innerHTML = brands.length
    ? brands
        .map(([name, count]) => `
          <div class="brand-row">
            <span class="brand-row-name" title="${esc(name)}">${esc(name)}</span>
            <span class="brand-bar"><i style="width:${(count / max) * 100}%"></i></span>
            <span class="brand-row-count">${count}</span>
          </div>`)
        .join("")
    : `<div class="brand-empty">Cadastre veículos para ver o mix por marca.</div>`;
}


/* ==========================================================================
   TABELA DE VEÍCULOS
   ========================================================================== */
function renderRows(rows) {
  state.visibleVehicles = rows;

  const body = $("#vehicleRows");
  $("#tableSummary").textContent =
    rows.length === 1 ? "1 veículo encontrado" : `${rows.length} veículos encontrados`;

  if (!rows.length) {
    body.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">
          <div class="empty-state">
            <span class="empty-symbol">⌕</span>
            <strong>Nenhum veículo encontrado</strong>
            <span>Revise os filtros ou cadastre um veículo para começar.</span>
          </div>
        </td>
      </tr>`;
    return;
  }

  body.innerHTML = rows
    .map((vehicle) => `
      <tr>
        <td>
          <div class="vehicle-cell">
            <span class="vehicle-thumb">${vehicleIcon()}</span>
            <span>
              <span class="vehicle-name">${esc(vehicle.modelo || "Modelo")}</span>
              <span class="vehicle-brand">${esc(vehicle.marca || "Marca não informada")} · ${esc(vehicle.cor || "")}</span>
            </span>
          </div>
        </td>
        <td class="year-cell">${esc(vehicle.anoFabricacao ?? "—")}</td>
        <td class="muted-cell">${integer.format(Number(vehicle.quilometragem || 0))} km</td>
        <td class="price-cell">${money.format(Number(vehicle.preco || 0))}</td>
        <td><span class="status-badge ${statusClass(vehicle.status)}">${esc(statusLabel(vehicle.status))}</span></td>
        <td>
          <div class="row-actions">
            <button class="icon-button" data-action="edit" data-id="${esc(vehicle.id)}" title="Editar veículo" aria-label="Editar veículo">✎</button>
            <button class="icon-button delete" data-action="delete" data-id="${esc(vehicle.id)}" title="Excluir veículo" aria-label="Excluir veículo">⌫</button>
          </div>
        </td>
      </tr>`)
    .join("");
}


/* ==========================================================================
   CARREGAMENTO DE DADOS
   ========================================================================== */
async function loadAll() {
  $("#vehicleRows").innerHTML = `
    <tr>
      <td colspan="6" class="loading-cell"><span class="spinner"></span>Sincronizando inventário…</td>
    </tr>`;

  try {
    const [marcas, modelos, veiculos] = await Promise.all([
      api(API.marcas),
      api(API.modelos),
      api(API.veiculos),
    ]);

    state.marcas = marcas || [];
    state.modelos = modelos || [];
    state.veiculos = veiculos || [];

    updateStats();
    await loadVehicles();
  } catch (error) {
    const safeMessage = esc(error.message);

    $("#vehicleRows").innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">
          <div class="empty-state">
            <strong>Não foi possível carregar os dados</strong>
            <span>${safeMessage} Confirme se a aplicação está rodando e se sua sessão continua ativa.</span>
          </div>
        </td>
      </tr>`;

    $("#tableSummary").textContent = "Falha na conexão";
    toast(error.message, "error");
  }
}

async function loadVehicles() {
  const params = new URLSearchParams();

  const status = $("#filterStatus").value;
  const year = $("#filterYear").value;
  const search = $("#filterSearch").value.trim().toLocaleLowerCase("pt-BR");

  if (status) params.set("status", status);
  if (year) params.set("ano", year);

  try {
    let rows = await api(`${API.veiculos}${params.size ? `?${params}` : ""}`);

    // A busca por texto é feita no cliente (marca, modelo ou cor)
    if (search) {
      rows = rows.filter((vehicle) =>
        [vehicle.marca, vehicle.modelo, vehicle.cor].some((value) =>
          String(value || "").toLocaleLowerCase("pt-BR").includes(search)
        )
      );
    }

    renderRows(rows || []);
  } catch (error) {
    toast(`Erro ao consultar veículos: ${error.message}`, "error");
  }
}


/* ==========================================================================
   FORMULÁRIO (veículo, marca e modelo)
   ========================================================================== */
function field(label, name, type = "text", value = "", extra = "") {
  return `
    <div class="field ${extra}">
      <label for="field-${name}">${label}</label>
      <input id="field-${name}" name="${name}" type="${type}" value="${esc(value)}" required>
    </div>`;
}

function renderVehicleFields(record) {
  const modelOptions = state.modelos
    .map((model) => `<option value="${esc(model.id)}" ${record?.modeloId === model.id ? "selected" : ""}>${esc(model.marcaNome)} · ${esc(model.nome)}</option>`)
    .join("");

  const isSelected = (status) => (record?.status === status ? "selected" : "");

  $("#dialogFields").innerHTML = `
    <div class="field full">
      <label for="field-modeloId">Marca e modelo</label>
      <select id="field-modeloId" name="modeloId" required>
        <option value="">Selecione</option>
        ${modelOptions}
      </select>
    </div>
    ${field("Ano de fabricação", "anoFabricacao", "number", record?.anoFabricacao ?? "")}
    ${field("Cor", "cor", "text", record?.cor ?? "")}
    ${field("Preço (R$)", "preco", "number", record?.preco ?? "")}
    ${field("Quilometragem (km)", "quilometragem", "number", record?.quilometragem ?? "0")}
    <div class="field">
      <label for="field-status">Situação</label>
      <select id="field-status" name="status" required>
        <option value="DISPONIVEL" ${isSelected("DISPONIVEL")}>Disponível</option>
        <option value="VENDIDO" ${isSelected("VENDIDO")}>Vendido</option>
        <option value="DESCONTINUADO" ${isSelected("DESCONTINUADO")}>Descontinuado</option>
      </select>
    </div>
    ${state.modelos.length ? "" : `<div class="field-hint full">Cadastre uma marca e um modelo antes de adicionar veículos.</div>`}`;

  // Limites dos campos numéricos
  const price = $("#field-preco");
  price.min = "0";
  price.step = "0.01";

  const year = $("#field-anoFabricacao");
  year.min = "1886";
  year.max = "2100";
  year.step = "1";

  const mileage = $("#field-quilometragem");
  mileage.min = "0";
  mileage.step = "1";
}

function renderModelFields() {
  const brandOptions = state.marcas
    .map((brand) => `<option value="${esc(brand.id)}">${esc(brand.nome)}</option>`)
    .join("");

  $("#dialogFields").innerHTML = `
    ${field("Nome do modelo", "nome", "text", "", "full")}
    <div class="field full">
      <label for="field-marcaId">Marca associada</label>
      <select id="field-marcaId" name="marcaId" required>
        <option value="">Selecione uma marca</option>
        ${brandOptions}
      </select>
    </div>
    ${state.marcas.length ? "" : `<div class="field-hint full">Cadastre uma marca antes de cadastrar um modelo.</div>`}`;
}

function openForm(mode, record = null) {
  state.dialogMode = mode;
  state.editingId = record?.id ?? null;

  $("#dialogEyebrow").textContent = record ? "ATUALIZAÇÃO DO ESTOQUE" : "NOVO CADASTRO";

  $("#dialogTitle").textContent = ({
    vehicle: record ? "Editar veículo" : "Adicionar veículo",
    brand: "Cadastrar marca",
    model: "Cadastrar modelo",
  })[mode];

  $("#dialogDescription").textContent =
    mode === "vehicle"
      ? "Informe os detalhes para manter o inventário atualizado."
      : "Adicione as informações para organizar seu catálogo.";

  $("#saveDialog").innerHTML = `${record ? "Salvar alterações" : "Salvar cadastro"} <span aria-hidden="true">→</span>`;

  if (mode === "vehicle") {
    renderVehicleFields(record);
  } else if (mode === "brand") {
    $("#dialogFields").innerHTML = field("Nome da marca", "nome", "text", "", "full");
  } else {
    renderModelFields();
  }

  formDialog.showModal();
}

async function saveForm(event) {
  event.preventDefault();

  const form = new FormData(event.currentTarget);
  const wasEditing = Boolean(state.editingId);

  let url;
  let method;
  let payload;

  if (state.dialogMode === "brand") {
    url = API.marcas;
    method = "POST";
    payload = { nome: form.get("nome").trim() };
  } else if (state.dialogMode === "model") {
    url = API.modelos;
    method = "POST";
    payload = {
      nome: form.get("nome").trim(),
      marcaId: Number(form.get("marcaId")),
    };
  } else {
    url = state.editingId ? `${API.veiculos}/${state.editingId}` : API.veiculos;
    method = state.editingId ? "PUT" : "POST";
    payload = {
      modeloId: Number(form.get("modeloId")),
      anoFabricacao: Number(form.get("anoFabricacao")),
      cor: form.get("cor").trim(),
      preco: Number(form.get("preco")),
      quilometragem: Number(form.get("quilometragem")),
      status: form.get("status"),
    };
  }

  const button = $("#saveDialog");
  button.disabled = true;
  button.textContent = "Salvando…";

  try {
    await api(url, { method, body: JSON.stringify(payload) });
    formDialog.close();
    toast(wasEditing ? "Veículo atualizado." : "Cadastro realizado.");
    await loadAll();
  } catch (error) {
    toast(error.message, "error");
  } finally {
    button.disabled = false;
    button.innerHTML = `${wasEditing ? "Salvar alterações" : "Salvar cadastro"} <span aria-hidden="true">→</span>`;
  }
}


/* ==========================================================================
   EXPORTAÇÃO CSV
   ========================================================================== */

/* Protege contra injeção de fórmulas (=, +, -, @) ao abrir no Excel */
function safeCsvCell(value) {
  let text = String(value ?? "");
  if (/^\s*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCsv() {
  const rows = state.visibleVehicles || [];

  if (!rows.length) {
    toast("Não há veículos na lista filtrada para exportar.", "error");
    return;
  }

  const columns = [
    "ID",
    "Marca",
    "Modelo",
    "Ano de fabricação",
    "Cor",
    "Preço",
    "Quilometragem",
    "Situação",
  ];

  const values = rows.map((vehicle) => [
    vehicle.id,
    vehicle.marca,
    vehicle.modelo,
    vehicle.anoFabricacao,
    vehicle.cor,
    Number(vehicle.preco || 0).toFixed(2),
    vehicle.quilometragem,
    statusLabel(vehicle.status),
  ]);

  const csv =
    "\uFEFF" +
    [columns, ...values].map((row) => row.map(safeCsvCell).join(";")).join("\r\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `autostock-veiculos-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);

  toast(`${rows.length} veículo(s) exportado(s) para CSV.`);
}


/* ==========================================================================
   EXCLUSÃO
   ========================================================================== */
function askDelete(record) {
  $("#confirmRecord").innerHTML = `
    <span>${esc(record.marca)} ${esc(record.modelo)}</span>
    <span class="record-year">${esc(record.anoFabricacao)} · ${esc(record.cor)}</span>`;

  confirmDialog.showModal();

  return new Promise((resolve) => {
    confirmDialog.addEventListener(
      "close",
      () => resolve(confirmDialog.returnValue === "confirm"),
      { once: true }
    );
  });
}

async function onTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const record = state.veiculos.find((vehicle) => String(vehicle.id) === button.dataset.id);
  if (!record) return;

  if (button.dataset.action === "edit") {
    openForm("vehicle", record);
    return;
  }

  if (button.dataset.action === "delete") {
    if (!(await askDelete(record))) return;

    try {
      await api(`${API.veiculos}/${record.id}`, { method: "DELETE" });
      toast("Cadastro excluído do estoque.");
      await loadAll();
    } catch (error) {
      toast(error.message, "error");
    }
  }
}


/* ==========================================================================
   SESSÃO (logout)
   ========================================================================== */
async function prepareLogout(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  button.disabled = true;

  try {
    const csrf = await buscarTokenCsrf();

    const tokenInput = $("#logoutCsrfToken");
    tokenInput.name = csrf.parameterName || "_csrf";
    tokenInput.value = csrf.token;

    form.submit();
  } catch (error) {
    button.disabled = false;
    toast(error.message, "error");
  }
}


/* ==========================================================================
   EVENTOS
   ========================================================================== */

/* --- Cadastros --- */
$("#newVehicleButton").addEventListener("click", () => openForm("vehicle"));
$("#newBrandButton").addEventListener("click", () => openForm("brand"));
$("#newModelButton").addEventListener("click", () => openForm("model"));

/* --- Diálogo de formulário --- */
$("#closeDialog").addEventListener("click", () => formDialog.close());
$("#cancelDialog").addEventListener("click", () => formDialog.close());
$("#dialogForm").addEventListener("submit", saveForm);

formDialog.addEventListener("click", (event) => {
  if (event.target === formDialog) formDialog.close();
});

confirmDialog.addEventListener("click", (event) => {
  if (event.target === confirmDialog) confirmDialog.close("cancel");
});

/* --- Tabela --- */
$("#vehicleRows").addEventListener("click", onTableClick);

/* --- Vitrine --- */
$("#showroomGrid").addEventListener("click", (event) => {
  if (event.target.closest("[data-add-showcase]")) {
    openForm("vehicle");
    return;
  }

  const cardButton = event.target.closest("[data-showcase-search]");
  if (!cardButton) return;

  $("#filterSearch").value = cardButton.dataset.showcaseSearch;
  $("#filterStatus").value = "";
  $("#filterYear").value = "";
  loadVehicles();

  $("#inventory").scrollIntoView({ behavior: "smooth", block: "start" });
});

/* --- Filtros --- */
$("#filterSearch").addEventListener("input", loadVehicles);
$("#filterStatus").addEventListener("change", loadVehicles);
$("#filterYear").addEventListener("input", loadVehicles);

$("#resetFilters").addEventListener("click", () => {
  $("#filterSearch").value = "";
  $("#filterStatus").value = "";
  $("#filterYear").value = "";
  loadVehicles();
});

/* --- Relatórios --- */
$("#refreshButton").addEventListener("click", loadAll);
$("#exportCsvButton").addEventListener("click", exportCsv);
$("#printReportButton").addEventListener("click", () => window.print());

/* --- Sessão --- */
$("#logoutForm").addEventListener("submit", prepareLogout);


/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */
loadAll();