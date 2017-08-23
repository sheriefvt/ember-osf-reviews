import Ember from 'ember';
import config from 'ember-get-config';

const providers = config.Reviews.providers.slice(1);
const providerIds = providers.map(p => p.id);

/**
 * @module ember-osf-reviews
 * @submodule routes
 */

/**
 * @class Provider Route Handler
 */
export default Ember.Route.extend({
    theme: Ember.inject.service(),
    params: Ember.inject.service('pager'),

    // Todo: Replace the use of hardcoded preprint provider list with an API request.

    beforeModel(transition) {
        const {slug = ''} = transition.params.provider;
        const slugLower = slug.toLowerCase();
        this.set('theme.id', slugLower);
        if (providerIds.includes(slugLower)) {
            if (slugLower !== slug) {
                const {pathname} = window.location;
                const pathRegex = new RegExp(`^/preprints/${slug}`);
                window.location.pathname = pathname.replace(pathRegex, `/preprints/${slugLower}`);
            }
        } else {
            this.replaceWith('page-not-found');
        }
    },
    model(params) {
        params["filter[provider]"] = this.get('theme.id');
        delete params["page"];
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
