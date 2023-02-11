/* eslint-disable no-template-curly-in-string */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

const MapContainer = () => {
  const [location, setLocation] = useState("");
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [showRestaurants, setShowRestaurants] = useState([]);

  useEffect(() => {
    loadMap();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location) {
      loadMap();
    }
  };

  const loadMap = () => {
    if (window.google) {
      const maps = window.google.maps;
      const mapNode = document.getElementById("map");
      const geocoder = new maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK") {
          const mapConfig = {
            center: results[0].geometry.location,
            zoom: 15,
          };
          const map = new maps.Map(mapNode, mapConfig);
          setMap(map);

          const infowindow = new maps.InfoWindow();
          setInfowindow(infowindow);

          const request = {
            location: mapConfig.center,
            radius: "500",
            type: ["restaurant"],
          };

          const service = new maps.places.PlacesService(map);
          service.nearbySearch(request, (results, status) => {
            if (status === maps.places.PlacesServiceStatus.OK) {
              setShowRestaurants(results);
              for (let i = 0; i < results.length; i++) {
                createMarker(results[i], map, infowindow);
              }
            }
          });
        }
      });
    }
  };

  const createMarker = (place, map, infowindow) => {
    const marker = new window.google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name,
      // icon: {
      //   url: place.icon,
      //   size: new window.google.maps.Size(71, 71),
      //   origin: new window.google.maps.Point(0, 0),
      //   anchor: new window.google.maps.Point(17, 34),
      //   scaledSize: new window.google.maps.Size(25, 25),
      // },
    });

    window.google.maps.event.addListener(marker, "click", () => {
      infowindow.setContent(
        `<div>
				<strong>${place.name}</strong>
				<br />
				${place.vicinity}
				</div>
				<a target='_blank' href=https://maps.google.com/?q=${place.name}>View on Google Maps</a>`
      );
      infowindow.open(map, marker);
    });
  };

  return (
    <div className="container">
      <h1>What Do You Wana Eat?</h1>
      <h3>Enter a Location</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        <p>Restaurants:</p>

        {showRestaurants.map((place, index) => (
          <div className="restuarant-list-container">
            <p key={index}>{place.name}</p>
            {/* <li key={index}>{place.vicinity}</li> */}
            {/* <a
              target="_blank"
              rel="noreferrer"
              href="https://maps.google.com/?q=${place.name}"
            >
              View on Google Maps
            </a> */}
          </div>
        ))}
      </div>
      <div className="map-container">
        <div id="map" style={{ height: "700px", width: "100%" }} />
      </div>
    </div>
  );
};

export default MapContainer;
