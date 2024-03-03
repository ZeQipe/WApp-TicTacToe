import sys
from flask import Flask
from threading import Thread
from view.window import WebAppWindow
from PySide6.QtWidgets import QApplication


class Application:
    def __init__(self):
        self.flask = None
        self.window = None

    def run_server(self):
        app = Flask(__name__, template_folder="../view/", static_folder="../view/static/")
        app.run(use_reloader=False)

    def start(self):
        self.flask = Thread(target=self.run_server, daemon=True)
        self.flask.start()

        main_window = QApplication(sys.argv)
        self.window = WebAppWindow()
        self.window.show()
        sys.exit(main_window.exec())
