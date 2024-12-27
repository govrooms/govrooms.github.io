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
	fieldsToSearch: ['Title', 'Address 1', 'Address 2', 'Address 3', 'Town/City', 'Postcode']
	, extraFieldsToShow: ['Block', 'Floor', 'Room', 'Gender', 'Wudhu', 'Jummah time', 'Notes', 'Halal food']

	, extraFieldsToShowMasjid: ['Tel', 'Email', 'Website', 'Jummah timing', 'Notes']

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
        'event': 'room_search',
        'search_text': sText,
        'results': results.count
      });

		},3000);
	}

	, match(haystack, needle) {
		return haystack.toLowerCase().indexOf(needle.toLowerCase())>-1
	}

	,getOfficeRecords(searchText) {		
		const results = RoomsList.filter((room) => {
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
				const r = results[i]
				let listItemHTML = '<li><h2 class="govuk-heading-m">' + r.Title + '</h2></dt><h3 class="govuk-heading-s">' + r['Address 1'] + ' ' + r['Address 2'] + ' ' + r['Address 3'] + ' ' + r['Town/City'] + ' ' + r.Postcode + '</h3>' + this.fieldsHTML(this.extraFieldsToShow, r);
				if(r['Closest Masjids'])
					listItemHTML += this.showMasjids(r['Closest Masjids']);
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

	,showMasjids(matchIds) {
		let masjidHTML = '<details class="govuk-details"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Closest Masjids</span></summary><div class="govuk-details__text">';
		var postcodes = matchIds.split(',');
		for(let i=0;i<postcodes.length;i++) {
			var postcode = postcodes[i].trim();
			if(postcodes[i].trim().length>4) {
				const masjid = this.getMasjid(postcode);
				if(masjid) masjidHTML += this.masjidHTML(masjid);
			}
		}
		return masjidHTML + '</div></details>';
	}

	,getMasjid(postcode) {
		return MasjidList.find(masjid => masjid.Match_ID === postcode);
	}	

	,masjidHTML(masjid) {
		const r = masjid;
		let html = '<details class="govuk-details"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">' + r.Title + '</summary>';
		html += '<div class="govuk-details__text"><h4 class="govuk-heading-s">' + r.Title + ' - ' + r['Address 1'] + ' ' + r['Address 2'] + ' ' + r['Address 3'] + ' ' + r['Town/City'] + ' ' + r.Postcode + '</h4>' + this.fieldsHTML(this.extraFieldsToShowMasjid, masjid);
		
		return html + '</div></details>';
	}
}
