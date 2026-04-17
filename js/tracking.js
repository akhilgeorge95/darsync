document.addEventListener('DOMContentLoaded', function() {

    var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    var urlParams = new URLSearchParams(window.location.search);

    utmParams.forEach(function(param) {
        var value = urlParams.get(param);
        if (value) {
            sessionStorage.setItem(param, value);
        }
    });

    if (!sessionStorage.getItem('landing_page')) {
        sessionStorage.setItem('landing_page', window.location.pathname);
    }

    if (!sessionStorage.getItem('first_visit')) {
        sessionStorage.setItem('first_visit', new Date().toISOString());
    }

    document.querySelectorAll('form').forEach(function(form) {
        utmParams.concat(['landing_page', 'first_visit']).forEach(function(param) {
            var field = form.querySelector('[name="' + param + '"]');
            if (!field) {
                field = document.createElement('input');
                field.type = 'hidden';
                field.name = param;
                form.appendChild(field);
            }
            field.value = sessionStorage.getItem(param) || '';
        });

        var refField = form.querySelector('[name="form_page"]');
        if (!refField) {
            refField = document.createElement('input');
            refField.type = 'hidden';
            refField.name = 'form_page';
            form.appendChild(refField);
        }
        refField.value = window.location.pathname;
    });

    if (window.location.pathname.indexOf('thank-you') > -1) {
        // Google Ads Conversion (replace with actual conversion ID)
        // gtag('event', 'conversion', {
        //     'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXXXXX',
        //     'value': 1.0,
        //     'currency': 'USD'
        // });

        // Google Analytics Event
        // gtag('event', 'lead_form_submission', {
        //     'event_category': 'conversion',
        //     'event_label': sessionStorage.getItem('utm_campaign') || 'direct',
        //     'value': 1
        // });

        console.log('Conversion fired', {
            source: sessionStorage.getItem('utm_source'),
            medium: sessionStorage.getItem('utm_medium'),
            campaign: sessionStorage.getItem('utm_campaign'),
            landing: sessionStorage.getItem('landing_page')
        });
    }

    document.querySelectorAll('.btn--primary, .btn--accent').forEach(function(btn) {
        btn.addEventListener('click', function() {
            // gtag('event', 'cta_click', {
            //     'event_category': 'engagement',
            //     'event_label': this.textContent.trim(),
            //     'page': window.location.pathname
            // });
        });
    });

});
