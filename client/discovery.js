Template.discovery.rendered = function() {
	$('.dropdown-toggle').dropdown();
};

var categoriesList = ["Personal", "Bridal Boutiques", "Wedding Venue", "Food & Drink", "Clothes", "Bridal Items", "Photography", "Misc"];
Template.discovery.helpers({
	// variable mainPage: boolean
    category: function() {
        return Template.instance().category.get();
    },
    categoryItems: function() {
        return Template.instance().categoryItems.get();
    },

	discoveryList: function() {
		var categoriesArr = [];

		var itemsArray = [
			{
				title: "ABC",
				likes: 31,
				address: "blk 123",
				telephone: 92321234,
				email: "abc@hotmail.com",
				website: "abc.com"
			},
			{
				title: "ABC",
				likes: 31,
				address: "blk 123",
				telephone: 92321234,
				email: "abc@hotmail.com",
				website: "abc.com"
			},
			{
				title: "ABC",
				likes: 31,
				address: "blk 123",
				telephone: 92321234,
				email: "abc@hotmail.com",
				website: "abc.com"
			}
		];

		for (i in categoriesList) {
			var CatObj = {
				index: i,
				catName: categoriesList[i],
				itemsArr: itemsArray
			};
			categoriesArr.push(CatObj);
		}
		return categoriesArr;
	}
});

Template.discovery.created = function() {
    // mainPage is a boolean to see if it load item list or add item page
    this.category = new ReactiveVar("");
    this.categoryItems = new ReactiveVar([]);
};

Template.discovery.events({
	'click .catItem': function(e, template) {
		console.log(this.catName);
		template.category.set(this.catName);
		template.categoryItems.set(this.itemsArr);

		Template.discovery.animateCard("animate_discovery");
	},
	'click a.backArrowBtn': function(e, template) {
		Template.discovery.animateCard("animate_discovery");
	},
	'click .catCard': function(e, template) {
		Template.discovery.animateCard("animate_discovery_details");
	},
	'click a.backToCatBtn': function(e, template) {
		Template.discovery.animateCard("animate_discovery_details");
	},
});


// Animation =================================================
Template.discovery.rendered = function() {
    Template.discovery.setup();
};

var meta;
var transition;
var state = {
    opened: false
}

Template.discovery.getMeta = function() {
    if (!meta) {
        meta = document.createElement('core-meta');
        meta.type = 'transition';
    }
    return meta;
}

Template.discovery.setup = function() {
    var target = document.getElementById('animate_discovery');
    var target2 = document.getElementById('animate_discovery_details');

    transition = Template.discovery.getMeta().byId("core-transition-center");
    transition.setup(target);
    transition.setup(target2);
}

Template.discovery.animateCard = function(name) {
    var target = document.getElementById(name);
    var cn = target.classList;
    var i =0;
    state.opened = !state.opened;

    if (cn.contains("core-opened")) {
        transition.go(target, state);
        cn.add("hiding");
    } else {
        cn.remove("hiding");
        transition.go(target, state);
        
    }

}
// Ends Animation =================================================
