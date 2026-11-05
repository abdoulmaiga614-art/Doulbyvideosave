const form=document.getElementById('form');
const input=document.getElementById('url');
const statusEl=document.getElementById('status');
const result=document.getElementById('result');
const player=document.getElementById('player');
const openLink=document.getElementById('open');
form.addEventListener('submit',async e=>{
 e.preventDefault(); result.hidden=true; statusEl.textContent='Vérification du lien…';
 try{
  const response=await fetch('/.netlify/functions/resolve-tiktok?url='+encodeURIComponent(input.value.trim()));
  const data=await response.json();
  if(!response.ok||!data.url) throw new Error(data.error||'Lien non reconnu.');
  const match=data.url.match(/\/video\/(\d+)/);
  if(!match) throw new Error('Impossible de trouver l’identifiant de la vidéo.');
  player.src='https://www.tiktok.com/embed/v2/'+match[1];
  openLink.href=data.url; result.hidden=false; statusEl.textContent='Vidéo trouvée.';
 }catch(err){statusEl.textContent=err.message+' Vérifiez que le lien est public et réessayez.';}
});
