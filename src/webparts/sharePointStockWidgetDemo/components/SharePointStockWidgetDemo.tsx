import * as React from 'react';
// import styles from './SharePointStockWidgetDemo.module.scss';
import { ISharePointStockWidgetDemoProps } from './ISharePointStockWidgetDemoProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import AlphaVantageOne from './AlphaVantageOne';
import './temp.css';

export default class SharePointStockWidgetDemo extends React.Component<ISharePointStockWidgetDemoProps, {}> {
    public render(): React.ReactElement<ISharePointStockWidgetDemoProps> {
        return (<Stack horizontal>
            <AlphaVantageOne symbol='MMM' />
            <AlphaVantageOne symbol='MSFT' theme={{ mode: 'dark' }} />
        </Stack>);
    }
}
