import { Button, FormCheck } from 'react-bootstrap';
import React, { useCallback } from 'react';
import { markAsCompleted } from '../services/api';

const ToDoItem = (props) => {
  // Any errors will be propagated to the parent component.
  const { item, onSuccess, onError } = props;

  const handleMarkAsComplete = useCallback(async (item) => {
    const { success, error } = await markAsCompleted(item);
    if (success && onSuccess) {
      onSuccess();
    }
    if (error && onError) {
      onError(error);
    }
  }, [onSuccess, onError]);

  return (
    <tr key={item.id}>
      <td>
        <FormCheck data-testid="isCompletedCheckbox" disabled checked={item.isCompleted ? true : false} />
      </td>
      <td data-testid="itemDescription">{item.description}</td>
      <td>
        <Button data-testid="markAsCompletedButton" variant="warning" size="sm" onClick={() => handleMarkAsComplete(item)}>
          Mark as completed
        </Button>
      </td>
    </tr>
  );
};

export default ToDoItem;