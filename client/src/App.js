import { useState, useEffect } from 'react'

const App = () => {
  const [sumOfCards, setSumOfCards] = useState(0);
  const [sumOfDealerCards, setSumOfDealerCards] = useState(0);
  const [storage, setStorage] = useState({});
  const [playerHand, setPlayerHand] = useState();
  const [playerNotPlaying, setPlayerNotPlaying] = useState(false);

  const newGame = async () => {
    setSumOfCards(0)
    setSumOfDealerCards(0)
    setPlayerNotPlaying(false)
    try {
      const res = await fetch('/new_deck')
      const data = await res.json()
      setStorage(data)
    } catch (err) {
      console.error("Error from fetching API", err);
    }
    shuffle()
  }

  const shuffle = async () => {
    try {
      const res = await fetch('/shuffle_cards')
      await res.json()
    } catch (err) {
      console.error("Error from fetching API", err);
    }
  }

  const drawCard = async () => {
    try {
      const res = await fetch('/draw_card')
      const data = await res.json()
      setStorage(data)
    } catch (err) {
      console.error("Error from fetching API", err);
    }
  }


  const stand = (hand) => {
    setPlayerHand(hand)
    setPlayerNotPlaying(true)
  }

  useEffect(() => {

    if (playerNotPlaying) {
      if (sumOfDealerCards < 21 && sumOfDealerCards <= sumOfCards) {
        setTimeout(() => {
          dealerTurn()
        }, [800])
      }else{
        isBlackJack(storage.dealer_cards_values)
      }
    }

  }, [playerHand, playerNotPlaying, storage])

  const dealerTurn = async () => {
    try {
      const res = await fetch('/draw_cards_for_dealer')
      const storage = await res.json()
      setStorage(storage)
      setSumOfDealerCards(storage.dealer_cards_values.reduce((a, b) => a + b));
    } catch (err) {
      console.error("Error from fetching API", err);
    }
  }

  const isBlackJack = (drawn_cards) => {
    let sum = drawn_cards.reduce((a, b) => a + b)
    if (sum === 21) {
      setTimeout(() => {
        alert("BLACK JACK!!!")
        newGame()
      }, [500])
    }
    else if (sum > 21) {
      setTimeout(() => {
        alert("Game Over")
        newGame()
      }, [500])
    }
    else if(sumOfDealerCards > sumOfCards){
      setTimeout(() => {
        alert("Dealer WON !")
        newGame()
      }, [500])
    }

  }

  useEffect(() => {

    if (storage.cards?.length > 1) {
      let sum = storage.cards_values.reduce((a, b) => a + b)
      setSumOfCards(sum)
      isBlackJack(storage.cards_values)
    }

  }, [storage, storage.cards, storage.dealer_cards_values])

  return (

    <div className='App'>
      <div className="row">
        <button className='btn btn-success' onClick={() => newGame()}>New Game</button>
        {storage.current_deck &&
          <>
            {!playerNotPlaying &&
              <>
                <button className='btn btn-warning' onClick={() => drawCard()}>Hit Me</button>
                <button className='btn btn-danger' onClick={() => stand(sumOfCards)}>Stand</button>
              </>
            }
          </>
        }
      </div>
      <div className="row bg-success p-4 mt-2">
        <div className="row d-flex justify-content-center">
          {storage.cards?.map(card =>
            <img key={card.code} src={card.image} alt="" className='w-25 mt-3 d-flex' />
          )}
        </div>
        {storage.cards?.length > 0 && sumOfCards !== 0 &&
          <h1 className="text-center mt-4 mb-5 text-light">{sumOfCards}</h1>
        }
      </div>
      {playerHand &&
        <div className="row p-4 mt-2 bg-success">
          <hr />
          {storage.cards?.length > 0 && sumOfCards !== 0 &&
            <h1 className="text-center mt-4 text-white">Dealer Cards</h1>
          }
          <div className="row d-flex justify-content-center">
            {storage.dealer_cards?.map(card =>
              <img key={card.code} src={card.image} alt="" className='w-25 mt-3 d-flex' />
            )}
            {storage.dealer_cards?.length > 0 && sumOfDealerCards !== 0 &&
              <h1 className="text-center mt-5 text-light">{sumOfDealerCards}</h1>
            }
          </div>
        </div>
      }
    </div>

  )
}

export default App