from flask import Flask
from utils.utils import *

app = Flask(__name__)


@app.route('/')
def index():
    return "API is working just fine!"

@app.route('/new_deck')
def get_deck():
    return new_deck()

@app.route('/draw_card')
def hit_me():
    return draw_cards(1)

@app.route('/shuffle_cards')
def shuffle():
    return shuffle_cards()

@app.route('/draw_cards_for_dealer')
def dealer_cards():
    return draw_cards_for_dealer()

def stand():
    # calc sum of player pile
    # calc sum of dealer pile
    # check is black jack
    pass


if __name__ == '__main__':
    app.run('0.0.0.0', port=3000, debug=True)