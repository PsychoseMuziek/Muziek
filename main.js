
/// Function for randomly placing spice images on the background.
// exclude landing from that rule?

function init() {
    // code to place doors or not
    // get latest album + cover automatically via spotify?
    // https://stackoverflow.com/questions/40020946/how-to-get-all-songs-of-an-artist-on-spoitfy

    let nextGig = {location: "De Meester", logoUrl: "https://demeesteralmere.nl/wp-content/uploads/2022/05/poppodiumdemeester_icoon_wit.png"};
    let newestAlbum = {releaseDate: "date", title: "#IKWOONNOGSTEEDSINALMERE",
        thumbNail: "album_test.png", link: "https://"};
    // code to load popup?
    //document.getElementById("popup").children;
    let gigCard = $("#popup").children("section").eq(0);
    let albumCard = $("#popup").children("section").eq(1);
    let gigImage = gigCard.find("img");
    gigImage.attr("src", nextGig.logoUrl);
    let albumImage = albumCard.find("img");
    albumImage.attr("src", newestAlbum.thumbNail);
    gigCard.children("h2").text(nextGig.location);
    albumCard.children("h2").text(newestAlbum.title);
}

function siteEntryAnimation() {
    let openerBackground = $("#opener")
    let doorElement = openerBackground.children().first();
    //doorElement.css("transform", "rotateY(110deg) translateX(30px) translate(25vw, 0px)");
    doorElement.css("transform", "rotateY(100deg) translate3d(-200px,00px,150px) translate(25vw, 0px)");
    doorElement.css("box-shadow", "-200px 0 100px black inset");
    
    setTimeout(function(){
      openerBackground.css("opacity", 0);
      setTimeout(function(){
        openerBackground.css("display", "none");
        $("#galleryButton").css("animation-play-state", "running");
          setTimeout(function(){
            let elementHeight = $("nav.bottom").height();
            $("#popup").css("bottom", elementHeight);
            //animate landing/main
          }, 100);
      },800);
    },400);
    init();
    //https://www.w3schools.com/jsref/met_audio_play.asp
    // play a sound on opening?
    
    //openerBackground.animate({transform: },{});

}

document.onload = init();

//let windowW = window.innerWidth;
//let windowH = window.innerHeight;
let isLoaded = false;
let glitch;
let imgSrc = ''

function setup() {
  background(0);
  let logoCanvas = createCanvas(windowW, windowH);
  logoCanvas.parent('landing');
  // replace with image sizes
  loadImage(imgSrc, function (img) {
    glitch = new Glitch(img);
    isLoaded = true;
  });
}

function draw() {
  clear();
  background(0);

  if (isLoaded) {
    glitch.show();
  }

}
