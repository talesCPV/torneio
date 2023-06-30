/* GLOBAL */ 

    var mainData

/*  STRING  */
String.prototype.getHash = function(S){
    let weigth = 0
    let hash = ''
    let str = this.valueOf()

    function getRange(N){ // keeps caracters under ASCII 33 & 126
        while (N > 126 || N < 33){
            N -= 126
            N < 33 ? N += 33 : N
            N == 127 ? N++ : 0
        }
        return N
    }

    for (i = 0; i < str.length; i++) {
        weigth += str.charCodeAt(i) * 5
    }

    while(str.length < S){
        str += String.fromCharCode(str.length + 33)
    }

    for (i = 0; i < str.length; i++) {
        chr = getRange(weigth * str.charCodeAt(i))
        chr = chr===92 ? 168 : chr;
        chr = chr===34 ? 173 : chr;
        hash += String.fromCharCode(chr)  
    }

    return hash;
}

String.prototype.showDate = function(){
    const str = this.valueOf()
    return str.substr(8,2).padStart(2,0)+'/'+str.substr(5,2).padStart(2,0)+'/'+str.substr(0,4)
}

String.prototype.showTime = function(){
    const str = this.valueOf()
    return str.substr(11,5)
}



/* TABLE */
HTMLTableElement.prototype.plot = function(obj, fields,type='',file=false, mark=false , green=false){

    fields = fields.split(',')
    type = type=='' ? '' : type.split(',')
    const tr = document.createElement('tr')
    if(file && obj.path != null){
        tr.classList = 'path'
    }
    for(let i=0; i<fields.length; i++){
        const td = document.createElement('td')
        const arr = fields[i].split('|')
        if(arr.length > 1){
            td.classList = arr[1]
        }
        let html, op
    
        if(type.length > 0 && i<type.length){
            switch (type[i].substring(0,3)) {
                case 'int':
                  html = parseInt(obj[arr[0]])
                  break;
                case 'per':
                    html = parseFloat(obj[arr[0]]).toFixed(2) + '%'
                    break;                  
                case 'sta':
                    
                    html = ''
                    for(let j=0; j<parseInt(obj[arr[0]]); j++){
                        html += '<span class="fa fa-star checked"></span>'
                    }
                    break;
                case 'flo':
                    html = obj[arr[0]] != null ? parseFloat(obj[arr[0]]).toFixed(2) : ''
                    break;
                case 'Upp':
                    html = obj[arr[0]] != null ? obj[arr[0]].toUpperCase().trim() : ''
                    break
                case 'str':
                    html = obj[arr[0]] != null ? obj[arr[0]].trim() : ''
                  break;
                case 'dat':
                    if(obj[arr[0]].substring(8,10) == '00'){
                        html = 'A Marcar'
                    }else{
                        html = obj[arr[0]] != null ? obj[arr[0]].substring(8,10)+'/'+ obj[arr[0]].substring(5,7)+'/'+obj[arr[0]].substring(0,4) : ''
                    }
                    break                 
                case 'Low':
                    html = obj[arr[0]] != null ? obj[arr[0]].toLowerCase().trim() : ''
                    break;
                case 'R$.':
                    if(parseFloat(obj[arr[0]]).toFixed(2) >=0 ){
                        html = obj[arr[0]] != null ? viewMoneyBR(parseFloat(obj[arr[0]]).toFixed(2)) : ''   //'R$'+ parseFloat(obj[arr[0]]).toFixed(2)
                        green = true
                    }else{
                        html = obj[arr[0]] != null ? `(${viewMoneyBR(parseFloat(obj[arr[0]]).toFixed(2))})` : ''   //'R$'+ parseFloat(obj[arr[0]]).toFixed(2)
                        green = false
                    }
                    break;             
                case 'cha':
                    op = type[i].split(' ')
                    html = ''
                    for(let j=1; j<op.length; j++){
                        if((obj[arr[0]] == op[j].split('=')[0])||(j==op.length-1 && html=='')||obj[arr[0]] == null ){
                            html = op[j].split('=')[1] == '**' ? obj[arr[0]] : op[j].split('=')[1]
                        }
                    }
                    break;
                case 'fun':
                    op = type[i].split(' ')                    
                    html = eval(`${op[1]}(obj[arr[0]])`)
                    break;
                case 'cal':
                    op = type[i].split(' ')                   
                    html = eval(op[1])
                    break;
                case 'con':
                    op =   arr[0].split('#')
                    const campo = op[0].split(' ')
                    html = ''
                    for(let j=0; j< campo.length; j++){
                        html +=  obj[campo[j]] 
                        html += j<campo.length-1 ? op[1] : ''
                    }
                    break; 
                case 'ckb':                            
                    html = `<input type="checkbox" id="tblCkb_${this.rows.length-1}" class="tbl-ckb" ${parseInt(obj[arr[0]])? '' : 'checked'}>`
                    break;  
                case 'let':                            
                    html = arr[0]
                    break;                                       
                default:
                  html = obj[arr[0]] != null ? obj[arr[0]] :''
            }            
        }else{
            html = obj[fields[i].split('|')[0]]
        }
        td.innerHTML = html
        tr.appendChild(td)
    }
    tr.data = obj
    if(mark){
        tr.style.background = green ? 'rgb(99, 201, 99)' : 'rgb(201, 99, 99)'
        tr.style.color = green ? 'rgb(0,0,0)' : 'rgb(255,255,255)'
    }
    this.appendChild(tr)
}

