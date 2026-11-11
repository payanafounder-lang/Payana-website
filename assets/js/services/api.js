/* =====================================================================
   SERVICES LAYER — the only place screens get data from.
   Each service has a demo implementation today. To go live, replace the
   "live" branch with calls through Api.request() to the backend, then set
   PAYANA_CONFIG.mode = 'live'. Screens should not need to change.
   ===================================================================== */
function notConnected(what){
  throw new Error(`Payana: ${what} is not connected to a backend yet. See docs/PRODUCTION-ROADMAP.md.`);
}

// Future HTTP client for the backend API. Not used in demo mode.
const Api={
  async request(method,path,body){
    if(!PAYANA_CONFIG.apiBaseUrl) notConnected('the API');
    const res=await fetch(PAYANA_CONFIG.apiBaseUrl+path,{method,credentials:'include',
      headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
    if(!res.ok) throw new Error(`API ${method} ${path} failed: ${res.status}`);
    return res.status===204?null:res.json();
  }
};

// Copy demo data so the originals in data/demo/ are never modified.
const demoCopy=x=>JSON.parse(JSON.stringify(x));
