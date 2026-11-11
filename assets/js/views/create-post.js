/* ---------- CREATE POST ---------- */
const CTYPES=[['Photo','photo'],['Trip story','book'],['Travel tip','bulb'],['Looking for companions','users']];
let ctype='Photo', cimgs=[];
function create(){
  cimgs=[];
  return `<div class="ph"><div><h1>Create a post</h1><p>Share a moment, a story, a tip, or find people for your next trip</p></div></div>
   <form class="cgrid" id="cpf"><div class="card sec">
    <div class="types">${CTYPES.map(([l,ic])=>`<button type="button" data-ct="${l}" aria-pressed="${ctype===l}">${I(ic)}${l}</button>`).join('')}</div>
    <label class="drop" for="cfile">${I('photo','style="width:32px;height:32px"')}<b>Add photos or videos</b><small>Tap to choose from your device</small><input type="file" id="cfile" accept="image/*" multiple hidden></label>
    <div class="thumbs" id="thumbs"></div>
    <label class="in" for="ccap">Caption<textarea id="ccap" placeholder="What happened? Where should people go?"></textarea></label>
    <div class="row2" style="grid-template-columns:1fr 1fr"><label class="in" for="cloc">Location<input id="cloc" placeholder="e.g. Coorg"></label><label class="in" for="ctag">Tag travel buddies<input id="ctag" placeholder="@ananya.k"></label></div>
    <label class="in" for="ctrip">Link a trip<select id="ctrip"><option value="">No trip</option>${TRIPS.map(t=>`<option value="${t.id}">${t.name} · ${t.dates}</option>`).join('')}</select></label>
    <p class="err" id="cerr" hidden></p>
   </div>
   <div class="card sec" style="position:sticky;top:24px"><h2 style="font-size:18px">Who can see this?</h2>
    <div class="radios"><label><input type="radio" name="vis" value="Everyone" checked>Everyone</label><label><input type="radio" name="vis" value="Friends only">Friends only</label><label><input type="radio" name="vis" value="Only me">Only me</label></div>
    <label class="toggle"><input type="checkbox" id="chide" checked>Hide exact location until after the trip</label>
    <button class="btn btn-primary" type="submit">Post</button><a class="btn btn-line" href="#feed">Cancel</a></div></form>`;
}
bind.create=()=>{
  $('#view').addEventListener('click',e=>{const b=e.target.closest('[data-ct]'); if(b){ctype=b.dataset.ct; $$('[data-ct]').forEach(x=>x.setAttribute('aria-pressed',x===b))}});
  $('#cfile').onchange=e=>{[...e.target.files].slice(0,6).forEach(f=>{const r=new FileReader(); r.onload=()=>{cimgs.push(r.result); $('#thumbs').innerHTML=cimgs.map(s=>`<img src="${s}" alt="">`).join('')}; r.readAsDataURL(f)})};
  $('#cpf').addEventListener('submit',e=>{e.preventDefault(); const cap=$('#ccap').value.trim();
    if(!cap&&!cimgs.length){$('#cerr').textContent='Add a photo or write a caption first.'; $('#cerr').hidden=false; return}
    const u=me(), tr=$('#ctrip').value;
    const p={id:Date.now(),who:u.name,v:true,where:$('#cloc').value.trim()||'Bengaluru',time:'Just now',type:ctype,text:cap||'',likes:0,com:0};
    if(cimgs[0]) {p.img=cimgs[0]; S.myPosts.unshift(cimgs[0])}
    if(tr){ if(ctype==='Looking for companions') p.lfc=tr; else p.trip=tr }
    S.posts.unshift(p); location.hash='feed'; demoToast('posted on this page only. Nothing was uploaded.');
  });
};
