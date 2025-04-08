document.addEventListener('DOMContentLoaded', () => {
    // Меню гамбургер
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Аккордеон
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            // Плавно закрываем все аккордеоны
            accordionHeaders.forEach(h => {
                h.classList.remove('active');
                const c = h.nextElementSibling;
                c.style.maxHeight = '0';
                c.classList.remove('active');
            });

            // Открываем текущий, если он был закрыт
            if (!isActive) {
                header.classList.add('active');
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Карусель
    const carousel = document.querySelector('.carousel');
    const carouselContainer = carousel.querySelector('.carousel-container');
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    let startX;
    let currentX;
    let isMobile = window.innerWidth <= 500;
    let isTablet = window.innerWidth > 500 && window.innerWidth <= 1000;

    function updateCarousel(smooth = true) {
        const itemWidth = carouselItems[0].offsetWidth;
        const transform = isMobile ? 
            `translateY(-${currentIndex * itemWidth}px)` : 
            `translateX(-${currentIndex * (itemWidth + 20)}px)`;
        
        carouselContainer.style.transition = smooth ? 'transform 0.5s ease' : 'none';
        carouselContainer.style.transform = transform;
    }

    function checkDeviceType() {
        const newIsMobile = window.innerWidth <= 500;
        const newIsTablet = window.innerWidth > 500 && window.innerWidth <= 1000;
        
        if (newIsMobile !== isMobile || newIsTablet !== isTablet) {
            isMobile = newIsMobile;
            isTablet = newIsTablet;
            currentIndex = 0;
            updateCarousel();
        }
    }

    // Автоматическая прокрутка карусели
    let carouselInterval = setInterval(() => {
        if (isMobile) {
            currentIndex = (currentIndex + 1) % carouselItems.length;
        } else if (isTablet) {
            currentIndex = (currentIndex + 1) % (carouselItems.length - 1);
        } else {
            currentIndex = (currentIndex + 1) % (carouselItems.length - 3);
        }
        updateCarousel();
    }, 5000);

    // Свайп для мобильных устройств
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        currentX = startX;
        carouselContainer.style.transition = 'none';
        clearInterval(carouselInterval);
    });

    carouselContainer.addEventListener('touchmove', (e) => {
        if (!startX) return;
        
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const itemWidth = carouselItems[0].offsetWidth;
        
        if (!isMobile) {
            carouselContainer.style.transform = `translateX(${diff - currentIndex * (itemWidth + 20)}px)`;
        }
    });

    carouselContainer.addEventListener('touchend', () => {
        if (!startX || !currentX) return;

        const diff = currentX - startX;
        const itemWidth = carouselItems[0].offsetWidth;
        
        if (Math.abs(diff) > itemWidth / 3) {
            if (diff > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diff < 0 && currentIndex < carouselItems.length - 1) {
                currentIndex++;
            }
        }
        
        updateCarousel();
        startX = null;
        currentX = null;

        // Возобновляем автопрокрутку
        carouselInterval = setInterval(() => {
            if (isMobile) {
                currentIndex = (currentIndex + 1) % carouselItems.length;
            } else if (isTablet) {
                currentIndex = (currentIndex + 1) % (carouselItems.length - 1);
            } else {
                currentIndex = (currentIndex + 1) % (carouselItems.length - 3);
            }
            updateCarousel();
        }, 5000);
    });

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        checkDeviceType();
        updateCarousel(false);
    });

    // Валидация формы
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            const messageInput = form.querySelector('textarea');

            if (!nameInput.value.trim()) {
                alert('Пожалуйста, введите ваше имя');
                return;
            }

            if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
                alert('Пожалуйста, введите корректный email');
                return;
            }

            if (!messageInput.value.trim()) {
                alert('Пожалуйста, введите ваше сообщение');
                return;
            }

            alert('Форма успешно отправлена!');
            form.reset();
        });
    });
}); 