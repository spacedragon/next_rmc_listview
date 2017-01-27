import React from 'react';
import ReactDOM from 'react-dom';
import ListView from 'rmc-list-view';

const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    const getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };
    const getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[rowID];
    };

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.dataBlob = {};
    this.sectionIDs = [];
    this.rowIDs = [];
    this._genData = (pIndex = 0) => {
      for (let i = 0; i < NUM_SECTIONS; i++) {
        const ii = pIndex * NUM_SECTIONS + i;
        const sectionName = `Section ${ii}`;
        this.sectionIDs.push(sectionName);
        this.dataBlob[sectionName] = sectionName;
        this.rowIDs[ii] = [];

        for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
          const rowName = `S${ii}, R${jj}`;
          this.rowIDs[ii].push(rowName);
          this.dataBlob[rowName] = rowName;
        }
      }
      // new object ref
      this.sectionIDs = [].concat(this.sectionIDs);
      this.rowIDs = [].concat(this.rowIDs);
    };
    this._genData();
    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
      isLoading: false,
    };
  }

  _onEndReached(event) {
    // load new data
    console.log('reach end', event);
    this.setState({ isLoading: true });
    setTimeout(() => {
      this._genData(++pageIndex);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(
          this.dataBlob, this.sectionIDs, this.rowIDs
        ),
        isLoading: false,
      });
    }, 1000);
  }

  render() {

    return (<div style={{ margin: '10px auto', width: '80%' }}>
      <ListView
        ref="lv"
        style={{ height: 200 }}
        dataSource={this.state.dataSource}
        renderHeader={() => (
          <div style={{ height: 90, backgroundColor: '#bbb' }}>
            <span>Table Header</span>
            <button onClick={() => { this.refs.lv.scrollTo(0, 200); } }>scrollTo(0, 200)</button>
          </div>
        )}
        renderSectionHeader={(sectionData) => (
          <div style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 6,
            backgroundColor: '#5890ff',
          }}
            >
            <span style={{ color: 'white' }}>
              {sectionData}
            </span>
          </div>
        )}
        renderRow={(rowData) => (<span >{rowData}</span>)}
        renderFooter={() => (
          <div style={{
            backgroundColor: '#bbb', color: 'white',
            padding: 30, textAlign: 'center',
          }}
            >
            {this.state.isLoading ? 'loading...' : 'loaded'}
          </div>
        )}
        initialListSize={10}
        pageSize={4}
        scrollRenderAheadDistance={500}
        scrollEventThrottle={20}
        onScroll={() => { console.log('scroll'); } }
        onEndReached={this._onEndReached.bind(this)}
        onEndReachedThreshold={10}
        useZscroller
        scrollerOptions={{ scrollbars: true }}
        renderBodyComponent={() => <div className="for-body-demo" />}
        onLayout={() => console.log('onLayout')}
        />
       
    </div>);
  }

}

