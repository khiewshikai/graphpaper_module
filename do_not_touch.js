Square = function(doc) {
    _.extend(this, doc);
};

Squares = new Mongo.Collection('square', {
    transform: function(doc) {
        return new Square(doc);
    }
});

//Fixture
if (Squares.find().count() == 0) {
    Squares.insert({
        data: {
            value: null
        }
    });
}

if (Meteor.isClient) {
    Template.container.helpers({
        module: function() {
            return module;
        },
        data: function() {
            return Squares.findOne();
        },
        heightpx: function() {
            return this.height * 100;
        },
        widthpx: function() {
            return this.width * 100;
        }
    });
}