import '../scss/main.scss';
import 'intersection-observer';
import $ from 'jquery';
import 'bootstrap';
import 'popper.js';
import Swiper from 'swiper/dist/js/swiper.min';
import L from 'leaflet';
import '../img/point.svg';

$(window).on('load', function () {
    let b = $('body');

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        b.addClass('ios');
    } else {
        b.addClass('web');
    }

    b.removeClass('loaded');

    //leaflet map
    if ($('#map').length) {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: '../img/point.svg',
            iconUrl: 'img/point.svg',
            iconSize: 38,
            iconAnchor: [19, 37],
            shadowUrl: null,
        });
        const map = L.map('map');
        const defaultCenter = [37.4201961,-122.1433409];
        const basemap = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            zoom: 17,
            subdomains:['mt0','mt1','mt2','mt3']
        });
        let marker = L.marker(defaultCenter).addTo(map);
        basemap.addTo(map);
        if (map) {
            map.setView(defaultCenter, 14.5).scrollWheelZoom.disable();
        }
    }

    btnToTop();
});

$(window).on('scroll', function () {
    btnToTop();
});

$(function () {
    $('#to-top').on('click', function () {
        let doc = $('html, body');

        doc.stop().animate({
            scrollTop: 0
        }, '700');
    });

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
        $('.reviews__box, .reviews__dotted').removeClass('active');
    });

    // map reviews
    function mapReviews() {
        let message = $('.reviews__box');
        let dot = $('.reviews__dotted');

        dot.on('click', function (e) {
            e.stopPropagation();
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

    // Pseudo placeholder
    if ($('form.feedback').length) {
        $('form.feedback input').on('focus', function () {
            $(this).prev().addClass('active');
        });

        $('form.feedback input').on('input change blur', function () {
            $(this).prev().addClass('active');

            if ($(this).val() !== '') {
                $(this).prev().addClass('active');
            }
            else {
                $(this).prev().removeClass('active');
            }
        });
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

function btnToTop() {
    if (window.scrollY >= 1000) {
        $('#to-top').addClass('show');
    }
    else {
        $('#to-top').removeClass('show');
    }
}

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