"use strict";
(function () {
    angular
        .module("HomeMadeDinnerApp")
        .controller("UserHomeController", UserHomeController)

    function UserHomeController ($rootScope, $location, DishService, OrderService) {

        var model = this;
        if($rootScope.user){
            console.log($rootScope.user);
            model.loggedInUser = true;
        }
        else{
            console.log($rootScope.user);
            model.user = $rootScope.user;
            model.loggedInUser = false;
        }


        model.updateProfile = updateProfile;

        function updateProfile(){
            $location.url("/user-profile");
        }

        model.myOrders = getMyOrders;

        function getMyOrders(){
            OrderService.findOrderByCustomerId($rootScope.user._id)
                .then(function(myOrders){
                   $rootScope.myOrders = myOrders;
                    $location.url("/user-order");
                });
        }

        initDishes();
        function initDishes() {
            DishService.findAllDishes()
                .then(function (listOfDish) {
                    for(var i = 0; i < listOfDish.length; i++){
                        console.log(listOfDish[i].quantityOver);
                        listOfDish[i].quantityOver = false;
                        console.log(listOfDish[i].quantityOver);
                    }

                    model.dishes = listOfDish;

                    model.userSelectedDishes = [];
                });
        }

        model.dishDetail = dishDetail;

        function dishDetail(index){
            console.log("inside create dialog");
            $rootScope.fromMyOrders = false;
            $rootScope.recipe = model.dishes[index];
            $location.url("/recipeDetails");
        }

        model.addToCart = addToCart;

        function addToCart(index) {
            if(model.dishes[index].quantity == 0){
                model.dishes[index].quantityOver = true;
            }
            else{
                var isAdded = false;
                var selectedItem = model.dishes[index];

                if(model.userSelectedDishes != null){
                    for(var i = 0; i < model.userSelectedDishes.length; i++){
                        if(model.userSelectedDishes[i].title == selectedItem.title){
                            model.userSelectedDishes[i].quantity++;
                            model.dishes[index].quantity--;
                            isAdded = true;
                        }
                    }
                }

                if (!isAdded) {

                    console.log(model.dishes[index].quantity);
                    model.dishes[index].quantity--;
                    var selected_item = {
                        _id : model.dishes[index]._id,
                        title : model.dishes[index].title,
                        cuisine : model.dishes[index].cuisine,
                        type: model.dishes[index].type,
                        price : model.dishes[index].price,
                        img: model.dishes[index].img,
                        chef: model.dishes[index].chef,
                        user: model.dishes[index].user,
                        ingredients: model.dishes[index].ingredients,
                        rating: model.dishes[index].rating,
                        quantity : 1};

                    model.userSelectedDishes.push(selected_item);
                }

                DishService.findDishById(model.dishes[index]._id)
                    .then(function(dish){
                        dish.quantity--;
                        DishService.updateDish(dish._id, dish)
                            .then(function(dish) {
                                console.log(dish);
                            });
                    })

            }
        }

        model.checkOut = checkOut;

        function checkOut(){
            $rootScope.userSelectedDishes = model.userSelectedDishes;
            $location.url("/order");
        }
    }
}) ();