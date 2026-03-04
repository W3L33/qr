let qr = new QRCodeStyling({
  width: 300,
  height: 300,
  data: "",
  dotsOptions: { color: "#000000" },
  backgroundOptions: { color: "#ffffff" }
});
qr.append(document.getElementById("qrContainer"));

function limpiarVista() {
  const canvas = document.getElementById("barcode");
  canvas.width = canvas.width; 
  document.getElementById("btnDescargar").classList.add("hidden");
  qr.update({ data: "", image: "" });
  ajustarAppAltura();
}

function ajustarAppAltura() {
  const app = document.querySelector('.app');
  const vh = window.innerHeight;
  const preview = document.getElementById('preview');
  const radiosAltura = Array.from(document.querySelectorAll('.radio-group')).reduce((acc, rg) => acc + rg.offsetHeight + 10, 0);
  const botonesAltura = Array.from(document.querySelectorAll('button')).reduce((acc, btn) => acc + btn.offsetHeight + 10, 0);
  const padding = 40;
  const totalContenido = radiosAltura + botonesAltura + preview.offsetHeight + padding;

  if (totalContenido < vh) {
    app.style.height = `${vh - 20}px`;
  } else {
    app.style.height = 'auto';
  }
}

function cambiarModo() {
  limpiarVista();
  const modo = document.querySelector('input[name="modo"]:checked').value;
  const titulo = document.getElementById("tituloApp");
  if (modo === "qr") {
    titulo.textContent = "Generar QR";
  } else {
    titulo.textContent = "Generar Código de Barras";
  }
  qrSection.classList.toggle("hidden", modo === "barcode");
  barcodeSection.classList.toggle("hidden", modo === "qr");
  ajustarAppAltura();
}

function resetQR() { limpiarVista(); }
function resetBarcode() { limpiarVista(); barcodeContenido.value = ""; }

function controlInput() {
  const tipo = document.querySelector('input[name="barcodeTipo"]:checked').value;
  barcodeContenido.value = "";
  if (["EAN13", "EAN8", "UPC", "ITF", "ITF14"].includes(tipo)) {
    barcodeContenido.oninput = function () { this.value = this.value.replace(/[^0-9]/g, ""); }
  } else { barcodeContenido.oninput = null; }
}

function cambiarFormulario() {
  let t = document.querySelector('input[name="qrTipo"]:checked').value;
  let h = "";
  if (t === "url") h = `<input id="url" placeholder="https://ejemplo.com">`;
  if (t === "texto") h = `<textarea id="texto" placeholder="Texto libre"></textarea>`;
  if (t === "wifi") h = `<input id="ssid" placeholder="SSID"><input id="pass" placeholder="Contraseña">`;
  if (t === "contacto") h = `<input id="nombre" placeholder="Nombre">
<input id="telefono" placeholder="Teléfono" oninput="this.value=this.value.replace(/[^0-9]/g,'')">
<input id="email" placeholder="Email">`;
  if (t === "evento") h = `<input id="titulo" placeholder="Título">
<input type="datetime-local" id="inicio">
<input type="datetime-local" id="fin">`;
  if (t === "llamada") h = `<input id="tel" placeholder="Número" oninput="this.value=this.value.replace(/[^0-9]/g,'')">`;
  if (t === "sms") h = `<input id="smsnum" placeholder="Número" oninput="this.value=this.value.replace(/[^0-9]/g,'')">
<textarea id="smsmsg" placeholder="Mensaje"></textarea>`;
  if (t === "correo") h = `<input id="correo" placeholder="correo@dominio.com">`;
  if (t === "ubicacion") h = `<input id="lat" placeholder="Latitud">
<input id="lng" placeholder="Longitud">`;
  formulario.innerHTML = h;
  ajustarAppAltura();
}

function generar() {
  const modo = document.querySelector('input[name="modo"]:checked').value;

  if (modo === "qr") {
    document.getElementById("barcode").innerHTML = "";
    let tipo = document.querySelector('input[name="qrTipo"]:checked').value;
    let data = "";

    if (tipo === "url") { if (!url.value.startsWith("http")) { url.value = ""; return; } data = url.value; }
    if (tipo === "texto") { if (!texto.value) return; data = texto.value; }
    if (tipo === "wifi") { if (!ssid.value) return; data = `WIFI:T:WPA;S:${ssid.value};P:${pass.value};;`; }
    if (tipo === "contacto") { if (!nombre.value) return; data = `BEGIN:VCARD\nFN:${nombre.value}\nTEL:${telefono.value}\nEMAIL:${email.value}\nEND:VCARD`; }
    if (tipo === "evento") { if (!titulo.value) return; data = `BEGIN:VEVENT\nSUMMARY:${titulo.value}\nDTSTART:${inicio.value}\nDTEND:${fin.value}\nEND:VEVENT`; }
    if (tipo === "llamada") { if (!tel.value) return; data = `tel:${tel.value}`; }
    if (tipo === "sms") { if (!smsnum.value) return; data = `SMSTO:${smsnum.value}:${smsmsg.value}`; }
    if (tipo === "correo") { if (!correo.value.includes("@")) { correo.value = ""; return; } data = `mailto:${correo.value}`; }
    if (tipo === "ubicacion") { if (!lat.value || !lng.value) return; data = `https://maps.google.com/?q=${lat.value},${lng.value}`; }

    if (!data) return;
    qr.update({ data: data });
    btnDescargar.classList.remove("hidden");
  } else {
    qr.update({ data: "", image: "" });
    document.getElementById("btnDescargar").classList.add("hidden");

    let tipo = document.querySelector('input[name="barcodeTipo"]:checked').value;
    let v = barcodeContenido.value.trim();
    if (!v) return;
    if (tipo === "EAN13" && v.length !== 13) return;
    if (tipo === "EAN8" && v.length !== 8) return;
    if (tipo === "UPC" && v.length !== 12) return;
    if (tipo === "ITF14" && v.length !== 14) return;
    if (tipo === "ITF" && v.length % 2 !== 0) return;

    const canvas = document.getElementById("barcode");

    JsBarcode(canvas, v, {
      format: tipo,
      lineColor: colorBarcode.value,
      width: 2,
      height: 100,
      displayValue: true,
      valid: function (valid) {
        if (!valid) console.log("Checksum inválido para el estándar seleccionado");
      }
    });
    document.getElementById("btnDescargar").classList.remove("hidden");
  }

  ajustarAppAltura();
}

colorQR.oninput = e => qr.update({ dotsOptions: { color: e.target.value } });

document.getElementById("logo").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    qr.update({
      image: event.target.result,
      imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.3 }
    });
    document.getElementById("logo").value = "";
    ajustarAppAltura();
  };
  reader.readAsDataURL(file);
});

colorBarcode.oninput = e => {
  if (barcodeContenido.value.trim() !== "") {
    JsBarcode(barcode, barcodeContenido.value, {
      format: document.querySelector('input[name="barcodeTipo"]:checked').value,
      lineColor: e.target.value,
      displayValue: true
    });
  }
  ajustarAppAltura();
};

function descargar() {
  const modo = document.querySelector('input[name="modo"]:checked').value;
  if (modo === "qr") {
    qr.download({ name: "codigo", extension: "png" });
  } else {
    const canvas = document.getElementById("barcode");
    const link = document.createElement("a");
    link.download = "codigo_barras.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
}

cambiarFormulario();
controlInput();
ajustarAppAltura();