const buttons_game = document.querySelectorAll('.game_button')
console.log('true')

buttons_game.forEach(button => {
    console.log('cicle')
    button.addEventListener('click', function(event) {
        event.target.style.transform = 'scale(0.9)';
        event.target.style.filter = 'brightness(1.2)';
        setTimeout(() => {
            event.target.style.transform = 'scale(1)';
            event.target.style.filter = 'brightness(1)';
        }, 50);
    });
});