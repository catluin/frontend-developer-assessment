import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from '../App';
import { addToDo, getToDoItems, markAsCompleted } from "../services/api";

jest.mock("../services/api");

describe("App", () => {
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

  const renderApp = () => render(<App />);

  it('Should render correctly', () => {
    renderApp();
    const appHeader = screen.getByTestId("appHeader");
    const descriptionInput = screen.getByTestId("descriptionInput");
    const refreshButton = screen.getByTestId("refreshButton");
    const footerElement = screen.getByText(/clearpoint.digital/i);

    expect(appHeader).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(refreshButton).toBeInTheDocument();
    expect(footerElement).toBeInTheDocument();
  });

  it("Should fetch todo items on render", async () => {
    getToDoItems.mockResolvedValue({ success: true, data: todoItems });

    renderApp();
    await screen.findByText(todoItemA.description);

    expect(getToDoItems).toBeCalled();
  });

  it("Should fetch todo items when todo item is added", async () => {
    const user = userEvent.setup();
    getToDoItems.mockResolvedValue({ success: true, data: todoItems });
    addToDo.mockResolvedValue({ success: true });

    renderApp();
    await screen.findByText(todoItemA.description);
    const descriptionInput = screen.getByTestId("descriptionInput");
    const addButton = screen.getByTestId("addButton");

    await user.type(descriptionInput, "todo");
    expect(descriptionInput).toHaveAttribute("value", "todo");
    await user.click(addButton);

    expect(getToDoItems).toBeCalledTimes(2);
  });

  it("Should fetch todo items when todo item is marked as completed", async () => {
    const user = userEvent.setup();
    getToDoItems.mockResolvedValue({ success: true, data: todoItems });
    markAsCompleted.mockResolvedValue({ success: true });

    renderApp();
    await screen.findByText(todoItemA.description);

    const [markAsCompletedButton] = screen.getAllByTestId("markAsCompletedButton");
    await user.click(markAsCompletedButton);

    expect(getToDoItems).toBeCalledTimes(2);
  });

  it("Should set the error when it happens", async () => {
    const user = userEvent.setup();
    getToDoItems.mockResolvedValue({ success: true, data: todoItems });
    markAsCompleted.mockResolvedValue({ success: false, error: "Boom" });

    renderApp();
    await screen.findByText(todoItemA.description);

    const [markAsCompletedButton] = screen.getAllByTestId("markAsCompletedButton");
    await user.click(markAsCompletedButton);

    const errorMessage = await screen.findByTestId("errorMessage");
    expect(errorMessage).toHaveTextContent("Error: Boom");
  });

  it("Should clean up error on refresh", async () => {
    const user = userEvent.setup();
    getToDoItems.mockResolvedValue({ success: true, data: todoItems });
    markAsCompleted.mockResolvedValue({ success: false, error: "Boom" });

    renderApp();
    await screen.findByText(todoItemA.description);

    const [markAsCompletedButton] = screen.getAllByTestId("markAsCompletedButton");
    await user.click(markAsCompletedButton);

    const errorMessage = await screen.findByTestId("errorMessage");
    expect(errorMessage).toHaveTextContent("Error: Boom");

    const refreshButton = await screen.findByTestId("refreshButton");
    await user.click(refreshButton);

    expect(screen.queryByTestId("errorMessage")).not.toBeInTheDocument();
  });
});