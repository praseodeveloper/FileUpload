const fqdn = `${window.location.protocol}//${window.location.host}`;

//---------- FORM submit event handlers ------------------

const getValuesForm = document.getElementById("getValuesForm");
getValuesForm.addEventListener("submit", submitGetValuesForm);

const getMLFBForm = document.getElementById("getMLFBForm");
getMLFBForm.addEventListener("submit", submitGetMLFBForm);

const validateAmlForm = document.getElementById("validateAmlForm");
validateAmlForm.addEventListener("submit", submitValidateAmlForm);

//---------- Event handler implementation ------------------

function submitGetValuesForm(e) {
    this.classList.add("disabledForm");
    document.getElementById("getValuesBusyImg").classList.add("activeLoader");
    document.getElementById('getValuesResult').innerText = "";
    e.preventDefault();
    fetch(`${fqdn}/api/Values`, {
        method: 'GET',
    }).then((response) => response.json())
        .then((data) => {
            document.getElementById('getValuesResult').innerText = data.result;
        })
        .catch((err) => ("Error occured", err))
        .finally(() => {
            this.classList.remove("disabledForm");
            document.getElementById("getValuesBusyImg").classList.remove("activeLoader");
        });
}

function submitGetMLFBForm(e) {
    this.classList.add("disabledForm");
    document.getElementById("getMLFBBusyImg").classList.add("activeLoader");
    document.getElementById('getMLFBResult').innerText = "";
    e.preventDefault();
    fetch(`${fqdn}/api/Values/5`, {
        method: 'GET',
    }).then((response) => response.json())
        .then((data) => {
            document.getElementById('getMLFBResult').innerText = data.result;
        })
        .catch((err) => ("Error occured", err))
        .finally(() => {
            this.classList.remove("disabledForm");
            document.getElementById("getMLFBBusyImg").classList.remove("activeLoader");
        });
}

function submitValidateAmlForm(e) {
    this.classList.add("disabledForm");
    document.getElementById("validateAmlBusyImg").classList.add("activeLoader");
    document.getElementById('validateAmlResult').innerHTML = "";
    e.preventDefault();
    const files = document.getElementById("file");
    const formData = new FormData();
    formData.append("file", files.files[0]);
    fetch(`${fqdn}/api/AmlValidation`, {
        method: 'POST',
        body: formData
    }).then((response) => response.json())
        .then((data) => {
            document.getElementById('validateAmlResult').innerHTML = data.result;
        })
        .catch((err) => ("Error occured", err))
        .finally(() => {
            this.classList.remove("disabledForm");
            document.getElementById("validateAmlBusyImg").classList.remove("activeLoader");
        });
}