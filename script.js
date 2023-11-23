function deleteProduct(productId) {

  fetch(`/deleteProduct/${productId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(updateProductList)  
    .catch(error => console.error('Erro ao excluir produto:', error));
}

function addProduct() {
  const NomeProduto = document.getElementById('NomeProduto').value;
  const DescricaoProduto = document.getElementById('DescricaoProduto').value;
  const ValidadeProduto = document.getElementById('ValidadeProduto').value;

  fetch('/addProduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      NomeProduto,
      DescricaoProduto,
      ValidadeProduto,
    }),
  })
    .then(response => response.json())
    .then(updateProductList)
    .catch(error => console.error('Erro ao adicionar produto:', error));
}
