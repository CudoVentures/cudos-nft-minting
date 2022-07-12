import React from 'react';
import S from '../../../../common/js/utilities/Main';

import '../../../css/components-inc/NftMint/nft-step-wrapper.css';

interface Props {
    stepNumber: string,
    stepName: string;
    className?: string;
}

export default class NftStepWrapper extends React.Component < React.PropsWithChildren < Props > > {

    static defaultProps: any;

    render() {
        return (
            <div className = { `NftStepWrapper FlexColumn ${this.props.className}` } >
                { this.props.stepNumber !== S.Strings.EMPTY && (
                    <div className = { 'NftStepNumber' } > { this.props.stepNumber } </div>
                ) }
                <div className = { 'NftStepName Heading3' } > { this.props.stepName } </div>
                { this.props.children }
            </div>
        )
    }

}

NftStepWrapper.defaultProps = {
    className: S.Strings.EMPTY,
};
