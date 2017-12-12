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