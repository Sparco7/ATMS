// https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26&limit=5

// https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26

// @bundled-es-modules/axios

// npm install @bundled-es-modules/axios

// npm install simple-datatables

// https://www.npmjs.com/package/vanilla-datatables

import { DataTable } from "/node_modules/simple-datatables/dist/module/index.js";
import { axios } from "./node_modules/@bundled-es-modules/axios/index.js";

const myTable = document.querySelector("#myTable");

let titles = document.querySelector("tr#table-titles");
let tableBody = document.querySelector("tbody#table-body");

// map

// build the table
const drawTable = (content) => {
  // console.log(content);
  let allTitles = content.fields;
  let tableDataArr = content.records;
  drawTitles(allTitles);
  // const titlesArr = allTitles.map((title) => title.id);
  drawRows(tableDataArr);
  getCoords(content.records);
};

const drawRows = (data) => {
  let row = "";

  for (const iterator of data) {
    row = "";
    for (const key in iterator) {
      row += `<td>${iterator[key]}</td>`;
    }
    tableBody.innerHTML += row;
  }
};

// build titles
const drawTitles = (allTitles) => {
  let row = "";

  allTitles.forEach((curTitle) => {
    row += `<th scope="col">${curTitle.id}</th>`;
  });

  titles.innerHTML = row;
};

//----------------FETCH DATA----------------
const response = axios({
  url: "https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26&limit=500",
  method: "GET",
}).then((res) => {
  drawTable(res.data.result);
  const dataTable = new DataTable(myTable);
  showOnMap(res.data.result.records);
});

//----------------MAP--------------------------

const showOnMap = (dataAtm) => {
  const dataTableInput = document.querySelector(".dataTable-input");
  dataTableInput.addEventListener("input", (event) => {
    const searchValue = event.target.value;
    const data = dataAtm;
    // console.log(dataTable.searchData);
    // console.log(dataTable.data()[0]);

    let filtered = filterTable(data, searchValue);
    console.log(filtered);
    getCoords(filtered);
    // selectorMapElement.innerHTML = ''
    // map = new google.maps.Map(selectorMapElement, myOptions)
    // init_map(filteredFields)
  });
};

// filter results
const filterTable = (data, val) => {
  return data.filter((atm) => {
    return atm.City.includes(val);
  });
};

const getCoords = (coords) => {
  const coordsArr = [];
  for (let index = 0; index < coords.length; index++) {
    let coordsEl;
    if (coords[index].Y_Coordinate > 34) {
      coordsEl = {
        x: coords[index].X_Coordinate,
        y: coords[index].Y_Coordinate,
        address: coords[index].ATM_Address,
        name: coords[index].Bank_Name,
      };
    } else {
      coordsEl = {
        x: coords[index].Y_Coordinate,
        y: coords[index].X_Coordinate,
        address: coords[index].ATM_Address,
        name: coords[index].Bank_Name,
      };
    } // else
    coordsArr.push(coordsEl);
  } // for

  init_map(coordsArr);
};

function init_map(coordsArr) {
  // console.log("coordsArr are: ", coordsArr);
  let selectorMapElement = document.querySelector("#gmap_canvas");
  let googleMapTitle = "ATM 1";
  let googleMapAddress = "disingov 31 Tel-Aviv";
  let googleMapLat = 32.0798729;
  let googleMapLong = 34.7938805;

  const myOptions = {
    zoom: 8,
    center: new google.maps.LatLng(googleMapLat, googleMapLong),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  const map = new google.maps.Map(selectorMapElement, myOptions);

  for (let index = 0; index < coordsArr.length; index++) {
    const marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(coordsArr[index].x, coordsArr[index].y),
    });
    // console.log("x: ", coordsArr[index].x, "y: ", coordsArr[index].y);
    google.maps.event.addListener(marker, "click", function () {
      infowindow.open(map, marker);
    });

    let infowindow = new google.maps.InfoWindow({
      content: `
          <strong>${coordsArr[index].name}</strong>
          <br>${coordsArr[index].address}<br>
        `,
    });
  } // for
}

google.maps.event.addDomListener(window, "load", init_map);
