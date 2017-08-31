import Ember from 'ember';
import queryParamsMixin from '../../mixins/query-params-mixin'

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
export default Ember.Component.extend(queryParamsMixin, {
    store: Ember.inject.service(),
    theme: Ember.inject.service(),
    i18n: Ember.inject.service(),
    screenWidth: 0,
    loading: false,
    sortType: 'date_created',
    sortOptions: Ember.computed('i18n.local', function() { // Sort options for moderation list
        const i18n = this.get('i18n');
        return [i18n.t('moderation_list.oldest'), i18n.t('moderation_list.newest')];
    }),
    pageCount: Ember.computed('model', 'buttonType', function () {
        const type = this.get('buttonType');
        return this.get('model.' +type+ 'Preprints.meta.total');
    }),
    currentPage: Ember.computed('buttonType', 'pendingpage', 'acceptedpage', 'rejectedpage', function () {
        const type = this.get('buttonType');
        return this.get(type+ 'page');
    }),
    didInsertElement: function() {
        this._super(...arguments);
        this.set('screenWidth', Math.round(Ember.$('.table tr').width() / 12));
        Ember.$('.table tr').css('display', 'none');
        const activeButton = this.get('activeButton');
        this.set('buttonType', activeButton);
        Ember.$('.btn-toolbar button[data-target="' + activeButton + '"]').addClass('activated');
        Ember.$('.table tr[data-status="' + activeButton + '"]').fadeIn('fast');
    },
    actions: {
        buttonPressed: function(target){
            Ember.$('.btn-toolbar button[data-target="' +  this.get('activeButton') + '"]').removeClass('activated');
            this.set('buttonType', target);
            this.set('activeButton', target);
            Ember.$('.table tr').css('display', 'none');
            Ember.$('.table tr[data-status="' + target + '"]').fadeIn('fast');
        },
        sortSelected: function (type) {
            this.set('sort', type);
            this.set('sortType', type);
            this.send('pageChanged', 1);
        },
        pageChanged: function (current) {
            this.set('loading', true);
            const state = this.get('buttonType');
            this.set('page', current);
            this.set('filter', {'provider': this.get('theme.id'), 'reviews_state': state});
            this.set(state +'page', current);
            this.set('sort', this.get('sortType'));
            this.get('store').query('preprint', this.get('params'))
            .then((results) => {
                const records = 'model.'+ state +'Preprints.records';
                this.set(records, results);
            }).then(() => {
                this.send('buttonPressed', state);
                this.set('loading', false);
            });
        }
    }
});