HTMLTableElement.prototype.head = function(hd){
    this.innerHTML = ''
    hd = hd.split(',')
    const tr = document.createElement('tr')
    for(let i=0; i<hd.length; i++){
        const th = document.createElement('th')
        const arr = hd[i].split('|')
        if(arr.length > 1){
            th.classList = arr[1]
        }
        if(arr[0] == 'ckb-all'){
            const all = document.createElement('input')
            all.type = 'checkbox'
            all.addEventListener('click',(e)=>{
                var nodes = Array.prototype.slice.call(e.target.parentNode.parentNode.children);
                const index = nodes.indexOf(e.target.parentNode)

                for(let i=1; i<this.rows.length; i++){
                    try{
                        this.rows[i].cells[index].children[index].checked = all.checked
                    }catch{
                        console.error('Erro controlado, vai ficar assim mesmo!');
                    }
                }
            })
            th.appendChild(all)

        }else{
            th.innerHTML = arr[0]
        }
        tr.appendChild(th)
    }
    this.appendChild(tr)
}

var modal = document.getElementById("myModal");

async function openHTML(template=""){
    
  if(template.trim() != ""){
      return await new Promise((resolve,reject) =>{
          fetch( "templates/"+template)
          .then( stream => stream.text())
          .then( text => {
              const temp = document.createElement('div');
              temp.innerHTML = text;
              
              document.querySelector('#md-header').innerHTML = temp.getElementsByTagName('title')[0].innerHTML
              document.querySelector('#md-body').innerHTML = temp.getElementsByTagName('template')[0].innerHTML
              eval(temp.getElementsByTagName('script')[0].innerHTML);                                  
              document.getElementById("myModal").style.display = "block";                  
          }); 
      }); 
  }
}

document.querySelector('.close').addEventListener('click',()=>{
    document.getElementById("myModal").style.display = "none"; 
})

//const m = document.querySelectorAll('.menu-items li')
for(let i=0; i<document.querySelectorAll('.menu-items li').length; i++){

    document.querySelectorAll('.menu-items li')[i].addEventListener('click',()=>{
        document.querySelector('#ckbHamb').checked = false
    })

    
}


/*  DATABASE  */
function queryDB(params,cod){
    const data = new URLSearchParams();        
        data.append("cod", cod);
        data.append("params", JSON.stringify(params));
        data.append("storage", localStorage.getItem("storage"));

    const myRequest = new Request("backend/query_db.php",{
        method : "POST",
        body : data
    });

    return new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                resolve(response.text());                    
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    });      
}

function checkLogin(){
    let out = false
    if(localStorage.getItem('idUser') == null){
        document.querySelector('#log-inout').innerHTML = 'login'
        document.querySelector('#usr').innerHTML = ''

    }else{
        document.querySelector('#log-inout').innerHTML = 'logout'
        document.querySelector('#usr').innerHTML = localStorage.getItem('atleta')
        out = true
    }

    return out
}
/*
function fillTabAtleta(tbl){

    const params = new Object;
        params.nome = ''
    const myPromisse = queryDB(params,5);
    myPromisse.then((resolve)=>{
        const json = JSON.parse(resolve)        
        tbl.head('Nome,Nível')    
        for(let i=0; i<json.length; i++){
            tbl.plot(json[i],'nome,nivel','Upp,sta') 
        }

    })

}
*/

function fillTabAtleta(tbl){

    const params = new Object;
        params.nome = ''
    const myPromisse = queryDB(params,18);
    myPromisse.then((resolve)=>{
        const json = JSON.parse(resolve)     
        tbl.head('Nome,Nivel,%')    
        for(let i=0; i<json.length; i++){
            tbl.plot(json[i],'nome,STARS,RANKING','Upp,sta,per') 
        }

    })

}

function fillTabGrupo(tbl,grupo){

    const params = new Object;
        params.grupo = grupo
    const myPromisse = queryDB(params,10);
    myPromisse.then((resolve)=>{
        const json = JSON.parse(resolve)  
        tbl.head('Pos,Nome, J, V, D, S+, S-, SS, G+|hide, G-|hide, SG|hide')    
        for(let i=0; i<json.length; i++){
            tbl.plot(json[i],`${i+1},nome,JOGOS,VITORIA,DERROTA,S_PRO,S_CONTRA,${json[i].S_PRO - json[i].S_CONTRA},G_PRO|hide,G_CONTRA|hide,${json[i].G_PRO - json[i].G_CONTRA}|hide`,'let,Upp,int,int,int,int,int,let,int,int,let') 
        }

    })

}

function fillTabJogos(tbl,grupo){

    const params = new Object;
        params.grupo = grupo
    const myPromisse = queryDB(params,11);
    myPromisse.then((resolve)=>{
        const json = JSON.parse(resolve) 
        if(json.length > 0){
            tbl.head('Data, Jogador A, |min,X|min, |min,Jogador B,','Upp,Upp,str,let,str,Upp')    
            for(let i=0; i<json.length; i++){
                tbl.plot(json[i],'dia,jogador_A,PLACAR_A|min,X|min,PLACAR_B|min,jogador_B','dat,Upp,int,let,int,Upp') 
            }    
        }

    })

}


function fillCmbAtleta(cmb,sql,txt=''){

    const params = new Object;
        params.nome = ''
    const myPromisse = queryDB(params,sql);
    myPromisse.then((resolve)=>{
        if(txt.trim()!=''){
            const opt = document.createElement('option')
            opt.value = 0 
            opt.innerHTML = txt
            cmb.appendChild(opt)
        }

        const json = JSON.parse(resolve)   
        for(let i=0; i<json.length; i++){
            const opt = document.createElement('option')
            opt.value = json[i].id 
            opt.innerHTML = json[i].nome.toUpperCase()
            cmb.appendChild(opt)
        }

    })

}

function valInt(edt){
    edt.value = getNum(edt.value)
}

function getNum(V){
    const ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    let out = ''
    for(let i=0; i< V.length; i++){
        if(ok_chr.includes(V[i])){
            out+=V[i]
        }
    }
    return out
}