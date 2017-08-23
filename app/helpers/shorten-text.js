import Ember from 'ember';

export function shortenText(params/*, hash*/) {
  return (params[0].length > params[1]) ? params[0].substr(0, params[1] - 2) + '...' : params[0];
}

export default Ember.Helper.helper(shortenText);
