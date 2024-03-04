from core.bot import Bot
from random import randint
from core.board import Board


class Match:
    current_match = None

    def __init__(self):
        self.__board = Board()
        self.__opponent = None
        self.__current_player = 'x'
        self.__player_figure = None
        self.__lobby_id = ''.join([f'{randint(0, 9)}' for _ in range(4)])

    def set_opponent(self, type_match):
        if type_match == 'single':
            self.__opponent = Bot('o')
        elif type_match == 'server':
            self.__opponent = 'Client'
            self.__player_figure = 'x'
        elif type_match == 'client':
            self.__opponent = 'server'
            self.__player_figure = 'o'
        return True if self.__opponent else False

    def get_current_player(self):
        return self.__current_player

    def get_player_figure(self):
        return self.__player_figure

    def set_player_figure(self, value):
        self.__player_figure = value

    def get_lobby_id(self):
        return self.__lobby_id

    def switch_player(self):
        self.__current_player = "x" if self.__current_player == 'o' else 'o'

    def get_board_is_not_full(self):
        return self.__board.check_not_full()

    def get_win_combination(self):
        return self.__board.check_win(self.__current_player)

    def set_move_player(self, row, col):
        return self.__board.make_move(row, col, self.__player_figure)

    def send_move(self, row, col):
        pass

    def set_opponent_move(self, type_match):
        match type_match:
            case 'single':
                row, col = self.__opponent.make_move(self.__board.get_board())
                return row, col

            case 'server':
                return True

            case 'client':
                return True

        return False
