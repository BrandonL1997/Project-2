let favButton = $("#addFav");

favButton.on("click", function (event) {

    let id = $(this).attr("MenuItemId");


	$.ajax("/api/MenuItems/" + id +"/rating", {
        type: "PUT",
	}).then(
		function (MenuItem) {

			console.log("Menu Item updated ", MenuItem);
		}
	);

	$.ajax("/users/favorite/" + id, {
        type: "PUT",
	}).then(
		function (MenuItem) {

			console.log("Menu Item updated ", MenuItem);
		}
	);
});