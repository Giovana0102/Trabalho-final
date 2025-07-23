const carrinho = [];

console.log(`este é o tamanho da lista: ${carrinho.length}, escopo global`);

function adicionarPedido(item) {
  carrinho.push(item);

  alert(`${item} adicionado à sacola!`);

}

function atualizarLinkZap() {
  
  if(carrinho.length === 0){
    alert("Não é possível fazer o pedido se o carrinho estiver vazio.");
    console.log("Teste, oi, oi");
  }
  
  else{
    const texto = encodeURIComponent(`Olá! Gostaria de pedir:\n- ${carrinho.join('\n- ')}`);
    const link = `https://wa.me/5599999999999?text=${texto}`;
    document.getElementById("linkZap").href = link;
  }
  
}



function animacaoDecorativa(){
 // body.addbackground("Imagens/varios_lanches_na_diagonal.gif");
}

//animacaoDecorativa();
