// ========== SISTEMA DE CARRINHO E PEDIDOS ==========

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

    const pedido = createOrder(carrinho);
    alert(`Seu pedido é o #${pedido.id} (lote ${pedido.batch}: ${pedido.rangeStart}-${pedido.rangeEnd}).`);

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

// ========== API DE IMAGENS (SEGURA) ==========

// Função para buscar imagens via API route
async function fetchImages(query, perPage = 8) {
  try {
    console.log(`Buscando imagens para: ${query}`);
    
    // Usar sua própria API route ao invés da Pexels diretamente
    const response = await fetch(`/api/images?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dados recebidos:", data);
    
    return data;

  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    throw error;
  }
}

// Função para exibir imagens na galeria
function displayImages(photos, galleryId) {
  const galeria = document.getElementById(galleryId);
  
  if (!galeria) {
    console.error(`Elemento #${galleryId} não encontrado no DOM!`);
    return;
  }

  // Limpar galeria
  galeria.innerHTML = '';

  if (!photos || photos.length === 0) {
    galeria.innerHTML = '<p>Nenhuma imagem encontrada</p>';
    return;
  }

  // Adicionar cada imagem
  photos.forEach((photo, index) => {
    console.log(`Adicionando imagem ${index + 1}:`, photo.src.medium);
    
    const img = document.createElement("img");
    img.src = photo.src.medium;
    img.alt = `Foto por ${photo.photographer}`;
    img.title = `Foto por ${photo.photographer}`;
    img.loading = "lazy"; // Lazy loading
    
    // Eventos de debug
    img.onerror = function() {
      console.error(`Erro ao carregar imagem: ${this.src}`);
      this.style.display = 'none';
    };
    
    img.onload = function() {
      console.log(`Imagem carregada: ${this.src}`);
    };
    
    galeria.appendChild(img);
  });

  console.log(`${photos.length} imagens adicionadas à galeria ${galleryId}`);
}

// Função para mostrar erro na galeria
function displayError(galleryId, error) {
  const galeria = document.getElementById(galleryId);
  if (galeria) {
    galeria.innerHTML = `
      <div style="color: #ff4081; padding: 20px; text-align: center;">
        <p>❌ Erro ao carregar imagens</p>
        <p><small>${error.message}</small></p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px;">
          🔄 Tentar Novamente
        </button>
      </div>
    `;
  }
}

// Suas funções originais adaptadas
async function imagensFastFood() {
  console.log("Carregando imagens de fast food...");
  
  try {
    const data = await fetchImages('hamburger', 8);
    displayImages(data.photos, 'galeria');
  } catch (error) {
    console.error("Erro ao carregar fast food:", error);
    displayError('galeria', error);
  }
}

async function imagensBebidasComuns() {
  console.log("Carregando imagens de bebidas...");
  
  try {
    const data = await fetchImages('soda', 8);
    displayImages(data.photos, 'galeria2');
  } catch (error) {
    console.error("Erro ao carregar bebidas:", error);
    displayError('galeria2', error);
  }
}

// Função genérica para buscar qualquer tipo de imagem
async function buscarImagens(query, galleryId = 'galeria') {
  try {
    const data = await fetchImages(query, 8);
    displayImages(data.photos, galleryId);
  } catch (error) {
    console.error(`Erro ao buscar ${query}:`, error);
    displayError(galleryId, error);
  }
}

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM carregado, iniciando aplicação...");
  
  // Configurar evento do WhatsApp
  const link_desabilitado = document.getElementById("linkZap");
  if (link_desabilitado) {
    link_desabilitado.addEventListener("click", reconher_evento);
  }
  
  // Carregar imagens após um delay
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

  // Configurar busca de imagens dinâmica (se existir)
  const imageBusca = document.getElementById('image-search');
  if (imageBusca) {
    imageBusca.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
          buscarImagens(query, 'galeria-dinamica');
        }
      }
    });
  }
});

console.log(`Carrinho inicial: ${atualizaCarrinho().length} itens`);

/*------------------------------------------------------------------------- API PEXELS ---------------------------------------------------------------*/ 

export default async function handler(req, res) {
  // Permitir apenas GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, per_page = 8 } = req.query;
  
  // Validar parâmetros
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${per_page}`, {
      method: 'GET',
      headers: {
        'Authorization': process.env.PEXELS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Adicionar headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching images:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch images',
      details: error.message 
    });
  }
}
/*-------------------------------------------------------------------------------------------------------------*/
