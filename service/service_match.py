import random

from core.match import Match


class ServiceMatch:
    __match = None
    __type = None

    # API
    @staticmethod
    def create_match(args):
        ServiceMatch.__type = args[0]
        ServiceMatch.__match = Match()
        if args[0] in ['server', 'client']:
            if not ServiceMatch.__match.set_opponent(ServiceMatch.__type):
                return ['false']

        return ['true']

    @staticmethod
    def set_player_figure(figure):
        if not ServiceMatch.__match.get_player_figure():
            ServiceMatch.__match.set_player_figure(figure[0])
            ServiceMatch.__match.set_opponent('single')
            return ['true', ServiceMatch.__match.get_current_player()]
        else:
            return ['false']

    @staticmethod
    def get_info_match():
        if ServiceMatch.__match:
            type_match = ServiceMatch.__type
            id_game = ServiceMatch.__match.get_lobby_id()
            return ['true', type_match, id_game]
        else:
            return ['false']

    @staticmethod
    def get_move_player(args):
        row, col = ServiceMatch._get_coordinates(args[0])

        if ServiceMatch.__type in ['single', 'server']:
            result = ServiceMatch.__match.set_move_player(row, col)

        elif ServiceMatch.__type == 'client':
            result = ServiceMatch.__match.send_move(row, col)

        else:
            result = False

        if not result:
            return ['false']

        response = ServiceMatch._get_send_response(args[0])
        ServiceMatch.__match.switch_player()
        return response

    @staticmethod
    def get_move_opponent():
        result = ServiceMatch.__match.set_opponent_move(ServiceMatch.__type)
        if not result:
            return ['false']
        index = ServiceMatch._get_index(result[0], result[1])
        response = ServiceMatch._get_send_response(index)
        ServiceMatch.__match.switch_player()
        return response

    @staticmethod
    def restart_match():
        ServiceMatch.__match = Match()
        return ['true']

    @staticmethod
    def close_match():
        ServiceMatch.__match = None
        ServiceMatch.__type = None
        return ['true']

    # Внутренние методы
    @staticmethod
    def _get_index(row, col) -> int:
        if 0 <= row <= 2 and 0 <= col <= 2:
            return row * 3 + col + 1

    @staticmethod
    def _get_coordinates(index) -> tuple:
        if 1 <= index <= 9:
            row = (index - 1) // 3
            col = (index - 1) % 3
            return row, col

    @staticmethod
    def _get_send_response(index_slot) -> list:
        full = 'true' if ServiceMatch.__match.get_board_is_not_full() else 'false'
        win = ServiceMatch.__match.get_win_combination()
        current_player = ServiceMatch.__match.get_current_player()
        index_img = random.randint(1, 20)
        id_game = ServiceMatch.__match.get_lobby_id()
        return ['true', current_player, index_img, index_slot, win, full, id_game]
