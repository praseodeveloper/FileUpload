const fqdn = `${window.location.protocol}//${window.location.host}`;
const form = document.getElementById("form");
form.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();
    const files = document.getElementById("files");
    const formData = new FormData();
    formData.append("file", files.files[0]);
    fetch(`${fqdn}/upload`, {
        method: 'POST',
        body: formData
    }).then((response) => response.json())
        .then((data) => {
            if (data && data.wordCount) {
                document.getElementById('result').innerText = `The word count is ${data.wordCount}`;
            } else {
                alert("Invalid response from server");
            }
        })
        .catch((err) => ("Error occured", err));
}
