let playerScore = 0;
let computerScore = 0;
let tieScore = 0;

function playerThrow(choice) {
    if (document.querySelector('#player-throw img:not(.disabled)')) {
        let images = document.querySelectorAll('#player-throw img');
        for (let img of images) {
            img.classList.remove('selected');
            img.classList.add('disabled');
        }

        let computerImage = document.getElementById('computer-choice');
        computerImage.src = 'question-mark.PNG';
        document.querySelector('#player-throw img[src="' + choice + '.PNG"]').classList.add('selected');
        document.getElementById('outcome').innerText = 'Thinking...';

        setTimeout(function () {
            let computerChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
            let computerImage = document.getElementById('computer-choice');
            computerImage.src = computerChoice + '.PNG';
            computerImage.classList.add('computer-selected');

            if (choice === computerChoice) {
                tieScore++;
                document.getElementById('outcome').innerText = 'It\'s a tie!';
            } else if (
                (choice === 'rock' && computerChoice === 'scissors') ||
                (choice === 'paper' && computerChoice === 'rock') ||
                (choice === 'scissors' && computerChoice === 'paper')
            ) {
                playerScore++;
                document.getElementById('outcome').innerText = 'You win!';
            } else {
                computerScore++;
                document.getElementById('outcome').innerText = 'Computer wins!';
            }

            document.getElementById('score').innerText = 'Player: ' + playerScore + ', Computer: ' + computerScore + ', Ties: ' + tieScore;

            for (let img of images) {
                img.classList.remove('selected', 'disabled');
            }
            computerImage.classList.remove('computer-selected');
        }, 3000);
    }
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    tieScore = 0;
    document.getElementById('computer-choice').src = 'question-mark.PNG';
    document.getElementById('outcome').innerText = '';
    document.getElementById('score').innerText = '';

    let images = document.querySelectorAll('#player-throw img');
    for (let img of images) {
        img.classList.remove('disabled');
    }
}
