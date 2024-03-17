class Resources {
  constructor(toLoad) {
    // Everything we plan to download
    this.toLoad = toLoad

    // A bucket to keep all of our images
    this.images = {};

    // Load each image
    Object.keys(this.toLoad).forEach(key => {
      const img = new Image();
      img.src = this.toLoad[key];
      this.images[key] = {
        image: img,
        isLoaded: false
      }
      img.onload = () => {
        this.images[key].isLoaded = true;
      }
    })
  }
}




// Create one instance for the whole app to use
export const resources = new Resources({
  icon: "./public/qui veux gagner des papillions icon.png",
  fond: "./public/qui veux gagner des papillions.png",
  empty: "./public/qui veux gagner des papillions empty.png"
});

