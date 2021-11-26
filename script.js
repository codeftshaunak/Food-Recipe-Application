//Veriable Selector
const mealElement = document.getElementById('meals');
const buttonElement = document.querySelector('.buttons');
const favElement = document.querySelector('.fav-items');
const recipe = document.getElementById('recipe');

const searchInput = document.getElementById('search-text');
const searchButton = document.getElementById('search');

const themeBtn = document.getElementById('setting');

const themeId = document.querySelector('.theme');
let themeDots = document.getElementsByClassName("theme_main");

const mealsData = document.getElementById('show-data');

//FUNCTION CALL ONE BY ONE
rendomData();
featchFavData();

//Rendom Data From API
async function rendomData() {
        const resp = await fetch(
                "https://www.themealdb.com/api/json/v1/1/random.php"
        );
        const respData = await resp.json();
        const rendomData = respData.meals[0];
        addMeal(rendomData)
};

//Id From API
async function mealDataById(id) {
        const resp = await fetch(
                "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
        );
        const respData = await resp.json();
        const mealId = respData.meals[0];
        return mealId;
};

//Search by name 
async function mealDataByName(term) {
        const resp = await fetch(
                "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
        );
        const respData = await resp.json();
        const mealId = respData.meals;
        return mealId;
};

//Add Data From Rendom Data
function addMeal(mealData) {
        const meal = document.createElement('div');
        const button = document.createElement('button');
        meal.classList.add('recipe-body');
        meal.innerHTML = `      <h3>${mealData.strMeal}</h3>
                                <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                        `
        button.classList.add('fav-btn');
        button.innerHTML = `<i class="fas fa-heart"></i>`

        //Button Click To Add MealId To LocalStorage
        button.addEventListener('click', () => {
                if (button.classList.contains('fav-active')) {
                        button.classList.remove('fav-active');
                        removeDataLS(mealData.idMeal);
                } else {
                        button.classList.add('fav-active');
                        addDataLS(mealData.idMeal);
                }
                featchFavData();
        });

        mealElement.appendChild(meal);
        buttonElement.appendChild(button);
};

//Fetch Data By Search
function searchDataShow(DataShow) {
        const meal = document.createElement('div');
        meal.classList.add('recipe-body');

        if (DataShow == "Nofound") {
                meal.innerHTML = `
                                   <i class="fas fa-frown-open btn disable_1 style="font-size:30px"></i>
                                   <h3>No Data Found</h3>
                                 `
        } else {
                meal.innerHTML = `<h3>${DataShow.strMeal}</h3>
                                  <button class="btn"><i class="fas fa-heart"></i></button>
                                  <img src="${DataShow.strMealThumb}" alt="${DataShow.strMeal}">
                                 `

                //Button Click To Add MealId To LocalStorage
                const btn = meal.querySelector('.btn');
                btn.addEventListener('click', () => {
                        if (btn.classList.contains('fav-active')) {
                                btn.classList.remove('fav-active');
                                removeDataLS(DataShow.idMeal);
                        } else {
                                btn.classList.add('fav-active');
                                addDataLS(DataShow.idMeal);
                        }
                        featchFavData();
                });
        }
        mealElement.appendChild(meal);
};

//Add to LocalStorage
function addDataLS(DataId) {
        const DataIds = getDataLS();
        localStorage.setItem('DataIds', JSON.stringify([...DataIds, DataId]));
};

//Remove to LocalStorage
function removeDataLS(DataId) {
        const DataIds = getDataLS();
        localStorage.setItem('DataIds', JSON.stringify(DataIds.filter((id) => id !== DataId)));
};

//Add from LocalStorage
function getDataLS() {
        const isMeal = JSON.parse(localStorage.getItem('DataIds'));
        return isMeal === null ? [] : isMeal;
};

//Get Data By Id for add fav
async function featchFavData() {
        favElement.innerHTML = "";

        const mealData = getDataLS();
        for (let i = 0; i < mealData.length; i++) {
                const meal = mealData[i];
                getMeal = await mealDataById(meal);
                featchFav(getMeal);
        }
};


//Add Item To Favorite
function featchFav(DataMeal) {
        const favItem = document.createElement('div');

        favItem.classList.add('fav-item');
        favItem.innerHTML = `  <div class="favitems">
                                <img src="${DataMeal.strMealThumb}" alt="${DataMeal.strMeal}">
                                <h5>${DataMeal.strMeal}</h5>
                                </div>
                                <div class="close">
                                <i class="fas fa-times"></i>
                                </div>
                            `
        const btn = favItem.querySelector('.close');
        btn.addEventListener('click', () => {
                removeDataLS(DataMeal.idMeal);
                featchFavData();
        });

        favElement.appendChild(favItem);
        const favimg = favItem.querySelector('.favitems');
        favimg.addEventListener('click', () => {
                showDetails(DataMeal);
                mealsData.classList.toggle('hidden');
        });
};

//Search By Term Function
searchButton.addEventListener('click', async () => {
        //CLear All 
        mealElement.innerHTML = "";

        //Disable fav button
        const fav_btn = document.querySelector('.fav-btn');
        fav_btn.classList.add('disable');
        fav_btn.innerHTML = `<i class="fas fa-grin-hearts"></i>`

        const data = searchInput.value;
        const meal = await mealDataByName(data);
        if (meal) {
                meal.forEach((value) => {
                        searchDataShow(value);
                })
        } else {
                searchDataShow('Nofound');
        }
});

//Show Details
function showDetails(dataShow) {
        mealsData.innerHTML = "";
        const showData = document.createElement('div');
        const intg = [];
        showData.classList.add('data-details');
        for (i = 1; i < 20; i++) {
                if ("strIngredient" + i) {
                        intg.push(`${dataShow["strIngredient" + i]}-${dataShow["strMeasure"+i]}`);
                }
        };
        let text = "<ul>";
        showData.innerHTML = `
                        <div class="data-header">
                                <button><i class="far fa-times-circle btn"></i></button>
                                <h3>Titels of meals</h3>
                        </div>
                        <div class="data-body">
                                <img src="${dataShow.strMealThumb}" alt="${dataShow.strMeal}">
                                <p>
                                        ${dataShow.strInstructions}
                                </p>
                        </div>
                        <div class="data-footer">
                        <br>
                        <h1>Ingredient</h1>
                        ${
                        intg.map((value) => {
                        if (value !== "-" || value !== 'null-null') {
                                text += "<li>" + value + "</li>";
                        }
                        })};
                        ${text += "</ul>"}
                        </div>
                           `
        mealsData.appendChild(showData);
        const btn = showData.querySelector('.btn');
        btn.addEventListener('click', () => {
                mealsData.classList.add('hidden');
        });
};

//Theme Selection
themeBtn.addEventListener('click', () => {
        themeBtn.classList.toggle('setting');
        themeId.classList.toggle('hidden');

        for (var i = 0; i < themeDots.length; i++) {
                themeDots[i].addEventListener("click", function () {
                        let mode = this.dataset.mode;
                        themeData(mode);
                });
        };
});

function themeData(mode) {
        if (mode == 'dark') {
                document.getElementById('theme-style').href = './css/dark.css';
        } else if (mode == 'light') {
                document.getElementById('theme-style').href = './css/light.css';
        } else if (mode == 'manhattan') {
                document.getElementById('theme-style').href = './css/manhattan.css';
        }
};