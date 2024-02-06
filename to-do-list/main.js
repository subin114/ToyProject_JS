// 유저가 값을 입력합니다.
// + 버튼을 클릭하면 할 일이 추가됩니다.
// 각 할 일에 삭제와 체크버튼이 있습니다.
// 삭제버튼을 클릭하면 할 일이 리스트에서 삭제됩니다.
// 체크버튼을 누르면 할 일이 끝난 것으로 간주되고 밑줄이 그어집니다.
// - check 버튼을 클릭하는 순간 true false
// - true이면 끝난 것으로 간주하고 밑줄이 보여집니다.
// - false이면 안끝난 것으로 간주하고 그대로 보여집니다.
// 탭을 누르면 언더바가 자연스럽게 이동됩니다.
// 탭을 이용해 아이템들을 상태별로 나누어서 볼 수 있습니다.
// 끝난 할 일은 되돌리기 버튼을 클릭하면 다시 되돌릴 수 있습니다.
// 모바일 버전에서도 확인할 수 있는 반응형 웹이어야 합니다.

let taskInput = document.getElementById("task-input");
let addBtn = document.getElementById("add-btn");
addBtn.addEventListener("click", addTask);

let taskList = []; // 추가된 할 일 리스트 저장

let tabs = document.querySelectorAll(".task-tabs div");

let mode = "all";
let filterList = [];

let underLine = document.getElementById("under-line");
let underLineMenus = document.querySelectorAll(".task-tabs div");

// Enter 키를 누르면 아이템 추가
taskInput.addEventListener("keydown", function (e) {
  if (event.keyCode === 13) {
    addTask(e);
  }
});

// 각각의 탭에 맞는 리스트 출력
for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function(e) {
    filter(e)});
}

/** addBtn 클릭 시 리스트 추가되는 함수 */
function addTask() {
  let task = {
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };
  taskList.push(task);
  console.log(taskList);
  
  render();
  taskInput.value = "";
}

/** 리스트를 그려주는 함수 */
function render() {
  // 1. 내가 선택한 탭에 따라서
  // 2. 리스트를 달리 보여줘야 함
  let list = [];
  if (mode === "all") {
    list = taskList;
  } else {
    list = filterList;
  }

  let resultHTML = "";
  // taskList만 그리는 for문
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete === true) {
      resultHTML += `
      <div class="task-wrap">
          <div class="task task-done">${list[i].taskContent}</div>
          <div class="btn-wrap">
            <button onclick = "toggleComplete('${list[i].id}')">
            <i class="fa-solid fa-arrow-rotate-left"></i>
            </button>
            <button onclick = "deleteTask('${list[i].id}')">
            <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
    `;
    } else {
      resultHTML += `
    <div class="task-wrap">
          <div class="task">${list[i].taskContent}</div>
          <div class="btn-wrap">
            <button onclick = "toggleComplete('${list[i].id}')">
            <i class="fa-solid fa-check"></i>
            </button>
            <button onclick = "deleteTask('${list[i].id}')">
            <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
    `;
    }
  }

  document.getElementById("task-board").innerHTML = resultHTML;
}

/** 완료 버튼 클릭 시 실행되는 함수 */
function toggleComplete(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  render();
}

/** 삭제 버튼 클릭 시 실행되는 함수 */
function deleteTask(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList.splice(i, 1);
      break;
    }
  }
  render();
}

/** 각각의 탭마다 리스트가 다르게 보여지는 함수 */
function filter(e) {
  mode = event.target.id;
  filterList = [];
  // e는 어떤 것을 클릭했는지에 대한 정보를 가지고 있음
  if (mode === "all") {
    render();
  } else if (mode === "ongoing") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === false) {
        filterList.push(taskList[i])
      }
    }
    render();
  } else if (mode === "done") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === true) {
        filterList.push(taskList[i])
      }
    }
    render();
  }
}

/** random ID 생성하는 함수 */
function randomIDGenerate() {
  return Math.random().toString(36).substr(2, 9);
}

// menu slide animation
underLineMenus.forEach((menu) => 
menu.addEventListener("click", (e) => underLineIndicator(e))
);

// 초기 상태 설정
if (index === 0) {
  underLineIndicator({ currentTarget: menu });
}

function underLineIndicator(e) {
  underLine.style.left = e.currentTarget.offsetLeft + "px";
  underLine.style.width = e.currentTarget.offsetWidth + "px";
  underLine.style.top = "auto";
  underLine.style.bottom = 0; 
  underLine.style.marginLeft = "0";
}