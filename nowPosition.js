function getPosition() {
    navigator.geolocation.getCurrentPosition(geoSet);
}

function geoSet(position) {

    var date = new Date(position.timestamp);
    let geo_text = "lon:" + position.coords.longitude + ",lnt:" + position.coords.latitude + ",time:" + date.toLocaleString();

    liff.sendMessages(geo_text);

}
