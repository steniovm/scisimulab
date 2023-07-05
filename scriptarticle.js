const idauthor = document.getElementById("idauthor").value;
const urlauthors = "./authors.json"
fetch(urlauthors)
  .then(response => response.json())
  .then(data => {
    data.forEach(author => {
      if (author.id == idauthor){
        showAuthor(author);
      }
    });
  })
  .catch(error => {
    console.log('Erro ao carregar o arquivo JSON:', error);
  });
function showAuthor(author){
  document.getElementById("authorname").innerHTML = author.shortname;
  document.getElementById("authorphoto").src = author.image || "../favicon.ico";
  document.getElementById("authorphoto").alt = "Foto do autor "+author.shortname;
  document.getElementById("minibio").innerHTML = author.minibio;
  document.getElementById("personalpage").href = author.personalpage || "./";
  document.getElementById("personalpage").innerHTML = author.personalpage || "./";
}