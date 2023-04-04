export default function TodoListItem(props) {
    return (
        <>
            <div className="row align-items-center">
                <div className="col-auto">
                    <input type="checkbox" checked={!!props.todoItem.completed} onChange={e => props.toggleComplete(props.todoItem.id, e.target.checked)} />
                </div>
                <div className="col">
                    {
                        props.todoEditId === props.todoItem.id ?
                            <form onSubmit={props.submitEditForm}>
                                <input className="form-control mb-2" value={props.todoEditTitle} onChange={(e) => props.setTodoEditTitle(e.target.value)} />
                                <input className="form-control mb-2" value={props.todoEditDescription} onChange={(e) => props.setTodoEditDescription(e.target.value)} />
                                <button type="submit" className="btn btn-secondary">SUBMIT</button>
                            </form>
                            :
                            <div>
                                <p className="fw-bold mb-2">{props.todoItem.title}</p>
                                <p className="mb-0">{props.todoItem.description}</p>
                            </div>
                    }
                </div>
                <div className="col-sm-auto pt-3 pt-sm-0">
                    <button className="btn btn-secondary me-2" onClick={() => props.setEditItem(props.todoItem.id, props.todoItem.title, props.todoItem.description)}>EDIT</button>
                    <button className="btn btn-danger" onClick={() => props.deleteTodoItem(props.todoItem.id)}>DELETE</button>
                </div>
            </div>
            <hr />
        </>
    )
}