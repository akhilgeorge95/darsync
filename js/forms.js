document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('form[data-validate]').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            var valid = true;
            var firstInvalid = null;

            form.querySelectorAll('[required]').forEach(function(field) {
                var group = field.closest('.form-group');
                var error = group ? group.querySelector('.form-error') : null;

                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = '#ef4444';
                    if (error) error.style.display = 'block';
                    if (!firstInvalid) firstInvalid = field;
                } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                    valid = false;
                    field.style.borderColor = '#ef4444';
                    if (error) {
                        error.textContent = 'Please enter a valid email address';
                        error.style.display = 'block';
                    }
                    if (!firstInvalid) firstInvalid = field;
                } else {
                    field.style.borderColor = '';
                    if (error) error.style.display = 'none';
                }
            });

            if (!valid) {
                e.preventDefault();
                if (firstInvalid) firstInvalid.focus();
            }
        });

        form.querySelectorAll('[required]').forEach(function(field) {
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '';
                    var group = this.closest('.form-group');
                    var error = group ? group.querySelector('.form-error') : null;
                    if (error) error.style.display = 'none';
                }
            });
        });
    });

});
