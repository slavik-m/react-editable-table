require('../../css/table-twbs.css');

var React = require('react');
var { DataTable } = require('react-data-components');
var d3 = require('d3');
var _ = require('lodash');

var App = React.createClass({
  getInitialState(){
    /*var data = this.props.rows.map((item, i) => {
     item.ukey = i;
     return item;
     });*/
    return {
      tableColumns: this.props.cols,
      data: this.props.data,
      loading: 'loading false'
    }
  },

  handleChange(data) {
    // console.log(data.length);
    this.setState({
      data: data
    });
    // console.log('Change', data);
  },

  handleClick() {
    this.setState({
      data: [
        {
          type: '*',
          value: '*some.com',
        },
        {
          type: 'app',
          value: '*df.com',
        },
        {
          type: 'site',
          value: 'site.com',
        }
      ]
    });
  },

  handleState() {
    this.setState({
      loading: 'loading true'
    });
  },

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Change data</button>
        <button onClick={this.handleState}>Change state</button>

        <div>{this.state.loading}</div>
        <DataTable
          className="container"
          keys={['ukey']}
          columns={this.state.tableColumns}
          initialData={this.state.data}
          initialPageLength={5}
          initialSortBy={{ prop: 'type', order: 'ascending' }}
          pageLengthOptions={[5, 20, 50]}
          onChange={this.handleChange}
        />
        <pre>
          <code>
            {JSON.stringify(this.state.data, null, 2)}
          </code>
        </pre>
      </div>
    );
  }
});

d3.csv('/555_TEST.csv', function (d) {
  return d;
}, function (error, rows) {
  // var data = _.uniq(rows);
  var cols = [
    {
      title: 'type',
      prop: 'type',
      type: 'STRING',
      sort: true,
      search: true,
      defaultContent: '*',
      defaultValue: '*',
      editor: {
        type: 'dropdown',
        options: [
          { label: '*', value: '*' },
          { label: 'app', value: 'app' },
          { label: 'site', value: 'site' }
        ]
      }
    },
    {
      title: 'Domain',
      prop: 'value',
      type: 'STRING',
      sort: true,
      search: true,
      defaultContent: '<domain>',
      editor: {
        type: 'text'
      }
    },
  ];
  React.render(<App data={rows} cols={cols}/>, document.body);
});

/*
 [
 { title: 'Domain', prop: 'domain', validation: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,sort: true, search: true, defaultContent: '<name>' },
 { title: 'City', prop: 'city', sort: true, editable: false, defaultContent: '<city>' },
 { title: 'Street address', prop: 'address', defaultContent: '<street>' },
 { title: 'Phone', prop: 'phone', defaultContent: '<no phone>' }
 ],

 [
 { ukey: 1, domain: 'google.com', city: 'city value2', address: 'address value', phone: '1,000,000' },
 { ukey: 2, domain: 'google.com', city: 'city value5', address: 'address value', phone: '9' },
 { ukey: 3, domain: 'google.com', city: 'city value1', address: 'address value', phone: '1' },
 { ukey: 4, domain: 'google.com', city: 'city value1', address: 'address value', phone: '300' },
 { ukey: 5,  domain: 'google.com', city: 'city value1', address: 'address value', phone: '500' },
 { ukey: 6, domain: 'google.com', city: 'city value6', address: 'address value', phone: '9,999' },
 { ukey: 7, domain: 'ddd.val', city: 'city value6', address: 'address value', phone: '9,999' },
 { ukey: 8, domain: 'aadsw.val', city: 'city value2', address: 'address value', phone: '1,000,000' },
 { ukey: 9, domain: 'basdfa.val', city: 'city value5', address: 'address value', phone: '9' },
 { ukey: 10, domain: 'cadx.val', city: 'city value1', address: 'address value', phone: '1' },
 { ukey: 11, domain: 'wertw.val', city: 'city value1', address: 'address value', phone: '300' },
 { ukey: 12, domain: 'aadf.val', city: 'city value1', address: 'address value', phone: '500' },
 { ukey: 13, domain: 'ddd.va', city: 'city value6', address: 'address value', phone: '9,999' },
 { ukey: 14, domain: 'ddd.val', city: 'city value6', address: 'address value', phone: '9,999' },
 { ukey: 15, domain: 'aadsw.al', city: 'city value2', address: 'address value', phone: '1,000,000' },
 { ukey: 16, domain: 'basdfa.va', city: 'city value5', address: 'address value', phone: '9' },
 { ukey: 17, domain: 'cadx.va', city: 'city value1', address: 'address value', phone: '1' },
 { ukey: 18, domain: 'wertw.va', city: 'city value1', address: 'address value', phone: '300' },
 { ukey: 19, domain: 'aadf.val', city: 'city value1', address: 'address value', phone: '500' },
 { ukey: 20, domain: 'ddd.val', city: 'city value6', address: 'address value', phone: '9,999' },
 { ukey: 21, domain: 'ddd.al', city: 'city value6', address: 'address value', phone: '9,999' },
 { ukey: 22, domain: 'ddd.val', city: 'city value6', address: 'address value', phone: '9,999' }
 ]*/