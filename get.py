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

def hiscards(account_alias, amount):
    lines = []
    for line in gdb.query('''
        MATCH p=(a:Account)-[r:Toot]->(b:Card) WHERE a.alias="{}"
        RETURN ID(a), a.name, r.when, ID(b), b.text, b.url LIMIT {}
        '''.format( account_alias, amount )):
        lines.append({
            'account': {
                'id': line[0],
                'name': line[1],
            },
            'toot': {
                'when': line[2],
            },
            'card': {
                'id': line[3],
                'text': line[4],
                'url':'None' if line[5]==None else line[5],
            },
            'mode': 'drawn',
        })
    return lines

def card(card_id):
    line = gdb.query('''
        MATCH p=(a)<-[t:Toot]-(c) WHERE ID(a)={}
        RETURN ID(c), c.alias, t.when, ID(a), a.text, a.url, a.imgs
        '''.format(card_id))[0]
    line = {
        'account': {
            'id': line[0],
            'alias': line[1],
        },
        'toot': {
            'when': line[2],
        },
        'card': {
            'id': line[3],
            'text': line[4],
            'url':'None' if line[5]==None else line[5],
            'imgs': line[6],
        },
        'mode': 'called',
    }
    return line

def anchoring_card(card_id):
    line = gdb.query('\
        MATCH p=(a:Card)-[r:Anchor]->(b:Card)<-[t:Toot]-(c:Account) WHERE ID(a)={}\
        RETURN ID(c), c.name, t.when, ID(b), b.text, b.url, b.imgs\
        '.format(card_id))[0]
    line = {
        'account': {
            'id': line[0],
            'alias': line[1],
        },
        'toot': {
            'when': line[2],
        },
        'card': {
            'id': line[3],
            'text': line[4],
            'url':'None' if line[5]==None else line[5],
            'imgs': line[6],
        },
        'mode': 'winded',
    }
    return line

def anchored_card(card_id):
    line = gdb.query('\
        MATCH p=(a:Card)<-[r:Anchor]-(b:Card)<-[t:Toot]-(c:Account) WHERE ID(a)={}\
        RETURN ID(c), c.name, t.when, ID(b), b.text, b.url, b.imgs\
        '.format(card_id))[0]
    line = {
        'account': {
            'id': line[0],
            'alias': line[1],
        },
        'toot': {
            'when': line[2],
        },
        'card': {
            'id': line[3],
            'text': line[4],
            'url':'None' if line[5]==None else line[5],
            'imgs': line[6],
        },
        'mode': 'winded',
    }
    return line

def wind_card(card_id, amount):
    cnt_cards = 0

    now_line = card(card_id)
    now_line['mode'] = 'called'
    cnt_cards+=1

    pre_id = card_id
    pre_lines = []
    for i in range(100):
        try:
            line = anchoring_card(pre_id)
            line['mode'] = 'winded'
            pre_lines.append(line)
            pre_id = line['card']['id']
            cnt_cards+=1
        except:
            break

    next_id = card_id
    next_lines = []
    for i in range(100):
        try:
            line = anchored_card(next_id)
            line['mode'] = 'winded'
            next_lines.append(line)
            next_id = line['card']['id']
            cnt_cards+=1
        except:
            break

    lines = pre_lines[::-1] + [now_line] + next_lines
    return lines

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
