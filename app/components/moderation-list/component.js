import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    params: Ember.inject.service('pager'),
    theme: Ember.inject.service(),
    loading: false,
    screenWidth: 0,
    sortOptions: Ember.computed( function() { // Sort options for moderation list
        return ['Oldest', 'Newest'];
    }),
    didInsertElement: function() {
        this._super(...arguments);
        this.set('screenWidth',  Math.round(Ember.$(window).width() / 14));
        Ember.$('.table tr').css('display', 'none');
        this.set('buttonType', this.get('params').getButton());
        Ember.$('.btn-toolbar button[data-target="' + this.get('params').getButton() + '"]').addClass('activated');
        Ember.$('.table tr[data-status="' + this.get('params').getButton() + '"]').fadeIn('fast');
    },
    actions: {
        buttonPressed: function(target){
            Ember.$('.btn-toolbar button[data-target="' + this.get('params').getButton() + '"]').removeClass('activated');
            this.set('buttonType', target);
            this.get('params').setButton(target);
            Ember.$('.table tr').css('display', 'none');
            Ember.$('.table tr[data-status="' + target + '"]').fadeIn('fast');
        },
        sortSelected: function (type) {
            if (type == 'newest'){
                console.log('new');
                Ember.$(".checknew").addClass('fa fa-check');
                Ember.$(".checkold").removeClass('fa fa-check');
                this.get('params').setDesc();
                this.send('pageChanged', 1);
            } else {
                console.log('old');
                Ember.$(".checkold").addClass('fa fa-check');
                Ember.$(".checknew").removeClass('fa fa-check');
                this.get('params').setAsc();
                this.send('pageChanged', 1);
            }
        },
        pageChanged: function (current) {
            this.set('loading', true);
            const state = this.get('buttonType');
            this.get('params').setPage(current, state);
            let requestParams = this.get('params');
            requestParams["filter[provider]"] = this.get('theme.id');
            requestParams['filter[reviews_state]'] = state;
            requestParams['embed'] = 'node';
            this.get('store').query('preprint', requestParams)
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
