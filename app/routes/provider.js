import Ember from 'ember';
import queryParamsMixin from '../mixins/query-params-mixin'

/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class Provider Route Handler
 */
export default Ember.Route.extend(queryParamsMixin, {
    theme: Ember.inject.service(),
    active: 'Moderation',
    beforeModel(transition) {
        const {slug = ''} = transition.params.provider;
        const slugLower = slug.toLowerCase();
        const upstreamPromise = this._super();
        this.store.find('preprint-provider', slugLower).then((provider) =>{
            this.set('theme.id', provider.id);
            this.set('filter.provider', provider.id);
        }).catch(() =>{
            this.replaceWith('page-not-found')
        });
        return Ember.RSVP.resolve(upstreamPromise)
            .then(function() {
                return new Ember.RSVP.Promise(function(resolve) {
                    setTimeout(function() {
                        resolve();
                    }, 500);
                });
            });
    },
    model(params) {
        delete params['page'];
        return Ember.RSVP.hash({
            acceptedPreprints: this.store.query('preprint', Object.assign({'filter[reviews_state]': 'accepted'}, params))
                .then((results) => {
                    return {
                        records: results,
                        meta: results.get('meta')
                    };
            }),
            rejectedPreprints: this.store.query('preprint', Object.assign({'filter[reviews_state]': 'rejected'}, params))
                .then((results) => {
                    return {
                        records: results,
                        meta: results.get('meta')
                    };
            }),
            pendingPreprints: this.store.query('preprint', Object.assign({'filter[reviews_state]': 'pending'}, params))
                .then((results) => {
                    return {
                        records: results,
                        meta: results.get('meta')
                    };
            }),
        });
    }
})
