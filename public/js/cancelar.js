function confirma(event) {
  if(confirm("Você tem certeza que deseja cancelar o evento?")){
    return true;
  }
  else {
    event.preventDefault();
  }
}
