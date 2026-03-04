let qr=new QRCodeStyling({
width:300,
height:300,
data:"",
dotsOptions:{color:"#000000"},
backgroundOptions:{color:"#ffffff"}
});
qr.append(document.getElementById("qrContainer"));

function limpiarVista(){
const canvas = document.getElementById("barcode");

canvas.width = canvas.width;

document.getElementById("btnDescargar").classList.add("hidden");
var wrap=document.getElementById("generatedImageWrap");
var imgEl=document.getElementById("generatedImage");
if(wrap){wrap.classList.add("hidden");if(imgEl)imgEl.removeAttribute("src");}
document.getElementById("qrContainer").classList.remove("preview-hidden");
canvas.classList.remove("preview-hidden");
qr.update({data:"",image:""});
}

function cambiarModo(){
limpiarVista();
var modo=document.querySelector('input[name="modo"]:checked').value;
var titulo=document.getElementById("tituloApp");
if(modo==="qr"){
titulo.textContent="Generar QR";
}else if(modo==="barcode"){
titulo.textContent="Generar Código de Barras";
}else{
titulo.textContent="Leer Código";
cerrarCamaraLeer();
var ler=document.getElementById("leerResultado");
if(ler){ler.classList.add("hidden");ler.textContent="";}
}
document.getElementById("qrSection").classList.toggle("hidden",modo!=="qr");
document.getElementById("barcodeSection").classList.toggle("hidden",modo!=="barcode");
document.getElementById("leerSection").classList.toggle("hidden",modo!=="leer");
document.querySelector(".actions").classList.toggle("hidden",modo==="leer");
document.getElementById("preview").classList.toggle("hidden",modo==="leer");
}

function resetQR(){limpiarVista();}
function resetBarcode(){limpiarVista();barcodeContenido.value="";}

function controlInput(){
const tipo=document.querySelector('input[name="barcodeTipo"]:checked').value;
barcodeContenido.value="";
if(["EAN13","EAN8","UPC","ITF","ITF14"].includes(tipo)){
barcodeContenido.oninput=function(){this.value=this.value.replace(/[^0-9]/g,"");}
}else{barcodeContenido.oninput=null;}
}

function cambiarFormulario(){
let t=document.querySelector('input[name="qrTipo"]:checked').value;
let h="";
if(t==="url")h=`<input id="url" placeholder="https://ejemplo.com">`;
if(t==="texto")h=`<textarea id="texto" placeholder="Texto libre"></textarea>`;
if(t==="wifi")h=`<input id="ssid" placeholder="SSID"><input id="pass" placeholder="Contraseña">`;
if(t==="contacto")h=`<input id="nombre" placeholder="Nombre">
<input id="telefono" placeholder="Teléfono" oninput="this.value=this.value.replace(/[^0-9]/g,'')">
<input id="email" placeholder="Email">`;
if(t==="evento")h=`<input id="titulo" placeholder="Título">
<input type="datetime-local" id="inicio">
<input type="datetime-local" id="fin">`;
if(t==="llamada")h=`<input id="tel" placeholder="Número" oninput="this.value=this.value.replace(/[^0-9]/g,'')">`;
if(t==="sms")h=`<input id="smsnum" placeholder="Número" oninput="this.value=this.value.replace(/[^0-9]/g,'')">
<textarea id="smsmsg" placeholder="Mensaje"></textarea>`;
if(t==="correo")h=`<input id="correo" placeholder="correo@dominio.com">`;
if(t==="ubicacion")h=`<input id="lat" placeholder="Latitud">
<input id="lng" placeholder="Longitud">`;
formulario.innerHTML=h;
}

