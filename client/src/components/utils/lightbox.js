import React, { Component } from 'react';
import Lightbox from 'react-images'; //Lightbox

class ImageLightBox extends Component {

    state = {
        lightboxIsOpen: true, //when it loads, it means it's open already
        currentImage: this.props.pos,
        images:[]
    }

    //Runs before render
    static getDerivedStateFromProps(props,state){
        if(props.images){ //are there any images?
            const images = [];
            props.images.forEach(element=>{//loop through props and add src in front of the image path so you can pass it to Lightbox
                images.push({src:`${element}`})
            });
            return state = {
                images
            }
        }
        return false
    }

    gotoPrevious = () => {
        this.setState({
            currentImage: this.state.currentImage -1
        })
    }

    gotoNext = () => {
        this.setState({
            currentImage: this.state.currentImage +1
        })
    }

    //CB runs from parent
    closeLightbox = () => {
        this.props.onclose();
    }

    render() {
        return (
            <Lightbox
                currentImage={this.state.currentImage}
                images={this.state.images}
                isOpen={this.state.lightboxIsOpen}
                onClickPrev={()=> this.gotoPrevious()} //as is in documentation
                onClickNext={()=> this.gotoNext()} //as is in documentation
                onClose={()=>this.closeLightbox()}
            />
        );
    }
}

export default ImageLightBox;