from flask import Flask, render_template, request #core class to create your web app, serve html file in /templated folder, gives access to incoming HTTP request data

app = Flask(__name__) #creates the flask app object, tells flask where to look for resources

@app.route("/") #route for root URL(/)
def home(): #function that runs when someone visits /
    return render_template("index.html") #on visiting root URL, flask looks for index.html in templates folder

@app.route("/analyze", methods=["POST"]) #defines a route /analyze that only accepts POST requests
def analyze_file(): #function that runs when a POST request is made to /analyze
    uploaded_file = request.files["file"]  # retrieves the uploaded file from the request. The key"file" must match the name="file" attribute in your HTML <input element.
    filename = uploaded_file.filename #extracts the original filename of the uploaded file

    return f"<h3>File Recieved: {filename}</h3><p>Full analysis will appear in step 4.</p>"  # sends back an HTML response showing the filename and a placeholder meessage
    # h3 is a third-level heading. It is one of the 6 HTML heading elements
        
if __name__ == "__main__":
    app.run(debug=True) #starts the server with the debugging enabled

