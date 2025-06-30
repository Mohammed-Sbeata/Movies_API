const apiKey = "b9da8a8928ade30c5680978edd9a4330";
const api = "https://api.themoviedb.org/3/movie/";

let search = document.querySelector(".search");

const getData = (url, cb) => {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const dataObj = JSON.parse(xhr.responseText);
      const results = dataObj.results;
      cb(results);
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
};

const renderCards = (arr) => {
  list.innerHTML = "";
  arr.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("card-full");

    const img = document.createElement("img");
    if(element.backdrop_path==null){
      img.src = `code1.jpg`;
    }
    else {img.src = `https://image.tmdb.org/t/p/w500${element.poster_path}`}

    const rating = document.createElement("div");
    rating.className="card-rating fa-solid fa-star";
    rating.textContent = element.vote_average;

    const imgDesc = document.createElement("div");
    imgDesc.classList.add("img-discription");
    
    const groupIcons = document.createElement("div");
    groupIcons.classList.add("group-icons");

    const icon = document.createElement("i");
    icon.className="fa-solid fa-angle-down";

    const lpt = document.createElement("div");
    lpt.classList.add("lpt");
    
    const iconOne = document.createElement("i");
    iconOne.className="fa-regular fa-thumbs-up";

    const iconTwo = document.createElement("i");
    iconTwo.className="fa-solid fa-plus";

    const iconThree = document.createElement("i");
    iconThree.className="fa-solid fa-circle-play";

    

    const desc = document.createElement("div");
    desc.classList.add("main-discription");

    const title = document.createElement("h4");
    title.classList.add("title");
    title.textContent = element.title;

    const year = document.createElement("div");
    year.classList.add("year");
    year.textContent = new Date(element.release_date).getFullYear();

    const discription = document.createElement("div");
    discription.classList.add("discription");
    discription.textContent = element.overview;
    
    icon.addEventListener("click",()=>{
      if(discription.style.display="block"){
      icon.classList.add("fa-angle-up");
      discription.style.display="block";
      img.style="box-shadow:1px 7px 24px rgb(255 0 0)";
      imgDesc.style="position: absolute;top: 350px;z-index: 2;box-shadow:1px 7px 24px rgb(255 0 0)"
      }
    })
    
    card.addEventListener("mouseleave",()=>{
      icon.classList.remove("fa-angle-up");
      discription.style.display="none";
      img.style["box-shadow"]="none";
      imgDesc.style="position: block;box-shadow:none"
    })
    desc.appendChild(title);
    desc.appendChild(year);
    imgDesc.appendChild(desc);
    imgDesc.appendChild(groupIcons);
    imgDesc.appendChild(discription);
    groupIcons.appendChild(icon);
    groupIcons.appendChild(lpt);
    lpt.appendChild(iconOne);
    lpt.appendChild(iconTwo);
    lpt.appendChild(iconThree);
    card.appendChild(img);
    card.appendChild(rating);
    card.appendChild(imgDesc);
    list.appendChild(card);
  });
};


 getData(api + `now_playing?api_key=${apiKey}`, (result) => {
  landPhoto.src= `https://image.tmdb.org/t/p/w500${result[0].poster_path}`;
  titleLand.textContent=result[0]["original_title"];

  parLand.textContent=result[0]["overview"];
  renderCards(result);
  localStorage.setItem('api',JSON.stringify(api + `now_playing?api_key=${apiKey}&page=1`))

});

const filterList = ["Now Playing", "Popular", "Top Rated", "Upcoming"];

const list = document.querySelector(".cards-grid");

const filter = document.querySelector(".filter");


const createFilter = (str) => {
  return document.createElement("div");
};
let landPhoto = document.querySelector(".face-landing img");
let titleLand = document.querySelector(".left-side h2");
let parLand = document.querySelector(".left-side p");
filterList.forEach((element) => {
  let filterElement = createFilter(element);
  filterElement.id = element.toLowerCase().replace(" ", "_");
  filterElement.className="";
  filterElement.textContent = element;
  filter.appendChild(filterElement);
  
  filterElement.addEventListener("click", (e) => {
    getData(api + `${e.target.id}?api_key=${apiKey}`, (result) => {
      renderCards(result);
      localStorage.setItem('api',JSON.stringify(api + `${e.target.id}?api_key=${apiKey}&page=1`))
    });
    let children = document.querySelectorAll(".filter>div");
    children.forEach((helo)=>{
      helo.className="";
    })
    e.target.classList.add("click");
  });
  


});











search.addEventListener("keyup", (e) => {
  if (!e.target.value) {
    getData(api + `now_playing?api_key=${apiKey}`, (result) => {
      
      renderCards(result);
    });
  } else {
    getData(
      api.replace("movie/", "search") +
        `/movie?api_key=${apiKey}&query=${e.target.value}&page=1`,
      (result) => {
        localStorage.setItem('api',JSON.stringify(api.replace("movie/", "search") +
        `/movie?api_key=${apiKey}&query=${e.target.value}&page=1`))
        renderCards(result);
      }
    );
  }
});

const pages = [1, 2, 3, 4, 5];
  const pagesList = document.querySelector(".pages-list");

  pages.forEach((element) => {
    let page = document.createElement("li");
    page.classList.add("page");
    page.textContent = element;
    pagesList.appendChild(page);

    page.addEventListener('click',(e)=>{
      getData(`${JSON.parse(localStorage.getItem('api')).slice(0, -1)}${element}`, (result)=>{
        renderCards(result)
      });
      e.target.classList.add('active')
      // document.querySelectorAll('.page').forEach((el)=>{
      //   if(el != element){
      //     el.classList.remove('active')
      //   }
      // })
    })
  });
