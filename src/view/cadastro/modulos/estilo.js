import {showMessage, showConfirm} from './utils.js';

let editingId = null;

export async function loadEstiloSelect() {
    const select = document.getElementById('Lista_estilo');
    if (!select) return;
    const result = await window.lojaMusica.estilo.listar();
    if (result.erro) return showMessage('Erro', result.erro);
    select.innerHTML = '<option value="">Selecione o estilo</option>';
    result.forEach(estilo => {
        const option = document.createElement('option');
        option.value = estilo.estilo_id;
        option.textContent = estilo.descricao;
        select.appendChild(option);
    });
}

export async function loadRecentEstilos() {
    const tbody = document.querySelector('#table-estilo tbody');
    if (!tbody) return;
    const result = await window.lojaMusica.estilo.listar();
    if (result.erro) return showMessage('Erro', result.erro);
    const recentes = result.sort((a,b) => b.estilo_id - a.estilo_id).slice(0,10);
    tbody.innerHTML = '';
    recentes.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${e.estilo_id}</td>
            <td>${e.descricao}</td>
            <td>
                <button class="btn btn-sm btn-primary editar-estilo" data-id="${e.estilo_id}" data-descricao="${e.descricao}">Editar</button>
                <button class="btn btn-sm btn-danger excluir-estilo" data-id="${e.estilo_id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    attachEstiloActions();
}

function attachEstiloActions() {
    document.querySelectorAll('.excluir-estilo').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (await showConfirm('Confirmar', 'Excluir este estilo?')) {
                const result = await window.lojaMusica.estilo.excluir(id);
                if (result.erro) showMessage('Erro', result.erro);
                else {
                    showMessage('Sucesso', 'Estilo excluído.');
                    loadRecentEstilos();
                    loadEstiloSelect();
                }
            }
        });
    });

    document.querySelectorAll('.editar-estilo').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const descricao = e.target.dataset.descricao;
            const form = document.getElementById('form-estilo');
            form.querySelector('input[name="descricao"]').value = descricao;
            editingId = id;
        });
    });
}

export function setupEstiloForm() {
    const form = document.getElementById('form-estilo');
    if (!form) return;
    form.removeEventListener('submit', handleEstiloSubmit);
    form.addEventListener('submit', handleEstiloSubmit);
}

async function handleEstiloSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input[name="descricao"]');
    const desc = input.value.trim();
    if (!desc) return;

    let result;
    if (editingId) {
        result = await window.lojaMusica.estilo.editar({ id: editingId, descricao: desc });
    } else {
        result = await window.lojaMusica.estilo.criar(desc);
    }

    if (result.erro) {
        showMessage('Erro', result.erro);
    } else {
        showMessage('Sucesso', editingId ? 'Estilo atualizado.' : 'Estilo criado.');
        form.reset();
        editingId = null;
        loadRecentEstilos();
        loadEstiloSelect();
    }
}