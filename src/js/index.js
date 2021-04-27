import '../scss/main.scss';
import 'intersection-observer';
import $ from 'jquery';
import 'jquery-ui'
import 'jquery-ui/ui/effect'
import 'bootstrap';
import 'popper.js';
import Swiper from 'swiper/dist/js/swiper.min';
import noUiSlider from 'nouislider';

$(window).on('load', function () {
    let b = $('body');

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        b.addClass('ios');
    } else {
        b.addClass('web');
    }

    b.removeClass('loaded');
});

$(function () {
    // Burger button
    $('.burger-btn').on('click', function (e) {
        e.stopPropagation();
        $('body').toggleClass('open-menu');
        $('.burger-btn').toggleClass('active');
        $('#main_nav').toggleClass('active');
    });

    // document click
    $('#main_nav').on('click', function (e) {
        e.stopPropagation();
    });
    $(document).on('click', function (e) {
        $('body').removeClass('open-menu');
        $('.burger-btn').removeClass('active');
        $('#main_nav').removeClass('active');
    });


    // map reviews
    function mapReviews() {
        let message = $('.reviews__box');
        let dot = $('.reviews__dotted');

        dot.on('click', function (e) {
            let msgText = message.find('.reviews__text');
            let authorPic = message.find('.reviews__author-photo img');
            let authorName = message.find('.reviews__author-name');
            let authorText = message.find('.reviews__author-text');

            let data = {
                'msg': $(this).data('text'),
                'img': $(this).data('img'),
                'name': $(this).data('author-name'),
                'text': $(this).data('author-text')
            }

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                message.toggleClass('active');
            }
            else {
                dot.removeClass('active');
                $(this).toggleClass('active');
                message.addClass('active');
            }

            msgText.text(data.msg);
            authorPic.attr('src', data.img);
            authorName.text(data.name);
            authorText.text(data.text);
        });

        dot.each(function (i, elem) {
            $(elem).animate({
                top: elem.dataset.y + '%',
                left: elem.dataset.x + '%',
            }, 1500, function () {
                dot.removeClass('hide');
            });
        });
    }

    mapReviews();


    // Swiper slider
    if ($('.swiper-container').length) {
        let slider,
            slide = document.querySelectorAll('.swiper-container .swiper-slide').length;

        if (slide > 1) {
            slider = new Swiper('.swiper-container', {
                observer: true,
                observeParents: true,
                loop: true,
                autoplay: true,
                spaceBetween: 25,
                slidesPerView: 1,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                /*pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },*/
                /*scrollbar: {
                    el: '.swiper-scrollbar',
                },*/
                dynamicBullets: true,
            });
        }
    }

    // Range slide
    if ($('input[type="range"]')) {
        let sliderRange = document.querySelectorAll('.slider-range');
        let sliderHandles = document.querySelectorAll('.slider-handles');

        if (sliderRange.length) {
            sliderRange.forEach(function (elem) {
                let input = elem.childNodes[0];
                let startValue = input.hasAttribute('value') ? Number(input.getAttribute('value')) : 1;
                let minValue = input.hasAttribute('min') ? Number(input.getAttribute('min')) : 1;
                let maxValue = input.hasAttribute('max') ? Number(input.getAttribute('max')) : 100;

                input.remove();

                noUiSlider.create(elem, {
                    start: [startValue],
                    step: 1,
                    behavior: 'tap',
                    connect: [true, false],
                    range: {
                        'min': [minValue],
                        'max': [maxValue]
                    }
                });
            });
        }

        if (sliderHandles.length) {
            sliderHandles.forEach(function (elem) {
                let input = elem.childNodes[0];
                let minValue = input.hasAttribute('min') ? Number(input.getAttribute('min')) : 1;
                let maxValue = input.hasAttribute('max') ? Number(input.getAttribute('max')) : 100;

                input.remove();

                noUiSlider.create(elem, {
                    start: [minValue, maxValue/2],
                    step: 1,
                    behavior: 'tap-drag',
                    connect: true,
                    range: {
                        'min': minValue,
                        'max': maxValue
                    }
                });
            });
        }
    }

    // Lazy load counters
    const counters = document.querySelectorAll('.statistic__counter');
    let countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting === true && entry.target.hasAttribute('data-count')) {
                let current = entry.target;
                animationNum(current, 3000);
                current.removeAttribute('data-count');
            }
        });
    });
    if (counters.length > 0) {
        counters.forEach(function (counter) {
            countObserver.observe(counter)
        });
    }

    // Lazy load observer
    const imagesAll = document.querySelectorAll('img[data-src]');
    let imgObserve = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.intersectionRatio >= 0 && entry.target.hasAttribute('data-src')) {
                let current = entry.target;
                let source = current.getAttribute('data-src');

                current.setAttribute('src', source);
                current.removeAttribute('data-src');
            }
        });
    });
    if (imagesAll.length > 0) {
        imagesAll.forEach(function (image) {
            imgObserve.observe(image);
        });
    }
});

function animationNum(elem, time) {
    let num = Number(elem.dataset.count);
    let step = 1;
    let n = 0;
    let t = Math.round(time / (num / step));

    if (num > 0) {
        let interval = setInterval(function () {
            n += step;
            if (n === num) {
                clearInterval(interval);
            }
            elem.innerHTML = n;
        }, t);
    }
    else {
        elem.innerHTML = n;
    }
}