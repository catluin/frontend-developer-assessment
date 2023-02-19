import { Button, Container, Row, Col, Form, Stack } from 'react-bootstrap';
import React, { useState, useCallback } from 'react';
import { addToDo } from "../services/api";
import ErrorMessage from './ErrorMessage';

const AddToDoForm = (props) => {
  const { onSuccess } = props;
  const [description, setDescription] = useState('');

  // AddToDoForm manages its own errors and displays them inside.
  // Depending on the design requirements, errors may be displayed at the centralized location or as popup notifications
  // In that case error state would be maintained at the parent component and functions to set error would be passed in as props
  const [error, setError] = useState('');

  const handleClear = useCallback(() => {
    setDescription("");
  }, [setDescription]);

  const handleDescriptionChange = useCallback((event) => {
    setError("");
    setDescription(event.target.value);
  }, [setDescription, setError]);

  const handleAdd = useCallback(async () => {
    const { success, error } = await addToDo({ description });
    if (success) {
      setDescription("");
      onSuccess && onSuccess();
    }
    if (error) {
      setError(error);
    }
  }, [description, onSuccess]);

  return (
    <Container>
      <h1 data-testid="addToDoHeader">Add Item</h1>
      {error && <ErrorMessage message={error} />}
      <Form.Group as={Row} className="mb-3" controlId="formAddTodoItem">
        <Form.Label column sm="2">
          Description
        </Form.Label>
        <Col md="6">
          <Form.Control
            data-testid="descriptionInput"
            type="text"
            placeholder="Enter description..."
            value={description}
            onChange={handleDescriptionChange}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3 offset-md-2" controlId="formAddTodoItem">
        <Stack direction="horizontal" gap={2}>
          <Button data-testid="addButton" variant="primary" onClick={handleAdd}>
            Add Item
          </Button>
          <Button data-testid="clearButton" variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </Stack>
      </Form.Group>
    </Container>
  );
};

export default AddToDoForm;