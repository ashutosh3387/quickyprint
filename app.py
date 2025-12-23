from flask import Flask, render_template, request, send_file
from PyPDF2 import PdfMerger
import os
import uuid

MAX_FILES = 20
MAX_TOTAL_SIZE = 25 * 1024 * 1024  # 25 MB

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/privacy")
def privacy():
    return render_template("privacy.html")

@app.route("/terms")
def terms():
    return render_template("terms.html")

@app.route("/merge", methods=["POST"])
def merge_pdfs():
    files = request.files.getlist("pdfs")

    # -------- LIMITS --------
    MAX_FILES = 20
    MAX_TOTAL_SIZE = 25 * 1024 * 1024  # 25 MB

    if not files:
        return "No files selected", 400

    if len(files) > MAX_FILES:
        return "Maximum 20 PDF files allowed", 400

    total_size = 0
    for f in files:
        f.seek(0, 2)
        total_size += f.tell()
        f.seek(0)

    if total_size > MAX_TOTAL_SIZE:
        return "Total file size must be under 25 MB", 400

    # -------- MERGE --------
    merger = PdfMerger()
    temp_files = []

    try:
        for f in files:
            temp_name = f"{uuid.uuid4()}.pdf"
            temp_path = os.path.join(UPLOAD_FOLDER, temp_name)

            f.save(temp_path)
            temp_files.append(temp_path)
            merger.append(temp_path)

        output_path = os.path.join(
            UPLOAD_FOLDER,
            "merged-by-quickyprint.pdf"
        )

        merger.write(output_path)
        merger.close()

        return send_file(
            output_path,
            as_attachment=True,
            download_name="merged-by-quickyprint.pdf"
        )

    finally:
        # -------- AUTO DELETE --------
        for path in temp_files:
            try:
                os.remove(path)
            except:
                pass

        try:
            if os.path.exists(output_path):
                os.remove(output_path)
        except:
            pass

if __name__ == "__main__":
    app.run(debug=False)
