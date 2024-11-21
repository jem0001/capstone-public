const convertPathsToJSON = () => {
  const paths = document.querySelectorAll("svg path");
  const pathData = [];

  paths.forEach((path) => {
    const pathAttributes = {
      d: path.getAttribute("d"),
      fill: path.getAttribute("fill"),
      stroke: path.getAttribute("stroke"),
      "stroke-width": path.getAttribute("stroke-width"),
      // Add more attributes as needed
    };

    pathData.push(pathAttributes);
  });

  return pathData;
};

export const renameGameTitle = (name) => {
  let newName = "default";
  switch (name) {
    case "puzzle":
      newName = "Piece It Up";
      break;

    case "map":
      newName = "Explore Pilipinas";
      break;

    case "family-feud":
      newName = "Classroom Clash";
      break;

    case "non-flip-easy":
      newName = "Memory Shuffle (EASY)";
      break;

    case "non-flip-hard":
      newName = "Memory Shuffle (HARD)";
      break;

    case "flip":
      newName = "Pair Up";
      break;

    case "hangman":
      newName = "Word Detectives";
      break;

    case "drag-and-learn":
      newName = "Drag And Learn";
      break;

    default:
      break;
  }

  return newName;
};
