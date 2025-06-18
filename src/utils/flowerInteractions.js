const flowerStateMap = new Map();

const DEFAULT_STATE = {
  hydration: 0,
  trample: 0,
  status: "neutral",
  baseStemHeight: null,
  stemHeight: null,
};

function initState(seed) {
  const baseStemHeight = Math.floor(Math.random() * 40) + 30; // 30–70
  const newState = {
    ...DEFAULT_STATE,
    baseStemHeight,
    stemHeight: baseStemHeight,
  };
  flowerStateMap.set(seed, newState);
  return newState;
}

export function waterFlower(seed) {
  const state = flowerStateMap.get(seed) || initState(seed);

  state.hydration = Math.min(state.hydration + 1, 10);
  state.stemHeight = Math.min(state.stemHeight + 2, 100); // Grow up to 100
  state.status = "happy";

  flowerStateMap.set(seed, state);
  return state;
}

export function trampleFlower(seed) {
  const state = flowerStateMap.get(seed) || initState(seed);

  state.trample += 1;
  state.stemHeight = Math.max(state.stemHeight - 3, 5); // Shrink no lower than 5
  state.status = "flattened";

  flowerStateMap.set(seed, state);
  return state;
}

export function getFlowerStatus(seed) {
  const state = flowerStateMap.get(seed) || initState(seed);
  return state;
}
