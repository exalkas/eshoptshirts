//alternative to add files
import React, { Component } from 'react';
import UserLayout from '../../../hoc/user';
import Dropzone from 'react-dropzone';//to upload files to cloudinary
import axios from 'axios';
import { Link } from 'react-router-dom';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
import CircularProgress from '@material-ui/core/CircularProgress';

class AddFile extends Component {

    constructor() {
        super();
        this.state = {
            formSuccess: false,
            formError: false,
            uploading: false,
            files: []
        }
    }

    //check docs if needed
    onDrop(files) {
        this.setState({ uploading: true });
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0]);

        axios.post('/api/users/uploadfile',formData,config)
        .then(response =>{
            if(response.data.success){ //stores success state
                this.setState({
                    formSuccess: true,
                    formError: false,
                    uploading: false
                },()=>{
                    setTimeout(()=>{
                        this.setState({formSuccess: false})
                    },2000)//after 2 sec
                })
            }
        })//need to handle error
    }

    //Shows which files are uploaded
    showFileList = () => (
        this.state.files ? //if it's not empty
            this.state.files.map((item,i)=>(
                <li key={i}>
                    <Link to={`/api/users/download/${item}`} target="_blank">
                        {item}
                    </Link>
                </li>
            ))
        :null
    )
 

    //get which files are uploaded before render
    componentDidMount(){
        axios.get('/api/users/admin_files')
        .then(response=>{
            console.log(response.data)
            this.setState({ files:response.data })
        }) //need to handle error
    }

    render() {
        return (
            <UserLayout>
                <h1>Upload file</h1>
                <div>
                    <Dropzone
                        onDrop={(e) => this.onDrop(e)}
                        multiple={false}
                        className="dropzone_box"
                    >
                        <div className="wrap">
                            <FontAwesomeIcon
                                icon={faPlusCircle}
                            />
                        </div>
                    </Dropzone>
                    {
                        this.state.uploading ?
                            <div className="dropzone_box" style={{
                                textAlign: 'center',
                                paddingTop: '60px'
                            }}>
                                <CircularProgress
                                    style={{ color: '#00bcd4' }}
                                    thickness={7}
                                />
                            </div>
                            : null
                    }
                    <div style={{ clear: 'both' }}>
                        {this.state.formSuccess ?
                            <div className="form_success">Success</div>
                            : null}
                        {this.state.formError ?
                            <div className="error_label">Please check your data</div>
                            : ''
                        }
                    </div>
                    <hr />
                    <div>
                        <ul>
                            {this.showFileList()}
                        </ul>
                    </div>
                </div>
            </UserLayout>
        );
    }
}

export default AddFile;