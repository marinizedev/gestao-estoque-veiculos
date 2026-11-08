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
  confirming: null,
};

const formDialog = $("#formDialog");
const confirmDialog = $("#confirmDialog");

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const integer = new Intl.NumberFormat("pt-BR");


/* ==========================================================================
   UTILITÁRIOS
   ========================================================================== */

/* --- Comunicação com a API --- */
async function buscarTokenCsrf() {
  const response = await fetch("/api/csrf", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Não foi possível obter a proteção CSRF. Talvez seja necessário entrar novamente.");
  }

  return response.json();
}

async function api(url, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

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
      data?.mensagem ||
      data?.message ||
      (data?.erros ? Object.values(data.erros).join(" ") : null) ||
      `Erro ${response.status} ao comunicar com a API.`;

    throw new Error(message);
  }

  return data;
}

/* --- Escape de HTML --- */
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
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
   ESTATÍSTICAS E ANALYTICS
   ========================================================================== */
function updateStats() {
  const rows = state.veiculos;
  const available = rows.filter((v) => v.status === "DISPONIVEL");
  const sold = rows.filter((v) => v.status === "VENDIDO");

  // Cards principais
  $("#statTotal").textContent = integer.format(rows.length);
  $("#statAvailable").textContent = integer.format(available.length);
  $("#statSold").textContent = integer.format(sold.length);

  const availableSum = available.reduce((sum, v) => sum + Number(v.preco || 0), 0);
  $("#statValue").textContent = money.format(availableSum);

  $("#totalTrack").style.width = rows.length
    ? `${Math.max(15, Math.min(100, (available.length / rows.length) * 100))}%`
    : "0%";

  // Insights
  $("#avgAvailablePrice").textContent = money.format(
    available.length ? availableSum / available.length : 0
  );

  const avgMileage = rows.length
    ? rows.reduce((sum, v) => sum + Number(v.quilometragem || 0), 0) / rows.length
    : 0;
  $("#avgMileage").textContent = `${integer.format(Math.round(avgMileage))} km`;

  const brandCount = new Set(
    rows.map((v) => String(v.marca || "").trim()).filter(Boolean)
  ).size;
  $("#brandCount").textContent = integer.format(brandCount);

  renderAnalytics(rows);
}

function renderAnalytics(rows) {
  const total = rows.length;

  // --- Distribuição por situação ---
  const counts = { DISPONIVEL: 0, VENDIDO: 0, DESCONTINUADO: 0 };
  rows.forEach((v) => {
    if (Object.hasOwn(counts, v.status)) counts[v.status]++;
  });

  const pct = (status) => (total ? (counts[status] / total) * 100 : 0);

  $("#statusAnalytics").innerHTML = `
    <div class="status-track" aria-label="Distribuição do estoque por situação">
      <span class="status-segment segment-available" style="width:${pct("DISPONIVEL")}%"></span>
      <span class="status-segment segment-sold" style="width:${pct("VENDIDO")}%"></span>
      <span class="status-segment segment-discontinued" style="width:${pct("DESCONTINUADO")}%"></span>
    </div>
    <div class="status-legend">
      <div class="legend-item">
        <i class="legend-dot legend-available"></i>
        <span>Disponíveis<strong>${counts.DISPONIVEL} · ${pct("DISPONIVEL").toFixed(0)}%</strong></span>
      </div>
      <div class="legend-item">
        <i class="legend-dot legend-sold"></i>
        <span>Vendidos<strong>${counts.VENDIDO} · ${pct("VENDIDO").toFixed(0)}%</strong></span>
      </div>
      <div class="legend-item">
        <i class="legend-dot legend-discontinued"></i>
        <span>Descontinuados<strong>${counts.DESCONTINUADO} · ${pct("DESCONTINUADO").toFixed(0)}%</strong></span>
      </div>
    </div>`;

  // --- Top 5 marcas ---
  const byBrand = new Map();
  rows.forEach((v) => {
    const name = String(v.marca || "Sem marca");
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
    .map((v) => `
      <tr>
        <td>
          <div class="vehicle-cell">
            <span class="vehicle-thumb">${vehicleIcon()}</span>
            <span>
              <span class="vehicle-name">${esc(v.modelo || "Modelo")}</span>
              <span class="vehicle-brand">${esc(v.marca || "Marca não informada")} · ${esc(v.cor || "")}</span>
            </span>
          </div>
        </td>
        <td class="year-cell">${esc(v.anoFabricacao ?? "—")}</td>
        <td class="muted-cell">${integer.format(Number(v.quilometragem || 0))} km</td>
        <td class="price-cell">${money.format(Number(v.preco || 0))}</td>
        <td><span class="status-badge ${statusClass(v.status)}">${esc(statusLabel(v.status))}</span></td>
        <td>
          <div class="row-actions">
            <button class="icon-button" data-action="edit" data-id="${v.id}" title="Editar veículo" aria-label="Editar veículo">✎</button>
            <button class="icon-button delete" data-action="delete" data-id="${v.id}" title="Excluir veículo" aria-label="Excluir veículo">⌫</button>
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
      <td colspan="6" class="loading-cell"><span class="spinner"></span>Sincronizando inventário...</td>
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
    $("#vehicleRows").innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">
          <div class="empty-state">
            <strong>Não foi possível carregar os dados</strong>
            <span>${esc(error.message)} Confirme se a aplicação Spring Boot está rodando.</span>
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
      rows = rows.filter((v) =>
        [v.marca, v.modelo, v.cor].some((value) =>
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
    .map((m) => `<option value="${m.id}" ${record?.modeloId === m.id ? "selected" : ""}>${esc(m.marcaNome)} · ${esc(m.nome)}</option>`)
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
    .map((m) => `<option value="${m.id}">${esc(m.nome)}</option>`)
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

  $("#saveDialog").innerHTML = `${record ? "Salvar alterações" : "Salvar cadastro"} <span>→</span>`;

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
  let url, method, payload;

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
  button.textContent = "Salvando...";

  try {
    await api(url, { method, body: JSON.stringify(payload) });
    formDialog.close();
    toast(state.editingId ? "Veículo atualizado." : "Cadastro realizado.");
    await loadAll();
  } catch (error) {
    toast(error.message, "error");
  } finally {
    button.disabled = false;
    button.innerHTML = `${state.editingId ? "Salvar alterações" : "Salvar cadastro"} <span>→</span>`;
  }
}


/* ==========================================================================
   EXPORTAÇÃO CSV
   ========================================================================== */
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

  const values = rows.map((v) => [
    v.id,
    v.marca,
    v.modelo,
    v.anoFabricacao,
    v.cor,
    Number(v.preco || 0).toFixed(2),
    v.quilometragem,
    statusLabel(v.status),
  ]);

  const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csv =
    "\uFEFF" +
    [columns, ...values].map((row) => row.map(csvCell).join(";")).join("\r\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));

  const a = document.createElement("a");
  a.href = url;
  a.download = `autostock-veiculos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
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

  const record = state.veiculos.find((v) => String(v.id) === button.dataset.id);
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

$("#logoutButton").addEventListener("click", async () => {
  const button = $("#logoutButton");
  button.disabled = true;

  try {
    await api("/logout", { method: "POST" });
    window.location.assign("/login?logout");
  } catch (error) {
    toast(error.message, "error");
    button.disabled = false;
  }
});

/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */
loadAll();