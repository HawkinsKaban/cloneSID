const puppeteer = require('puppeteer');
const encrypt = require('../../../utils/encryptDecrypt');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// FOMAT SURAT
const formatSurat_izinUsaha = require('../format/format_suratIzinUsaha');
const formatSurat_bantuanSosial = require('../format/format_suratBantuanSosial');
const formatSurat_keteranganNikah = require('../format/format_suratKeteranganNikah');
const formatSurat_skck = require('../format/fomat_skck');
const format_suratKeteranganKelahiran = require('../format/format_suratKeteranganKelahiran');
const format_suratIzinKeramaian = require('../format/format_suratIzinKeramaian');
const format_suratIzinBepergian = require('../format/format_suratIzinBepergian');
const format_suratKeteranganTidakMampu = require('../format/format_uratKeteranganTidakMampu');
const format_suratKuasaAktaKematian = require('../format/format_suratKuasaAktaKematian');
const format_suratPencatatanKependudukan = require('../format/format_suratPencatatanKependudukan');
const getBase64Image = (filePath) => {
    const imageBuffer = fs.readFileSync(filePath);
    const base64 = imageBuffer.toString('base64');
    const mimeType = path.extname(filePath) === '.png' ? 'image/png' : 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
};

const aksara_jawa = getBase64Image(path.resolve(__dirname, '../../../assets/surat_utils/aksara_jawa.png'));
const logo = getBase64Image(path.resolve(__dirname, '../../../assets/surat_utils/logo_wareng.png'));
const TTD = getBase64Image(path.resolve(__dirname, '../../../assets/surat_utils/ceritanya_TTD.png'));

