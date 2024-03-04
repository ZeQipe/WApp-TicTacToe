import random
import time


class Bot:
    def __init__(self, symbol):
        self.__symbol = symbol

    def get_symbol(self):
        return self.__symbol

    def set_symbol(self, symbol):
        self.__symbol = symbol

    def make_move(self, board):
        # Имитируем мыслительный процесс
        time.sleep(random.randint(1, 3))
        # Проверяем, есть ли возможность выиграть следующим ходом
        for row in range(3):
            for col in range(3):
                if board[row][col] == ' ':
                    board[row][col] = self.__symbol
                    if self._check_win(board, self.__symbol):
                        board[row][col] = ' '
                        return row, col
                    board[row][col] = ' '

        # Проверяем, есть ли у противника возможность выиграть следующим ходом и блокируем его
        opponent_symbol = 'x' if self.__symbol == 'y' else 'y'
        for row in range(3):
            for col in range(3):
                if board[row][col] == ' ':
                    board[row][col] = opponent_symbol
                    if self._check_win(board, opponent_symbol):
                        board[row][col] = ' '
                        return row, col
                    board[row][col] = ' '

        # Если ни одно из условий не выполнилось, делаем случайный ход
        row = random.randint(0, 2)
        col = random.randint(0, 2)
        while board[row][col] != ' ':
            row = random.randint(0, 2)
            col = random.randint(0, 2)
        return row, col

    @staticmethod
    def _check_win(board, symbol):
        # Проверяем по горизонталям, вертикалям и диагоналям
        for i in range(3):
            if all(board[i][j] == symbol for j in range(3)) or \
                    all(board[j][i] == symbol for j in range(3)):
                return True
        if all(board[i][i] == symbol for i in range(3)) or \
                all(board[i][2 - i] == symbol for i in range(3)):
            return True
        return False
