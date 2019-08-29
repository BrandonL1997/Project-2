function fixMenuItemImage(MenuItem) {
	MenuItem.imageSrc = (MenuItem.image) ?
		`data:image/jpeg;base64, ${MenuItem.image.toString("base64")}` :
		MenuItem.imageURL;
	MenuItem.image = null;
	MenuItem.imageURL = null;
	
	return MenuItem;
}

module.exports = fixMenuItemImage;