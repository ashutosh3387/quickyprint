const fileInput = document.getElementById("fileInput");
const fileCount = document.getElementById("fileCount");

if (fileInput) {
    fileInput.addEventListener("change", () => {
        const count = fileInput.files.length;
        fileCount.innerText =
            count > 0 ? count + " file(s) selected" : "No files selected";
    });
}
