'use strict';

// 新增項目
$$(document).on('click', 'li.accordion-item > .accordion-item-content .item-plus', function () {
    let amount = parseInt($$(this).next('div').text()) + 1;

    // 加上 class 以辨識
    $$(this).closest('.accordion-item').addClass('item-choose');

    // 更新總數量
    $$(this).next('div').text(amount);

    // 更新 badge
    if ($$(this).parents('.accordion-item-content').prev('a').find('.item-after').children('span').length > 0)
        $$(this).parents('.accordion-item-content').prev('a').find('.item-after').find('span').text(amount);
    else
        $$(this).parents('.accordion-item-content').prev('a').find('.item-after').append('<span class="badge color-blue">1</span>');

    // 更新餐點清單
    orderReview();
});

// 刪減項目
$$(document).on('click', 'li.accordion-item > .accordion-item-content .item-minus', function () {
    let amount = parseInt($$(this).prev('div').text()) - 1;

    // 去除辨識用的 class
    if (amount <= 0) $$(this).closest('.accordion-item').removeClass('item-choose');

    // 更新總數量
    if (amount >= 0) $$(this).prev('div').text(amount);

    // 更新 badge
    if (amount <= 0)
        $$(this).parents('.accordion-item-content').prev('a').find('.item-after').empty();
    else
        $$(this).parents('.accordion-item-content').prev('a').find('.item-after').find('span').text(amount);

    // 更新餐點清單
    orderReview();
});

// 清除全部
$$(document).on('click', '.item-clear-order', function () {
    orderReview('clear-order');
});

function orderReview(status = 'ordering') {
    let items = $$('.list li.item-choose');
    let countOrder = items.length;
    let totalPrice = 0;
    let card = $$('.card');
    card.find('.card-content').empty();

    if (countOrder > 0) {
        if (status === 'ordering') {
            for (let i = 0; i < countOrder; i++) {
                // 更新清單
                let itemName = items.eq(i).find('.item-title').text();
                card.find('.card-content').append('<span class="badge color-gray">' + itemName + '</span>');

                // 更新總金額
                let itemPrice = parseInt(items.eq(i).find('.item-price').text());
                let itemAmount = parseInt(items.eq(i).find('.item-amount').text());
                totalPrice += itemPrice * itemAmount;
            }
        } else if (status === 'clear-order') {
            for (let i = 0; i < countOrder; i++) {
                let item = items.eq(i);
                item.removeClass('item-choose');
                item.find('.item-after').empty();
                item.find('.item-amount').text(0);
            }
        }
    }

    card.find('.total-price').text(totalPrice);
}