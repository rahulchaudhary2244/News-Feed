const getCarouselNextBtn = (id) => {
	return `<button
     class="next-button"
     type="button"
     data-bs-target="#carousel-${id}-controls"
     data-bs-slide="next"
>
     <i class="fa-solid fa-angle-right"></i>
     <span class="visually-hidden">Next</span>
</button>`;
};

const getCarouselPrevBtn = (id) => {
	return `<button
     class="prev-button"
     type="button"
     data-bs-target="#carousel-${id}-controls"
     data-bs-slide="prev"
>
     <i class="fa-solid fa-angle-left"></i>
     <span class="visually-hidden">Previous</span>
</button>`;
};

const getFormattedDate = (date) => {
	let d = new Date(date);
	return d.toLocaleString("en-IN", {
		day: "2-digit", // numeric, 2-digit
		year: "2-digit", // numeric, 2-digit
		month: "2-digit", // numeric, 2-digit, long, short, narrow
	});
};

const getFeedCard = (item) => {
	return `<div class="card border-0">
     <a href="${item.link}" target="_blank">
     <div class="fill-background">
          <img
               src="${item.enclosure.link}"
               class="card-img-top"
               alt="${item.title}"
          />
     </div>
     </a>
     <div class="card-body">
          <div class="topic-heading">${item.title}</div>
          <div class="topic-writer">
               <div>${item.author}</div>
               <div class="period"></div>
               <div>${getFormattedDate(item.pubDate)}</div>
          </div>
          <div class="topic-content">
               ${item.content}
          </div>
     </div>
</div>`;
};

const getCarouselItem = (item, isActive) => {
	return `<div class="carousel-item ${isActive ? "" : "active"}">${getFeedCard(
		item
	)}</div>`;
};

const getCarouselInner = (items) => {
	let element = "";
	items.forEach((item, idx) => {
		element += getCarouselItem(item, idx);
	});
	return `<div class="carousel-inner">${element}</div>`;
};

const getCaousel = (data) => {
	return `<div
     id="carousel-${data.id}-controls"
     class="carousel slide d-flex flex-row flex-nowrap"
     data-bs-ride="carousel">
		${getCarouselPrevBtn(data.id)}
		${getCarouselInner(data.items)}
		${getCarouselNextBtn(data.id)}
	</div>`;
};

const createAccordian = (id) => {
	const div = document.createElement("div");
	div.setAttribute("id", `accordion-${id}`);
	div.classList.add("accordion", "accordion-flush");
	document.getElementById(id).append(div);
	return div;
};

const getAccordianItem = (data, isFirstAccordianItem) => {
	console.log(data);
	const div = document.createElement("div");
	div.classList.add("accordion-item");
	div.innerHTML = `
	<h2 class="accordion-header" id="heading-${data.id}">
		<button
			class="accordion-button ${isFirstAccordianItem ? "" : "collapsed"}"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#collapse-${data.id}"
			aria-expanded="true"
			aria-controls="collapse-${data.id}"
		>
			<span>${data.feed.title}</span>
		</button>
	</h2>
	<div
		id="collapse-${data.id}"
		class="accordion-collapse collapse ${isFirstAccordianItem ? "show" : ""}"
		aria-labelledby="heading-${data.id}"
	>
		<div class="accordion-body">
			${getCaousel(data)}
		</div>
	</div>`;
	return div;
};

const getApis = (magazines = []) =>
	magazines.map((x) => `https://api.rss2json.com/v1/api.json?rss_url=${x}`);

const addAccordianElement = async ({ id, magazines }) => {
	const accor = createAccordian(id);
	let isFirstAccordianItem = true;
	const APIs = getApis(magazines);
	for (let idx = 0; idx < APIs.length; idx++) {
		const API_URL = APIs[idx];
		const res = await fetch(API_URL);
		const data = await res.json();
		if (data.status === "ok") {
			data.id = idx;
			accor.append(getAccordianItem(data, isFirstAccordianItem));
			isFirstAccordianItem = false;
		}
	}
};

const getInput = (magazines) => {
	return {
		id: "today-news",
		magazines: magazines,
	};
};

const init = (magazines) => {
	console.log("init");
	addAccordianElement(getInput(magazines));
};

const magazines = [
	"https://flipboard.com/@TheHindu.rss",
	"https://assessment-rss.s3.ap-south-1.amazonaws.com/coronavirus.rss",
	"https://assessment-rss.s3.ap-south-1.amazonaws.com/india-tech.rss",
	"https://assessment-rss.s3.ap-south-1.amazonaws.com/sports-star.rss",
];

init(magazines);
