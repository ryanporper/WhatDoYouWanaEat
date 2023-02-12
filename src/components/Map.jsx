/* eslint-disable no-template-curly-in-string */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

const MapContainer = () => {
  const [location, setLocation] = useState("");
  const [rad, setRad] = useState(500);
  const [minRating, setMinRating] = useState(3);
  const [maxPrice, setMaxPrice] = useState(3);
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [showRestaurant, setShowRestaurant] = useState(null);

  useEffect(() => {
    loadMap();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location) loadMap();
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
            radius: rad,
            type: ["restaurant"],
          };

          const service = new maps.places.PlacesService(map);
          service.nearbySearch(request, (results, status) => {
            if (status === maps.places.PlacesServiceStatus.OK) {
              const randPlace = Math.floor(Math.random() * results.length);
              if (
                results[randPlace].rating < minRating ||
                results[randPlace].price_level > maxPrice
              ) {
                console.log(
                  "Finding new place Rating: ",
                  results[randPlace].rating,
                  "Price: ",
                  results[randPlace].price_level,
                  "Name:",
                  results[randPlace].name
                );
                loadMap();
                return;
              }
              setShowRestaurant(results[randPlace]);
              createMarker(results[randPlace], map, infowindow);
              // for (let i = 0; i < results.length; i++) {
              //   console.log(results[i]);
              // }
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
      <p>
        A simple site designed to help you solve the age old question, What Do
        You Wana Eat?
      </p>
      <p>Fill out all fields and get a random place near you to eat at!</p>
      <form className="form-container" onSubmit={handleSubmit}>
        <label>Enter a Location: </label>
        <input
          className="location-input"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, State or Location"
          required
        />
        <label>Enter a search radius</label>
        {/* <p>(0-1000 | 500 is a good avg)</p> */}
        <label>Radius: {rad}</label>
        <input
          className="slider"
          type="range"
          value={rad}
          min="1"
          max="5000"
          onChange={(e) => setRad(e.target.value)}
        />
        <label>Min rating {minRating}</label>
        <input
          className="slider"
          type="range"
          value={minRating}
          min="1"
          max="5"
          onChange={(e) => setMinRating(e.target.value)}
        />
        <label>Max price {maxPrice}</label>
        <input
          className="slider"
          type="range"
          value={maxPrice}
          min="1"
          max="5"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button type="submit">Generate</button>
      </form>
      {showRestaurant && (
        <div className="restuarant-list-container">
          <h2>{showRestaurant.name}</h2>
          <h3>
            Pricing:{" "}
            {showRestaurant.price_level
              ? showRestaurant.price_level + "/5"
              : "No pricing available :("}
          </h3>
          <h3>
            Rating:{" "}
            {showRestaurant.rating
              ? showRestaurant.rating + "/5"
              : "No rating available :("}
          </h3>
          <p>Business Status: {showRestaurant.business_status}</p>
          <p>Check it out on Google Maps Below!</p>
        </div>
      )}
      <div className="map-container">
        {/* this div draws the map */}
        <div id="map" />
      </div>
    </div>
  );
};

export default MapContainer;
