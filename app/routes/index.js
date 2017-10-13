import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
    currentUser: service(),
    session: service(),
    store: service(),


    model() {
        if (!this.get('session.isAuthenticated')) {
            return this._emptyModels();
        }
        return this.get('store').query('preprint-provider', {
            'filter[permissions]': 'view_actions,set_up_moderation',
        }).catch(this._emptyModels.bind(this)); // On any error, assume no permissions to anything.
    },

    _getActions(page, user) {
        return user.query('actions', { page, include: 'target,provider' });
    },

    _emptyModels() {
        return {
            providers: [],
            actionsList: [],
        };
    },
});
