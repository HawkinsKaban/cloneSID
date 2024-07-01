import React from "react";
import ImageError from '../../../../../../../assets/ImageErrorHandling.svg';
import './index.css';

const InformasiDesa = ({ Foto, alt }) => {
    return (
        <div className="row ">
            <div className="col-2 col-md-0 "></div>
            <div className="col-8 col-md-12 wrap-img p-0 mb-5 mb-md-0">
                    <img src={Foto} alt={alt} className="img " style={{minHeight:'60vh', width: '100%', height: '100%', objectFit:'cover', borderRadius: '1vw' }} onError={(e) => { e.target.src = ImageError; }}/>
            </div>
            <div className="col-2 col-md-0 "></div>
        </div>
    )
}

export default InformasiDesa;
