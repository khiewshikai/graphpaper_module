//Initialize Data Structure in the Square
Template.minecraft.created = function() {
    var square = this.data;

    //Initialize data
    //Keep all data usage within the data.value attribute
    if (!_.valueForKeyPath(square, 'data.value.boxes')) {
        Squares.update(square._id, {
            $set: {
                data: {
                    value: {
                        boxes: []
                    }
                }
            }
        })
    }

    //Local reactive variable tied to the template instance.
    this.color = new ReactiveVar("#e67e22");
    this.dragged = false;
};

//On rerender, attach plugins/initialize libraries
Template.minecraft.rendered = function() {

}

Template.minecraft.helpers({
    boxes: function() {
        //Read
        var square = Squares.findOne(this._id);
        return square.data.value.boxes;
    },
    active: function() {
        if (this.valueOf() === Template.instance().color.get()) {
            return "active";
        }
    },
    colors: ["#95a5a6", "#40d47e", "#3498db", "#f1c40f", "#e67e22", "#34495e"]
});

Template.minecraft.events({
    "click .swatch": function(e, template) {
        template.color.set(this.valueOf());
    },
    "mousedown x3d": function() {
        dragged = false;
    },
    "mousemove x3d": function() {
        dragged = true;
    },
    "mouseup shape": function(e, template) {
        var square = Squares.findOne(this._id);

        if (!dragged && e.button === 1) {
            //Create
            Squares.update(square._id, {
                $push: {
                    'data.value.boxes': {
                        _id: Random.id(),
                        color: template.color.get(),
                        x: Math.floor(e.worldX + e.normalX / 2) + 0.5,
                        y: Math.floor(e.worldY + e.normalY / 2) + 0.5,
                        z: Math.floor(e.worldZ + e.normalZ / 2) + 0.5
                    }
                }
            });

        } else if (!dragged &&
            (e.button === 4 || e.button === 2)) {

            //Delete
            Squares.update(square._id, {
                $pull: {
                    'data.value.boxes': {
                        '_id': this._id
                    }
                }
            });
        }

        var arrayObjectIndexOf = function(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
        };

        //Example of "Update" operation
        // get the array index of this element
        var arrIndex = arrayObjectIndexOf(square.data.value.boxes, boxid, "_id");

        // prepare the modifier 
        var modifier = {
            $set: {}
        };

        //make changes
        modifier.$set["data.value.boxes." + arrIndex + ".color"] = newColor;

        // update the value
        // Squares.update({
        //     _id: square._id
        // }, modifier);
    }
});
