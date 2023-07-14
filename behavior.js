/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getList = async () => {
  let url = 'http://127.0.0.1:5000/cachorros';

  fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        data.cachorros.forEach(cachorro => insertList(cachorro.nome, cachorro.raca, cachorro.tutor, cachorro.idade))
          
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

/*
--------------------------------------------------------------------------------------
Chamada da função para carregamento inicial dos dados
--------------------------------------------------------------------------------------
*/
getList()

/*
--------------------------------------------------------------------------------------
Função para colocar um item na lista do servidor via requisição POST
--------------------------------------------------------------------------------------
*/

const postItem = async (inputCachorro, inputRaca, inputTutor, inputIdade) => {
const formData = new FormData();
formData.append('nome', inputCachorro);
formData.append('raca', inputRaca);
formData.append('tutor', inputTutor);
formData.append('idade', inputIdade);

let url = 'http://127.0.0.1:5000/cachorro';
fetch(url, {
  method: 'post',
  body: formData
})
  .then((response) => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });
}

/*
--------------------------------------------------------------------------------------
Função para criar um botão close para cada item da lista
--------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
--------------------------------------------------------------------------------------
Função para remover um item da lista de acordo com o click no botão close
--------------------------------------------------------------------------------------
*/
const removeElement = () => {
let close = document.getElementsByClassName("close");
// var table = document.getElementById('myTable');
let i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function () {
    let div = this.parentElement.parentElement;
    const nomeItem = div.getElementsByTagName('td')[0].innerHTML
    if (confirm("Você tem certeza que deseja remover esse cachorro?")) {
      div.remove()
      deleteItem(nomeItem)
      alert("Cachorro Removido!")
    }
  }
}
}

/*
--------------------------------------------------------------------------------------
Função para deletar um item da lista do servidor via requisição DELETE
--------------------------------------------------------------------------------------
*/
const deleteItem = (cachorro) => {
console.log(cachorro)
let url = 'http://127.0.0.1:5000/cachorro?nome=' + cachorro;
fetch(url, {
  method: 'delete'
})
  .then((response) => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });
}

/*
--------------------------------------------------------------------------------------
Função para adicionar um novo item com nome, quantidade e valor 
--------------------------------------------------------------------------------------
*/
const newItem = () => {
let inputCachorro = document.getElementById("newDog").value;
let inputRaca = document.getElementById("newRace").value;
let inputTutor = document.getElementById("newTutor").value;
let inputIdade = document.getElementById("newIdade").value;

 // Verifica se já existe um cachorro com o mesmo tutor na tabela
const tabelaCachorros = document.getElementById("myTable");
const linhas = tabelaCachorros.getElementsByTagName("tr");
for (let i = 1; i < linhas.length; i++) { // Começa do índice 1 para pular o cabeçalho da tabela
  const tutorCell = linhas[i].getElementsByTagName("td")[2];
  if (tutorCell && tutorCell.textContent === inputTutor) {
    alert("Já existe um cachorro com o mesmo tutor na tabela.");
    return;
  }
}

if (inputCachorro === '' || inputRaca === '' || inputTutor === '' || inputIdade === '' ) {
  alert("Preencha todos os campos");
}
else {
  insertList(inputCachorro, inputRaca, inputTutor, inputIdade);
postItem(inputCachorro, inputRaca, inputTutor, inputIdade);
alert("Cachorro adicionado!");
}
}

/*
--------------------------------------------------------------------------------------
Função para inserir items na lista apresentada
--------------------------------------------------------------------------------------
*/
const insertList = (nameDog, race, tutor, idade) => {
var item = [nameDog, race, tutor, formatIdade(idade)]
var table = document.getElementById('myTable');
var row = table.insertRow();

for (var i = 0; i < item.length; i++) {
  var cel = row.insertCell(i);
  cel.textContent = item[i];
}
insertButton(row.insertCell(-1))
document.getElementById("newDog").value = "";
document.getElementById("newRace").value = "";
document.getElementById("newTutor").value = "";
document.getElementById("newIdade").value = "";

removeElement()
}

