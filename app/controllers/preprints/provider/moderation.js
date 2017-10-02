import Ember from 'ember';
import Analytics from 'ember-osf/mixins/analytics';

export default Ember.Controller.extend(Analytics, {
    queryParams: ['page', 'sort', 'status'],
    page: 1,
    status: 'pending',
    sort: '-date_last_transitioned',

    actions: {
        statusChanged(status) {
            this.set('status', status);
            this.set('page', 1);
        },
        pageChanged(page) {
            this.set('page', page);
            Ember.get(this, 'metrics')
                .trackEvent({
                    category: 'button',
                    action: 'click',
                    label: `Request page ` + this.get('page') + ` of ` + this.get('status') + ` list`
                });
        },
        sortChanged(sort) {
            this.set('sort', sort);
            this.set('page', 1);
        },
    }
});
