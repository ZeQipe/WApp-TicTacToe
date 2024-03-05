import { sendMessageModel } from "./lib.js";

// Константы
var cursorX = ''
var cursorO = ''
const buttonDeck = document.querySelectorAll('.slot_button');
const interfaceButtons = document.querySelector('.interface-buttons');
const helper = document.getElementById('helper');
const helper2 = document.getElementById('helper2');
const elementsToDarken = [
    document.getElementById('background'),
    document.getElementById('deka'),
    document.getElementById('x'),
    document.getElementById('interface-button')
]
offButton()

document.addEventListener('DOMContentLoaded', function() {
    // Получение информации о матче
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

// Функции включения и отключения кнопок слотов
function offButton() {
    buttonDeck.forEach(button => {
        button.disabled = true;
    })
};

function onButton() {
    buttonDeck.forEach(button => {
        button.disabled = false;
    })
};

buttonDeck.forEach(function(button, index) {
    button.addEventListener('click', () => {
        movePlayer(index + 1);
    });
});

interfaceButtons.querySelectorAll('img').forEach(img => {
    img.style.pointerEvents = 'none';
});

//Выбор персонажа, если single match
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

    interfaceButtons.querySelectorAll('img').forEach(img => {
        img.style.pointerEvents = 'auto';
    });

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
                    onButton()
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

// Ход игрока
function movePlayer(index) {
    console.log('Ход игрока: ', index);

    offButton()

    sendMessageModel(['POST', 'move_player', index])
        .then(response => {
            if (response[0] === 'true') {
                console.log('Ход игрока успешно совершен.');

                setFigureInSlot(index, response[1], response[2])
                if (checkGameResult(response[4], response[5])) {
                    return;
                }

                getMoveOpponent();
            } else {
                console.error('Ошибка при совершении хода игрока.');
                onButton()
            }
        })

        .catch(error => {
            console.error('Ошибка при отправке запроса на ход игрока:', error);
            onButton()
        });
}

function getMoveOpponent() {
    sendMessageModel(['POST', 'move_opponent'])
        .then(response => {
            if (response[0] === 'true') {
                console.log('Ход оппонента успешно получен.');
                const opponentIndex = response[3];
                setFigureInSlot(opponentIndex, response[1], response[2]);
                checkGameResult();
                onButton()
            } else {
                console.error('Ошибка при получении хода оппонента.');
            }
        })
        .catch(error => {
            console.error('Ошибка при выполнении запроса на получение хода оппонента:', error);
        });
}

// Проверки на завершение игры
function setFigureInSlot(indexSlot, currentFigure, indexImg) {
    console.log(`Устанавливаем картинку в слот ${indexSlot} для фигуры ${currentFigure}, индекс картинки: ${indexImg}`);

    const slot = document.getElementById(`slot-${indexSlot}`);
    const src = `../static/resource/images/figure/${currentFigure} (${indexImg}).png`;

    slot.src = src;
    slot.style.transition = 'opacity 0.2s ease';
    slot.style.opacity = '1';
}

function checkGameResult(win, full) {
    console.log(`Проверяем результат игры: победная комбинация: ${win}, доска заполнена: ${full}`);

    // Если доска заполнена, игра завершена
    if (full === 'true') {
        console.log('Доска заполнена. Игра завершена.');

        const slotWin = document.querySelector('.slot-win');
        const src = `../static/resource/images/winner_line/${win}.png`;

        slotWin.src = src;
        slotWin.style.transition = 'opacity 0.5s ease';
        slotWin.style.opacity = '1';

        return true;
    }

    // Если есть победная комбинация, показываем соответствующую картинку
    if (win !== 'false') {
        console.log(`Найдена победная комбинация в слоте ${win}.`);

        return true;
    }

    // Если ни одно из условий не выполнено, игра продолжается
    console.log('Нет победной комбинации и доска не заполнена. Игра продолжается.');
    return false;
}

