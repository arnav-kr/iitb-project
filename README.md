# Invoice Viewer

Invoice Viewer is a simple application that allows you to view invoices, sort and filter them.

It basically consists of two parts:
* Filter controls
* Invoice list

User can use filter controls to filter invoices by date, status and type of client. The list of invoices is updated in real time as user changes filter values.

Using the sort button of each column, user can sort invoices by any column in ascending or descending order.

Technologies used:
* Bootstrap
* HTML5
* CSS3
* JavaScript

### JavaScript

The Javascript part consists of: 

* `constructTable(userJSON, tableId)` - function that constructs the table of invoices given the JSON object containing user data and the id of the table element to put the data in.
* `sortData(data, key, order)` - function that sorts and returns the data by the given key in the given order("asc" | "dec").
* `filterData(data, filterOptions)` - function that filters and returns the data by the given filter options. where data is the JSON object containing user data and filterOptions is an object containing the filter options in the following format:
```js
[
    {
        key: "begin_date",
        value: "2017-01-01"
    },
    {
        key: "status",
        value: "draft"
    }
]
```
* `fetchUsers()` - function that fetches the user data from the local JSON File.
* Event Listeners to handle the filter related input events.

### HTML

The HTML Structure is simple and consists of two `section` elements, one for the filter controls and one for the invoice list.

The filter controls are made up of a `form` element with `input` elements to filter the data.

The invoice list is made up of a `table` element with `thead` and `tbody` elements.

`thead` contains the column headers with sort buttons and `tbody` contains the rows of the table.

### CSS

The CSS part extends the Bootstrap CSS framework to style the application.

It contains styles for the filter controls, the invoice list and the sort buttons.

### Bootstrap

Bootstrap components used:
* `form` - for the filter controls
* `input` - for the filter controls
* `table` - for the invoice list
* `select` - for the filter controls
* `badge` - for the status column
  and other bootstrap classes.

### Screenshots

![Screenshot](https://arnav.is-a.dev/iitb-project/screenshot.jpg)