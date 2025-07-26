function NoResultsView({ type = "search" }) {
  return (
    <div className="flex flex-col p-4 h-auto bg-white">
      <h1 className="mx-auto text-xl font-bold">Oops! 🙈</h1>
      {type === "search" && (
        <h2 className="mt-2 text-center">
          There were no results for this search. Try something new!
        </h2>
      )}

      {type === "favorites" && (
        <h2 className="mt-2 text-center">
          You have not favorited any photos yet. Go find some photos
          that&apos;ll Pique your intererst!
        </h2>
      )}
    </div>
  );
}

export default NoResultsView;
