import Ember from 'ember';

/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class provider Route Handler
 */
export default Ember.Route.extend({
    theme: Ember.inject.service(),
    active: 'Moderation',
    model(params) {
        delete params['page'];
        const providerId = this.get('theme.id');
        return Ember.RSVP.hash({
            acceptedPreprints: this.store.query('preprint',
                Object.assign({'filter[reviews_state]': 'accepted', 'filter[provider]': providerId}, params))
                .then((results) => {
                    return {
                        records: results,
                        meta: results.get('meta')
                    };
                }),
            rejectedPreprints: this.store.query('preprint',
                Object.assign({'filter[reviews_state]': 'rejected', 'filter[provider]': providerId}, params))
                .then((results) => {
                    return {
                        records: results,
                        meta: results.get('meta')
                    };
                }),
            pendingPreprints: this.store.query('preprint',
                Object.assign({'filter[reviews_state]': 'pending', 'filter[provider]': providerId}, params))
                .then((results) => {
                    return {
                        records: results,
                        meta: results.get('meta')
                    };
                }),
        });
    }
})
