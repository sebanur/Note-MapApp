import { ui, personIcon } from "./ui.js";
import { formatDate, getStatus, getNoteIcon } from "./helpers.js";

const DB_NOTES = "notes2"

const STATE = {
    map: null,
    layer: null,
    clickedCoords: null,
    notes: JSON.parse(localStorage.getItem(DB_NOTES) || "[]")
}

//konuma gore harika
window.navigator.geolocation.getCurrentPosition(
    (e) => loadMap([e.coords.latitude, e.coords.longitude]),
    ()=>loadMap([41.0158089,28.6395352])
)

function loadMap(position){

    //harita kurulumu
    STATE.map =  L.map("map", { zoomControl: false }).setView(position, 11);

    //katman ekle
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
     }).addTo(STATE.map);

     //harita uzerinden katman yap
      STATE.layer = L.layerGroup().addTo(STATE.map);

      //ekrana marker 
    const marker = L.marker(position, { icon: personIcon }).addTo(STATE.map) 

    //market a popup ekle
     marker.bindPopup("<b> Buradayiz </b>")

     //tiklamayi yapala
     STATE.map.on("click",onMapClick)

     renderNoteCards(STATE.notes)
     renderMarker(STATE.notes)
}

function renderMarker(notes) {
    STATE.layer.clearLayers()

    notes.forEach((note)=>{
        const icon = getNoteIcon(note.status)
        const marker = L.marker(note.coords, { icon }).addTo(STATE.layer);

         marker.bindPopup(`<p class="popup">${note.title}<p>`)
    })
}


function onMapClick(e) {
    
    STATE.clickedCoords = [e.latlng.lat, e.latlng.lng]

    ui.aside.classList.add("add")

    ui.asideTitle.textContent = "Yeni not"

}

ui.form.addEventListener("submit",(e)=>{
    e.preventDefault()

    const title = e.target[0].value
    const date = e.target[1].value
    const status = e.target[2].value

    if (!title || !date || !status) {
        return alert('alanlar bos olamaz')
    }

    const newNote = {
        id: new Date().getTime(),
        title,
        date,
        status,
        coords: STATE.clickedCoords
    }

    STATE.notes.push(newNote)

    localStorage.setItem(DB_NOTES, JSON.stringify(STATE.notes))

    ui.aside.classList.remove("add")
    ui.asideTitle.textContent = "Notlar"

    ui.form.reset()

    renderNoteCards(STATE.notes)
    renderMarker(STATE.notes)
})

function renderNoteCards(notes) {

    const notesHTML = notes
        .map(
            (note)=> `
        <li>
          <div>
            <h3>${note.title}</h3>
            <p>${formatDate(note.date)}</p>
            <p class="status">${getStatus(note.status)}</p>
          </div>
          <div class="icons">
            <i data-id="${note.id}" id="fly-btn" class="bi bi-airplane-fill"></i>
            <i data-id="${note.id}" id="trash-btn" class="bi bi-trash"></i>
          </div>
        </li> `
    )
    .join(" ")



    ui.noteList.innerHTML = notesHTML


    document.querySelectorAll("#trash-btn").forEach((btn)=>{
        const id = +btn.dataset.id
        btn.addEventListener("click",()=>deleteNote(id))
    })

    document.querySelectorAll("#fly-btn").forEach((btn)=>{
        const id = +btn.dataset.id
        btn.addEventListener("click",()=>flyToNote(id))
    })

}

const flyToNote = (id) => {
    const note = STATE.notes.find((note) => note.id === id)
    STATE.map.flyTo(note.coords, 15)
}

const deleteNote = (id) => {
    if (!confirm("emin misin?")) {
        return
    }

    STATE.notes = STATE.notes.filter((note)=> note.id != id)
    
    localStorage.setItem(DB_NOTES, JSON.stringify(STATE.notes))

    renderNoteCards(STATE.notes)
    renderMarker(STATE.notes)
}

ui.cancelButton.addEventListener("click",()=>{
    ui.aside.classList.remove("add")
    ui.asideTitle.textContent = "Notlar"
})

ui.arrow.addEventListener("click",()=>{
    ui.aside.classList.toggle("hide")
})