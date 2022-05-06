
/*
تابع زیر به هر یک از لینک های مشخص شده برای فیلم ها درخواست گِت می دهد و پاسخ را به فرمت مشخص شده در قالب یک پرامیس ذخیره می کند.
با پایان یافتن تمام پرامیس ها به ترتیب مشخص شده لیست فیلم ها ساخته می شود.
*/
function swapi() {
    var promises = [];
    [4, 5, 6, 1, 2, 3].forEach(id => {
        promises.push(fetch(`https://swapi.dev/api/films/${id}`).then((resp) => (resp.json())));
    });
    
    Promise.all(promises).then((resp) => {
        // اگر قبلا لیستی در صفحه وجود دارد لیست حذف و لیست جدید ساخته می شود
        if(document.getElementById("main_content")) document.body.removeChild(document.getElementById("main_content"));
        var main_content = document.createElement("div");
        main_content.id = "main_content";
        var main_list = document.createElement("ul");
        main_list.id = "films";
        resp.forEach(data => {
            let child = document.createElement("li");
            let span = document.createElement("span");
            let button = document.createElement("button");
            button.setAttribute("class", "starships_button");
            button.setAttribute("type", "button");
            button.innerText = "Starships";
            button.onclick = showStarships;
            // دو ویژگی زیر برای انتقال اطلاعات هنگام رخ دادن ایونت به تابع مشخص شده است
            button.setAttribute("starships", data.starships);
            button.setAttribute("page_number", "0");
            span.innerText += data.title;
            span.innerHTML += "&emsp;";
            span.innerText += data.episode_id;
            span.innerHTML += "&emsp;";
            span.innerText += data.release_date;
            span.innerHTML += "&emsp;";
            span.appendChild(button);
            child.appendChild(span);
            main_list.appendChild(child);
        });
        main_content.appendChild(main_list);
        
        document.body.appendChild(main_content);
    });
}

function showStarships() {
    // اطلاعات زیر در دکمه ذخیره شده بود و این جا استفاده می شود
    starships_url = this.getAttribute("starships").split(",");
    page_number = parseInt(this.getAttribute("page_number"));
    var promises = [];
    starships_url.forEach(url => {
        promises.push(fetch(url).then((resp) => (resp.json())));
    });
    // تنها کشتی هایی که در بازه مشخص شده هستند در هر صفحه نمایش داده می شوند.
    Promise.all(promises.slice(5*page_number, 5*page_number+5)).then((resp) => {
        if(document.getElementById("main_content")) document.body.removeChild(document.getElementById("main_content"));
        var main_content = document.createElement("div");
        main_content.id = "main_content";
        var main_list = document.createElement("ul");
        main_list.id = "starships";
        resp.forEach(data => {
            let child = document.createElement("li");
            let button = document.createElement("button");
            button.setAttribute("class", "starships_detail_button");
            button.setAttribute("type", "button");
            // سه ویژگی زیر برای نمایش اطلاعات مربوط به کشتی و همچنین بازگشت به صفحه کشتی ها است.
            button.setAttribute("detail", JSON.stringify(data));
            button.setAttribute("starships", this.getAttribute("starships"));
            button.setAttribute("page_number", page_number);
            button.onclick = showStarshipDetail;
            button.innerText = data.name;

            child.appendChild(button);
            main_list.appendChild(child);
        });
        main_content.appendChild(main_list);
        
        let button3 = document.createElement("button");
        button3.classList.add("control_button");
        button3.setAttribute("type", "button");
        button3.innerText = "Prev";
        button3.setAttribute("starships", this.getAttribute("starships"));
        button3.setAttribute("page_number", page_number - 1);
        button3.onclick = showStarships;
        if(page_number == 0) button3.disabled = true;
        main_content.appendChild(button3);

        let page_element = document.createElement("span");
        page_element.innerHTML = "&ensp;Page ";
        page_element.innerHTML += page_number + 1;
        page_element.innerHTML += "&ensp;"
        main_content.appendChild(page_element);
    
        let button2 = document.createElement("button");
        button2.classList.add("control_button");
        button2.setAttribute("type", "button");
        button2.innerText = "Next";
        button2.setAttribute("starships", this.getAttribute("starships"));
        button2.setAttribute("page_number", page_number + 1);
        button2.onclick = showStarships;
        if(page_number >= parseInt((starships_url.length-1)/5)) button2.disabled = true;
        main_content.appendChild(button2);
        
        main_content.append(document.createElement("br"));
        
        let button = document.createElement("button");
        button.classList.add("control_button");
        button.setAttribute("type", "button");
        button.innerText = "Back to Films list";
        button.onclick = swapi;
        main_content.appendChild(button);

        document.body.appendChild(main_content);
    });
}

// در تابع زیر که برای نمایش جزئیات هر کشتی است از ابزارهایی مشابه توابع قبلی استفاده شده است.
function showStarshipDetail() {
    starship = JSON.parse(this.getAttribute("detail"));
    starship_films_url = starship.films;
    var promises = [];
    starship_films_url.forEach(url => {
        promises.push(fetch(url).then((resp) => (resp.json())));
    });
    

    Promise.all(promises).then((resp) => {
        if(document.getElementById("main_content")) document.body.removeChild(document.getElementById("main_content"));
        var main_content = document.createElement("div");
        main_content.id = "main_content";
        var main_list = document.createElement("ul");
        main_list.id = "starship_detail";

        let child1 = document.createElement("li");
        child1.innerText = "Name: ";
        child1.innerText += starship.name;
        let child2 = document.createElement("li");
        child2.innerText = "Model: ";
        child2.innerText += starship.model;
        let child3 = document.createElement("li");
        child3.innerText = "Manufacturer: ";
        child3.innerText += starship.manufacturer;
        let child4 = document.createElement("li");
        child4.innerText = "#Crew: ";
        child4.innerText += starship.crew;
        let child5 = document.createElement("li");
        child5.innerText = "#Passengers: ";
        child5.innerText += starship.passengers;
        main_list.appendChild(child1);
        main_list.appendChild(child2);
        main_list.appendChild(child3);
        main_list.appendChild(child4);
        main_list.appendChild(child5);

        resp.forEach(data => {
            let child = document.createElement("li");
            child.innerText = "Film: ";
            child.innerText += data.title;
            main_list.appendChild(child);
        });
        main_content.appendChild(main_list);
        let button = document.createElement("button");
        button.classList.add("control_button");
        button.setAttribute("type", "button");
        button.innerText = "Back to Starships list";
        button.setAttribute("starships", this.getAttribute("starships"));
        button.setAttribute("page_number", this.getAttribute("page_number"));
        button.onclick = showStarships;
        main_content.appendChild(button);

        document.body.appendChild(main_content);
    });

}