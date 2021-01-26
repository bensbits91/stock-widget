import * as React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import SimpleAreaChart from './SimpleAreaChart';
import * as colors from './colors';

const mcc = 'color:yellow;';

export interface SingleStockCardProps {
    data: any;
    time: string;
    symbol: string;
    className: string;
}
// export interface SingleStockCardState {}

class SingleStockCard extends React.Component<SingleStockCardProps, {}> {
    // constructor(props: SingleStockCardProps) {
    //     super(props);
    //     // this.state = { :  };
    // }

    componentDidMount() {
        console.log('%c : SingleStockCard -> componentDidMount -> this.props', mcc, this.props);
    }

    public render() {
        const data = this.props.data['Global Quote'];

        const price_parts = parseFloat(data['05. price']).toFixed(2).split('.');
        const price_display = price_parts[0] + '.<sup style="font-size:30px;">' + price_parts[1] + '</sup>';
        const price = parseFloat(data['05. price']).toFixed(2);

        const chg = data['09. change'];
        const chg_fixed = parseFloat(chg).toFixed(2);

        const chg_pct = data['10. change percent'];
        const chg_pct_fixed = parseFloat(chg_pct).toFixed(2);
        const chg_sign = chg > 0 ? '+' : '';

        const chg_class = chg > 0 ? 'up' : chg < 0 ? 'down' : '';
        const chg_icon = chg > 0 ? 'Up' : chg < 0 ? 'Down' : 'CalculatorEqualTo';
        const color = chg > 0 ? colors.green : chg < 0 ? colors.red : colors.gray_dark;

        return (
            <div className={'stock-card ' + chg_class + ' ' + this.props.className}>
                <Stack horizontal>
                    <div className='symbol-and-price'>
                        <div className='symbol'>
                            {data['01. symbol']}
                        </div>
                        <div
                            className='price'
                            dangerouslySetInnerHTML={{ __html: price_display }}
                        />
                    </div>
                    <div className='chart'>
                        <SimpleAreaChart symbol={this.props.symbol} />
                    </div>
                </Stack>
                <Stack horizontal>
                    <div className='arrow'>
                        <Icon
                            className='chg icon'
                            iconName={chg_icon}
                            style={{ color: color }}
                        />
                    </div>
                    <div
                        className={'chg '}
                        style={{ color: color }}
                    >
                        {chg_sign}{chg_fixed}
                    </div>
                    <div
                        className={'chg pct '}
                        style={{ color: color }}
                    >
                        {chg_sign}{chg_pct_fixed}%
                    </div>
                    <div className='time-wrap'>
                        <span className='clock-icon'>
                            <Icon
                                iconName='Clock'
                            />
                        </span>
                        <span className={'timestamp'}>
                            {this.props.time}
                        </span>
                    </div>
                </Stack>
            </div>
        );
    }
}

export default SingleStockCard;