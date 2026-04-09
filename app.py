from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)
CORS(app)  

model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

np.random.seed(42)

product_db = {
    "Laptop": np.random.rand(2048),
    "Shoes": np.random.rand(2048),
    "Watch": np.random.rand(2048),
    "Phone": np.random.rand(2048)
}

@app.route('/')
def home():
    return render_template('index.html')

def extract_features(img_path):
    img = image.load_img(img_path, target_size=(224,224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    features = model.predict(img_array, verbose=0)
    return features.flatten()

@app.route('/search', methods=['POST'])
def search():
    file = request.files.get('image')

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    path = "temp_" + str(np.random.randint(10000)) + ".jpg"
    file.save(path)

    query_features = extract_features(path)

    best_match = None
    best_score = -1

    for name, feat in product_db.items():
        score = cosine_similarity([query_features], [feat])[0][0]
        if score > best_score:
            best_score = score
            best_match = name

    if os.path.exists(path):
        os.remove(path)

    return jsonify({"result": best_match})

if __name__ == '__main__':
    app.run(debug=True)