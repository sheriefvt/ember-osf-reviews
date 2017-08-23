import Ember from 'ember';
/**
 * Holds pending records. Requires screenWidth parameter to determine the appropriate title length and avoid multiple
 * lines. Used by moderation-list component.
 *
 * Sample usage:
 * ```handlebars
 * {{pending-record
 *    model=model
 *    screenWidth=screenWidth
 * }}
 * ```
 * @class pending-record
 **/
export default Ember.Component.extend({
    theme: Ember.inject.service()
});
