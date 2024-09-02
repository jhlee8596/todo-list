const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

const savedWeatherData = JSON.parse(localStorage.getItem("saved-weather"));
const savedTodoList = JSON.parse(localStorage.getItem("saved-items"));
// console.log(savedTodoList);

const createTodo = function (storageData) {
  let todoContents = todoInput.value;
  if (storageData) {
    todoContents = storageData.contents;
  }
  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  const checkBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");

  // 완료 체크 버튼
  checkBtn.classList.add("check-btn");
  checkBtn.innerHTML = storageData?.complete ? "✔️" : "⬜"; // 처음엔 빈 박스, 완료된 항목이면 체크 표시
  checkBtn.addEventListener("click", () => {
    newLi.classList.toggle("complete");
    checkBtn.innerHTML = newLi.classList.contains("complete") ? "✔️" : "⬜";
    saveItemsFn();
  });

  newSpan.addEventListener("click", () => {
    newLi.classList.toggle("complete");
    checkBtn.innerHTML = newLi.classList.contains("complete") ? "✔️" : "⬜";
    saveItemsFn();
  });

  // 삭제 버튼
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => {
    showDeleteConfirm(() => {
      newLi.remove();
      saveItemsFn();
    });
  });

  // 기존 이벤트 리스너
  newLi.addEventListener("dblclick", () => {
    showDeleteConfirm(() => {
      newLi.remove();
      saveItemsFn();
    });
  });

  // 할 일 추가
  if (storageData?.complete) {
    newLi.classList.add("complete");
  }

  newSpan.classList.add("toto-content");
  newSpan.textContent = todoContents;
  newLi.appendChild(checkBtn);
  newLi.appendChild(newSpan);
  newLi.appendChild(deleteBtn);
  todoList.appendChild(newLi);
  todoInput.value = "";
  saveItemsFn();
};

// 엔터키 체크
const keyCodeCheck = function () {
  //   console.log(window.event);
  //   console.log(window.event.keyCode === 13);
  if (window.event.keyCode === 13 && todoInput.value.trim() !== "") {
    // console.log(inputValue);
    createTodo();
  }
};

// 전체 삭제
const deleteAll = function () {
  const liList = document.querySelectorAll("li");
  showDeleteConfirm(() => {
    liList.forEach((li) => li.remove());
    saveItemsFn();
  });
};

// 로컬 스토리지 저장
const saveItemsFn = function () {
  const saveItems = [];
  //   console.log(todoList.children[0].querySelector("span").textContent);
  for (let i = 0; i < todoList.children.length; i++) {
    const todoObj = {
      contents: todoList.children[i].querySelector("span").textContent,
      complete: todoList.children[i].classList.contains("complete"),
    };
    saveItems.push(todoObj);
  }
  //   console.log(saveItems);
  //   console.log(typeof JSON.stringify(saveItems));
  if (saveItems.length === 0) {
    localStorage.removeItem("saved-items");
  } else {
    localStorage.setItem("saved-items", JSON.stringify(saveItems));
  }
  //   saveItems.length === 0
  //     ? localStorage.removeItem("saved-items")
  //     : localStorage.setItem("saved-items", JSON.stringify(saveItems));
};

// 삭제 확인 팝업창
const showDeleteConfirm = function (deleteCallback) {
  const confirmPopup = document.createElement("div");
  confirmPopup.classList.add("confirm-popup");

  const message = document.createElement("p");
  message.textContent = "삭제하시겠습니까?";

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "예";
  confirmBtn.addEventListener("click", () => {
    deleteCallback();
    confirmPopup.remove();
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "아니오";
  cancelBtn.addEventListener("click", () => {
    confirmPopup.remove();
  });

  confirmPopup.appendChild(message);
  confirmPopup.appendChild(confirmBtn);
  confirmPopup.appendChild(cancelBtn);
  document.body.appendChild(confirmPopup);
};

// 저장된 할 일 로드
if (savedTodoList) {
  savedTodoList.forEach((todo) => createTodo(todo));
}

const weatherDataActive = function ({ location, weather }) {
  const weatherMainList = [
    "Clear",
    "Clouds",
    "Drizzle",
    "Rain",
    "Snow",
    "Thunderstorm",
  ];
  weather = weatherMainList.includes(weather) ? weather : "Fog";

  const locationNameTag = document.querySelector("#location-name-tag");
  locationNameTag.textContent = location;
  document.body.style.backgroundImage = `url('./images/${weather}.jpg')`;

  if (
    !savedWeatherData ||
    savedWeatherData.location !== location ||
    savedWeatherData.weather !== weather
  ) {
    localStorage.setItem(
      "saved-weather",
      JSON.stringify({ location, weather })
    );
  }
};

const accessToGeo = function ({ coords }) {
  //   console.log(position.coords.latitude);
  //   console.log(position);

  // shorthand property
  const { latitude, longitude } = coords;
  weatherSearch({ latitude, longitude });
  //   console.log(positionObj);
};

const askForLocation = function () {
  navigator.geolocation.getCurrentPosition(accessToGeo, (err) =>
    console.log(err)
  );
};

askForLocation();

// const promiseTest = function () {
//   return new Promise((resolver, reject) => {
//     setTimeout(() => {
//       resolver("success!");
//       // reject("error");
//     }, 2000);
//   });
// };
// promiseTest().then((res) => {
//   console.log(res);
// });
