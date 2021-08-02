// https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26&limit=5

// https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26

// @bundled-es-modules/axios

// npm install @bundled-es-modules/axios

// npm install simple-datatables

// https://www.npmjs.com/package/vanilla-datatables

import { DataTable } from "/node_modules/simple-datatables/dist/module/index.js";
import {axios} from "./node_modules/@bundled-es-modules/axios/index.js";

const myTable = document.querySelector("#myTable");

let titles = document.querySelector("tr#table-titles");
let tableBody = document.querySelector("tbody#table-body");

// build the table
const drawTable = (content) => {
  console.log(content);
  let allTitles = content.fields;
  let tableDataArr = content.records;
  drawTitles(allTitles);
  // const titlesArr = allTitles.map((title) => title.id);
  drawRows(tableDataArr);
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
  url: "https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26&limit=200",
  method: "GET",
}).then((res) => {
  drawTable(res.data.result);
  const dataTable = new DataTable(myTable);
});
