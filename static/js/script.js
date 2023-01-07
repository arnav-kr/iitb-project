function constructTable(userJSON, tableId) {

  // get table and table body
  let table = document.getElementById(tableId);
  let tableBody = table.querySelector('tbody');

  // empty the table body
  tableBody.innerHTML = "";

  // if no data found, show message
  if (userJSON.length == 0) {
    let row = document.createElement('tr');
    let cell = document.createElement('td');
    cell.textContent = "No data found";
    cell.colSpan = 8;
    cell.setAttribute("style", "border-radius: 1rem !important;");
    cell.classList.add("text-center");
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  // loop over users
  userJSON.forEach(user => {

    // create a row for each user
    let row = document.createElement('tr');

    // loop over properties of user object
    Object.keys(user).forEach(key => {

      // create a cell for each property value
      let cell = document.createElement("td");

      // add the value to the cell in a span so that we can style it in css easily
      let span = document.createElement("span");

      // add the value to the span useTextContent to avoid XSS
      span.textContent = user[key];

      // add respective property class
      span.classList.add(key + "-value");

      // if its status, add badge class and data-value attribute for styling with css
      if (key === "status") {
        span.classList.add("badge", "fw-semibold")
        span.dataset.value = user[key];
      }

      // add the span to cell and cell to the row
      cell.appendChild(span);
      row.appendChild(cell);
    });

    // add the rows to the table body
    tableBody.appendChild(row);
  });
}

function sortData(data, key, order) {
  // sort data by key
  return data.sort((a, b) => {
    // get values to compare
    let aValue = a[key];
    let bValue = b[key];

    // if values are numbers, convert them to numbers
    if (!isNaN(aValue) && !isNaN(bValue)) {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    // if values are strings, convert them to lowercase to avoid case issues
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // sort according to order
    if (order === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

function filterData(data, filterOptions) {
  // filter data by key
  if (filterOptions.length == 0) return data;
  return data.filter(user => {
    // make a collection of bools to check if all conditions are met
    let bools = [];

    // loop over filter options
    filterOptions.forEach(option => {

      // if its begin date
      if (option.key == "begin_date") {
        let begin_date = new Date(option.value);
        let user_date = new Date(user.date.split("/").reverse().join("-"));

        // if matches: true
        console.log(user_date, begin_date);
        if (user_date.getTime() == begin_date.getTime()) {
          bools.push(true);
        }
        // else false
        else {
          bools.push(false);
        }
      }
      // if its end date
      else if (option.key == "due_date") {
        let due_date = new Date(option.value);
        let user_due_date = new Date(user.due_date.split("/").reverse().join("-"));

        // if matches: true
        if (user_due_date.getTime() == due_date.getTime()) {
          bools.push(true);
        }
        // else false
        else {
          bools.push(false);
        }
      }
      // if its empty, default to true
      else if (option.value == "") {
        bools.push(true);
      }
      // if doesn't match what in user object then false, specifically for status and client_type
      else if (user[option.key] != option.value) {
        bools.push(false);
      }
      // else true
      else {
        bools.push(true);
      }
    });
    // return true if all bools are true
    return bools.every(bool => bool == true);
  });
}

// fetch users from local JSON file
async function fetchUsers() {
  // get local JSON file
  let response = await fetch('./static/users.json');

  // await response and return JSON
  let users = await response.json();
  return users;
}

// wait for DOM to load before updating the table with data
window.addEventListener("DOMContentLoaded", async () => {

  // fetch users
  let users = await fetchUsers();

  // cache the data so that can access it inside event listeners
  globalThis.filteredCache = users;

  // construct table
  constructTable(users, "users");

  // add event listener to sort buttons
  document.querySelectorAll(".sort").forEach(btn => {
    btn.addEventListener("click", () => {
      // get the order
      let order = btn.dataset.order || "dec";

      // sort data
      let sortedData = sortData(globalThis.filteredCache, btn.dataset.target, order);

      // update order in button so that can know the previous order
      btn.dataset.order = order === "asc" ? "dec" : "asc";

      // reconstruct table
      constructTable(sortedData, "users");
    });

    document.querySelectorAll(".filter_input").forEach(input => {
      input.addEventListener("change", () => {

        // loop over input elements to get their values and respective ids
        let filterOptions = Array.from(document.querySelectorAll(".filter_input")).map(input => {
          if (input.value !== "") {
            return {
              key: input.id,
              value: input.value
            }
          }
        }).filter(param => param !== undefined);

        // filter data
        globalThis.filteredCache = filterData(users, filterOptions);

        // reconstruct table
        constructTable(globalThis.filteredCache, "users");
      });
    });
  });
});