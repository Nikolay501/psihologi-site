// ==================== Глобальные переменные ====================
const BOT_TOKEN = '8125682835:AAFpvY4g0ED2KKaUW2wVOPbZRkGVDKwuHUM'; // токен
const CHAT_ID = '8170703204';     // chat_id

// ==================== Функция отправки в Telegram ====================
async function sendToTelegram(formData) {
    const text = `📬 <b>Новая заявка с сайта</b>\n\n` +
                 `👤 <b>Имя:</b> ${formData.name}\n` +
                 `📞 <b>Контакт:</b> ${formData.contact}\n` +
                 `✉️ <b>Сообщение:</b>\n${formData.message || 'Не указано'}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Ошибка отправки:', error);
        return false;
    }
}

// ==================== Обработчик формы ====================
function setupForm() {
    const form = document.getElementById('telegramForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: form.name.value.trim(),
            contact: form.contact.value.trim(),
            message: form.message.value.trim()
        };

        // Валидация
        if (!validateContact(formData.contact)) {
            showMessage('Укажите корректный email или телефон', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Показываем загрузку
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

        // Отправка
        const isSuccess = await sendToTelegram(formData);
        
        // Обработка результата
        if (isSuccess) {
            showMessage('Сообщение отправлено! Я свяжусь с тобой в ближайшее время.', 'success');
            form.reset();
        } else {
            showMessage('Похоже, возникла какая-то ошибка. Пожалуйста, воспользуйся другими способами связи.', 'error');
        }

        // Восстанавливаем кнопку
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    });
}

// ==================== Валидация контакта ====================
function validateContact(contact) {
    return contact.includes('@') || /^[\d\+]{7,}$/.test(contact);
}

// ==================== Показать сообщение ====================
function showMessage(text, type) {
    const messageEl = document.querySelector('.form-message');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = `form-message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// ==================== Canvas-анимация ====================
function initCanvasAnimation() {
    const canvas = document.getElementById('mindCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initNodes();
    }

    function initNodes() {
        nodes = [];
        for (let i = 0; i < 30; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 2 + Math.random() * 3,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                color: `rgba(255, 255, 255, ${0.2 + Math.random() * 0.3})`
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Обновление и отрисовка узлов
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
        });
        
        // Отрисовка соединений
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}

// ==================== Мобильное меню ====================
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// ==================== Плавная прокрутка ====================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== Анимация при скролле ====================
function setupScrollAnimations() {
    const animateOnScroll = () => {
        document.querySelectorAll('.problem__card, .about__photo-frame, .format__item').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                el.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
}

// ==================== Лоадер ====================
function initLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 1000);
    }
}

// ==================== Инициализация анимации интро ====================
function initIntroAnimations() {
    const introTitle = document.querySelector('.intro__title');
    const introSubtitle = document.querySelector('.intro__subtitle');
    
    if (introTitle) introTitle.style.animation = 'fadeInUp 1s ease forwards';
    if (introSubtitle) introSubtitle.style.animation = 'fadeInUp 1s ease 0.3s forwards';
}

// Прокрутка при клике на стрелку
document.querySelector('.scroll-down')?.addEventListener('click', () => {
    window.scrollTo({
        top: document.documentElement.clientHeight,
        behavior: 'smooth'
    });
});
// ==================== Основная инициализация ====================
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initIntroAnimations();
    setupForm();
    setupMobileMenu();
    setupSmoothScroll();
    setupScrollAnimations();
});

// Анимация загрузки
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loader');
  const letters = document.querySelectorAll('.logo-loading span');
  const bar = document.querySelector('.bar-progress');
  
  // Анимация букв
  letters.forEach((letter, index) => {
    setTimeout(() => {
      letter.style.opacity = 1;
      letter.style.transform = 'translateY(0)';
    }, 100 * index);
  });
  
  // Анимация прогресс-бара
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    bar.style.width = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.style.opacity = 0;
        setTimeout(() => {
          loader.style.display = 'none';
        }, 600);
      }, 500);
    }
  }, 50);
});
window.addEventListener('load', initCanvasAnimation);
