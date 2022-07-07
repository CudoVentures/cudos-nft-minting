import React from 'react';
import { observer, inject } from 'mobx-react';

import S from '../utilities/Main';
import '../../css/components-inc/file-upload.css';
import AlertStore from '../stores/AlertStore';
import UploaderComponent from '../components-core/UploaderComponent';

interface Props {
    alertStore: AlertStore;
    uploadId: any;
    uploadParams: any;
}

interface State {
    dragging: boolean;
}

class FilesUpload extends React.Component<Props, State> {

    dragTimeout: NodeJS.Timeout;

    nodes: {
        'uploader': RefObject<UploaderComponent>,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            dragging: false,
        };

        this.nodes = {
            'uploader': React.createRef(),
        };

    }

    componentDidMount() {
        document.body.addEventListener('drop', this.onDropWrapper);
        document.body.addEventListener('dragover', this.onDragOverWrapper);
    }

    componentWillUnmount() {
        document.body.removeEventListener('drop', this.onDropWrapper);
        document.body.removeEventListener('dragover', this.onDragOverWrapper);
    }

    onDrop = (e) => {

        e.preventDefault();

        this.setState({
            dragging: false,
        });

        let files = [];
        if (e.dataTransfer.items) {

            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                if (e.dataTransfer.items[i].kind === 'file') {
                    const file = e.dataTransfer.items[i].getAsFile();
                    files.push(file);
                }
            }
        } else {
            files = e.dataTransfer.files;
        }

        this.nodes.uploader.current.uploader.uploadFiles(files);
    }

    onDropWrapper = (e) => {
        e.preventDefault();
        this.setState({
            dragging: false,
        });
    }

    onDragOverWrapper = (e) => {

        this.setState({
            dragging: true,
        });

        clearTimeout(this.dragTimeout);
        this.dragTimeout = setTimeout(() => {
            this.setState({
                dragging: false,
            });
        }, 1000);
        e.preventDefault();
    }

    render() {
        return (
            <div className={'FilesUpload'} >
                <div className={`FileUploadField Transition ${S.CSS.getActiveClassName(this.state.dragging)}`} onDrop={this.onDrop} >
                    {this.props.children}
                    < UploaderComponent
                        ref={this.nodes.uploader}
                        id={this.props.uploadId}
                        params={this.props.uploadParams} />
                </div>
            </div>
        );
    }

}

export default inject('alertStore')(observer(FilesUpload));
