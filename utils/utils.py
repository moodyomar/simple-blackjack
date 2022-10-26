import requests

api = {
  'endpoint':'https://www.deckofcardsapi.com/api/deck',
  'new_deck':'/new/',
}

storage = {
    'current_deck':'',
    'current_pile':'',
    'remaining_cards_in_pile':'',
    'dealer_cards':[],
    'dealer_cards_values':[],
    'cards_values':[],
    'cards':[]
}

### New Deck of cards
def new_deck():
    storage['cards'] = []
    storage['cards_values'] = []
    storage['dealer_cards'] = []
    storage['dealer_cards_values'] = []
    deck = requests.get(f"{api['endpoint']}/{api['new_deck']}").json()
    storage['current_deck'] = deck['deck_id']
    return storage
 

### Shuffle Cards
def shuffle_cards():
    # /shuffle/?remaining=true
    return requests.get(f'{api["endpoint"]}/{storage["current_deck"]}/shuffle').json()


### Draw a Card
def draw_cards(count):
    response = requests.get(f'{api["endpoint"]}/{storage["current_deck"]}/draw/?count={count}').json()
    card = response['cards'][0]
    card_value = what_is_card_value(card)
    storage['cards'].append(card)
    storage['cards_values'].append(card_value)
    return storage

def draw_cards_for_dealer():
    response = requests.get(f'{api["endpoint"]}/{storage["current_deck"]}/draw/?count=1').json()
    dealer_card = response['cards'][0]
    dealer_card_value = what_is_card_value(dealer_card)
    storage['dealer_cards'].append(dealer_card)
    storage['dealer_cards_values'].append(dealer_card_value)
    return storage
    

### Add player cards to a pile
def add_cards_to_pile(cards):
    pile = requests.get(f'{api["endpoint"]}/{storage["current_deck"]}/pile/hand_pile/add/?cards={cards}')
    storage['current_pile'] = list(pile.json()['piles'].keys())[0]
    return storage


def deal_with_ace():
    if sum(storage['cards_values']) < 11:
        return 11
    return 1


### Check card value
def what_is_card_value(card):
    not_numeric_values = {
        'KING':'10',
        'QUEEN':'10',
        'JACK':'10',
        'ACE':deal_with_ace(),
    }
    
    if card['value'] not in not_numeric_values:
        return int(card['value'])
    else:
        return int(not_numeric_values[card['value']])
    
    
### List cards in pile
def show_cards_in_pile(pile):
    return requests.get(f'{api["endpoint"]}/{storage["current_deck"]}/pile/{pile}/list').json()['piles'][pile]['cards']
