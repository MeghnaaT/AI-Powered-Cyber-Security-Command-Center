document.getElementById("uploadForm").addEventListener("submit", async function(event){  //locates the form with id uploadForm for binding behaviour, adds a listeneer for the submit event, declares the callback as async to use await inside for cleaner asynchronomous code
    event.preventDefault();  //stops the browser native from submission. Allows handling via js and fetch

    const fileInput = document.getElementById("fileInput");  //grabs the file input element
    const formData = new FormData(); // Creates the FormData Object, which encodes data as multipart/form-data suitable for file uploads without manual headers
    formData.append("file", fileInput.files[0]); //appends the first selected file under the key"file". This must match yourserver's expected field name in flask.

    document.getElementById("result").style.display = "block"; //Ensure that the results container is visibe before showing progress or output
    document.getElementById("result").innerHTML = "Scanning file...";  //provides immediate user feedback indicating the result is in progress
    let response = await fetch("/analyze", {  //posts the FormData to the backend endpoint "/analyze". , omits Content-TypeError; the browser sets the correct boundary for multipart/form-data when FormData is used ,  pauses until the server responds, returning a Response object
        method: "POST",
        body: formData
    });

    let data = await response.text(); // extracts the response payload a splain text. Use .json() if the server returns JSON, or .text() for HTML/plain output.
    document.getElementById("result").innerHTML= data;  //injects the server's returned text directly into the result container. If it;s HTML, it will render; if text, it will display as-is.

});  //closes handler: checks the event listener callback