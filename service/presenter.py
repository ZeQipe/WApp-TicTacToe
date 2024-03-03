from flask import jsonify, request
from PySide6.QtCore import QObject, Signal
from tools.sounds_settings import sound_settings_instance


class SignalEmitter(QObject):
    window_close_signal = Signal()


def exit_app_route():
    signal_emitter.window_close_signal.emit()
    return ['message', 'OK']


signal_emitter = SignalEmitter()
request_handler = {
    'set_background_music': sound_settings_instance.set_background_music,
    'set_sound_effect': sound_settings_instance.set_sound_enabled,
    'set_sound_volume': sound_settings_instance.set_volume_level,
    'get_all_settings_sound': sound_settings_instance.get_all_settings,
    
    'exit_app': exit_app_route
}


def handler_message(message: list) -> list:
    """
    Обработка сообщения от service worker.
    :param message: list ['key', *args]
    :return: list
    """
    if not isinstance(message, list):
        return ['error', 'Invalid message format']

    if len(message) < 1:
        return ['error', 'Empty message']
    print(message)

    key = message[0]
    args = message[1:] if len(message) > 1 else []
    print(args)
    func = request_handler[key]
    if key not in request_handler:
        return ['error', f'Key "{key}" not found']

    try:
        if args:
            return func(args)
        else:
            return func()
    except Exception as e:
        return ['error', str(e)]
