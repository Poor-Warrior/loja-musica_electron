import { showMessage, showConfirm } from './modulos/utilities.js';
import { loadEstiloSelect, loadRecentEstilos, setupEstiloForm } from './modulos/estilo.js';
import { loadGravadoraSelect, loadRecentGravadoras, setupGravadoraForm } from './modulos/gravadora.js';
import { loadRecentArtistas, setupArtistaForm } from './modulos/artista.js';
import { loadRecentMusicas, setupMusicaForm } from './modulos/musica.js';
import { loadRecentAlbuns, setupAlbumForm } from './modulos/disco.js';

window.showMessage = showMessage;
window.showConfirm = showConfirm;

document.querySelectorAll('.btn-atualizar').forEach(btn => {
    btn.addEventListener('click', () => {
        loadRecentMusicas();
        loadRecentEstilos();
        loadRecentArtistas();
        loadRecentAlbuns();
        loadRecentGravadoras();
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    await loadEstiloSelect();
    await loadGravadoraSelect();
    await loadRecentMusicas();
    await loadRecentEstilos();
    await loadRecentArtistas();
    await loadRecentAlbuns();
    await loadRecentGravadoras();
    
    setupEstiloForm();
    setupArtistaForm();
    setupGravadoraForm();
    setupMusicaForm();
    setupAlbumForm();
});