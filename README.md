# react-editable-table

Based on: [react-data-components](https://github.com/carlosrocha/react-data-components).

## Getting started

```sh
npm install react-editable-table --save
```

### Using the default implementation

The default implementation includes a filter for case insensitive global search,
pagination and page size.

```javascript
var React = require('react');
var DataTable = require('react-editable-table').DataTable;

var columns = [
  { title: 'Site', prop: 'site'  },
  { title: 'Country', prop: 'country' },
  { title: 'Domain', prop: 'domain', validation: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/ },
  { title: 'Phone', prop: 'phone', editable: false }
];

var data = [
  { site: 'google', country: 'USA', domain: 'google.com', phone: 'phone value' }
  // It also supports arrays
  // [ 'name value', 'city value', 'address value', 'phone value' ]
];

React.render((
    <DataTable
      className="container"
      keys={[ 'site' ]}
      columns={columns}
      initialData={data}
      initialPageLength={5}
      initialSortBy={{ prop: 'site', order: 'desc' }}
      pageLengthOptions={[ 5, 20, 50 ]}
    />
  ), document.body);
```

See [complete example](example/table/main.js).

## DataMixin options

### `keys: Array<string | number>`
Properties that make each row unique, e.g. an id.

### `columns: Array<ColumnOption>`
See `Table` column options.

### `pageLengthOptions: Array<number>`
### `initialData: Array<object | Array<any>>`
### `initialPageLength: number`
### `initialSortBy: { prop: string | number, order: string }`

## Table column options

### `title: string`
The title to display on the header.

### `prop: string | number`
The name of the property or index on the data.

### `editable: boolean`
Enable / Disable possibility edit property data.

### `render: (val: any, row: any) => any`
Function to render a different component.

### `className: string | (val: any, row: any) => string`
Class name for the td.

### `defaultContent: string`
### `sortable: boolean`
### `width: string | number`
