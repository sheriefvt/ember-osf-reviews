import Ember from 'ember';
/**
 * Holds accepted records. Requires screenWidth parameter to determine the appropriate title length and avoid multiple
 * lines. Used by moderation-list component.
 *
 * Sample usage:
 * ```handlebars
 * {{accepted-record
 *    model=model
 *    screenWidth=screenWidth
 * }}
 * ```
 * @class accepted-record
 **/
export default Ember.Component.extend({
    theme: Ember.inject.service()
});
