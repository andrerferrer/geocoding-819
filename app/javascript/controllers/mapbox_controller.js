import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

// in Ruby
// class MapboxController < Controller
class MapboxController extends Controller {
  static values = {
    apiKey: String,
    markers: Array
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue

    // @map = Map::Mapboxgl.new()
    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/epems/ckfgv9jef20ae19qcweazlcvl"
    })
    this.#addMarkersToMap();
    this.#fitMapToMarkers();

    this.map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl }))

  }

  // in JS we use #smth to say that it`s private
  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {

    // Create a HTML element for your custom marker
    const customMarker = document.createElement("div")
    customMarker.className = "marker"
    customMarker.style.backgroundImage = `url('${marker.image_url}')`
    customMarker.style.backgroundSize = "contain"
    customMarker.style.width = "25px"
    customMarker.style.height = "25px"

      const popup = new mapboxgl.Popup().setHTML(marker.info_window) 
      new mapboxgl.Marker(customMarker)
        .setLngLat([ marker.lng, marker.lat ])
        .setPopup(popup)
        .addTo(this.map)
    });
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([ marker.lng, marker.lat ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }
}

export default MapboxController;
