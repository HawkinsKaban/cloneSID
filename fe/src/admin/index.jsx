import { Fragment, useEffect, useState } from "react";
import Footer from "../shared/layout/footer";
import Navbar from "../shared/layout/navBar";
import AspirasiControl from "./pages/aspirasi";
import InformasiControl from "./pages/informasi";
import KegiatanControl from "./pages/kegiatan";
import PortalControl from "./pages/portal";
import Kontrol_pengguna from "./pages/kontrol/index";
import PerangkatDesa from "./pages/perangkatDesa";
import KepalaDesa from "./pages/kepalaDesa";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('Aspirasi');

    const handleActiveTab = (tabName) => {
        setActiveTab(tabName);
    };

    useEffect(() => {
    }, [activeTab]);

    return (
        <Fragment>
            <Navbar type={0}></Navbar>
            <div className="container-fluid" >
                <div className="row" style={{minHeight:'100vh'}}>
                    <div className="col-3 p-0 bg-dark text-white" >
                        <div className="" id="sidebar-wrapper" > 
                            <div className="sidebar-heading p-2">MENU</div>
                            <div className="list-group list-group-flush">
                                <p href="#"
                                    style={{cursor:'pointer'}} 
                                   className={`list-group-item list-group-item-action bg-dark text-white ${activeTab === 'Aspirasi' ? 'active' : ''}`} 
                                   onClick={() => handleActiveTab('Aspirasi')}>
                                    Aspirasi
                                </p>
                                <p href="#"
                                    style={{cursor:'pointer'}} 
                                   className={`list-group-item list-group-item-action bg-dark text-white ${activeTab === 'Informasi' ? 'active' : ''}`} 
                                   onClick={() => handleActiveTab('Informasi')}>
                                    Informasi
                                </p>
                                <p href="#"
                                    style={{cursor:'pointer'}} 
                                   className={`list-group-item list-group-item-action bg-dark text-white ${activeTab === 'Kegiatan' ? 'active' : ''}`} 
                                   onClick={() => handleActiveTab('Kegiatan')}>
                                    Kegiatan
                                </p>
                                <p href="#"
                                    style={{cursor:'pointer'}} 
                                   className={`list-group-item list-group-item-action bg-dark text-white ${activeTab === 'Portal' ? 'active' : ''}`} 
                                   onClick={() => handleActiveTab('Portal')}>
                                    Portal
                                </p>
                                <p href="#"
                                    style={{cursor:'pointer'}} 
                                   className={`list-group-item list-group-item-action bg-dark text-white ${activeTab === 'Kontrol' ? 'active' : ''}`} 
                                   onClick={() => handleActiveTab('Kontrol')}>
                                    Kontrol pengguna
                                </p>
                                <p href="#"
                                    style={{cursor:'pointer'}} 
                                   className={`list-group-item list-group-item-action bg-dark text-white ${activeTab === 'PerangkatDesa' ? 'active' : ''}`} 
                                   onClick={() => handleActiveTab('PerangkatDesa')}>
                                    Perangkat Desa
                                </p>
                                <p href="#"
                                    style={{cursor:'pointer'}} 
                                   className={`list-group-item list-group-item-action bg-dark text-white ${activeTab === 'KepalaDesa' ? 'active' : ''}`} 
                                   onClick={() => handleActiveTab('KepalaDesa')}>
                                    Kepala Desa
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        {activeTab === 'Aspirasi' && <AspirasiControl />}
                        {activeTab === 'Informasi' && <InformasiControl />}
                        {activeTab === 'Kegiatan' && <KegiatanControl />}
                        {activeTab === 'Portal' && <PortalControl />}
                        {activeTab === 'Kontrol' && <Kontrol_pengguna />}
                        {activeTab === 'PerangkatDesa' && <PerangkatDesa />}
                        {activeTab === 'KepalaDesa' && <KepalaDesa />}
                    </div>
                </div>
            </div>
            <Footer type="3" />
        </Fragment >
    )
}

export default Dashboard;
