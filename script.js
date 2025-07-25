function atualizaCarrinho(){
  return JSON.parse(localStorage.getItem("carrinho")) || []; 
}

let cliques = 0;

// === ACRESCENTAR ===
const BATCH_SIZE = 8;

function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}
function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}
function getLastOrderNumber() {
  return parseInt(localStorage.getItem("lastOrderNumber") || "0", 10);
}
function setLastOrderNumber(n) {
  localStorage.setItem("lastOrderNumber", String(n));
}
function getBatchInfo(orderNumber) {
  const batch = Math.ceil(orderNumber / BATCH_SIZE);
  const rangeStart = (batch - 1) * BATCH_SIZE + 1;
  const rangeEnd = rangeStart + BATCH_SIZE - 1;
  return { batch, rangeStart, rangeEnd };
}
function createOrder(items) {
  const next = getLastOrderNumber() + 1;
  setLastOrderNumber(next);

  const { batch, rangeStart, rangeEnd } = getBatchInfo(next);

  const order = {
    id: next,
    items: [...items],
    batch,
    rangeStart,
    rangeEnd,
    createdAt: Date.now()
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  console.log(`Pedido #${order.id} criado. Lote ${order.batch} (${rangeStart}-${rangeEnd}).`);
  return order;
}


console.log(`este é o tamanho da lista: ${atualizaCarrinho().length}, escopo global`);

function adicionarPedido(item) {
  const carrinho = atualizaCarrinho(); //Esta linha garante que a versão do carrinho seja a mesma em qualquer situação (mudanças de página e problemas de sincronia).
  carrinho.push(item);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  alert(`${item} adicionado à sacola!`);

}

function reconher_evento(primeiro_clique){ //Primeiro clique conserta o erro de não haver nada na primeira interação com o botão com este texto: "Finalizar pedido via Whatsapp".
  primeiro_clique.preventDefault();
  const link_desabilitado = document.getElementById("linkZap"); //Criei uma função para verificar se o redirecionamento será desabilitado ou não.  
  const carrinho = atualizaCarrinho(); //Neste caso ele atribui uma lista para o carrinho através de uma função.

  if(carrinho.length === 0){
    cliques++;
    
    if (cliques > 0){
      link_desabilitado.removeEventListener("click", reconher_evento);

      alert("Não é possível fazer o pedido se o carrinho estiver vazio.");

      console.log("Foram clicados:", cliques);
      console.log(`este é o tamanho da lista: ${carrinho.length}, espo global`);
      
      link_desabilitado.addEventListener("click", reconher_evento); //Para toda vez o botão é clicado neste trecho de código, ele é removido e adicionado de maneira consistente, evitando acumulação. O addEventListener(...) e o removeEventListener(...), são os responsáveis por isso.
      return; //Este return finaliza esta função (a qual está aninhado) imediatamente aqui nesta linha. 
    } 
  }

  else{
  link_desabilitado.setAttribute("target", "_blank");

  // === NOVO: cria pedido numerado + lote ===
  const pedido = createOrder(carrinho);
  alert(`Seu pedido é o #${pedido.id} (lote ${pedido.batch}: ${pedido.rangeStart}-${pedido.rangeEnd}).`);

  // (opcional) limpar carrinho após finalizar
  localStorage.removeItem("carrinho");

  const texto = encodeURIComponent(
    `Olá! Gostaria de pedir:\nPedido #${pedido.id}\n- ${pedido.items.join('\n- ')}`
  );
  const link = `https://wa.me/5599999999999?text=${texto}`;

  cliques++;

  if (cliques > 0){
    link_desabilitado.removeEventListener("click", reconher_evento);
  }

  document.getElementById("linkZap").href = link;

  console.log(`este é o tamanho da lista: ${pedido.items.length}, escopo global`);
}

}

document.addEventListener("DOMContentLoaded", function () {
  const link_desabilitado = document.getElementById("linkZap"); //Criei uma função para verificar se o redirecionamento será desabilitado ou não.  
  link_desabilitado.addEventListener("click", reconher_evento);
});

function animacaoDecorativa(){
 // body.addbackground("Imagens/varios_lanches_na_diagonal.gif");
}

//animacaoDecorativa();


