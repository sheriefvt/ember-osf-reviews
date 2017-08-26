import Ember from 'ember';

export default Ember.Controller.extend({
    pager: Ember.inject.service(),
    queryParams:['page', 'limit', 'embed', 'sort', 'filter'],
    page: Ember.computed.alias('pager.page'),
    limit: Ember.computed.alias('pager.limit'),
    sort: Ember.computed.alias('pager.sortType'),
    filter: Ember.computed.alias('pager.filter'),
    embed: 'node',
});
