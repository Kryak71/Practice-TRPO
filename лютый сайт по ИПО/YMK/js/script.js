//Глобальные переменные
let currentSlide = 0;

//Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  initCountrySelector();
  initProductSlider();
  initOrderModal();
  initBannerTimer();
  initSpecsTabs();
});

//Выбор страны
function initCountrySelector() {
  const countryBtn = document.querySelector('.country__btn');
  if (!countryBtn) return;

  countryBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const countryList = document.querySelector('.country__list');
    if (countryList) {
      countryList.style.display = countryList.style.display === 'block' ? 'none' : 'block';
    }
  });
}

// Слайдер товаров 
function initProductSlider() {
  const slider = document.querySelector('.goods__slider');
  const track = document.querySelector('.goods__track');
  const list = document.querySelector('.goods__list');
  const items = document.querySelectorAll('.goods__item');
  const prevBtn = document.querySelector('.goods__arrow-prev');
  const nextBtn = document.querySelector('.goods__arrow-next');
  
  if (!slider || !track || !list || items.length === 0) return;
  
  let itemWidth = items[0].offsetWidth + 30;
  let position = 0;
  let maxPosition = -((items.length - 3) * itemWidth);
  
  function updateSlider() {
    list.style.transform = `translateX(${position}px)`;
    if (prevBtn) prevBtn.disabled = position >= 0;
    if (nextBtn) nextBtn.disabled = position <= maxPosition;
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      position = Math.min(position + itemWidth * 3, 0);
      updateSlider();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      position = Math.max(position - itemWidth * 3, maxPosition);
      updateSlider();
    });
  }
  
  // Адаптация при изменении размера окна
  window.addEventListener('resize', function() {
    itemWidth = items[0].offsetWidth + 30;
    maxPosition = -((items.length - 3) * itemWidth);
    updateSlider();
  });
  
  updateSlider();
}

// Таймер обратного отсчета
function initBannerTimer() {
  const timerItems = document.querySelectorAll('.timer__unit');
  if (!timerItems || timerItems.length < 3) return;

  // Устанавливаем время окончания акции (текущее время + 2 дня)
  const endTime = new Date();
  endTime.setDate(endTime.getDate() + 2);
  endTime.setHours(23, 59, 59);

  function updateTimer() {
    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) {
      timerItems[0].textContent = '00';
      timerItems[1].textContent = '00';
      timerItems[2].textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    timerItems[0].textContent = days.toString().padStart(2, '0');
    timerItems[1].textContent = hours.toString().padStart(2, '0');
    timerItems[2].textContent = minutes.toString().padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Модальное окно заказа
function initOrderModal() {
  const modal = document.getElementById('order-modal');
  const orderForm = document.getElementById('order-form');
  const successMessage = document.querySelector('.success-message');
  const closeBtn = document.querySelector('.close-modal');

  if (!modal || !orderForm) return;

  // Открытие при клике на "Заказать сейчас"
  document.querySelectorAll('.product__more').forEach(btn => {
    btn.addEventListener('click', function() {
      modal.style.display = 'block';
      orderForm.style.display = 'block';
      if (successMessage) successMessage.style.display = 'none';
      orderForm.reset();
    });
  });

  // Закрытие
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
  }
  
  window.addEventListener('click', function(e) {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Обработка формы
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const phoneInput = this.querySelector('input[type="tel"]');
    const productInput = this.querySelector('input[type="text"]');
    const quantityInput = this.querySelector('input[type="number"]');
    
    if (!phoneInput || !validatePhone(phoneInput.value)) {
      alert('Пожалуйста, введите корректный номер телефона');
      return;
    }
    
    if (!productInput || productInput.value.trim() === '') {
      alert('Пожалуйста, укажите название продукции');
      return;
    }
    
    if (!quantityInput || quantityInput.value <= 0) {
      alert('Пожалуйста, укажите корректное количество');
      return;
    }
    
    orderForm.style.display = 'none';
    if (successMessage) successMessage.style.display = 'block';
    
    setTimeout(() => {
      modal.style.display = 'none';
      orderForm.style.display = 'block';
    }, 3000);
  });

  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  }
}

// Вкладки на странице продукции
function initSpecsTabs() {
  const tabs = document.querySelectorAll('.device-tab');
  const devices = document.querySelectorAll('.specs-device');
  
  if (tabs.length === 0) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Удаляем активный класс у всех вкладок
      tabs.forEach(t => t.classList.remove('active'));
      // Добавляем активный класс текущей вкладке
      this.classList.add('active');
      
      // Получаем тип устройства из data-атрибута
      const deviceType = this.dataset.device;
      
      // Анимация переключения устройств
      devices.forEach(device => {
        if (device.id === `${deviceType}-specs`) {
          // Показываем выбранное устройство с анимацией
          device.classList.add('active');
          setTimeout(() => {
            device.style.opacity = '1';
            device.style.transform = 'translateY(0)';
          }, 10);
        } else {
          // Скрываем другие устройства с анимацией
          device.style.opacity = '0';
          device.style.transform = 'translateY(20px)';
          setTimeout(() => {
            device.classList.remove('active');
          }, 500);
        }
      });
    });
  });
}

//Обработка кнопок маршрута в партнерах
document.querySelectorAll('.store-route').forEach(button => {
  button.addEventListener('click', function() {
    const location = encodeURIComponent(this.getAttribute('data-location'));
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${location}`);
  });
});