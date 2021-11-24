const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

let modalQt = 1;

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


        //Adiciona as informações ao modal quando clicado, pegando o indice dele e jogando as informaçoes de acordo com o clicado.

        c('.pizzaBig img').src = pizzaJson[key].img;    
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        //Acessa o item que tenha a classe selected e remove.
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            //Deixa a opção grande sempre selecionada, pegando pelo index da mesma
            if(sizeIndex == 2){
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

function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';

    },500);
}