function ErrorView({ retry }) {
  const handleRetry = () => {
    retry();
  };
  return (
    <div className="flex flex-col p-4 h-auto">
      <h1 className="mx-auto text-xl font-bold">Oops! 🙈</h1>
      <h2 className="mt-2 text-center">
        We ran into a little trouble loading your photo(s). Please click the
        button to try again.
      </h2>
      <button
        className="mt-4 mx-auto px-2 py-2 w-1/2 md:w-1/4 bg-red-500 text-white font-semibold border border-red-700 hover:bg-red-600 transition duration-200"
        onClick={handleRetry}
      >
        Retry
      </button>
    </div>
  );
}

export default ErrorView;
