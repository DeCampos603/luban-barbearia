/**
 * LANDING PAGE CONTROLLER — BARBEARIA LUÃ BANDEIRA
 * High Conversion (CRO), Savings Calculator & Lead Capture
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initFaqAccordion();
  initPhoneMask();
  initVagasCounter();
});

/* ==========================================================================
   CALCULADORA INTERATIVA DE ECONOMIA
   ========================================================================== */
let includeBarba = true;

function initCalculator() {
  const cutSlider = document.getElementById('cutFrequencySlider');
  if (!cutSlider) return;

  cutSlider.addEventListener('input', calculateSavings);
  calculateSavings();
}

window.toggleBarba = function(isIncluded) {
  includeBarba = isIncluded;
  
  const btnSim = document.getElementById('btnBarbaSim');
  const btnNao = document.getElementById('btnBarbaNao');

  if (isIncluded) {
    btnSim.classList.add('active');
    btnNao.classList.remove('active');
  } else {
    btnSim.classList.remove('active');
    btnNao.classList.add('active');
  }

  calculateSavings();
};

function calculateSavings() {
  const cutSlider = document.getElementById('cutFrequencySlider');
  const cutFrequency = parseInt(cutSlider.value, 10);
  
  // Atualiza label
  const cutDisplay = document.getElementById('cutFrequencyDisplay');
  cutDisplay.textContent = cutFrequency === 1 ? '1 vez por mês' : `${cutFrequency} vezes por mês`;

  // Preços oficiais da Barbearia Luã Bandeira
  const priceCorteAvulso = 45.00;
  const priceBarbaAvulsa = 40.00;

  // Custo avulso mensal
  let costAvulso = cutFrequency * priceCorteAvulso;
  if (includeBarba) {
    // Estimativa de 3 barbas por mês se corta regularmente
    const barbaFrequency = Math.min(cutFrequency, 4);
    costAvulso += barbaFrequency * priceBarbaAvulsa;
  }

  // Preço equivalente no Clube Ilimitado
  let costClub = 87.90; // Apenas corte
  let planSuggested = 'Plano Ilimitado (Apenas Corte - R$ 87,90)';
  
  if (includeBarba) {
    costClub = 147.90; // Corte + Barba
    planSuggested = 'Plano Ilimitado (Cabelo e Barba - R$ 147,90)';
  }

  // Economia
  let savingsMonthly = costAvulso - costClub;
  if (savingsMonthly < 0) savingsMonthly = 0;
  const savingsYearly = savingsMonthly * 12;

  // Atualiza interface
  document.getElementById('costAvulsoDisplay').textContent = `R$ ${costAvulso.toFixed(2).replace('.', ',')} / mês`;
  document.getElementById('costClubDisplay').textContent = `R$ ${costClub.toFixed(2).replace('.', ',')} / mês`;
  document.getElementById('savingsDisplay').innerHTML = `R$ ${savingsMonthly.toFixed(2).replace('.', ',')} <small>/ mês</small>`;
  document.getElementById('savingsYearDisplay').innerHTML = `Isso dá <strong>R$ ${savingsYearly.toFixed(2).replace('.', ',')}</strong> economizados por ano!`;

  // Atualiza link de ação rápida
  const btnAction = document.getElementById('btnCalcAction');
  if (btnAction) {
    btnAction.onclick = () => selectPlanForm(planSuggested);
  }
}

/* ==========================================================================
   SELEÇÃO RÁPIDA DE PLANO NO FORMULÁRIO
   ========================================================================== */
window.selectPlanForm = function(planValue) {
  const select = document.getElementById('leadPlan');
  const targetSection = document.getElementById('cadastro');
  const nameInput = document.getElementById('leadName');

  if (select) {
    // Procura a opção correspondente
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value.includes(planValue.split('(')[0].trim())) {
        select.selectedIndex = i;
        break;
      }
    }
  }

  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 600);
  }
};

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Fecha outros
      faqItems.forEach(other => other.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   MÁSCARA DE TELEFONE (WHATSAPP)
   ========================================================================== */
function initPhoneMask() {
  const phoneInput = document.getElementById('leadWhatsapp');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);

    if (val.length > 6) {
      val = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
    } else if (val.length > 2) {
      val = `(${val.substring(0, 2)}) ${val.substring(2)}`;
    } else if (val.length > 0) {
      val = `(${val}`;
    }
    e.target.value = val;
  });
}

/* ==========================================================================
   DISPARO DO LEAD PARA O WHATSAPP COMERCIAL DA BARBEARIA
   ========================================================================== */
window.submitClubeLead = function() {
  const name = document.getElementById('leadName').value.trim();
  const phone = document.getElementById('leadWhatsapp').value.trim();
  const plan = document.getElementById('leadPlan').value;
  const barber = document.getElementById('leadBarber').value;

  if (!name || !phone) {
    alert('Por favor, preencha seu nome e WhatsApp.');
    return;
  }

  // Número oficial de atendimento da barbearia (Vila da Penha, RJ)
  const whatsappNumber = '5521965500188';

  const messageText = 
    `*SOLICITAÇÃO DE ASSINATURA • CLUBE LUÃ BANDEIRA*\n\n` +
    `Olá Luã / Equipe da Barbearia! Gostaria de me inscrever no Clube de Assinatura.\n\n` +
    `👤 *Nome:* ${name}\n` +
    `📱 *WhatsApp:* ${phone}\n` +
    `👑 *Plano Escolhido:* ${plan}\n` +
    `✂️ *Barbeiro de Preferência:* ${barber}\n\n` +
    `Gostaria de confirmar minha vaga e agendar meu primeiro atendimento na Rua Marco Polo 296, Vila da Penha!`;

  const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  showToast('Inscrição confirmada! Abrindo WhatsApp da barbearia...', 'fa-whatsapp');

  setTimeout(() => {
    window.open(encodedUrl, '_blank');
  }, 1200);
};

/* ==========================================================================
   CONTADOR DE VAGAS RESTANTES (URGÊNCIA CONTROLADA)
   ========================================================================== */
function initVagasCounter() {
  const el = document.getElementById('vagasCount');
  if (!el) return;

  // Simulação sutil de vagas reduzindo durante o ciclo
  const now = new Date();
  const day = now.getDate();
  const spots = Math.max(3, 8 - Math.floor(day / 4));
  el.textContent = `${spots} vagas restantes`;
}

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */
function showToast(message, icon = 'fa-check') {
  const hub = document.getElementById('toastHub');
  if (!hub) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<i class="fa-solid ${icon} text-green"></i> <span>${message}</span>`;
  hub.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
