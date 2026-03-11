import { showMessage, showConfirm } from './utilities.js';

export async function loadGravadoraSelect() {
    const select = document.getElementById('Lista_gravadora');
    if (!select) return;
    const result = await window.lojaMusica.gravadora.listar();
    if (result.erro) return showMessage('Erro', result.erro);
    select.innerHTML = '<option value="">Selecione a gravadora</option>';
    result.forEach(grav => {
        const option = document.createElement('option');
        option.value = grav.gravadora_id;
        option.textContent = grav.nome;
        select.appendChild(option);
    });
}

export async function loadRecentGravadoras() {
    const tbody = document.querySelector('#table-gravadora tbody');
    if (!tbody) return;
    const result = await window.lojaMusica.gravadora.listar();
    if (result.erro) return showMessage('Erro', result.erro);
    const recentes = result.sort((a, b) => b.gravadora_id - a.gravadora_id).slice(0, 10);
    tbody.innerHTML = '';
    recentes.forEach(g => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${g.gravadora_id}</td>
            <td>${g.nome}</td>
            <td>
                <button class="btn btn-sm btn-primary editar-gravadora" data-id="${g.gravadora_id}" data-nome="${g.nome}">Editar</button>
                <button class="btn btn-sm btn-danger excluir-gravadora" data-id="${g.gravadora_id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    attachGravadoraActions();
}

function attachGravadoraActions() {
    document.querySelectorAll('.excluir-gravadora').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (await showConfirm('Confirmar', 'Excluir esta gravadora?')) {
                const result = await window.lojaMusica.gravadora.excluir(id);
                if (result.erro) showMessage('Erro', result.erro);
                else {
                    showMessage('Sucesso', 'Gravadora excluída.');
                    loadRecentGravadoras();
                    loadGravadoraSelect();
                }
            }
        });
    });

    document.querySelectorAll('.editar-gravadora').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const nome = e.target.dataset.nome;
            const form = document.getElementById('form-gravadora');
            form.querySelector('input[name="nome"]').value = nome;
            const originalSubmit = form.onsubmit;
            form.onsubmit = async (event) => {
                event.preventDefault();
                const novoNome = form.querySelector('input[name="nome"]').value.trim();
                if (!novoNome) return;
                const result = await window.lojaMusica.gravadora.editar({ id, nome: novoNome });
                if (result.erro) showMessage('Erro', result.erro);
                else {
                    showMessage('Sucesso', 'Gravadora atualizada.');
                    form.reset();
                    form.onsubmit = originalSubmit;
                    loadRecentGravadoras();
                    loadGravadoraSelect();
                }
            };
        });
    });
}

export function setupGravadoraForm() {
    const form = document.getElementById('form-gravadora');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('input[name="nome"]');
        const nome = input.value.trim();
        if (!nome) return;
        const result = await window.lojaMusica.gravadora.criar(nome);
        if (result.erro) showMessage('Erro', result.erro);
        else {
            showMessage('Sucesso', 'Gravadora criada.');
            form.reset();
            loadRecentGravadoras();
            loadGravadoraSelect();
        }
    });
}