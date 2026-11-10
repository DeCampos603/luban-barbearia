/**
 * LUBAN BARBEARIA - APPLICATION CONTROLLER
 * High-End Scheduling, VIP Membership & Customer Experience
 * Author: Senior UI/UX Engineer
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCountdown();
  initBookingWizard();
  initCardModal();
  initFilters();
  initCard3DTilt();
});

/* ==========================================================================
   NAVIGATION & VIEW CONTROLLER
   ========================================================================== */
function initNavigation() {
  const desktopNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const mobileTabItems = document.querySelectorAll('.bottom-tab-item[data-view]');
  const viewPanels = document.querySelectorAll('.view-panel');
  const btnLinkActions = document.querySelectorAll('[data-nav]');

  function switchView(targetViewId) {
    // Atualiza tabs desktop
    desktopNavItems.forEach(item => {
      if (item.getAttribute('data-view') === targetViewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Atualiza tabs mobile
    mobileTabItems.forEach(tab => {
      if (tab.getAttribute('data-view') === targetViewId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Alterna view com animação
    viewPanels.forEach(panel => {
      if (panel.id === `view-${targetViewId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Rola para o topo suavemente
    const scrollArea = document.querySelector('.viewport-scroll-area');
    if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Eventos Desktop
  desktopNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      if (view) switchView(view);
    });
  });

  // Eventos Mobile
  mobileTabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.getAttribute('data-view');
      if (view) switchView(view);
    });
  });

  // Botões de link inline (ex: "Ver Clube")
  btnLinkActions.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-nav');
      if (view) switchView(view);
    });
  });

  // Atalhos Topbar
  const btnOpenPlanDetails = document.getElementById('btnOpenPlanDetails');
  if (btnOpenPlanDetails) {
    btnOpenPlanDetails.addEventListener('click', () => switchView('club'));
  }

  const btnHeaderProfile = document.getElementById('btnHeaderProfile');
  if (btnHeaderProfile) {
    btnHeaderProfile.addEventListener('click', () => switchView('profile'));
  }

  // Notificações
  const btnNotifications = document.getElementById('btnNotifications');
  if (btnNotifications) {
    btnNotifications.addEventListener('click', () => {
      showToast('Nenhuma pendência. Seu próximo atendimento é hoje às 11:30.', 'orange', 'fa-bell');
    });
  }

  // Sidebar Concierge & Logout
  const btnSidebarConcierge = document.getElementById('btnSidebarConcierge');
  if (btnSidebarConcierge) {
    btnSidebarConcierge.addEventListener('click', contactFounderWhatsApp);
  }

  const btnLogoutSidebar = document.getElementById('btnLogoutSidebar');
  if (btnLogoutSidebar) {
    btnLogoutSidebar.addEventListener('click', () => {
      if (confirm('Deseja realmente sair da sua conta Luban Barbearia?')) {
        showToast('Sessão encerrada com segurança.', 'orange', 'fa-shield-halved');
      }
    });
  }
}

/* ==========================================================================
   CONTAGEM REGRESSIVA DINÂMICA (NEXT CUT LIVE COUNTDOWN)
   ========================================================================== */
function initCountdown() {
  const countdownText = document.getElementById('countdownText');
  if (!countdownText) return;

  function update() {
    const now = new Date();
    // Horário do agendamento fixado: hoje às 11:30
    const target = new Date();
    target.setHours(11, 30, 0, 0);

    const diffMs = target - now;
    if (diffMs > 0) {
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      if (diffMins >= 60) {
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        countdownText.textContent = `Hoje às 11:30 (Faltam ${hours}h ${mins}m)`;
      } else {
        countdownText.textContent = `Hoje às 11:30 (Em ${diffMins}m ${diffSecs}s)`;
      }
    } else {
      countdownText.textContent = 'Hoje às 11:30 (Em andamento / Cadeira 02)';
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   INTEGRAÇÃO WHATSAPP, CALENDÁRIO & GPS
   ========================================================================== */
// Botão Contatar Barbeiro
const btnContactBarberWhatsApp = document.getElementById('btnContactBarberWhatsApp');
if (btnContactBarberWhatsApp) {
  btnContactBarberWhatsApp.addEventListener('click', () => {
    contactBarberWhatsApp('Luiz Henrique Silva Elias', 'Hoje (10/11) às 11:30');
  });
}

function contactBarberWhatsApp(barberName, appointmentTime) {
  const phone = '5521965500188'; // WhatsApp Oficial Barbearia Luã Bandeira (Vila da Penha)
  const text = encodeURIComponent(
    `Fala ${barberName}, tudo bem? Aqui é o Luiz Henrique Silva Elias. Estou confirmado para o corte de ${appointmentTime} na Barbearia Luã Bandeira! Qualquer detalhe ou caso eu chegue 5 minutinhos antes, te aviso por aqui. Um abraço!`
  );
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

// Botão Falar com Fundador Luã
function contactFounderWhatsApp() {
  const phone = '5521965500188';
  const text = encodeURIComponent(
    `Olá Luã Bandeira! Sou o Luiz Henrique, membro assinante do Clube Luã Bandeira. Gostaria de falar com você sobre meu plano e agendamentos.`
  );
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

// Botão Salvar na Agenda (.ics e Google Calendar)
const btnAddToCalendar = document.getElementById('btnAddToCalendar');
if (btnAddToCalendar) {
  btnAddToCalendar.addEventListener('click', () => {
    // Gera link direto do Google Calendar
    const title = encodeURIComponent('Corte Fade & Barboterapia - Luban Barbearia');
    const details = encodeURIComponent('Atendimento com Master Barber Luiz Henrique Silva Elias na Luban Barbearia (Luan Bandeira). Cortesia selecionada: Heineken Gelada.');
    const location = encodeURIComponent('Luban Barbearia - Luan Bandeira, Rio de Janeiro, RJ');
    
    // Data: 10 de Novembro às 11:30 até 12:15
    const now = new Date();
    const year = now.getFullYear();
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${year}1110T143000Z%2F${year}1110T151500Z`;

    window.open(gCalUrl, '_blank');
    showToast('Horário adicionado à sua agenda com sucesso!', 'success', 'fa-calendar-check');
  });
}

// Botão Como Chegar (Google Maps & Waze)
const btnOpenMapsRoute = document.getElementById('btnOpenMapsRoute');
if (btnOpenMapsRoute) {
  btnOpenMapsRoute.addEventListener('click', () => {
    const address = encodeURIComponent('Luban Barbearia Luan Bandeira');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  });
}

// Reagendar Rápido
const btnRescheduleQuick = document.getElementById('btnRescheduleQuick');
if (btnRescheduleQuick) {
  btnRescheduleQuick.addEventListener('click', () => {
    openBookingModal('Reagendamento: Corte Fade Navalhado', 0);
  });
}

/* ==========================================================================
   WIZARD DE NOVO AGENDAMENTO (4 ETAPAS FLUIDAS)
   ========================================================================== */
let bookingState = {
  service: 'Corte Fade Navalhado',
  price: 0,
  isPlan: true,
  barber: 'Luiz Henrique Silva Elias',
  date: 'Hoje (10/11)',
  time: '11:30',
  drink: 'Heineken Gelada (Cortesia)'
};

function initBookingWizard() {
  const modal = document.getElementById('bookingModal');
  const btnClose = document.getElementById('btnCloseBookingModal');
  const btnNext = document.getElementById('btnNextStep');
  const btnPrev = document.getElementById('btnPrevStep');
  const steps = document.querySelectorAll('.step-pane');
  const dots = document.querySelectorAll('.step-dot');
  
  let currentStep = 1;

  // Abrir modal por botões de agendamento
  const triggerBtns = [
    document.getElementById('btnMainNewAppointment'),
    document.getElementById('btnBottomNewAppointment'),
    document.getElementById('btnNewAppointmentFromList')
  ];

  triggerBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => openBookingModal());
  });

  if (btnClose) {
    btnClose.addEventListener('click', () => closeModal(modal));
  }

  // Fechar ao clicar fora
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
    const cardModal = document.getElementById('cardModal');
    if (e.target === cardModal) closeModal(cardModal);
  });

  // Seleção de Serviços (Etapa 1)
  const serviceCards = document.querySelectorAll('.service-select-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.service = card.getAttribute('data-service');
      bookingState.price = parseFloat(card.getAttribute('data-price') || 0);
      bookingState.isPlan = card.getAttribute('data-is-plan') === 'true';
    });
  });

  // Seleção de Profissionais (Etapa 2)
  const barberCards = document.querySelectorAll('.barber-select-card');
  barberCards.forEach(card => {
    card.addEventListener('click', () => {
      barberCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.barber = card.getAttribute('data-barber');
    });
  });

  // Seleção de Data (Etapa 3)
  const dateChips = document.querySelectorAll('.date-chip');
  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dateChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      bookingState.date = chip.getAttribute('data-date');
    });
  });

  // Seleção de Horário (Etapa 3)
  const slotBtns = document.querySelectorAll('.slot-btn');
  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      bookingState.time = btn.getAttribute('data-time');
    });
  });

  // Navegação do Stepper
  function updateStepUI() {
    steps.forEach((pane, idx) => {
      if (idx + 1 === currentStep) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx + 1 <= currentStep) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (currentStep === 1) {
      btnPrev.classList.add('d-none');
      btnNext.textContent = 'Continuar';
    } else if (currentStep === 4) {
      btnPrev.classList.remove('d-none');
      btnNext.textContent = 'Confirmar Agendamento VIP';
      populateSummary();
    } else {
      btnPrev.classList.remove('d-none');
      btnNext.textContent = 'Continuar';
    }
  }

  function populateSummary() {
    document.getElementById('summaryService').textContent = bookingState.service;
    document.getElementById('summaryBarber').textContent = bookingState.barber;
    document.getElementById('summaryDateTime').textContent = `${bookingState.date} às ${bookingState.time}`;
    document.getElementById('summaryDrink').textContent = bookingState.drink;

    const priceEl = document.getElementById('summaryPrice');
    if (bookingState.isPlan || bookingState.price === 0) {
      priceEl.textContent = 'R$ 0,00 (Incluso no seu Plano Essencial)';
      priceEl.style.color = 'var(--status-green)';
    } else {
      priceEl.textContent = `R$ ${bookingState.price.toFixed(2).replace('.', ',')}`;
      priceEl.style.color = 'var(--orange-primary)';
    }
  }

  btnNext.addEventListener('click', () => {
    if (currentStep < 4) {
      currentStep++;
      updateStepUI();
    } else {
      // Confirmação final
      closeModal(modal);
      currentStep = 1;
      updateStepUI();
      showToast('Agendamento confirmado com sucesso na Luban Barbearia!', 'success', 'fa-circle-check');

      // Abre confirmação no WhatsApp
      setTimeout(() => {
        const text = encodeURIComponent(
          `*NOVO AGENDAMENTO LUBAN BARBEARIA*\n\n` +
          `• *Cliente:* Luiz Henrique Silva Elias\n` +
          `• *Serviço:* ${bookingState.service}\n` +
          `• *Profissional:* ${bookingState.barber}\n` +
          `• *Data:* ${bookingState.date} às ${bookingState.time}\n` +
          `• *Valor:* ${bookingState.price === 0 ? 'R$ 0,00 (Plano Essencial)' : 'R$ ' + bookingState.price.toFixed(2)}\n\n` +
          `Aguardamos você com drink cortesia pronto no lounge!`
        );
        window.open(`https://wa.me/5521965500188?text=${text}`, '_blank');
      }, 1000);
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepUI();
    }
  });

  window.openBookingModal = function(serviceName, price) {
    if (serviceName) {
      bookingState.service = serviceName;
      bookingState.price = price || 0;
      bookingState.isPlan = price === 0;
    }
    currentStep = 1;
    updateStepUI();
    modal.classList.add('show');
  };
}

