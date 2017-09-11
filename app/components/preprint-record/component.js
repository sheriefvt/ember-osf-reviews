import Ember from 'ember';
/**
 * Holds preprint records. Requires screenWidth parameter to determine the appropriate title length and avoid multiple
 * lines. Used by moderation-list component.
 *
 * Sample usage:
 * ```handlebars
 * {{preprint-record
 *    preprintRecords=preprintRecords.records
 *    screenWidth=screenWidth
 *    type=buttonType
 * }}
 * ```
 * @class accepted-record
 **/
export default Ember.Component.extend({
    theme: Ember.inject.service(),
    iconClass: {
        accepted: "fa fa-check-circle-o fa-lg",
        pending: "fa fa-hourglass-o fa-lg",
        rejected: "fa fa-times-circle-o fa-lg"
    }
});
