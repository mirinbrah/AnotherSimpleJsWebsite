// 1. Находим нужные элементы на странице
const themeButton = document.getElementById('theme-button');
const body = document.body;

// классическое объявление функции (Function Declaration).
function updateButtonText() {
    // Тело функции осталось без изменений
    if (body.classList.contains('dark-theme')) {
        themeButton.textContent = 'Включить светлую тему';
    } else {
        themeButton.textContent = 'Включить тёмную тему';
    }
}

// Cоздаем отдельную, именованную функцию, которая будет обрабатывать клик.
// Раньше это была анонимная стрелочная функция внутри addEventListener.
function handleThemeToggle() {
    // Переключаем класс
    body.classList.toggle('dark-theme');

    // Сохраняем выбор в localStorage
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.removeItem('theme');
    }

    // Обновляем текст на кнопке, вызывая другую нашу функцию
    updateButtonText();
}



// Проверяем, есть ли сохраненная тема в localStorage
const savedTheme = localStorage.getItem('theme');

// Если в хранилище есть запись 'dark', применяем тёмную тему
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
}

// Сразу после загрузки страницы обновляем текст на кнопке
updateButtonText();


// Добавляем "слушателя" события на кнопку.

themeButton.addEventListener('click', handleThemeToggle);