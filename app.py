import os
from flask import Flask, render_template, request, jsonify #core class to create your web app, serve html file in /templated folder, gives access to incoming HTTP request data
from flask_cors import CORS # enables Cross-Origin Resource Sharing, so your frontend(js) can call the Flask API even if hosted seperately
from file_analyzer import analyze_file #your custom function(from file_analyzer.py) that performs the actual file analysis

app = Flask(__name__)
CORS(app) #creates the flask app object, enables CORS for all routes so your frontend JS can make requests without being blocked by the browser tells flask where to look for resources

#Home page(upload UI)

@app.route("/") # route for root URL(/)
def index(): # function that runs when someone visits /
    return render_template("index.html") # on visiting root URL, flask looks for index.html in templates folder

#Analyze endpoint - receives uploaded file and returns JSON
@app.route("/analyze", methods=["POST"]) #defines a route /analyze that only accepts POST requests
def analyze():
    if "file" not in request.files:
        return jsonify({"error" : "empty filename"}), 400 
    #function that runs when a POST request is made to /analyze, checks if "file" is present in the uploaded files. If not, returns a JSON error with HTTP status 400(Bad request)
    
    uploaded_file = request.files["file"]  # retrieves the uploaded file object.
    if uploaded_file.filename == "":
        return jsonify({"error": "empty filename"}), 400 #if the filename is empty, returns an error
     # retrieves the uploaded file from the request. The key"file" must match the name="file" attribute in your HTML <input element.
    
    try: #analyze_file() function passing the uploaded file, takes a FileStorage object (werkzueg)
        result = analyze_file(uploaded_file)
        return jsonify(result)
    
    except Exception as e:  # e holds details about what went wrong
        return jsonify({"error" : str(e)}), 500 #catches the exception and returns JSON error with HTTP status 500(Internal server error)
        #str(e) converts the exception details to a string for inclusion in the JSON response, making it human-readable
if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000) #starts the server with the debugging enabled
#starts the flask development server on 127.0.0.1:5000
