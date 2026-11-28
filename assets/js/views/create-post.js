/* ---------- CREATE POST ----------
   Team change (24 Nov): photos AND videos (up to 10). Before publishing, swipe through them,
   edit each one (crop, rotate, adjust, filters; trim videos) and preview the finished post.
   Demo: nothing is uploaded; files stay on this page only. */
const CTYPES=[['Photo','photo'],['Trip story','book'],['Looking for companions','users']]; // 28 Nov: "Travel tip" removed
let ctype='Photo', cmedia=[], ctags=[];
function create(){
  cmedia=[]; ctags=[]; if(!CTYPES.some(([l])=>l===ctype)) ctype='Photo';
  return `${ctabs('post')}<div class="ph"><div><h1>Create a post</h1><p>Share a moment, a story, or find people for your next trip</p></div><div class="btns"><a class="btn btn-line btn-sm" href="#feed">Cancel</a><button class="btn btn-primary btn-sm" type="submit" form="cpf">Publish</button></div></div>
   <form class="cgrid" id="cpf" novalidate><div class="card sec">
    <div class="types">${CTYPES.map(([l,ic])=>`<button type="button" data-ct="${l}" aria-pressed="${ctype===l}">${I(ic)}${l}</button>`).join('')}</div>
    <div id="cstage"></div><input type="file" id="cfile" accept="image/*,video/*" multiple hidden>
    <label class="in" for="ccap">Caption<textarea id="ccap" placeholder="What happened? Where should people go?" maxlength="2200"></textarea></label>
    <div class="row2 ctagrow"><label class="in" for="cloc">Location<input id="cloc" placeholder="e.g. Coorg"></label><div class="in"><label for="ctag">Tag people</label><div class="tagbox" id="ctagbox"><input id="ctag" placeholder="Search anyone on Payana" autocomplete="off" aria-describedby="ctagn"></div><div class="mac" id="ctagl" hidden></div><small id="ctagn" class="tagn">Anyone on Payana can be tagged. Type @ in the caption to mention someone.</small></div></div>
    <label class="in" for="ctrip">Link a trip<select id="ctrip"><option value="">No trip</option>${TRIPS.map(t=>`<option value="${t.id}">${t.name} · ${t.dates}</option>`).join('')}</select></label>
    <p class="err" id="cerr" hidden></p>
   </div>
   <div class="card sec" style="position:sticky;top:24px"><h2 style="font-size:18px">Who can see this?</h2>
    <div class="radios"><label><input type="radio" name="vis" value="Everyone" checked>Everyone</label><label><input type="radio" name="vis" value="Friends only">Friends only</label><label><input type="radio" name="vis" value="Only me">Only me</label></div>
    <label class="toggle"><input type="checkbox" id="chide" checked>Hide exact location until after the trip</label>
    <button class="btn btn-line" type="button" data-cprev>${I('eye')}Preview post</button>
    <button class="btn btn-primary" type="submit">Publish</button><a class="btn btn-line" href="#feed">Cancel</a></div></form>`;
}
function cStage(k){const st=$('#cstage'); if(!st) return; const n=cmedia.length;
  st.innerHTML=!n?`<label class="drop" for="cfile">${I('photo','style="width:32px;height:32px"')}<b>Add photos or videos</b><small>Up to 10 · drag them here or tap to choose</small></label>`
   :`<div class="cmp">${carousel({media:cmedia})}
     <div class="cmp-bar"><span>${n>1?`${n} items · swipe to check each one`:'1 item'}</span><div class="btns"><button type="button" class="btn btn-soft btn-sm" data-cedit>${I('edit')}Edit this ${'{kind}'}</button>${n<10?`<label class="btn btn-line btn-sm" for="cfile">${I('plus')}Add more</label>`:''}</div></div>
     <div class="cstrip">${cmedia.map((m,i)=>thumbHTML(m,i,true)).join('')}</div></div>`;
  const c=st.querySelector('[data-car]'); if(c){carSet(c,k||0)} kindLbl();
}
function kindLbl(){const b=$('#cstage [data-cedit=""]'); if(!b) return; const m=cmedia[carIdx($('#cstage [data-car]'))]; b.lastChild.textContent=`Edit this ${m&&m.t==='v'?'video':'photo'}`}
function draftPost(){const u=me(), tr=$('#ctrip').value;
  const p={id:0,who:u.name,v:true,where:$('#cloc').value.trim()||'Bengaluru',time:'Just now',type:ctype,text:$('#ccap').value.trim(),likes:0,com:0,media:cmedia.slice()};
  if(ctags.length) p.tags=ctags.slice();
  if(tr){if(ctype==='Looking for companions') p.lfc=tr; else p.trip=tr} return p}
