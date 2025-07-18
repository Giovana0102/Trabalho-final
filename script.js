const carrinho = [];

function adicionarPedido(item) {
  carrinho.push(item);
  alert(`${item} adicionado à sacola!`);
  atualizarLinkZap();
}

function atualizarLinkZap() {
  const texto = encodeURIComponent(`Olá! Gostaria de pedir:\n- ${carrinho.join('\n- ')}`);
  const link = `https://wa.me/5599999999999?text=${texto}`;
  document.getElementById("linkZap").href = link;
}
