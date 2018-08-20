/** Setup work for the page to be run on page load. */
function setUpPage() {
	preloadImages();
	updateDateInputs();
}

function preloadImages() {
	const imageUrls = ["fc-benji.jpg", "fc-chocolate.jpg", "fc-chromecast.jpg",
  "fc-gwen.jpg", "fc-hangers.jpg", "fc-towels.jpg", "fc-xbox.jpg"];
  for (const imageUrl of imageUrls) {
    const img = new Image();
    const urlRoot = "http://tashawych.co/images/";
    img.src = urlRoot + imageUrl;
  }
}

function showImage(imageName) {
	const x = document.getElementById("amenity");
	x.src = "http://tashawych.co/images/" + imageName;
}

/**
 * Sets the min of the date inputs to today if they haven't been set yet.
 * Otherwise sets the min of the end date to the value of the start date.
 */
function updateDateInputs() {
	const reservationStartDate = document.getElementById("reservationStartDate");
	const reservationEndDate = document.getElementById("reservationEndDate");
	const reservationStartDateValue = reservationStartDate.value;

	if (reservationStartDateValue) {
		setDateInputMinValue(reservationEndDate, undefined /* date */, reservationStartDateValue);
	} else {
		const today = new Date();
		setDateInputMinValue(reservationStartDate, today);
		setDateInputMinValue(reservationEndDate, today);
	}
}

/**
 * Sets the given dateInput's min value to the given date. Only one of date
 * or dateValue should be set.
 * @param {!Element} dateInput The date input element to update.
 * @param {!Date} date
 * @param {string=} dateValue Explicit string value to set as min value.
 */
function setDateInputMinValue(dateInput, date, dateValue) {
	if (!!dateValue) {
		dateInput.setAttribute("min", dateValue);
		return;
	}

	let dd = date.getDate();
	let mm = date.getMonth() + 1; // January is 0.
	const yyyy = date.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm
	}

	const dateString = yyyy + '-' + mm + '-' + dd;
	dateInput.setAttribute("min", dateString);
}

function initMap() {
	const latLng = {lat: 37.40535, lng: -122.01485};
	const map = new google.maps.Map(document.getElementById("map"), {
	  zoom: 9,
	  center: latLng
	});
	const marker = new google.maps.Marker({
	  position: latLng,
	  map: map
	});
}