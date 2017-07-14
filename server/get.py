#( -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, abort, make_response, send_from_directory, redirect
import os
import json
import string

import secure
from neo4jrestclient.client import GraphDatabase
url = secure.url
gdb = GraphDatabase(url)

from datetime import datetime

def account(id_or_alias):
    if type(id_or_alias) is int:
        account_id = id_or_alias
        line = gdb.query('''
            MATCH (a:Account) WHERE ID(a)=%s
            RETURN ID(a), a.alias, a.bio, a.color
            '''%(account_id))[0]
    else:
        account_alias = id_or_alias
        line = gdb.query('''
            MATCH (a:Account) WHERE a.alias="%s"
            RETURN ID(a), a.alias, a.bio, a.color
            '''%(account_alias))[0]
    account =  {
        'id': line[0],
        'alias': line[1],
        'bio': 'None' if line[2]==None else line[2],
        'color': line[3],
    }
    return account

def anchoring_cards(note_id, amount=100):
    cards = []
    for line in gdb.query('''
        MATCH p=(a:Note)-[r:Anchor]->(b:Note)<-[t:Toot]-(c:Account) WHERE ID(a)={}
        RETURN ID(c), c.name, t.when, ID(b), b.text, b.url, b.imgs
        '''.format(note_id))[:100]:
        depth1 = gdb.query('''
            MATCH p=(a:Note)<-[r:Anchor]-(b:Note) WHERE ID(a)={}
            RETURN COUNT(b)
            '''.format(line[3]))[0][0]
        card = {
            'account': {
                'id': line[0],
                'alias': line[1],
                },
            'note': {
                'id': line[3],
                'text': line[4],
                'url':'None' if line[5]==None else line[5],
                'imgs': line[6],
                'depth1': depth1,
                },
            'when': line[2],
            'mode': 'winded',
            }
        cards.append(card)
    return cards

def anchored_cards(note_id, amount=100):
    cards = []
    for line in gdb.query('''
        MATCH p=(a:Note)<-[r:Anchor]-(b:Note)<-[t:Toot]-(c:Account) WHERE ID(a)={}
        RETURN ID(c), c.name, t.when, ID(b), b.text, b.url, b.imgs
        '''.format(note_id))[:100]:
        depth1 = gdb.query('''
            MATCH p=(a:Note)<-[:Anchor]-(b:Note) WHERE ID(a)={}
            RETURN COUNT(b)
            '''.format(line[3]))[0][0]
        card = {
            'account': {
                'id': line[0],
                'alias': line[1],
                },
            'note': {
                'id': line[3],
                'text': line[4],
                'url':'None' if line[5]==None else line[5],
                'imgs': line[6],
                'depth1': depth1,
                },
            'when': line[2],
            'mode': 'winded',
            }
        cards.append(card)
    return cards

def hiscards(account_alias, amount):
    cards = []
    for line in gdb.query('''
        MATCH p=(a:Account)-[r:Toot]->(b:Note) WHERE a.alias="{}"
        RETURN ID(a), a.name, r.when, ID(b), b.text, b.url LIMIT {}
        '''.format( account_alias, amount )):
        cards.append({
            'account': {
                'id': line[0],
                'name': line[1],
                },
            'note': {
                'id': line[3],
                'text': line[4],
                'url':'None' if line[5]==None else line[5],
                },
            'when': line[2],
            'mode': 'drawn',
            })
    return cards

def get_card(note_id):
    line = gdb.query('''
        MATCH p=(a:Note)<-[t:Toot]-(c:Account) WHERE ID(a)={}
        RETURN ID(c), c.alias, t.when, ID(a), a.text, a.url, a.imgs
        '''.format(note_id))[0]
    depth1 = gdb.query('''
        MATCH p=(a:Note)<-[r:Anchor]-(b:Note) WHERE ID(a)={}
        RETURN COUNT(b)
        '''.format(line[3]))[0][0]
    card = {
        'account': {
            'id': line[0],
            'alias': line[1],
            },
        'note': {
            'id': line[3],
            'text': line[4],
            'url':'None' if line[5]==None else line[5],
            'imgs': line[6],
            'depth1': depth1,
            },
        'when': line[2],
        'mode': 'called',
        }
    return card

def wind_cards(note_id, amount=100):
    cnt_cards = 0

    now_card = get_card(note_id)
    now_card['mode'] = 'called'
    cnt_cards+=1

    tail_cards = anchored_cards(note_id, amount)
    head_cards = anchoring_cards(note_id, amount - len(tail_cards))
    
    cards = head_cards[::-1] + [now_card] + tail_cards
    return cards

def user(user_id):
    line =  gdb.query('\
        MATCH (a:User) WHERE ID(a)={}\
        RETURN ID(a), a.mailaddr, a.givenname, a.familyname, a.birthday, a.gender, a.since'\
        .format(user_id))[0]
    user = {
        'id': line[0],
        'mailaddr': line[1],
        'givenname': line[2],
        'familyname': line[3],
        'birthday': line[4],
        'gender': line[5],
        'since': line[6],
    }

    has_accounts = []
    for line in gdb.query('\
            MATCH (a:Account)<-[:Have]-(b:User) WHERE ID(b)={}\
            RETURN ID(a), a.alias, a.handle, a.bio, a.since, a.access\
            '.format(user_id)):
        account =  {
            'id': line[0],
            'alias': line[1],
            'handle': line[2],
            'bio': 'None' if line[3]==None else line[3],
            'since': line[4],
            'access': line[5],
        }
        has_accounts.append(account)
    user['hasAcc'] = has_accounts
    return user
