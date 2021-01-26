import * as React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import * as colors from './colors';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';

const mcc = 'color:orange;';

const fullsize = '&outputsize=full';
const api_key = '&apikey=P0DEX8H2101QNDAR';

export interface SimpleAreaChartProps {
    symbol: string;
}

export interface SimpleAreaChartState {
    data_intraday?: any;
    data_daily?: any;
    data_daily_full?: any;
    selected_tab?: string;
    // domain_y?: any;
}

export default class SimpleAreaChart extends React.Component<SimpleAreaChartProps, SimpleAreaChartState> {
    constructor(props: SimpleAreaChartProps) {
        super(props);
        this.state = {
            data_intraday: null,
            data_daily: null,
            data_daily_full: null,
            selected_tab: 'days_1',
            // domain_y: ['dataMin - 5', 'dataMax + 5']
        };
    }

    public componentDidMount() {
        const { symbol } = this.props;

        this.get_data_intraday(symbol).then((data_intraday: any) => {
            console.log('%c : SimpleAreaChart -> componentDidMount -> data_intraday', mcc, data_intraday);

            const arr = data_intraday['Time Series (5min)'];
            const data_intraday_chart_data = Object.keys(arr).map((key, index) => {
                return {
                    time: key,
                    value: arr[key]['4. close']
                };
            });
            console.log('%c : SimpleAreaChart -> componentDidMount -> data_intraday_chart_data', mcc, data_intraday_chart_data);

            this.setState({
                data_intraday: data_intraday_chart_data,
            });
        })
    }