const suratDecider = async (jenisSurat, subSuratId) => {
    try {
        let result = '';
        if (jenisSurat === 'surat keterangan usaha') {
            result = await formatSurat_izinUsaha.format_suratIzinUsaha(subSuratId);
        } else if (jenisSurat === 'bantuan sosial') {
            result = await formatSurat_bantuanSosial.format_bantuanSosial(subSuratId);
        } else if (jenisSurat === 'keterangan nikah') {
            result = await formatSurat_keteranganNikah.format_suratKeteranganNikah(subSuratId);
        }else if (jenisSurat === 'surat pengantar skck') {
            result = await formatSurat_skck.format_suratSkck(subSuratId);
        }else if(jenisSurat === 'surat kelahiran'){
            result = await format_suratKeteranganKelahiran.format_suratKeteranganKelahiran(subSuratId);
        }else if(jenisSurat === 'surat izin keramaian'){
            result = await format_suratIzinKeramaian.format_suratIzinKeramaian(subSuratId);
        }else if(jenisSurat === 'surat izin bepergian'){
            result = await format_suratIzinBepergian.format_suratIzinBepergian(subSuratId);
        }else if(jenisSurat === 'keterangan tidak mampu'){
            result = await format_suratKeteranganTidakMampu.format_suratKeteranganTidakMampu(subSuratId);
        } else if(jenisSurat === 'surat kematian'){
            result = await format_suratKuasaAktaKematian.format_suratKuasaAktaKematian(subSuratId);
        } else if(jenisSurat === 'pencatatan kependudukan'){
            result = await format_suratPencatatanKependudukan.format_suratPencatatanKependudukan(subSuratId);
        }



        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const TTD_kades = (statusPersetujuan,formattedDate) => {
    if(statusPersetujuan === "disetujui pimpinan desa"){
        return `
        <p>Wareng, ${formattedDate}</p>
        <p>Lurah Wareng</p>
        <img class="ttd-kades" src="${TTD}" alt="">
        <p>(............. Ari Wibawa ,S.IP. .............)</p>
        `;
    } else {
        return `
        <p>Wareng, ${formattedDate}</p>
        <p>Lurah Wareng</p>
        <br>
            <h1> Belum disetujui oleh pimpinan desa</h1>
        <br>
        <br>
        <p>(............................................)</p>
        `;
    }
}


const generateHTML = async ({ nomoSurat, nameAcara, jenisSurat, isiAcara, tanggalMulai, tanggalSelesai, tempatAcara, RtName, RwName, user, subSuratId, statusPersetujuan }) => {


    try {
        const aesKey = crypto.scryptSync(
            process.env.encrypt_key_one,
            process.env.encrypt_key_two,
            32
        );
    
        console.log('----------------------------------------')
        console.log("user               :         ", user)
        console.log('----------------------------------------')
    
        const iv = user.iv; // Pastikan IV diambil dari data user dan memiliki panjang yang benar
        console.log('AES Key:', aesKey.toString('hex'));
        console.log('IV:', iv);
        console.log('User NIK (Encrypted):', user.nik);
        console.log('User Alamat (Encrypted):', user.alamat);
    
        const formattedDate = formatTime(new Date()).slice(0, -5);
        const isiSurat = await suratDecider(jenisSurat, subSuratId);
        const decryptedNIK = encrypt.dekripsi(user.nik, aesKey, iv);
        const decryptedAlamat = encrypt.dekripsi(user.alamat, aesKey, iv);
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            body{
                font-family: 'Times New Roman', Times, serif;
                color: black;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                line-height: 1.5;
            }
            .ttd-kades{
                width: 100px;
                height: 100px;
                margin-top: 20px;
                margin-left: 20px;
            }
            .surat{
                width: 210mm;
                height: 297mm;
                background-color: white;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                box-sizing: border-box;
                padding-top: 20px;
                padding-left: 40px;
                padding-right: 40px;
            }
            .cop-header{
                display: flex;
                border-bottom: 4px ridge black;
                align-items: center;
                text-align: center;
                line-height: 1;
                padding-bottom: 20px;
            }
            .garis-header{
                margin-top: 2px;
                border-top: 1px solid black;
            }
            .cop-header p{
                margin: 0;
                padding: 0;
            }
            .cop-header p:first-child{
                font-size: 18px;
                font-weight: bold;
            }
            .cop-header p:nth-child(2){
                font-size: 18px;
                font-weight: bold;
            }
            .cop-header p:nth-child(3){
                font-size: 20px;
                font-weight: bold;
            }
            .cop-header p:nth-child(4){
                font-size: 14px;
                font-weight: bold;
            }
            .text-header{
                display: block;
                text-align: center;
                margin-top: 20px;
                margin-left: 100px;
            }
            .text-header img{
                width: 300px;
                height: 50px;
                float: left;
                margin-left: 30px;
            }
            .surat-title{
                text-align: center;
                margin-top: 20px;
                margin-bottom: 20px;
                line-height: 1;
            }
            .surat-title h1{
                font-size: 24px;
                font-weight: bold;
            }
            .surat-tandatangan{
                display: flex;
                justify-content: end;
                margin-top: 20px;
                margin-bottom: 20px;
                text-align: center;
            }
            .page-break {
                page-break-before: always;
            }
        </style>
    </head>
    <body>
        <div class="surat">
            <div class="cop-header">
                <img src="${logo}" alt="">
                <div class="text-header">
                    <p>KABUPATEN GUNUNGKIDUL</p>
                    <p>KAPANEWON WONOSARI</p>
                    <p>PEMERINTAH KALURAHAN WARENG</p>
                    <img src="${aksara_jawa}" alt="">
                    <br>
                    <br>
                    <br>
                    <br>
                    <p>Jalan . Wonosari Paliyan KM. 04 Kode Pos 55851</p>
                    <p>Website: www.wareng-wonosari.desa.id</p>
                </div>
            </div>
            <div class="garis-header"></div>
            <div class="surat-title">
                <strong>
                    <u>
                        <p>
                            ${jenisSurat}
                        </p>
                    </u>
                </strong>
                <p>Nomor : ${nomoSurat}</p>
            </div>
            <div class="isi-surat">
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Yang bertanda tangan di bawah ini Lurah Wareng Kapanewon Wonosari Kabupaten Gunungkidul menerangkan bahwa :
                </p>
                <table>
                    <tr>
                        <td>Nama</td>
                        <td>:</td>
                        <td>${user.name}</td>
                    </tr>
                    <tr>
                        <td>Tempat, Tanggal Lahir</td>
                        <td>:</td>
                        <td>${user.tempatlahir}, ${formatTime(user.tanggallahir)}</td>
                    </tr>
                    <tr>
                        <td>NIK</td>
                        <td>:</td>
                        <td>${decryptedNIK}</td>
                    </tr>
                    <tr>
                        <td>Jenis Kelamin</td>
                        <td>:</td>
                        <td>${user.jenisKelamin}</td>
                    </tr>
                    <tr>
                        <td>Agama</td>
                        <td>:</td>
                        <td>${user.agama}</td>
                    </tr>
                    <tr>
                        <td>Pekerjaan</td>
                        <td>:</td>
                        <td>${user.pekerjaan}</td>
                    </tr>
                    <tr>
                        <td>Alamat</td>
                        <td>:</td>
                        <td>${decryptedAlamat}</td>
                    </tr>
                </table>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Demikian surat keterangan ini dibuat dengan sesungguhnya, agar yang berkepentingan dapat dipergunakan sebagaimana mestinya.
                </p>
            </div>
         </div>
        <div class="surat page-break">
            <div class="isi-surat">
            ${isiSurat}
            </div>
             <div class="surat-tandatangan">
                <div class="ttd">
                    ${TTD_kades(statusPersetujuan,formattedDate)}
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    } catch (err) {
        console.error('Decryption error:', err);
        throw new Error('Decryption failed. Please check the key, IV, and encrypted data.');
    }

    
};





const formatTime = (timeString) => {
    const date = new Date(timeString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${dateNum} ${month} ${year} ${hours}:${minutes}`;
};

const generateSuratPDF = async (data) => {
    const html = await generateHTML(data);
    console.log('Generated HTML:', html); 
    
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage(); 

    await page.setContent(html);
    await page.emulateMediaType('screen');
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();
    return pdfBuffer;
};


module.exports = { generateSuratPDF };
