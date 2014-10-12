// helper method to find index of this in Array
var arrayObjectIndexOf = function(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

//  init wedding date
weddingDateStr = "2015-11-15 08:00";

Template.todo.helpers({
    // variable mainPage: boolean
    mainPage: function() {
        return Template.instance().mainPage.get();
    },
    // variable editSubmitBtn: boolean
    editSubmitBtn: function() {
        return Template.instance().editSubmitBtn.get();
    },

    // variable itemTitle: boolean
    itemTitle: function() {
        return Template.instance().itemTitle.get();
    },
    // variable firstLoad: boolean
    theDate: function() {
        return Template.instance().theDate.get();
    },


    // COMMENT OUT FOR NEW VERSION SORTING
    // load all the to do items and sort them according to date
    // toDoList: function() {
    //     if (this.data.value === undefined) return;

    //     var toDoList = this.data.value.items;

    //     // this group array keep items in the different arrays
    //     var groups = [{
    //         key: "overdue",
    //         items: []
    //     }, {
    //         key: "Days before",
    //         items: []
    //     }, {
    //         key: "Weeks before",
    //         items: []
    //     }, {
    //         key: "Months before",
    //         items: []
    //     }];

    //     // sorting method
    //     _.reduce(toDoList, function(memo, value) {
    //         var endDate = moment();
    //         value.prettyDate = moment(value.date).from(endDate);

    //         if (moment(value.date).diff(endDate, 'months') >= 1) {
    //             memo[3].items.push(value);
    //         } else if (moment(value.date).diff(endDate, 'weeks') >= 1) {
    //             memo[2].items.push(value);
    //         } else if (moment(value.date).diff(endDate, 'days') >= 0) {
    //             memo[1].items.push(value);
    //         } else {
    //             memo[0].items.push(value);
    //         }

    //         return memo;
    //     }, groups);

    //     // progress count
    //     _.each(groups, function(value) {
    //         var countCompleted = _.countBy(value.items, function(i) {
    //             return i.completed;
    //         });

    //         value.progress = (countCompleted.true ? countCompleted.true : 0) + "/" + value.items.length;
    //     });
    //     return groups
    // }

    // NEW VERSION SORTING
    // load all the to do items and sort them according to date
    toDoList: function() {
        var square = Squares.findOne(this._id);
        console.log(square);
        if (!square.data.value) return;

        var toDoList = square.data.value.items;

        var groups = [{
            key: "12+ Months",
            items: []
        }, {
            key: "9 - 12 Months",
            items: []
        }, {
            key: "6 - 8 Months",
            items: []
        }, {
            key: "2 - 5 Months",
            items: []
        }, {
            key: "1 Month",
            items: []
        }, {
            key: "2 weeks",
            items: []
        }, {
            key: "1 week",
            items: []
        }, {
            key: "1 day",
            items: []
        }, {
            key: "D day",
            items: []
        }];

        //hardcoding the wedding date
        weddingDay = moment(weddingDateStr);

        var endDate = weddingDay;
        var current = moment();
        var currentArray = 0;

        if (endDate.diff(moment(current), 'months') >= 12) {
            currentArray = 0;
        } else if (endDate.diff(moment(current), 'months') >= 9) {
            currentArray = 1;
        } else if (endDate.diff(moment(current), 'months') >= 6) {
            currentArray = 2;
        } else if (endDate.diff(moment(current), 'months') >= 2) {
            currentArray = 3;
        } else if (endDate.diff(moment(current), 'months') >= 1) {
            currentArray = 4;
        } else if (endDate.diff(moment(current), 'weeks') >= 1) {
            currentArray = 5;
        } else if (endDate.diff(moment(current), 'days') >= 7) {
            currentArray = 6;
        } else if (endDate.diff(moment(current), 'days') >= 0) {
            currentArray = 7;
        } else {
            currentArray = 8;
        }

        //sorting method
        _.reduce(toDoList, function(memo, value) {
            // value.prettyDate = moment(value.date).from(endDate);
            // console.log("*********");
            // console.log(moment(value.date));
            // console.log(endDate.diff(moment(value.date), 'days'));
            value.prettyDate = value.date.toString().split(' ').splice(0, 4).join(' ');

            if (value.prettyDate == "") {
                console.log("NILL");
                // trying to get the date to print a empty string
                value.prettyDate == "lolll";
            }

            if (value.ref < currentArray && currentArray != 0) {
                memo[currentArray].items.push(value);
            } else {
                memo[value.ref].items.push(value);
            }

            return memo;
        }, groups);

        return groups
    }
});

Template.todo.created = function() {
    var square = this.data;
    console.log(this);

    //Initialize if there is no data
    // if (!_.valueForKeyPath(square, 'data.value.items')) {
    if (this.data && this.data.value && this.data.value.items) {} else {
        Squares.update(this._id, {
            $set: {
                data : {
                    value: {
                        items: []
                    }
                }
            }
        });
    }


    // mainPage is a boolean to see if it load item list or add item page
    this.mainPage = new ReactiveVar(true);
    // editSubmitBtn is a boolean to see if it load save or add btn
    this.editSubmitBtn = new ReactiveVar(false);
    this.itemTitle = new ReactiveVar("");

    // firstLoad is a boolean to see if it load item list or add item page
    this.theDate = new ReactiveVar("");
};

// keep track of the item that use wants to edit
var editItemId = "";

Template.todo.events({
    // toggle item panel
    'click .itemPanel': function(e, template) {
        // if click on text, it points to sibling, else point to children
        if ($(event.target).hasClass('itemHeading') || $(event.target).hasClass('list-group-item-text')) {
            $(event.target).closest(".toggleDiv").slideToggle();
        } else {
            $(event.target).children(".toggleDiv").slideToggle();
        }
    },

    // go to add item page
    'click a.plusItemBtn': function(e, template) {
        template.mainPage.set(false);
        animateCard("animate_me");
    },

    // go back main page
    'click a.backArrowBtn': function(e, template) {
        template.mainPage.set(true);
        template.editSubmitBtn.set(false);
        template.itemTitle.set("");
        animateCard("animate_me");

        // reset the form --------------------
        template.$('[name=title]').val("");
        template.$('[name=description]').val("");
        template.$('[name=date]').val("");
        template.$('[name=category]').val("").trigger('chosen:updated');
        // -----------------------------------
    },

    // submit new item
    'click #submitAdd': function(e, template) {
        e.preventDefault();

        //hardcoding the wedding date
        weddingDay = moment(weddingDateStr);

        //check date to see whether to store a reference or create a reference
        var dateInput = template.$('[name=date]').val();
        var day = dateInput.substr(0, 2);
        var month = dateInput.substr(3, 2);
        var year = dateInput.substr(6);
        var formattedDate = month + "/" + day + "/" + year;

        var checkDate = "";
        var ref = 99;

        if (dateInput == "" && template.$('[name=category]').val() == "") {
            // this is to check if there is no date or category, set to todays date.
            dateInput = "is not empty";
            formattedDate = new Date();
        }

        if (dateInput != "") {
            checkDate = new Date(formattedDate);

            if (weddingDay.diff(moment(checkDate), 'months') >= 12) {
                ref = 0;
            } else if (weddingDay.diff(moment(checkDate), 'months') >= 9) {
                ref = 1;
            } else if (weddingDay.diff(moment(checkDate), 'months') >= 6) {
                ref = 2;
            } else if (weddingDay.diff(moment(checkDate), 'months') >= 2) {
                ref = 3;
            } else if (weddingDay.diff(moment(checkDate), 'months') >= 1) {
                ref = 4;
            } else if (weddingDay.diff(moment(checkDate), 'weeks') >= 1) {
                ref = 5;
            } else if (weddingDay.diff(moment(checkDate), 'days') >= 7) {
                ref = 6;
            } else if (weddingDay.diff(moment(checkDate), 'days') >= 0) {
                ref = 7;
            } else {
                ref = 8;
            }
        } else {
            ref = template.$('[name=category]').val();
        }

        var square = Squares.findOne(this._id);
        console.log("HERE");
        console.log(square);

        // update the data collection
        Squares.update(square._id, {
            $push: {
                'data.value.items': {
                    _id: Random.id(),
                    title: template.$('[name=title]').val(),
                    description: template.$('[name=description]').val(),
                    date: checkDate,
                    ref: ref,
                    completed: false
                }
            }
        });

        template.mainPage.set(true);
        animateCard("animate_me");

        // reset the form --------------------
        template.$('[name=title]').val("");
        template.$('[name=description]').val("");
        template.$('[name=date]').val("");
        template.$('[name=category]').val("").trigger('chosen:updated');
        // -----------------------------------

    },

    'click #submitEdit': function(event, template) {
        //hardcoding the wedding date
        weddingDay = moment(weddingDateStr);
        console.log(weddingDay);

        //hardcoding the wedding date
        weddingDay = moment(weddingDateStr);

        //check date to see whether to store a reference or create a reference
        var dateInput = template.$('[name=date]').val();
        var day = dateInput.substr(0, 2);
        var month = dateInput.substr(3, 2);
        var year = dateInput.substr(6);
        var formattedDate = month + "/" + day + "/" + year;

        var checkDate = "";
        var ref = 99;

        if (dateInput == "" && template.$('[name=category]').val() == "") {
            // this is to check if there is no date or category, set to todays date.
            dateInput = "is not empty";
            formattedDate = new Date();
        }

        if (dateInput != "") {
            checkDate = new Date(formattedDate);

            if (weddingDay.diff(moment(checkDate), 'months') >= 12) {
                ref = 0;
            } else if (weddingDay.diff(moment(checkDate), 'months') >= 9) {
                ref = 1;
            } else if (weddingDay.diff(moment(checkDate), 'months') >= 6) {
                ref = 2;
            } else if (weddingDay.diff(moment(checkDate), 'months') >= 2) {
                ref = 3;
            } else if (weddingDay.diff(moment(checkDate), 'months') >= 1) {
                ref = 4;
            } else if (weddingDay.diff(moment(checkDate), 'weeks') >= 1) {
                ref = 5;
            } else if (weddingDay.diff(moment(checkDate), 'days') >= 7) {
                ref = 6;
            } else if (weddingDay.diff(moment(checkDate), 'days') >= 0) {
                ref = 7;
            } else {
                ref = 8;
            }
        } else {
            ref = template.$('[name=category]').val();
        }

        // get the array index of this element
        var arrIndex = arrayObjectIndexOf(square.data.value.items, editItemId, "_id");

        // prepare the modifier 
        modifier = {
            $set: {}
        };
        modifier.$set["data.value.items." + arrIndex + ".title"] = template.$('[name=title]').val();
        modifier.$set["data.value.items." + arrIndex + ".description"] = template.$('[name=description]').val();
        modifier.$set["data.value.items." + arrIndex + ".date"] = checkDate;
        modifier.$set["data.value.items." + arrIndex + ".ref"] = ref;

        var square = Squares.findOne(this._id);
        // update the value
        Squares.update({
            _id: square._id
        }, modifier);

        template.mainPage.set(true);
        animateCard("animate_me");
        template.editSubmitBtn.set(false);

        // reset the form --------------------
        template.$('[name=title]').val("");
        template.$('[name=description]').val("");
        template.$('[name=date]').val("");
        template.$('[name=category]').val("").trigger('chosen:updated');

        // -----------------------------------
    },

    'click a.editBtn': function(event, template) {
        template.mainPage.set(false);
        animateCard("animate_me");

        editItemId = this._id;
        template.editSubmitBtn.set(true);

        // repopulate the form
        template.itemTitle.set(this.title);

        var tempDate = new Date(this.date);
        if (tempDate != "Invalid Date") {
            var dd = tempDate.getDate();
            if (dd.toString().length < 2) {
                dd = "0" + dd;
            }
            var mm = tempDate.getMonth() + 1;
            var yy = tempDate.getFullYear().toString().substr(1);
            //template.$('[name=date]').val(dd + "/" + mm + "/" + yy);
            template.theDate.set(dd + "/" + mm + "/" + yy);
        }

        var selectedCat = (parseInt(this.ref) + 2);
        console.log(selectedCat);
        template.$('[name=category]').prop('selectedIndex', selectedCat).trigger('chosen:updated');
        template.$('[name=description]').val(this.description);
    },

    'click .completedCheck': function(event, template) {
        // "this" is a todoItem
        // "that" is a todoSquare
        var that = template.data;
        // console.log(that);
        var item = _.findWhere(that.data.value.items, {
            _id: this._id
        });

        item.completed = !item.completed;

        console.log(item);
        console.log(mx.current);

        // Squares.update(mx.current._id, {$set: {
        //     data.value.items[1].title: "newtitle"
        // }});

        // Squares.update(mx.current._id, {
        //                 $push: {
        //                     'data.value.items': {
        //                         _id: Random.id(),
        //                         title: "WTTTTTTTT",
        //                         description: "LOL",
        //                         date: "Wed Sep 10 2014 08:00:00 GMT+0800 (SGT)",
        //                         completed: false
        //                     }
        //                 }
        //             });

        // get the array index of this element
        var arrIndex = arrayObjectIndexOf(this.data.value.items, item._id, "_id");
        console.log(arrIndex);

        // prepare the modifier
        modifier = {
            $set: {}
        };
        modifier.$set["data.value.items." + arrIndex + ".completed"] = item.completed;

        var square = Squares.findOne(this._id);
        // update the value
        Squares.update({
            _id: square._id
        }, modifier);


        // that.setData(that.data);

        // template.item.$(".itemTitle p").wrap("<strike>");

        // db.students.update( { _id: 1, grades: 80 }, { $set: { "grades.$" : 82 } } )

        //console.log(mx);

        // Squares.update(mx.current.data.value.items[arrIndex]._id, {$set: {
        //     "completed": item.completed
        // }});

        // Squares.update({mx.current._id}, {modifier}, callback);
        // Squares.update(mx.current._id, this._id, $set: {
        //     data.value.items.$.completed: item.completed
        // });


        var strikeLength = $(event.target).parent().parent().width() - 60;
        if (item.completed) {
            $(event.target).parent().siblings('.strikeThrough').animate({
                width: strikeLength + "px"
            }, 300, function() {
                // Animation complete.
                $(event.target).parent().siblings('.itemHeading').addClass('completedItem');
                $(event.target).parent().siblings('.strikeThrough').addClass('strikeCompleted');
            });
        } else {
            // remove the initial strike through from first load.
            // $(event.target).parent().siblings('.strikeThroughFull').animate({width: "0px"}, 300, function() {
            //     $(event.target).parent().siblings('.strikeThrough').removeClass('strikeThroughFull');
            // });

            $(event.target).parent().siblings('.strikeThrough').animate({
                width: "0px"
            }, 300);
            $(event.target).parent().siblings('.itemHeading').removeClass('completedItem');
            $(event.target).parent().siblings('.strikeThrough').removeClass('strikeCompleted');
        }
        // }


    },

    'click a.deleteBtn': function(event, template) {
        // $(event.target).closest(".itemPanel").slideToggle("slow", function() {
        // Animation complete.
        var square = Squares.findOne(this._id);
        Squares.update({
            _id: square._id
        }, {
            $pull: {
                'data.value.items': {
                    '_id': this._id
                }
            }
        });
        // });
    }

});

/* Ripple effect on click functionality */
var rippleEffect = function(element, cl) {
    // Add required classes to the element
    element.css({
        'overflow': 'hidden',
        'position': 'relative'
    });

    // On element click
    element.on('click', function(e) {
        var elem = $(this),
            ripple, d, x, y;

        // If the ripple element doesn't exist in this element, add it..
        if (elem.children('.' + cl).length == 0) {
            elem.prepend('<span class="' + cl + '"></span>');
        } else { // ..else remove .animate class from ripple element
            elem.children('.' + cl).removeClass('animate');
        }

        // Get the ripple element
        var ripple = elem.children('.' + cl);

        // If the ripple element doesn't have dimensions set them accordingly
        if (!ripple.height() && !ripple.width()) {
            d = Math.max(elem.outerWidth(), elem.outerHeight());
            ripple.css({
                height: d,
                width: d
            });
        }

        // Get coordinates for our ripple element
        x = e.pageX - elem.offset().left - ripple.width() / 2;
        y = e.pageY - elem.offset().top - ripple.height() / 2;

        // Position the ripple element and add the class .animate to it
        ripple.css({
            top: y + 'px',
            left: x + 'px'
        }).addClass('animate');
    });
};

// Animation =================================================
Template.todo.rendered = function() {
    var template = this;

    rippleEffect(template.$('.btn-effect-ripple'), 'btn-ripple');
    template.$('[name=category]').chosen();
    template.$('.dialog-content').addClass('hideFirst');

    template.$('.input-datepicker').datepicker({
        weekStart: 1
    }).on('changeDate', function(e) {
        $(this).datepicker('hide');
    });

    var strikeLength = template.$('.toDoContainer').css("width");
    // console.log(Template);
    //get panel size
    $('.completedCheck').each(function(i, obj) {
        if ($('.completedCheck').get(i).getAttribute('checked') != null) {
            // remove the strikethrough of uncompleted task
            // $($('.completedCheck').get(i)).parent().siblings('.strikeThrough').addClass('strikeThroughFull');
            $($('.completedCheck').get(i)).parent().siblings('.strikeThrough').width(300);
            $($('.completedCheck').get(i)).parent().siblings('.strikeThrough').addClass('strikeCompleted');
            // console.log($($('.completedCheck').get(i)).parent().siblings('.strikeThrough').parent().outerWidth());
            // remove the grey color of uncompleted task
            $($('.completedCheck').get(i)).parent().siblings('.itemHeading').addClass('completedItem');
        }
    });
};

// var meta;
// var transition;
// var state = {
//     opened: false
// }

// function getMeta() {
//     if (!meta) {
//         meta = document.createElement('core-meta');
//         meta.type = 'transition';
//     }
//     return meta;
// }

// function setup() {
//     var target = document.getElementById('animate_me');

//     transition = getMeta().byId("core-transition-center");
//     transition.setup(target);
// }

// function animateCard(name) {
//         var target = document.getElementById(name);
//         var cn = target.classList;
//         var i = 0;
//         state.opened = !state.opened;

//         if (cn.contains("core-opened")) {
//             transition.go(target, state);
//             cn.add("hiding");
//         } else {
//             cn.remove("hiding");
//             transition.go(target, state);

//         }

//     }
    // Ends Animation =================================================


    function animateCard() {

    // $('.dialog-content').animate({
    //     width: 'toggle'
    // }, 290, function() {
    //     $(".animate1").animate({
    //         width: 'toggle'
    //     }, 290, function() {})
    // });

    // $('.dialog-content').toggle("slide", function(){
    //     $('.animate1').toggle("slide")
    // });

    $('.dialog-content').animate({
        width: 'toggle',
        height: 'toggle'
    }, 290, function() {});

}