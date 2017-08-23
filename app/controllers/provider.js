import Ember from 'ember';

export default Ember.Controller.extend({
    pager: Ember.inject.service(),
    queryParams:['page', 'limit', 'embed', 'sort'],
    page: Ember.computed.alias('pager.page'),
    limit: Ember.computed.alias('pager.limit'),
    embed: 'node',
    sort: Ember.computed.alias('pager.sort'),
});
