//crea elemento
const video = document.createElement("video");

//nuestro camvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

//div donde llegara nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

//lectura desactivada
let scanning = false;

//funcion para encender la camara
const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

//funciones para levantar las funiones de encendido de la camara
function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}

//apagara la camara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  canvasElement.hidden = true;
  btnScanQR.hidden = false;
};

const activarSonido = () => {
  var audio = document.getElementById('audioScaner');
  audio.play();
}

//callback cuando termina de leer el codigo QR
qrcode.callback = (respuesta) => {
  var hoja = document.getElementById('hoja').value;
  if (respuesta) {
    var url = 'https://script.google.com/macros/s/AKfycbzzGOLKG7t5969qdWbLcgDZrIgYKBRXpl1CviXt66YTv8sGwYtpETIWnh2H6Jn0fHKSLg/exec';
    var datos = "qr_data=" + encodeURIComponent(respuesta) + "&sheet=" + encodeURIComponent(hoja);
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: datos
    })
    .then(function(response) {
        if (response.ok) {  
            Swal.fire('Datos enviados correctamente a Google Sheets.')
        } else {
            console.log("Error al enviar datos a Google Sheets.");
            Swal.fire('Error al enviar datos a Google Sheets.');
        }
    })
    .catch(function(error) {
        console.error('Error al enviar datos a Google Sheets:', error);
        Swal.fire('Error al enviar datos a Google Sheets.');
    });
    activarSonido();
    //encenderCamara();    
    cerrarCamara();    
    
  }
};







