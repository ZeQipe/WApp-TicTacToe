document.addEventListener('DOMContentLoaded', function() {
    // Константы 
    const buttons = document.querySelectorAll('.game_button')
    
    //Анимация кнопок
    function highlightButton(event) {
        event.target.style.transform = 'scale(1.1)';
        event.target.style.filter = 'brightness(1.2)';
    }
    
    function unhighlightButton(event) {
        event.target.style.transform = 'scale(1)';
        event.target.style.filter = 'brightness(1)';
    }

    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.target.style.transform = 'scale(0.9)';
            event.target.style.filter = 'brightness(1.1)';
            setTimeout(() => {
                event.target.style.transform = 'scale(1)';
                event.target.style.filter = 'brightness(1)';
            }, 50);
        });
        button.addEventListener('mouseenter', highlightButton);
        button.addEventListener('mouseleave', unhighlightButton);
    });


})

//механизм отправки сообщений и получения результата.
export function sendMessageModel(message) {
    const method = message.shift();
    return new Promise((resolve, reject) => {
        fetch('http://127.0.0.1:5000/service_worker_route', {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            console.log('Сообщение успешно отправлено.')
            return response.json()
        })
        .then(data => {
            // Проверяем, является ли полученный ответ списком
            if (Array.isArray(data)) {
                console.log('Ответ сервера:', data)
                resolve(data);
            } else {
                reject(new Error('Ошибка: полученный ответ не является списком.'))
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке сообщения:', error)
            reject(error)
        })
    })
}