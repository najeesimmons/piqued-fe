import React from "react";

function NoResultsView() {
  return (
    <div className="flex flex-col p-4 h-auto bg-white">
      <h1 className="mx-auto text-xl font-bold">Oops! 🙈</h1>
      <h2 className="mt-2 text-center">
        There were no results for this search. Try something new!
      </h2>
    </div>
  );
}

export default NoResultsView;
