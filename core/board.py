class Board:
    def __init__(self):
        # Инициализация пустой доски 3x3
        self.__board = [[' ' for _ in range(3)] for _ in range(3)]

    def get_board(self):
        return self.__board

    def make_move(self, row, col, symbol):
        if self.__board[row][col] == ' ':
            self.__board[row][col] = symbol
            return True
        else:
            return False

    def check_win(self, symbol) -> str or bool:
        # Проверяем по горизонталям
        for row in range(3):
            if self.__board[row][0] == self.__board[row][1] == self.__board[row][2] == symbol:
                return f'row_{row + 1}'

        # Проверяем по вертикалям
        for col in range(3):
            if self.__board[0][col] == self.__board[1][col] == self.__board[2][col] == symbol:
                return f'col_{col + 1}'

        # Проверяем диагонали
        if self.__board[0][0] == self.__board[1][1] == self.__board[2][2] == symbol:
            return 'diag_1'
        if self.__board[0][2] == self.__board[1][1] == self.__board[2][0] == symbol:
            return 'diag_2'

        # Если нет победителя
        return 'false'

    def check_not_full(self):
        for row in self.__board:
            if ' ' in row:
                return True
        return False
