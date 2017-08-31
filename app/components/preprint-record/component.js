import Ember from 'ember';
/**
 * Holds preprint records. Requires screenWidth parameter to determine the appropriate title length and avoid multiple
 * lines. Used by moderation-list component.
 *
 * Sample usage:
 * ```handlebars
 * {{preprint-record
 *    model=model
 *    screenWidth=screenWidth
 * }}
 * ```
 * @class accepted-record
 **/
export default Ember.Component.extend({
    theme: Ember.inject.service(),
    preprintRecords: Ember.computed('data', 'type', function () {
        const type = this.get('type');
        return type == 'accepted' ? this.get('data.acceptedPreprints.records') : type == 'pending' ?
                this.get('data.pendingPreprints.records') : this.get('data.rejectedPreprints.records')
    }),
    iconClass: Ember.computed('type', function () {
        const type = this.get('type');
        return type == 'accepted' ? "fa fa-check-circle-o fa-lg" : type == 'pending' ?
                "fa fa-hourglass-o fa-lg" : "fa fa-times-circle-o fa-lg"
    })
});
