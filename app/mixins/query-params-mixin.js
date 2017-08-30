import Ember from 'ember';

export default Ember.Mixin.create({
    queryParams:  Ember.computed(function() {
        return ['page', 'limit', 'embed', 'sort', 'filter'];
    }),
    page: 1,
    limit: 10,
    activeButton: 'pending',
    sort: 'date_created',
    filter: {},
    embed: 'node',
    params:  Ember.computed('page', 'sort', 'filter', 'embed', 'limit', function() {
        return {'page': this.get('page'), 'limit':this.get('limit'), 'embed':this.get('embed'), 'sort':this.get('sort'),
            'filter':this.get('filter')};
    }),
});
