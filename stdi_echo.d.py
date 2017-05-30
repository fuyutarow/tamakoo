import argparse

parser = argparse.ArgumentParser(description='tamakoo echo')
parser.add_argument('--dir','-d', required=True,
                    help='input sentense')
parser.add_argument('--number','-n',default=100, type=int,
                    help='numberof output sentense')
args = parser.parse_args()

import sys
import time
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

import gensim
from gensim import models
from gensim.models import doc2vec
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import MeCab
mecab = MeCab.Tagger("-Owakati -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd/")

def echo(toot, n_res):
    vec = model.infer_vector(s2w(toot))
    sims = cosine_similarity([vec], doc_vecs)
    index = np.argsort(sims[0])[::-1]
    
    ret = ""
    for i in range(n_res):
        ret+=''.join(doc[index[i]].split(' '))+"\n"
    return ret

class Handler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return 

        time = event.src_path.split('.')[1]
        echo_file = './echos/echo.'+time+'.txt'
        with open(echo_file,'w') as f:
            read = open(event.src_path).read()
            #f.write(echo(read, args.number))
            vec = model.infer_vector(s2w(read))
            sims = cosine_similarity([vec], doc_vecs)
            index = np.argsort(sims[0])[::-1]
            
            ret = ""
            for i in range(args.number):
                ret+=''.join(doc[index[i]].split(' '))+"\n"
            f.write(ret)
           
        print(ret)

if __name__ == "__main__":
    #s2w = lambda sentence: gensim.utils.simple_preprocess(mecab.parse(sentence), min_len=1)
    s2w = lambda sentence: gensim.utils.simple_preprocess(sentence, min_len=1)
    model = gensim.models.Doc2Vec.load("tamakoo_model/oz_doc2vec170529.model")
    doc = open("toots/oz_wakatiall.txt", 'r').read().split('\n')
    #doc_vecs = [ model.infer_vector(s2w(mecab.parse(line))) for line in doc]
    doc_vecs = [ model.infer_vector(s2w(line)) for line in doc]
    
    event_handler = Handler()
    observer = Observer()
    observer.schedule(event_handler, args.dir, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

