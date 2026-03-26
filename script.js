// Convert Image to PDF
function convertImageToPdf() {
  const fileInput = document.getElementById("imageToPdfInput").files[0];
  if (!fileInput) return alert("Please select an image first!");

  const reader = new FileReader();
  reader.onload = function(e) {
    const imgData = e.target.result;
    const pdf = new jspdf.jsPDF();
    pdf.addImage(imgData, 'JPEG', 10, 10, 180, 160);
    pdf.save("converted.pdf");
  };
  reader.readAsDataURL(fileInput);
}

// Convert PDF to Image
function convertPdfToImage() {
  const fileInput = document.getElementById("pdfToImageInput").files[0];
  if (!fileInput) return alert("Please select a PDF first!");

  const reader = new FileReader();
  reader.onload = function(e) {
    const pdfData = new Uint8Array(e.target.result);
    pdfjsLib.getDocument({ data: pdfData }).promise.then(pdf => {
      pdf.getPage(1).then(page => {
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({ canvasContext: context, viewport }).promise.then(() => {
          const imgData = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imgData;
          link.download = "converted.png";
          link.click();
        });
      });
    });
  };
  reader.readAsArrayBuffer(fileInput);
}

// Compress Image
function compressImage() {
  const fileInput = document.getElementById("compressImageInput").files[0];
  if (!fileInput) return alert("Please select an image first!");

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width / 2; // reduce size
      canvas.height = img.height / 2;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "compressed.jpg";
        link.click();
      }, "image/jpeg", 0.6); // quality 60%
    };
  };
  reader.readAsDataURL(fileInput);
}
