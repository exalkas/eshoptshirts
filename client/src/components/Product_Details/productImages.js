import React, { Component } from 'react';
import ImageLightBox from '../utils/lightbox'; 


class ProdImg extends Component {

    state = {
        lightbox: false,
        imagePos:0, //which image to load
        lightboxImages:[] //images url array
    }



    componentDidMount(){
        const images=this.props.detail.images;
        if(images && images.length > 0){ //are there any images?
            let lightboxImages = [];

            this.props.detail.images.forEach(item=>{ //loop through images array with urls and add them to lightbox
                lightboxImages.push(item.url)
            })

            this.setState({
                lightboxImages
            })
        }
    }


    //renders image at position
    handleLightBox = (pos) => {
        if(this.state.lightboxImages.length > 0){ //if there are more than 1 images
            this.setState({
                lightbox: true,
                imagePos: pos
            })
        }
    }

    handleLightBoxClose = () => {
        this.setState({
            lightbox: false
        })
    }


    //renders thumbs
    showThumbs = () => (
        this.state.lightboxImages.map((item,i)=>(
            i > 0 ? //is there a second image?
                <div
                    key={i}
                    onClick={()=> this.handleLightBox(i)} //sets the position as well
                    className="thumb" 
                    style={{background: `url(${item}) no-repeat`}}
                ></div>
            :null
        ))
    )


    //renders image or not avail image
    renderCardImage = (images) => {
        if(images && images.length > 0){
            return images[0].url
        }else{
            return `/images/image_not_available.png`
        }
    }

    render() {
        const {detail} = this.props;
        return (
            <div className="product_image_container">
                <div className="main_pic">
                    <div
                        style={{background:`url(${this.renderCardImage(detail.images)}) no-repeat`}} 
                        onClick={()=> this.handleLightBox(0)}
                    >
                    </div>
                </div>
                <div className="main_thumbs">
                    { this.showThumbs(detail)}
                </div>
                {
                    this.state.lightbox ?
                        <ImageLightBox
                            id={detail.id}
                            images={this.state.lightboxImages}
                            open={this.state.open}
                            pos={this.state.imagePos}
                            onclose={()=> this.handleLightBoxClose()}
                        />
                    :null
                }
            </div>
        );
    }
}

export default ProdImg;