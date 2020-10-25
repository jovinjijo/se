import * as React from 'react';
import { DataGrid, ColDef, RowsProp } from '@material-ui/data-grid';
import { OrderStoreDetails } from '@se/api';
import { OrderView } from '../Orders';

interface Props {
  orders: OrderStoreDetails;
  selectedView: OrderView;
}

export default function OrdersTable(props: Props): JSX.Element {
  const { selectedView, orders } = props;
  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', sortable: false, width: 47, headerAlign: 'left', align: 'left' },
    { field: 'price', headerName: 'Price', type: 'number', width: 65, headerAlign: 'left', align: 'left' },
    { field: 'quantity', headerName: 'Qty', type: 'number', width: 65, headerAlign: 'left', align: 'left' },
    { field: 'symbol', headerName: 'Symbol', width: 80, headerAlign: 'left', align: 'left' },
    { field: 'type', headerName: 'Type', width: 63, headerAlign: 'left', align: 'left' },
    { field: 'time', headerName: 'Time', width: 207, headerAlign: 'left', align: 'left' },
    selectedView === 'Confirmed'
      ? { field: '', width: 0 }
      : { field: 'status', headerName: 'Status', headerAlign: 'left', align: 'left' },
  ];

  let rows;

  if (selectedView === 'Confirmed') {
    rows = orders.confirmedOrders;
  } else {
    rows = [...orders.placedBuyOrders, ...orders.placedSellOrders];
  }

  return <DataGrid rows={rows as RowsProp} columns={columns} rowHeight={30} pageSize={10} />;
}
