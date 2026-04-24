const STORAGE_TURMAS = "pwa_turmas";
const STORAGE_MOCHILA = "pwa_mochila";

const TURMAS = ["1º Ano A", "2º Ano B", "3º Ano", "Fundamental II"];

const EVENTOS = [
  {
    id: "mat-1505",
    turma: "3º Ano",
    data: "2026-05-15",
    disciplina: "Matemática",
    tipo: "Prova",
    professor: "Prof. Ricardo",
    mochila: ["Calculadora", "Livro de Matemática"]
  },
  {
    id: "his-2005",
    turma: "3º Ano",
    data: "2026-05-20",
    disciplina: "História",
    tipo: "Entrega de trabalho",
    professor: "Profa. Clara",
    mochila: ["Cartolina azul", "Trabalho impresso"]
  },
  {
    id: "cien-1305",
    turma: "Fundamental II",
    data: "2026-05-13",
    disciplina: "Ciências",
    tipo: "Aula de laboratório",
    professor: "Prof. André",
    mochila: ["Jaleco", "Óculos de proteção"]
  }
];

const NOTIFICACOES = [
  "🔔 Amanhã há prova de Matemática.",
  "🎒 Não esquecer jaleco para Ciências.",
  "🔔 Novo comunicado da coordenação disponível."
];

const turmasForm = document.getElementById("turmas-form");
const eventosLista = document.getElementById("eventos-lista");
const mochilaLista = document.getElementById("mochila-lista");
const notificacoesLista = document.getElementById("notificacoes-lista");
const resumoMochila = document.getElementById("resumo-mochila");
const botaoLimparChecklist = document.getElementById("limpar-checklist");

function loadStorage(key, fallback) {
  const value = localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let turmasSelecionadas = loadStorage(STORAGE_TURMAS, ["3º Ano", "Fundamental II"]);
let checklistStatus = loadStorage(STORAGE_MOCHILA, {});

function renderTurmas() {
  turmasForm.innerHTML = "";

  TURMAS.forEach((turma) => {
    const id = `turma-${turma.replace(/\s+/g, "-")}`;
    const label = document.createElement("label");
    label.className = "chip";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.checked = turmasSelecionadas.includes(turma);
    input.addEventListener("change", () => {
      if (input.checked) {
        turmasSelecionadas = [...new Set([...turmasSelecionadas, turma])];
      } else {
        turmasSelecionadas = turmasSelecionadas.filter((item) => item !== turma);
      }
      saveStorage(STORAGE_TURMAS, turmasSelecionadas);
      renderEventos();
      renderMochila();
    });

    const texto = document.createElement("span");
    texto.textContent = turma;

    label.append(input, texto);
    turmasForm.append(label);
  });
}

function renderEventos() {
  const filtrados = EVENTOS.filter((evento) => turmasSelecionadas.includes(evento.turma));
  eventosLista.innerHTML = "";

  if (!filtrados.length) {
    eventosLista.innerHTML = "<li>Nenhum evento para as turmas selecionadas.</li>";
    return;
  }

  filtrados
    .sort((a, b) => a.data.localeCompare(b.data))
    .forEach((evento) => {
      const li = document.createElement("li");
      li.className = "evento";
      li.innerHTML = `
        <strong>${evento.disciplina} — ${evento.tipo}</strong>
        <small>${new Date(evento.data).toLocaleDateString("pt-BR")} · ${evento.turma} · ${evento.professor}</small>
      `;
      eventosLista.append(li);
    });
}

function itensMochilaAmanha() {
  return EVENTOS.filter((evento) => turmasSelecionadas.includes(evento.turma))
    .flatMap((evento) => evento.mochila)
    .filter((item, index, list) => list.indexOf(item) === index);
}

function renderMochila() {
  const itens = itensMochilaAmanha();
  mochilaLista.innerHTML = "";

  if (!itens.length) {
    resumoMochila.textContent = "Nenhum item obrigatório para as turmas selecionadas.";
    return;
  }

  const concluidos = itens.filter((item) => checklistStatus[item]).length;
  resumoMochila.textContent = `${concluidos}/${itens.length} itens preparados.`;

  itens.forEach((item) => {
    const li = document.createElement("li");
    li.className = `item-check ${checklistStatus[item] ? "ok" : ""}`;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(checklistStatus[item]);
    input.addEventListener("change", () => {
      checklistStatus[item] = input.checked;
      saveStorage(STORAGE_MOCHILA, checklistStatus);
      renderMochila();
    });

    const texto = document.createElement("span");
    texto.textContent = item;

    li.append(input, texto);
    mochilaLista.append(li);
  });
}

function renderNotificacoes() {
  notificacoesLista.innerHTML = "";
  NOTIFICACOES.forEach((notificacao) => {
    const li = document.createElement("li");
    li.textContent = notificacao;
    notificacoesLista.append(li);
  });
}

botaoLimparChecklist.addEventListener("click", () => {
  checklistStatus = {};
  saveStorage(STORAGE_MOCHILA, checklistStatus);
  renderMochila();
});

function registrarServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }
}

renderTurmas();
renderEventos();
renderMochila();
renderNotificacoes();
registrarServiceWorker();
