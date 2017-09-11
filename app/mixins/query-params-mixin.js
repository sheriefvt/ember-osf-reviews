import Ember from 'ember';

export default Ember.Mixin.create({
    queryParams:  Ember.computed(function() {
        return ['page', 'limit', 'embed', 'sort', 'filter'];
    }),
    page: 1,  //initial page number
    limit: 10,  //number of records per page
    sort: 'date_created',  //default sort by date_created ascending
    filter: {},
    embed: 'node',
    buttonType: 'pending', //current filter button clicked by user (accepted, pending, or rejected)
    acceptedpage: 1,  //keep track of current page for accepted list
    pendingpage: 1, //keep track of current page for pending list
    rejectedpage: 1,    //keep track of current page for rejected list
    params:  Ember.computed('page', 'sort', 'filter', 'embed', 'limit', 'filter', function() {
        return {'page': this.get('page'), 'limit':this.get('limit'), 'embed':this.get('embed'), 'sort':this.get('sort'),
            'filter':this.get('filter')};
    }),
});
