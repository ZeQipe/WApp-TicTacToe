import sys
from threading import Thread
from view.window import WebAppWindow
from service.service_route import start_flask
from service.presenter import signal_emitter
from PySide6.QtWidgets import QApplication


class Application:
    def __init__(self):
        self.flask = None
        self.window = None

    def run_server(self):
        self.flask = start_flask()

    def start(self):
        run = Thread(target=self.run_server, daemon=True)
        run.start()

        main_window = QApplication(sys.argv)
        self.window = WebAppWindow()
        self.window.show()

        signal_emitter.window_close_signal.connect(self.window.close)

        sys.exit(main_window.exec())
