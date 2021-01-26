import * as React from 'react';
import SingleStockCard from './SingleStockCard';
import * as moment from 'moment';



const mcc = 'color:lime;';

const fullsize = '&outputsize=full';
const api_key = '&apikey=P0DEX8H2101QNDAR';

// const symbol = 'MMM';



export interface AlphaVantageOneProps {
    symbol: string;
    theme?: any;
}

export interface AlphaVantageOneState {
    data_quote?: any;
    data_intraday?: any;
    data_daily?: any;
}

class AlphaVantageOne extends React.Component<AlphaVantageOneProps, AlphaVantageOneState> {
    constructor(props: AlphaVantageOneProps) {
        super(props);
        this.state = {
            data_quote: null,
            data_intraday: null,
            data_daily: null
        };
    }

    public componentDidMount() {
        console.clear();

        this.get_data_quote().then(data_quote => {
            console.log('%c : AlphaVantageOne -> componentDidMount -> data_quote', mcc, data_quote);
            this.setState({
                data_quote: data_quote,
            });
        })
    }

    public get_data_quote = () => new Promise(resolve => {
        const { symbol } = this.props;
        const url_start = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE';
        const url = url_start + '&symbol=' + symbol + api_key;

        fetch(url).then(res => res.json()).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                console.log('%c : AlphaVantageOne -> componentDidMount -> error', mcc, error);
                resolve(error);
            }
        );
    })

    public render() {
        const timestamp = moment(new Date()).format('M/D/YYYY h:mma');
        const className = this.props.theme && this.props.theme.mode && this.props.theme.mode ? this.props.theme.mode : 'light';
        return (
            <>
                {this.state.data_quote &&
                    <SingleStockCard
                        symbol={this.props.symbol}
                        data={this.state.data_quote}
                        time={timestamp}
                        className={className}
                    />
                }
            </>
        );
    }
}

export default AlphaVantageOne;