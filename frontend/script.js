const fqdn = `${window.location.protocol}//${window.location.host}`;

const validateAmlForm = document.getElementById("validateAmlForm");
validateAmlForm.addEventListener("submit", submitValidateAmlForm);

const getMLFBForm = document.getElementById("getMLFBForm");
getMLFBForm.addEventListener("submit", submitGetMLFBForm);

const getValuesForm = document.getElementById("getValuesForm");
getValuesForm.addEventListener("submit", submitGetValuesForm);

function submitValidateAmlForm(e) {
    this.classList.add("disabledForm");
    document.getElementById('validateAmlResult').innerText = "";
    e.preventDefault();
    const files = document.getElementById("file");
    const formData = new FormData();
    formData.append("file", files.files[0]);
    fetch(`${fqdn}/api/AmlValidation`, {
        method: 'POST',
        body: formData
    }).then((response) => response.json())
        .then((data) => {
            const output = data.result.split("\r\n");
            var newline = String.fromCharCode(13, 10);
            document.getElementById('validateAmlResult').innerText = output.join(newline);
        })
        .catch((err) => ("Error occured", err))
        .finally(() => this.classList.remove("disabledForm"));
}

function submitGetMLFBForm(e) {
    this.classList.add("disabledForm");
    document.getElementById('getMLFBResult').innerText = "";
    e.preventDefault();
    fetch(`${fqdn}/api/Values/5`, {
        method: 'GET',
    }).then((response) => response.json())
        .then((data) => {
            document.getElementById('getMLFBResult').innerText = data.result;
        })
        .catch((err) => ("Error occured", err))
        .finally(() => this.classList.remove("disabledForm"));
}


function submitGetValuesForm(e) {
    this.classList.add("disabledForm");
    document.getElementById('getValuesResult').innerText = "";
    e.preventDefault();
    fetch(`${fqdn}/api/Values`, {
        method: 'GET',
    }).then((response) => response.json())
        .then((data) => {
            document.getElementById('getValuesResult').innerText = data.result;
        })
        .catch((err) => ("Error occured", err))
        .finally(() => this.classList.remove("disabledForm"));
}