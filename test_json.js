const data = {
  character: {
    name: 'Zloprcek Smrťák',
    race: 'Půlčík',
    dnd_class: 'Hraničář',
    history: [],
    state: {},
    stats: {}
  }
};
const state = data.character.state || {};
const journal = state.journal || [];
console.log(journal);
