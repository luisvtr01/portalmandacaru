(function(){
var FILE=location.protocol==="file:",B=FILE?location.href.replace(/[^\/]*([?#].*)?$/,""):"/",EXT=FILE?".html":"",HOME=B+(FILE?"index.html":""),INSTA="https://instagram.com/portalmandacaru",PER=12;
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var slugify=function(s){return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")};
var fmt=function(i){return new Date(i).toLocaleDateString("pt-BR",{day:"numeric",month:"long",year:"numeric"})};
var params=new URLSearchParams(location.search);

function montarTopo(){
 var hoje=new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
 $("#topo").innerHTML='<div class="barra"><div class="wrap"><span>'+esc(hoje)+'</span><a href="'+INSTA+'" target="_blank" rel="noopener">@portalmandacaru</a></div></div>'+
 '<header class="cab"><div class="wrap"><a class="marca" href="'+HOME+'"><img src="'+B+'assets/logo.png" alt="Portal Mandacaru"><span><b>PORTAL MANDACARU</b><small>Notícias &amp; Conexão</small></span></a>'+
 '<form class="busca" action="'+HOME+'" method="get"><input name="q" type="search" placeholder="Buscar notícias" aria-label="Buscar"><button aria-label="Buscar">&#128269;</button></form></div>'+
 '<nav class="menu"><div class="wrap" id="menu"><a href="'+HOME+'">Início</a></div></nav></header>';
}
function categorias(posts){
 var m={};posts.forEach(function(p){var k=slugify(p.category);if(!m[k])m[k]={slug:k,nome:p.category,n:0};m[k].n++});
 return Object.keys(m).map(function(k){return m[k]}).sort(function(a,b){return b.n-a.n||a.nome.localeCompare(b.nome)});
}
function montarMenu(cats,atual){
 $("#menu").innerHTML='<a href="'+HOME+'"'+(!atual?' class="on"':'')+'>Início</a>'+cats.map(function(c){return '<a href="'+HOME+'?cat='+c.slug+'"'+(c.slug===atual?' class="on"':'')+'>'+esc(c.nome)+'</a>'}).join("");
}
function montarRodape(cats){
 $("#rodape").innerHTML='<footer class="rod"><div class="wrap"><div><img src="'+B+'assets/logo.png" alt=""><p>Portal Mandacaru<br>Notícias &amp; Conexão</p></div><div><nav>'+cats.map(function(c){return '<a href="'+HOME+'?cat='+c.slug+'">'+esc(c.nome)+'</a>'}).join("")+'</nav><p><a href="'+INSTA+'" target="_blank" rel="noopener">Siga @portalmandacaru no Instagram</a></p><p>&copy; '+new Date().getFullYear()+' Portal Mandacaru</p></div></div></footer>';
}
function card(p){
 var sem=!p.image;
 return '<a class="card" href="'+B+'noticia/'+p.slug+EXT+'"><div class="th'+(sem?' sem':'')+'"><img loading="lazy" src="'+(sem?B+'assets/icon.png':B+esc(p.image))+'" alt="'+esc(p.title)+'"></div><div class="in"><span class="c">'+esc(p.category)+'</span><h3>'+esc(p.title)+'</h3><span class="d">'+fmt(p.date)+'</span></div></a>';
}
function dest(p,big){
 var bg=p.image?'<img src="'+B+esc(p.image)+'" alt="'+esc(p.title)+'">':'';
 return '<a class="dest" href="'+B+'noticia/'+p.slug+EXT+'">'+bg+'<div class="txt"><span class="tag">'+esc(p.category)+'</span><h2>'+esc(p.title)+'</h2>'+(big&&p.summary?'<p>'+esc(p.summary)+'</p>':'')+'</div></a>';
}
function lista(titulo,arr){
 var el=$("#conteudo"),shown=0;
 el.innerHTML='<h1 class="sec-t">'+esc(titulo)+'</h1>'+(arr.length?'<div class="grid" id="g"></div><button class="mais" id="m">Carregar mais</button>':'<p class="vazio">Nenhuma notícia encontrada.</p>');
 if(!arr.length)return;
 function mais(){arr.slice(shown,shown+PER).forEach(function(p){$("#g").insertAdjacentHTML("beforeend",card(p))});shown+=PER;if(shown>=arr.length)$("#m").style.display="none"}
 $("#m").onclick=mais;mais();
}
function home(posts,cats){
 var el=$("#conteudo");
 if(!posts.length){el.innerHTML='<p class="vazio">Em breve, as primeiras notícias do Portal Mandacaru.</p>';return}
 var rest=posts.slice(3),shown=0;
 var h='<section class="hero">'+dest(posts[0],true)+'<div class="lados">'+posts.slice(1,3).map(function(p){return dest(p)}).join("")+'</div></section>';
 if(rest.length)h+='<h2 class="sec-t">Últimas notícias</h2><div class="grid" id="g"></div><button class="mais" id="m">Carregar mais</button>';
 cats.forEach(function(c){
  var ps=posts.filter(function(p){return slugify(p.category)===c.slug}).slice(0,3);
  h+='<h2 class="sec-t">'+esc(c.nome)+'<a href="'+HOME+'?cat='+c.slug+'">Ver todas &rarr;</a></h2><div class="grid">'+ps.map(card).join("")+'</div>';
 });
 el.innerHTML=h;
 if(rest.length){function mais(){rest.slice(shown,shown+PER).forEach(function(p){$("#g").insertAdjacentHTML("beforeend",card(p))});shown+=PER;if(shown>=rest.length)$("#m").style.display="none"}$("#m").onclick=mais;mais()}
}
function share(){
 var el=$("#share");if(!el)return;
 var u=encodeURIComponent(location.href),t=encodeURIComponent(document.title);
 el.innerHTML='<a class="w" target="_blank" rel="noopener" href="https://wa.me/?text='+t+'%20'+u+'">WhatsApp</a><a class="f" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u='+u+'">Facebook</a><a class="x" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url='+u+'&text='+t+'">X</a><button id="cp">Copiar link</button>';
 $("#cp").onclick=function(){navigator.clipboard&&navigator.clipboard.writeText(location.href);this.textContent="Link copiado!"};
}
function relacionadas(posts,slug,cat){
 var el=$("#relacionadas");if(!el)return;
 var o=posts.filter(function(p){return p.slug!==slug});
 var mesma=o.filter(function(p){return p.category===cat});
 var outras=o.filter(function(p){return p.category!==cat});
 var arr=mesma.concat(outras).slice(0,4);
 el.innerHTML=arr.length?'<div class="rel"><h3 class="sec-t">Leia também</h3>'+arr.map(card).join("")+'</div>':'';
}
montarTopo();
fetch(B+"posts.json",{cache:"no-cache"}).then(function(r){return r.json()}).catch(function(){return[]}).then(function(posts){
 posts.sort(function(a,b){return new Date(b.date)-new Date(a.date)});
 var cats=categorias(posts),slug=document.body.dataset.slug,cat=params.get("cat"),q=params.get("q");
 montarMenu(cats,slug?slugify(document.body.dataset.cat||""):cat);montarRodape(cats);
 if(slug){share();relacionadas(posts,slug,document.body.dataset.cat);return}
 if(q){var t=q.toLowerCase();lista("Resultados para “"+q+"”",posts.filter(function(p){return(p.title+" "+p.summary+" "+p.category).toLowerCase().indexOf(t)>-1}));return}
 if(cat){var c=cats.filter(function(x){return x.slug===cat})[0];lista(c?c.nome:"Categoria",posts.filter(function(p){return slugify(p.category)===cat}));return}
 home(posts,cats);
});
})();
