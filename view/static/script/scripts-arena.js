import { sendMessageModel } from "./lib.js";

var cursorX = ''
var cursorO = ''
const helper = document.getElementById('helper');
const helper2 = document.getElementById('helper2');
const elementsToDarken = [
    document.getElementById('background'),
    document.getElementById('deka'),
    document.getElementById('x'),
    document.getElementById('interface-button')
]

function choicePlayerFigure() {
    console.log('Функция choicePlayerFigure вызвана.');
    setTimeout(() => {

        elementsToDarken.forEach(element => {
            element.style.transition = 'filter 0.3s ease';
            element.style.filter = 'brightness(30%)';
        });

        [helper, helper2].forEach(unit => {
            unit.style.transition = 'transform 0.3s filter 0.3s easy'
            unit.style.transform = 'scale(1.2) translateY(-5%)';
            unit.style.filter = 'brightness(1.02);'
            unit.style.cursor = 'pointer'
        })

        helper.addEventListener('mouseenter', seenterHelper)
        helper.addEventListener('mouseleave', leaverHelper);
        helper.addEventListener('click', clickHelper);
        helper2.addEventListener('mouseenter', seenterHelper2)
        helper2.addEventListener('mouseleave', leaverHelper2);
        helper2.addEventListener('click', clickHelper2);
    }, 6000);
}

function seenterHelper() {
    helper.style.transform = 'scale(1.3) translateY(-5%)';
    cursorX = document.createElement('img');
    cursorX.src = '../static/resource/images/figure/x (1).png';
    cursorX.style.position = 'absolute';
    cursorX.style.top = '50%';
    cursorX.style.left = '50%';
    cursorX.style.transform = 'translate(-50%, -50%)';
    cursorX.style.zIndex = '10';
    document.body.appendChild(cursorX);
    helper.addEventListener('click', );
};

function seenterHelper2() {
    helper2.style.transform = 'scale(1.3) translateY(-5%)';
    cursorO = document.createElement('img');
    cursorO.src = '../static/resource/images/figure/o (1).png';
    cursorO.style.position = 'absolute';
    cursorO.style.top = '50%';
    cursorO.style.left = '50%';
    cursorO.style.transform = 'translate(-50%, -50%)';
    cursorO.style.zIndex = '10';
    document.body.appendChild(cursorO);
};

function leaverHelper() {
    helper.style.transform = 'scale(1.2) translateY(-5%)';
    cursorX.remove();
}

function leaverHelper2() {
    helper2.style.transform = 'scale(1.2) translateY(-5%)';
    cursorO.remove();
}

function clickHelper() {
    cursorX.remove();
    setFigurePlayer('x');
}

function clickHelper2() {
    cursorO.remove();
    setFigurePlayer('o');
}

function resetInterface() {
    console.log('Возвращаем интерфейс в исходное состояние.');

    elementsToDarken.forEach(element => {
        element.style.transition = 'filter 0.3s ease';
        element.style.filter = 'brightness(100%)';
    });

    [helper, helper2].forEach(unit => {
        unit.style.transition = 'transform 0.3s filter 0.3s easy'
        unit.style.transform = 'scale(1) translateY(0)';
        unit.style.filter = 'brightness(1);'
        unit.style.cursor = 'auto'
    })
    helper.removeEventListener('mouseenter', seenterHelper)
    helper.removeEventListener('mouseleave', leaverHelper)
    helper.removeEventListener('click', clickHelper)
    helper2.removeEventListener('mouseenter', seenterHelper2)
    helper2.removeEventListener('mouseleave', leaverHelper2)
    helper2.removeEventListener('click', clickHelper2)
}

function setFigurePlayer(figure) {
    console.log('Функция setFigurePlayer вызвана.');
    sendMessageModel(['POST', 'set_player_figure', figure])
        .then(response => {
            if (response[0] === 'true') {
                console.log('Установка фигуры прошла успешно.');
                resetInterface();
                if (figure === 'x') {
                    const buttons = document.querySelectorAll('.game_button');
                    buttons.forEach(button => {
                        button.style.pointerEvents = 'auto';
                    });
                } else {
                    getMoveOpponent();
                }
            } else {
                console.error('Ошибка: установка фигуры не удалась.');
            }
        })
        .catch(error => {
            console.error('Ошибка при установке фигуры:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const buttonDeck = document.querySelector('.button-deck');
    const interfaceButtons = document.querySelector('.interface-buttons');

    buttonDeck.querySelectorAll('button').forEach(button => {
        button.disabled = true;
    });

    interfaceButtons.querySelectorAll('img').forEach(img => {
        img.style.pointerEvents = 'none';
    });

    sendMessageModel(['POST', 'info_match'])
        .then(data => {
            console.log('Информация о матче получена:', data);
            if (data[0] === 'true') {
                const typeMatch = data[1];
                if (typeMatch === 'client') {
                    console.log('Матч типа "client". Запрашиваем информацию о ходе противника.');
                } else if (typeMatch === 'server') {
                    console.log('Матч типа "server". Разблокируем все кнопки для совершения хода.');
                    buttonDeck.querySelectorAll('button').forEach(button => {
                        button.disabled = false;
                    });
                } else if (typeMatch === 'single') {
                    console.log('Матч типа "single"');
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