function closeModal(modalEl) {
  if (modalEl) modalEl.classList.remove('show');
}

/* ==========================================================================
   MODAL DE ATUALIZAÇÃO DE CARTÃO (MIGRAÇÃO DE ASSINATURA)
   ========================================================================== */
function initCardModal() {
  const cardModal = document.getElementById('cardModal');
  const btnOpen = document.getElementById('btnOpenCardModal');
  const btnClose = document.getElementById('btnCloseCardModal');
  const cardNumInput = document.getElementById('cardNumInput');
  const cardExpInput = document.getElementById('cardExpInput');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => cardModal.classList.add('show'));
  }
  if (btnClose) {
    btnClose.addEventListener('click', () => closeModal(cardModal));
  }

  // Formatação em tempo real do cartão
  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = val.substring(0, 19);
    });
  }

  if (cardExpInput) {
    cardExpInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      e.target.value = val.substring(0, 5);
    });
  }

  window.openCardModal = function() {
    cardModal.classList.add('show');
  };

  window.handleCardUpdate = function() {
    const cardNum = document.getElementById('cardNumInput').value;
    const lastDigits = cardNum.slice(-4) || '8832';
    
    // Atualiza na interface
    const displayEl = document.getElementById('profileCardDisplay');
    if (displayEl) {
      displayEl.textContent = `•••• •••• •••• ${lastDigits}`;
    }

    // Oculta o banner de alerta de migração
    const statusCard = document.querySelector('.concierge-status-card');
    if (statusCard) {
      statusCard.style.display = 'none';
    }

    closeModal(cardModal);
    showToast('Cartão de crédito atualizado e validado com sucesso!', 'success', 'fa-credit-card');
  };
}

