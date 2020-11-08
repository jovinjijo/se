import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { GraphProps } from './Graphs';

type Props = GraphProps;

let chart: IChartApi | null = null;
let areaSeries: ISeriesApi<'Area'>, volumeSeries: ISeriesApi<'Histogram'>;

function Chart(props: Props): JSX.Element {
  const thisRef = React.useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  const prevStock = usePrevious(props.selectedStock);
  const prevTickData = usePrevious(props.selectedStockTickData);

  useEffect(() => {
    chart = createChart(thisRef.current, {
      width: 800,
      height: 400,
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
        borderVisible: false,
      },
    });

    areaSeries = chart.addAreaSeries({
      topColor: 'rgba(38,198,218, 0.56)',
      bottomColor: 'rgba(38,198,218, 0.04)',
      lineColor: 'rgba(38,198,218, 1)',
      lineWidth: 2,
    });

    volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
  }, []);

  useEffect(() => {
    if (prevStock !== props.selectedStock) {
      if (volumeSeries)
        volumeSeries.setData(
          props.selectedStockTickData?.map((tick) => ({
            time: new Date(tick.time).getTime() as UTCTimestamp,
            value: tick.quantity,
            color: 'rgba(0, 150, 136, 0.8)',
          })) || [],
        );
      if (areaSeries)
        areaSeries.setData(
          props.selectedStockTickData?.map((tick) => ({
            time: new Date(tick.time).getTime() as UTCTimestamp,
            value: tick.price,
          })) || [],
        );
    } else if (prevTickData !== props.selectedStockTickData) {
      // Case where only tick data has changed. Ideally, instead of setting the whole tick data, find the delta and use the update method to update the graph
      if (volumeSeries)
        volumeSeries.setData(
          props.selectedStockTickData?.map((tick) => ({
            time: new Date(tick.time).getTime() as UTCTimestamp,
            value: tick.quantity,
            color: 'rgba(0, 150, 136, 0.8)',
          })) || [],
        );
      if (areaSeries)
        areaSeries.setData(
          props.selectedStockTickData?.map((tick) => ({
            time: new Date(tick.time).getTime() as UTCTimestamp,
            value: tick.price,
          })) || [],
        );
    }
  }, [props.selectedStock, props.selectedStockTickData]);

  return <div ref={thisRef} id="chart" />;
}

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default Chart;
