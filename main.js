const gameState={
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}



const Symbols=[

  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

const view={
  transformNumber(number){
    switch(number){

      case 1:
        return 'A'

      case 11:
        return 'J'
      
      case 12:
        return 'Q'

      case 13:
        return 'K'

      default:
        return number


    }


  },
  
  getCradElement(index){
    
    return `
    <div class="card back" data-index="${index}"></div>
    `

  },
  
  
  
  displayCards(indexes) {
    const rootElement=document.querySelector('#cards')
    
    rootElement.innerHTML=indexes.map(index=>this.getCradElement(index)).join('')
    
    
  },

  getCardContent(index){
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
    <p>${number}</p>
      <img src='${symbol}' alt="">
      <p>${number}</p>
    `
    
  },

  filpCards(...cards){
    cards.map(card=>{
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(card.dataset.index)
        return
      }
      card.classList.add('back')
      card.innerHTML = null

    })
    
  },

  pairCards(...cards){
    cards.map(card=>{
      card.classList.add('paired')

    })
    
  },

  renderScore(score){
    document.querySelector('.score').textContent=`Score: ${score}`

  },

  renderTriedTimes(times){
    document.querySelector('.tried').textContent=`
    You've tried: ${times} times
    `

  },

  appendWrongAnimate(...cards){
    cards.map(card=>{
      card.classList.add('wrong')
      card.addEventListener('animationend', event=>event.target.classList.remove('wrong'),{once:true}

      )
    })
  },

  showGameEnd(){
    const div=document.createElement('div')
    div.classList.add('complete')
    div.innerHTML=`
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedtimes} times</p>
      <button type='button' class='retry' onClick='window.location.reload();'>Try again</button>
    `

    const header=document.querySelector('#header')
    header.before(div)
  }

}

const controler={
  currentState:gameState.FirstCardAwaits,
  generateCards(){
    view.displayCards(utility.getRandomNumberArray(52))
  },

  dispatchCardAction(card){
    if(!card.classList.contains('back')){
      return
    }

    switch(this.currentState){

      case gameState.FirstCardAwaits:
        view.filpCards(card)
        model.revealCards.push(card)
        this.currentState=gameState.SecondCardAwaits
        break
      
      case gameState.SecondCardAwaits:
        view.renderTriedTimes(++model.triedtimes)
        view.filpCards(card)
        model.revealCards.push(card)
        // 判斷是否match
        if(model.isRevealCardMatch()){
          // match成功
          view.renderScore(model.score+=10)
          this.currentState=gameState.CardsMatched
          view.pairCards(...model.revealCards)
          
          model.revealCards=[]
          if(model.score===260){
            console.log('gameend')
            this.currentState=gameState.GameFinished
            view.showGameEnd()
            return
          }

          this.currentState=gameState.FirstCardAwaits

          
        }else{
          // match失敗
          this.currentState = gameState.CardsMatchFailed
          view.appendWrongAnimate(...model.revealCards)
          setTimeout(this.resetCard,1000)


        }
        break


    }

    console.log('currentstate', this.currentState)
    console.log('revealcards',model.revealCards.map(card=>card.dataset.index))

  },

  resetCard(){
    view.filpCards(...model.revealCards)
    model.revealCards=[]
    controler.currentState=gameState.FirstCardAwaits
  }


}



const model={
  revealCards:[],

  isRevealCardMatch(){
    return this.revealCards[0].dataset.index%13===this.revealCards[1].dataset.index%13
  },
  score: 0,
  triedtimes: 0,

}

const utility={
  getRandomNumberArray(count){

    const number = Array.from(Array(count).keys())
    for(let index=number.length-1;index>0;index--){
      let randomIndex=Math.floor(Math.random()*(index+1));
      [number[index],number[randomIndex]]=[number[randomIndex],number[index]]

    }
    return number


  }


}

controler.generateCards()
  
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('click',event=>{
    controler.dispatchCardAction(card)
  })
})