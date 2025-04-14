document.addEventListener('DOMContentLoaded', function () {
    // Initialize thumbnail swiper
    const thumbsSwiper = new Swiper('.product-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
    });

    // Initialize main swiper
    const productSwiper = new Swiper('.product-swiper', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        thumbs: {
            swiper: thumbsSwiper,
        },
        keyboard: {
            enabled: true,
        },
    });

    // Handle Read More button click
    const btnReadMore = document.querySelector('.btn-read-more');
    const descriptionContent = document.querySelector('.description-content');

    if (btnReadMore && descriptionContent) {
        btnReadMore.addEventListener('click', function () {
            descriptionContent.classList.toggle('collapsed');
            if (descriptionContent.classList.contains('collapsed')) {
                btnReadMore.innerHTML = 'Xem thêm <i class="bi bi-chevron-down"></i>';
            } else {
                btnReadMore.innerHTML = 'Thu gọn <i class="bi bi-chevron-up"></i>';
            }
        });
    }
});
