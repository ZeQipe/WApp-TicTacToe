import { sendMessageModel } from "./lib.js";

function choicePlayerFigure() {
    // Отмечаем начало выполнения функции
    console.log('Функция choicePlayerFigure вызвана.');

    // 1. Таймаут для ожидания завершения анимации
    setTimeout(() => {
        // 2. Затемнение всех элементов, кроме интерфейса
        const elementsToDarken = document.querySelectorAll('body > *:not(.interface)');
        elementsToDarken.forEach(element => {
            element.style.opacity = '0.5';
        });

        // 3. Увеличение размера и яркости картинок helper и helper2
        const helper = document.getElementById('helper');
        const helper2 = document.getElementById('helper2');

        helper.style.transform = 'scale(1.2)';
        helper2.style.transform = 'scale(1.2)';
        helper.style.filter = 'brightness(1.5)';
        helper2.style.filter = 'brightness(1.5)';

        // 4. Сделать картинки кликабельными и добавить эффекты наведения
        helper.style.pointerEvents = 'auto';
        helper2.style.pointerEvents = 'auto';

        // Эффекты наведения для helper
        helper.addEventListener('mouseenter', function() {
            helper.style.transform = 'scale(1.3)';
            const cursorX = document.createElement('img');
            cursorX.src = '../static/resource/images/figure/x (1).png';
            cursorX.style.position = 'absolute';
            cursorX.style.top = '50%';
            cursorX.style.left = '50%';
            cursorX.style.transform = 'translate(-50%, -50%)';
            cursorX.style.zIndex = '10';
            document.body.appendChild(cursorX);

            helper.addEventListener('mouseleave', function() {
                helper.style.transform = 'scale(1.2)';
                cursorX.remove();
            });

            helper.addEventListener('click', function() {
                setFigurePlayer('x');
                resetInterface();
            });
        });

        // Эффекты наведения для helper2
        helper2.addEventListener('mouseenter', function() {
            helper2.style.transform = 'scale(1.3)';
            const cursorO = document.createElement('img');
            cursorO.src = '../static/resource/images/figure/o (1).png';
            cursorO.style.position = 'absolute';
            cursorO.style.top = '50%';
            cursorO.style.left = '50%';
            cursorO.style.transform = 'translate(-50%, -50%)';
            cursorO.style.zIndex = '10';
            document.body.appendChild(cursorO);

            helper2.addEventListener('mouseleave', function() {
                helper2.style.transform = 'scale(1.2)';
                cursorO.remove();
            });

            helper2.addEventListener('click', function() {
                setFigurePlayer('o');
                resetInterface();
            });
        });

    }, 6000); // Таймаут для ожидания завершения анимации

    // Функция для сброса интерфейса в исходное состояние
    function resetInterface() {
        console.log('Возвращаем интерфейс в исходное состояние.');

        elementsToDarken.forEach(element => {
            element.style.opacity = '1';
        });

        helper.style.transform = 'scale(1)';
        helper2.style.transform = 'scale(1)';
        helper.style.filter = 'brightness(1)';
        helper2.style.filter = 'brightness(1)';
        helper.style.pointerEvents = 'none';
        helper2.style.pointerEvents = 'none';
    }
}



document.addEventListener('DOMContentLoaded', function() {
    // Делаем кнопки неактивными
    const buttonDeck = document.querySelector('.button-deck');
    const interfaceButtons = document.querySelector('.interface-buttons');

    buttonDeck.querySelectorAll('button').forEach(button => {
        button.disabled = true;
    });

    interfaceButtons.querySelectorAll('img').forEach(img => {
        img.style.pointerEvents = 'none';
    });

    // Отправляем запрос на сервер для получения информации о матче
    sendMessageModel(['POST', 'info_match'])
        .then(data => {
            // Обработка полученных данных
            console.log('Информация о матче получена:', data);

            // Проверяем успешность создания матча
            if (data[0] === 'true') {
                const typeMatch = data[1];

                // Действия в зависимости от типа матча
                if (typeMatch === 'client') {
                    // Запрашиваем информацию о ходе противника
                    console.log('Матч типа "client". Запрашиваем информацию о ходе противника.');
                } else if (typeMatch === 'server') {
                    // Разблокируем все кнопки для совершения хода
                    console.log('Матч типа "server". Разблокируем все кнопки для совершения хода.');
                    buttonDeck.querySelectorAll('button').forEach(button => {
                        button.disabled = false;
                    });
                } else if (typeMatch === 'single') {
                    // Запрашиваем фигуру у игрока
                    console.log('Матч типа "single". Вызываем функцию setPlayerFigure.');
                    choicePlayerFigure();
                } else {
                    console.error('Неизвестный тип матча:', typeMatch);
                }
            } else {
                console.error('Ошибка при создании матча:', data);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении информации о матче:', error);
        });
});