class Board:
    def __init__(self):
        # Инициализация пустой доски 3x3
        self.__board = [[' ' for _ in range(3)] for _ in range(3)]

    def get_board(self):
        return self.__board

    def display_board(self):
        # Отображение текущего состояния доски
        for row in self.__board:
            print('|'.join(row))
            print('-----')

    def make_move(self, row, col, symbol):
        # Совершение хода игроком
        if self.__board[row][col] == ' ':
            self.__board[row][col] = symbol
            return ['true']
        else:
            return ["false"]

    def check_win(self, symbol):
        # Проверяем по горизонталям
        for row in range(3):
            if self.__board[row][0] == self.__board[row][1] == self.__board[row][2] == symbol:
                return [f'row_{row + 1}']

        # Проверяем по вертикалям
        for col in range(3):
            if self.__board[0][col] == self.__board[1][col] == self.__board[2][col] == symbol:
                return [f'column_{col + 1}']

        # Проверяем диагонали
        if self.__board[0][0] == self.__board[1][1] == self.__board[2][2] == symbol:
            return ['diagonal_1']
        if self.__board[0][2] == self.__board[1][1] == self.__board[2][0] == symbol:
            return ['diagonal_2']

        # Если нет победителя
        return ['false']

    def check_full(self):
        # Проверка на заполненность доски
        for row in self.__board:
            if ' ' in row:
                return ['false']
        return ['true']
