/* ---------- MESSAGES ---------- */
function messages(){
  return `<div class="ph"><div><h1>Messages</h1></div></div><div class="card mgrid"><div class="mlist" role="tablist">${S.dms.map((d,i)=>`<button role="tab" data-dm="${i}" aria-selected="${S.msgSel===i}">${av(d[0],i)}<div style="min-width:0"><b style="display:block;font-size:14.5px">${d[0]}</b><small style="color:var(--muted);font-size:13px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d[2][d[2].length-1][1])}</small></div></button>`).join('')}</div>
   <div class="mpane"><div class="person" style="padding-bottom:12px;border-bottom:1px solid var(--line);margin-bottom:12px">${av(S.dms[S.msgSel][0],S.msgSel)}<div><b>${S.dms[S.msgSel][0]}</b><small>Friends · Verified</small></div></div><div class="chat" id="dmchat">${S.dms[S.msgSel][2].map(m=>msgHTML(m,me().name)).join('')}</div><form class="send" id="dmf"><input id="dmmsg" placeholder="Write a message" aria-label="Message"><button class="btn btn-primary">Send</button></form></div></div>`;
}
bind.messages=()=>{
  $('#view').addEventListener('click',e=>{const b=e.target.closest('[data-dm]'); if(b){S.msgSel=+b.dataset.dm; route()}});
  $('#view').addEventListener('submit',e=>{e.preventDefault(); const v=$('#dmmsg').value.trim(); if(!v) return; S.dms[S.msgSel][2].push([me().name,v,'now']); $('#dmchat').innerHTML=S.dms[S.msgSel][2].map(m=>msgHTML(m,me().name)).join(''); $('#dmmsg').value=''});
};
