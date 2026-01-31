const LS_TX = 'hs_tx_checks_v1';

function load(){
  try { return JSON.parse(localStorage.getItem(LS_TX) || '{}'); }
  catch { return {}; }
}
function save(data){
  localStorage.setItem(LS_TX, JSON.stringify(data));
}

const state = load();

document.querySelectorAll('input[data-check]').forEach(cb => {
  const k = cb.dataset.check;
  cb.checked = !!state[k];
  cb.addEventListener('change', () => {
    state[k] = cb.checked;
    save(state);
  });
});
