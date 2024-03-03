from PySide6.QtWidgets import QMainWindow
from PySide6.QtCore import QUrl
from PySide6.QtWebEngineWidgets import QWebEngineView


class WebAppWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("TicTacToe ^-^")
        self.setFixedSize(1060, 600)

        self.webview = QWebEngineView()
        self.webview.setUrl(QUrl("http://127.0.0.1:5000"))
        self.setCentralWidget(self.webview)

    def close_window(self):
        self.close()
