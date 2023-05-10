updateResult = function () {
    const url = new URL(window.location.href);
    const cookieValue = document.cookie;
    if (cookieValue && cookieValue.includes("=")) {
        const wordCount = cookieValue.split("=")[1];
        if (wordCount) {
            document.getElementById('result').innerText = `The word count is ${wordCount}`;
            // Clear the cookie after use
            document.cookie = "result=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }
}