function(){

    const COST = { wood:22960, stone:24600, iron:20500 };
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
    
    // ===== MAIN =====
    let r = getResources();
    let merchants = getMerchants();
    
    if(!merchants){
      alert("❌ Sem mercantes livres");
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
    
    // ===== INFO =====
    alert(
      "✅ Mercantes usados: " + merchants + "\n\n" +
      "Enviado:\n" +
      "Madeira: " + send.wood + "\n" +
      "Argila: " + send.stone + "\n" +
      "Ferro: " + send.iron + "\n" + "\n" +
      "ScriptBy: Nowlights"
    );
    
    }