function atualizaCarrinho(){
  return JSON.parse(localStorage.getItem("carrinho")) || []; 
}

let cliques = 0;

// SISTEMA DE PEDIDOS
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

console.log(`Este é o tamanho da lista: ${atualizaCarrinho().length}, escopo global`);

function adicionarPedido(item) {
  const carrinho = atualizaCarrinho();
  carrinho.push(item);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert(`${item} adicionado à sacola!`);
}

function reconher_evento(primeiro_clique){
  primeiro_clique.preventDefault();
  const link_desabilitado = document.getElementById("linkZap");
  const carrinho = atualizaCarrinho();

  if(carrinho.length === 0){
    cliques++;
    
    if (cliques > 0){
      link_desabilitado.removeEventListener("click", reconher_evento);
      alert("Não é possível fazer o pedido se o carrinho estiver vazio.");
      console.log("Foram clicados:", cliques);
      console.log(`Este é o tamanho da lista: ${carrinho.length}, escopo global`);
      link_desabilitado.addEventListener("click", reconher_evento);
      return;
    } 
  } else {
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
    console.log(`Este é o tamanho da lista: ${pedido.items.length}, escopo global`);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const link_desabilitado = document.getElementById("linkZap");
  link_desabilitado.addEventListener("click", reconher_evento);
});

// API PEXELS - USANDO FETCH (SEM CORS)

async function imagensFastFood() {
  console.log("Iniciando carregamento de imagens...");
  
  try {
    // Fazer requisição para a API do Pexels
    const response = await fetch('https://api.pexels.com/v1/search?query=hamburger&per_page=8', {
      method: 'GET',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log("Status da resposta:", response.status);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Dados recebidos:", data);

    // Verificar se o elemento galeria existe
    const galeria = document.getElementById("galeria");
    if (!galeria) {
      console.error("Elemento #galeria não encontrado no DOM!");
      return;
    }

    // Limpar galeria antes de adicionar novas imagens
    galeria.innerHTML = '';

    // Verificar se existem fotos nos dados
    if (!data.photos || data.photos.length === 0) {
      console.log("Nenhuma foto encontrada nos resultados");
      galeria.innerHTML = '<p>Nenhuma imagem encontrada</p>';
      return;
    }

    // Adicionar cada imagem à galeria
    data.photos.forEach((photo, index) => {
      console.log(`Adicionando imagem ${index + 1}:`, photo.src.medium);
      
      const img = document.createElement("img");
      img.src = photo.src.medium;
      img.alt = `Foto de comida por ${photo.photographer}`;
      img.title = `Foto por ${photo.photographer}`;
      
      // Adicionar evento de erro para debug
      img.onerror = function() {
        console.error(`Erro ao carregar imagem: ${this.src}`);
      };
      
      // Adicionar evento de sucesso para debug
      img.onload = function() {
        console.log(`Imagem carregada com sucesso: ${this.src}`);
      };
      
      galeria.appendChild(img);
    });

    console.log(`${data.photos.length} imagens adicionadas à galeria`);

  } catch (error) {
    console.error("Erro detalhado ao carregar imagens:", error);
    
    // Mostrar erro na galeria
    const galeria = document.getElementById("galeria");
    if (galeria) {
      galeria.innerHTML = `
        <div style="color: #ff4081; padding: 20px;">
          <p>❌ Erro ao carregar imagens da galeria</p>
          <p><small>Detalhes: ${error.message}</small></p>
        </div>
      `;
    }
  }
}

async function imagensBebidasComuns(){
  
  console.log("Iniciando carregamento de imagens...");
  
  try {
    // Fazer requisição para a API do Pexels
    const response = await fetch('https://api.pexels.com/v1/search?query=soda&per_page=8', {
      method: 'GET',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log("Status da resposta:", response.status);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Dados recebidos:", data);

    // Verificar se o elemento galeria existe
    const galeria = document.getElementById("galeria2");
    if (!galeria) {
      console.error("Elemento #galeria não encontrado no DOM!");
      return;
    }

    // Limpar galeria antes de adicionar novas imagens
    galeria.innerHTML = '';

    // Verificar se existem fotos nos dados
    if (!data.photos || data.photos.length === 0) {
      console.log("Nenhuma foto encontrada nos resultados");
      galeria.innerHTML = '<p>Nenhuma imagem encontrada</p>';
      return;
    }

    // Adicionar cada imagem à galeria
    data.photos.forEach((photo, index) => {
      console.log(`Adicionando imagem ${index + 1}:`, photo.src.medium);
      
      const img = document.createElement("img");
      img.src = photo.src.medium;
      img.alt = `Foto de comida por ${photo.photographer}`;
      img.title = `Foto por ${photo.photographer}`;
      
      // Adicionar evento de erro para debug
      img.onerror = function() {
        console.error(`Erro ao carregar imagem: ${this.src}`);
      };
      
      // Adicionar evento de sucesso para debug
      img.onload = function() {
        console.log(`Imagem carregada com sucesso: ${this.src}`);
      };
      
      galeria.appendChild(img);
    });

    console.log(`${data.photos.length} imagens adicionadas à galeria`);

  } catch (error) {
    console.error("Erro detalhado ao carregar imagens:", error);
    
    // Mostrar erro na galeria
    const galeria = document.getElementById("galeria2");
    if (galeria) {
      galeria.innerHTML = `
        <div style="color: #ff4081; padding: 20px;">
          <p>❌ Erro ao carregar imagens da galeria</p>
          <p><small>Detalhes: ${error.message}</small></p>
        </div>
      `;
    }
  }
}

// INICIALIZAÇÃO

// Aguardar DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM carregado, iniciando aplicação...");
  
  // Aguardar um pouco antes de carregar imagens
  setTimeout(() => {
    imagensFastFood();
    imagensBebidasComuns();
  }, 1000);
  
  // Configurar busca se existir
  const busca = document.getElementById('busca');
  if (busca) {
    busca.addEventListener('input', function() {
      const termo = this.value.toLowerCase();
      const cards = document.querySelectorAll('.card');
      
      cards.forEach(card => {
        const nome = card.querySelector('h3');
        if (nome && nome.textContent.toLowerCase().includes(termo)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});
