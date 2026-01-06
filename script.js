// --- Gerenciamento de Layout ---
function changeLayout(layoutClass) {
    const resume = document.getElementById('resumePreview');
    // Remove classes antigas
    resume.classList.remove('layout-modern', 'layout-minimal', 'layout-executive', 'layout-tech', 'layout-clean');
    // Adiciona a nova
    resume.classList.add(layoutClass);

    // Atualiza botões
    const buttons = document.querySelectorAll('.btn-template');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Ativa o botão correspondente
    buttons.forEach(btn => {
        if(btn.getAttribute('onclick').includes(layoutClass)) {
            btn.classList.add('active');
        }
    });
}

// --- Gerenciamento de Tema (Cor) ---
function changeTheme(color) {
    document.documentElement.style.setProperty('--primary', color);
}

// --- Lógica de Visibilidade e Atualização ---
function toggleVisibility(value, elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (value && value.trim() !== "") {
        el.style.display = "flex";
    } else {
        el.style.display = "none";
    }
}

function bindInputToDisplay(inputId, displayId, containerId = null) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    
    if(containerId) toggleVisibility(input.value, containerId);

    input.addEventListener('input', () => {
        display.innerText = input.value;
        if(containerId) toggleVisibility(input.value, containerId);
    });
}

// Inicializa Campos Básicos
bindInputToDisplay('nameInput', 'displayName');
bindInputToDisplay('roleInput', 'displayRole');
bindInputToDisplay('summaryInput', 'displaySummary');

// Inicializa Campos de Contato (com ícone inteligente)
bindInputToDisplay('emailInput', 'displayEmail', 'liEmail');
bindInputToDisplay('phoneInput', 'displayPhone', 'liPhone');
bindInputToDisplay('locationInput', 'displayLocation', 'liLocation');
bindInputToDisplay('linkedinInput', 'displayLinkedin', 'liLinkedin');
bindInputToDisplay('portfolioInput', 'displayPortfolio', 'liPortfolio');

// Foto
document.getElementById('photoInput').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) { document.getElementById('displayPhoto').src = e.target.result; }
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Listas de Tags (Habilidades/Idiomas)
function setupTagList(inputId, displayId) {
    document.getElementById(inputId).addEventListener('input', function(e) {
        const items = e.target.value.split(',');
        const display = document.getElementById(displayId);
        display.innerHTML = '';
        items.forEach(item => {
            if(item.trim() !== '') {
                const li = document.createElement('li');
                li.innerText = item.trim();
                display.appendChild(li);
            }
        });
    });
}
setupTagList('skillsInput', 'displaySkills');
setupTagList('languagesInput', 'displayLanguages');

// --- Itens Dinâmicos (Exp e Formação) ---
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

function createInputBlock(containerId, displayContainerId, type) {
    const id = generateId();
    const formContainer = document.getElementById(containerId);
    const displayContainer = document.getElementById(displayContainerId);

    // Remove placeholder se existir
    const placeholder = displayContainer.querySelector('.placeholder-text');
    if(placeholder) placeholder.remove();

    const editorDiv = document.createElement('div');
    editorDiv.className = 'form-group style-box';
    editorDiv.style.border = "1px solid #ddd"; 
    editorDiv.style.padding = "10px";
    editorDiv.style.marginBottom = "10px";
    editorDiv.style.background = "#fafafa";
    editorDiv.style.borderRadius = "4px";
    
    editorDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <strong style="font-size:0.8rem; color:#666;">${type === 'exp' ? 'Experiência' : 'Formação'}</strong>
            <button onclick="removeItem('${id}', this)" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold;">✕</button>
        </div>
        <input type="text" placeholder="${type === 'exp' ? 'Cargo' : 'Curso/Grau'}" oninput="updateItem('${id}', 'title', this.value)">
        <input type="text" placeholder="${type === 'exp' ? 'Empresa' : 'Instituição'}" oninput="updateItem('${id}', 'sub', this.value)">
        <input type="text" placeholder="Período (Ex: 2021 - Atual)" oninput="updateItem('${id}', 'date', this.value)">
        <textarea placeholder="Descrição / Principais Conquistas" oninput="updateItem('${id}', 'desc', this.value)"></textarea>
    `;
    formContainer.appendChild(editorDiv);

    const viewDiv = document.createElement('div');
    viewDiv.className = 'item-block';
    viewDiv.id = id;
    viewDiv.innerHTML = `
        <div class="item-header">
            <span class="item-title"></span>
            <span class="date-span"></span>
        </div>
        <span class="item-sub"></span>
        <div class="item-desc"></div>
    `;
    displayContainer.appendChild(viewDiv);
}

window.updateItem = function(id, field, value) {
    const item = document.getElementById(id);
    if (!item) return;
    if(field === 'title') item.querySelector('.item-title').innerText = value;
    if(field === 'sub') item.querySelector('.item-sub').innerText = value;
    if(field === 'date') item.querySelector('.date-span').innerText = value;
    if(field === 'desc') item.querySelector('.item-desc').innerText = value;
}

window.removeItem = function(id, btnElement) {
    const item = document.getElementById(id);
    if (item) item.remove();
    btnElement.parentElement.parentElement.remove();
}

function addExperienceField() { createInputBlock('experienceFormList', 'displayExperienceList', 'exp'); }
function addEducationField() { createInputBlock('educationFormList', 'displayEducationList', 'edu'); }

// Inicia com um campo de experiência vazio para incentivar
addExperienceField();