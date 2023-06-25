const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api',
  });
  
  let pagina = 1;
  let totalPaginas = 1;
  
  function personagensInicio() {
    api.get('/character')
      .then((res) => {
        const personagens = res.data.results;
        mostraPersonagem();
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
    let html = '';
  
    personagens.forEach((personagem) => {
        html += `
          <button id="id-${personagem.id}" onclick="openModal(${personagem.id})" class="card p-0 mb-3 text-bg-dark" style="max-width: 540px;">
            <div class="row g-0">
              <div class="col-4">
                <img src="${personagem.image}" class="img-fluid img-personagem rounded-start" alt="Imagem do personagem">
              </div>
              <div class="col-md-8">
                <div class="card-body d-flex flex-column align-items-start">
                  <h5 class="card-title">${personagem.name}</h5>
                  <div class="d-flex align-items-center">
                    <div class="status-personagem ${statusCor(personagem.status)}"></div>
                    <p class="card-text">${personagem.status} - ${personagem.species}</p>
                  </div>
                  <p class="card-text">${personagem.gender}</p>
                  <p class="card-text"><small class="text-bg-dark">Última localização: ${personagem.location.name}</small></p>
                </div>
              </div>
            </div>
          </button>
        `;
      });
      containerCards.innerHTML = html;
    }
  
    function openModal(personagemId) {
        api.get(`/character/${personagemId}`)
          .then((res) => {
            const personagem = res.data;
            const modalContent = `
              <div class="modal-dialog">
                <div class="modal-content text-bg-dark">
                  <div class="modal-header">
                    <h5 class="modal-title">${personagem.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body d-flex justify-content-center flex-column align-items-center">
                    <img src="${personagem.image}" class="img-fluid imagem-modal" alt="Imagem do personagem">
                    <p>Status: ${personagem.status}</p>
                    <p>Espécie: ${personagem.species}</p>
                    <p>Origem: ${personagem.origin.name}
                    <p>Gênero: ${personagem.gender}</p>
                    <p>Última localização: ${personagem.location.name}</p>
                  </div>
                </div>
              </div>
            `;
            const modalElement = document.getElementById('modal-personagem');
            modalElement.innerHTML = modalContent;
            const modalInstance = new bootstrap.Modal(modalElement);
            modalInstance.show();
          })
          .catch((err) => {
            console.log(err);
          });
      }

  function statusCor(status) {
    switch (status) {
      case 'Alive':
        return 'bg-success';
      case 'Dead':
        return 'bg-danger';
      default:
        return 'bg-secondary';
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
  
  function informacoes() {
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
  