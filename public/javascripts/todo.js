/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Item = React.createClass({
	    displayName: "Item",

	    render: function render() {
	        return React.createElement(
	            "div",
	            { className: "item", id: this.props.id },
	            React.createElement(
	                "input",
	                { type: "checkbox", checked: this.props.completed, onChange: this.props.handleCheck },
	                React.createElement(
	                    "label",
	                    { className: this.props.completed ? "item-text strike" : "item-text" },
	                    this.props.data
	                )
	            ),
	            React.createElement(
	                "a",
	                { href: "#", onClick: this.props.deleteItem, className: "delete" },
	                "x"
	            )
	        );
	    }
	});

	var TodoForm = React.createClass({
	    displayName: "TodoForm",

	    handleSubmit: function handleSubmit(e) {
	        e.preventDefault();
	        var text = React.findDOMNode(this.refs.text).value.trim();
	        if (!text) {
	            return;
	        }
	        this.props.onItemSubmit({
	            task: text
	        });
	        React.findDOMNode(this.refs.text).value = "";
	        return;
	    },
	    render: function render() {
	        return React.createElement(
	            "form",
	            { className: "itemForm", onSubmit: this.handleSubmit },
	            React.createElement("input", { className: "addTodo", type: "text", placeholder: "What needs to be done?", ref: "text" })
	        );
	    }
	});

	var TodoList = React.createClass({
	    displayName: "TodoList",

	    getCount: function getCount() {
	        return _.size(_.filter(this.props.data, function (x) {
	            return x.completed === false;
	        }));
	    },
	    render: function render() {
	        var _this = this;

	        var items = this.props.data.map(function (item) {
	            return React.createElement(Item, { completed: item.completed, deleteItem: _this.props.deleteItem, handleCheck: _this.props.handleCheck, data: item.task, id: item._id, key: item._id });
	        });
	        if (_.size(items) === 0) {
	            return React.createElement(
	                "div",
	                { className: "todoList" },
	                items
	            );
	        } else {
	            return React.createElement(
	                "div",
	                { className: "todoList" },
	                React.createElement(
	                    "div",
	                    { className: "itemList" },
	                    items
	                ),
	                React.createElement(
	                    "div",
	                    { className: "listFooter" },
	                    React.createElement(
	                        "span",
	                        { id: "count" },
	                        this.getCount(),
	                        " items left"
	                    ),
	                    React.createElement(
	                        "a",
	                        { id: "clear-completed", href: "#", onClick: this.props.clearCompleted },
	                        "Clear Completed"
	                    )
	                )
	            );
	        }
	    }
	});

	var TodoBox = React.createClass({
	    displayName: "TodoBox",

	    sanitizeData: function sanitizeData(data) {
	        var filtered = data;
	        _.map(filtered, function (item) {
	            item.completed = false;
	        });
	        return filtered;
	    },
	    loadItems: function loadItems() {
	        var _this = this;

	        $.ajax({
	            url: this.props.url,
	            dataType: "json",
	            success: (function (data) {
	                _this.setState({
	                    data: _this.sanitizeData(data)
	                });
	            }).bind(this),
	            error: (function (xhr, status, err) {
	                console.error(_this.props.url, status, err.toString());
	            }).bind(this)
	        });
	    },
	    deleteItem: function deleteItem(e) {
	        var _this = this;

	        e.preventDefault();
	        var id = e.target.parentElement.id;
	        $.ajax({
	            url: "/delete",
	            type: "POST",
	            data: {
	                id: id
	            },
	            success: (function (data) {
	                var newState = _this.state.data;
	                _.remove(newState, function (s) {
	                    return s._id === id;
	                });
	                _this.setState({
	                    data: newState
	                });
	            }).bind(this),
	            error: (function (xhr, status, err) {
	                console.error(status, err.toString());
	            }).bind(this)
	        });
	    },
	    handleCheck: function handleCheck(e) {
	        e.stopPropagation();
	        var newState = _.map(this.state.data, function (item) {
	            if (item._id === e.target.parentElement.id) {
	                item.completed = !item.completed;
	            }
	            return item;
	        });

	        this.setState(newState);
	    },
	    clearCompleted: function clearCompleted(e) {
	        var _this = this;

	        e.preventDefault();
	        var toDelete = _.pluck(_.filter(this.state.data, function (x) {
	            return x.completed === true;
	        }), "_id");
	        $.ajax({
	            url: "/deleteCompleted",
	            type: "POST",
	            dataType: "json",
	            data: {
	                data: toDelete.toString()
	            },
	            success: (function (x) {
	                var newState = _this.state.data;
	                _.remove(newState, function (s) {
	                    return _.contains(toDelete, s._id);
	                });
	                _this.setState({
	                    data: newState
	                });
	            }).bind(this)
	        });
	    },
	    handleItemSubmit: function handleItemSubmit(item) {
	        var _this = this;

	        $.ajax({
	            url: this.props.url,
	            dataType: "json",
	            type: "POST",
	            data: item,
	            success: (function (data) {
	                _this.setState({
	                    data: _this.sanitizeData(data)
	                });
	            }).bind(this),
	            error: (function (xhr, status, err) {
	                console.error(_this.props.url, status, err.toString());
	            }).bind(this)
	        });
	    },
	    getInitialState: function getInitialState() {
	        return {
	            data: []
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        this.loadItems();
	    },

	    render: function render() {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(TodoForm, { onItemSubmit: this.handleItemSubmit }),
	            React.createElement(TodoList, { deleteItem: this.deleteItem, clearCompleted: this.clearCompleted, handleCheck: this.handleCheck, data: this.state.data })
	        );
	    }
	});

	React.render(React.createElement(TodoBox, { url: "items" }), document.getElementById("content"));

/***/ }
/******/ ]);