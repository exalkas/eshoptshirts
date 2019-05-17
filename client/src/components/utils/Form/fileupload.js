import React, { Component } from 'react';
import Dropzone from 'react-dropzone'; //handle drop files
import axios from 'axios';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';//round plus button
import CircularProgress from '@material-ui/core/CircularProgress';//

class Fileupload extends Component {
    constructor(){ //unnecessary
        super(); //unnecessary
        this.state = {
            uploadedFiles:[],
            uploading:false
        }
    }

    //In case of update situtation, pass through the images
    componentDidMount(){
        console.log("FILEUPLOAD: ONMOUNT: props.images=",this.props.images);
        if (this.props.images.value) {
            this.setState({
                uploadedFiles:this.props.images.value
            });
        }
    }

    //event when a user drops/uploads an image
    onDrop = (files) => {
       this.setState({uploading:true});
       let formData = new FormData();//it's an interface. actually a map with pair values
       const config = {
           header: {'content-type':'multipart/form-data'} //will be used inside axios
       }
       formData.append("file",files[0]);

       axios.post('/api/users/uploadimage',formData,config)
       .then(response => {

            console.log(response.data)

            this.setState({
                uploading:false,
                uploadedFiles:[
                    ...this.state.uploadedFiles, //add all uploaded files to the state
                    response.data
                ]
            },()=>{
                this.props.imagesHandler(this.state.uploadedFiles)
            })
       });
    }

    //remove image form product
    onRemove = (id) => {
        axios.get(`/api/users/removeimage?public_id=${id}`).then(response=>{
            let images = this.state.uploadedFiles.filter(item=>{ //store images except the id that is removed
                return item.public_id !== id;
            });

            this.setState({
                uploadedFiles: images
            },()=>{
                this.props.imagesHandler(images)
            })
        })
    }

    //Renders uploaded images
    showUploadedImages = (images) => (
        images.length > 0? 
            images.map(item =>(
                <div className="dropzone_box"
                    key={item.public_id}
                    onClick={()=> this.onRemove(item.public_id)}
                >
                <div 
                    className="wrap"
                    style={{background:`url(${item.url}) no-repeat`}} //renders image
                >
                </div>
                </div>
            ))
        : this.state.uploadedFiles.map(item=>(
            <div className="dropzone_box"
                key={item.public_id}
                onClick={()=> this.onRemove(item.public_id)}
            >
                <div 
                    className="wrap"
                    style={{background:`url(${item.url}) no-repeat`}} //renders image
                >
                </div>
            </div>
        ))
    )


    //It's part of the component lifecycle and called just before render.
    // called when finished uploading, to set state with array uploaded files
    // or null
    static getDerivedStateFromProps(props,state){
        if(props.reset){
            return state = {
                uploadedFiles:[]
            }
        }
        return null;
    }


    render() {
        return (
            <div>
                <section>
                    <div className="dropzone clear">
                        <Dropzone
                            onDrop={(e)=>this.onDrop(e)}
                            multiple={false}
                            className="dropzone_box"
                        >   
                            <div className="wrap">
                                <FontAwesomeIcon
                                    icon={faPlusCircle}
                                />
                            </div>
                        </Dropzone>
                        { this.showUploadedImages(this.props.images)}
                        {
                            this.state.uploading ?
                            <div className="dropzone_box" style={{
                                textAlign: 'center',
                                paddingTop: '60px'
                            }}>
                                <CircularProgress
                                    style={{color:'#00bcd4'}}
                                    thickness={7}
                                />
                            </div>
                            :null
                        }

                    </div>
                </section>
            </div>
        );
    }
}

export default Fileupload;