bind.create=()=>{
  cStage(); mentionAC($('#ccap')); tagPicker($('#ctagbox'),$('#ctagl'),ctags);
  const v=$('#view'), st=$('#cstage');
  const add=async files=>{const room=10-cmedia.length; if(!files.length) return; if(room<=0){toast('You can add up to 10 photos or videos'); return}
    if(files.length>room) toast(`Up to 10 per post. Added the first ${room}.`);
    st.innerHTML='<div class="cbusy">Preparing your photos…</div>'; const got=await readMedia(files.slice(0,room)), at=cmedia.length; cmedia.push(...got); $('#cerr').hidden=true; cStage(got.length?at:0)};
  $('#cfile').onchange=e=>{const f=[...e.target.files]; e.target.value=''; add(f)};
  st.addEventListener('dragover',e=>{e.preventDefault(); const d=st.querySelector('.drop'); d&&d.classList.add('over')});
  st.addEventListener('dragleave',()=>{const d=st.querySelector('.drop'); d&&d.classList.remove('over')});
  st.addEventListener('drop',e=>{e.preventDefault(); add([...e.dataTransfer.files].filter(f=>/^(image|video)\//.test(f.type)))});
  st.addEventListener('scroll',()=>requestAnimationFrame(kindLbl),true);
  v.addEventListener('click',e=>{const b=e.target.closest('[data-ct]'); if(b){ctype=b.dataset.ct; $$('[data-ct]').forEach(x=>x.setAttribute('aria-pressed',x===b)); return}
    const ed=e.target.closest('#cstage [data-cedit]'), rm=e.target.closest('#cstage [data-crm]'), th=e.target.closest('#cstage [data-ci]');
    if(ed){const j=ed.dataset.cedit===''?carIdx($('#cstage [data-car]')):+ed.dataset.cedit; editMedia(cmedia[j],it=>{cmedia[j]=it; cStage(j)}); return}
    if(rm){const j=+rm.dataset.crm, g=cmedia.splice(j,1)[0]; if(g&&g.t==='v') URL.revokeObjectURL(g.s); cStage(Math.min(j,cmedia.length-1)); return}
    if(th){carGo($('#cstage [data-car]'),+th.dataset.ci); return}
    if(e.target.closest('[data-cprev]')){const p=draftPost(); if(!p.text&&!p.media.length){$('#cerr').textContent='Add a photo or write a caption first.'; $('#cerr').hidden=false; return}
      const vis=$('input[name=vis]:checked').value, o=openModal(`<div class="sheet" style="width:min(520px,100%);padding:20px"><div class="sheet-top"><h2 style="font-size:22px">Preview</h2><button type="button" class="x" data-close aria-label="Close">×</button></div>
        <p style="color:var(--muted);font-size:14px;margin-top:-6px">How your post will look to ${vis==='Everyone'?'everyone':vis==='Only me'?'you only':'your friends'}. Swipe through to check every photo.</p>
        <div class="is-preview">${postHTML(p)}</div>
        <div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn btn-line btn-sm" data-close>Keep editing</button><button type="button" class="btn btn-primary btn-sm" data-pub>Publish</button></div></div>`,{label:'Post preview'});
      o.m.querySelector('[data-pub]').onclick=()=>{o.close(); $('#cpf').requestSubmit()}}
  });
  $('#cpf').addEventListener('submit',e=>{e.preventDefault(); const p=draftPost();
    if(!p.text&&!p.media.length){$('#cerr').textContent='Add a photo or write a caption first.'; $('#cerr').hidden=false; return}
    p.id=Date.now(); syncImg(p); S.posts.unshift(p); S.myPosts.unshift(p); cmedia=[]; ctags=[]; location.hash='feed'; demoToast('posted on this page only. Nothing was uploaded.');
  });
};