/* ==========================================================================
   SELEÇÃO DE BEBIDA DO BAR DE CORTESIA
   ========================================================================== */
window.selectCourtesyDrink = function(drinkName) {
  bookingState.drink = `${drinkName} (Cortesia)`;

  // Reset visual cards
  document.querySelectorAll('.bar-item-card').forEach(card => {
    card.classList.remove('active-selection');
    const status = card.querySelector('.bar-item-status');
    if (status) status.remove();
  });

  showToast(`${drinkName} selecionada para o seu corte!`, 'orange', 'fa-beer-mug-empty');
};

/* ==========================================================================
   FILTROS DE AGENDAMENTOS (CONFIRMADOS VS PASSADOS)
   ========================================================================== */
function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const upcomingList = document.getElementById('upcomingList');
  const pastList = document.getElementById('pastList');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      if (filter === 'upcoming') {
        upcomingList.classList.remove('d-none');
        pastList.classList.add('d-none');
      } else {
        upcomingList.classList.add('d-none');
        pastList.classList.remove('d-none');
      }
    });
  });

  window.confirmCancelAppointment = function() {
    if (confirm('Deseja realmente cancelar seu agendamento de 10 de Novembro às 11:30?')) {
      upcomingList.innerHTML = `
        <div style="text-align: center; padding: 40px; background: var(--bg-card); border-radius: 16px; border: 1px dashed var(--border-subtle);">
          <i class="fa-solid fa-calendar-xmark" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 12px;"></i>
          <h4 style="font-size: 1.1rem; margin-bottom: 6px;">Nenhum agendamento ativo</h4>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 16px;">Você pode agendar um novo horário a qualquer momento pelo seu Plano Essencial.</p>
          <button class="btn-primary-small" style="margin: 0 auto;" onclick="openBookingModal()">Agendar Agora</button>
        </div>
      `;
      showToast('Agendamento cancelado. Seu corte mensal foi devolvido ao saldo.', 'orange', 'fa-arrow-rotate-left');
    }
  };

  window.openRescheduleModal = function() {
    openBookingModal('Reagendamento: Corte Fade Navalhado', 0);
  };

  window.requestPlanUpgrade = function(planName, price) {
    showToast(`Solicitação de upgrade para ${planName} enviada para o Concierge!`, 'success', 'fa-crown');
    setTimeout(() => {
      contactFounderWhatsApp();
    }, 1200);
  };
}

/* ==========================================================================
   CARTÃO 3D COM EFEITO DE INCLINAÇÃO (TILT EFFECT)
   ========================================================================== */
function initCard3DTilt() {
  const card = document.getElementById('virtualVipCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   SISTEMA DE TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'success', icon = 'fa-check') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
