var a = [];
var iller = [];
var asisayisi = [];
var features_covid = [];

var map3 = L.map('map3').setView([41.0333,29.0097], 9);

L.tileLayer('	https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map3);

$.getJSON("http://netigmademo.netcad.com.tr/geoserver/musilaj/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=musilaj%3Ailceye_gore_calisan&outputFormat=application%2Fjson", function (data) {

    var b = data;    

    


  



    var info = L.control();

    info.onAdd = function (map3) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        this._div.innerHTML = '<h4>İlçeye Göre Çalışan Sayısı</h4>' + (props ?
            '<b><h3 class="asilama_il">' + props.ilce + '</h3></b><br /><b>' + props.isci_sayisi.toLocaleString('tr', 'TR') + '</b> İşçi Bulunmaktadır.'
            +  ''
            : 'Lütfen İşçi Sayısını Öğrenmek İstediğiniz İlçenin Üzerine Geliniz.');       
    };

    info.addTo(map3);

    info.deletePercent = function (param) {
        param.unbindTooltip();
    }

    

    
    function getColor(d) {
        return d > 1000000 ? '#800026' :
            d > 45000 ? '#BD0026' :
                d > 25000 ? '#E31A1C' :
                    d > 15000 ? '#FC4E2A' :
                        d > 5000 ? '#FD8D3C' :
                            d > 1000 ? '#FEB24C' :
                                d > 100 ? '#FED976' :
                                    '#FFEDA0';
    }

    function style(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.isci_sayisi)
        };
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        info.update(layer.feature.properties);
        info.deletePercent(layer);
        /*info.addPercent(layer,layer.feature.properties)  ;*/
    }

    var geojson;

    function resetHighlight(e) {

        geojson.resetStyle(e.target);
        info.update();
        /*info.deletePercent(e.target);*/
    }

    function zoomToFeature(e) {
        map3.fitBounds(e.target.getBounds());
        var layer = e.target;
        info.addPercent(layer, layer.feature.properties);

    }


    function onEachFeature(feature, layer) {

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map3);

    map3.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map3) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 100, 1000, 5000, 15000, 25000, 35000, 45000,1000000],
            labels = [],
            from, to;

        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map3);


});



var chart_birinci_doz_en_az = [];
var chart_birinci_doz_en_fazla = [];
var chart_ikinci_doz_en_az = [];
var chart_ikinci_doz_en_fazla = [];


$.getJSON("https://raw.githubusercontent.com/PrattSAVI/Musilaj/main/apis/2021-06-13.geojson", function (data) {

    var b = data;

    a.push(data)

    for (i = 0; i < b.features.length; i++) {



        var obj = new Object();
        obj.il = b.features[i].properties.il;
        obj.asi_oran = b.features[i].properties.birinci_doz_yuzde;
        var jsonString = JSON.stringify(obj);
        chart_birinci_doz_en_az.push(obj);
    }


    L.geoJson(data).addTo(map3);
 


});

