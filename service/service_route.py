from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder="../view/templates", static_folder="../view/static/")


def start_flask():
    app.run(use_reloader=False)
    return app


@app.route('/service_worker_route', methods=['POST', 'GET'])
def service_route():
    if request.method == 'POST':
        message = request.json
        print(message)
        response = None
        return jsonify(response)


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/arena')
def arena():
    return render_template("arena.html")
