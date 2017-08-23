import Ember from 'ember';
/**
 * Shorten the preprint title to avoid multiple lines and append three dots at the end of sting.
 *
 * Sample usage:
 * ```handlebars
 * {{shorten-text  'sample text' screenWidth'}}
 * ```
 * @class shorten-text
 **/
export function shortenText(params/*, hash*/) {
  return (params[0].length > params[1]) ? params[0].substr(0, params[1] - 2) + '...' : params[0];
}

export default Ember.Helper.helper(shortenText);
