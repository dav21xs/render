// Para probar localmente, deja esta URL. Tras desplegar, reemplázala por la URL de tu API en Render.
const API_URL = "http://localhost:3000";

const statusEl = document.querySelector("#status");
const itemsEl = document.querySelector("#items");
const feedbackEl = document.querySelector("#feedback");
const form = document.querySelector("#item-form");

async function checkApi() {
  statusEl.textContent = "Comprobando conexión…";
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    statusEl.textContent = data.mongodb === "conectado"
      ? "API activa · MongoDB conectado"
      : `API accesible · MongoDB: ${data.mongodb}`;
  } catch {
    statusEl.textContent = "No se pudo contactar la API. Confirma que el servidor está ejecutándose y que API_URL es correcta.";
  }
}

async function loadItems() {
  itemsEl.replaceChildren();
  const loading = document.createElement("li");
  loading.textContent = "Cargando registros…";
  itemsEl.append(loading);
  try {
    const response = await fetch(`${API_URL}/api/items`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al consultar");
    itemsEl.replaceChildren();
    if (!data.length) {
      const empty = document.createElement("li");
      empty.textContent = "Todavía no hay registros. Agrega el primero arriba.";
      itemsEl.append(empty);
      return;
    }
    data.forEach(item => {
      const li = document.createElement("li");
      li.append(document.createTextNode(item.title));
      const date = document.createElement("small");
      date.textContent = new Date(item.createdAt).toLocaleString();
      li.append(date);
      itemsEl.append(li);
    });
  } catch (error) {
    itemsEl.replaceChildren();
    const li = document.createElement("li");
    li.textContent = `${error.message}. Verifica API_URL y la conexión con MongoDB.`;
    itemsEl.append(li);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  feedbackEl.textContent = "Guardando…";
  try {
    const response = await fetch(`${API_URL}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: document.querySelector("#title").value })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "No se pudo guardar");
    form.reset();
    feedbackEl.textContent = "Registro guardado correctamente.";
    await loadItems();
  } catch (error) {
    feedbackEl.textContent = `Error: ${error.message}. Revisa que la API esté activa.`;
  } finally {
    button.disabled = false;
  }
});

document.querySelector("#refresh").addEventListener("click", checkApi);
document.querySelector("#reload").addEventListener("click", loadItems);
checkApi();
loadItems();
