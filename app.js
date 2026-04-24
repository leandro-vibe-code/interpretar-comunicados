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
    mochila: ["Calculadora", "Livro de Matemática"],
    paginasEstudo: ["Livro base: páginas 42 a 57", "Exercícios: páginas 58 e 59"]
  },
  {
    id: "his-2005",
    turma: "3º Ano",
    data: "2026-05-20",
    disciplina: "História",
    tipo: "Entrega de trabalho",
    professor: "Profa. Clara",
    mochila: ["Cartolina azul", "Trabalho impresso"],
    paginasEstudo: ["Capítulo de referência: páginas 110 a 118"]
  },
  {
    id: "cien-1305",
    turma: "Fundamental II",
    data: "2026-05-13",
    disciplina: "Ciências",
    tipo: "Aula de laboratório",
    professor: "Prof. André",
    mochila: ["Jaleco", "Óculos de proteção"],
    paginasEstudo: ["Revisão teórica: páginas 72 a 76"]
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
const eventoModal = document.getElementById("evento-modal");
const modalTitulo = document.getElementById("modal-titulo");
const modalMeta = document.getElementById("modal-meta");
const modalPaginas = document.getElementById("modal-paginas");
const modalFechar = document.getElementById("modal-fechar");

function abrirModalEvento(evento) {
  modalTitulo.textContent = `${evento.disciplina} — ${evento.tipo}`;
  modalMeta.textContent = `${new Date(evento.data).toLocaleDateString("pt-BR")} · ${evento.turma} · ${evento.professor}`;
  modalPaginas.innerHTML = "";

  (evento.paginasEstudo ?? ["Sem páginas cadastradas."]).forEach((pagina) => {
    const li = document.createElement("li");
    li.textContent = pagina;
    modalPaginas.append(li);
  });

  eventoModal.showModal();
}

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
      const botaoEvento = document.createElement("button");
      botaoEvento.className = "evento";
      botaoEvento.type = "button";
      botaoEvento.innerHTML = `
        <strong>${evento.disciplina} — ${evento.tipo}</strong>
        <small>${new Date(evento.data).toLocaleDateString("pt-BR")} · ${evento.turma} · ${evento.professor}</small>
      `;
      botaoEvento.addEventListener("click", () => abrirModalEvento(evento));
      li.append(botaoEvento);
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

modalFechar.addEventListener("click", () => eventoModal.close());
eventoModal.addEventListener("click", (event) => {
  if (event.target === eventoModal) {
    eventoModal.close();
  }
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
