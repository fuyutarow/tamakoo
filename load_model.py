#( -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, abort, make_response, send_from_directory, redirect
import os
import json
import string
import random
from random import randint
randstr = lambda n : ''.join([random.choice(string.ascii_letters + string.digits) for i in range(n)])
randcolor = lambda : '#'+str(random.randint(0,16777215))#ffffff

import secure
from neo4jrestclient.client import GraphDatabase
url = secure.url
gdb = GraphDatabase(url)

import numpy as np
import gensim
from gensim.models import doc2vec
from sklearn.metrics.pairwise import cosine_similarity

try:
    import MeCab
    mecab = MeCab.Tagger('-Owakati -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd/')
    wakati = lambda sentence: gensim.utils.simple_preprocess(mecab.parse(sentence), min_len=1)
    print('using mecab')
except:
    wakati = lambda sentence: gensim.utils.simple_preprocess(sentence, min_len=1)
    print('running without mecab')

if __name__ == '__main__':
    model_name = 'echo_models/tamakoo.running.doc2vec.model'

    model = gensim.models.Doc2Vec.load(model_name)


