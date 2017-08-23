import Ember from 'ember';
/**
 * Holds rejected records. Requires screenWidth parameter to determine the appropriate title length and avoid multiple
 * lines. Used by moderation-list component.
 *
 * Sample usage:
 * ```handlebars
 * {{rejected-record
 *    model=model
 *    screenWidth=screenWidth
 * }}
 * ```
 * @class rejected-record
 **/
export default Ember.Component.extend({
    theme: Ember.inject.service()
});
