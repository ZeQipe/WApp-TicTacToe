import { sendMessageModel } from "./lib.js";

document.addEventListener('DOMContentLoaded', function() {
    // Обработка кликов
    document.getElementById('startBtnPrimary').addEventListener('click', function() {
        document.getElementById('primary').classList.add('fade-out');
        setTimeout(function() {
            document.getElementById('primary').style.display = 'none';
        }, 500);
        document.getElementById('main').classList.add('fade-in');
        document.getElementById('main').style.display = 'block';
        playClickSound();
    })

    document.getElementById('multiplayer-btn').addEventListener('click', function() {
        document.getElementById('main-container').style.display = 'none';
        document.getElementById('multiplayer-menu').style.display = 'grid';
    })

    document.getElementById('create-btn').addEventListener('click', function() {
        document.getElementById('multiplayer-menu').style.display = 'none';
        document.getElementById('waiting-screen').style.display = 'block';
    })
    
    document.getElementById('back-btn-waiting').addEventListener('click', function(){
        document.getElementById('multiplayer-menu').style.display = 'grid';
        document.getElementById('waiting-screen').style.display = 'none';
    });

    document.getElementById('search-btn').addEventListener('click', function() {
        document.getElementById('multiplayer-menu').style.display = 'none';
        document.getElementById('search-session').style.display = 'block';
    })

    document.getElementById('back-btn-search').addEventListener('click', function(){
        document.getElementById('multiplayer-menu').style.display = 'grid';
        document.getElementById('search-session').style.display = 'none';
    });

    document.getElementById('back-btn-multiplayer-menu').addEventListener('click', function() {
        document.getElementById('multiplayer-menu').style.display = 'none';
        document.getElementById('main-container').style.display = 'grid';
    })

    document.getElementById('settings-btn').addEventListener('click', function() {
        document.getElementById('main-container').style.display = 'none';
        document.getElementById('sound-settings').style.display = 'block';
    });

    document.getElementById('back-btn-sound-settings').addEventListener('click', function() {
        document.getElementById('sound-settings').style.display = 'none';
        document.getElementById('main-container').style.display = 'grid';
    })

    // Найстройки звука 
    function playClickSound() {
        const clickSound = document.getElementById('click-sound')
        clickSound.currentTime = 0;
        clickSound.play();
    }

});