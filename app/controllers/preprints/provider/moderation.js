import Controller from '@ember/controller';
import Analytics from 'ember-osf/mixins/analytics';

export default Controller.extend(Analytics, {
    queryParams: ['page', 'sort', 'status'],
    page: 1,
    status: 'pending',
    sort: '-date_last_transitioned',
    loading: true,

    actions: {
        statusChanged(status) {
            this.setProperties({
                status,
                page: 1,
                loading: true,
            });
        },
        pageChanged(page) {
            this.setProperties({
                page,
                loading: true,
            });
            this.get('metrics')
                .trackEvent({
                    category: 'button',
                    action: 'click',
                    label: `Moderation List - Request page ${this.get('page')}  of  ${this.get('status')}  list`,
                });
        },
        sortChanged(sort) {
            this.setProperties({
                sort,
                page: 1,
                loading: true,
            });
        },
    },
});
