// Selectors
const IP = document.querySelector("#ip-address");
const ADDRESS = document.querySelector("#address");
const TIMEZONE = document.querySelector("#timezone");
const ISP = document.querySelector("#isp");
const INPUT = document.querySelector("#ip-input");
const form = document.querySelector("form");
const error = document.querySelector(".error");

// Mapbox
const mapboxkey =
  "pk.eyJ1IjoiZGM0Mzk4IiwiYSI6ImNraHltM2c0ZjA2MHEycm9odjVhanB6OWkifQ.WUEdFjdXijZqINrNeuB7Qg";
const geoLocationkey = "at_ulQVMxs4RrOwfcu8NVvd446dmiVga";

//  Link
const ipfinder = "https://api.ipify.org/?format=json";
const geoLocation = `https://geo.ipify.org/api/v1?apiKey=${geoLocationkey}&ipAddress=`;

// Listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  getGeoLocation(INPUT.value);
});

// Code
mapboxgl.accessToken = mapboxkey;

var map;

const generateMap = (lat, lng) => {
  map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // mapbox style
    center: [lng, lat], // longitude and latitude
    zoom: 12, // zoom
  });
  new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
};

const getIp = async () => {
  const requestHeader = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${ipfinder}`, requestHeader);
  const data = await res.json();
  getGeoLocation(data.ip);
};

const getGeoLocation = async (ip) => {
  ip = ip.trim();
  const regex = new RegExp(
    "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
  );
  if (!regex.test(ip)) {
    error.innerHTML = "Please enter a valid IP";
    return null;
  }
  try {
    const res = await fetch(`${geoLocation}${ip}`);
    const data = await res.json();

    setText(
      data.ip,
      `${data.location.city}, ${data.location.country} ${data.location.postalCode}`,
      data.location.timezone,
      data.isp
    );

    generateMap(data.location.lat, data.location.lng);
  } catch (err) {
    console.log(err);
  }
};

const setText = (ip, address, timezone, isp) => {
  IP.innerHTML = ip;
  ADDRESS.innerHTML = address;
  TIMEZONE.innerHTML = `UTC ${timezone}`;
  ISP.innerHTML = isp;
};

getIp();
// marker
