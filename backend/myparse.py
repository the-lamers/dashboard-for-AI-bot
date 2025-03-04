import json
import pandas as pd
from collections import Counter

ORIFINAL_FILE_VAL = "val_set.json"
ORIFINAL_FILE_TRAIN = "train_set.json"
METRICS_FILE = "metrics.json"

def read_json_to_jsload(jsf):
    try:
        with open(jsf, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return

def read_json_to_df(jsf):
    try:
        with open(jsf, 'r', encoding='utf-8') as file:
            return pd.DataFrame(json.load(file))
    except FileNotFoundError:
        return pd.DataFrame()
    
def base_mtrx(dfobj):
    l = []
    for i in dfobj.columns.tolist():
        l.append(dict(Counter(dfobj[i].apply(lambda x: str(x) if isinstance(x, list) else x).tolist())))
    return l

def answer_view(col, var):
    l = []
    for i in range(len(var)):
        l.append(dict(zip(var[i].keys(), var[i].values())))
    return{word: dict_ for word, dict_ in zip(col, l)}

def toJson(res):
    with open('out_data.json', 'w', encoding='utf-8') as json_file:
        json.dump(res, json_file, ensure_ascii=False, indent=4)

toJson(answer_view(read_json_to_df(ORIFINAL_FILE_TRAIN).columns.tolist(), base_mtrx(read_json_to_df(ORIFINAL_FILE_TRAIN))))