import { Button, Table } from 'react-bootstrap';
import React from 'react';
import ToDoItem from './ToDoItem';
import ErrorMessage from './ErrorMessage';

const ToDoTable = (props) => {
  // Error state is managed at the parent component so we could display errors that happened during fetching items.
  const { items, refreshItems, error, onError } = props;

   return (<>
    <h1>
      Showing {items.length} Item(s){' '}
      <Button data-testid="refreshButton" variant="primary" className="pull-right" onClick={refreshItems}>
        Refresh
      </Button>
    </h1>

    {error && <ErrorMessage message={error} />}

    <Table striped bordered hover>
      <thead>
        <tr>
          {/* Changed ID column to display isCompleted instead as it makes more sense from the user perspective.
          Knowing internal item ID is not as important as being able to see what's completed and what's not.
           */}
          <th>Completed</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => <ToDoItem data-testid="todoItem" key={item.id} item={item} onError={onError} onSuccess={refreshItems} />)}
      </tbody>
    </Table>
  </>)
};

export default ToDoTable;