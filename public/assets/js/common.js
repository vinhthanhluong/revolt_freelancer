let scrollPos = 0;
const html = $('html');
const wrapper = $('#wrapper');

// ========== Fixed Body Toggle ==========
function addFixedBody() {
    scrollPos = $(window).scrollTop();
    const wh = window.innerHeight;
    html.css({ height: wh });
    wrapper.css({
        position: 'fixed',
        top: -scrollPos + 'px',
        left: 0,
    });
    $('body').addClass('overflow');
    $('.nav-hamburger').addClass('active');
    $('#header').addClass('active');
    $('#nav').stop().fadeIn(300);
}

function removeFixedBody() {
    html.css({ height: '' });
    wrapper.css({
        position: '',
        top: 0,
        left: 0,
    });
    $('body').removeClass('overflow').css({ top: '', height: 'auto' });
    $(window).scrollTop(scrollPos);
    $('.nav-hamburger').removeClass('active');
    $('#header').removeClass('active');

    if ($(window).width() < 768) {
        $('#nav, .nav-sub').stop().fadeOut(300);
        $('.has-sub').removeClass('active');
        $('.nav-sub__item').removeClass('active');
    } else {
        $('#nav').show();
    }
}

function toggleFixedBody() {
    if ($('body').hasClass('overflow')) {
        removeFixedBody();
    } else {
        addFixedBody();
    }
}

// ========== Fade In on Scroll ==========
function fadeInSection() {
    $('.js_inview').each(function () {
        const offset = +$(this).data('offset') || 0;
        const elementTop = $(this).offset().top;
        const elementBottom = elementTop + $(this).innerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();

        if (
            viewportBottom >= elementTop - offset &&
            viewportTop <= elementBottom - offset
        ) {
            $(this).addClass('is_show');
        }
    });
}

$(window).on('load scroll', function () {
    if ($('html').hasClass('is_loading')) {
        $('html').removeClass('is_loading');
        setTimeout(function () {
            fadeInSection();
        }, 2600);
    } else {
        fadeInSection();
    }
});
// ========== Back to Top ==========
function setupToTopButton() {
    $('#to_top').click(function () {
        $('html,body').animate({ scrollTop: 0 }, 500);
        return false;
    });
}

// ========== Navigation Menu ==========
function setupMenu() {
    // // Desktop hover submenu
    $('.has-sub').mouseenter(function () {
        if ($(this).hasClass('flag')) return false;
        $(this).find('.nav-sub').stop().fadeIn();
        $(this).addClass('is_hover');
        addFixedBody();
    });

    $('.has-sub').mouseleave(function () {
        if ($(this).hasClass('flag')) return false;
        $(this).find('.nav-sub').stop().fadeOut();
        $(this).removeClass('is_hover');
        removeFixedBody();
    });

    //Mobile click submenu toggle
    $('.has-sub').click(function (e) {
        const parent = $(this).closest('.nav-menu__item');

        if (parent.hasClass('flag')) {
            e.stopPropagation();
            e.preventDefault();

            const isActive = parent.hasClass('active');

            parent
                .siblings()
                .removeClass('active')
                .find('.nav-sub')
                .stop(true, true)
                .slideUp()

            if (isActive) {
                parent.removeClass('active');
                parent.find('.nav-sub').stop(true, true).slideUp();
            } else {
                parent.addClass('active');
                parent.find('.nav-sub').stop(true, true).slideDown();
            }
        }
    });

    // Hamburger menu toggle
    $('.nav-hamburger').click(toggleFixedBody);
}

// ========== Smooth Scroll ==========
function setupSmoothScroll() {
    $('a[href^="#"]').click(function () {
        const targetId = $(this).attr('href');
        const $target = $(targetId);
        if (!$target.length) return false;

        if ($('body').hasClass('overflow')) {
            removeFixedBody();
        }

        const offset = $('#header').innerHeight() || 0;
        $('html, body').animate(
            { scrollTop: $target.offset().top - offset },
            500
        );
        return false;
    });
}

// ========== Header Fixed Class ==========
function updateHeaderFixed() {
    if ($(window).scrollTop() > 0) {
        $('#header').addClass('fixed');
    } else {
        if (!$('.nav-hamburger').hasClass('active')) {
            $('#header').removeClass('fixed');
        }
    }
}
// ========== Responsive UI Handling ==========
function handleResponsiveUI() {
    const currentScroll = $(window).scrollTop();

    if ($(window).width() > 767) {
        // On desktop, close hamburger menu if open
        if ($('.nav-hamburger').hasClass('active')) {
            removeFixedBody();
        }
        $(window).scrollTop(currentScroll);
    } else {
        // On mobile, restore fixed state if menu is open
        if ($('.nav-hamburger').hasClass('active')) {
            $('#header').addClass('active');
            $('body')
                .addClass('overflow')
                .css({ top: -currentScroll + 'px' });
            $('#nav').show(); // Keep menu visible
        } else {
            $('#nav').removeAttr('style');
            $('#header').removeClass('active');
        }
    }
}

// ========== Toggle Back to Top Button ==========
function toggleToTopButton() {
    if ($(this).scrollTop() > 150) {
        $('#to_top').fadeIn();
    } else {
        $('#to_top').fadeOut();
    }
}

// ========== Navigation Flag Update ==========
function updateNavFlags() {
    const vw = $(window).width();
    // Add or remove 'flag' class based on screen size
    if (vw > 767) {
        $('.has-sub, .nav-sub__item').removeClass('active');
        $('.nav-sub, #nav').removeAttr('style');
        $('.has-sub, .nav-sub__item').removeClass('flag');
    } else {
        $('.has-sub, .nav-sub__item').addClass('flag');
    }
}

const addActiveMenu = function () {
    const currentPath = window.location.pathname.replace(/\/$/, '');

    $('.nav-menu__item').each(function () {
        const $item = $(this);
        let isActive = false;

        $item.find('a').each(function () {
            const href = $(this).attr('href');
            if (!href) return;

            try {
                const linkPath = new URL(href, window.location.origin).pathname.replace(/\/$/, '');
                if (linkPath !== '' && (currentPath === linkPath || currentPath.startsWith(linkPath + '/'))) {
                    isActive = true;
                    return false;
                }
            } catch (e) {
           
            }
        });

  
        if (isActive) {
            $item.addClass('current');
            $item.find('> .nav_menu__link').addClass('current');
        }
    });
}

$(document).ready(function () {
    addActiveMenu();
});

// ========== Initialization ==========
$(function () {
    setupToTopButton();
    setupMenu();
    addActiveMenu();
});

// ========== Window Events ==========
$(window).on('resize load scroll', function () {
    updateHeaderFixed();
    toggleToTopButton();
});

$(window).on('resize load', function () {
    handleResponsiveUI();
    updateNavFlags();
});
$(window).on('load', function () {
    setupSmoothScroll();
});
