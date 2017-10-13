import Ember from 'ember';

export default Ember.Route.extend({
    currentUser: Ember.inject.service(),
    session: Ember.inject.service(),
    store: Ember.inject.service(),

    queryParams: {
        page: { refreshModel: true }
    },

    model() {
        const emptyModels = {
            providers: [],
            actionsList: []
        };

        if (!this.get('session.isAuthenticated')) {
            return emptyModels;
        }
        return Ember.RSVP.hash({
            providers: this.get('store').query('preprint-provider', {
                'filter[permissions]': 'view_actions,set_up_moderation'
            }),
            user: this.get('currentUser.user').then(user => {
                return user
            }),
            }).catch(() => {
             return emptyModels;
        });  // On any error, assume no permissions to anything.
    },
});
