const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const fileCount = document.getElementById("fileCount");
const mergeBtn = document.getElementById("mergeBtn");
const spinner = document.getElementById("spinner");
const btnText = document.getElementById("btnText");

let files = [];

fileInput.addEventListener("change", () => {
  for (let file of fileInput.files) {
    files.push(file);
  }
  renderList();
});

function renderList() {
  fileList.innerHTML = "";
  fileCount.textContent = `${files.length} PDF(s) selected`;

  files.forEach((file, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${file.name}
      <button onclick="removeFile(${index})">✖</button>
    `;
    fileList.appendChild(li);
  });
}

function removeFile(index) {
  files.splice(index, 1);
  renderList();
}

mergeBtn.addEventListener("click", async () => {
  if (files.length === 0) {
    alert("Please select at least one PDF");
    return;
  }

  // show loader
  mergeBtn.disabled = true;
  document.getElementById("btnText").innerText = "Merging...";
  document.getElementById("spinner").style.display = "inline-block";

  // 🔥 FORCE UX DELAY (1.5 sec)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const formData = new FormData();
  files.forEach(f => formData.append("pdfs", f));

  try {
    const res = await fetch("/merge", {
      method: "POST",
      body: formData
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged-by-quickyprint.pdf";
    a.click();

    URL.revokeObjectURL(url);
  } catch (e) {
    alert("Merge failed");
  }

  // reset button
  mergeBtn.disabled = false;
  document.getElementById("btnText").innerText = "Merge & Download";
  document.getElementById("spinner").style.display = "none";
});