function generar(){
const modo=document.querySelector('input[name="modo"]:checked').value;

if(modo==="qr"){
document.getElementById("barcode").innerHTML="";
let tipo=document.querySelector('input[name="qrTipo"]:checked').value;
let data="";

if(tipo==="url"){if(!url.value.startsWith("http")){url.value="";return;}data=url.value;}
if(tipo==="texto"){if(!texto.value)return;data=texto.value;}
if(tipo==="wifi"){if(!ssid.value)return;data=`WIFI:T:WPA;S:${ssid.value};P:${pass.value};;`;}
if(tipo==="contacto"){if(!nombre.value)return;data=`BEGIN:VCARD\nFN:${nombre.value}\nTEL:${telefono.value}\nEMAIL:${email.value}\nEND:VCARD`;}
if(tipo==="evento"){if(!titulo.value)return;data=`BEGIN:VEVENT\nSUMMARY:${titulo.value}\nDTSTART:${inicio.value}\nDTEND:${fin.value}\nEND:VEVENT`;}
if(tipo==="llamada"){if(!tel.value)return;data=`tel:${tel.value}`;}
if(tipo==="sms"){if(!smsnum.value)return;data=`SMSTO:${smsnum.value}:${smsmsg.value}`;}
if(tipo==="correo"){if(!correo.value.includes("@")){correo.value="";return;}data=`mailto:${correo.value}`;}
if(tipo==="ubicacion"){if(!lat.value||!lng.value)return;data=`https://maps.google.com/?q=${lat.value},${lng.value}`;}

if(!data)return;

qr.update({data:data});
btnDescargar.classList.remove("hidden");
var qrContainerEl=document.getElementById("qrContainer");
document.getElementById("barcode").classList.remove("preview-hidden");
qrContainerEl.classList.add("preview-hidden");
setTimeout(function(){
  var c=document.querySelector("#qrContainer canvas");
  var imgEl=document.getElementById("generatedImage");
  var wrapEl=document.getElementById("generatedImageWrap");
  if(c&&imgEl&&wrapEl){imgEl.src=c.toDataURL("image/png");wrapEl.classList.remove("hidden");}
},150);
}
else{
qr.update({data:"",image:""});
document.getElementById("btnDescargar").classList.add("hidden");

let tipo=document.querySelector('input[name="barcodeTipo"]:checked').value;
let v=barcodeContenido.value.trim();

if(!v)return;
if(tipo==="EAN13" && v.length!==13)return;
if(tipo==="EAN8" && v.length!==8)return;
if(tipo==="UPC" && v.length!==12)return;
if(tipo==="ITF14" && v.length!==14)return;
if(tipo==="ITF" && v.length%2!==0)return;


const canvas = document.getElementById("barcode");

JsBarcode(canvas, v, {
format: tipo,
lineColor: colorBarcode.value,
width: 2,
height: 100,
displayValue: true,
valid: function(valid){
if(!valid){
console.log("Checksum inválido para el estándar seleccionado");
}
}
});

document.getElementById("btnDescargar").classList.remove("hidden");
document.getElementById("qrContainer").classList.remove("preview-hidden");
document.getElementById("barcode").classList.add("preview-hidden");
var imgEl=document.getElementById("generatedImage");
var wrapEl=document.getElementById("generatedImageWrap");
if(imgEl&&wrapEl){imgEl.src=canvas.toDataURL("image/png");wrapEl.classList.remove("hidden");}
}
}

colorQR.oninput=e=>qr.update({dotsOptions:{color:e.target.value}});

document.querySelectorAll(".input-overlay-wrap").forEach(function(wrap){
  var btn=wrap.querySelector("button");
  var inp=wrap.querySelector("input[type='color'], input[type='file']");
  if(btn&&inp)btn.addEventListener("click",function(e){ if(e.target===btn)inp.click(); });
});

document.getElementById("logo").addEventListener("change", function(e){
const file=e.target.files[0];
if(!file)return;
const reader=new FileReader();
reader.onload=function(event){
qr.update({
image:event.target.result,
imageOptions:{
crossOrigin:"anonymous",
margin:5,
imageSize:0.3
}
});
document.getElementById("logo").value="";
};
reader.readAsDataURL(file);
});

colorBarcode.oninput = e => {
if(barcodeContenido.value.trim() !== ""){
JsBarcode(barcode, barcodeContenido.value, {
format: document.querySelector('input[name="barcodeTipo"]:checked').value,
lineColor: e.target.value,
displayValue: true
});
}
};