/*
  --------------------------------------------------------------------------------------
  Função para formatar a idade no formato dd/mm/yyyy
  --------------------------------------------------------------------------------------
*/
const formatIdade = (idade) => {
  const date = new Date(idade);
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0'); // O mês é indexado a partir de 0
  const ano = date.getFullYear().toString();

  return `${dia}/${mes}/${ano}`;
};

/*
--------------------------------------------------------------------------------------
Função para pesquisar por nome de cachorro
--------------------------------------------------------------------------------------
*/
const searchDog = async (parent) => {
event.preventDefault();
let nomeCachorro = document.getElementById("nomeCachorro").value;

if(nomeCachorro === '') {
  alert("Digite o nome do cachorro antes de fazer a pesquisa.");
  return;
}

let url = `http://127.0.0.1:5000/cachorro?nome=` + nomeCachorro;

fetch(url, {
  method: 'get',
})
  .then((response) => response.json())
  .then((data) => {
    if (data.message) {
      alert(data.message); // Exibe mensagem caso o cachorro não seja encontrado
    } else {
      const cachorrosEncontrados = data.cachorros; // Supondo que a resposta retorne um objeto com as propriedades nome, idade e raca

      const resultadoCachorro = document.getElementById("dogbuscado");

      // Limpa o conteúdo da tabela
      resultadoCachorro.innerHTML = "";
      
      // Percorre a lista de cachorros encontrados
      cachorrosEncontrados.forEach((cachorroEncontrado) => {

      // Cria uma nova linha na tabela
      const novaLinha = document.createElement("tr");

      // Cria as células da linha com os dados do cachorro
      const nomeCachorro = document.createElement("td");
      nomeCachorro.textContent = cachorroEncontrado.nome;
      novaLinha.appendChild(nomeCachorro);

      const racaCachorro = document.createElement("td");
      racaCachorro.textContent = cachorroEncontrado.raca;
      novaLinha.appendChild(racaCachorro);

      const tutorCachorro = document.createElement("td");
      tutorCachorro.textContent = cachorroEncontrado.tutor;
      novaLinha.appendChild(tutorCachorro);

      const idadeCachorro = document.createElement("td");
      idadeCachorro.textContent = formatIdade(cachorroEncontrado.idade);
      novaLinha.appendChild(idadeCachorro);
          // Cria o botão de exclusão para apenas o cachorro buscado
          const deleteButton = document.createElement("span");
          const txt = document.createTextNode("\u00D7");
          deleteButton.className = "close";
          deleteButton.appendChild(txt);
          deleteButton.addEventListener("click", () => {
            if (confirm("Você tem certeza?")) {
              novaLinha.remove();
              deleteItem(cachorroEncontrado.nome);
              alert("Removido!");
            }
          });
          novaLinha.appendChild(deleteButton);


      // Adiciona a nova linha na tabela
      resultadoCachorro.appendChild(novaLinha);
      });  
    }   
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

/*
--------------------------------------------------------------------------------------
Função para abrir e fechar o formulário
--------------------------------------------------------------------------------------
*/

function toggleForm() {
event.preventDefault();

var section = document.querySelector('.addDog');
section.classList.toggle('hideForm');

}

/*
--------------------------------------------------------------------------------------
Função para rotacionar o botão quando abrir o formulário
--------------------------------------------------------------------------------------
*/

function toggleButton() {
var addIcon = document.querySelector('.add-icon');
var section = document.querySelector('.addDog');
addIcon.classList.toggle('add-iconRot');
section.classList.toggle('animate__fadeInDown');

}

/*
--------------------------------------------------------------------------------------
Função para pesquisar cachorro clicando na telca Enter
--------------------------------------------------------------------------------------
*/

document.addEventListener("keypress", function(e) {
if(e.key === "Enter") {
  const inputCachorro = document.querySelector("#nomeCachorro");
  const focusedElement = document.activeElement
  
  if(focusedElement === inputCachorro) {
    searchDog();
  }
}

})

/*
--------------------------------------------------------------------------------------
Atualizar a página clicando na logo
--------------------------------------------------------------------------------------
*/

function updatePage() {
  const logo = document.getElementById("logo");

  logo.addEventListener("click", () => {
    window.location.reload();
  });
}

updatePage();