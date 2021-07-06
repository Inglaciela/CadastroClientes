const KEY_BD = '@usuariosestudo'


var listaRegistros = {
    ultimoIdGerado:0,
    usuarios:[]
}


var FILTRO = ''


function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}

function pesquisar(value){
    FILTRO = value;
    desenhar()
}

function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegistros.usuarios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test( usuario.anuncio ) || expReg.test( usuario.cliente ) || expReg.test( usuario.investimento ) || expReg.test( usuario.data1 ) || expReg.test( usuario.data2 )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( usuario => {
                return `<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.anuncio}</td>
                        <td>${usuario.cliente}</td>
                        <td>${usuario.investimento}</td>
                        <td>${usuario.data1}</td>
                        <td>${usuario.data2}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                            <button class='Deletar' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertUsuario(anuncio, cliente, investimento, data1, data2){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, anuncio, cliente, investimento, data1, data2
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function editUsuario(id, anuncio, cliente, investimento, data1, data2){
    var usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
    usuario.anuncio = Anuncio;
    usuario.cliente = Cliente;
    usuario.investimento = Investimento;
    usuario.data1 = Data1;
    usuario.data2 = Data2;
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function deleteUsuario(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteUsuario(id)
    }
}


function limparEdicao(){
    document.getElementById('anuncio').value = ''
    document.getElementById('cliente').value = ''
    document.getElementById('investimento').value = ''
    document.getElementById('data1').value = ''
    document.getElementById('data2').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('anuncio') = usuario.anuncio
                document.getElementById('cliente') = usuario.cliente
                document.getElementById('investimento') = usuario.investimento
                document.getElementById('data1') = usuario.data1
                document.getElementById('data2') = usuario.data2
            }
        }
        document.getElementById('anuncio').focus()
    }
}
        
            
    
        

function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        anuncio: document.getElementById('anuncio').value,
        cliente: document.getElementById('cliente').value,
        investimento: document.getElementById('investimento').value,
        data1: document.getElementById('data1').value,
        data2: document.getElementById('data2').value,
    }
    if(data.id){
        editUsuario(data.id, data.anuncio, data.cliente, data.investimento, data.data1, data.data2)
    }else{
        insertUsuario( data.anuncio, data.cliente, data.investimento, data.data1, data.data2 )
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})