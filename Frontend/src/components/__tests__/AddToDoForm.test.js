import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import AddToDoForm from '../AddToDoForm';
import { addToDo } from "../../services/api";

jest.mock("../../services/api");

describe("AddToDoForm", () => {
  afterEach(jest.resetAllMocks);

  const onSuccessMock = jest.fn();
  const renderAddToDoForm = () => render(<AddToDoForm onSuccess={onSuccessMock} />);

  it("Should render correctly", async () => {
    renderAddToDoForm();

    const header = await screen.findByTestId("addToDoHeader");
    const descriptionInput = await screen.findByTestId("descriptionInput");
    const addButton = await screen.findByTestId("addButton");
    const clearButton = await screen.findByTestId("clearButton");

    expect(header).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  it("Should clear todo description when Clear button is pressed", async () => {
    const user = userEvent.setup();

    renderAddToDoForm();

    const descriptionInput = await screen.findByTestId("descriptionInput");
    const clearButton = await screen.findByTestId("clearButton");

    await user.type(descriptionInput, "todo");
    expect(descriptionInput).toHaveAttribute("value", "todo");
    await user.click(clearButton);

    expect(descriptionInput).toHaveAttribute("value", "");
  });

  it("Should add todo and call onSuccess when Add button is pressed", async () => {
    const user = userEvent.setup();
    addToDo.mockResolvedValue({ success: true });

    renderAddToDoForm();

    const descriptionInput = await screen.findByTestId("descriptionInput");
    const addButton = await screen.findByTestId("addButton");

    await user.type(descriptionInput, "todo");
    expect(descriptionInput).toHaveAttribute("value", "todo");
    await user.click(addButton);

    expect(addToDo).toBeCalledWith({ description: "todo" });
    expect(descriptionInput).toHaveAttribute("value", "");
    expect(onSuccessMock).toBeCalled();
  });

  it("Should display an error message if an error occurs", async () => {
    const user = userEvent.setup();
    addToDo.mockResolvedValue({ success: false, error: "Boom" });

    renderAddToDoForm();

    const descriptionInput = await screen.findByTestId("descriptionInput");
    const addButton = await screen.findByTestId("addButton");

    await user.type(descriptionInput, "todo");
    expect(descriptionInput).toHaveAttribute("value", "todo");
    await user.click(addButton);

    expect(addToDo).toBeCalledWith({ description: "todo" });
    expect(descriptionInput).toHaveAttribute("value", "todo");
    expect(onSuccessMock).not.toBeCalled();

    const errorMessage = await screen.findByTestId("errorMessage");
    expect(errorMessage).toHaveTextContent("Error: Boom");
  });
});