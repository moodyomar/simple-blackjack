import requests

api = {
  'endpoint':'https://www.deckofcardsapi.com/api/deck',
  'new_deck':'/new/',
}

storage = {
    'current_deck':'',
    'current_pile':'',
    'remaining_cards_in_pile':'',
    'cards':[]
}

### New Deck of cards
def new_deck():
    deck = requests.get(f"{api['endpoint']}/{api['new_deck']}").json()
    storage['current_deck'] = deck['deck_id']
 

### Shuffle Cards
def shuffle_cards():
    # /shuffle/?remaining=true
    return requests.get(f'{api["endpoint"]}/{storage["current_deck"]}/shuffle')


### Draw a Card
#    'value': "KING",
#    'suit': "DIAMONDS"
#    'image': link
def draw_cards(count):
    response = requests.get(f'{api["endpoint"]}/{storage["current_deck"]}/draw/?count={count}').json()
    data = {
        'cards':response['cards'][0],
        'remaining':response['remaining']
    }
    return data


### Add player cards to a pile
def add_cards_to_pile(cards):
    pile = requests.get(f'{api["endpoint"]}/{storage["current_deck"]}/pile/hand_pile/add/?cards={cards}')
    storage['current_pile'] = list(pile.json()['piles'].keys())[0]


### Check if its Black Jack
def is_blackjack(player_cards):
    if player_cards != 21:
        return False
    else: 
        return True
    
        
### Check card value
def what_is_card_value(card):
    not_numeric_values = {
        'KING':'13',
        'QUEEN':'12',
        'JACK':'11'
    }
    
    if card['value'] not in not_numeric_values:
        return int(card['value'])
    else:
        return int(not_numeric_values[card['value']])
    
    
### List cards in pile
def show_cards_in_pile(pile):
    return requests.get(f'{api["endpoint"]}/{storage["current_deck"]}/pile/{pile}/list').json()['piles'][pile]['cards']



new_deck()
data = draw_cards(1)
card = data['cards']['code']
add_cards_to_pile(card)
print(show_cards_in_pile(storage["current_pile"]))
