/* ---------- ERROR PAGES & EMPTY SCREENS (v1.4) ----------
   notfound(): any app address that doesn't exist. paused(): account paused after a report.
   Offline banner: shown whenever the browser loses its connection.
   Every screen gives one clear next step, never a dead end. */
function emptyState(ic,title,text,actions,tone=''){return `<div class="card es ${tone}"><span class="es-ic">${I(ic)}</span><h2>${title}</h2><p>${text}</p><div class="btns" style="justify-content:center">${actions}</div></div>`}
function notfound(){return emptyState('map','This road doesn\'t go anywhere','The page may have moved, or the trip was removed by its host.','<a class="btn btn-primary" href="#explore">Explore trips</a><a class="btn btn-soft" href="#feed">Home</a>')}
function paused(){
  return `<div class="es-wrap">${emptyState('shield','Your account is paused','We paused it after a report, under our <a class="linkbtn" href="#legal-rules">Community Rules</a>. If you think this is a mistake, you can appeal. <b>Demo:</b> this is a sample screen; your demo account is fine.',
    `<a class="btn btn-primary" href="#appeal" data-need-appeal>Appeal</a><a class="btn btn-soft" href="#legal-rules">Read the rules</a>`,'bad')}</div>`;
}
bind.paused=()=>$('#pview').addEventListener('click',e=>{const a=e.target.closest('[data-need-appeal]'); if(a&&typeof appeal!=='function'){e.preventDefault(); demoToast('the appeal form comes in version 1.5')} else if(a&&!authed()){e.preventDefault(); pending='appeal'; openM('login')}});
// Offline banner
(function(){const b=document.createElement('div'); b.className='offline'; b.setAttribute('role','status'); b.hidden=navigator.onLine;
  b.innerHTML=`${I('clock')}<span><b>You're offline.</b> Probably a ghat road. Your trip plan and chats will update when you're back.</span><button class="linkbtn" style="color:inherit">Try again</button>`;
  document.body.appendChild(b); b.querySelector('button').onclick=()=>{b.hidden=navigator.onLine; if(navigator.onLine) route()};
  addEventListener('offline',()=>b.hidden=false); addEventListener('online',()=>b.hidden=true);})();
