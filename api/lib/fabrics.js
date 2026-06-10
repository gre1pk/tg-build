const fabricsData = require('../../data/fabrics.json');

function loadFabrics() {
  return fabricsData;
}

function getFabricById(id) {
  return loadFabrics().find((fabric) => fabric.id === id) ?? null;
}

module.exports = { loadFabrics, getFabricById };
