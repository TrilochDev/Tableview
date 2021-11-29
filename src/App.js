import './App.css';
import { Cell, Column, Row, TableView, TableBody, TableHeader } from '@adobe/react-spectrum';
import { Provider, defaultTheme, ActionButton, View, Button } from '@adobe/react-spectrum';
import { useAsyncList } from '@react-stately/data';
import React from 'react';

function App() {
  let columns = [
    { name: 'Modality', key: 'modality' },
    { name: 'Patient id', key: 'patientId' },
    { name: 'Study Id', key: 'studyId' },
    { name: 'Study date', key: 'studyDate' },
    { name: 'Images', key: 'images' },
    { name: 'Study Description', key: 'studyDescription' },
    { name: 'Performing Physician', key: 'performingPhysician' },
    { name: 'Refering Physician', key: 'referingPhysician' }
  ];


  var maxCount = 10;
  let [count, setCount] = React.useState(0);

  var list = useAsyncList({
    async load({ signal }) {
      console.log("loading from : " + count + " to " + (count + maxCount))

      var url = "http://localhost:8000/patients?";

      let res = await fetch(url + "_start=" + count + "&_end=" + (count + maxCount), { signal });

      let json = await res.json();

      return {
        items: json
      };
    }

  }
  );


  return (
    <Provider theme={defaultTheme} >
      <TableView aria-label="example async loading table" height="size-3000">
        <TableHeader columns={columns}>
          {(column) => (
            <Column
              key={column.key}
              align={column.key === 'date' ? 'end' : 'center'}>
              {column.name}
            </Column>
          )}
        </TableHeader>

        <TableBody
          items={list.items}
          loadingState={list.loadingState}
          onLoadMore={list.loadMore}>
          {(item) => (
            <Row key={item.studyId}>{(key) => <Cell> {item[key]}</Cell>}</Row>
          )}
        </TableBody>
      </TableView>

      <View>
        <Button onPress={() => loadLess.call()} > {count}  Previous</Button>
        <Button onPress={() => loadMore.call()} > {count} Next</Button>
      </View>

    </Provider>


  );

  function loadMore() {
    setCount((c) => c + maxCount);
    list.reload();
    console.log("clicked :" + count)
  }
  function loadLess() {
    setCount((c) => c - maxCount);
    list.reload();
    console.log("clicked :" + count)
  }

}


export default App;
