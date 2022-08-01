// eslint-disable-next-line max-classes-per-file
import React from 'react';

import '../../css/components-inc/single-row-table.css';
import Table from './Table';

export default class SingleRowTable extends React.Component {

    render() {
        return (
            <Table
                {...this.props}
                className={`SingleRowTable ${this.props.className}`}
            />
        )
    }

}
