import { showMessage, showConfirm } from './utilities.js';

export async function loadRecentArtistas() {
    const tbody = document.querySelector('#table-artista tbody');
    if (!tbody) return;
    const result = await window.lojaMusica.artista.listar();
    if (result.erro) return showMessage('Erro', result.erro);
    const recentes = result.sort((a, b) => b.artista_id - a.artista_id).slice(0, 10);
    tbody.innerHTML = '';
    recentes.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${a.artista_id}</td>
            <td>${a.nome}</td>
            <td>
                <button class="btn btn-sm btn-primary editar-artista" data-id="${a.artista_id}" data-nome="${a.nome}">Editar</button>
                <button class="btn btn-sm btn-danger excluir-artista" data-id="${a.artista_id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    attachArtistaActions();
}

function attachArtistaActions() {
    document.querySelectorAll('.excluir-artista').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (await showConfirm('Confirmar', 'Excluir este artista?')) {
                const result = await window.lojaMusica.artista.excluir(id);
                if (result.erro) showMessage('Erro', result.erro);
                else {
                    showMessage('Sucesso', 'Artista excluído.');
                    loadRecentArtistas();
                }
            }
        });
    });

    document.querySelectorAll('.editar-artista').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const nome = e.target.dataset.nome;
            const form = document.getElementById('form-artista');
            form.querySelector('input[name="artista_nome"]').value = nome;
            const originalSubmit = form.onsubmit;
            form.onsubmit = async (event) => {
                event.preventDefault();
                const novoNome = form.querySelector('input[name="artista_nome"]').value.trim();
                if (!novoNome) return;
                const result = await window.lojaMusica.artista.editar({ id, nome: novoNome });
                if (result.erro) showMessage('Erro', result.erro);
                else {
                    showMessage('Sucesso', 'Artista atualizado.');
                    form.reset();
                    form.onsubmit = originalSubmit;
                    loadRecentArtistas();
                }
            };
        });
    });
}

export function setupArtistaForm() {
    const form = document.getElementById('form-artista');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('input[name="artista_nome"]');
        const nome = input.value.trim();
        if (!nome) return;
        const result = await window.lojaMusica.artista.criar(nome);
        if (result.erro) showMessage('Erro', result.erro);
        else {
            showMessage('Sucesso', 'Artista criado.');
            form.reset();
            loadRecentArtistas();
        }
    });
}