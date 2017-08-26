import Ember from 'ember';
/**
 * Provides a list of pending, accepted, and rejected preprints. Provides filtering by preprint state and sorting based
 * on the preprint creation date. If number of records in each type exceeds 10, pagination is enabled. Current page for
 * each state is tracked and used by the paginator using the added pager service . Pagination is using the
 * pagination-pager addon (source: https://github.com/knownasilya/pagination-pager).
 *
 * Sample usage:
 * ```handlebars
 * {{moderation-list
 *    model=model
 * }}
 * ```
 * @class moderation-list
 **/
export default Ember.Component.extend({
    store: Ember.inject.service(),
    theme: Ember.inject.service(),
    pager: Ember.inject.service(),
    screenWidth: 0,
    loading: false,
    sortType: 'date_created',
    sortOptions: Ember.computed( function() { // Sort options for moderation list
        return ['Oldest', 'Newest'];
    }),
    didInsertElement: function() {
        this._super(...arguments);
        this.set('screenWidth', Math.round(Ember.$('.table tr').width() / 12));
        Ember.$('.table tr').css('display', 'none');
        const activeButton = this.get('pager.activeButton');
        this.set('buttonType', activeButton);
        Ember.$('.btn-toolbar button[data-target="' + activeButton + '"]').addClass('activated');
        Ember.$('.table tr[data-status="' + activeButton + '"]').fadeIn('fast');
    },
    actions: {
        buttonPressed: function(target){
            Ember.$('.btn-toolbar button[data-target="' +  this.get('pager.activeButton') + '"]').removeClass('activated');
            this.set('buttonType', target);
            this.set('pager.activeButton', target);
            Ember.$('.table tr').css('display', 'none');
            Ember.$('.table tr[data-status="' + target + '"]').fadeIn('fast');
        },
        sortSelected: function (type) {
            this.set('pager.sort', type);
            this.set('sortType', type);
            this.send('pageChanged', 1);
        },
        pageChanged: function (current) {
            this.set('loading', true);
            const state = this.get('buttonType');
            this.set('pager.page', current);
            this.set('pager.filter.provider', this.get('theme.id'));
            this.set('pager.filter', {'provider': this.get('theme.id'), 'reviews_state': state});
            this.set('pager.'+ state +'page', current);
            this.set('pager.sort', this.get('sortType'));
            this.get('store').query('preprint', this.get('pager'))
                .then((results) => {
                    const records = 'model.'+ state +'Preprints.records';
                    this.set(records, results);
            }).then(() => {
                this.send('buttonPressed', state);
                this.set('loading', false);
                Ember.$('window').history.pushState("object or string", "Title", window.location.href.substring(window.location.href).split("?")[0]);
            });
        }
    }
});
