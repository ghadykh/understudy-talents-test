import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { SortableList } from '@thaddeusjiang/react-sortable-list';
import TodoListItem from './Components/TodoListItem';

function App() {

    const [todoItems, setTodoItems] = useState([]);
    const [todoInputTitle, setTodoInputTitle] = useState('');
    const [todoInputDescription, setTodoInputDescription] = useState('');
    const [todoEditId, setTodoEditId] = useState();
    const [todoEditTitle, setTodoEditTitle] = useState('');
    const [todoEditDescription, setTodoEditDescription] = useState('');
    const [todoSearch, setTodoSearch] = useState('');
    const [todoSort, setTodoSort] = useState();
    const [todoItemsLast, setTodoItemsLast] = useState();
    const submitAddForm = (e) => {
        e.preventDefault();

        if (todoInputTitle) {
            // Save last state before updating
            setTodoItemsLast(JSON.parse(JSON.stringify([...todoItems])));
            setTodoItems([...todoItems, { id: Date.now(), title: todoInputTitle, description: todoInputDescription, lastUpdatedAt: 0, completed: false }]);
            setTodoInputTitle('');
            setTodoInputDescription('');
        }
    }

    const toggleComplete = (todoItemId, checked) => {
        let newTodoItems = [...todoItems];

        // Save last state before updating
        setTodoItemsLast(JSON.parse(JSON.stringify([...todoItems])));

        newTodoItems.forEach(newTodoItem => {
            if (newTodoItem.id === todoItemId) {
                newTodoItem.completed = checked;
            }
        });
        setTodoItems([...newTodoItems]);
    }

    const deleteTodoItem = (todoItemId) => {
        let newTodoItems = [...todoItems];

        // Save last state before updating
        setTodoItemsLast(JSON.parse(JSON.stringify([...todoItems])));
        let indexToDelete = -1;
        newTodoItems.forEach((newTodoItem, index) => {
            if (newTodoItem.id === todoItemId) {
                indexToDelete = index;
            }
        });
        if (indexToDelete > -1) {
            newTodoItems.splice(indexToDelete, 1);
        }
        setTodoItems(newTodoItems);
    }

    const setEditItem = (id, title, description) => {
        setTodoEditId(id);
        setTodoEditTitle(title);
        setTodoEditDescription(description);
    }

    const submitEditForm = (e) => {
        e.preventDefault();

        let newTodoItems = [...todoItems];
        // Save last state before updating
        setTodoItemsLast(JSON.parse(JSON.stringify([...todoItems])));
        newTodoItems.forEach(newTodoItem => {
            if (newTodoItem.id === todoEditId) {
                newTodoItem.title = todoEditTitle;
                newTodoItem.description = todoEditDescription;
                newTodoItem.lastUpdatedAt = Date.now();
            }
        });
        setTodoItems(newTodoItems);
        setTodoEditId();
    }

    const exportAsCsv = () => {
        const rows = [
            ["Id", "Title", "Descrpition", "Completed", "Last Updated At"],
        ];

        todoItems.forEach(todoItem => {
            rows.push([todoItem.id, todoItem.title, todoItem.description, todoItem.completed ? true : false, todoItem.lastUpdatedAt]);
        })

        let csvContent = "data:text/csv;charset=utf-8,";

        rows.forEach(function (rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "todo.csv");
        document.body.appendChild(link);

        link.click();
    }

    const importCSV = (e) => {
        if (e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = function () {
                let newTodoItems = [...todoItems];
                let rows = reader.result.split('\r\n');
                for (let i = 0; i < rows.length; i++) {
                    // Skip first row
                    if (i === 0) continue;

                    let row = rows[i].split(',');
                    if (row.length === 5) {
                        console.log(row[3])
                        newTodoItems.push({
                            id: row[0],
                            title: row[1],
                            description: row[2],
                            completed: row[3] === 'true',
                            lastUpdatedAt: row[4],
                        })
                    }
                }
                setTodoItems(newTodoItems);
            };
            reader.readAsBinaryString(e.target.files[0]);
        }
    }

    const undoLastChange = () => {
        setTodoItems([...todoItemsLast]);
        setTodoItemsLast();
    }

    return (
        <div className="container py-4">
            <div className="border rounded p-3 mb-5">
                <h1 className="fw-bold">Add TODO item</h1>
                <form onSubmit={submitAddForm}>
                    <div className="mb-3">
                        <p className="mb-2">Title</p>
                        <input className="form-control" value={todoInputTitle} onChange={e => setTodoInputTitle(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2">Description</p>
                        <input className="form-control" value={todoInputDescription} onChange={e => setTodoInputDescription(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-secondary">Add</button>
                </form>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <h1 className="fw-bold mb-2">TODO List</h1>
                </div>
                <div className="col-lg-6 text-lg-end mb-3 mb-lg-0">
                    {
                        todoItemsLast && (
                            <button className="btn btn-warning me-2" onClick={undoLastChange}>UNDO LAST CHANGE</button>
                        )
                    }
                    <button className="btn btn-secondary" onClick={exportAsCsv}>EXPORT CSV</button>
                </div>
            </div>
            <div>
                <label className="mb-2">Upload CSV</label>
                <input placeholder="Upload CSV" className="form-control mb-3" type="file" onChange={importCSV} />
            </div>
            <div className="row">
                <div className="col-md-9">
                    <input placeholder="Search..." className="form-control mb-3" value={todoSearch} onChange={e => setTodoSearch(e.target.value)} />
                </div>
                <div className="col-md-3 mb-4 mb-md-0">
                    <select className="form-control" value={todoSort} onChange={e => setTodoSort(e.target.value)}>
                        <option value="" disabled>Sort By</option>
                        <option value="title">Title</option>
                        <option value="description">Description</option>
                        <option value="completed">Completed</option>
                        <option value="id">Date Created</option>
                        <option value="lastUpdatedAt">Date Last Updated</option>
                        <option value="drag-and-drop">Drag And Drop</option>
                    </select>
                </div>
            </div>
            {
                todoSort == 'drag-and-drop' ?
                    <SortableList
                        items={todoItems}
                        setItems={setTodoItems}
                        itemRender={({ item }) => (
                            (item.title.indexOf(todoSearch) > -1 || item.description.indexOf(todoSearch) > -1) && (
                                <TodoListItem
                                    todoItem={item}
                                    toggleComplete={toggleComplete}
                                    todoEditId={todoEditId}
                                    setEditItem={setEditItem}
                                    submitEditForm={submitEditForm}
                                    todoEditTitle={todoEditTitle}
                                    setTodoEditTitle={setTodoEditTitle}
                                    todoEditDescription={todoEditDescription}
                                    setTodoEditDescription={setTodoEditDescription}
                                    deleteTodoItem={deleteTodoItem}
                                />
                            )
                        )}
                    />
                    :
                    todoItems
                        .filter(todoItem => todoItem.title.indexOf(todoSearch) > -1 || todoItem.description.indexOf(todoSearch) > -1)
                        .sort((a, b) => {
                            let sortDesc = todoSort === 'lastUpdatedAt';

                            if (a[todoSort || 'id'] < b[todoSort || 'id']) {
                                return sortDesc ? 1 : -1;
                            }
                            if (a[todoSort || 'id'] > b[todoSort || 'id']) {
                                return sortDesc ? -1 : 1;
                            }
                            return 0;
                        })
                        .map(todoItem => (
                            <div key={todoItem.id}>
                                <TodoListItem
                                    todoItem={todoItem}
                                    toggleComplete={toggleComplete}
                                    todoEditId={todoEditId}
                                    setEditItem={setEditItem}
                                    submitEditForm={submitEditForm}
                                    todoEditTitle={todoEditTitle}
                                    setTodoEditTitle={setTodoEditTitle}
                                    todoEditDescription={todoEditDescription}
                                    setTodoEditDescription={setTodoEditDescription}
                                    deleteTodoItem={deleteTodoItem}
                                />
                            </div>
                        ))
            }
        </div>
    );
}

export default App;
