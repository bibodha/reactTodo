let Item = React.createClass({
    render() {
        return (
            <div className="item" id={this.props.id}>
                <input type="checkbox" checked={this.props.completed} onChange={this.props.handleCheck}> 
                    <label className={this.props.completed ? "item-text strike" : "item-text"}>{this.props.data}</label>
                </input>
                <a href="#" onClick={this.props.deleteItem} className="delete">x</a>
            </div>
        );
    }
});

let TodoForm = React.createClass({
    handleSubmit(e) {
            e.preventDefault();
            var text = React.findDOMNode(this.refs.text).value.trim();
            if (!text) {
                return;
            }
            this.props.onItemSubmit({
                task: text
            });
            React.findDOMNode(this.refs.text).value = '';
            return;
        },
        render() {
            return (
                <form className="itemForm" onSubmit={this.handleSubmit}>
                    <input className="addTodo" type="text" placeholder="What needs to be done?" ref="text"></input>
                </form>
            );
        }
});

let TodoList = React.createClass({
    getCount() {
            return _.size(_.filter(this.props.data, x => {
                return x.completed === false;
            }));
        },
        render() {
            let items = this.props.data.map(item => {
                return (
                    <Item completed={item.completed} deleteItem={this.props.deleteItem} handleCheck={this.props.handleCheck} data={item.task} id={item._id} key={item._id} / >
                );
            });
            if (_.size(items) === 0) {
                return (
                    <div className="todoList">{items}</div>
                );
            } else {
                return (
                    <div className="todoList">
                    <div className="itemList">{items}</div>
                        <div className="listFooter">
                            <span id="count">{this.getCount()} items left</span>
                            <a id="clear-completed" href="#" onClick={this.props.clearCompleted}>Clear Completed</a>
                        </div>
                </div>
                );
            }
        }
});

let TodoBox = React.createClass({
    sanitizeData(data) {
            let filtered = data;
            _.map(filtered, item => {
                item.completed = false;
            });
            return filtered
        },
        loadItems() {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: data => {
                    this.setState({
                        data: this.sanitizeData(data)
                    });
                }.bind(this),
                error: (xhr, status, err) => {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        deleteItem(e) {
            e.preventDefault();
            var id = e.target.parentElement.id;
            $.ajax({
                url: '/delete',
                type: 'POST',
                data: {
                    'id': id
                },
                success: data => {
                    var newState = this.state.data;
                    _.remove(newState, s => {
                        return s._id === id;
                    });
                    this.setState({
                        data: newState
                    });
                }.bind(this),
                error: (xhr, status, err) => {
                    console.error(status, err.toString());
                }.bind(this)
            });
        },
        handleCheck(e) {
            e.stopPropagation()
            var newState = _.map(this.state.data, item => {
                if (item._id === e.target.parentElement.id) {
                    item.completed = !item.completed;
                }
                return item;
            });

            this.setState(newState);
        },
        clearCompleted(e) {
            e.preventDefault();
            let toDelete = _.pluck(_.filter(this.state.data, x => {
                return x.completed === true;
            }), '_id');
            $.ajax({
                url: '/deleteCompleted',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: toDelete.toString()
                },
                success: x => {
                    var newState = this.state.data;
                    _.remove(newState, s => {
                        return _.contains(toDelete, s._id);
                    });
                    this.setState({
                        data: newState
                    });
                }.bind(this)
            });
        },
        handleItemSubmit(item) {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                type: 'POST',
                data: item,
                success: data => {
                    this.setState({
                        data: this.sanitizeData(data)
                    });
                }.bind(this),
                error: (xhr, status, err) => {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        getInitialState() {
            return {
                data: []
            };
        },
        componentDidMount() {
            this.loadItems();
        },

        render() {
            return (
                <div>
                    <TodoForm onItemSubmit={this.handleItemSubmit} />
                    <TodoList deleteItem={this.deleteItem} clearCompleted={this.clearCompleted} handleCheck={this.handleCheck} data={this.state.data}/> 
                </div>
            );
        }
});

React.render(<TodoBox url="items" />, document.getElementById('content'));
