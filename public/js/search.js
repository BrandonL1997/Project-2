$(document).ready(function() {
	
	$("#menuitemsearch").on("click", function(event) {
		event.preventDefault();

		searchRecipes({ proteinType: $("#searchTerm").val().trim() });
	});

	$("#searchRecipeAdv").on("click", function (event) {
		event.preventDefault();

		// Variables for user input parameters
		const mealType = $("#mealType option:selected").text();
		const proteinType = $("#proteinType");
		const veggieType = $("#veggieType");
		const glutenFree = $("#glutenFree");
		const dairyFree = $("#dairyFree");
		const vegan = $("#vegan");
		const vegetarian = $("#vegetarian");
		
		var searchParam = {
			gluten_free: glutenFree.is(":checked", function () {
				glutenFree.prop("checked", true);
			}),
			dairy_free: dairyFree.is(":checked", function () {
				dairyFree.prop("checked", true);
			}),
			vegetarian: vegetarian.is(":checked", function () {
				vegetarianFree.prop("checked", true);
			}),
			vegan: vegan.is(":checked", function () {
				veganFree.prop("checked", true);
			}),
		};

		if (mealType) {
			searchParam.mealType = mealType;
		}
		if (proteinType.val()) {
			searchParam.proteinType = proteinType.val().trim();
		}
		if (veggieType.val()) {
			searchParam.veggieType = veggieType.val().trim();
		}

		searchRecipes(searchParam);
	});
});

function searchRecipes(searchParam) {
	const url = "/api/search/" + $.param(searchParam);
	console.log("URL:", url);
	search(searchParam).then(function (data) {
		console.log("Recipe search completed successfully");
		window.location.href = url;
	}).catch(function(error) {
		console.log("Recipe search failed", error);
	});
}
function search(searchParam) {
	return $.ajax({
		url: searchParam,
		type: "GET",
	});
}