/* ---------- CREATE STORY (#story): pick photos/videos, then the story editor opens ---------- */
const ctabs=k=>`<nav class="ctabs" aria-label="What to create"><a href="#create"${k==='post'?' aria-current="page"':''}>Post</a><a href="#story"${k==='story'?' aria-current="page"':''}>Story</a></nav>`;
function storyNew(){
  return `${ctabs('story')}<div class="ph"><div><h1>Add to your story</h1><p>Stories show at the top of your friends' feed for 24 hours, then disappear. They never appear in the feed or on your profile grid.</p></div></div>
   <div class="card sec spick" id="sstage"><label class="drop sdrop" for="sfile">${I('photo','style="width:32px;height:32px"')}<b>Choose photos or videos</b><small>Up to 10 · each one becomes its own story</small></label><input type="file" id="sfile" accept="image/*,video/*" multiple hidden><p class="err" id="serr" hidden></p>
    <div class="snext"><b>Next, design your story before you share it</b><ul><li><span class="se-aa">Aa</span>Text in 7 fonts, any colour, with or without a background</li><li>${SIC.smile}Stickers: location, mention anyone on Payana, your trip, time, date, emoji</li><li>${SIC.pen}Draw with pen, marker or neon</li><li>${SIC.palette}Change the background and drag, pinch or rotate anything into place</li></ul></div></div>`}
bind.story=()=>{
  const st=$('#sstage'), lab=st.querySelector('.drop');
  const share=(A,vis)=>saveNewStories(A,vis,true);
  const add=async files=>{files=files.filter(f=>/^(image|video)\//.test(f.type)||/\.(mp4|mov|webm|m4v)$/i.test(f.name)); if(!files.length) return;
    if(files.length>10) toast('Up to 10 at a time. Added the first 10.');
    lab.classList.add('busy'); lab.querySelector('b').textContent='Preparing your story…';
    const got=await readMedia(files.slice(0,10)); lab.classList.remove('busy'); lab.querySelector('b').textContent='Choose photos or videos';
    if(!got.length){$('#serr').textContent='Add a photo or video to make a story.'; $('#serr').hidden=false; return} $('#serr').hidden=true;
    openStoryEditor(got,{onShare:share})};
  $('#sfile').onchange=e=>{const f=[...e.target.files]; e.target.value=''; add(f)};
  st.addEventListener('dragover',e=>{e.preventDefault(); lab.classList.add('over')});
  st.addEventListener('dragleave',()=>lab.classList.remove('over'));
  st.addEventListener('drop',e=>{e.preventDefault(); lab.classList.remove('over'); add([...e.dataTransfer.files])});
};
