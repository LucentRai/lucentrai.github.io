(()=>{const e=new RegExp("^(http|https)://[a-zA-Z0-9\\-\\.]+\\.[a-zA-Z]{2,3}(/\\S*)?$"),t=3e3,{hash:n}=window.location,i=document.querySelector("#btn-decode"),c=document.querySelector("#btn-copy-decoded"),d=document.querySelector("#btn-encode"),o=document.querySelector("#btn-copy-encoded"),r=document.querySelector("#decode-message"),l=document.querySelector("#decoded"),s=document.querySelector("#decoded-message-copied"),a=document.querySelector("#message"),u=document.querySelector("#encoded"),y=document.querySelector("#encoded-message-copied");function v(e,n){navigator.clipboard.writeText(e).then((()=>{n.style.visibility="visible"})),setTimeout((()=>{n.style.visibility="hidden"}),t)}n&&(l.innerText=atob(n.replace("#",""))),document.addEventListener("keydown",(t=>{if(t.ctrlKey)switch(t.key){case"c":case"C":t.altKey&&u.innerText&&v(u.innerText,y);break;case"q":case"Q":e.test(l.innerText)&&window.open(l.innerText,"_blank")}})),i.addEventListener("click",(t=>{t.preventDefault(),l.innerText=atob(r.value),e.test(l.innerText)&&(l.innerHTML=`<a href="${l.innerText}" target="_blank">${l.innerText}</a>`),c.style.visibility="visible"})),c.addEventListener("click",(e=>{e.preventDefault(),v(l.innerText,s),setTimeout((()=>{c.style.visibility="hidden"}),t)})),d.addEventListener("click",(e=>{e.preventDefault(),u.innerText=btoa(a.value),o.style.visibility="visible"})),o.addEventListener("click",(e=>{e.preventDefault(),v(u.innerText,y),setTimeout((()=>{o.style.visibility="hidden"}),t)}))})();