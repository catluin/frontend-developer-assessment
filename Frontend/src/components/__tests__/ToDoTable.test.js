import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import ToDoTable from '../ToDoTable';
import { markAsCompleted } from "../../services/api";

jest.mock("../../services/api");

describe("ToDoTable", () => {
  afterEach(jest.resetAllMocks);

  const todoItemA = {
    id: "itemIdA",
    description: "todoA"
  };

  const todoItemB = {
    id: "itemIdB",
    description: "todoB",
    isCompleted: true
  };
  const todoItems = [todoItemA, todoItemB];

  const refreshItemsMock = jest.fn();
  const onErrorMock = jest.fn();
  const renderToDoTable = ({ error } = {}) => render(<ToDoTable items={todoItems} refreshItems={refreshItemsMock} onError={onErrorMock} error={error} />);

  it("Should render todo items table correctly", async () => {
    renderToDoTable();

    const tableRowA = await screen.findByText(todoItemA.description);
    const tableRowB = await screen.findByText(todoItemB.description);
    const refreshButton = await screen.findByTestId("refreshButton");

    expect(tableRowA).toBeInTheDocument();
    expect(tableRowB).toBeInTheDocument();
    expect(refreshButton).toBeInTheDocument();
  });

  it("Should call refreshItems when Refresh button is pressed", async () => {
    const user = userEvent.setup();

    renderToDoTable();

    const refreshButton = await screen.findByTestId("refreshButton");
    await user.click(refreshButton);

    expect(refreshItemsMock).toBeCalled();
  });

  it("Should call refreshItems when todo item is marked as completed", async () => {
    const user = userEvent.setup();
    markAsCompleted.mockResolvedValue({ success: true });

    renderToDoTable();

    const [markAsCompletedButton] = await screen.findAllByTestId("markAsCompletedButton");
    await user.click(markAsCompletedButton);

    expect(refreshItemsMock).toBeCalled();
  });

  it("Should display error correctly", async () => {
    renderToDoTable({ error: "Boom" });

    const errorMessage = await screen.findByTestId("errorMessage");
    expect(errorMessage).toHaveTextContent("Error: Boom");
  });

  it("Should call onError if an error occurs in a todoItem component", async () => {
    const user = userEvent.setup();
    markAsCompleted.mockResolvedValue({ success: false, error: "Boom" });

    renderToDoTable();

    const [markAsCompletedButton] = await screen.findAllByTestId("markAsCompletedButton");
    await user.click(markAsCompletedButton);

    expect(onErrorMock).toBeCalledWith("Boom");
  });
});