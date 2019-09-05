$(document).ready(function () {
    var maxIngredients = 100;
    var x = 0; 
    var ingredientList = $(".allIngredients");

    $(".addIngredient").on("click", function (event) {
        event.preventDefault();
        console.log(`clicked ${x}`);
        if (x < maxIngredients) {
            x++;

            ingredientList.append(makeNewItem(x));
        }
    });
});

function makeNewItem(counter) {
    let newFoodItem = $("<div>");

    let newName = $("<div>");
    newName.addClass("form-group").addClass("col-md-6");
    newName.append("<label>Ingredients</label>");

    let newNameInput = $("<input>");
    newNameInput.attr("type", "text").attr("placeholder", "Ingredient");
    newNameInput.addClass("form-control");

    let newQty = $("<div>");
    newQty.addClass("form-group").addClass("col-md-2");
    newQty.append("<label>Quantity</label>");

    let newQtyInput = $("<input>");
    newQtyInput.attr("type", "text").attr("placeholder", "");
    newQtyInput.addClass("form-control");

    let newInput = $("<div>");
    newInput.addClass("form-group").addClass("col-md-2");
    newInput.append('<label style="display: block">Unit</label>');
    

    let newInput = $('<select>');
    newInput.addClass("unit");
    newInput.append('<option selected>Choose...</option>');
    newInput.append('<option value="teaspoon">teaspoon</option>');
    newInput.append('<option value="tablespoon">tablespoon</option>');
    newInput.append('<option value="cup">cup</option>');
    newInput.append('<option value="ounce">ounce</option>');
    newInput.append('<option value="pint">pint</option>');
    newInput.append('<option value="quart">quart</option>');
    newInput.append('<option value="pound">pound</option>');
    
    let newCal = $("<div>");
    newCal.addClass("form-group").addClass("col-md-2");
    newCal.append("<label>Calories per unit</label>");

    let newCalInput = $("<input>");
    newCalInput.attr("type", "text");
    newCalInput.addClass("form-control");

    newFoodItem.addClass("form-row").addClass("ingrItem");

    newNameInput.attr("id", `ingrID-${counter}`);
    newQtyInput.attr("id", `qtyID-${counter}`);
    newInput.attr("id", `unitID-${counter}`);
    newCalInput.attr("id", `calID-${counter}`);
    newInput.wrapAll('<div>');

    newFoodItem.append(newName.append(newNameInput));
    newFoodItem.append(newQty.append(newQtyInput));
    newFoodItem.append(newInput.append(newInput));
    newFoodItem.append(newCal.append(newCalInput));

    return newFoodItem;
}