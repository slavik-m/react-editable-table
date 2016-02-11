require('../../css/table-twbs.css');

var React = require('react');
var { DataTable } = require('react-data-components');
var d3 = require('d3');

function buildTable(reqData) {
  var renderMapUrl =
    (val, row) =>
      <a href={`https://www.google.com/maps?q=${row['LAT']},${row['LON']}`}>
        Google Maps
      </a>;

  /*var tableColumns = [
    { title: 'Name', prop: 'NAME' },
    { title: 'City', prop: 'CITY' },
    { title: 'Street address', prop: 'STREET ADDRESS' },
    { title: 'Phone', prop: 'PHONE NUMBER', defaultContent: '<no phone>' },
    { title: 'Map', render: renderMapUrl, className: 'text-center' }
  ];*/

  var tableColumns = [
    { title: 'Name', prop: 'name', sort: true, search: true },
    { title: 'City', prop: 'city', sort: true },
    { title: 'Street address', prop: 'address' },
    { title: 'Phone', prop: 'phone', defaultContent: '<no phone>' }
  ];

  var data = [
    { ukey: 1, name: 'aadsw value3', city: 'city value2', address: 'address value', phone: '1,000,000' },
    { ukey: 2, name: 'basdfa value2', city: 'city value5', address: 'address value', phone: '9' },
    { ukey: 3, name: 'cadx value1', city: 'city value1', address: 'address value', phone: '1' },
    { ukey: 4, name: 'wertw value4', city: 'city value1', address: 'address value', phone: '300' },
    { ukey: 5,  name: 'aadf value5', city: 'city value1', address: 'address value', phone: '500' },
    { ukey: 6, name: 'ddd value6', city: 'city value6', address: 'address value', phone: '9,999' },
    { ukey: 7, name: 'ddd value6', city: 'city value6', address: 'address value', phone: '9,999' },
    { ukey: 8, name: 'aadsw value3', city: 'city value2', address: 'address value', phone: '1,000,000' },
    { ukey: 9, name: 'basdfa value2', city: 'city value5', address: 'address value', phone: '9' },
    { ukey: 10, name: 'cadx value1', city: 'city value1', address: 'address value', phone: '1' },
    { ukey: 11, name: 'wertw value4', city: 'city value1', address: 'address value', phone: '300' },
    { ukey: 12,  name: 'aadf value5', city: 'city value1', address: 'address value', phone: '500' },
    { ukey: 13, name: 'ddd value6', city: 'city value6', address: 'address value', phone: '9,999' },
    { ukey: 14, name: 'ddd value6', city: 'city value6', address: 'address value', phone: '9,999' },
    { ukey: 15, name: 'aadsw value3', city: 'city value2', address: 'address value', phone: '1,000,000' },
    { ukey: 16, name: 'basdfa value2', city: 'city value5', address: 'address value', phone: '9' },
    { ukey: 17, name: 'cadx value1', city: 'city value1', address: 'address value', phone: '1' },
    { ukey: 18, name: 'wertw value4', city: 'city value1', address: 'address value', phone: '300' },
    { ukey: 19,  name: 'aadf value5', city: 'city value1', address: 'address value', phone: '500' },
    { ukey: 20, name: 'ddd value6', city: 'city value6', address: 'address value', phone: '9,999' },
    { ukey: 21, name: 'ddd value6', city: 'city value6', address: 'address value', phone: '9,999' },
    { ukey: 22, name: 'ddd value6', city: 'city value6', address: 'address value', phone: '9,999' }
  ];

  return (
    <DataTable
      className="container"
      keys={[ 'ukey' ]}
      columns={tableColumns}
      initialData={data}
      initialPageLength={5}
      initialSortBy={{ prop: 'phone', order: 'descending' }}
      pageLengthOptions={[ 5, 20, 50 ]}
    />
  );
}

d3.csv('/sample_data.csv', function(error, rows) {
  React.render(buildTable(rows), document.body);
});
