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
        setSoundsSettings()
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

    document.getElementById('exit-btn').addEventListener('click', function() {
        const message = ['POST', 'exit_app'];
        sendMessageModel(message)
            .then(response => {
                console.log(response);
                console.log('Выход выполнен успешно.');
            })
            .catch(error => {
                console.error('Ошибка при выполнении выхода:', error);
            });
    })

    //Настройки звука
    const soundCheckbox = document.getElementById('sound-checkbox')
    const backsoundsCheckbox = document.getElementById('backsounds-checkbox')
    const volumeSlider = document.getElementById('volume-slider')
    const audio = document.getElementById('background-audio')
    const clickSound = document.getElementById('click-sound')

    soundCheckbox.addEventListener('click', function(){
        sendMessageModel(['POST', 'set_sound_effect'])
        .then(response => {
            if (response.includes('true')) {
                setSoundsSettings();
                console.log('Звуковые эффекты включены.');
            } else {
                console.log('Ошибка отправки данных');
            }
        })
        .catch(error => {
            console.error('Ошибка при переключении звуковых эффектов:', error);
        });
    })

    backsoundsCheckbox.addEventListener('click', function() {
        sendMessageModel(['POST', 'set_background_music'])
        .then(response => {
            if (response.includes('true')) {
                setSoundsSettings();
                console.log('Фоновая музыка включена.');
            } else {
                console.log('Ошибка при отправке сообщения');
            }
        })
        .catch(error => {
            console.error('Ошибка при переключении фоновой музыки:', error);
        });
    })

    volumeSlider.addEventListener('input', function() {
        const volumeLevel = volumeSlider.value;
        sendMessageModel(['POST', 'set_sound_volume', volumeLevel])
            .then(response => {
                console.log('Уровень звука успешно установлен:', response);
                if (response.includes('true')) {
                    setSoundsSettings();
                }})
            .catch(error => {
                console.error('Ошибка при установке уровня звука:', error);
            });
    });

    function setSoundsSettings() {
        sendMessageModel(['POST', 'get_all_settings_sound'])
            .then(response => {
                if (Array.isArray(response) && response.length >= 3) {
                    const [backgroundMusic, soundEffect, soundLevel] = response;
    
                    if (backgroundMusic === 'True') {
                        backsoundsCheckbox.src = '../static/resource/images/sound-true.png';
                    } else {
                        backsoundsCheckbox.src = '../static/resource/images/sound-false.png';
                    }
                    toggleMusic(backgroundMusic)
    
                    const soundLevelValue = parseInt(soundLevel);
                    volumeSlider.value = soundLevelValue;
                    setAudioVolume(soundLevelValue)

                    if (soundEffect === 'True') {
                        soundCheckbox.src = '../static/resource/images/sound-true.png';
                        toggleClickSound(soundLevelValue)
                    } else {
                        soundCheckbox.src = '../static/resource/images/sound-false.png';
                        toggleClickSound(soundEffect)
                    }

                } else {
                    console.log('Ошибка: Получены некорректные настройки звука.');
                }
            })
            .catch(error => {
                console.error('Ошибка при установке настроек звука:', error);
            })}

    function toggleMusic(state) {
        if (state === 'True') {
            audio.play();
        } else {
            audio.pause();
        }
    }

    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play();
    }

    function toggleClickSound(state) {
        if (state === 'False') {
            clickSound.volume = 0.0;
        } else if (!isNaN(state)) {
            const volume = parseFloat(state);
            clickSound.volume = volume / 100;
        }
    }

    function setAudioVolume(volume) {
        if (audio) {
            audio.volume = volume / 100;
        } else {
            console.error('Элемент аудио не найден.');
        }
    }
});