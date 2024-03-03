from core.match import Match


class ServiceMatch:
    __match = None
    __type = None

    @staticmethod
    def create_match(type_match):
        ServiceMatch.__match = Match(type_match)
        return ['true', ServiceMatch.__match.get_lobby_id]

    @staticmethod
    def get_move_player():
        pass

    @staticmethod
    def get_move_opponent():
        pass

    @staticmethod
    def restart_match():
        pass

    @staticmethod
    def close_match():
        pass

    @staticmethod
    def _get_index(row, column) -> int:
        pass

    @staticmethod
    def _get_coordinates(index) -> tuple:
        pass





