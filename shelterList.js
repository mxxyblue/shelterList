/**shelterList.js*/
// 주소 - 인증키 - type - 서비스명 - startindex - endindex
const API_URL = 'http://openapi.seoul.go.kr:8088/';
const API_KEY = '49674146446d78783939556f63736e';
const API_TYPE = 'json';
const API_SERVICE = 'TbGtnHwcwP';
const COUNT_PER_PAGE = 10;
let TOTAL_COUNT = 1000; //2118
const prev = document.querySelector('.prev-button');
const next = document.querySelector('.next-button');
const numberButtonWrapper = document.querySelector('.number-button-wrapper'); // 페이지네이션 버튼 wrapper
let ALL_LIST = [];
let pageNumberButtons;

window.onload = function(){
    firstPaging();
};

async function firstPaging(){
    await apiCall(); //전체 데이터 호출
    setPageButtons(1); //페이지 버튼 출력
    setPage(1); //페이지에 맞는 게시물 출력
    setButtonEvent(); //버튼 이벤트 설정
    setPrevNextButtonEvent(); //이전, 이후 버튼 이벤트 설정
}

function getTotalPageCount(){
    return Math.ceil(TOTAL_COUNT / COUNT_PER_PAGE);
}

function setPageButtons(startIndex){
    let str = "";
    for(let i=startIndex; 
        i <= COUNT_PER_PAGE * (startIndex - 1) + 10 && i <= ALL_LIST.length; 
        i++
    ){
        numberButtonWrapper.innerHTML += '<button class="number-button">' + i + '</button>';
    }
    pageNumberButtons = document.querySelectorAll('.number-button');
}


function setButtonEvent(){
    for(let i=0; i<pageNumberButtons.length; i++){
        pageNumberButtons[i].addEventListener('click', numButtonClick);
    }
    let searchBtn = document.querySelector('.searchBtn');
    searchBtn.addEventListener('click', search);
}

function search(){
    let searchKeyword = document.querySelector('.searchKeyword').value;
    let tmp = "";
    let tmpArray = [];
    if(!(searchKeyword === "" || searchKeyword === undefined)){
        for(let i=0; i<ALL_LIST.length; i++){
            tmp = ALL_LIST[i].R_AREA_NM;

            if(tmp.includes(searchKeyword) === true){
                tmpArray.push(ALL_LIST[i]);
            }
        }
        ALL_LIST = [];

        for(let i=0; i < tmpArray.length; i++){
            ALL_LIST.push(tmpArray[i]);
        }
        TOTAL_COUNT = tmpArray.length;
        
        setPageButtons(1); //페이지 버튼 출력
        setPage(1); //페이지에 맞는 게시물 출력
        setButtonEvent(); //버튼 이벤트 설정
    }
}

function setPrevNextButtonEvent(){
    prev.addEventListener('click', prevButtonClick);
    next.addEventListener('click', nextButtonClick);
}

function prevButtonClick(){
    let idx = Number(document.querySelectorAll('.number-button')[0].innerHTML);
    if(!(idx === 1)){
        for(let i=0; i<10; i++){
            idx--;
            pageNumberButtons[9-i].innerHTML = idx;
        }
        setPage(idx);
    }
}

function nextButtonClick(){
    let idx = Number(document.querySelectorAll('.number-button')[COUNT_PER_PAGE - 1].innerHTML);
    if(!(idx * 10 === TOTAL_COUNT)){ 
        for(i=0; i<10; i++){
            idx++;
            pageNumberButtons[i].innerHTML = idx;
        }
        setPage(idx-9);
    }
}

function setPage(pageNumber){
    let str = "";

    for( let i = COUNT_PER_PAGE * (pageNumber - 1);
         i < COUNT_PER_PAGE * (pageNumber - 1) + 10 && i <= ALL_LIST.length;
         i++)
        {   
            str += '<tr>';
            str += '<td>' +ALL_LIST[i].R_SEQ_NO + '</td>';
            str += '<td>' +ALL_LIST[i].EQUP_TYPE + '</td>';
            str += '<td>' +ALL_LIST[i].R_AREA_NM + '</td>';
            str += '<td>' +ALL_LIST[i].R_DETL_ADD + '</td>';
            str += '<td>' +ALL_LIST[i].CHK3_YN + '</td>';
            str += '<td>' +ALL_LIST[i].DT_START + '</td>';
            str += '<td>' +ALL_LIST[i].DT_END + '</td>';
            str += '</tr>'
        }
    document.querySelector('tbody#shelterList').innerHTML = str;
}

function numButtonClick(){
    setPage(event.currentTarget.textContent);
}

async function apiCall() {
    let URL = API_URL + API_KEY + "/" + API_TYPE + "/" + API_SERVICE + "/" + '1' + "/" + TOTAL_COUNT;
    
    const res = await fetch(URL);
    const data = await res.json();

    for(let i=0; i<TOTAL_COUNT; i++){
        ALL_LIST.push(data[API_SERVICE]['row'][i]);
    }
}
