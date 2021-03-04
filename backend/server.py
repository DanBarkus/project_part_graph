import os
import pyTigerGraph as tg
import flask
from flask import request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = flask.Flask(__name__)
cors = CORS(app)

TOKEN = os.getenv('TGTOKEN')
HOST = os.getenv('HOST')
GRAPH = os.getenv('GRAPH')
USER = os.getenv('USER')
PASS = os.getenv('PASS')

connection = tg.TigerGraphConnection(host=HOST, graphname=GRAPH, username=USER, password=PASS, apiToken=TOKEN)

def buildParams(inJson):
    paramString = ""
    for key, value in inJson.items():
        try:
            for val in value:
                paramString += key+"="+val+"&"
        except:
            paramString += key+"="+str(value)+"&"
    paramString = paramString[:-1]
    return paramString

@app.route('/', methods=['GET'])
def home():
    return '''<h1>Welcome to the API Page! You shouldn't be seeing this</h1>'''

@app.route('/api/get_articles_and_parts', methods=['GET'])
def api_find_a_p():
    d = request.args.get('words')
    words = d.split(',')
    params = {'searchWords': words, 'thresh': 50}
    params = buildParams(params)
    ret = connection.runInstalledQuery("get_articles_and_parts", params)
    return jsonify(ret)

@app.route('/api/get_articles_from_part', methods=['GET'])
def api_find_a_f_p():
    d = request.args.get('part')
    params = {'inPart': d, 'thresh': 50}
    ret = connection.runInstalledQuery("get_articles_from_part", params)
    return jsonify(ret)

@app.route('/api/get_parts_from_article', methods=['GET'])
def api_find_p_f_a():
    d = request.args.get('article')
    params = {'inArticle': d, 'thresh': 50}
    ret = connection.runInstalledQuery("get_parts_from_article", params)
    return jsonify(ret)


app.run()