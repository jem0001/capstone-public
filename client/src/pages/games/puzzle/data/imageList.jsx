/**
 * List of image files names available as puzzle image
 * @type {string[]}
 */
export const imageList = [
  "cliff-cove",
  "creek-hike",
  "dog-field",
  "dublin-library",
  "elephants",
  "fruit-basket",
  "hill-city-sea",
  "inside-wood-cabin",
  "irish-scene-ruin-field",
  "mountain-beach-creek",
  "mountain-lake",
  "night-city",
  "old-building-court",
  "old-phone-stamps",
  "river-cliffs",
  "rock-sea-flowers",
  "rocky-desert",
  "seals-rock",
  "subway",
  "temple-bar",
  "tiger",
  "tropical-mangrove",
  "walk-bridge-forest",
  "waterfall-pond",
  "wood-stairs-outdoor",
];

/**
 * Selects a random puzzle image filename
 * @param {string[]} [exclude] optional list of files to exclude from the list of available images
 * @returns {string} filename of a image file
 */
// export const pickRandomImage = (exclude = []) => {
//   const subList = imageList.filter((img) => !exclude.includes(img));
//   return subList[Math.floor(Math.random() * subList.length)];
// };

export const pickRandomImage = (exclude = []) => {
  return imageList[0];
};
