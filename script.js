const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);


let cart = [];
let modalQt = 1;
let ModalKey = 0;

pizzaJson.map((item, index) => { //Faz as listagens das pizzas do Json para poder ser utilizado
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    //preencher as informações em pizza item

    pizzaItem.setAttribute('data-key', index) //Prefixo determina qual o item que vai ser exibido pelo ID 
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        //closest procura o elemento mais proximo especificado
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1; //Reseta a quantidade sempre para 1
        ModalKey = key; //<<< Identificação da pizza selecionada


        //Adiciona as informações ao modal quando clicado, pegando o indice dele e jogando as informaçoes de acordo com o clicado.

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        //Acessa o item que tenha a classe selected e remove.
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            //Deixa a opção grande sempre selecionada, pegando pelo index da mesma
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt; //Valor padrao de quantidade 1.

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);


    });

    c('.pizza-area').append(pizzaItem);
});

// Eventos do MODAL


//Fechar modal

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';

    }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//Botoes de quantidade de pizza + -

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }

});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;

});



//Botoes de tamanho da pizza, tirar a seleçao do antigo e por no novo clicado


cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    });
});


c('.pizzaInfo--addButton').addEventListener('click', () => {
    //Qual a pizza? ModalKey
    //Qual o tamanho selecionado?  size
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[ModalKey].id + '@' + size; //Identificador para validar se o ID e o tamanho da pizza são iguais, se for ele soma, se o tamanho for diferente ele vai criar um novo item do carrinho
    let key = cart.findIndex((item) => item.identifier == identifier);
    if (key > -1) { //Se o index for igual ao identificador ele adiciona
        cart[key].qt += modalQt;
    } else { //Se nao ele cria um novo array no carrinho
        cart.push({
            identifier,
            id: pizzaJson[ModalKey].id,
            size,
            qt: modalQt
        });
    }


    closeModal();
    updateCart();
    //Quantas pizzas? modalQt
});

//Abre carrinho mobile

c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }

});

//Fecha menu carrinho mobile


c('.menu-closer').addEventListener('click', ()=>{
     c('aside').style.left = '100vw'
})

function updateCart() {

    c('.menu-openner span').innerHTML = cart.length;



    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id); //Resgastar informações da pizza via ID
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = c('.models .cart--item').cloneNode(true);
            //Adiciona nome e tamanho da pizza no Cart
            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; //Junta o nome da pizza com o tamanho
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1); //Remove o item do carrinho 
                }

                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });


            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    } else {
        c('aside').classList.remove('show');

        //Fecha o carrinho mobile quando a quantidade de itens esta menor que 1
        c('aside').style.left = '100vw';

    }

}