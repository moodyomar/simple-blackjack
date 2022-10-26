import { useState, useEffect } from 'react'

const App = () => {
  const [sumOfCards, setSumOfCards] = useState(0);
  const [sumOfDealerCards, setSumOfDealerCards] = useState(0);
  const [storage, setStorage] = useState({});
  const [playerHand, setPlayerHand] = useState(0);
  const [playerNotPlaying, setPlayerNotPlaying] = useState(false);
  const [gameOn, setGameOn] = useState(false);

  const newGame = async () => {
    setGameOn(true)
    setSumOfCards(0)
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

    if(gameOn){
      dealerTurn()
      console.log(storage);
    }

  }

  const dealerTurn = async () => {
    try {
      const res = await fetch('/draw_cards_for_dealer')
      const storage = await res.json()
      setStorage(storage)
    } catch (err) {
      console.error("Error from fetching API", err);
    }
    stand()
  }

  const isBlackJack = (drawn_cards) => {
    let sum = drawn_cards.reduce((a, b) => a + b)
    if (sum === 21) {
      setGameOn(false)
      setTimeout(() => {
        alert("BLACK JACK!!!")
        newGame()
      }, [400])
    }
    else if (sum > 21) {
      setGameOn(false)
      setTimeout(() => {
        alert("Game Over - Above 21")
        newGame()
      }, [400])
    }

  }

  useEffect(() => {

    if (storage.cards?.length > 1) {
      let sum = storage.cards_values.reduce((a, b) => a + b)
      setSumOfCards(sum)
      isBlackJack(storage.cards_values)
    }

    if (storage.dealer_cards?.length > 1) {
      let sum = storage.dealer_cards_values.reduce((a, b) => a + b)
      setSumOfDealerCards(sum)
      isBlackJack(storage.dealer_cards_values)
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
      <div className="row  m-3">
        <div className="row d-flex justify-content-center">
          {storage.cards?.map(card =>
            <img key={card.code} src={card.image} alt="" className='w-25 mt-5 d-flex' />
          )}
        </div>
        {storage.cards?.length > 0 && sumOfCards !== 0 &&
          <h1 className="text-center mt-4 mb-5">{sumOfCards}</h1>
        }
      </div>
      {playerHand &&
        <div className="row  m-3">
          <hr />
          {storage.cards?.length > 0 && sumOfCards !== 0 &&
            <h1 className="text-center mt-4">Dealer Cards</h1>
          }
          <div className="row d-flex justify-content-center">
            {storage.dealer_cards?.map(card =>
              <img key={card.code} src={card.image} alt="" className='w-25 mt-5 d-flex' />
            )}
            {storage.dealer_cards?.length > 0 && sumOfCards !== 0 &&
              <h1 className="text-center mt-5">{storage.dealer_cards_values.reduce((a, b) => a + b)}</h1>
            }
          </div>
        </div>
      }
    </div>

  )
}

export default App