import * as React from 'react';
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';
import { OrderStoreDetails } from '@se/api';
import { OrderView } from '../Orders';

interface Props {
  orders: OrderStoreDetails
  selectedView: OrderView
}

const columns: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 70 },
  { field: 'lastName', headerName: 'Last name', width: 70 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 70,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 70,
    valueGetter: (params: ValueGetterParams) =>
      `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 5, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 6, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
];

export default function OrdersTable(props: Props) {
  const { selectedView, orders } = props;

  // let rows, cols;

  // if(selectedView === 'Confirmed') {
  //   rows = orders.confirmedOrders;
  // } else {
  //   rows = [...orders.placedBuyOrders, ...orders.placedSellOrders]
  // }

  return <DataGrid rows={rows} columns={columns} rowHeight={30} pageSize={10} />;
}
