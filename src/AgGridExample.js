import React, { useState } from 'react';
import { AgGridReact, AgGridColumn } from '@ag-grid-community/react';
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

import FakeServerData from './data.json';

export const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const httpRequest = new XMLHttpRequest();
    const updateData = (data) => {
      var dataSource = {
        rowCount: null,
        getRows: function (params) {
          console.log(params);
          console.log('asking for ' + params.startRow + ' to ' + params.endRow);
          setTimeout(function () {
            var rowsThisPage = data.slice(params.startRow, params.endRow);
            var lastRow = -1;
            if (data.length <= params.endRow) {
              lastRow = data.length;
            }
            params.successCallback(rowsThisPage, lastRow);
          }, 500);
        },
      };
      params.api.setDatasource(dataSource);
    };
    updateData(FakeServerData);
  };

  return (
    <div style={{ width: '1366px', height: '600px'}}>
      <div
        id="myGrid"
        style={{
          height: '100%',
          width: '100%',
        }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          modules={[InfiniteRowModelModule]}
          defaultColDef={{
            flex: 1,
            resizable: true,
            minWidth: 100,
          }}
          components={{
            loadingRenderer: function (params) {
              if (params.value !== undefined) {
                return params.value;
              } else {
                return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/images/loading.gif">';
              }
            },
          }}
          rowBuffer={0}
          rowSelection={'multiple'}
          rowModelType={'infinite'}
          paginationPageSize={100}
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={1}
          infiniteInitialRowCount={1000}
          maxBlocksInCache={10}
          onGridReady={onGridReady}
          cacheBlockSize={10}
        >
          <AgGridColumn
            headerName="ID"
            maxWidth={100}
            valueGetter="node.id"
            cellRenderer="loadingRenderer"
          />
          <AgGridColumn field="athlete" minWidth={150} />
          <AgGridColumn field="age" />
          <AgGridColumn field="country" minWidth={150} />
          <AgGridColumn field="year" />
          <AgGridColumn field="date" minWidth={150} />
          <AgGridColumn field="sport" minWidth={150} />
          <AgGridColumn field="gold" />
          <AgGridColumn field="silver" />
          <AgGridColumn field="bronze" />
          <AgGridColumn field="total" />
        </AgGridReact>
      </div>
    </div>
  );
};
