from flask import Flask, request, jsonify
from myparse import read_json_to_jsload
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('api/data', methods=['GET'])
def get_data():
    data = read_json_to_jsload("out_data.json")
    category = request.args.get('category', "").strip()
    key =  request.args.get('key', "").strip()

    if category:
        if category in data and key in data[category]:
            return jsonify({key: data[category][key]})
        else:
            return jsonify({"error": "Ключ не найден в данной категории или категория не найдена, а не уверен ты, потому что ты ИНДУС!"}), 404
    else:
        return jsonify(data)
            
if __name__ == "__main__":
  app.run(debug=True)
