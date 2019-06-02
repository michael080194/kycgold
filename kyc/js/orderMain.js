'use strict';

window.onload = menuPrepared;

let menuTemplate = `
    <p>Left Panel content here</p>
    <p><a class="panel-close" href="/accordion-layout/">Accordion Layout</a></p>
    <p><a class="panel-close" href="/action-sheet/">Action Sheet</a></p>
`;

function menuPrepared() {
    menu = document.getElementById('menu');
    menu.innerHTML = menuTemplate;
}

let orderLists = [];

$$(document).on('click', '.printBill', function () {
    let itemList = $$('.list ul li.swipeout');
    let itemCount = itemList.length
    let order = [];

    for (let i = 0; i < itemCount; i++) {
      order[i] = {
        name: itemList.eq(i).find('.item-content .item-inner > .item-title').text(),
        price: itemList.eq(i).find('.item-content .item-inner > .item-after span').text(), 
        qty: itemList.eq(i).find('.item-content .item-media > .badge').text()
      }
    }
    $.each(order, function(key,val) {             
        // alert(val.name + ":" + val.qty + ":" + val.price);   
    });    

    app.preloader.show();
    printBill(order);

});

let toastCheckout = app.toast.create({
    text: '您尚未點餐喔。',
    position: 'top',
    closeTimeout: 2000
});

$$(document).on('click', '.signature', function () {
   signature();
});

function prepareCheckout(order) {
    let items = $$('.list li.item-choose');
    let countOrder = items.length;
    for (let i = 0; i < countOrder; i++) {
        order[i] = {};
        order[i].name = items.eq(i).find('.item-title').text();
        order[i].price = parseInt(items.eq(i).find('.item-price').text());
        order[i].amount = parseInt(items.eq(i).find('.item-amount').text());
    }
}

// $$(document).on('page:afterin', '.page[data-name="menu"]', function (e) {
//     console.log('Checkout page init .');
//     setOrderList(orderLists);
// })