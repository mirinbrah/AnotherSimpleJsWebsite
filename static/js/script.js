// 1. Находим нужные элементы на странице
const themeButton = document.getElementById('theme-button');
const body = document.body;

// Функция для обновления текста кнопки
const updateButtonText = () => {
    // Проверяем, есть ли у body класс 'dark-theme'
    if (body.classList.contains('dark-theme')) {
        // Если тема тёмная, предлагаем включить светлую
        themeButton.textContent = 'Включить светлую тему';
    } else {
        // Если тема светлая, предлагаем включить тёмную
        themeButton.textContent = 'Включить тёмную тему';
    }
};

// 2. Проверяем, есть ли сохраненная тема в localStorage при загрузке страницы
// localStorage — это хранилище в браузере, которое не очищается при перезагрузке
const savedTheme = localStorage.getItem('theme');

// Если в хранилище есть запись 'dark', применяем тёмную тему
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
}

// Сразу после загрузки страницы обновляем текст на кнопке
updateButtonText();


// 3. Добавляем "слушателя" события на кнопку
themeButton.addEventListener('click', () => {
    // Переключаем класс как и раньше
    body.classList.toggle('dark-theme');

    // 4. После переключения, сохраняем выбор в localStorage
    // Проверяем, какая тема установлена СЕЙЧАС
    if (body.classList.contains('dark-theme')) {
        // Если тёмная, сохраняем значение 'dark'
        localStorage.setItem('theme', 'dark');
    } else {
        // Если светлая, удаляем запись, чтобы вернуться к состоянию по умолчанию
        localStorage.removeItem('theme'); 
        // Альтернатива: localStorage.setItem('theme', 'light');
    }

    // Обновляем текст на кнопке после каждого клика
    updateButtonText();
});