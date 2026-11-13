// Interactive Form Controls for VeltraUI Demo Pages

export function initFormsInteractivity() {
  // 1. Input Masking (Credit card, Phone, Currency, Date)
  const phoneInput = document.querySelector('[data-mask="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 10);
      let formatted = '';
      if (v.length > 0) formatted += '(' + v.substring(0, 3);
      if (v.length >= 4) formatted += ') ' + v.substring(3, 6);
      if (v.length >= 7) formatted += '-' + v.substring(6, 10);
      e.target.value = formatted;
    });
  }

  const cardInput = document.querySelector('[data-mask="card"]');
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 16);
      let parts = [];
      for (let i = 0; i < v.length; i += 4) {
        parts.push(v.substring(i, i + 4));
      }
      e.target.value = parts.join(' ');
    });
  }

  const currencyInput = document.querySelector('[data-mask="currency"]');
  if (currencyInput) {
    currencyInput.addEventListener('blur', (e) => {
      let num = parseFloat(e.target.value.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(num)) {
        e.target.value = '$ ' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    });
  }

  const dateInput = document.querySelector('[data-mask="date"]');
  if (dateInput) {
    dateInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 8);
      let formatted = '';
      if (v.length > 0) formatted += v.substring(0, 2);
      if (v.length >= 3) formatted += '/' + v.substring(2, 4);
      if (v.length >= 5) formatted += '/' + v.substring(4, 8);
      e.target.value = formatted;
    });
  }

  // 2. Interactive Numeric Steppers
  document.querySelectorAll('[data-stepper]').forEach((stepper) => {
    const input = stepper.querySelector('input');
    const btnDec = stepper.querySelector('[data-step="down"]');
    const btnInc = stepper.querySelector('[data-step="up"]');

    if (input && btnDec && btnInc) {
      btnDec.addEventListener('click', () => {
        let val = parseInt(input.value) || 0;
        const min = parseInt(input.min) || 0;
        if (val > min) input.value = val - 1;
      });
      btnInc.addEventListener('click', () => {
        let val = parseInt(input.value) || 0;
        const max = parseInt(input.max) || 999;
        if (val < max) input.value = val + 1;
      });
    }
  });

  // 3. Interactive Multi-Tags Component
  const tagsContainer = document.querySelector('[data-tags-container]');
  if (tagsContainer) {
    const input = tagsContainer.querySelector('input');
    const chipWrapper = tagsContainer.querySelector('.tags-wrapper');

    if (input && chipWrapper) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const val = input.value.trim().replace(',', '');
          if (val) {
            addTag(val);
            input.value = '';
          }
        }
      });

      function addTag(text) {
        const chip = document.createElement('span');
        chip.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200/80 animate-in fade-in duration-150';
        chip.innerHTML = `<span>${text}</span><button type="button" class="tag-remove text-cyan-500 hover:text-cyan-700 cursor-pointer text-sm font-bold">&times;</button>`;
        chip.querySelector('.tag-remove').addEventListener('click', () => chip.remove());
        chipWrapper.insertBefore(chip, input);
      }

      chipWrapper.querySelectorAll('.tag-remove').forEach((btn) => {
        btn.addEventListener('click', () => btn.closest('span').remove());
      });
    }
  }

  // 4. Interactive Range Slider with Live Badge
  const rangeSliders = document.querySelectorAll('[data-range-slider]');
  rangeSliders.forEach((range) => {
    const bubble = document.querySelector(`[data-range-val="${range.id}"]`);
    if (bubble) {
      const update = () => {
        bubble.textContent = range.value;
      };
      range.addEventListener('input', update);
      update();
    }
  });

  // 5. Interactive Color Picker Preview
  const colorPicker = document.querySelector('[data-color-picker]');
  const colorPreview = document.querySelector('[data-color-preview]');
  const colorCode = document.querySelector('[data-color-code]');
  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
      if (colorPreview) colorPreview.style.backgroundColor = e.target.value;
      if (colorCode) colorCode.textContent = e.target.value.toUpperCase();
    });
  }

  // 6. Live Validation & Password Strength Meter
  const passInput = document.getElementById('val-password');
  const strengthBars = document.querySelectorAll('.vlt-strength-bar');
  const strengthLabel = document.getElementById('strength-label');
  const ruleLen = document.getElementById('rule-length');
  const ruleNum = document.getElementById('rule-number');
  const ruleSpecial = document.getElementById('rule-special');

  if (passInput) {
    passInput.addEventListener('input', (e) => {
      const val = e.target.value;
      let score = 0;

      const hasLen = val.length >= 8;
      const hasNum = /\d/.test(val);
      const hasSpecial = /[^A-Za-z0-9]/.test(val) || /[A-Z]/.test(val);

      if (ruleLen) ruleLen.classList.toggle('text-emerald-600', hasLen);
      if (ruleNum) ruleNum.classList.toggle('text-emerald-600', hasNum);
      if (ruleSpecial) ruleSpecial.classList.toggle('text-emerald-600', hasSpecial);

      if (hasLen) score++;
      if (hasNum) score++;
      if (hasSpecial) score++;

      strengthBars.forEach((bar, idx) => {
        if (idx < score) {
          if (score === 1) bar.style.backgroundColor = '#f43f5e'; // rose
          else if (score === 2) bar.style.backgroundColor = '#f59e0b'; // amber
          else bar.style.backgroundColor = '#10b981'; // emerald
        } else {
          bar.style.backgroundColor = '#e2e8f0';
        }
      });

      if (strengthLabel) {
        if (val.length === 0) strengthLabel.textContent = 'None';
        else if (score === 1) strengthLabel.textContent = 'Débil (Weak)';
        else if (score === 2) strengthLabel.textContent = 'Media (Medium)';
        else strengthLabel.textContent = 'Fuerte (Strong)';
      }
    });
  }

  // Validation Form Submission Handler
  const valForm = document.getElementById('interactive-validation-form');
  if (valForm) {
    valForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      const nameInput = document.getElementById('val-name');
      if (nameInput) {
        if (nameInput.value.trim().length < 3) {
          nameInput.classList.remove('is-valid');
          nameInput.classList.add('is-invalid');
          isValid = false;
        } else {
          nameInput.classList.remove('is-invalid');
          nameInput.classList.add('is-valid');
        }
      }

      // Validate Email
      const emailInput = document.getElementById('val-email');
      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          emailInput.classList.remove('is-valid');
          emailInput.classList.add('is-invalid');
          isValid = false;
        } else {
          emailInput.classList.remove('is-invalid');
          emailInput.classList.add('is-valid');
        }
      }

      // Validate Password
      if (passInput) {
        if (passInput.value.length < 8) {
          passInput.classList.remove('is-valid');
          passInput.classList.add('is-invalid');
          isValid = false;
        } else {
          passInput.classList.remove('is-invalid');
          passInput.classList.add('is-valid');
        }
      }

      // Validate Terms Checkbox
      const termsCheck = document.getElementById('val-terms');
      if (termsCheck) {
        if (!termsCheck.checked) {
          termsCheck.classList.add('ring-2', 'ring-rose-500');
          isValid = false;
        } else {
          termsCheck.classList.remove('ring-2', 'ring-rose-500');
        }
      }

      if (isValid) {
        if (window.veltra?.modal?.toast) {
          window.veltra.modal.toast({
            title: '¡Formulario Válido!',
            message: 'Todos los campos han superado la validación correctamente.',
            type: 'emerald',
            duration: 4000
          });
        } else {
          alert('¡Formulario Válido y enviado con éxito!');
        }
      } else {
        if (window.veltra?.modal?.toast) {
          window.veltra.modal.toast({
            title: 'Error de Validación',
            message: 'Por favor corrige los campos resaltados en rojo.',
            type: 'rose',
            duration: 4000
          });
        }
      }
    });
  }
}

