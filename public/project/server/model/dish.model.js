var q = require("q");

module.exports = function(mongoose, db){
    var DishSchema =  mongoose.Schema({
        title: String,
        cuisine: String,
        type: String,
        price: Number,
        quantity: Number,
        ingredients: String,
        img: String,
        chef: String,
        user: String}, {collection: "dish"});

    var dishModel = mongoose.model("dishModel", DishSchema);

    var api = {
        filterDishByUsername: filterDishByUsername,
        findAllDishes: findAllDishes,
        createDish: createDish,
        deleteDishById: deleteDishById,
        updateDish: updateDish
    };

    return api;

    function filterDishByUsername(username) {

        var deferred = q.defer();
        dishModel.findOne({chef: username}, function(err, dishes){
            console.log(dishes);
            deferred.resolve(dishes);
        });
        return deferred.promise;
    }

    function findAllDishes() {
        var deferred = q.defer();
        dishModel.find(function(err, dishes){
            deferred.resolve(dishes);
        });
        return deferred.promise;
    }

    function createDish(newDish) {
        var deferred = q.defer();

        dishModel.create(newDish, function(err, dishes){
            deferred.resolve(dishes);
        });

        return deferred.promise;
    }

    function deleteDishById(dishId) {

        var deferred = q.defer();
        dishModel.remove({_id: dishId},function(err, dishes){
            deferred.resolve(dishes);
        });
        return deferred.promise;
    }

    function updateDish(dishId, newDish) {

        var deferred = q.defer();

        delete newDish._id;
        console.log(newDish);

        dishModel.update({_id: dishId}, {$set: newDish},
            function(err,dish){
                console.log(dish);
                deferred.resolve(dish);
            });

        return deferred.promise;
    }
}