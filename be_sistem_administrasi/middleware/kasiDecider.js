
const kasiDecider = (jenis) => {
    let role;
    const jenisSurat = jenis.toLowerCase();
    const kasiTypes = ["pelayanan", "pemerintahan", "kersa"];

    const pd1 = [
        "surat keterangan domisili",
        "surat keterangan usaha", // udah
        "surat kenal lahir",
        "surat pindah",
        "surat pengantar skck", // udah
        "surat izin keramaian", // udah
        "surat izin bepergian",// udah
    ];

    const pd2 = [
        "pembuatan kk baru",
        "pembuatan ktp baru",
        "pembuatan ktp lama",
        "pemecahan kk lama",
        "pbb-p2",
        "mutasi pbb",
        "pencatatan kependudukan",// udah
        "keterangan tidak mampu",// udah
        "keterangan nikah", // udah
    ];

    const pd3 = [
        "surat kematian",// udah
        "surat kelahiran",// udah
        "santunan kematian",
        "pengajuan jkn-kis",
        "koordinator rtlh",
        "pendataan masalah sosial",
        "bantuan sosial", // udah
    ];
    if (pd1.includes(jenisSurat)){
        role = 1;  
        return {
            role,
            kasiType: kasiTypes[role - 1] || ""
        };
        
    }else if(pd2.includes(jenisSurat)){
        role =  2;
        return {
            role,
            kasiType: kasiTypes[role - 1] || ""
        }
    } else if (pd3.includes(jenisSurat)){ 
        role =  3
        return {
            role,
            kasiType: kasiTypes[role - 1] || ""
        }
    }else{
        return "rolePd not found";
    }

}

const getKasiType = (rolePd) => {
    const kasiTypes = ["pelayanan", "pemerintahan", "kersa"];
    if (rolePd === 1){
        return kasiTypes[0];
    }
    if (rolePd === 2){
        return kasiTypes[1];
    }
    if (rolePd === 3){
        return kasiTypes[2];
    }
    
};


module.exports = { kasiDecider, getKasiType};
