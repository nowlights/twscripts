function() {

   



    const H = "nowlights-header";
    const C = "chegada-custom";
    const velocidades = {
        spear: 18,
        sword: 22,
        axe: 18,
        spy: 9,
        light: 10,
        heavy: 11,
        ram: 30,
        catapult: 30,
        knight: 10,
        snob: 35
    };

    function addHeader() {
        const table = document.getElementById("village_troup_list");
        if (!table) return;
        const headerRow = table.querySelector("thead tr");
        if (!headerRow) return;
        if (document.querySelector("." + H)) return;
        const th = document.createElement("th");
        th.className = H;
        th.innerText = "NowlightsScript: TimeDurationSuport";
        th.style.fontWeight = "bold";
        th.style.fontSize = "11px";
        headerRow.appendChild(th)
    }

    function f(d) {
        const agora = new Date();
        const [h, m, s] = d.split(":").map(Number);
        const chegada = new Date(agora);
        chegada.setHours(chegada.getHours() + h);
        chegada.setMinutes(chegada.getMinutes() + m);
        chegada.setSeconds(chegada.getSeconds() + s);
        const hoje = new Date();
        const amanha = new Date();
        amanha.setDate(hoje.getDate() + 1);
        const hora = chegada.toLocaleTimeString();
        if (chegada.toDateString() === hoje.toDateString()) return "Hoje às " + hora;
        if (chegada.toDateString() === amanha.toDateString()) return "Amanhã às " + hora;
        const diff = Math.ceil((chegada - hoje) / (1000 * 60 * 60 * 24));
        return diff === 1 ? `Em 1 dia às ${hora}` : `Em ${diff} dias às ${hora}`
    }

    function getUnidadesSelecionadas() {
        return Array.from(document.querySelectorAll('.unit_checkbox:checked')).map(cb => cb.id.replace("checkbox_", ""))
    }
    addHeader();
    const selecionadas = getUnidadesSelecionadas();
    if (selecionadas.length === 0) {
        alert("Selecione pelo menos uma unidade!");
        return;
    }
    document.querySelectorAll("tr.call-village").forEach(r => {
        let maisLentaDur = null;
        let maisLentaUnit = null;
        let maiorTempo = 0;
        selecionadas.forEach(un => {
            const cell = r.querySelector(`td[data-unit="${un}"]`);
            if (!cell) return;
            const count = parseInt(cell.getAttribute("data-count") || "0");
            if (count <= 0) return;
            const dur = cell.getAttribute("data-title")?.replace("Duração: ", "");
            if (!dur) return;
            const [h, m, s] = dur.split(":").map(Number);
            const totalSegundos = h * 3600 + m * 60 + s;
            if (totalSegundos > maiorTempo) {
                maiorTempo = totalSegundos;
                maisLentaDur = dur;
                maisLentaUnit = un
            }
        });
        if (!maisLentaDur) return;
        const txt = f(maisLentaDur) + ` (sUnit: ${maisLentaUnit})`;
        let td = r.querySelector("." + C);
        if (!td) {
            td = document.createElement("td");
            td.className = C;
            td.style.color = "#FF0000";
            td.style.fontWeight = "bold";
            r.appendChild(td)
        }
        td.innerText = txt
    });
}