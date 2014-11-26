import ui.TextView as TextView;
import geoloc;

exports = Class(GC.Application, function () {

  this.initUI = function () {

    this.timeSinceFetched = void 0;

    this.textview = new TextView({
      superview: this.view,
      text: "Click to Get Current Location",
      color: "white",
      x: 0,
      y: 100,
      width: this.view.style.width,
      height: 100
    });

    this.latText = new TextView({
      superview: this.view,
      text: "Lat: ?",
      color: "white",
      x: 100,
      y: 300,
      width: this.view.style.width - 200,
      height: 50,
      horizontalAlign: 'left'
    });

    this.lngText = new TextView({
      superview: this.view,
      text: "Lng: ?",
      color: "white",
      x: 100,
      y: 400,
      width: this.view.style.width - 200,
      height: 50,
      horizontalAlign: 'left'
    });

    this.accuracyText = new TextView({
      superview: this.view,
      text: "Accuracy: ?",
      color: "white",
      x: 100,
      y: 500,
      width: this.view.style.width - 200,
      height: 50,
      horizontalAlign: 'left'
    });

    this.statusText = new TextView({
      superview: this.view,
      text: "",
      color: "white",
      x: 0,
      y: this.view.style.height - 150,
      width: this.view.style.width,
      height: 50
    });

    this.view.on('InputSelect', bind(this, function () {
      this.triggerGetLocation();
    }));

  };

  this.triggerGetLocation = function () {

    if (this.fetching) {
      return;
    }

    this.fetching = true;
    this.statusText.setText("Fetching Location...");

    // the geolocation plugin adds navigator.geolocation if necessary
    navigator.geolocation.getCurrentPosition(bind(this, function(pos) {
        logger.log("getLocation", pos);

        // get position from result
        this.latText.setText("Lat: " + pos.coords.latitude);
        this.lngText.setText("Lng: " +  pos.coords.longitude);
        this.accuracyText.setText("Accuracy: " + pos.coords.accuracy);

        // start counting the milliseconds since fetched
        this.timeSinceFetched = 1;

        // allow fetching again
        this.fetching = false;
    }), bind(this, function(err) {
        logger.log("FAIL:", err.code);
        this.fetching = false;
    }), {
        'enableHighAccuracy': true
    });
  };

  // called every frame
  this.tick = function (dt) {

    // count time since last fetched
    if (this.timeSinceFetched) {
      this.timeSinceFetched += dt;
    }

    // if in fetching state
    if (this.fetching) {

      // decrease countdown
      this.countdown -= dt;

      // when countdown finishes, get location and reset
      if (this.countdown <= 0) {
        this.getLocation();
        this.countdown += this.pollDelay;
      }
    } else {

      // show the time since last fetched
      if (this.timeSinceFetched) {
        var seconds = Math.floor(this.timeSinceFetched / 1000);
        this.statusText.setText("Fetched: " + seconds + " seconds ago");
      } else {
        this.statusText.setText('');
      }
    }
  };

  this.launchUI = function () {};
});
