/**
 * LUMIÈRE DENTAL STUDIO - JAVASCRIPT PRINCIPAL
 * Interações, Validação, Integração Web3Forms e Notificações na Página
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de Ícones Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Header Fixo com Efeito de Sombra e Redução no Scroll
  const header = document.getElementById('main-header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-md', 'bg-opacity-95');
      header.classList.remove('py-5');
      header.classList.add('py-3.5');
    } else {
      header.classList.remove('shadow-md', 'bg-opacity-95');
      header.classList.remove('py-3.5');
      header.classList.add('py-5');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 2. Menu Mobile Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal-init');
    revealObserver.observe(el);
  });

  // 4. Máscara de Telefone/WhatsApp (BR: (11) 99999-9999)
  const formatPhone = (input) => {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      input.value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      input.value = value.replace(/^(\d{2})(\d{4,5})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      input.value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else {
      input.value = value;
    }
  };

  const phoneInputs = document.querySelectorAll('.phone-mask');
  phoneInputs.forEach(input => {
    input.addEventListener('input', () => {
      formatPhone(input);
      clearFieldError(input);
    });
  });

  // 5. Toast Notification Flutuante
  const showToast = (title, message, isSuccess = true) => {
    const toast = document.getElementById('luxury-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    if (!toast) return;

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    if (isSuccess) {
      toastIcon.innerHTML = `<svg class="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else {
      toastIcon.innerHTML = `<svg class="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }

    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 5500);
  };

  // 6. Funções de Validação e Feedback Inline na Página
  const setFieldError = (input, message) => {
    input.classList.add('!border-rose-500', 'ring-1', 'ring-rose-500/50');
    const parent = input.parentElement;
    const errorMsg = parent.querySelector('.field-error-msg');
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.classList.remove('hidden');
    }
  };

  const clearFieldError = (input) => {
    input.classList.remove('!border-rose-500', 'ring-1', 'ring-rose-500/50');
    const parent = input.parentElement;
    const errorMsg = parent.querySelector('.field-error-msg');
    if (errorMsg) {
      errorMsg.classList.add('hidden');
      errorMsg.textContent = '';
    }
  };

  // Limpa erro ao focar ou digitar em qualquer input
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => clearFieldError(el));
    el.addEventListener('change', () => clearFieldError(el));
  });

  const validateForm = (form) => {
    let isValid = true;

    // Validação Nome
    const nameInput = form.querySelector('input[name="name"]');
    if (nameInput) {
      if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
        setFieldError(nameInput, 'Por favor, informe seu nome completo (mínimo 3 caracteres).');
        isValid = false;
      } else {
        clearFieldError(nameInput);
      }
    }

    // Validação Telefone/WhatsApp
    const phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) {
      const numbers = phoneInput.value.replace(/\D/g, '');
      if (numbers.length < 10) {
        setFieldError(phoneInput, 'Informe um número de WhatsApp válido com DDD (ex: (11) 99999-9999).');
        isValid = false;
      } else {
        clearFieldError(phoneInput);
      }
    }

    // Validação Procedimento
    const serviceSelect = form.querySelector('select[name="service"]');
    if (serviceSelect) {
      if (!serviceSelect.value) {
        setFieldError(serviceSelect, 'Por favor, selecione uma especialidade de interesse.');
        isValid = false;
      } else {
        clearFieldError(serviceSelect);
      }
    }

    return isValid;
  };

  // Exibição de Mensagem de Sucesso ou Erro na Própria Página (Inline)
  const showInlineFeedback = (feedbackContainer, type, title, message) => {
    if (!feedbackContainer) return;

    feedbackContainer.classList.remove('hidden');

    if (type === 'success') {
      feedbackContainer.className = 'p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-100 flex items-start gap-3 shadow-lg mb-4 animate-fade-in';
      feedbackContainer.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div>
          <h4 class="font-bold text-sm text-emerald-300 leading-snug">${title}</h4>
          <p class="text-xs text-emerald-100/90 mt-1 leading-relaxed">${message}</p>
        </div>
      `;
    } else {
      feedbackContainer.className = 'p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-100 flex items-start gap-3 shadow-lg mb-4 animate-fade-in';
      feedbackContainer.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        <div>
          <h4 class="font-bold text-sm text-rose-300 leading-snug">${title}</h4>
          <p class="text-xs text-rose-100/90 mt-1 leading-relaxed">${message}</p>
          <a href="https://wa.me/5511999998888" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:underline mt-2">
            <span>Falar no WhatsApp Oficial</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
      `;
    }
  };

  // 7. Envio Assíncrono com Web3Forms (Footer e Modal)
  const setupWeb3Form = (formId, feedbackId, isModal = false) => {
    const form = document.getElementById(formId);
    const feedbackContainer = document.getElementById(feedbackId);

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validação dos Campos
      if (!validateForm(form)) {
        showInlineFeedback(
          feedbackContainer,
          'error',
          'Campos Obrigatórios Pendentes',
          'Por favor, verifique os campos destacados em vermelho antes de enviar.'
        );
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Estado de Carregamento
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-flex items-center gap-2">
          <svg class="animate-spin h-5 w-5 text-brand-charcoal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enviando solicitação...
        </span>
      `;

      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (response.status === 200 && data.success) {
          // Sucesso no Envio Web3Forms
          showInlineFeedback(
            feedbackContainer,
            'success',
            'Solicitação Enviada com Sucesso!',
            'Recebemos sua solicitação de avaliação. Nossa concierge médica entrará em contato em instantes via WhatsApp para confirmar seu horário reservado.'
          );

          showToast(
            'Avaliação Solicitada com Sucesso!',
            'Nossa concierge médica entrará em contato via WhatsApp para confirmar seu horário exclusivo.',
            true
          );

          form.reset();

          if (isModal) {
            setTimeout(() => {
              closeModal();
            }, 3000);
          }
        } else {
          // Resposta com erro da API (ex: chave não configurada ou erro de validação do provedor)
          const errorMsg = data.message || 'Não foi possível processar o envio automaticamente.';
          showInlineFeedback(
            feedbackContainer,
            'error',
            'Atenção ao Enviar Mensagem',
            `${errorMsg}. Se preferir, fale diretamente com nossa equipe no WhatsApp.`
          );

          showToast(
            'Não foi possível enviar',
            'Ocorreu uma falha no envio. Por favor, tente novamente ou use o WhatsApp.',
            false
          );
        }
      } catch (error) {
        // Erro de Conexão ou Rede
        showInlineFeedback(
          feedbackContainer,
          'error',
          'Erro de Conexão',
          'Não conseguimos conectar ao servidor no momento. Por favor, verifique sua conexão ou clique abaixo para falar no WhatsApp.'
        );

        showToast(
          'Erro de Conexão',
          'Não foi possível enviar a mensagem. Tente novamente ou use o WhatsApp.',
          false
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  };

  // Inicializa Web3Forms nos formulários
  setupWeb3Form('footer-booking-form', 'footer-form-feedback', false);
  setupWeb3Form('modal-booking-form', 'modal-form-feedback', true);

  // 8. Modal de Agendamento Rápido
  const modal = document.getElementById('booking-modal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');

  const openModal = (procedure = '') => {
    if (!modal) return;
    
    // Limpa feedback anterior do modal
    const modalFeedback = document.getElementById('modal-form-feedback');
    if (modalFeedback) modalFeedback.classList.add('hidden');

    if (procedure) {
      const select = modal.querySelector('#modal-procedure');
      if (select) select.value = procedure;
    }
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      modal.querySelector('.modal-content')?.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.add('opacity-0');
    modal.querySelector('.modal-content')?.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 250);
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const procedure = btn.getAttribute('data-procedure') || '';
      openModal(procedure);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Fechar com tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
});
