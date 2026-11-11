/* Browser storage wrapper (localStorage). Keys are prefixed with
   PAYANA_CONFIG.storagePrefix ("payana-demo-") so demo state stays separate.
   Demo only: real user data must live in the backend database, never here. */
const store={
  key(k){return PAYANA_CONFIG.storagePrefix+k},
  get(k){try{return JSON.parse(localStorage.getItem(this.key(k)))}catch(e){return null}},
  set(k,v){try{localStorage.setItem(this.key(k),JSON.stringify(v))}catch(e){}},
  del(k){try{localStorage.removeItem(this.key(k))}catch(e){}}
};
