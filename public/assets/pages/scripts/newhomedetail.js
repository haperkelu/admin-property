var MapsGoogle = function () {

    var mapGeocoding = function () {

        var map = new GMaps({
            div: '#gmap_marker',
            lat: -12.043333,
            lng: -77.028333
        });

        var handleAction = function () {
            var text = '20 george st, sydney';
            GMaps.geocode({
                address: text,
                callback: function (results, status) {
                    if (status == 'OK') {
                        var latlng = results[0].geometry.location;
                        map.setCenter(latlng.lat(), latlng.lng());
                        map.addMarker({
                            lat: latlng.lat(),
                            lng: latlng.lng(),
                            title: text,
                            infoWindow: {
                                content: '<span style="color:#000">'+text+'</span>'
                            }
                        });
                    }
                }
            });
        }
        
        handleAction();
    }


    return {
        //main function to initiate map samples
        init: function () {
            mapGeocoding();
        }

    };

}();

jQuery(document).ready(function() {
    MapsGoogle.init();
});