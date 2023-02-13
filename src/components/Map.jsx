/* eslint-disable no-template-curly-in-string */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

import star from "../images/icon-star.svg";
import dollarsign from "../images/dollar-sign.svg";

const MapContainer = () => {
  const [location, setLocation] = useState("");
  const [rad, setRad] = useState(500);
  const [minRating, setMinRating] = useState(3);
  const [maxPrice, setMaxPrice] = useState(3);
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [showRestaurant, setShowRestaurant] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

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
      // Create the autocomplete object
      const autocomplete = new maps.places.Autocomplete(
        document.getElementById("autocomplete"),
        { types: ["geocode"] }
      );
      // Store the autocomplete object
      setAutocomplete(autocomplete);
      // Add event listener to update the location when a place is selected
      maps.event.addListener(autocomplete, "place_changed", () => {
        const place = autocomplete.getPlace();
        setLocation(place.formatted_address);
      });
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
              // check if rating < minRating or price is > maxPrice
              if (
                results[randPlace].rating < minRating ||
                results[randPlace].price_level > maxPrice
              ) {
                console.log(
                  "Name:",
                  results[randPlace].name,
                  "Finding new place Rating: ",
                  results[randPlace].rating,
                  "Price: ",
                  results[randPlace].price_level
                );
                // reload func to get new place
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
    });
    // set map center to marker position
    map.setCenter(marker.getPosition());

    window.google.maps.event.addListener(
      marker,
      "click",
      () => {
        infowindow.setContent(
          `<div>
				<strong>${place.name}</strong>
				<br />
				${place.vicinity}
				</div>
				<a target='_blank' href=https://maps.google.com/?q=${place.name}>View on Google Maps</a>`
        );
        infowindow.open(map, marker);
      },
      { passive: true }
    );
  };

  return (
    <div className="container">
      <h1>What Do You Wana Eat?</h1>
      <p>
        A simple site designed to help you solve the age old question, What Do
        You Wana Eat?
      </p>
      <form className="form-container" onSubmit={handleSubmit}>
        <label>Enter a Location: </label>
        <input
          className="location-input"
          id="autocomplete"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, State or Location"
          required
        />
        <label>Radius: {rad}</label>
        <input
          className="slider"
          type="range"
          value={rad}
          min="1"
          max="5000"
          onChange={(e) => setRad(e.target.value)}
        />
        <label>Min rating: {minRating}</label>
        <input
          className="slider"
          type="range"
          value={minRating}
          min="1"
          max="5"
          onChange={(e) => setMinRating(e.target.value)}
        />
        <label>Max price: {maxPrice}</label>
        <input
          className="slider"
          type="range"
          value={maxPrice}
          min="1"
          max="5"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button className="gen-btn" type="submit">
          Generate
        </button>
      </form>
      {showRestaurant && (
        <div className="restuarant-list-container">
          <h2>{showRestaurant.name}</h2>
          <ul>
            <li>
              <img src={dollarsign} alt="star" />
              Pricing:{" "}
              {showRestaurant.price_level
                ? showRestaurant.price_level + "/5"
                : "No pricing available :("}
            </li>
            <li>
              <img src={star} alt="star" />
              Rating:{" "}
              {showRestaurant.rating
                ? showRestaurant.rating + "/5"
                : "No rating available :("}
              {}
            </li>
            <li>{showRestaurant.vicinity}</li>
            <li>Check it out on Google Maps Below!</li>
          </ul>
        </div>
      )}
      {/* this div draws the map */}
      <div id="map" />
    </div>
  );
};

export default MapContainer;
