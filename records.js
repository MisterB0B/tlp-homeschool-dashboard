const LS_REC = 'hs_records_v1';

function load(){
  try { return JSON.parse(localStorage.getItem(LS_REC) || '{}'); }
  catch { return {}; }
}
function save(data){
  localStorage.setItem(LS_REC, JSON.stringify(data));
}

const $ = (s) => document.querySelector(s);

const state = load();

$('#materials').value = state.materials || '';
$('#reading').value = state.reading || '';
$('#highlights').value = state.highlights || '';

['materials','reading','highlights'].forEach(id => {
  $('#'+id).addEventListener('input', () => {
    state[id] = $('#'+id).value;
    save(state);
  });
});

$('#btnPrint').addEventListener('click', () => window.print());

$('#btnExport').addEventListener('click', async () => {
  const payload = {
    exportedAt: new Date().toISOString(),
    materials: $('#materials').value,
    readingList: $('#reading').value,
    highlights: $('#highlights').value,
  };
  const txt = JSON.stringify(payload, null, 2);
  try{
    await navigator.clipboard.writeText(txt);
    alert('Copied to clipboard. Paste into Notes/Google Doc for safekeeping.');
  }catch{
    const pre = $('#exportOut');
    pre.style.display = 'block';
    pre.textContent = txt;
    alert('Could not access clipboard. Scroll down and copy the text manually.');
  }
});
