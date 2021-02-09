// Wait for the page to be ready
window.addEventListener("load", function(e) {

  console.log("Page loaded!");

  // Store the color we will be tracking (selectable by clicking on the webcam feed)
  var color = {r: 49, g: 106, b: 42};

  // Grab reference to the tags we will be using
  var slider = document.getElementById("tolerance");
  var canvas  = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var webcam = document.getElementById('webcam');

  var faceArea = 200;
  var pX=canvas.width/2 - faceArea/2;
  var pY=canvas.height/2 - faceArea/2;
  //console.log(slider.value);

  // Register our custom color tracking function
  tracking.ColorTracker.registerColor('dynamic', function(r, g, b) {
    return getColorDistance(color, {r: r, g: g, b: b}) < 50
  });

  // Create the color tracking object
  var tracker = new tracking.ColorTracker("dynamic");
  var last_place = [];

  context.lineWidth = "6";

  // Add callback for the "track" event
  tracker.on('track', function(e) {

    //context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "lightgreen";

    context.beginPath();

    //if (e.data.length !== 0) {

      e.data.forEach(function(rect) {
        //drawRect(rect, context, color);
        //points.push([rect.x, rect.y])
        if (last_place) {
          console.log(last_place)
          if (distance(canvas.width-rect.x, rect.y, last_place[0], last_place[1]) < 80) {
            console.log([canvas.width-rect.x, rect.y, last_place[0], last_place[1]])
            console.log(distance(canvas.width-rect.x, rect.y, last_place[0], last_place[1]))
            context.moveTo(last_place[0], last_place[1]);
            context.lineTo(canvas.width-rect.x, rect.y);
            context.stroke();
          }
          /*if (distance(last_place[0], last_place[1], canvas.width-rect.x, rect.y) < 50) {
            context.moveTo(last_place[0], last_place[1]);
            context.lineTo(canvas.width-rect.x, rect.y);
            last_place = [canvas.width-rect.x, rect.y]
            context.stroke();
          } else {
            context.beginPath();
            context.moveTo(canvas.width-rect.x, rect.y)
          }*/
        } else {
          context.beginPath();
          context.moveTo(canvas.width-rect.x, rect.y)
          context.stroke();
          console.log("nope")
        }
        last_place = [canvas.width-rect.x, rect.y];
      });

    })

  //context.clearRect(0, 0, canvas.width, canvas.height);

  // Start tracking
  tracking.track(webcam, tracker, { camera: true } );

  // Add listener for the click event on the video
  webcam.addEventListener("click", function (e) {

    // Grab color from the video feed where the click occured
    var c = getColorAt(webcam, e.offsetX, e.offsetY);

    // Update target color
    color.r = c.r;
    color.g = c.g;
    color.b = c.b;

    // Update the div's background so we can see which color was selected
    swatch.style.backgroundColor = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";

  });

});

function distance(x1, y1, x2, y2) {
  return Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
}

// Calculates the Euclidian distance between the target color and the actual color
function getColorDistance(target, actual) {
  return Math.sqrt(
    (target.r - actual.r) * (target.r - actual.r) +
    (target.g - actual.g) * (target.g - actual.g) +
    (target.b - actual.b) * (target.b - actual.b)
  );
}

// Draw a colored rectangle on the canvas
function drawRect(rect, context, color) {
  color = { r: 255, g: 0, b: 0 }
  context.fillStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
  context.fillRect(rect.x, rect.y, 10, 10);
}
