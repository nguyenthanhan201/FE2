import React from 'react';
import { Component } from "react";
import TaskItem from "./TaskItem";
import { connect } from 'react-redux';
import * as actions from './../Action/index';
class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterName: '',
            filterStatus: -1 /// all : -1 , active : 1, inactive : 0
        }
    }
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;

        var filer = {
            name: name === 'filterName' ? value : this.state.filterName,
            status: name === 'filterStatus' ? value : this.state.filterStatus
        };
        this.props.onFilterTable(filer);
        this.setState({
            [name]: value
        });
    }
    render() {
        var { tasks, filterTable, keyword, sort } = this.props;
        //sort
        if (sort.by === 'name') {
            tasks.sort((a, b) => {
                if (a.name > b.name) return sort.value;
                else if (a.name < b.name) return -sort.value;
                else return 0;
            });
        } else {
            tasks.sort((a, b) => {
                if (a.status > b.status) return -sort.value;
                else if (a.status < b.status) return sort.value;
                else return 0;
            });
        }
        //search
        if (keyword) {
            tasks = tasks.filter((task) => {
                return task.name.toLowerCase().indexOf(keyword) !== -1
            });
        }
        if (filterTable) {
            if (filterTable.name) {
                tasks = tasks.filter((task) => {
                    return task.name.toLowerCase().indexOf(filterTable.name) !== -1
                })
            }
            tasks = tasks.filter((task) => {
                if (filterTable.status === -1) {
                    return task;
                } else {
                    return task.status === (filterTable.status === 1 ? true : false);
                }
            });
        }
        var { filterName, filterStatus } = this.state;
        var elmTasks = tasks.map((task, index) => {
            return <TaskItem key={task.id} index={index} onUpdate={this.props.onUpdate} task={task} />
        });

        return (
            <div className="row mt-15">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="text-center">STT</th>
                                <th className="text-center">T??n</th>
                                <th className="text-center">Tr???ng Th??i</th>
                                <th className="text-center">H??nh ?????ng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>
                                    <input type="text" name="filterName" value={filterName} onChange={this.onChange} className="form-control" />
                                </td>
                                <td>
                                    <select className="form-control" name="filterStatus" value={filterStatus} onChange={this.onChange}>
                                        <option value={-1}>T???t C???</option>
                                        <option value={0}>???n</option>
                                        <option value={1}>K??ch Ho???t</option>
                                    </select>
                                </td>
                                <td></td>
                            </tr>
                            {elmTasks}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}
//tr??? v??? props 
const mapStatetoProps = (state) => {
    return {
        tasks: state.tasks,
        filterTable: state.filterTable,
        keyword: state.search,
        sort: state.sort
        //Key : state -> c???n l???y ??? file Reducers/index.js
    }
};
const mapDispathToProps = (dispath, action) => {
    return {
        onFilterTable: (filter) => {
            dispath(actions.filterTask(filter));
        }
    }
}
export default connect(mapStatetoProps, mapDispathToProps)(TaskList);
