import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';
import AddToDoForm from './components/AddToDoForm';
import ToDoTable from './components/ToDoTable';
import Header from './components/Header';
import Footer from './components/Footer';
import { getToDoItems } from './services/api';

/*
Changes made to the project:
- Component breakdown
- Added functionality to mark todo item as completed
- Added functionality to dispaly error messages
- Added functionality to auto refresh todo list when any changes are made (it wasn't a requirement but it makes a better user experience)
- Added unit tests for components with the most business logic in them

Other changes I would make to the project that require a bit more effort:
- Storybook, to allow devs to develop and test new components easily
- Playwright, to have a set of automated end-to-end tests
- All string values could be extracted into lang files to support multiple languages in the future
- Header, Footer and ErrorMessage component should be unit tested too. I've omitted those tests because there is not much business logic happening in those components but in the real project everything should be tested.
*/

const getItems = async ({ setItems, setError }) => {
  const result = await getToDoItems();
  if (!result) { return; }
  const { success, data, error } = result;
  if (success) {
    setItems(data);
    return;
  }
  if (error) {
    setError(error);
  }
};

const App = () => {
  // Parent component is responsible for fetching items to make it possible to auto-refresh once item is added or marked as completed
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getItems({ setItems, setError });
  }, [setItems, setError]);

  const onRefresh = useCallback(() => {
    setError("");
    getItems({ setItems, setError });
  }, [setError]);

  const renderAddTodoItemContent = () => {
    return <AddToDoForm data-testid="addToDoForm" onSuccess={onRefresh} />;
  };

  const renderTodoItemsContent = () => {
    return <ToDoTable items={items} refreshItems={onRefresh} error={error} onError={setError} />;
  };

  return (
    <div className="App">
      <Container>
        {/* Extracted Header and Footer sections as components for readability */}
        <Header />
        <Row>
          <Col>{renderAddTodoItemContent()}</Col>
        </Row>
        <br />
        <Row>
          <Col>{renderTodoItemsContent()}</Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default App;
