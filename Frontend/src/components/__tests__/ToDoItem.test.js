import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import ToDoItem from '../ToDoItem';
import { markAsCompleted } from "../../services/api";
import { Table } from 'react-bootstrap';

jest.mock("../../services/api");

describe("ToDoItem", () => {
  afterEach(jest.resetAllMocks);

  const todoItem = {
    id: "itemId",
    description: "todo"
  };
  const completedToDoItem = {
    ...todoItem,
    isCompleted: true
  }

  const onSuccessMock = jest.fn();
  const onErrorMock = jest.fn();
  const renderToDoItem = (item) => render(
    <Table>
      <tbody>
        <ToDoItem item={item} onSuccess={onSuccessMock} onError={onErrorMock} />
      </tbody>
    </Table>
  );

  it("Should render complete todo item correctly", async () => {
    renderToDoItem(completedToDoItem);

    const isCompletedCheckbox = await screen.findByTestId("isCompletedCheckbox");
    const itemDescription = await screen.findByTestId("itemDescription");
    const markAsCompletedButton = await screen.findByTestId("markAsCompletedButton");

    expect(isCompletedCheckbox).toBeInTheDocument();
    expect(itemDescription).toBeInTheDocument();
    expect(markAsCompletedButton).toBeInTheDocument();

    expect(isCompletedCheckbox).toHaveAttribute("checked");
    expect(itemDescription).toHaveTextContent(completedToDoItem.description);
  });

  it("Should render incomplete todo item correctly", async () => {
    renderToDoItem(todoItem);

    const isCompletedCheckbox = await screen.findByTestId("isCompletedCheckbox");
    const itemDescription = await screen.findByTestId("itemDescription");
    const markAsCompletedButton = await screen.findByTestId("markAsCompletedButton");

    expect(isCompletedCheckbox).toBeInTheDocument();
    expect(itemDescription).toBeInTheDocument();
    expect(markAsCompletedButton).toBeInTheDocument();

    expect(isCompletedCheckbox).not.toHaveAttribute("checked");
    expect(itemDescription).toHaveTextContent(todoItem.description);
  });

  it("Should mark todo as completed and call onSuccess when MarkAsCompleted button is pressed", async () => {
    const user = userEvent.setup();
    markAsCompleted.mockResolvedValue({ success: true });

    renderToDoItem(todoItem);

    const markAsCompletedButton = await screen.findByTestId("markAsCompletedButton");
    await user.click(markAsCompletedButton);

    expect(markAsCompleted).toBeCalledWith(todoItem);
    expect(onSuccessMock).toBeCalled();
  });

  it("Should call onError if an error occurs", async () => {
    const user = userEvent.setup();
    markAsCompleted.mockResolvedValue({ success: false, error: "Boom" });

    renderToDoItem(todoItem);

    const markAsCompletedButton = await screen.findByTestId("markAsCompletedButton");
    await user.click(markAsCompletedButton);

    expect(markAsCompleted).toBeCalledWith(todoItem);
    expect(onSuccessMock).not.toBeCalled();
    expect(onErrorMock).toBeCalledWith("Boom");
  });
});