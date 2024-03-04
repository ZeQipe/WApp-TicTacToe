from PySide6.QtCore import QObject, Signal
from tools.sounds_settings import sound_settings_instance as sound
from service.service_match import ServiceMatch as SerMatch


class SignalEmitter(QObject):
    window_close_signal = Signal()


def exit_app_route():
    signal_emitter.window_close_signal.emit()
    return ['message', 'OK']


signal_emitter = SignalEmitter()
request_handler = {
    'set_background_music': sound.set_background_music,
    'set_sound_effect': sound.set_sound_enabled,
    'set_sound_volume': sound.set_volume_level,
    'get_all_settings_sound': sound.get_all_settings,

    'create_match': SerMatch.create_match,
    'set_player_figure': SerMatch.set_player_figure,
    'info_match': SerMatch.get_info_match,
    'move_player': SerMatch.get_move_player,
    'move_opponent': SerMatch.get_move_opponent,
    'restart_match': SerMatch.restart_match,
    'close_match': SerMatch.close_match,

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

    key = message[0]
    args = message[1:] if len(message) > 1 else []
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