function descargar(){
const modo=document.querySelector('input[name="modo"]:checked').value;

if(modo==="qr"){
qr.download({name:"codigo",extension:"png"});
}else{
const canvas = document.getElementById("barcode");
const link = document.createElement("a");
link.download = "codigo_barras.png";
link.href = canvas.toDataURL("image/png");
link.click();
}
}

var streamLeer=null;
var animLeer=null;
var intervalLeer=null;
function cerrarCamaraLeer(){
if(streamLeer){streamLeer.getTracks().forEach(function(t){t.stop();});streamLeer=null;}
if(animLeer){cancelAnimationFrame(animLeer);animLeer=null;}
if(intervalLeer){clearInterval(intervalLeer);intervalLeer=null;}
var v=document.getElementById("leerVideo");
if(v){v.srcObject=null;}
document.getElementById("leerCamaraWrap").classList.add("hidden");
}

function leerDesdeImagen(file){
var img=document.createElement("img");
img.onload=function(){
var w=img.naturalWidth,h=img.naturalHeight;
var canvas=document.createElement("canvas");
canvas.width=w;canvas.height=h;
var ctx=canvas.getContext("2d");
ctx.drawImage(img,0,0);
var data=ctx.getImageData(0,0,w,h);
var qrResult=typeof jsQR!=="undefined"&&jsQR(data.data,w,h);
if(qrResult){mostrarLeerResultado(qrResult.data,"QR");return;}
if(typeof ZXing!=="undefined"){
var reader=new ZXing.BrowserMultiFormatReader();
reader.decodeFromImageElement(img).then(function(r){mostrarLeerResultado(r.getText(),"Código");}).catch(function(){mostrarLeerResultado(null,null);});
}else{mostrarLeerResultado(null,null);}
};
img.onerror=function(){mostrarLeerResultado(null,null);};
img.src=URL.createObjectURL(file);
}

function mostrarLeerResultado(texto,tipo){
var el=document.getElementById("leerResultado");
el.classList.remove("hidden");
el.textContent=texto?("["+(tipo||"")+"] "+texto):"No se detectó código.";
}

function leerDesdeCamara(){
var video=document.getElementById("leerVideo");
var wrap=document.getElementById("leerCamaraWrap");
var resultadoEl=document.getElementById("leerResultado");
resultadoEl.classList.add("hidden");
wrap.classList.remove("hidden");
navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(function(stream){
streamLeer=stream;
video.srcObject=stream;
video.play();
var canvas=document.createElement("canvas");
var ctx=canvas.getContext("2d");
function tick(){
if(!streamLeer||!video.videoWidth){animLeer=requestAnimationFrame(tick);return;}
canvas.width=video.videoWidth;
canvas.height=video.videoHeight;
ctx.drawImage(video,0,0);
var data=ctx.getImageData(0,0,canvas.width,canvas.height);
var qrResult=typeof jsQR!=="undefined"&&jsQR(data.data,canvas.width,canvas.height);
if(qrResult){mostrarLeerResultado(qrResult.data,"QR");cerrarCamaraLeer();return;}
animLeer=requestAnimationFrame(tick);
}
tick();
if(typeof ZXing!=="undefined"){
var reader=new ZXing.BrowserMultiFormatReader();
intervalLeer=setInterval(function(){
if(!streamLeer||!video.videoWidth)return;
canvas.width=video.videoWidth;
canvas.height=video.videoHeight;
ctx.drawImage(video,0,0);
var img=document.createElement("img");
img.onload=function(){
reader.decodeFromImageElement(img).then(function(r){mostrarLeerResultado(r.getText(),"Código");cerrarCamaraLeer();}).catch(function(){});
};
img.src=canvas.toDataURL("image/png");
},500);
}
}).catch(function(err){mostrarLeerResultado("Error: "+err.message);});
}

document.getElementById("btnLeerImagen").addEventListener("click",function(){document.getElementById("leerArchivo").click();});
document.getElementById("leerArchivo").addEventListener("change",function(e){
var f=e.target.files[0];
if(f){leerDesdeImagen(f);}
e.target.value="";
});
document.getElementById("btnLeerCamara").addEventListener("click",leerDesdeCamara);
document.getElementById("btnCerrarCamara").addEventListener("click",cerrarCamaraLeer);

cambiarFormulario();
controlInput();