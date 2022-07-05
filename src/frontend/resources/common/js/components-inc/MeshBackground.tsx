import React from 'react';

import SvgMeshBackground from '../../svg/mesh-background.svg';
import '../../css/components-inc/mesh-background.css';

export default class MeshBackground extends React.Component {

    render() {
        return (
            <div className = { 'MeshBackground' } >
                <div className = { 'SVG Size' } dangerouslySetInnerHTML = {{ __html: SvgMeshBackground }} />
                <div className = { 'GradientMask' } />
            </div>
        )
    }

}
