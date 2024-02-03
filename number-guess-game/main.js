// 랜덤번호 지정
// 유저가 번호를 입력, 그리고 go라는 버튼을 누름
// 만약에 유저가 랜덤번호를 맞추면 정답!
// 랜덤번호가 유저번호보다 작으면 Down!
// 랜덤번호가 유저번호보다 크면 Up!
// Reset 버튼을 누르면 게임이 리셋됨
// 5번의 기회를 다쓰면 게임이 끝남 (더이상 추측 불가. 버튼이 disable)
// 유저가 1~100 범위 밖의 숫자를 입력하면 알려주고, 기회를 깎지 않음
// 유저가 이미 입력한 숫자를 또 입력하면 알려주고, 기회를 깎지 않음

let computerNum = 0;
let playButton = document.getElementById("play-button");
let userInput = document.getElementById("user-input");
let resultArea = document.getElementById("result-area");
let resetButton = document.getElementById("reset-button");
let chances = 5;
let gameOver = false;
let chanceArea = document.getElementById("chance-area");
let history = [];

playButton.addEventListener("click", play);
resetButton.addEventListener("click", reset);
userInput.addEventListener("focus", function() {
  userInput.value="";
});

function pickRandomNum() {
  computerNum = Math.floor(Math.random() * 100) + 1;
  console.log("정답", computerNum);
}

function play() {
  let userValue = userInput.value;

  if(userValue < 1 || userValue > 100) {
    resultArea.textContent = "1~100 사이의 숫자를 입력해주세요!";
    return;
  }

  if (history.includes(userValue)) {
    resultArea.textContent = "이미 입력한 숫자입니다. 다른 숫자를 입력해주세요!";
    return;
  }

  chances--;
  chanceArea.textContent = `✔ 남은기회 : ${chances}번`;

  if(userValue < computerNum) {
    resultArea.textContent = "UP😜";
  } else if (userValue > computerNum) {
    resultArea.textContent = "DOWN😝";
  } else {
    resultArea.textContent = "정답!👏🏻";
    gameOver = true;
  }

  history.push(userValue);

  if(chances < 1) {
    gameOver = true;
    resultArea.textContent = "끝! 재도전 해보세요😇";
  }

  if(gameOver == true) {
    playButton.disabled = true;
  }
}

function reset() {
  userInput.value = "";
  pickRandomNum();
  resultArea.textContent = "두구두구🥁";
  
  // 기회 초기화
  chances = 5;
  chanceArea.textContent = `✔ 남은 기회: ${chances}번`;
  // 게임 종료 여부 초기화
  gameOver = false;
  // 플레이 버튼 활성화
  playButton.disabled = false;
  // 기존의 숫자 기록 초기화
  history = [];
}

pickRandomNum();
