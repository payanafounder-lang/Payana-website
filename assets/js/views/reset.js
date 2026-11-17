/* ---------- FORGOT / RESET PASSWORD (public, v1.2) ----------
   Demo: three steps that only check the form. No code is sent and no password is changed.
   Live: the auth provider's reset flow (OTP to phone or email). */
let rsStep=1, rsTo='';
function reset(){
  rsStep=1; rsTo='';
  return `<section class="rs-wrap"><div class="rs-head"><h1>Forgot your password?</h1><p>Three quick steps and you're back to planning trips.</p></div>
   <div class="rs-card card" id="rsbox">${rsBody()}</div></section>`;
}
function rsBody(){
  const steps=`<ol class="steps" aria-label="Progress">${['Find account','Enter code','New password'].map((s,i)=>`<li class="${i+1<rsStep?'done':i+1===rsStep?'on':''}">${s}</li>`).join('')}</ol>`;
  if(rsStep===1) return `${steps}<form class="fm" id="rsf"><h2>Find your account</h2><p class="hint">Enter the phone number or email you signed up with.</p>
    <label class="in" for="rs-id">Phone or email<input id="rs-id" autocomplete="username" placeholder="+91 98XXX XXXXX"></label><p class="err" id="rserr" hidden></p>
    <button class="btn btn-primary">Send code</button><a class="linkbtn" href="#top" data-open-login>Back to log in</a></form>`;
  if(rsStep===2) return `${steps}<form class="fm" id="rsf"><h2>Enter the 6-digit code</h2><p class="hint">We'd send it to ${esc(rsTo)}. It expires in 10 minutes.<br><b>Demo:</b> any 6 digits work.</p>
    <label class="in" for="rs-code">Code<input id="rs-code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="••••••" class="otp"></label><p class="err" id="rserr" hidden></p>
    <button class="btn btn-primary">Verify</button><button type="button" class="linkbtn" data-rs-resend>Resend code</button></form>`;
  if(rsStep===3) return `${steps}<form class="fm" id="rsf"><h2>Set a new password</h2>
    <label class="in" for="rs-p1">New password<input id="rs-p1" type="password" autocomplete="new-password"></label>
    <label class="in" for="rs-p2">Type it again<input id="rs-p2" type="password" autocomplete="new-password"></label>
    <ul class="tips"><li>At least 8 characters</li><li>Includes a number</li></ul><p class="err" id="rserr" hidden></p>
    <button class="btn btn-primary">Save and log in</button>
    <p class="hint">For your safety you'd be logged out on other devices. Payana will never ask for this code by call or chat.</p></form>`;
  return `<div class="fm" style="text-align:center"><span class="big-ok">${I('check')}</span><h2>Password updated</h2><p class="hint">Demo: nothing was changed. Log in to continue.</p><button class="btn btn-primary" data-open-login>Log in</button></div>`;
}
bind.reset=()=>{
  const box=$('#rsbox'), err=m=>{const e=$('#rserr'); e.textContent=m; e.hidden=false};
  box.addEventListener('submit',e=>{e.preventDefault();
    if(rsStep===1){const id=$('#rs-id').value.trim(); if(!/^\S+@\S+\.\S+$/.test(id)&&!/^\+?\d[\d\s]{8,}$/.test(id)) return err('Enter a valid email address or a 10-digit phone number.'); rsTo=id.includes('@')?id:id.replace(/\d(?=[\d\s]{4})/g,'X'); demoToast('no code was sent.')}
    else if(rsStep===2){if(!/^\d{6}$/.test($('#rs-code').value.trim())) return err('Enter the 6 digits from the message.')}
    else if(rsStep===3){const a=$('#rs-p1').value, b=$('#rs-p2').value; if(a.length<8||!/\d/.test(a)) return err('Use at least 8 characters, including a number.'); if(a!==b) return err('The two passwords don\'t match.')}
    rsStep++; box.innerHTML=rsBody(); const f=box.querySelector('input'); f&&f.focus();
  });
  box.addEventListener('click',e=>{
    if(e.target.closest('[data-rs-resend]')) demoToast('no code was sent.');
    if(e.target.closest('[data-open-login]')){e.preventDefault(); location.hash='top'; setTimeout(()=>openM('login'),50)}
  });
};
