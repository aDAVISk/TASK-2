function getPosition() {
    navigator.geolocation.getCurrentPosition(geoSet);
}

function geoSet(position) {

    let geo_text = "properties;{'lon':" + position.coords.longitude + ",lat:" + position.coords.latitude + "}";

    liff.sendMessages(geo_text);
}
