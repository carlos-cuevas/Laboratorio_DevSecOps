from flask import Flask, render_template, request, redirect, session
import sqlite3
import config

app = Flask(__name__)
app.secret_key = config.SECRET_KEY

password1="Hola"

def get_db():
    conn = sqlite3.connect(config.DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def index():
    if "user" in session:
        return redirect("/dashboard")
    return redirect("/login")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = get_db()
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, password)
        )

        conn.commit()
        conn.close()

        return redirect("/login")

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = get_db()
        cur = conn.cursor()

        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
        print(query)
        user = cur.execute(query).fetchone()

        if user:
            session["user"] = user["username"]
            return redirect("/dashboard")

    return render_template("login.html")


@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect("/login")

    results = []

    if request.args.get("search"):
        search = request.args.get("search")

        conn = get_db()
        cur = conn.cursor()

        # SQL Injection intencional
        query = f"SELECT * FROM users WHERE username LIKE '%{search}%'"

        results = cur.execute(query).fetchall()

    return render_template("dashboard.html", results=results)


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

if __name__ == "__main__":
    app.run(debug=True)