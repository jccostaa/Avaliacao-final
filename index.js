
const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
});

let pagina = 1;
let totalPaginas = 1;

function personagensInicio() {
    api.get('/character')
      .then((res) => {
        const personagens = res.data.results;
        mostraPersonagem([personagens]);
    })
      .catch((err) => {
        console.log(err);
    });
}
  personagensInicio();

function mostraPersonagem() {
    
    const searchInput = document.getElementById('searchInput').value;
    api.get(`/character?name=${searchInput}&page=${pagina}`)
      .then((res) => {
        const personagens = res.data.results;
        totalPaginas = res.data.info.pages;
        mostrarCards(personagens);
        mostrarInformacoes();
      })
      .catch((err) => {
        alert("Nome não encontrado")
        console.log(err);
      });
  }

function mostrarInformacoes() {
    const personagensInfo = document.getElementById('personagensInfo');
    personagensInfo.textContent = `Página ${pagina} de ${totalPaginas}`;
  }
  
function mostrarCards(personagens) {
    const containerCards = document.getElementById('container-cards');
    containerCards.innerHTML = '';
  
personagens.forEach((personagem) => {
    const article = document.createElement('article');
    article.className = 'card';
    const img = document.createElement('img');
    img.className = 'img-personagem';
    img.src = personagem.image;
    img.alt = personagem.name;
  
    const textoCard = document.createElement('div');
    textoCard.className = 'texto-card';
  
    const nome = document.createElement('h1');
    nome.textContent = personagem.name;
    
    const genero = document.createElement('h4');
    genero.textContent = personagem.gender;

    const status = document.createElement('h4');
    status.textContent = `${personagem.status} ${personagem.species}`;
    
    const ultimoLocal = document.createElement('p');
    ultimoLocal.textContent = `Ultimo local conhecido: ${personagem.location.name}`


    textoCard.appendChild(nome);
    textoCard.appendChild(status);
    textoCard.appendChild(genero);
    textoCard.appendChild(ultimoLocal);
  
    article.appendChild(img);
    article.appendChild(textoCard);
  
    containerCards.appendChild(article);
    });
}

function statusCor(status){
    switch (status) {
        case 'Alive':
            return 'green';
        case 'Dead':
            return 'red';
        default:
            return 'gray';
    }
}

function paginaAnterior() {
    if (pagina > 1) {
      pagina--;
      mostraPersonagem();
    }
  }
  
function proximaPagina() {
    if (pagina < totalPaginas) {
      pagina++;
      mostraPersonagem();
    }
}

function informacoes(){
    axios.all([
        api.get('/character'),
        api.get('/location'),
        api.get('/episode')
      ])
        .then(axios.spread(function (characterResponse, locationResponse, episodeResponse) {
          const characterCount = characterResponse.data.info.count;
          const locationCount = locationResponse.data.info.count;
          const episodeCount = episodeResponse.data.info.count;
    
          document.getElementById('personagensTotal').textContent = `PERSONAGENS: ${characterCount}`;
          document.getElementById('localizacoesTotal').textContent = `LOCALIZAÇÕES: ${locationCount}`;
          document.getElementById('episodiosTotal').textContent = `EPISÓDIOS: ${episodeCount}`;
        }))
        .catch(function (error) {
          console.log(error);
        });
    }
    informacoes();