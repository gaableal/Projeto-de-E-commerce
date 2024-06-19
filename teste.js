$(document).ready(function() {
  // Exibindo formulário de cadastro ao clicar em "Cadastrar usuário"
  $('#showSignup').on('click', function(e) {
    e.preventDefault();
    $('#loginForm').hide();
    $('#signupForm').show();
    $('#signupLink').hide();
    $('#loginLink').show();
    $('#loginModalLabel').text('Cadastro');
  });

  // Exibindo formulário de login ao clicar em "Fazer login"
  $('#showLogin').on('click', function(e) {
    e.preventDefault();
    $('#signupForm').hide();
    $('#loginForm').show();
    $('#loginLink').hide();
    $('#signupLink').show();
    $('#loginModalLabel').text('Login');
  });

  // Lógica para adicionar itens ao carrinho
  const cart = [];

  $('.add-to-cart').on('click', function(e) {
    e.preventDefault(); // Prevenir a ação padrão do botão (não rolar para o topo)
    const productId = $(this).data('product-id');
    const productTitle = $(this).closest('.card-body').find('.card-title').text();
    const productPrice = parseFloat($(this).data('product-price'));
    addToCart(productId, productTitle, productPrice);

    // Feedback visual ao adicionar item ao carrinho
    const feedbackMessage = $('<div class="alert alert-success mb-0 mt-2" role="alert">Item adicionado ao carrinho!</div>');
    $(this).parent().append(feedbackMessage); // Adiciona a mensagem abaixo do botão "Adicionar ao Carrinho"
    
    // Remover a mensagem após alguns segundos
    setTimeout(() => {
      feedbackMessage.fadeOut('slow', function() {
        $(this).remove(); // Remove a mensagem após alguns segundos
      });
    }, 3000); // Mostra a mensagem por 3 segundos
  });

  function addToCart(productId, productTitle, productPrice) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
      cart[productIndex].quantity += 1;
    } else {
      cart.push({ id: productId, title: productTitle, price: productPrice, quantity: 1 });
    }
    updateCartUI();
  }

  function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
      if (cart[productIndex].quantity > 1) {
        cart[productIndex].quantity -= 1;
      } else {
        cart.splice(productIndex, 1);
      }
      updateCartUI();
    }
  }

  function updateCartUI() {
    const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    $('.cart-text').text(`Carrinho (${cartItemCount})`);

    const cartItemsList = $('#cartItems');
    cartItemsList.empty();
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      const listItem = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${item.title} - R$ ${item.price.toFixed(2)}
          <div>
            <span class="badge badge-primary badge-pill">${item.quantity}</span>
            <button class="btn btn-sm btn-danger ml-2 remove-from-cart" data-product-id="${item.id}">&times;</button>
          </div>
        </li>`;
      cartItemsList.append(listItem);
    });

    $('#cartTotal').text(total.toFixed(2));

    // Add event listener for remove buttons
    $('.remove-from-cart').on('click', function() {
      const productId = $(this).data('product-id');
      removeFromCart(productId);
    });
  }

  $('#cartModal').on('show.bs.modal', function() {
    updateCartUI();
  });
});
