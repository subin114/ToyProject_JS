const API_KEY = `aa0d29ea87544a099bad8b72e6c8fb8d`;
let newsList = [];

const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (e) => getNewsByCategory(e))
);

let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
);

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

/** 코드 리팩토링 + 에러 핸들링 */
const getNews = async () => {
  try {
    url.searchParams.set("page", page); // url 뒤에 page라는 파라미터를 붙여줌 (&page=page)
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

/** 최신 뉴스 가져오는 함수 */
const getLateNews = async () => {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  console.log("뉴스 리스트 보여주기", newsList);
  getNews();
};

/** 메뉴 클릭 시 실행되는 함수 */
const getNewsByCategory = async (e) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
  );
  getNews();
};

/** 키워드 검색 시 실행되는 함수 */
const searchNews = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
  );
  getNews();
};

/** 뉴스를 보여주는 함수 */
const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `
  <div class="row news">
        <div class="col-lg-4">
          <img class="news-img" src=${
            news.urlToImage ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
          } />
        </div>
        <div class="col-lg-8">
          <h2>${news.title}</h2>
          <p>${
            news.description == null || news.description == ""
              ? "내용없음"
              : news.description.length > 200
              ? news.description.substring(0, 200) + "..."
              : news.description
          }</p>
          <span>${news.source.name || "no source"} 
          ${moment(news.publishedAt).fromNow()}</span>
        </div>
      </div>
  `
    )
    .join("");
  document.getElementById("news-board").innerHTML = newsHTML;
};

/** 에러 메시지를 보여주는 함수 */
const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

/** 사이드 메뉴 open */
const openNav = () => {
  document.getElementById("sideNav").style.width = "250px";
};

/** 사이드 메뉴 close */
const closeNav = () => {
  document.getElementById("sideNav").style.width = "0";
};

/** 검색 창 open & close */
const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") inputArea.style.display = "none";
  else inputArea.style.display = "inline";
};

// 페이지네이션 특징
// totalResult : 총 몇 개의 결과가 있는지 (주어짐)
// page : 현재 보고있는 페이지 (정해야함)
// pageSize : 한번에 몇 개의 데이터를 가져올지 (default = 20. 정해야함)
// groupSize : 한번에 몇 개의 페이지를 페이지네이션에 보여줄지 (정해야함)
// totalPages : Math.ceil(totalResult / pageSize) (구해야함)
// pageGroup : Math.ceil(page / groupSize) (구해야함)
// 마지막 페이지 값 = pageGroup * groupSize
// 첫 번째 페이지 값 = 마지막 - (groupSize - 1)
// 마지막으로 첫번째 ~ 마지막을 render 해주기

/** 페이지네이션을 그려주는 함수 */
const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = `<li class="page-item" onclick="moveToPage(${
    page - 1
  })"><a class="page-link" href="#">
  <i class="fas fa-angle-left"></i>
  </a></li>
  <li class="page-item" onclick="moveToPage(${firstPage})"><a class="page-link" href="#">
  <i class="fas fa-angle-double-left"></i>
  </a></li>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  paginationHTML += `<li class="page-item" onclick="moveToPage(${
    page + 1
  })"><a class="page-link" href="#">
  <i class="fas fa-angle-right"></i>
  </a></li>
  <li class="page-item" onclick="moveToPage(${lastPage})"><a class="page-link" href="#">
  <i class="fas fa-angle-double-right"></i>
  </a></li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

/** 페이지 번호 클릭 시 해당 페이지를 보여주는 함수 */
const moveToPage = (pageNum) => {
  console.log("moveToPage", pageNum);
  page = pageNum;
  getNews();
};

getLateNews();