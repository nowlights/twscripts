function set_coin(){

    
     // verificacao de redirecionamento
    const urlParams = new URLSearchParams(window.location.search);
    let redirectToMarket = false;
    if(urlParams.get('screen') !== 'market'){
        redirectToMarket = true;
    } else {
        if(urlParams.get('mode') !== 'send'){
            redirectToMarket = true;
        }
    }
    if(redirectToMarket){
        // example: village=000&screen=market&mode=send
        
        const villageId = urlParams.get('village') ? `?village=${urlParams.get('village')}` : '';
        window.location.href = window.location.pathname + `${villageId}&screen=market&mode=send`;
        UI.SuccessMessage("redirecionando....", 3000);
        return; // para a execução para clicarem novamente.
    }

    // ===== CONFIGURAÇÃO / PERSISTÊNCIA =====
    function getStorage(){
        // Tenta carregar os dados salvos anteriormente
        let targetCoords = localStorage.getItem('tw_scvn_target');
        let costWood = localStorage.getItem('tw_scvn_wood');
        let costStone = localStorage.getItem('tw_scvn_stone');
        let costIron = localStorage.getItem('tw_scvn_iron');
        let costs = {
            "wood": costWood,
            "stone": costStone,
            "iron": costIron,
            "target": targetCoords 
        };
        return costs;
    }
    function setStorage(nameField, value){
        localStorage.setItem('tw_scvn_' + nameField, value);
    }
    function getFields(){
        var storage = getStorage();
        let fields = {
            wood: {
                text: "Cost Wood",
                value: storage["wood"],
                name: "fwood"
            },
            stone: {
                text: "Cost Stone",
                value: storage["stone"],
                name: "fstone"
            },
            iron: {
                text: "Cost Iron",
                value: storage["iron"],
                name: "firon"
            },
            target: {
                text: "Village Target",
                value: storage["target"],
                name: "ftarget"
            }
        }
        return fields;
    }
    const fields = getFields();


// verifica se o menu ja foi executado
if(!document.getElementById('send_coin_village')){
    drawMenu();
}

    function drawMenu(){
     
       

        // 1. Encontra a tabela de referência existente na página (header_info)
        const tabelaReferencia = document.getElementById('header_info');

if (tabelaReferencia) {
    // 2. Cria a nova tabela com as classes e estilos solicitados
    const novaTabela = document.createElement('table');
    novaTabela.className = 'header-border';
    novaTabela.id = 'send_coin_village';
    novaTabela.style.setProperty('width', '100%', 'important');
    novaTabela.style.marginTop = '5px'; // Espaço para não colar na tabela de cima
    novaTabela.style.marginBottom = '10px';

    // Cria o corpo da tabela (tbody) e a linha única (tr)
    const tbody = document.createElement('tbody');
    const linha = document.createElement('tr');

    // 3. Sequência dos campos
    

    // 4. Cria as células (td) para cada input
    Object.keys(fields).forEach(chave => {
    
        let nomeCampo = chave;
        const dadosChave = fields[chave];

        const celula = document.createElement('td');
        celula.style.padding = '0px';
        celula.style.verticalAlign = 'middle';

        // Cria o texto da Label (ex: "Cost Wood: ")
        let labelTexto = document.createTextNode(dadosChave.text);
        
        // Cria o Input
        const input = document.createElement('input');
        input.type = 'text';
        input.id = dadosChave.name;
        input.style.padding = '3px';
        input.style.width = '80px'; // Ajuste de tamanho para caber bem na tabela
        input.value = dadosChave.value;

        // Coloca o texto e o input dentro da célula (td)
        celula.appendChild(labelTexto);
        celula.appendChild(input);
        
        // Adiciona a célula na linha
        linha.appendChild(celula);
    });

    // 5. Cria a célula (td) para o botão de enviar
    const celulaBotao = document.createElement('td');
    celulaBotao.style.padding = '0px';
    celulaBotao.style.verticalAlign = 'middle';

    const botao = document.createElement('button');
    botao.id = 'botao_enviar';
    botao.innerText = 'Injetar';
    botao.style.padding = '0px 0px';

    // Lógica para salvar no localStorage ao clicar
    botao.addEventListener('click', () => {
        Object.keys(fields).forEach(chave => {
            const dadosChave = fields[chave];
            const input = document.getElementById(dadosChave.name);
            setStorage(chave, input.value);
            dadosChave.value = input.value;
        });
        UI.SuccessMessage("Valores salvos... injetando...", 1000);
        insertValues();
    });

    // Coloca o botão na sua célula e a célula na linha
    celulaBotao.appendChild(botao);
    linha.appendChild(celulaBotao);

    // 6. creditos
    const celulaCredito = document.createElement('td');
    celulaCredito.style.padding = '0px';
    celulaCredito.style.verticalAlign = 'middle';

    const creditoText = document.createTextNode(`by: Nowlights`);


    celulaCredito.appendChild(creditoText);
    linha.appendChild(celulaCredito);


    // 7. Monta a estrutura da tabela
    tbody.appendChild(linha);
    novaTabela.appendChild(tbody);

    // 8. Insere a nova tabela exatamente após a tabela 'header_info'
    tabelaReferencia.parentNode.insertBefore(novaTabela, tabelaReferencia.nextSibling);
} else {
    console.error("A tabela com o ID 'header_info' não foi encontrada.");
}

    }


    function insertValues(){
        const COST = { 
        wood: parseInt(fields.wood.value), 
        stone: parseInt(fields.stone.value), 
        iron: parseInt(fields.iron.value) };
    const CAP = 1000;
    
    // ===== PEGAR RECURSOS =====
    function getResources(){
      function parse(el){
        return el ? parseInt(el.innerText.replace(/\./g,'')) || 0 : 0;
      }
    
      return {
        wood: parse(document.querySelector("#wood")),
        stone: parse(document.querySelector("#stone")),
        iron: parse(document.querySelector("#iron"))
      };
    }
    
    // ===== MERCANTES LIVRES =====
    function getMerchants(){
      let el = document.getElementById("market_merchant_available_count");
      if(el) return parseInt(el.innerText) || 0;
    
      let txt = document.body.innerText.match(/Comerciantes:\s*(\d+)/);
      return txt ? parseInt(txt[1]) : 0;
    }

    // ===== CORDS TAGERT ======
    function getTarget(){
        let el = document.querySelector('#target-input-field');
        return el;
    }
    
    // ===== MAIN =====
    let r = getResources();
    let merchants = getMerchants();
    let target = getTarget();
    
    if(!merchants){
        UI.ErrorMessage("❌ Sem mercantes livres!", 3000);
      return;
    }
    
    let maxTransport = merchants * CAP;
    
    // proporção base da moeda
    let totalCost = COST.wood + COST.stone + COST.iron;
    
    let ratioTransport = maxTransport / totalCost;
    
    // quanto os recursos permitem (limitador)
    let ratioResource = Math.min(
      r.wood / COST.wood,
      r.stone / COST.stone,
      r.iron / COST.iron
    );
    
    // pega o menor → respeita recurso
    let ratio = Math.min(ratioTransport, ratioResource);
    
    // calcula envio
    let send = {
      wood: Math.floor(COST.wood * ratio),
      stone: Math.floor(COST.stone * ratio),
      iron: Math.floor(COST.iron * ratio)
    };
    
    // ===== AJUSTE FINAL (encher 100% dos mercantes) =====
    let totalSend = send.wood + send.stone + send.iron;
    
    let sobra = maxTransport - totalSend;
    
    // tenta completar com o que ainda tem disponível
    if(sobra > 0){
      let extraWood = Math.min(sobra, r.wood - send.wood);
      send.wood += extraWood;
      sobra -= extraWood;
    }
    
    if(sobra > 0){
      let extraStone = Math.min(sobra, r.stone - send.stone);
      send.stone += extraStone;
      sobra -= extraStone;
    }
    
    if(sobra > 0){
      let extraIron = Math.min(sobra, r.iron - send.iron);
      send.iron += extraIron;
      sobra -= extraIron;
    }
    
    // ===== PREENCHER INPUTS =====
    document.querySelector('input[name="wood"]').value = send.wood;
    document.querySelector('input[name="stone"]').value = send.stone;
    document.querySelector('input[name="iron"]').value = send.iron;
    document.querySelector('input[name="input"]').value = fields.target.value;

    const botaoEnviar = document.querySelector('input.btn[type="submit"]');
    botaoEnviar.click();

    const checkPage = setInternal(function () {
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('try') !== 'confirmSend'){
                UI.SuccessMessage("Injetado: | Madeira: " + send.wood + " | Argila: " + send.stone + " | Ferro: " + send.iron + " | Alvo: " + fields.target.value + " | Dev. Nowlights", 5000);
                clearInterval(checkPage);
        }
    }, 500);
    }

    
    
    }