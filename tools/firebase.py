import json
import firebase_admin
from firebase_admin import credentials, db
import os


class SFirebase:
    def __init__(self):
        self.listener = False
        cred = credentials.Certificate('path-your-json-file')
        firebase_admin.initialize_app(cred)
        self.__db = db.reference("/sessions", url='https://tictactoe-server-4fd4e-default-rtdb.firebaseio.com')

    # Приватные методы
    def __read_session(self, session_id):
        ref = self.__db.child(session_id)
        return ref.get()

    def __write_session_data(self, session_id, data):
        ref = self.__db.child(session_id)
        ref.set(data)

    def __update_session_data(self, session_id, updates):
        ref = self.__db.child(session_id)
        ref.update(updates)

    # API
    def create_match(self, id_lobby):
        if not id_lobby.isdigit() or len(id_lobby) != 4:
            raise ValueError("Invalid lobby ID. Lobby ID must be a four-digit number.")

        match_data = {
            "current_player": "x",
            "last_move": False,
            "host": True,
            "opponent": False,
            "status_lobby": True
        }

        self.__write_session_data(id_lobby, match_data)

    def close_match(self, id_lobby):
        self.__db.child(id_lobby).delete()

    def get_all_lobby(self):
        all_sessions = self.__db.get()

        lobby_status = {}

        for id_lobby, session_data in all_sessions.items():
            lobby_status[id_lobby] = session_data.get("status_lobby", False)

        return json.dumps(lobby_status)

    def connect_match(self, id_lobby):
        session_data = self.__read_session(id_lobby)

        if session_data and session_data.get("status_lobby", False) == True:
            self.__update_session_data(id_lobby, {"status_lobby": False})
            self.__update_session_data(id_lobby, {"opponent": True})

            return session_data
        else:
            return None

    def get_value(self, session_id, key):
        session_data = self.__read_session(session_id)
        if session_data:
            return session_data.get(key)
        else:
            return None

    def set_value(self, session_id, key, value):
        session_data = self.__read_session(session_id)
        if session_data:
            session_data[key] = value
            self.__write_session_data(session_id, session_data)