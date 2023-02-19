const styles = {
  errorMessage: {
    color: "red",
    marginBottom: 10
  }
}

const ErrorMessage = (props) => {
  const { message } = props;

  return <div data-testid="errorMessage" style={styles.errorMessage}>Error: {message}</div >;
};

export default ErrorMessage;