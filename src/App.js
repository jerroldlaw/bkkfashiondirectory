import React, { Component } from 'react';
import logo from './logo.svg';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import './App.css';
import moment from 'moment'

class App extends Component {
  constructor() {
    super()

    this.state = {
      data: [],
      dataAll: [],
      columns: [{
        Header: 'Name',
        accessor: 'name',
        filterMethod: (filter, row) => {
          return (row[filter.id].toLowerCase()).includes(filter.value.toLowerCase());
        },
        Cell: ({ row }) => (<a href={row._original.link}>{row.name}</a>)
      },
      {
        Header: 'Likes',
        id: 'engagement.count',
        accessor: d=>Number(d.engagement.count),
        filterMethod: (filter, row) => {
          return row[filter.id] <= filter.value
        }
      }],
      filtered: [],
      filterAll: '',
    }
    this.filterAll = this.filterAll.bind(this);
  }

  componentDidMount() {
    this.getFashionDirectory()
    setInterval(() => {
      this.getFashionDirectory()
    }, 60000)
  }

  onFilteredChange(filtered) {
    if (filtered.length > 1 && this.state.filterAll.length) {
      const filterAll = '';
      this.setState({ filtered: filtered.filter((item) => item.id != 'all'), filterAll })
    }
    else
      this.setState({ filtered });
  }

  filterAll(e) {
    const { value } = e.target;
    const filterAll = value;
    const filtered = [{ id: 'all', value: filterAll }];
    // NOTE: this completely clears any COLUMN filters
    this.setState({ filterAll, filtered });
  }

  getFashionDirectory () {
    fetch('https://bkkfashiondirectorybackend.herokuapp.com/directory/', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      this.setState({data: json})
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Bangkok Facebook Fashion Directory
          </p>
          <p>
            {this.state.data.length} Fashion Pages Listed and Counting
          </p>
        </header>
        <ReactTable
          filtered={this.state.filtered}
          ref={r => this.reactTable = r}
          onFilteredChange={this.onFilteredChange.bind(this)}
          data={this.state.data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          columns={this.state.columns}
        />
    </div>
    )
  }
}


export default App;
