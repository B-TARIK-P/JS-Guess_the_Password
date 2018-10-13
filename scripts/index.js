document.addEventListener('DOMContentLoaded', function() {
    const wordCount   = 10,
          start       = document.querySelector('#start'),
          startScreen = document.querySelector('#start-screen'),
          gameScreen  = document.querySelector('#game-screen'),
          wordList    = document.querySelector('#word-list'),
          winner      = document.querySelector('#winner'),
          loser       = document.querySelector('#loser');
    let   guessCount  = 4,
          password    = '';
    
    start.addEventListener('click', function() {
      toggleClasses(startScreen, 'hide', 'show');
      toggleClasses(gameScreen, 'hide', 'show');
      startGame();
    });
    
    function toggleClasses(elm, ...classes) {
      classes.forEach(name => { elm.classList.toggle(name) });
    }
    
    function startGame() {
      // get random words and append them to the DOM
      let randomWords = getRandomValues(words);
      
      randomWords.forEach(word => {
        let li = document.createElement('li');
        li.innerText = word;
        wordList.appendChild(li);
      });
      
      // set a secret password and the guess count display
      password = getRandomValues(randomWords, 1)[0];
      setGuessCount(guessCount);
      
      // add update listener for clicking on a word
      wordList.addEventListener('click', updateGame);
    }
    
    let getRandomValues = (array, numfVals = wordCount) => shuffle(array).slice(0, numfVals);
    
    function shuffle(array) {
      let arrayCopy = array.slice(),
          idx1      = arrayCopy.length - 1;
      
      for(idx1; idx1 > 0; idx1-=1) {
        // generate a random index between 0 and idx1 (inclusive)
        let idx2 = Math.floor(Math.random() * (idx1 + 1));
        
        // swap elements at idx1 and idx2
         [arrayCopy[idx1], arrayCopy[idx2]] = [arrayCopy[idx2], arrayCopy[idx1]];
      }
      return arrayCopy;
    }
    
    function setGuessCount(newCount) {
      guessCount = newCount;
      document.querySelector('#guesses-remaining').innerText = `Guess remaining: ${guessCount}.`
    }
    
    function updateGame(e) {
      if(e.target.tagName === 'LI' && !e.target.classList.contains('disabled')) {
        // grab guessd word, check it against password, update view
        let guess = e.target.innerText,
            similarityScore = compareWords(guess, password);
        
        e.target.classList.add('disabled');
        e.target.innerText = `${e.target.innerText} --> Matching Letters: ${similarityScore}`;
        setGuessCount(guessCount - 1);
        
        // check wether the game is over
        if(similarityScore === password.length) {
          toggleClasses(winner, 'hide', 'show');
          this.removeEventListener('click', updateGame);
        } else if(guessCount === 0) {
          toggleClasses(loser, 'hide', 'show');
          this.removeEventListener('click', updateGame);
        }
      }
    }
    
    function compareWords(word1, word2) {
      if(word1.length !== word2.length) {throw 'Words must have the same length'};
  
      let i = 0, count = 0,
          max = word1.length;
      
      for(i; i < max; i+=1) {
        if(word1[i] === word2[i]) count+=1;
      }
      return count;
    }
    
});