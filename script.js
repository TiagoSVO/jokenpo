document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    //TODO:
    // - Round por tempo;
    // - Pegar o valor da jogado do computador de forma randomica
    // - Botão de Stop no lugar do Start
    var Jokenpo = {
      default: {
        gameStarted: false,
        startButton: null,
        roundGame: 0,
        roundTimeInSeconds: 10,
        timerTimeInSeconds: 0,
        timerStarted: false,
        lastPlayerChoice: null,
        lastComputerChoice: null,
        playerChoiceButtons: [],
        playerPoint: 0,
        computerPoint: 0,
        winner: null
      },

      currentRound: null,

      config: {},

      init: function() {
        this.resetDefaultConfig();
        this.initEvents();
      },

      resetDefaultConfig: function() {
        var _this = this;
        _this.config = {...this.default}
        _this.config.playerChoiceButtons = [];
        _this.config.startButton = document.getElementById('jkp-start');
        _this.getPlayerChoicesButtons().forEach((item, i) => {
          _this.config.playerChoiceButtons.push(item)
        });
        _this.resetPoints();
      },

      getPlayerChoicesButtons: function() {
        var playerChoicesField = document.getElementById('jkp-player-choices');
        var choices = [...playerChoicesField.children]
        return choices;
      },

      initEvents: function() {
        this.initGame();
      },

      initGame: function() {
        console.log(`initGame`);
        var _this = this;
        _this.resetPoints();
        if(!_this.config.gameStarted) {
          _this.config.gameStarted = true;


          _this.config.startButton.onclick = _this.startGame.bind(this);
        }
      },

      startGame: function() {
        console.log(`startGame`);
        this.config.startButton.innerHTML = 'Stop'
        this.resetDefaultConfig();
        this.setMessage('The game started!');
        this.setMessage('Choose your option!', 2000);
        this.setMessage('It is two-out-of-three series', 5000);
        setTimeout(() => {this.setChoicesFieldVisible()}, 7000);
        setTimeout(() => {this.startRound()}, 9000);
        this.config.startButton.onclick = this.finishGame.bind(this);
      },

      setMessage: function(msg, time=0) {
        var messageBox = document.getElementById('jkp-messages');
        var msgTimeout = setTimeout(() => {messageBox.innerHTML = "<span>"+msg+"</span>";}, time);
      },

      setChoicesFieldVisible: function() {
        var filedsChoices = [...document.getElementsByClassName('jkp-field-choices')];
        filedsChoices.forEach((item, i) => {
          item.classList.add('visible');
        });
      },

      startRound: function() {
        this.config.roundGame += 1
        this.turnOnSelectChoices();
        this.turnOnTimer();
      },

      finishRound: function () {
        var _this = this
        _this.turnOffSelectChoices();
        setTimeout(function() {
          _this.checkChoices();
          if(_this.config.roundGame < 3 ) {
            _this.startRound();
          } else {
            _this.finishGame();
          }
        }, 2000);
      },

      turnOnTimer: function() {
        var initialTime = this.config.roundTimeInSeconds
        if(this.config.timerStarted) {
          this.timerReset();
        }
        this.startClockCountdown();
      },

      timerReset: function() {
        clearInterval(this.currentRound);
        this.displayCountdownTimer(this.countdownTimer(0));
      },

      countdownTimer: function(getTimeInSeconds) {
        //var getHour = Math.floor((getTimeInSeconds/3600)%24);
        var getMin = Math.floor((getTimeInSeconds/60)%60);
        var getSec = Math.floor(getTimeInSeconds%60);

        //getHour = this.formatZeroTime(getHour);
        getMin = this.formatZeroTime(getMin);
        getSec = this.formatZeroTime(getSec);

        //var formattedTime = `${getHour}:${getMin}:${getSec}`
        var formattedTime = `${getMin}:${getSec}`

        return formattedTime
      },

      formatZeroTime: function(time) {
        if(time < 10) {
          time = '0'+time
        }
        return time
      },

      startClockCountdown: function(timeInSeconds=null) {
        var _this = this
        _this.config.timerStarted = true
        var timeCounter = timeInSeconds ? timeInSeconds : this.config.roundTimeInSeconds
        _this.currentRound = setInterval(function() {
          _this.displayCountdownTimer(_this.countdownTimer(timeCounter))
          if(timeCounter > 0) {
            timeCounter = timeCounter -1
          } else {
            clearInterval(_this.currentRound);
            _this.finishCountdownn();
          }
        }, 1000)
      },

      finishCountdownn: function () {
        this.config.timerStarted = false;
        this.finishRound();
      },

      displayCountdownTimer: function(clockTime) {
        var clockTag = document.getElementById('jkp-timer');
        clockTag.innerHTML = clockTime;
      },

      turnOnSelectChoices: function() {
        var _this = this;
        var playerChoicesField = document.getElementById('jkp-player-choices');
        playerChoicesField.classList.add('enable');

        _this.config.playerChoiceButtons.forEach((item, i) => {
          item.onclick = _this.selectPlayerChoice.bind(_this);
        });

      },

      turnOffSelectChoices: function() {
        var _this = this;
        var playerChoicesField = document.getElementById('jkp-player-choices');
        playerChoicesField.classList.remove('enable');

        _this.config.playerChoiceButtons.forEach((item, i) => {
          item.onclick = null;
        });
      },

      selectPlayerChoice: function(e) {
        e.preventDefault();

        var choiceSelected = e.currentTarget
        var itemSelected = choiceSelected.querySelector('a[id*=jkp-player-choice]');
        var selectedValue = itemSelected.getAttribute('value');
        var computerSelected = this.selectComputerChoice();
        choiceSelected.classList.add('selected')
        setTimeout(() => {choiceSelected.classList.remove('selected')}, 2000);
        return this.config.lastPlayerChoice = selectedValue;
      },

      selectComputerChoice: function() {
        var computerChoicesField = document.getElementById('jkp-computer-choices');
        var selectedChoicValue = (Math.floor(Math.random() * 3) + 1).toString();
        var itemSelected = computerChoicesField.querySelector('a[id*=jkp-computer-choice-'+selectedChoicValue+']');
        itemSelected.parentNode.classList.add('selected')
        setTimeout(() => {itemSelected.parentNode.classList.remove('selected')}, 2000);
        return this.config.lastComputerChoice = selectedChoicValue;
      },

      checkChoices: function() {
        var playerChoice = this.config.lastPlayerChoice
        var computerChoice = this.config.lastComputerChoice
        this.compareChoices(playerChoice, computerChoice);
      },

      compareChoices: function(playerChoice, computerChoice) {
        if(playerChoice == computerChoice) {
          this.config.roundGame -= 1;
          this.setMessage(`Gave a Tie!`)
        } else {
          var choices = playerChoice+'x'+computerChoice
          switch (choices) {
            case '1x3':
            case '3x2':
            case '2x1':
              this.setPoint(player=true);
              this.printPoint();
              this.setMessage(`Player Wins!`)
              break;
            default:
              this.setPoint(player=false);
              this.printPoint();
              this.setMessage(`Computer Wins!`)
          }
        }
      },

      resetPoints: function() {
        this.config.playerPoint = 0;
        this.config.computerPoint = 0;

        this.printPoint();
      },

      setPoint: function (player=true) {
        if(player) {
          this.config.playerPoint += 1;
        } else {
          this.config.computerPoint += 1;
        }
      },

      printPoint: function() {
        var playerScore = document.getElementById('jkp-player-points');
        var computerScore = document.getElementById('jkp-computer-points');

        playerScore.innerHTML = this.config.playerPoint;
        computerScore.innerHTML = this.config.computerPoint;
      },

      finishGame: function() {
        console.log('finish game!')
        this.config.startButton.innerHTML = 'Start';
        this.config.gameStarted = false;
        this.config.roundGame = 3;
        this.timerReset();
        this.setTheWinner();
        this.setMessage(`The game finished! The ${this.config.winner} is the Champion!`);
        this.config.startButton.onclick = this.startGame.bind(this);
      },

      setTheWinner: function() {
        var playerPoint = this.config.playerPoint;
        var computerPoint = this.config.computerPoint;
        var winner = null;

        if(playerPoint > computerPoint) {
          winner = `Player`;
        } else {
          winner = `Computer`;
        }

        return this.config.winner = winner;
      },

      resetRoundGame: function() {
        this.config.roundGame = 0;
      },

    }

    Jokenpo.init();
  }
}
