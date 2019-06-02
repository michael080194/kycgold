function getPrinter(){
    window.DatecsPrinter.listBluetoothDevices(
        function (devices) {
          alert("devices[0].address=" + devices[0].address);  
          var device1 = "00:15:83:D1:04:C7"; 
          window.DatecsPrinter.connect(device1, 
            function() {
              alert(devices[0].address);   
              printSomeTestText();
            },
            function() {
              alert(JSON.stringify(error));
            }
          );
        },
        function (error) {
          alert(JSON.stringify(error));
        }
      );
      
}

function printSomeTestText() {
    window.DatecsPrinter.printText("Print Test!", 'ISO-8859-1', 
      function() {
        alert("printed success");  
        // printMyImage();
        // printMyBarcode();
        // printText();
      }
    );
  }
  
  function printMyImage() {
    var image = new Image();
    image.src = '../../img/logo.png';
    image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.height = 100;
        canvas.width = 100;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        var imageData = canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpg|jpeg);base64,/, ""); //remove mimetype
        window.DatecsPrinter.printImage(
            imageData, //base64
            canvas.width, 
            canvas.height, 
            1, 
            function() {
              printMyBarcode();
            },
            function(error) {
                alert(JSON.stringify(error));
            }
        )
    };
  }
  
  function printMyBarcode() {
    window.DatecsPrinter.printBarcode(
      75, //here goes the barcode type code
      '13132498746313210584982011487', //your barcode data
      function() {
        alert('success!');
      },
      function() {
        alert(JSON.stringify(error));
      }
    );
  }

  function printText() {
    window.DatecsPrinter.printText(
      '123456', //print data
      'ISO-8859-1', // charset encoding
      function() {
        alert('success!');
      },
      function() {
        alert(JSON.stringify(error));
      }
    );
  }  