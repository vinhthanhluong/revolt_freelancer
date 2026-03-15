$(function () {
    $('.faq .faq__item--tt').on('click', function () {
        $(this).parent('.faq__item').toggleClass('active');
        $(this).next('.faq__item--dsc').slideToggle();
    });
});