function atualizaCarrinho(){
  return JSON.parse(localStorage.getItem("carrinho")) || []; 
}

let cliques = 0;

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
    
    const texto = encodeURIComponent(`Olá! Gostaria de pedir:\n- ${carrinho.join('\n- ')}`);
    const link = `https://wa.me/5599999999999?text=${texto}`;

    cliques++;

    if (cliques > 0){ //Essa condição é necessária para evitar acumulação de addEventListener.
      link_desabilitado.removeEventListener("click", reconher_evento);
    }

    document.getElementById("linkZap").href = link;

    console.log(`este é o tamanho da lista: ${carrinho.length}, espo global`);
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
