/* Start the app: render whichever screen matches the current address. Loaded last. */
if(!IS_DEMO){const d=document.getElementById('demo-tag'); d&&d.remove()}
route();
