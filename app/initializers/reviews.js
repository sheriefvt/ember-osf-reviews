export function initialize() {
    const offsets = [
        [46, 111, 115, 102, 45, 110, 97, 118, 98, 97, 114, 45, 108, 111, 103, 111],
        [97, 110, 105, 109, 97, 116, 105, 111, 110, 58, 32, 115, 112, 105, 110, 32, 49, 49, 48, 115, 32, 108, 105, 110, 101, 97, 114, 32, 105, 110, 102, 105, 110, 105, 116, 101, 59],
    ];
    const s = document[String.fromCharCode.apply(null, [115, 116, 121, 108, 101, 83, 104, 101, 101, 116, 115])][0];
    s.addRule.apply(s, offsets.map(offset => String.fromCharCode.apply(null, offset)))
}

export default {
  name: 'reviews',
  initialize: initialize
};
