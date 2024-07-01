
import { Fragment } from "react";
import Footer from "../../../shared/layout/footer";
import Navbar from "../../../shared/layout/navBar";
import Tentang from "./session/tentang";
import VisiMisi from "./session/visiMisi";
import KegiatanDesa from "./session/kegiatanDesa";
import PerangkatDesa from "./session/perangkatDesa";
import AspirasiDesa from "./session/aspirasi";

const InformasiDesa = () => {

    return (
        <Fragment>
            <Navbar type={0}></Navbar>
            <div className="conatiner-fluid informasi-desa-container" style={{ overflow: 'hidden' }}>
                <div className="row">
                    <div className="col-0 col-md-1"></div>
                    <div className="col-12 col-md-10">
                        <Tentang />
                        <VisiMisi />
                        <KegiatanDesa />
                        <PerangkatDesa />
                        <AspirasiDesa />
                    </div>
                    <div className="col-0 col-md-1">
                    </div>
                </div>
                <Footer type={3}></Footer>
            </div>
        </Fragment >
    )
}

export default InformasiDesa;