    public get_data_intraday = (symbol) => new Promise(resolve => {
        const url_start = 'https://www.alphavantage.co/query?function=';
        const url = url_start + 'TIME_SERIES_INTRADAY' + '&symbol=' + symbol + '&interval=5min' + api_key;

        fetch(url).then(res => res.json()).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                console.log('%c : SimpleAreaChart -> componentDidMount -> error', mcc, error);
                resolve(error);
            }
        );
    })

    public get_data_daily = (symbol, get_full) => new Promise(resolve => {
        const fullsize = get_full ? '&outputsize=full' : '';

        const url_start = 'https://www.alphavantage.co/query?function=';
        const url = url_start + 'TIME_SERIES_DAILY' + '&symbol=' + symbol + api_key + fullsize;

        fetch(url).then(res => res.json()).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                console.log('%c : SimpleAreaChart -> componentDidMount -> error', mcc, error);
                resolve(error);
            }
        );
    })

    private _handleLinkClick = (item: PivotItem): void => {
        console.log('%c : SimpleAreaChart -> item', mcc, item);
        const i_key = item.props.itemKey;

        // const domain_y = i_key == 'max'
        //     ? [-1000, 1000]
        //     : ['dataMin - 5', 'dataMax + 5'];


        if ((i_key == 'days_5' || i_key == 'months_1') && !this.state.data_daily) {
            this.get_data_daily(this.props.symbol, false).then((data_daily: any) => {
                console.log('%c : SimpleAreaChart -> componentDidMount -> data_daily', mcc, data_daily);

                const arr = data_daily['Time Series (Daily)'];
                const data_daily_chart_data = Object.keys(arr).map((key, index) => {
                    return {
                        time: key,
                        value: arr[key]['4. close']
                    };
                });
                console.log('%c : SimpleAreaChart -> componentDidMount -> data_daily_chart_data', mcc, data_daily_chart_data);

                this.setState({
                    selected_tab: i_key,
                    data_daily: data_daily_chart_data,
                    // domain_y: domain_y
                });
            })
        }
        else if ((i_key == 'months_6' || i_key == 'ytd' || i_key == 'years_5' || i_key == 'max') && !this.state.data_daily_full) {
            this.get_data_daily(this.props.symbol, true).then((data_daily_full: any) => {
                console.log('%c : SimpleAreaChart -> componentDidMount -> data_daily_full', mcc, data_daily_full);

                const arr = data_daily_full['Time Series (Daily)'];
                const data_daily_full_chart_data = Object.keys(arr).map((key, index) => {
                    return {
                        time: key,
                        value: arr[key]['4. close']
                    };
                });
                console.log('%c : SimpleAreaChart -> componentDidMount -> data_daily_full_chart_data', mcc, data_daily_full_chart_data);

                this.setState({
                    selected_tab: i_key,
                    data_daily_full: data_daily_full_chart_data,
                    // domain_y: domain_y
                });
            })
        }
        else {
            this.setState({
                selected_tab: i_key
            });
        }
    };

    private _getTabId = (itemKey: string): string => {
        return `ShapeColorPivot_${itemKey}`;
    };

    public render() {

        const the_data = this.state.selected_tab == 'days_1' ? this.state.data_intraday
            : this.state.selected_tab == 'days_5' ? this.state.data_daily.slice(0, 5)
                : this.state.selected_tab == 'months_1' ? this.state.data_daily.slice(0, 22)
                    : this.state.selected_tab == 'months_6' ? this.state.data_daily_full.slice(0, 22 * 6)
                        : this.state.selected_tab == 'ytd' ? this.state.data_daily_full.filter(d => d.time.startsWith('2020'))
                            : this.state.selected_tab == 'years_1' ? this.state.data_daily_full.slice(0, 261)
                                : this.state.selected_tab == 'years_5' ? this.state.data_daily_full.slice(0, 261 * 5)
                                    : this.state.selected_tab == 'max' ? this.state.data_daily_full
                                        : null;
        console.log('%c : SimpleAreaChart -> render -> the_data', mcc, the_data);


        // const domain_y = this.state.selected_tab == 'max'
        //     ? ['-1000', '1000']
        //     : ['dataMin - 5', 'dataMax + 5'];

        return (
            // the_data &&
            <>
                <Pivot
                    // key={this.state.domain_y.join('').replace(/ /g, '')}
                    selectedKey={this.state.selected_tab}
                    onLinkClick={this._handleLinkClick}
                    headersOnly={true}
                    getTabId={this._getTabId}
                >
                    <PivotItem
                        headerText='1 Day'
                        itemKey='days_1'
                        headerButtonProps={{
                            'disabled': this.state.selected_tab == 'days_1' ? true : false,
                        }}
                    />
                    <PivotItem
                        headerText='5 Days'
                        itemKey='days_5'
                        headerButtonProps={{
                            'disabled': this.state.selected_tab == 'days_5' ? true : false
                        }}
                    />
                    <PivotItem
                        headerText='1 Month'
                        itemKey='months_1'
                        headerButtonProps={{
                            'disabled': this.state.selected_tab == 'months_1' ? true : false
                        }}
                    />
                    <PivotItem
                        headerText='6 Months'
                        itemKey='months_6'
                        headerButtonProps={{
                            'disabled': this.state.selected_tab == 'months_6' ? true : false
                        }}
                    />
                    <PivotItem
                        headerText='YTD'
                        itemKey='ytd'
                        headerButtonProps={{
                            'disabled': this.state.selected_tab == 'ytd' ? true : false
                        }}
                    />
                    <PivotItem
                        headerText='1 Year'
                        itemKey='years_1'
                        headerButtonProps={{
                            'disabled': this.state.selected_tab == 'years_1' ? true : false
                        }}
                    />
                    <PivotItem
                        headerText='5 Years'
                        itemKey='years_5'
                        headerButtonProps={{
                            'disabled': this.state.selected_tab == 'years_5' ? true : false
                        }}
                    />
                    <PivotItem
                        headerText='Max'
                        itemKey='max'
                        headerButtonProps={{
                            'disabled': this.state.selected_tab == 'max' ? true : false
                        }}
                    />
                </Pivot>
                {the_data &&
                    <AreaChart
                        width={500}
                        height={200}
                        data={the_data.reverse()}
                    // margin={{ top: 10, right: 30, left: 0, bottom: 0, }}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis
                            dataKey='time'
                            axisLine={false}
                        />
                        <YAxis
                            type='number'
                            domain={['dataMin - 5', 'dataMax + 5']}
                            // domain={[-1000, 1000]}
                            // domain={this.state.domain_y}
                            // domain={[
                            //     'dataMin => (Math.round(dataMin) - 25)',
                            //     'dataMax => (Math.round(dataMax) + 25)'
                            // ]}
                            width={75}
                            axisLine={false}
                        />
                        <Tooltip />
                        <Area
                            type='monotone'
                            dataKey='value'
                            stroke={colors.green}
                            fill={colors.green}
                        // animationBegin={400}
                        // animationDuration={1000}
                        />
                    </AreaChart>
                }
            </>

        );
    }
}
