document.addEventListener('DOMContentLoaded', function() {

    var navToggle = document.querySelector('.nav__toggle');
    var navLinks = document.querySelector('.nav__links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('nav__links--open');
        });
    }

    var nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', function() {
            nav.classList.toggle('nav--scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.card, .step, .stat, .testimonial, .feature-workflow__step').forEach(function(el) {
            el.classList.add('animate-in');
            observer.observe(el);
        });
    }

    document.querySelectorAll('.faq__question').forEach(function(question) {
        question.addEventListener('click', function() {
            var answer = this.nextElementSibling;
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            answer.hidden = expanded;
        });
    });

});
