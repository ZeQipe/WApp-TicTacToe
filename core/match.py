from core.bot import Bot
from random import randint
from core.board import Board


class Match:
    current_match = None

    def __init__(self, type_match):
        self.__board = Board()
        self.__opponent = None
        self.__current_player = 'x'
        self.__player_figure = None
        self.__lobby_id = ''.join([f'{randint(0, 9)}' for _ in range(4)])
        self.__set_opponent(type_match)
        self.__win_combination = False

    def get_current_player(self):
        return self.__current_player

    def switch_player(self):
        self.__current_player = "x" if self.__current_player == 'o' else 'o'

    def set_player_figure(self, value):
        self.__player_figure = value

    def __set_opponent(self, type_match):
        if type_match == 'single':
            self.__opponent = Bot('x' if self.__player_figure == 'o' else 'o')

    def get_lobby_id(self):
        return self.__lobby_id

    def set_move_player(self, row, col):
        if self.__board.make_move(row, col, self.__player_figure):
            winner = self.__board.check_win(self.__player_figure)
            full = self.__board.check_not_full()
            if winner or full:
                return winner if winner else 'full'
            return True
        else:
            return False

    def set_opponent_move(self, type_match):
        match type_match:
            case 'single':
                row, col = self.__opponent.make_move(self.__board.get_board())
                if self.__board.make_move(row, col, self.__opponent.get_symbol()):
                    winner = self.__board.check_win(self.__player_figure)
                    full = self.__board.check_not_full()
                    if winner or full:
                        return winner if winner else 'full'
                    return True, row, col

            case 'server':
                return True

            case 'client':
                return True

        return
