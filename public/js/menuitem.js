let favs = $(".favs");

favs.on("click", function(){
	location.href = "/menuitem/" + this.id;
});