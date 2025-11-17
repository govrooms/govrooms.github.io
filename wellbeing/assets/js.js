const searchBox = document.getElementById('searchBox');
const ResultsTag = document.getElementById('results');
let previousSearchText = '';
let searchTimer = 1;

searchBox.addEventListener("keyup", event => {	
	let searchText = searchBox.value;
	if(searchText == previousSearchText || searchText.trim().length < 3)return true;

	previousSearchText = searchText;

	search.runSearch(searchText);
});

const search = {
	fieldsToSearch: ['Title', 'Category', 'Author']
	, extraFieldsToShow: ['Category', 'Description', 'Email', 'Phone']

	, populateCategoryList() {
			const uniqueCats = WellbeingList.reduce((acc, obj) => {
		  		if (!acc.includes(obj.Category)) {
		    	acc.push(obj.Category);
		  	}
	  		return acc;
			}, []).sort();
			let ul = document.getElementById('categoryUL')
			for(let i=0;i<uniqueCats.length;i++) {
				const li = document.createElement('li');
				const anch = document.createElement('a');
				anch.className = ('govuk-link');
				anch.href = "#";
				anch.onclick = function() {search.replaceSearchValueFromCat(uniqueCats[i]) };
				anch.innerText = uniqueCats[i];
				li.appendChild(anch);
				ul.appendChild(li);
			}
	}

	,replaceSearchValueFromCat(cat) {
	  searchBox.value = cat;
	  this.runSearch(cat);
	}

	, runSearch(searchText) {
		const results = this.getOfficeRecords(searchText);
		this.officeHTML(results);

		// GA4 track search text
		if(!window.dataLayer)return;
		clearTimeout(searchTimer);		
		searchTimer = setTimeout(function(){
			sText = searchText.replace(/[^a-zA-Z0-9 ]/g, '');
			sText = sText.substring(0,99)
			window.dataLayer.push({
        'event': 'wellbeing_search',
        'search_text': sText,
        'search_results_count': results.length
      });

		},3000);
	}

	, match(haystack, needle) {
		return haystack.toLowerCase().indexOf(needle.toLowerCase())>-1
	}

	,getOfficeRecords(searchText) {		
		const results = WellbeingList.filter((room) => {
			for(let i=0;i<this.fieldsToSearch.length;i++) 
				if(this.match(room[this.fieldsToSearch[i]],searchText))return true;
			return false;
		});
		return results;
	}

	,officeHTML(results) {
		let html = results.length ? '<ul class="govuk-list">' : '<h2 class="govuk-heading-m">No results found</h2>';
		if(results.length) {
			for(let i=0;i<results.length;i++){
				const r = results[i];
				let listItemHTML = '<li><h2 class="govuk-heading-m">' + r.Title + '</h2>';
				if(r.Website)listItemHTML += '<p><a target="_blank" href="' + r.Website + '">' + r.LinkText + '</a>'; 
				listItemHTML += this.fieldsHTML(this.extraFieldsToShow, r);
				listItemHTML += '</li>'
				html += listItemHTML;
			}
			html += '</ul>';
		}
		ResultsTag.innerHTML = html;
	}

	,fieldsHTML(fields, obj) {
		let fieldsHTML = '';
		for(let j=0;j<fields.length;j++) {
			const f=fields[j];
			if(obj[f])fieldsHTML += '<p class="govuk-body"><strong>' + f + ':</strong> ' + obj[f] + '</p>'
		}
	return fieldsHTML;
	}
}

search.populateCategoryList();
